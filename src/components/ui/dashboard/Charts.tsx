"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { useEffect, useState } from "react";

interface ChartProps {
  data: any;
  isLoading: boolean;
}

// palet warna
const MINIMALIST_COLORS = [
  "#5D5FEF", // Indigo Soft
  "#339AF0", // Blue Soft
  "#20C997", // Teal Soft
  "#FAB005", // Amber Soft (Cukup gelap agar kontras di putih)
  "#FF6B6B", // Red Soft
  "#F06595", // Pink Soft
  "#845EF7", // Purple Soft
  "#22B8CF", // Cyan Soft
  "#51CF66", // Green Soft
  "#FF922B", // Orange Soft
  "#AE3EC9", // Fuchsia Soft
  "#868E96", // Slate Soft (Pem優 pemisah netral)
];

// Custom Tooltip Minimalis untuk Tren Saldo
const CustomAreaTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1c1c] p-2.5 rounded-lg shadow-xl text-white text-xs font-medium border border-[#ebebeb]/10">
        <p className="opacity-50 text-[9px] uppercase tracking-wider mb-0.5 ">
          {payload[0].payload.name}
        </p>
        <p className="font-bold text-[#ebebeb]">
          Rp {payload[0].value.toLocaleString("id-ID")}
        </p>
      </div>
    );
  }
  return null;
};

// Custom Tooltip Minimalis untuk Distribusi Kategori
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1c1c] p-2.5 rounded-lg shadow-xl text-white text-xs font-medium border border-[#ebebeb]/10">
        <p
          className="font-bold"
          style={{
            color:
              payload[0].payload.fill === "#1c1c1c"
                ? "#ebebeb"
                : payload[0].payload.fill,
          }}
        >
          {payload[0].name}
        </p>
        <p className="text-[11px] opacity-80 mt-0.5">
          Rp {payload[0].value.toLocaleString("id-ID")}
        </p>
      </div>
    );
  }
  return null;
};

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
            Tren Saldo Kumulatif
          </h3>
        </div>

        <div className="w-full h-56 md:h-64 text-[10px] font-medium">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={balanceTrendData}
              margin={{ top: 10, right: 5, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="colorSaldoMinimal"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  {/* Menggunakan --color3 (#1e56cd) sebagai base area dengan opacity sangat soft */}
                  <stop offset="5%" stopColor="#1e56cd" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#1e56cd" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="0"
                vertical={false}
                stroke="#ebebeb" /* --color1 untuk gridline minimalis */
                opacity={0.7}
              />
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis
                stroke="#9ca3af"
                tickLine={false}
                axisLine={false}
                dx={-5}
                tickFormatter={(value) =>
                  value >= 1000000
                    ? `${(value / 1000000).toFixed(1).replace(".0", "")}M`
                    : value.toLocaleString("id-ID")
                }
              />
              <Tooltip
                content={<CustomAreaTooltip />}
                cursor={{ stroke: "#1c1c1c", strokeWidth: 1, opacity: 0.2 }}
              />
              <Area
                name="Total Saldo"
                type="monotone"
                dataKey="saldo"
                stroke="#1e56cd" /* --color3 untuk garis tren utama */
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSaldoMinimal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRAFIK 2: ALOKASI PENGELUARAN (15 WARNA MINIMALIS) */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-primary w-full flex flex-col justify-between">
        <div className="mb-8">
          <h3 className="text-lg font-black text-secondary">
            Alokasi Pengeluaran Kategori
          </h3>
        </div>

        <div className="w-full h-56 md:h-64 flex flex-col justify-center items-center text-[10px] font-medium">
          {categoryData.length === 0 ? (
            <p className="text-xs text-secondary italic py-10">
              Belum ada data pengeluaran
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy={isMobile ? "42%" : "45%"}
                  innerRadius={isMobile ? 48 : 60}
                  outerRadius={isMobile ? 64 : 78}
                  paddingAngle={3} // Celah minimalis antar segmen
                  dataKey="value"
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={MINIMALIST_COLORS[index % MINIMALIST_COLORS.length]} // Loop 15 warna minimalis
                      stroke="#white"
                      strokeWidth={1.5}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconSize={6}
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: "10px",
                    bottom: -5,
                    left: 0,
                    right: 0,
                    maxHeight: isMobile ? "45px" : "55px",
                    overflowY: "auto",
                    paddingTop: "2px",
                    color: "#1c1c1c" /* --color2 */,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
