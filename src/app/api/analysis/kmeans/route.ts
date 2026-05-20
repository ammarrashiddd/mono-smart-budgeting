import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { kmeans } from "ml-kmeans";

// --- FUNGSI UTALITAS: MENGHITUNG JARAK EUCLIDEAN ---
function getEuclideanDistance(point: number[], centroid: number[]): number {
  return Math.sqrt(
    Math.pow(point[0] - centroid[0], 2) + Math.pow(point[1] - centroid[1], 2),
  );
}

// --- FUNGSI UTALITAS: MENGHITUNG WCSS NYATA (BASED ON COORDINATES) ---
function calculateWCSS(
  dataPoints: number[][],
  clusters: number[],
  centroids: number[][], // Diubah eksplisit menjadi number[][] biar aman
): number {
  let totalWcss = 0;
  for (let i = 0; i < dataPoints.length; i++) {
    const point = dataPoints[i];
    const clusterId = clusters[i];

    // PERBAIKAN LINE 25: Tegaskan type-nya sebagai array 1D [X, Y] menggunakan 'as number[]'
    const centroid = centroids[clusterId] as unknown as number[];

    if (centroid) {
      totalWcss += Math.pow(getEuclideanDistance(point, centroid), 2);
    }
  }
  return totalWcss;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 1. Ambil data transaksi pengeluaran saja (amount < 0)
    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id, amount: { lt: 0 } },
      orderBy: { date: "asc" },
    });

    if (transactions.length < 5) {
      return NextResponse.json(
        {
          message:
            "Data transaksi pengeluaran minimal harus berjumlah 5 untuk mencari K optimal via Elbow.",
        },
        { status: 400 },
      );
    }

    // 2. Ekstraksi Fitur Asli
    const rawPoints = transactions.map((tx) => {
      const day = new Date(tx.date).getDate();
      const amount = Math.abs(tx.amount);
      return [day, amount];
    });

    // ==========================================
    // MIN-MAX NORMALIZATION (0 - 1)
    // ==========================================
    const rawAmounts = rawPoints.map((p) => p[1]);
    const maxAmount = Math.max(...rawAmounts, 1);
    const minAmount = Math.min(...rawAmounts, 0);

    const normalizedPoints = rawPoints.map(([day, amount]) => {
      const normX = (day - 1) / (31 - 1);
      const normY = (amount - minAmount) / (maxAmount - minAmount || 1);
      return [normX, normY];
    });

    // --- PROSES 1: JALANKAN PERULANGAN ELBOW (K = 1 sampai K = 6) ---
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

      // Paksa type centroids hasil library menjadi number[][] agar match dengan fungsi WCSS
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

    // ==========================================
    // LOGIKA DETEKSI TEKUKAN SIKU & THRESHOLD AMBING
    // ==========================================
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

    if (optimalK === 2 && elbowData[2]) {
      const dropK2ToK3 = elbowData[1].wcss - elbowData[2].wcss;
      const threshold = elbowData[0].wcss * 0.05;

      if (dropK2ToK3 > threshold) {
        optimalK = 3;
      }
    }

    const finalKmeans = kmeansResults[optimalK];
    const finalClusters = finalKmeans.clusters;

    // --- PROSES 3: MENGURUTKAN KLASTER BERDASARKAN NOMINAL UANG ---
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

    // --- PROSES 4: STRUKTURKAN ULANG DATA UNTUK RESPONSE FRONTEND ---
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

    return NextResponse.json({
      wcss: finalKmeans.wcss,
      k: optimalK,
      points: clusteredData,
      elbow: cleanElbowData,
    });
  } catch (error) {
    console.error("K-Means Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
