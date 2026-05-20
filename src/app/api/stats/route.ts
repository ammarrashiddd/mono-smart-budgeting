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

    // 3. Hitung Total Pemasukan dan Pengeluaran.
    // Saat ini, tipe transaksi disimpan dalam tanda amount:
    // - value >= 0 berarti pemasukan
    // - value < 0 berarti pengeluaran
    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    transactions.forEach((tx) => {
      if (tx.amount >= 0) {
        totalPemasukan += tx.amount;
      } else {
        totalPengeluaran += Math.abs(tx.amount);
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
