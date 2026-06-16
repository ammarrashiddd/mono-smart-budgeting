import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { kmeans } from "ml-kmeans";
import { saveFinancialAnalysisHistory } from "@/lib/analysisHelper";

// --- FUNGSI UTILITAS: MENGHITUNG JARAK EUCLIDEAN ---
function getEuclideanDistance(point: number[], centroid: number[]): number {
  return Math.sqrt(
    Math.pow(point[0] - centroid[0], 2) + Math.pow(point[1] - centroid[1], 2),
  );
}

// --- FUNGSI UTILITAS: MENGHITUNG WCSS NYATA ---
function calculateWCSS(
  dataPoints: number[][],
  clusters: number[],
  centroids: number[][],
): number {
  let totalWcss = 0;
  for (let i = 0; i < dataPoints.length; i++) {
    const point = dataPoints[i];
    const clusterId = clusters[i];
    const centroid = centroids[clusterId] as unknown as number[];

    if (centroid) {
      totalWcss += Math.pow(getEuclideanDistance(point, centroid), 2);
    }
  }
  return totalWcss;
}

// --- FUNGSI INTI: PIPELINE KOMPUTASI K-MEANS BULANAN ---
async function runKmeansComputation(
  userId: string,
  month: number,
  year: number,
  transactionsParam?: any[],
) {
  // Tentukan rentang tanggal awal bulan dan akhir bulan berjalan
  const awalBulan = new Date(year, month - 1, 1);
  const akhirBulan = new Date(year, month, 0, 23, 59, 59);

  // 1. Ambil data pengeluaran (amount < 0) HANYA pada bulan berjalan
  const transactions =
    transactionsParam ??
    (await prisma.transaction.findMany({
      where: {
        userId,
        amount: { lt: 0 },
        date: { gte: awalBulan, lte: akhirBulan },
      },
      // 💡 PERBAIKAN: Pastikan field 'category' ikut terambil dari database
      select: {
        id: true,
        description: true,
        amount: true,
        date: true,
        category: true, // 👈 WAJIB DISINI agar tidak undefined
        financialTargetId: true,
      },
      orderBy: { date: "asc" },
    }));

  const currentTotalTx = transactions.length;
  // Batasan proteksi skripsi agar algoritma klasterisasi valid secara statistik
  if (currentTotalTx < 5) {
    throw new Error(
      `Data transaksi pengeluaran bulan ini (${currentTotalTx}) belum mencukupi (Minimal harus 5 transaksi).`,
    );
  }

  // 2. Ekstraksi Fitur 2D (X = Hari/Tanggal, Y = Nominal Absolut)
  const rawPoints = transactions.map((tx) => {
    const day = new Date(tx.date).getDate();
    const amount = Math.abs(tx.amount);
    return [day, amount];
  });

  // Min-Max Normalization agar skala tanggal (1-31) tidak didominasi oleh skala nominal uang
  const rawAmounts = rawPoints.map((p) => p[1]);
  const maxAmount = Math.max(...rawAmounts, 1);
  const minAmount = Math.min(...rawAmounts, 0);

  const normalizedPoints = rawPoints.map(([day, amount]) => {
    const normX = (day - 1) / (31 - 1);
    const normY = (amount - minAmount) / (maxAmount - minAmount || 1);
    return [normX, normY];
  });

  // Iterasi pencarian Elbow Point (K = 1 s/d K = 6)
  const elbowData = [];
  const kmeansResults: {
    [key: number]: {
      clusters: number[];
      centroids: number[][];
      wcss: number;
    };
  } = {};
  const maxK = Math.min(6, currentTotalTx - 1); // Dinamis agar K tidak melebihi jumlah baris data

  for (let kVal = 1; kVal <= maxK; kVal++) {
    const runKmeans = kmeans(normalizedPoints, kVal, {
      initialization: "kmeans++",
    });

    const currentCentroids = runKmeans.centroids as unknown as number[][];

    const wcssValue = calculateWCSS(
      normalizedPoints,
      runKmeans.clusters,
      currentCentroids,
    );

    const roundedWcss = parseFloat(wcssValue.toFixed(4));
    elbowData.push({ k: kVal, wcss: roundedWcss });

    kmeansResults[kVal] = {
      clusters: runKmeans.clusters,
      centroids: currentCentroids,
      wcss: roundedWcss,
    };
  }

  // Otomatisasi Deteksi Tekukan Siku Matematika (Curvature)
  let optimalK = 1;
  let maxCurvature = -Infinity;

  if (maxK >= 3) {
    for (let i = 1; i < elbowData.length - 1; i++) {
      const wcssPrev = elbowData[i - 1].wcss;
      const wcssCurr = elbowData[i].wcss;
      const wcssNext = elbowData[i + 1].wcss;

      const dropSebelum = wcssPrev - wcssCurr;
      const dropSesudah = wcssCurr - wcssNext;
      const curvature = dropSebelum - dropSesudah;

      if (curvature > maxCurvature) {
        maxCurvature = curvature;
        optimalK = elbowData[i].k;
      }
    }

    // Threshold Toleransi Ambing Evaluasi Siku sebesar 5%
    if (optimalK === 2 && elbowData[2]) {
      const dropK2ToK3 = elbowData[1].wcss - elbowData[2].wcss;
      const threshold = elbowData[0].wcss * 0.05;

      if (dropK2ToK3 > threshold) {
        optimalK = 3;
      }
    }
  } else {
    optimalK = maxK; // Fallback jika transaksi sedikit
  }

  const finalKmeans = kmeansResults[optimalK];
  const finalClusters = finalKmeans.clusters;

  // Sorting Klaster secara ordinal berdasarkan rerata nominal (0 = Rutin/Kecil, dst)
  const clusterAverages = Array.from({ length: optimalK }, (_, clusterIdx) => {
    const clusterPoints = rawPoints.filter(
      (_, pointIdx) => finalClusters[pointIdx] === clusterIdx,
    );
    const avgY =
      clusterPoints.length > 0
        ? clusterPoints.reduce((sum, pt) => sum + pt[1], 0) /
          clusterPoints.length
        : 0;
    return { originalIdx: clusterIdx, avgY };
  });

  clusterAverages.sort((a, b) => a.avgY - b.avgY);

  const clusterMapping: { [key: number]: number } = {};
  clusterAverages.forEach((item, newIdx) => {
    clusterMapping[item.originalIdx] = newIdx;
  });

  // Ambil transaksi pengeluaran paling terkini untuk klaster klasifikasi berjalan
  const lastTransactionIndex = transactions.length - 1;
  const originalLastClusterId = finalClusters[lastTransactionIndex];
  const assignedCluster = clusterMapping[originalLastClusterId] ?? 0;

  // Konstruksi muatan data bersih koordinat Recharts
  const clusteredData = transactions.map((tx, index) => {
    const originalClusterId = finalClusters[index];
    const sortedClusterId = clusterMapping[originalClusterId];

    return {
      id: tx.id,
      name: tx.description,
      x: new Date(tx.date).getDate(),
      y: Math.abs(tx.amount),
      cluster: sortedClusterId,
      category: tx.category || "LAIN_LAIN", // 💡 Sertakan properti kategori di koordinat titik Recharts (bisa dipakai frontend untuk tooltip custom)
    };
  });

  const cleanElbowData = elbowData.filter((item) => item.k <= 5);

  // 🛠️ UPSERT CACHE K-MEANS
  const upsertedCache = await prisma.kmeansCache.upsert({
    where: {
      userId_month_year: {
        userId,
        month,
        year,
      },
    },
    update: {
      optimalK,
      wcss: finalKmeans.wcss,
      points: clusteredData,
      elbow: cleanElbowData,
      totalTx: currentTotalTx,
      assignedCluster,
    },
    create: {
      userId,
      month,
      year,
      optimalK,
      wcss: finalKmeans.wcss,
      points: clusteredData,
      elbow: cleanElbowData,
      totalTx: currentTotalTx,
      assignedCluster,
    },
  });

  // 🛠️ INTEGRASI UTAMA KE ASISTEN AI (GEMINI)
  // Data transactions yang dikirim ke sini sekarang dijamin membawa field 'category' hasil select di atas.
  await saveFinancialAnalysisHistory({
    userId,
    optimalK,
    assignedCluster,
    rawKmeansData: {
      wcss: finalKmeans.wcss,
      points: clusteredData,
      elbow: cleanElbowData,
      totalTx: currentTotalTx,
      month,
      year,
    },
  });

  return {
    wcss: upsertedCache.wcss,
    k: upsertedCache.optimalK,
    points: upsertedCache.points,
    elbow: upsertedCache.elbow,
  };
}

// ========================================================
// [GET] ENDPOINT: MEMBACA DATA CACHE BULANAN
// ========================================================
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const m = parseInt(
      searchParams.get("month") || String(new Date().getMonth() + 1),
    );
    const y = parseInt(
      searchParams.get("year") || String(new Date().getFullYear()),
    );

    const cachedResult = await prisma.kmeansCache.findUnique({
      where: {
        userId_month_year: {
          userId,
          month: m,
          year: y,
        },
      },
    });

    if (!cachedResult) {
      return NextResponse.json(
        { message: "Belum ada riwayat komputasi analisis untuk bulan ini." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      wcss: cachedResult.wcss,
      k: cachedResult.optimalK,
      points: cachedResult.points,
      elbow: cachedResult.elbow,
      source: "database_cache",
    });
  } catch (error) {
    console.error("GET K-Means Cache Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// ========================================================
// [POST] ENDPOINT: TRIGER KALKULASI ULANG BULANAN
// ========================================================
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const m = parseInt(
      searchParams.get("month") || String(new Date().getMonth() + 1),
    );
    const y = parseInt(
      searchParams.get("year") || String(new Date().getFullYear()),
    );

    const awalBulan = new Date(y, m - 1, 1);
    const akhirBulan = new Date(y, m, 0, 23, 59, 59);

    // 💡 PERBAIKAN: Tambahkan select field 'category' di POST handler saat mengambil transaksi pembanding
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        amount: { lt: 0 },
        date: { gte: awalBulan, lte: akhirBulan },
      },
      select: {
        id: true,
        description: true,
        amount: true,
        date: true,
        category: true, // 👈 Penting agar data transaksi pembanding tidak kehilangan objek kategori
        financialTargetId: true,
      },
      orderBy: { date: "asc" },
    });

    const currentTotalTx = transactions.length;
    if (currentTotalTx < 5) {
      return NextResponse.json(
        {
          message: `Transaksi pengeluaran bulan ini (${currentTotalTx}) belum mencukupi. Minimal 5 transaksi untuk keperluan statistik skripsi.`,
        },
        { status: 400 },
      );
    }

    const cachedResult = await prisma.kmeansCache.findUnique({
      where: {
        userId_month_year: {
          userId,
          month: m,
          year: y,
        },
      },
    });

    const forceRecompute = searchParams.get("force")?.toLowerCase() === "true";

    if (
      cachedResult &&
      cachedResult.totalTx === currentTotalTx &&
      !forceRecompute
    ) {
      return NextResponse.json(
        {
          wcss: cachedResult.wcss,
          k: cachedResult.optimalK,
          points: cachedResult.points,
          elbow: cachedResult.elbow,
          source: "cache_unchanged",
          noChanges: true,
        },
        { status: 200 },
      );
    }

    const result = await runKmeansComputation(userId, m, y, transactions);

    return NextResponse.json({
      ...result,
      source: forceRecompute ? "forced_recomputation" : "fresh_computation",
    });
  } catch (error: any) {
    console.error("POST K-Means Computation Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
