"use client";

import Navbar from "@/components/nav/Navbar";
import GoalItems from "@/components/ui/GoalItems";
import StatCards from "@/components/ui/StatCards";
import {
  Wallet,
  Plus,
  TrendUp,
  Target as TargetIcon,
  ChartPieSlice,
  WarningCircle,
  Lightning,
  PaperPlaneRight,
} from "@phosphor-icons/react";

export default function DashboardPage() {
  return (
    <div className="bg-primary min-h-screen w-full pb-20 text-secondary">
      <nav className="h-20 px-6 md:px-12 bg-tertiary flex items-center border-b border-tertiary/10 shadow-sm">
        <Navbar />
      </nav>

      <header className="px-6 md:px-12 mt-8">
        <h3 className="text-4xl font-extrabold tracking-tighter text-secondary">
          Hello Ammar, Welcome Back!
        </h3>
      </header>

      {/* --- Section 1: Stats --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 md:px-12 mt-10">
        <StatCards
          title="Monthly Income"
          value="Rp 8.500.000"
          icon={<Wallet weight="bold" className="text-tertiary" />}
        />
        <StatCards
          title="Monthly Spend"
          value="Rp 4.200.000"
          icon={<TrendUp weight="bold" className="text-red-500" />}
        />
        <StatCards
          title="Savings Rate"
          value="48%"
          subValue="Rp 4.300.000"
          icon={<TargetIcon weight="bold" className="text-tertiary" />}
        />
        <StatCards
          title="AI Health Score"
          value="92/100"
          icon={<ChartPieSlice weight="bold" className="text-tertiary" />}
        />
      </div>

      {/* --- Section 2: Goals --- */}
      <div className="px-6 md:px-12 mt-12">
        <div className="bg-white rounded-3xl p-8 border border-secondary/5 shadow-xl shadow-secondary/5">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-secondary/40">
              Financial Goals
            </h3>
            <button className="text-tertiary text-xs font-black uppercase tracking-widest hover:underline transition-all">
              Manage Targets
            </button>
          </div>
          <div className="grid grid-cols-1 gap-8">
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

      {/* --- Section 3: Machine Learning (Split View) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 md:px-12 mt-12">
        {/* K-Means */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-secondary/5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-secondary/40">
              K-Means Clustering
            </h4>
            <span className="text-[10px] font-black bg-tertiary/10 text-tertiary px-3 py-1 rounded-full uppercase">
              k=3 Optimized
            </span>
          </div>
          <div className="h-64 bg-secondary/[0.02] rounded-3xl border border-dashed border-secondary/10 flex items-center justify-center relative">
            <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-tertiary rounded-full shadow-[0_0_15px_rgba(30,86,205,0.4)]" />
            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-secondary rounded-full opacity-30" />
            <p className="text-[10px] font-bold text-secondary/20 uppercase tracking-[0.4em]">
              Spending Segments
            </p>
          </div>
        </div>

        {/* DBSCAN */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-secondary/5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-secondary/40">
              DBSCAN Anomaly
            </h4>
            <WarningCircle size={20} className="text-red-500" weight="fill" />
          </div>
          <div className="h-64 bg-secondary/[0.02] rounded-3xl border border-dashed border-secondary/10 flex flex-col items-center justify-center relative">
            <p className="text-4xl font-black text-red-500 tracking-tighter italic">
              2
            </p>
            <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
              Outliers Detected
            </p>
          </div>
        </div>
      </div>

      {/* --- Section 4: AI Strategy Analysis (Full Width Focus) --- */}
      <div className="px-6 md:px-12 mt-12">
        <div className="bg-secondary rounded-[2.5rem] p-8 md:p-10 text-primary shadow-2xl shadow-secondary/20 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col xl:flex-row justify-between gap-10">
            {/* Left: Narrative */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-tertiary rounded-xl shadow-[0_0_15px_rgba(30,86,205,0.3)]">
                  <Lightning weight="fill" size={20} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-50">
                  AI Strategy Insight
                </h3>
              </div>
              <p className="text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-8">
                "Berdasarkan analisis clustering, pengeluaran{" "}
                <span className="text-tertiary italic">Lifestyle</span> Anda
                meningkat 12%. Amankan{" "}
                <span className="underline decoration-tertiary underline-offset-8">
                  Dana Darurat
                </span>{" "}
                lebih cepat dengan membatasi cluster ini."
              </p>
            </div>

            {/* Right: Technical Metrics */}
            <div className="flex flex-col md:flex-row xl:flex-col gap-4 w-full xl:w-72">
              {/* Confidence */}
              <div className="flex-1 bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-sm">
                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-2">
                  Confidence Score
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-black text-tertiary tracking-tighter">
                    94.2%
                  </p>
                  <p className="text-[10px] font-bold opacity-40 mb-1">High</p>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-tertiary w-[94%]" />
                </div>
              </div>

              {/* What-If */}
              <div className="flex-1 bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-sm">
                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-2">
                  What-If Projection
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-[8px] opacity-30 uppercase">Current</p>
                    <p className="text-xs font-bold opacity-50 line-through">
                      Jan '27
                    </p>
                  </div>
                  <PaperPlaneRight
                    weight="fill"
                    className="text-tertiary animate-pulse"
                  />
                  <div className="text-center">
                    <p className="text-[8px] text-tertiary uppercase">
                      Optimal
                    </p>
                    <p className="text-lg font-black text-white">Nov '26</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ChartPieSlice
            size={240}
            weight="thin"
            className="absolute -right-16 -bottom-16 opacity-5 rotate-12 group-hover:rotate-[30deg] transition-transform duration-1000"
          />
        </div>
      </div>
    </div>
  );
}
