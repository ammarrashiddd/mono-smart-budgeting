// src/app/api/analysis/ai-insight/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Ambil target bulan & tahun dari parameter URL Query (?month=6&year=2026)
    const { searchParams } = new URL(request.url);
    const m = parseInt(
      searchParams.get("month") || String(new Date().getMonth() + 1),
    );
    const y = parseInt(
      searchParams.get("year") || String(new Date().getFullYear()),
    );

    // 2. PERBAIKAN QUERY: Gunakan userId_month_year compound index
    const cachedInsight = await prisma.aiInsight.findUnique({
      where: {
        userId_month_year: {
          userId,
          month: m,
          year: y,
        },
      },
    });

    if (!cachedInsight) {
      return NextResponse.json(
        { message: "Belum ada analisis finansial AI untuk periode bulan ini." },
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
