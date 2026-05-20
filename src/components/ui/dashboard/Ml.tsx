"use client";

import { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DataPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  cluster: number;
}

interface KmeansResult {
  k: number;
  wcss: string;
  points: DataPoint[];
}

export default function Ml() {
  const [data, setData] = useState<KmeansResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Palet warna klaster finansial (Tertiary, Emerald, Amber)
  const COLORS = ["#1A365D", "#10B981", "#F59E0B"];

  useEffect(() => {
    const runKmeans = async () => {
      try {
        const res = await fetch("/api/analysis/kmeans");
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Gagal memproses klasterisasi.");
        }
        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    runKmeans();
  }, []);

  // Format angka rupiah untuk tooltip grafik
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Custom Tooltip saat titik grafik di-hover oleh kursor mouse
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const info = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-secondary/10 shadow-xl rounded-lg text-xs font-medium space-y-1">
          <p className="font-black text-secondary">{info.name}</p>
          <p className="text-secondary/60">
            Tanggal Pengambilan:{" "}
            <span className="text-secondary font-bold">{info.x}</span>
          </p>
          <p className="text-secondary/60">
            Nominal:{" "}
            <span className="text-secondary font-bold">
              {formatRupiah(info.y)}
            </span>
          </p>
          <p
            className="text-[9px] font-black uppercase tracking-wider mt-1"
            style={{ color: COLORS[info.cluster] }}
          >
            Klaster #{info.cluster + 1}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 md:p-8 border border-secondary/5 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-60 bg-gray-100 rounded-xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 md:p-8 border border-secondary/5 shadow-sm text-center py-12">
        <p className="text-xs text-red-500 font-bold bg-red-50 px-4 py-2.5 rounded-lg inline-block">
          {error}
        </p>
      </div>
    );
  }

  return (
    <main>
      <div className="bg-white rounded-xl p-6 md:p-8 border border-secondary/5 shadow-sm">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 pb-4 border-b border-secondary/10">
          <div>
            <h3 className="text-lg font-black text-secondary">
              K-Means Clustering
            </h3>
          </div>
          <div className="text-[10px] font-bold text-tertiary bg-tertiary/5 px-2.5 py-1 rounded border border-tertiary/10 uppercase tracking-widest">
            Metode Euclidean 2D
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Box Visualisasi Scatter Plot (Data Riil Recharts) */}
          <div className="lg:col-span-2 h-64 bg-secondary/1 rounded-xl border border-secondary/15 p-4 animate-in fade-in duration-300">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 10, right: 10, bottom: 0, left: -10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Tanggal"
                  domain={[1, 31]}
                  tick={{ fontSize: 10, fontWeight: "bold" }}
                  stroke="#A3A3A3"
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Nominal"
                  tickFormatter={(val) => `Rp${val / 1000}k`}
                  tick={{ fontSize: 10, fontWeight: "bold" }}
                  stroke="#A3A3A3"
                />
                <Tooltip content={<CustomTooltip />} />
                <Scatter name="Transaksi" data={data?.points}>
                  {data?.points.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.cluster % COLORS.length]}
                      radius={4}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Box Parameter Analisis Statistik K-Means */}
          <div className="flex flex-col justify-between py-1">
            <div className="space-y-4">
              {/* Metrik 1: Nilai K Optimal */}
              <div>
                <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-wider mb-0.5">
                  Optimized Cluster
                </p>
                <p className="text-xl font-bold text-secondary tracking-tight">
                  K = {data?.k}{" "}
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-1">
                    Optimal
                  </span>
                </p>
              </div>

              {/* Metrik 2: Skor WCSS/Inertia */}
              <div>
                <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-wider mb-0.5">
                  Cluster Inertia (WCSS)
                </p>
                <p className="text-xl font-bold text-secondary/80 tracking-tight">
                  {data?.wcss}{" "}
                  <span className="text-[10px] font-bold text-tertiary bg-tertiary/5 px-1.5 py-0.5 rounded ml-1">
                    Convergence
                  </span>
                </p>
              </div>
            </div>

            {/* Catatan Keterangan Skripsi */}
            <div className="pt-4 border-t border-secondary/5 mt-6 lg:mt-0">
              <p className="text-[11px] text-secondary/50 leading-relaxed">
                Pemisahan data berbasis jarak *Euclidean* murni ini memetakan
                pola sebaran pengeluaran harian Anda ke dalam {data?.k} zona
                klaster warna, yang selanjutnya dikirim ke modul AI sebagai
                landasan pembuatan strategi finansial terukur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
