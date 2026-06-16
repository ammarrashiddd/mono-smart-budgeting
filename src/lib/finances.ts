import { prisma } from "@/lib/prisma";

//  Modifikasi parameter agar menerima data month dan year secara eksplisit
export async function calculateUserStats(
  userId: string,
  month: number,
  year: number,
) {
  //  Jika frontend/endpoint lupa mengirim parameter, gunakan waktu saat ini sebagai fallback otomatis
  const targetMonth = month || new Date().getMonth() + 1;
  const targetYear = year || new Date().getFullYear();
  //  Pembuatan rentang tanggal awal bulan (tanggal 1) dan akhir bulan secara presisi
  const awalBulan = new Date(targetYear, targetMonth - 1, 1);
  const akhirBulan = new Date(targetYear, targetMonth, 0, 23, 59, 59); // Tanggal 0 jam 23:59:59 mengambil detik terakhir bulan sebelumnya

  //  Filter query database agar hanya menarik transaksi dalam rentang bulan berjalan
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: awalBulan,
        lte: akhirBulan,
      },
    },
    orderBy: { date: "desc" }, // Diurutkan dari transaksi terbaru di bulan ini
  });

  let totalPemasukan = 0;
  let totalPengeluaran = 0;

  const ringkasanTransaksi = transactions.map((tx) => {
    const amt = tx.amount;
    if (amt >= 0) {
      totalPemasukan += amt;
    } else {
      totalPengeluaran += Math.abs(amt);
    }

    return {
      deskripsi: tx.description || "Tanpa Deskripsi",
      nominal: tx.amount,
      tanggal: new Date(tx.date).toLocaleDateString("id-ID"),
      category: tx.category,
    };
  });

  const sisaSaldo = totalPemasukan - totalPengeluaran;

  return {
    totalPemasukan,
    totalPengeluaran,
    sisaSaldo,
    ringkasanTransaksi, // Dikonsumsi dengan aman oleh analysisHelper untuk konteks LLM Gemini AI
  };
}
