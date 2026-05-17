"use client";

import Navbar from "@/components/nav/Navbar";
import GoalItems from "@/components/ui/GoalItems";
import StatCards from "@/components/ui/StatCards";
import { Wallet, TrendUp, MoneyIcon, InvoiceIcon } from "@phosphor-icons/react";

export default function DashboardPage() {
  const transactions = [
    {
      id: 1,
      name: "Starbucks Coffee",
      date: "15 May 2026",
      category: "Lifestyle",
      amount: 55000,
      type: "expense",
    },
    {
      id: 2,
      name: "Listrik & Air",
      date: "05 May 2026",
      category: "Bills",
      amount: 450000,
      type: "expense",
    },
    {
      id: 3,
      name: "Subscription Netflix",
      date: "10 May 2026",
      category: "Entertainment",
      amount: 186000,
      type: "expense",
    },
    {
      id: 4,
      name: "Subscription Netflix",
      date: "10 May 2026",
      category: "Entertainment",
      amount: 186000,
      type: "income",
    },
  ];
  return (
    <div className="bg-primary min-h-screen w-full pb-10 md:pb-20 text-secondary overflow-x-hidden">
      <nav className="h-16 md:h-20 px-4 md:px-12 bg-tertiary flex items-center border-b border-tertiary/10 shadow-sm sticky top-0 z-50">
        <Navbar />
      </nav>

      <header className="px-6 md:px-12 mt-6 md:mt-10">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter text-secondary leading-tight">
          Hello Ammar, <br className="block sm:hidden" /> Welcome Back!
        </h3>
      </header>

      {/* --- Section 1: Stats (Responsive Grid) --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-4 md:px-12 mt-6 md:mt-12">
        <StatCards
          title="Total Pemasukan"
          value="Rp 8.500.000"
          icon={<Wallet weight="bold" className="text-tertiary" size={20} />} // Ukuran ikon sedikit lebih kecil untuk mobile
        />
        <StatCards
          title="Total Pengeluaran"
          value="Rp 4.200.000"
          icon={<TrendUp weight="bold" className="text-red-500" size={20} />}
        />
        <StatCards
          title="Sisa Saldo"
          value="Rp 1.500.000"
          icon={<MoneyIcon weight="bold" className="text-tertiary" size={20} />}
        />
        <StatCards
          title="Kategori Terbesar"
          value="Belanja"
          icon={
            <InvoiceIcon weight="bold" className="text-tertiary" size={20} />
          }
        />
      </div>

      {/* --- Section 2: Goals (Responsive List) --- */}
      <div className="px-6 md:px-12 mt-10 md:mt-16">
        <div className="bg-white rounded-lg p-6 md:p-10 border border-secondary/5 shadow-xl shadow-secondary/5">
          <div className="flex flex-row items-center justify-between mb-8 md:mb-12">
            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-secondary">
              Tujuan Keuangan
            </h3>
            <button className="text-tertiary text-[10px] md:text-xs font-black uppercase tracking-widest hover:underline transition-all whitespace-nowrap">
              Kelola Target
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:gap-10">
            <GoalItems
              name="Dana Darurat"
              target={10000000}
              current={4500000}
            />
            <GoalItems
              name="Tabungan Menikah"
              target={50000000}
              current={15000000}
            />
          </div>
        </div>
      </div>

      {/* --- Section 3: Transaction History (Baru) --- */}
      <div className="px-6 md:px-12 mt-10 md:mt-16">
        <div className="bg-white rounded-lg p-6 md:p-10 border border-secondary/5 shadow-xl shadow-secondary/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-secondary">
              Transaksi
            </h3>
            <button className="text-tertiary text-[10px] md:text-xs font-black uppercase tracking-widest hover:underline transition-all whitespace-nowrap">
              Kelola Transaksi
            </button>
          </div>

          <div className="space-y-4">
            {transactions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 md:p-4 rounded-xl hover:bg-secondary/2 transition-all border border-transparent hover:border-secondary/15"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Info */}
                  <div className="max-w-30 sm:max-w-none">
                    <p className="text-sm md:text-base font-bold text-secondary tracking-tight truncate">
                      {item.name}
                    </p>
                    <div className="mt-0.5">
                      <span className="text-[8px] md:text-[9px] font-medium text-secondary/30 hidden sm:block">
                        {item.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p
                    className={`text-sm md:text-lg font-black tracking-tighter ${item.type === "income" ? "text-green-600" : "text-red-500"}`}
                  >
                    {item.type === "income" ? "+" : "-"}
                    {new Intl.NumberFormat("id-ID").format(item.amount)}
                  </p>
                  <p className="text-[8px] md:text-[9px] font-bold text-secondary/20 uppercase tracking-widest">
                    IDR
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Section 4: Machine Learning (Minimalist Colorized K-Means Matrix) --- */}
      <div className="px-6 md:px-12 mt-10 md:mt-16">
        <div className="bg-white rounded-xl p-6 md:p-8 border border-secondary/5 shadow-sm">
          {/* Header Section - Ramping dengan Sentuhan Warna */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 pb-4 border-b border-secondary/5">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary/40">
                  Machine Learning Engine
                </h4>
              </div>
              <h3 className="text-lg font-bold text-secondary tracking-tight">
                K-Means Clustering
              </h3>
            </div>
            <div className="text-[10px] font-bold text-tertiary bg-tertiary/5 px-2.5 py-1 rounded border border-tertiary/10">
              Metode Elbow Otomatis
            </div>
          </div>

          {/* Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Box Visualisasi Scatter Plot (Berwarna Terarah) */}
            <div className="lg:col-span-2 h-60 bg-secondary/1 rounded-xl border border-secondary/5 flex flex-col items-center justify-center relative overflow-hidden p-4">
              {/* Titik Pusat Centroid (Warna Solid Penanda Klaster) */}
              <div className="absolute top-1/4 left-1/3 w-2.5 h-2.5 bg-tertiary rounded-full shadow-md z-10" />
              <div className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-md z-10" />
              <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-amber-500 rounded-full shadow-md z-10" />

              {/* Titik Anggota Klaster (Muted Dots Sesuai Warna Centroid) */}
              {/* Cluster 1 - Blue/Tertiary Group */}
              <div className="absolute top-[22%] left-[29%] w-1 h-1 bg-tertiary/60 rounded-full" />
              <div className="absolute top-[28%] left-[35%] w-1 h-1 bg-tertiary/40 rounded-full" />
              <div className="absolute top-[18%] left-[32%] w-1 h-1 bg-tertiary/30 rounded-full" />

              {/* Cluster 2 - Emerald/Green Group */}
              <div className="absolute bottom-[32%] right-[28%] w-1 h-1 bg-emerald-500/60 rounded-full" />
              <div className="absolute bottom-[38%] right-[24%] w-1 h-1 bg-emerald-500/40 rounded-full" />
              <div className="absolute bottom-[26%] right-[22%] w-1 h-1 bg-emerald-500/30 rounded-full" />

              {/* Cluster 3 - Amber/Yellow Group */}
              <div className="absolute top-[50%] right-[35%] w-1 h-1 bg-amber-500/60 rounded-full" />
              <div className="absolute top-[54%] right-[31%] w-1 h-1 bg-amber-500/40 rounded-full" />
              <div className="absolute top-[44%] right-[38%] w-1 h-1 bg-amber-500/30 rounded-full" />
            </div>

            {/* Box Parameter Analisis Statistik K-Means (1 Kolom) */}
            <div className="flex flex-col justify-between py-1">
              <div className="space-y-4">
                {/* Metrik 1: Nilai K Optimal */}
                <div>
                  <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-wider mb-0.5">
                    Optimized Cluster
                  </p>
                  <p className="text-xl font-bold text-secondary tracking-tight">
                    K = 3{" "}
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
                    0.1428{" "}
                    <span className="text-[10px] font-bold text-tertiary bg-tertiary/5 px-1.5 py-0.5 rounded ml-1">
                      Variance
                    </span>
                  </p>
                </div>
              </div>

              {/* Catatan Keterangan Khas Desain Minimalis */}
              <div className="pt-4 border-t border-secondary/5 mt-6 lg:mt-0">
                <p className="text-[11px] text-secondary/50 leading-relaxed">
                  Pemisahan data berbasis jarak *Euclidean* murni ini
                  divisualisasikan melalui 3 rumpun warna kontras, yang kemudian
                  disuplai sebagai parameter utama diagnosis bimbingan finansial
                  oleh AI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 5: AI Strategy Analysis (Minimalist Intelligent Diagnosis) --- */}
      <div className="px-6 md:px-12 mt-10 md:mt-16">
        <div className="bg-secondary rounded-xl p-6 md:p-8 border border-secondary/5">
          {/* Layout Utama - Flexbox Responsif */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            {/* Kolom Kiri: Fokus Diagnosis & Narasi AI */}
            <div className="flex-1 space-y-4">
              {/* Sub-Header Kecil */}
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                  Gemini AI Insights
                </h4>
              </div>

              {/* Teks Narasi Tipis & Clean */}
              <p className="text-lg md:text-xl font-bold tracking-tight text-primary/80 leading-relaxed">
                "Evaluasi data mendeteksi variasi transaksi pada pos
                non-esensial telah melampaui batas aman aturan 50/30/20.
                Diperlukan restrukturisasi anggaran guna memulihkan stabilitas
                alokasi Target Dana Darurat Anda."
              </p>
            </div>

            {/* Kolom Kanan: Status Kesehatan Finansial Murni (Muted Look) */}
            <div className="w-full lg:w-64 shrink-0 border-t lg:border-t-0 lg:border-l border-primary/5 pt-6 lg:pt-0 lg:pl-6">
              <p className="text-[9px] font-bold text-primary/40 uppercase tracking-wider mb-2">
                Financial Health
              </p>

              {/* Status Indikator Minimalis */}
              <div className="flex items-center gap-2 mb-3">
                <p className="text-lg font-black text-primary/50 uppercase tracking-wide">
                  Waspada
                </p>
              </div>

              {/* Deskripsi Status */}
              <p className="text-[11px] text-primary/50 leading-relaxed font-medium">
                Rasio akumulasi pengeluaran bulanan berjalan mendesak kapasitas
                sisa saldo efektif Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
