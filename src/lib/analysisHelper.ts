import { prisma } from "@/lib/prisma";
import { calculateUserStats } from "@/lib/finances";
import { generateFinancialInsight } from "@/app/services/aiService";

interface SaveHistoryParams {
  userId: string;
  optimalK: number;
  assignedCluster: number;
}

export async function saveFinancialAnalysisHistory({
  userId,
  optimalK,
  assignedCluster,
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

  // 2. Bungkus konteks data finansial secara utuh untuk Gemini AI
  const dataKonteksFinansial = {
    totalPemasukan,
    totalPengeluaran,
    sisaSaldo,
    assignedCluster,
    transaksiTerakhir: ringkasanTransaksi,
    targetKeuangan: userGoals.map((g) => ({
      title: g.title,
      targetAmount: Number(g.targetAmount),
      currentAmount: Number(g.currentAmount),
    })),
  };

  // 3. Ambil data teks dari AI Service
  const aiResult = await generateFinancialInsight(dataKonteksFinansial);

  // ========================================================
  // 4. GABUNGKAN DATA DAN SIMPAN KE MASING-MASING TABEL
  // ========================================================

  // Satukan saran utama dan ulasan target keuangan menggunakan String Template (\n\n untuk baris baru)
  const teksSaranGabungan = `${aiResult.aiSaranText}\n\n${aiResult.reviewGoals}`;

  // A. Menggunakan UPSERT untuk AiInsight (Berperilaku seperti cache dashboard)
  await prisma.aiInsight.upsert({
    where: { userId },
    update: {
      personaName: aiResult.personaName,
      kategoriTerbesar: aiResult.kategoriTerbesar,
      kondisiKesehatan: aiResult.kondisiKesehatan,
      aiSaranText: teksSaranGabungan,
    },
    create: {
      userId,
      personaName: aiResult.personaName,
      kategoriTerbesar: aiResult.kategoriTerbesar,
      kondisiKesehatan: aiResult.kondisiKesehatan,
      aiSaranText: teksSaranGabungan,
    },
  });

  // B. 🔥 PERBAIKAN: Menampung hasil create ke variabel newHistory agar tidak undifined saat direturn
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
      aiSaranText: teksSaranGabungan,
    },
  });

  return newHistory;
}
