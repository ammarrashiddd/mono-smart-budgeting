"use client";

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
  wcss: number | string;
  points: DataPoint[];
  elbow?: Array<{ k: number; wcss: number }>;
}

// Menambahkan interface Props agar tersinkronisasi dengan state dari DashboardPage
interface MlProps {
  data: KmeansResult | null;
  isLoading: boolean;
}

export default function Ml({ data, isLoading }: MlProps) {
  // Palet warna klaster finansial kontras (Maksimal 5 Kelompok)
  const COLORS = ["#1A365D", "#10B981", "#F59E0B", "#F97316", "#F43F5E"];

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
      const currentClusterColor = COLORS[info.cluster % COLORS.length];

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
            style={{ color: currentClusterColor }}
          >
            Klaster #{info.cluster + 1}
          </p>
        </div>
      );
    }
    return null;
  };

  // ========================================================
  // 1. KONDISI TAMPILAN SKELETON (IKUT KONTROL PARENT)
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
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-7 bg-gray-100 rounded w-32"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-28"></div>
              <div className="h-7 bg-gray-100 rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // 2. TAMPILAN UTAMA GRAFIK (JIKA DATA SUDAH SIAP DAN MATANG)
  // ========================================================
  return (
    <main className="w-full">
      <div className="bg-white rounded-xl p-6 md:p-8 border border-secondary/5 shadow-sm">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 pb-4 border-b border-secondary/10">
          <div>
            <h3 className="text-lg font-black text-secondary">
              K-Means Clustering
            </h3>
          </div>
          <div className="text-[10px] font-bold text-tertiary bg-tertiary/5 px-2.5 py-1 rounded border border-tertiary/10 uppercase tracking-widest">
            Metode Elbow
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Box Visualisasi Scatter Plot */}
          <div className="lg:col-span-2 h-64 bg-secondary/1 rounded-lg border border-secondary/15 p-4 animate-in fade-in duration-300">
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
                <Scatter name="Transaksi" data={data.points}>
                  {data.points.map((entry, index) => (
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

          {/* Box Parameter Analisis Statistik */}
          <div className="flex flex-col justify-between py-1">
            <div className="space-y-4">
              {/* Metrik 1: Nilai K Optimal */}
              <div>
                <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-wider mb-0.5">
                  Optimized Cluster
                </p>
                <p className="text-xl font-bold text-secondary tracking-tight">
                  K = {data.k}{" "}
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-1">
                    Optimal (Elbow)
                  </span>
                </p>
              </div>

              {/* Metrik 2: Skor WCSS/Inertia */}
              <div>
                <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-wider mb-0.5">
                  Cluster Inertia (WCSS)
                </p>
                <p className="text-xl font-bold text-secondary/80 tracking-tight">
                  {data.wcss
                    ? new Intl.NumberFormat("id-ID").format(Number(data.wcss))
                    : 0}{" "}
                  <span className="text-[10px] font-bold text-tertiary bg-tertiary/5 px-1.5 py-0.5 rounded ml-1">
                    Real Value
                  </span>
                </p>
              </div>
            </div>

            {/* Catatan Keterangan Klasterisasi */}
            <div className="pt-4 border-t border-secondary/5 mt-6 lg:mt-0">
              <p className="text-[11px] text-secondary/50 leading-relaxed">
                Pemisahan data berbasis jarak *Euclidean* murni ini memetakan
                pola sebaran pengeluaran harian Anda ke dalam {data.k} zona
                klaster warna (dinamis berdasarkan kalkulasi metode *Elbow*),
                yang selanjutnya dikirim ke modul AI sebagai landasan pembuatan
                strategi finansial terukur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
