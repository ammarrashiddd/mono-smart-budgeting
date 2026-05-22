import { prisma } from "@/lib/prisma";
import { calculateUserStats } from "@/lib/finances"; // Import fungsi utilitas
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

  // 2. Bungkus konteks data finansial untuk Gemini AI
  const dataKonteksFinansial = {
    totalPemasukan,
    totalPengeluaran,
    sisaSaldo,
    assignedCluster,
    transaksiTerakhir: ringkasanTransaksi,
  };

  // 3. Ambil data teks dari AI Service
  const aiResult = await generateFinancialInsight(dataKonteksFinansial);

  // ========================================================
  // 4. GABUNGKAN DATA DAN SIMPAN KE MASING-MASING TABEL
  // ========================================================

  // A. Simpan ke model AiInsight
  // A. Menggunakan UPSERT untuk AiInsight (Berperilaku seperti cache)
  await prisma.aiInsight.upsert({
    where: { userId }, // Mencari berdasarkan userId yang unik
    update: {
      personaName: aiResult.personaName,
      kategoriTerbesar: aiResult.kategoriTerbesar,
      kondisiKesehatan: aiResult.kondisiKesehatan,
      aiSaranText: aiResult.aiSaranText,
    },
    create: {
      userId,
      personaName: aiResult.personaName,
      kategoriTerbesar: aiResult.kategoriTerbesar,
      kondisiKesehatan: aiResult.kondisiKesehatan,
      aiSaranText: aiResult.aiSaranText,
    },
  });

  // B. Tetap gunakan CREATE untuk ClusterHistory jika kamu ingin menyimpan rekam jejak log logisnya
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
    },
  });

  return newHistory;
}
