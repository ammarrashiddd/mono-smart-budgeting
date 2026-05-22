import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { calculateUserStats } from "@/lib/finances";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Panggil utilitas perhitungan terpusat
    const stats = await calculateUserStats(session.user.id);

    return NextResponse.json({
      totalPemasukan: stats.totalPemasukan,
      totalPengeluaran: stats.totalPengeluaran,
      sisaSaldo: stats.sisaSaldo,
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
