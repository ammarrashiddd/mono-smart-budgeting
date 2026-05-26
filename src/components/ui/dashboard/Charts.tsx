"use client";

import { useEffect, useState } from "react";
import TrenSisaSaldo from "@/components/grafik/TrenSisaSaldo";
import AlokasiPengeluaran from "@/components/grafik/AlokasiPengeluaran";

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-pulse">
        {/* SKELETON CHART 1: TREN SALDO (AREA CHART) */}
        <div className="h-72 bg-white rounded-xl border border-[#ebebeb] p-5 md:p-6 flex flex-col justify-between">
          {/* Header Title Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-[#f2f2f2] rounded-md w-1/3" />
          </div>

          {/* Mock Area Chart Lines (Grid Line Simulation) */}
          <div className="w-full space-y-5 pb-4">
            <div className="h-px bg-[#f2f2f2] w-full" />
            <div className="h-px bg-[#f2f2f2] w-full" />
            <div className="h-px bg-[#f2f2f2] w-full" />
            <div className="h-px bg-[#f2f2f2] w-full" />
            {/* X Axis Mock */}
            <div className="flex justify-between pt-2 px-2">
              <div className="h-2 bg-[#f2f2f2] rounded w-8" />
              <div className="h-2 bg-[#f2f2f2] rounded w-8" />
              <div className="h-2 bg-[#f2f2f2] rounded w-8" />
              <div className="h-2 bg-[#f2f2f2] rounded w-8" />
            </div>
          </div>
        </div>

        {/* SKELETON CHART 2: DISTRIBUSI KATEGORI (DONUT CHART) */}
        <div className="h-72 bg-white rounded-xl border border-[#ebebeb] p-5 md:p-6 flex flex-col justify-between">
          {/* Header Title Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-[#f2f2f2] rounded-md w-1/2" />
          </div>

          {/* Mock Donut Circle */}
          <div className="flex justify-center items-center h-40">
            <div className="w-28 h-28 rounded-full border-14 border-[#f2f2f2] flex items-center justify-center" />
          </div>

          {/* Mock Legends */}
          <div className="flex justify-center space-x-4 pb-1">
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-[#f2f2f2]" />
              <div className="h-2 bg-[#f2f2f2] rounded w-12" />
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-[#f2f2f2]" />
              <div className="h-2 bg-[#f2f2f2] rounded w-12" />
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-[#f2f2f2]" />
              <div className="h-2 bg-[#f2f2f2] rounded w-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const categoryData = data.categoryData || [];
  const balanceTrendData = data.balanceTrendData || [];
  const isMobile = windowWidth !== null && windowWidth < 768;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full text-[#1c1c1c]">
      {/* GRAFIK 1: TREN SALDO KUMULATIF (MINIMALIST BRANDING) */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-primary w-full flex flex-col justify-between">
        <div className="mb-8">
          <h3 className="text-lg font-black text-secondary">
            Tren Sisa Saldo Kumulatif
          </h3>
        </div>

        <div>
          <TrenSisaSaldo balanceTrendData={balanceTrendData} />
        </div>
      </div>

      {/* GRAFIK 2: ALOKASI PENGELUARAN (15 WARNA MINIMALIS) */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-primary w-full flex flex-col justify-between">
        <div className="mb-8">
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
