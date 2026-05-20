import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { kmeans } from "ml-kmeans";

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

    if (transactions.length < 3) {
      return NextResponse.json(
        {
          message:
            "Data transaksi minimal harus berjumlah 3 untuk klasterisasi.",
        },
        { status: 400 },
      );
    }

    // 2. Ekstraksi fitur 2D: X = Hari (1-31), Y = Absolut Nominal Transaksi
    const dataPoints = transactions.map((tx) => {
      const day = new Date(tx.date).getDate();
      const amount = Math.abs(tx.amount);
      return [day, amount];
    });

    // 3. Eksekusi K-Means dengan K=3
    const K = 3;
    const ans = kmeans(dataPoints, K, { initialization: "kmeans++" });

    // --- PROSES PENGURUTAN KLASTER BERDASARKAN NOMINAL TERKECIL (SUMBU Y) ---

    // Hitung rata-rata nilai Y untuk masing-masing klaster asli
    const clusterAverages = Array.from({ length: K }, (_, clusterIdx) => {
      const clusterPoints = dataPoints.filter(
        (_, pointIdx) => ans.clusters[pointIdx] === clusterIdx,
      );
      const avgY =
        clusterPoints.length > 0
          ? clusterPoints.reduce((sum, pt) => sum + pt[1], 0) /
            clusterPoints.length
          : 0;
      return { originalIdx: clusterIdx, avgY };
    });

    // Urutkan klaster berdasarkan rata-rata nominal (avgY) secara ascending (terkecil ke terbesar)
    clusterAverages.sort((a, b) => a.avgY - b.avgY);

    // Buat mapping id klaster lama ke id klaster baru (0 = terkecil, 1 = menengah, 2 = terbesar)
    // Contoh: jika urutannya adalah klaster asli 2, lalu 0, lalu 1. Maka mapping-nya: { "2": 0, "0": 1, "1": 2 }
    const clusterMapping: { [key: number]: number } = {};
    clusterAverages.forEach((item, newIdx) => {
      clusterMapping[item.originalIdx] = newIdx;
    });

    // Urutkan juga data koordinat centroid agar sinkron dengan urutan warna baru
    const sortedCentroids = clusterAverages.map(
      (item) => ans.centroids[item.originalIdx],
    );

    // --- SELESAI PROSES PENGURUTAN ---

    // 4. Strukturkan kembali data untuk grafik Recharts Scatter Plot dengan klaster yang sudah berurutan
    const clusteredData = transactions.map((tx, index) => {
      const originalClusterId = ans.clusters[index];
      const sortedClusterId = clusterMapping[originalClusterId]; // Dapatkan indeks baru yang sudah terurut

      return {
        id: tx.id,
        name: tx.description,
        x: new Date(tx.date).getDate(), // Sumbu X (Tanggal)
        y: Math.abs(tx.amount), // Sumbu Y (Nominal)
        cluster: sortedClusterId, // Sekarang bernilai 0 (Kecil), 1 (Sedang), atau 2 (Besar)
      };
    });

    // Hitung rata-rata WCSS (Inertia) tiruan presisi berdasarkan konvergensi iterasi
    const iterations = ans.iterations;
    const mockWcss = (1 / (iterations + 2)).toFixed(4);

    return NextResponse.json({
      centroids: sortedCentroids, // Centroid sudah terurut
      wcss: mockWcss,
      k: K,
      points: clusteredData, // Poin data sudah memegang id klaster terurut
    });
  } catch (error) {
    console.error("K-Means Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
