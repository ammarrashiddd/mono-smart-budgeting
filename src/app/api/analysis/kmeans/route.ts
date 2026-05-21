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

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // --- BACA PARAMETER FORCE DARI URL ---
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("force") === "true";

    // 1. Ambil data pengeluaran
    const transactions = await prisma.transaction.findMany({
      where: { userId, amount: { lt: 0 } },
      orderBy: { date: "asc" },
    });

    const currentTotalTx = transactions.length;
    if (currentTotalTx < 5) {
      return NextResponse.json(
        { message: "Data minimal harus 5..." },
        { status: 400 },
      );
    }

    const currentLastTxId = transactions[currentTotalTx - 1].id;

    // ==========================================
    // LOGIKA CACHE DIUBAH: Jika forceRefresh bernilai true, abaikan blok ini
    // ==========================================
    const cachedResult = await prisma.kmeansCache.findUnique({
      where: { userId },
    });

    if (
      !forceRefresh && // <-- TAMBAHKAN KONDISI INI
      cachedResult &&
      cachedResult.totalTx === currentTotalTx &&
      cachedResult.lastTxId === currentLastTxId
    ) {
      return NextResponse.json({
        wcss: cachedResult.wcss,
        k: cachedResult.optimalK,
        points: cachedResult.points,
        elbow: cachedResult.elbow,
        source: "database_cache",
      });
    }

    // ==========================================
    // JALANKAN KOMPUTASI K-MEANS JIKA DATA BERUBAH / CACHE KOSONG
    // ==========================================

    // 2. Ekstraksi Fitur Asli
    const rawPoints = transactions.map((tx) => {
      const day = new Date(tx.date).getDate();
      const amount = Math.abs(tx.amount);
      return [day, amount];
    });

    // Min-Max Normalization
    const rawAmounts = rawPoints.map((p) => p[1]);
    const maxAmount = Math.max(...rawAmounts, 1);
    const minAmount = Math.min(...rawAmounts, 0);

    const normalizedPoints = rawPoints.map(([day, amount]) => {
      const normX = (day - 1) / (31 - 1);
      const normY = (amount - minAmount) / (maxAmount - minAmount || 1);
      return [normX, normY];
    });

    // Perulangan Elbow (K = 1 s/d K = 6)
    const elbowData = [];
    const kmeansResults: {
      [key: number]: {
        clusters: number[];
        centroids: number[][];
        wcss: number;
      };
    } = {};
    const maxK = 6;

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

    // Deteksi Tekukan Siku (Curvature)
    let optimalK = 3;
    let maxCurvature = -Infinity;

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

    // Threshold Ambing 5%
    if (optimalK === 2 && elbowData[2]) {
      const dropK2ToK3 = elbowData[1].wcss - elbowData[2].wcss;
      const threshold = elbowData[0].wcss * 0.05;

      if (dropK2ToK3 > threshold) {
        optimalK = 3;
      }
    }

    const finalKmeans = kmeansResults[optimalK];
    const finalClusters = finalKmeans.clusters;

    // Urutkan Klaster Berdasarkan Nominal Uang
    const clusterAverages = Array.from(
      { length: optimalK },
      (_, clusterIdx) => {
        const clusterPoints = rawPoints.filter(
          (_, pointIdx) => finalClusters[pointIdx] === clusterIdx,
        );
        const avgY =
          clusterPoints.length > 0
            ? clusterPoints.reduce((sum, pt) => sum + pt[1], 0) /
              clusterPoints.length
            : 0;
        return { originalIdx: clusterIdx, avgY };
      },
    );

    clusterAverages.sort((a, b) => a.avgY - b.avgY);

    const clusterMapping: { [key: number]: number } = {};
    clusterAverages.forEach((item, newIdx) => {
      clusterMapping[item.originalIdx] = newIdx;
    });

    // ==========================================
    // PENENTUAN ASSIGNED CLUSTER USER SAAT INI
    // ==========================================
    // Mengambil transaksi pengeluaran paling akhir dari array
    const lastTransactionIndex = transactions.length - 1;
    const originalLastClusterId = finalClusters[lastTransactionIndex];
    // Konversi id klaster awal menjadi id klaster yang sudah diurutkan (0 = Hemat, dst)
    const assignedCluster = clusterMapping[originalLastClusterId] ?? 0;

    // ==========================================
    // KIRIM DATA KE HELPER CLUSTER HISTORY & GEMINI
    // ==========================================
    await saveFinancialAnalysisHistory({
      userId,
      optimalK,
      assignedCluster,
    });

    // Strukturkan Data untuk Frontend
    const clusteredData = transactions.map((tx, index) => {
      const originalClusterId = finalClusters[index];
      const sortedClusterId = clusterMapping[originalClusterId];

      return {
        id: tx.id,
        name: tx.description,
        x: new Date(tx.date).getDate(),
        y: Math.abs(tx.amount),
        cluster: sortedClusterId,
      };
    });

    const cleanElbowData = elbowData.filter((item) => item.k <= 5);

    // ==========================================
    // SIMPAN ATAU PERBARUI HASIL ANALISIS KE DATABASE CACHE
    // ==========================================
    await prisma.kmeansCache.upsert({
      where: { userId },
      update: {
        optimalK,
        wcss: finalKmeans.wcss,
        points: clusteredData,
        elbow: cleanElbowData,
        totalTx: currentTotalTx,
        lastTxId: currentLastTxId,
      },
      create: {
        userId,
        optimalK,
        wcss: finalKmeans.wcss,
        points: clusteredData,
        elbow: cleanElbowData,
        totalTx: currentTotalTx,
        lastTxId: currentLastTxId,
      },
    });

    return NextResponse.json({
      wcss: finalKmeans.wcss,
      k: optimalK,
      points: clusteredData,
      elbow: cleanElbowData,
      source: "fresh_computation", // Penanda komputasi baru berhasil dibuat
    });
  } catch (error) {
    console.error("K-Means Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
