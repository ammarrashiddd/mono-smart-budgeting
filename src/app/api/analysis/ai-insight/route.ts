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

    // Ambil data tunggal yang berperilaku sebagai cache
    const cachedInsight = await prisma.aiInsight.findUnique({
      where: { userId },
    });

    if (!cachedInsight) {
      return NextResponse.json(
        { message: "Belum ada data cache analisis AI." },
        { status: 404 },
      );
    }

    return NextResponse.json(cachedInsight);
  } catch (error) {
    console.error("AiInsight Cache API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
