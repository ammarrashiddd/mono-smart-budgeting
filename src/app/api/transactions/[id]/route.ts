import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// 1. DELETE: Hapus transaksi & Otomatis kurangi saldo di Financial Target (Goals)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, // Unwrapping Promise untuk Next.js 15
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Mengambil ID dari params dinamis
    const { id: transactionId } = await params;

    // Menjalankan database transaction agar proses hapus & kalkulasi sinkron
    await prisma.$transaction(async (tx) => {
      // a. Ambil data transaksi lama untuk memeriksa ikatan target finansial
      const transaction = await tx.transaction.findUnique({
        where: { id: transactionId },
      });

      if (!transaction) {
        throw new Error("Transaksi tidak ditemukan");
      }

      // b. Jika transaksi yang dihapus terikat ke Goals, kurangi currentAmount target tersebut
      if (transaction.financialTargetId) {
        const transactionAmount = Math.abs(transaction.amount);

        await tx.financialTarget.update({
          where: { id: transaction.financialTargetId },
          data: {
            currentAmount: {
              decrement: transactionAmount, // Saldo Goals otomatis berkurang secara aman
            },
          },
        });
      }

      // c. Hapus transaksi utama dari database
      await tx.transaction.delete({
        where: { id: transactionId },
      });
    });

    return NextResponse.json({
      success: true,
      message:
        "Transaksi berhasil dihapus dan nominal tujuan keuangan telah disesuaikan",
    });
  } catch (error: any) {
    console.error("Error API Delete Transaction:", error);
    const statusCode =
      error.message === "Transaksi tidak ditemukan" ? 404 : 500;
    return NextResponse.json(
      { message: error.message || "Gagal menghapus data di server" },
      { status: statusCode },
    );
  }
}

// 2. PUT: Edit/Update Transaksi Tunggal & Sesuaikan Saldo Goals Otomatis
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: transactionId } = await params;

    // 1. Ambil body JSON dari request
    let body = await request.json();

    // 2. JIKA data yang masuk berbentuk Array, bongkar ambil indeks pertama ([0])
    if (Array.isArray(body)) {
      body = body[0];
    }

    // 3. Ambil data dengan toleransi fallback jika ada perbedaan penamaan field
    const description = body.description;
    const amount = body.amount;
    const date = body.date;

    // Toleransi jika frontend mengirim 'goalId' sedangkan backend mencari 'financialTargetId'
    const goalId = body.goalId || body.financialTargetId;

    // Mencari penamaan tipe transaksi (antisipasi jika tipenya terselip/salah nama)
    const type = body.type;

    // 4. Validasi data yang super ketat dengan pesan yang informatif
    if (!description || !amount || !type) {
      return NextResponse.json(
        {
          message: `Deskripsi, nominal, dan tipe transaksi wajib diisi. Data yang diterima: description=${description}, amount=${amount}, type=${type}`,
        },
        { status: 400 },
      );
    }

    const parsedAmount = parseFloat(amount);

    // Aturan nominal finansial (expense = negatif, income = positif)
    const finalNewAmount =
      type === "expense" ? -Math.abs(parsedAmount) : Math.abs(parsedAmount);
    const targetId = type === "expense" && goalId ? goalId : null;

    // Gunakan $transaction agar proses update data berganda aman
    await prisma.$transaction(async (tx) => {
      // a. Ambil data transaksi LAMA sebelum diubah untuk menghitung selisih nominalnya
      const oldTransaction = await tx.transaction.findUnique({
        where: { id: transactionId },
      });

      if (!oldTransaction) {
        throw new Error("Transaksi tidak ditemukan");
      }

      // b. Logika penyesuaian saldo Goals (jika transaksi lama atau baru terikat ke Goals)
      const oldTargetId = oldTransaction.financialTargetId;

      if (oldTargetId === targetId && targetId) {
        // Kasus 1: Goal-nya sama, hanya nominalnya yang berubah
        const diff = Math.abs(finalNewAmount) - Math.abs(oldTransaction.amount);

        await tx.financialTarget.update({
          where: { id: targetId },
          data: { currentAmount: { increment: diff } },
        });
      } else {
        // Kasus 2: Goal berubah
        if (oldTargetId) {
          await tx.financialTarget.update({
            where: { id: oldTargetId },
            data: {
              currentAmount: { decrement: Math.abs(oldTransaction.amount) },
            },
          });
        }
        if (targetId) {
          await tx.financialTarget.update({
            where: { id: targetId },
            data: { currentAmount: { increment: Math.abs(finalNewAmount) } },
          });
        }
      }

      // c. Eksekusi update data transaksi utama ke database
      await tx.transaction.update({
        where: { id: transactionId },
        data: {
          description,
          amount: finalNewAmount,
          date: date ? new Date(date) : new Date(),
          financialTargetId: targetId,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message:
        "Transaksi berhasil diperbarui dan saldo tujuan keuangan telah disesuaikan",
    });
  } catch (error: any) {
    console.error("PUT Transaction Error di Terminal:", error);
    const statusCode =
      error.message === "Transaksi tidak ditemukan" ? 404 : 500;
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: statusCode },
    );
  }
}
