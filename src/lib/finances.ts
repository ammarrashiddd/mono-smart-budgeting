import { prisma } from "@/lib/prisma";

export async function calculateUserStats(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
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
    };
  });

  const sisaSaldo = totalPemasukan - totalPengeluaran;

  return {
    totalPemasukan,
    totalPengeluaran,
    sisaSaldo,
    ringkasanTransaksi, // Kita ikut sertakan agar bisa dipakai analysisHelper
  };
}
