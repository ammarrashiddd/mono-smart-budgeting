"use client";

import KurvaElbow from "@/components/grafik/KurvaElbow";
import ScatterplotClaster from "@/components/grafik/ScatterplotClaster";

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
    return (
      <div className="bg-white rounded-xl p-6 md:p-8 border border-secondary/5 shadow-sm animate-pulse space-y-4 w-full">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-5 bg-gray-100 rounded w-28"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-gray-50 rounded-lg"></div>
          <div className="h-64 bg-gray-50 rounded-lg"></div>
        </div>
      </div>
    );
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

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BOX 1: Scatter Plot K-Means */}
          <div className="lg:col-span-2 flex flex-col space-y-2">
            <span className="text-[10px] font-bold text-secondary/40 uppercase tracking-wider">
              Scatter Plot Pembagian Klaster
            </span>
            <div className="h-64 bg-secondary/1 rounded-lg border border-secondary/15 p-4 animate-in fade-in duration-300">
              <ScatterplotClaster data={data} COLORS={COLORS} />
            </div>
          </div>

          {/* BOX 2: Kurva Metode Elbow */}
          <div className="flex flex-col space-y-2">
            <span className="text-[10px] font-bold text-secondary/40 uppercase tracking-wider">
              Kurva Metode Elbow
            </span>
            <div className="h-64 bg-secondary/1 rounded-lg border border-secondary/15 p-4 animate-in fade-in duration-300 flex items-center justify-center">
              {data.elbow && data.elbow.length > 0 ? (
                <KurvaElbow data={data} />
              ) : (
                <div className="text-center p-4">
                  <p className="text-xs font-semibold text-secondary/40">
                    Data koordinat grafik Elbow belum tersedia.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOX 3: Parameter Analisis Statistik Bawah */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-secondary/5 mt-6">
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

          <div>
            <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-wider mb-0.5">
              Current In-Cluster Inertia (WCSS)
            </p>
            <p className="text-lg font-bold text-secondary/80 tracking-tight">
              {data.wcss
                ? new Intl.NumberFormat("id-ID").format(Number(data.wcss))
                : 0}
            </p>
          </div>

          <div className="md:col-span-1">
            <p className="text-[10px] text-secondary/50 leading-relaxed font-medium">
              Metode *Elbow* di atas menentukan belokan sudut tertajam (*elbow
              point*) untuk mengunci jumlah K kelompok terbaik secara otomatis,
              menyeimbangkan efisiensi varians klaster (WCSS).
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
