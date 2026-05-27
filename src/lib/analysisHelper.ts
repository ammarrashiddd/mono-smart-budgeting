import { prisma } from "@/lib/prisma";
import { calculateUserStats } from "@/lib/finances";
import { generateFinancialInsight } from "@/app/services/aiService";

// 1. PERBAIKAN PARAMETER INTERFACE: Menampung data mentah K-Means langsung dari API Route
interface SaveHistoryParams {
  userId: string;
  optimalK: number;
  assignedCluster: number;
  rawKmeansData: {
    wcss: number;
    points: any;
    elbow: any;
    totalTx: number;
  };
}

export async function saveFinancialAnalysisHistory({
  userId,
  optimalK,
  assignedCluster,
  rawKmeansData, // 🛠️ Tangkap objek data K-Means di sini
}: SaveHistoryParams) {
  // 1. Ambil data kalkulasi terpusat murni dari utilitas finansial
  const { totalPemasukan, totalPengeluaran, sisaSaldo, ringkasanTransaksi } =
    await calculateUserStats(userId);

  // 1.5. AMBIL DATA TARGET KEUANGAN (GOALS) AKTIF USER DARI DATABASE
  const userGoals = await prisma.financialTarget.findMany({
    where: { userId },
    select: {
      title: true,
      targetAmount: true,
      currentAmount: true,
    },
  });

  // 2. 🛠️ MERAKIT STRUKTUR KONTEKS BARU UNTUK GEMINI AI
  // Menyelaraskan properti 'kmeansCacheData' dengan interface input aiService terbaru
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
    },
    transaksiTerakhir: ringkasanTransaksi,
    targetKeuangan: userGoals.map((g) => ({
      title: g.title,
      targetAmount: Number(g.targetAmount),
      currentAmount: Number(g.currentAmount),
    })),
  };

  // 3. Ambil data teks hasil analisis terstruktur JSON dari AI Service
  const aiResult = await generateFinancialInsight(dataKonteksFinansial);

  // ========================================================
  // 4. SIMPAN DATA KE MASING-MASING TABEL (TANPA STRING TEMPLATE)
  // ========================================================

  // A. Menggunakan UPSERT untuk AiInsight (Berperilaku seperti cache realtime dashboard)
  await prisma.aiInsight.upsert({
    where: { userId },
    update: {
      personaName: aiResult.personaName,
      kategoriTerbesar: aiResult.kategoriTerbesar,
      kondisiKesehatan: aiResult.kondisiKesehatan,
      aiSaranText: aiResult.aiSaranText, // 🛠️ Disimpan bersih ke kolomnya sendiri
      reviewGoals: aiResult.reviewGoals, // 🛠️ Disimpan bersih ke kolomnya sendiri
    },
    create: {
      userId,
      personaName: aiResult.personaName,
      kategoriTerbesar: aiResult.kategoriTerbesar,
      kondisiKesehatan: aiResult.kondisiKesehatan,
      aiSaranText: aiResult.aiSaranText, // 🛠️ Disimpan bersih ke kolomnya sendiri
      reviewGoals: aiResult.reviewGoals, // 🛠️ Disimpan bersih ke kolomnya sendiri
    },
  });

  // B. Menampung hasil create ke variabel newHistory untuk track record log di database
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
      aiSaranText: aiResult.aiSaranText, // 🛠️ Disimpan bersih ke kolomnya sendiri
      reviewGoals: aiResult.reviewGoals, // 🛠️ Disimpan bersih ke kolomnya sendiri
    },
  });

  return newHistory;
}
