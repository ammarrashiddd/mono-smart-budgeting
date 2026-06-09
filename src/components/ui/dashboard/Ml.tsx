"use client";

import KurvaElbow from "@/components/grafik/KurvaElbow";
import ScatterplotClaster from "@/components/grafik/ScatterplotClaster";
import MlSkeleton from "@/components/skeleton/MlSkeleton";

interface DataPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  cluster: number;
}

interface KmeansResult {
  k: number;
  wcss: number | string;
  points: DataPoint[];
  elbow?: Array<{ k: number; wcss: number }>; // Array koordinat metode elbow dari backend
}

interface MlProps {
  data: KmeansResult | null;
  isLoading: boolean;
}

export default function Ml({ data, isLoading }: MlProps) {
  // Palet warna klaster finansial kontras
  const COLORS = ["#1A365D", "#10B981", "#F59E0B", "#F97316", "#F43F5E"];

  // ========================================================
  // 1. KONDISI TAMPILAN SKELETON (LOADING STATE)
  // ========================================================
  if (isLoading || !data) {
    return <MlSkeleton />;
  }

  return (
    <main className="w-full space-y-6">
      <div className="bg-white rounded-xl p-6 md:p-8 border border-secondary/5 shadow-sm">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 pb-4 border-b border-secondary/10">
          <div>
            <h3 className="text-lg font-black text-secondary">
              K-Means Clustering
            </h3>
          </div>
          <div className="text-[10px] font-bold text-tertiary bg-tertiary/5 px-2.5 py-1 rounded border border-tertiary/10 uppercase tracking-widest">
            Unsupervised Learning
          </div>
        </div>

        {/* Parameter Analisis K */}
        <div className="my-6">
          <div>
            <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-wider mb-0.5">
              Optimized Cluster
            </p>
            <p className="text-lg font-bold text-secondary tracking-tight">
              K = {data.k}{" "}
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-1">
                Optimal
              </span>
            </p>
          </div>
        </div>

        {/* BOX : Scatter Plot K-Means */}
        <div className="w-full">
          <span className="text-[10px] font-bold text-secondary/40 uppercase tracking-wider">
            Scatter Plot Pembagian Klaster
          </span>
          <div className="h-full bg-secondary/1 rounded-lg border border-secondary/15 py-3 animate-in fade-in duration-300">
            <ScatterplotClaster data={data} COLORS={COLORS} />
          </div>
        </div>
      </div>
    </main>
  );
}
