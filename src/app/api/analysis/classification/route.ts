import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { saveFinancialAnalysisHistory } from "@/lib/analysisHelper";
import TrainedModel from "@/config/trained-model.json";

const TRAINED_MODEL = TrainedModel;
const WEIGHT_X = 0.01;
const WEIGHT_Y = 0.99;

function getWeightedDistance(
  point: [number, number],
  centroid: [number, number],
): number {
  return Math.sqrt(
    WEIGHT_X * Math.pow(point[0] - centroid[0], 2) +
      WEIGHT_Y * Math.pow(point[1] - centroid[1], 2),
  );
}

async function runModelInference(userId: string, month: number, year: number) {
  const awalBulan = new Date(year, month - 1, 1);
  const akhirBulan = new Date(year, month, 0, 23, 59, 59);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      amount: { lt: 0 },
      date: { gte: awalBulan, lte: akhirBulan },
    },
    select: {
      id: true,
      description: true,
      amount: true,
      date: true,
      category: true,
      financialTargetId: true,
    },
    orderBy: { date: "asc" },
  });

  const totalTx = transactions.length;
  const { xMin, xMax, yMin, yMax } = TRAINED_MODEL.normalization;
  const denomX = xMax - xMin || 1;
  const denomY = yMax - yMin || 1;

  const clusteredData = transactions.map((tx) => {
    const day = new Date(tx.date).getDate();
    const amount = Math.abs(tx.amount);

    const rawNormX = (day - xMin) / denomX;
    const rawNormY = (amount - yMin) / denomY;
    const normX = Math.max(0, Math.min(1, rawNormX));
    const normY = Math.max(0, Math.min(1, rawNormY));

    let closestCluster = 0;
    let minDistance = Infinity;
    const distMap: Record<string, number> = {};

    TRAINED_MODEL.centroids.forEach((centroid) => {
      const dist = getWeightedDistance(
        [normX, normY],
        [centroid.x, centroid.y],
      );
      distMap[`c${centroid.cluster}`] = Number(dist.toFixed(6));
      if (dist < minDistance) {
        minDistance = dist;
        closestCluster = centroid.cluster;
      }
    });

    return {
      id: tx.id,
      name: tx.description,
      x: day,
      y: amount,
      rawNormX: Number(rawNormX.toFixed(6)),
      normX: Number(normX.toFixed(6)),
      rawNormY: Number(rawNormY.toFixed(6)),
      normY: Number(normY.toFixed(6)),
      distances: distMap,
      cluster: closestCluster,
      category: tx.category || "LAIN_LAIN",
    };
  });

  const assignedCluster =
    clusteredData.length > 0
      ? clusteredData[clusteredData.length - 1].cluster
      : 0;

  const classificationSummary = clusteredData.map(
    ({ id, name, normX, normY, cluster }) => ({
      id,
      name,
      normalizedPoint: [normX, normY],
      cluster,
    }),
  );

  console.table(
    classificationSummary.map((item) => ({
      id: item.id,
      name: item.name,
      normalizedPoint: `[${item.normalizedPoint[0]}, ${item.normalizedPoint[1]}]`,
      cluster: item.cluster,
    })),
    ["id", "name", "normalizedPoint", "cluster"],
  );

  const upsertedCache = await prisma.kmeansCache.upsert({
    where: {
      userId_month_year: { userId, month, year },
    },
    update: {
      optimalK: TRAINED_MODEL.optimalKSelected,
      points: clusteredData,
      totalTx,
      assignedCluster,
    },
    create: {
      userId,
      month,
      year,
      optimalK: TRAINED_MODEL.optimalKSelected,
      points: clusteredData,
      totalTx,
      assignedCluster,
    },
  });

  console.table(
    classificationSummary.map((item) => ({
      userId,
      month,
      year,
      totalTx,
      assignedCluster,
      id: item.id,
      name: item.name,
      normalizedPoint: `[${item.normalizedPoint[0]}, ${item.normalizedPoint[1]}]`,
      cluster: item.cluster,
    })),
    [
      "userId",
      "month",
      "year",
      "totalTx",
      "assignedCluster",
      "id",
      "name",
      "normalizedPoint",
      "cluster",
    ],
  );

  await saveFinancialAnalysisHistory({
    userId,
    optimalK: TRAINED_MODEL.optimalKSelected,
    assignedCluster,
    rawKmeansData: {
      points: clusteredData,
      totalTx,
      month,
      year,
    },
  });

  return {
    k: TRAINED_MODEL.optimalKSelected,
    points: upsertedCache.points,
    assignedCluster,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const m = parseInt(
      searchParams.get("month") || String(new Date().getMonth() + 1),
    );
    const y = parseInt(
      searchParams.get("year") || String(new Date().getFullYear()),
    );

    const cachedResult = await prisma.kmeansCache.findUnique({
      where: {
        userId_month_year: {
          userId: session.user.id,
          month: m,
          year: y,
        },
      },
    });

    if (!cachedResult) {
      return NextResponse.json(
        { message: "Belum ada hasil klasifikasi untuk bulan ini." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      k: cachedResult.optimalK,
      points: cachedResult.points,
      assignedCluster: cachedResult.assignedCluster,
      source: "database_cache",
    });
  } catch (error) {
    console.error("GET Inference Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const m = parseInt(
      searchParams.get("month") || String(new Date().getMonth() + 1),
    );
    const y = parseInt(
      searchParams.get("year") || String(new Date().getFullYear()),
    );

    const result = await runModelInference(session.user.id, m, y);

    return NextResponse.json({
      ...result,
      source: "model_inference",
    });
  } catch (error: any) {
    console.error("POST Inference Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
