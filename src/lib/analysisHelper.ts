import { prisma } from "@/lib/prisma";
import { calculateUserStats } from "@/lib/finances";
import { generateFinancialInsight } from "@/app/services/aiService";

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
    month: number; // 🆕 Tangkap info bulan berjalan
    year: number; // 🆕 Tangkap info tahun berjalan
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
  // ⚠️ Pastikan fungsi calculateUserStats di 'src/lib/finances.ts' sudah diubah agar menerima parameter (userId, month, year)
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

  // 2. MERAKIT STRUKTUR KONTEKS BARU UNTUK GEMINI AI
  const pengeluaranTerakhir = ringkasanTransaksi.filter((tx) => tx.nominal < 0);

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
      month, // 🆕 Teruskan konteks waktu agar AI tahu bulan apa yang sedang dinilai
      year,
    },
    transaksiTerakhir: pengeluaranTerakhir,
    targetKeuangan: userGoals.map((g) => ({
      title: g.title,
      targetAmount: Number(g.targetAmount),
      currentAmount: Number(g.currentAmount),
    })),
  };

  // 3. Ambil data teks hasil analisis terstruktur JSON dari AI Service
  const aiResult = await generateFinancialInsight(dataKonteksFinansial);

  // ========================================================
  // 4. SIMPAN DATA KE MASING-MASING TABEL (ISOLASI BULANAN)
  // ========================================================

  // A. Menggunakan UPSERT untuk AiInsight dengan target kombinasi Unik Bulanan
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
    },
    create: {
      userId,
      month, // 🆕 Wajib diisi untuk mapping record baru di DB
      year, // 🆕 Wajib diisi untuk mapping record baru di DB
      personaName: aiResult.personaName,
      kategoriTerbesar: aiResult.kategoriTerbesar,
      kondisiKesehatan: aiResult.kondisiKesehatan,
      aiSaranText: aiResult.aiSaranText,
      reviewGoals: aiResult.reviewGoals,
    },
  });

  // B. Menampung hasil create ke tabel log riwayat klasterisasi (ClusterHistory)
  // 💡 Note: Jika model ClusterHistory di skripsi Anda ingin mencatat bulan & tahun secara eksplisit,
  // Anda bisa menambahkan kolom 'month' dan 'year' di skemanya, lalu isi di bawah ini.
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
