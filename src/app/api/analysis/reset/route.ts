import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    // 1. Validasi sesi user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Jalankan penghapusan data secara paralel/transaksional
    // Menggunakan deleteMany agar tidak memicu error jika data memang sudah kosong sejak awal
    await prisma.$transaction([
      prisma.aiInsight.deleteMany({ where: { userId } }),
      prisma.kmeansCache.deleteMany({ where: { userId } }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Cache K-Means dan AiInsight berhasil dibersihkan.",
    });
  } catch (error) {
    console.error("Gagal menghapus cache analisis:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
