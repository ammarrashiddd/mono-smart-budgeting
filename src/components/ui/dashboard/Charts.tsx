"use client";

import { useEffect, useState } from "react";
import AlokasiPengeluaran from "@/components/grafik/AlokasiPengeluaran";
import ChartSkeleton from "@/components/skeleton/ChartSkeleton";
import TrenPengeluaranPemasukan from "@/components/grafik/TrenPengeluaranPemasukan";

interface ChartProps {
  data: any;
  isLoading: boolean;
}

export default function Charts({ data, isLoading }: ChartProps) {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ========================================================
  // 1. KONDISI TAMPILAN SKELETON (SAAT PROSES HITUNG/FETCH BERJALAN)
  // ========================================================
  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (!data) return null;

  const categoryData = data.categoryData || [];
  const chartData = data.chartData || [];
  const isMobile = windowWidth !== null && windowWidth < 768;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full text-[#1c1c1c]">
      {/* GRAFIK 1: TREN PEMASUKAN & PENGELUARAN (MINIMALIST BRANDING) */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-primary w-full flex flex-col justify-between">
        <div className="mb-2 md:mb-8">
          <h3 className="text-lg font-black text-secondary">
            Tren Pemasukan & Pengeluaran
          </h3>
        </div>

        <div>
          <TrenPengeluaranPemasukan cashflowData={chartData} />
        </div>
      </div>

      {/* GRAFIK 2: ALOKASI PENGELUARAN (15 WARNA MINIMALIS) */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-primary w-full flex flex-col justify-between">
        <div className="mb-2 md:mb-8">
          <h3 className="text-lg font-black text-secondary">
            Alokasi Pengeluaran
          </h3>
        </div>

        <div className="w-full h-56 md:h-64 flex flex-col justify-center items-center text-[10px] font-medium">
          {categoryData.length === 0 ? (
            <p className="text-xs text-secondary italic py-10">
              Belum ada data pengeluaran
            </p>
          ) : (
            <AlokasiPengeluaran
              categoryData={categoryData}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>
    </div>
  );
}
