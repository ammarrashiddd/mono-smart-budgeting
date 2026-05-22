import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// STRUCTURE DATA DARI FRONTEND
interface BulkInputItem {
  description: string;
  amount: string;
  type: "income" | "expense";
  date: string;
  goalId?: string;
}

// 1. GET: Ambil semua transaksi milik user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      // Sertakan data target keuangan agar frontend tahu transaksi ini terikat ke goal mana
      include: { financialTarget: true },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("GET Transactions Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// 2. POST: Tambah Multi Transaksi (Bulk) & Auto-Update Financial Target
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const items: BulkInputItem[] = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Data transaksi kosong atau tidak valid" },
        { status: 400 },
      );
    }

    // Eksekusi ACID Transaction aman untuk menjaga konsistensi database
    const savedTransactions = await prisma.$transaction(async (tx) => {
      const createdTxList = [];

      for (const item of items) {
        if (!item.description || !item.amount) {
          throw new Error("Deskripsi dan nominal tidak boleh kosong.");
        }

        const parsedAmount = parseFloat(item.amount);
        // Jika pengeluaran (expense), jadikan nilainya minus (-) di DB. Jika income, biarkan plus (+)
        const finalAmount =
          item.type === "expense"
            ? -Math.abs(parsedAmount)
            : Math.abs(parsedAmount);
        const targetId =
          item.type === "expense" && item.goalId ? item.goalId : null;

        // a. Simpan Transaksi Keuangan
        const newTx = await tx.transaction.create({
          data: {
            userId,
            description: item.description,
            amount: finalAmount,
            date: item.date ? new Date(item.date) : new Date(),
            financialTargetId: targetId,
          },
        });

        // b. Otomatisasi Alokasi Dana Tabungan ke Target Keuangan
        if (targetId) {
          await tx.financialTarget.update({
            where: { id: targetId },
            data: {
              currentAmount: {
                increment: Math.abs(parsedAmount), // Tambahkan dana yang dikumpulkan ke goals
              },
            },
          });
        }

        createdTxList.push(newTx);
      }

      return createdTxList;
    });

    return NextResponse.json(savedTransactions, { status: 201 });
  } catch (error: any) {
    console.error("POST Bulk Transactions Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
