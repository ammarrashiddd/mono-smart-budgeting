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
  points: DataPoint[];
}

interface MlProps {
  data: KmeansResult | null;
  isLoading: boolean;
}

export default function Ml({ data, isLoading }: MlProps) {
  // Palet warna klaster finansial kontras
  const COLORS = ["#1A365D", "#10B981", "#F59E0B", "#F97316", "#F43F5E"];

  const namaBulanSekarang = new Date().toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h3 className="text-lg font-black text-secondary">
              Riwayat Pengeluaran
            </h3>
          </div>
          <div className="px-3 py-1 bg-secondary text-primary rounded-md text-xs font-bold uppercase tracking-wider">
            {namaBulanSekarang}
          </div>
        </div>

        {/* BOX : Scatter Plot Klasifikasi */}
        <div className="w-full mb-6">
          <div className="h-full bg-secondary/1 rounded-lg border border-secondary/15 py-3 animate-in fade-in duration-300">
            <ScatterplotClaster data={data} COLORS={COLORS} />
          </div>
        </div>

        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-secondary/70 leading-relaxed">
            {/* Sumbu X */}
            <div className="p-3 bg-secondary/5 rounded-lg border border-secondary/5">
              <p className="font-bold text-secondary text-sm mb-1">
                Sumbu Mendatar
              </p>
              <p>
                Menunjukkan Tanggal Transaksi Anda dari tanggal 1 hingga 31
                dalam sebulan ini.
              </p>
            </div>

            {/* Sumbu Y */}
            <div className="p-3 bg-secondary/5 rounded-lg border border-secondary/5">
              <p className="font-bold text-secondary text-sm mb-1">
                Sumbu Tegak
              </p>
              <p>
                Menunjukkan Nominal Uang yang dikeluarkan. Semakin tinggi posisi
                titik, semakin besar nilainya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
