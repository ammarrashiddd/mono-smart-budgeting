import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Ambil sesi user yang sedang login secara aman di sisi server
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Tarik semua transaksi milik user ini
    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });

    // 3. Hitung Total Pemasukan dan Pengeluaran secara manual atau via agregasi
    // Di sini kita asumsikan kamu membedakan pemasukan/pengeluaran berdasarkan kategori atau nominal (misal: pengeluaran bernilai negatif, atau ada kolom tipe)
    // Jika di skema kamu 'amount' selalu positif dan pemisahan lewat string kategori, kita filter berdasarkan kategori.
    // Contoh di bawah mengasumsikan pengeluaran bernilai positif namun dikelompokkan (atau kamu bisa sesuaikan dengan logika bisnismu):

    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    transactions.forEach((tx) => {
      // Sederhananya: Kamu bisa asumsikan kategori tertentu sebagai pemasukan, sisanya pengeluaran.
      // Atau jika di form input nanti kamu membedakan nilainya, sesuaikan di sini.
      if (
        tx.category.toLowerCase() === "pemasukan" ||
        tx.category.toLowerCase() === "income"
      ) {
        totalPemasukan += tx.amount;
      } else {
        totalPengeluaran += tx.amount;
      }
    });

    const sisaSaldo = totalPemasukan - totalPengeluaran;

    return NextResponse.json({
      totalPemasukan,
      totalPengeluaran,
      sisaSaldo,
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
