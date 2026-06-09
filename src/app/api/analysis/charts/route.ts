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

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth(); // Mengambil indeks bulan saat ini (0-11)

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

    // 1. Inisialisasi struktur data dasar untuk grafik tren
    const chartData = namaBulan.map((bulan) => ({
      name: bulan,
      pemasukan: 0,
      pengeluaran: 0,
    }));

    // Menyimpan akumulasi per kategori untuk "Semua Riwayat" dan "Bulan Ini"
    const categoryMap: Record<
      string,
      { totalAll: number; totalCurrentMonth: number }
    > = {};

    // 2. Isi data pemasukan, pengeluaran, dan peta kategori
    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const monthIndex = txDate.getMonth();
      const nominal = tx.amount;

      if (nominal > 0) {
        chartData[monthIndex].pemasukan += nominal;
      } else {
        const absNominal = Math.abs(nominal);
        chartData[monthIndex].pengeluaran += absNominal;

        const kategori = tx.description || "Lainnya";

        // Inisialisasi struktur map jika kategori belum terdaftar
        if (!categoryMap[kategori]) {
          categoryMap[kategori] = { totalAll: 0, totalCurrentMonth: 0 };
        }

        // Akumulasi untuk Semua Riwayat
        categoryMap[kategori].totalAll += absNominal;

        // Akumulasi khusus jika transaksi terjadi di bulan berjalan saat ini
        if (monthIndex === currentMonthIndex) {
          categoryMap[kategori].totalCurrentMonth += absNominal;
        }
      }
    });

    // 3. Transformasi categoryMap menjadi array data datar (flat)
    // Satu kategori bisa menghasilkan 2 entri objek jika memiliki pengeluaran di kedua filter
    const categoryData: Array<{
      name: string;
      value: number;
      isCurrentMonth: boolean;
    }> = [];

    Object.keys(categoryMap).forEach((key) => {
      const { totalAll, totalCurrentMonth } = categoryMap[key];

      // Jika ada pengeluaran di bulan berjalan ini, masukkan datanya untuk filter "Bulan Ini"
      if (totalCurrentMonth > 0) {
        categoryData.push({
          name: key,
          value: totalCurrentMonth,
          isCurrentMonth: true,
        });
      }

      // Selalu masukkan data akumulasi total tahunan untuk filter "Semua Riwayat"
      if (totalAll > 0) {
        categoryData.push({
          name: key,
          value: totalAll,
          isCurrentMonth: false,
        });
      }
    });

    // 4. Return bundle data yang sudah ramping ke frontend
    return NextResponse.json({
      chartData, // Digunakan oleh TrenPengeluaranPemasukan
      categoryData, // Digunakan oleh AlokasiPengeluaran (dilengkapi isCurrentMonth)
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
