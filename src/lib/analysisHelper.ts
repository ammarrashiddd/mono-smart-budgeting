import { prisma } from "@/lib/prisma";
import { calculateUserStats } from "@/lib/finances";
import { generateFinancialInsight } from "@/app/services/aiService";
import crypto from "crypto"; // 🆕 Import modul crypto bawaan Node.js untuk hashing

// 1. PERBAIKAN INTERFACE: Menampung properti bulan dan tahun dari API Route
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
  // 🆕 SISTEM DETEKSI PERUBAHAN DATA (NAMA, NILAI, TANGGAL, GOALS)
  // ========================================================

  // Gabungkan sidik jari dari setiap transaksi (nama, nominal, milidetik tanggal) beserta goals
  const rawDataString = JSON.stringify({
    txFingerprints: ringkasanTransaksi.map(
      (t) => `${t.deskripsi}-${t.nominal}-${new Date(t.tanggal).getTime()}`,
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
    // 🔄 JIKA DATA IDENTIK: Gunakan langsung hasil analisis yang sudah ada di database
    aiResult = {
      personaName: existingCache.personaName,
      kategoriTerbesar: existingCache.kategoriTerbesar,
      kondisiKesehatan: existingCache.kondisiKesehatan,
      aiSaranText: existingCache.aiSaranText,
      reviewGoals: existingCache.reviewGoals,
    };
  } else {
    // ⚠️ JIKA DATA BERUBAH ATAU BELUM ADA CACHE: Jalankan analisis baru lewat Gemini AI

    const pengeluaranTerakhir = ringkasanTransaksi.filter(
      (tx) => tx.nominal < 0,
    );

    // Merakit struktur konteks baru yang segar untuk disetor ke Gemini AI
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
      transaksiTerakhir: pengeluaranTerakhir,
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
      personaName: aiResult.personaName,
      kategoriTerbesar: aiResult.kategoriTerbesar,
      kondisiKesehatan: aiResult.kondisiKesehatan,
      aiSaranText: aiResult.aiSaranText,
      reviewGoals: aiResult.reviewGoals,
      dataHash: currentDataHash, // 🆕 Update kode hash penanda data terbaru
    },
    create: {
      userId,
      month,
      year,
      personaName: aiResult.personaName,
      kategoriTerbesar: aiResult.kategoriTerbesar,
      kondisiKesehatan: aiResult.kondisiKesehatan,
      aiSaranText: aiResult.aiSaranText,
      reviewGoals: aiResult.reviewGoals,
      dataHash: currentDataHash, // 🆕 Daftarkan kode hash penanda data baru
    },
  });

  // B. Menampung hasil create ke tabel log riwayat klasterisasi (ClusterHistory)
  const newHistory = await prisma.clusterHistory.create({
    data: {
      userId,
      optimalK,
      assignedCluster,
      personaName: aiResult.personaName,
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
