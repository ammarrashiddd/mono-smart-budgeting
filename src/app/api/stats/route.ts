import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { calculateUserStats } from "@/lib/finances";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // AMBIL QUERY PARAMETER DARI URL DENGAN FALLBACK AMAN
    const { searchParams } = new URL(request.url);

    // Jika tidak ada parameter ?month= atau ?year= di URL, otomatis ambil bulan & tahun real-time saat ini
    const sekarang = new Date();
    const month = parseInt(
      searchParams.get("month") || String(sekarang.getMonth() + 1),
    );
    const year = parseInt(
      searchParams.get("year") || String(sekarang.getFullYear()),
    );

    // 🛡️ Proteksi tambahan: Pastikan bukan NaN sebelum dioper ke fungsi DB
    if (isNaN(month) || isNaN(year)) {
      return NextResponse.json(
        { message: "Format bulan atau tahun salah" },
        { status: 400 },
      );
    }

    // 🛠️ Jalankan fungsi utilitas dengan menyertakan parameter waktu yang valid
    const stats = await calculateUserStats(userId, month, year);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
