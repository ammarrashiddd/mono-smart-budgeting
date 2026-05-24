import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const currentYear = new Date().getFullYear();
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        },
      },
    });

    const namaBulan = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    // 1. Inisialisasi struktur data dasar
    const chartData = namaBulan.map((bulan) => ({
      name: bulan,
      pemasukan: 0,
      pengeluaran: 0,
    }));
    const categoryMap: Record<string, number> = {};

    // 2. Isi data pemasukan, pengeluaran, dan kategori
    transactions.forEach((tx) => {
      const monthIndex = new Date(tx.date).getMonth();
      const nominal = tx.amount;

      if (nominal > 0) {
        chartData[monthIndex].pemasukan += nominal;
      } else {
        const absNominal = Math.abs(nominal);
        chartData[monthIndex].pengeluaran += absNominal;

        const kategori = tx.description || "Lainnya";
        categoryMap[kategori] = (categoryMap[kategori] || 0) + absNominal;
      }
    });

    // 3. 🔥 HITUNG TREN SALDO KUMULATIF BERJALAN (RUNNING TOTAL)
    let saldoBerjalan = 0;
    const balanceTrendData = chartData.map((bulan) => {
      const nettPerBulan = bulan.pemasukan - bulan.pengeluaran;
      saldoBerjalan += nettPerBulan; // Akumulasi terus bertambah tiap bulan

      return {
        name: bulan.name,
        saldo: saldoBerjalan,
      };
    });

    const categoryData = Object.keys(categoryMap).map((key) => ({
      name: key,
      value: categoryMap[key],
    }));

    // 4. Return semua bundle data ke frontend
    return NextResponse.json({
      chartData,
      categoryData,
      balanceTrendData, // 🔥 Kirim data tren saldo kumulatif
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
