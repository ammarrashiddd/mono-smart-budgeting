import { prisma } from "@/lib/prisma";
import { calculateUserStats } from "@/lib/finances";
import { generateFinancialInsight } from "@/app/services/aiService";
import crypto from "crypto"; // Import modul crypto bawaan Node.js untuk hashing

// 1. INTERFACE: Menampung properti bulan dan tahun dari API Route
interface SaveHistoryParams {
  userId: string;
  optimalK: number;
  assignedCluster: number;
  rawKmeansData: {
    wcss: number;
    points: any;
    elbow: any;
    totalTx: number;
    month: number; // Tangkap info bulan berjalan
    year: number; // Tangkap info tahun berjalan
  };
}

export async function saveFinancialAnalysisHistory({
  userId,
  optimalK,
  assignedCluster,
  rawKmeansData,
}: SaveHistoryParams) {
  // Ekstrak waktu bulan dan tahun dari payload K-Means
  const { month, year } = rawKmeansData;

  // 1. Ambil data kalkulasi murni finansial HANYA pada bulan berjalan
  // 💡 Catatan: pastikan di dalam fungsi calculateUserStats sudah men-select field 'category'
  const { totalPemasukan, totalPengeluaran, sisaSaldo, ringkasanTransaksi } =
    await calculateUserStats(userId, month, year);

  // 1.5. AMBIL DATA TARGET KEUANGAN (GOALS) AKTIF USER DARI DATABASE
  const userGoals = await prisma.financialTarget.findMany({
    where: { userId },
    select: {
      title: true,
      targetAmount: true,
      currentAmount: true,
    },
  });

  // ========================================================
  // 🆕 SISTEM DETEKSI PERUBAHAN DATA (SENSITIF TERHADAP KATEGORI)
  // ========================================================

  // Gabungkan sidik jari dari setiap transaksi (nama, nominal, KATEGORI, milidetik tanggal) beserta goals
  const rawDataString = JSON.stringify({
    txFingerprints: ringkasanTransaksi.map(
      (t) =>
        `${t.deskripsi}-${t.nominal}-${t.category || "LAIN_LAIN"}-${new Date(t.tanggal).getTime()}`,
    ),
    goalsFingerprints: userGoals.map(
      (g) => `${g.title}-${g.currentAmount}-${g.targetAmount}`,
    ),
  });

  // Hasilkan string hash unik SHA-256 sepanjang 64 karakter
  const currentDataHash = crypto
    .createHash("sha256")
    .update(rawDataString)
    .digest("hex");

  // Ambil cache record analisis lama jika ada di database
  const existingCache = await prisma.aiInsight.findUnique({
    where: {
      userId_month_year: { userId, month, year },
    },
  });

  // Variabel penampung hasil analisis
  let aiResult;

  if (existingCache && existingCache.dataHash === currentDataHash) {
    // 🔄 JIKA DATA IDENTIK: Gunakan langsung hasil analisis yang sudah ada di database (Hemat Kuota)
    aiResult = {
      kategoriTerbesar: existingCache.kategoriTerbesar,
      kondisiKesehatan: existingCache.kondisiKesehatan,
      aiSaranText: existingCache.aiSaranText,
      reviewGoals: existingCache.reviewGoals,
    };
  } else {
    // ⚠️ JIKA DATA BERUBAH ATAU BELUM ADA CACHE: Jalankan analisis baru lewat Gemini AI

    // Filter transaksi yang hanya berupa pengeluaran (nominal < 0)
    const pengeluaranTerakhir = ringkasanTransaksi.filter(
      (tx) => tx.nominal < 0,
    );

    // 💡 🆕 AGREGASI MAKRO: Hitung akumulasi total pengeluaran per kategori
    const rekapPerKategori = pengeluaranTerakhir.reduce(
      (acc, tx) => {
        const cat = tx.category || "LAIN_LAIN";
        acc[cat] = (acc[cat] || 0) + Math.abs(tx.nominal);
        return acc;
      },
      {} as Record<string, number>,
    );

    // Merakit struktur konteks baru yang segar dan kaya data untuk disetor ke Gemini AI
    const dataKonteksFinansial = {
      totalPemasukan,
      totalPengeluaran,
      sisaSaldo,
      assignedCluster,
      kmeansCacheData: {
        optimalK,
        wcss: rawKmeansData.wcss,
        points: rawKmeansData.points,
        elbow: rawKmeansData.elbow,
        totalTx: rawKmeansData.totalTx,
        month,
        year,
      },
      // 💡 🆕 Kirim transaksi terakhir lengkap dengan info kategorinya
      transaksiTerakhir: pengeluaranTerakhir.map((tx) => ({
        deskripsi: tx.deskripsi,
        nominal: tx.nominal,
        tanggal: tx.tanggal,
        category: tx.category || "LAIN_LAIN",
      })),
      // 💡 🆕 Menyisipkan rekap total per kategori ke payload AI konteks
      rekapKategori: rekapPerKategori,
      targetKeuangan: userGoals.map((g) => ({
        title: g.title,
        targetAmount: Number(g.targetAmount),
        currentAmount: Number(g.currentAmount),
      })),
    };

    // Panggil Service Gemini AI
    aiResult = await generateFinancialInsight(dataKonteksFinansial);
  }

  // ========================================================
  // 4. SIMPAN DATA KE MASING-MASING TABEL (ISOLASI BULANAN)
  // ========================================================

  // A. Menggunakan UPSERT untuk AiInsight dengan target kombinasi Unik Bulanan beserta Hash barunya
  await prisma.aiInsight.upsert({
    where: {
      userId_month_year: {
        userId,
        month,
        year,
      },
    },
    update: {
      kategoriTerbesar: aiResult.kategoriTerbesar,
      kondisiKesehatan: aiResult.kondisiKesehatan,
      aiSaranText: aiResult.aiSaranText,
      reviewGoals: aiResult.reviewGoals,
      dataHash: currentDataHash, // Update kode hash penanda data terbaru
    },
    create: {
      userId,
      month,
      year,
      kategoriTerbesar: aiResult.kategoriTerbesar,
      kondisiKesehatan: aiResult.kondisiKesehatan,
      aiSaranText: aiResult.aiSaranText,
      reviewGoals: aiResult.reviewGoals,
      dataHash: currentDataHash, // Daftarkan kode hash penanda data baru
    },
  });

  // B. Menampung hasil create ke tabel log riwayat klasterisasi (ClusterHistory)
  const newHistory = await prisma.clusterHistory.create({
    data: {
      userId,
      optimalK,
      assignedCluster,
      totalPemasukan,
      totalPengeluaran,
      sisaSaldo,
      kategoriTerbesar: aiResult.kategoriTerbesar,
      kondisiKesehatan: aiResult.kondisiKesehatan,
      aiSaranText: aiResult.aiSaranText,
      reviewGoals: aiResult.reviewGoals,
    },
  });

  return newHistory;
}
