import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// 1. PUT: Mengubah data target keuangan
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { title, targetAmount, currentAmount } = await req.json();

    const existingGoal = await prisma.financialTarget.findUnique({
      where: { id },
    });

    if (!existingGoal || existingGoal.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updatedGoal = await prisma.financialTarget.update({
      where: { id },
      data: {
        title,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount || 0),
      },
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("PUT Goal Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// 2. DELETE: Menghapus target keuangan
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existingGoal = await prisma.financialTarget.findUnique({
      where: { id },
    });

    if (!existingGoal || existingGoal.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Hapus transaksi yang terhubung dengan target ini terlebih dahulu
    await prisma.transaction.deleteMany({
      where: { financialTargetId: id, userId: session.user.id },
    });

    await prisma.financialTarget.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Target berhasil dihapus" });
  } catch (error) {
    console.error("DELETE Goal Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
