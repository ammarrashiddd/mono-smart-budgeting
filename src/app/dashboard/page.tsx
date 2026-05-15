"use client";

import Navbar from "@/components/nav/Navbar";
import GoalItems from "@/components/ui/GoalItems";
import StatCards from "@/components/ui/StatCards";
import {
  Wallet,
  TrendUp,
  Target as TargetIcon,
  ChartPieSlice,
  WarningCircle,
  Lightning,
  PaperPlaneRight,
  ArrowDownLeft,
  ArrowUpRight,
} from "@phosphor-icons/react";

export default function DashboardPage() {
  const transactions = [
    {
      id: 1,
      name: "Starbucks Coffee",
      date: "15 May 2026",
      category: "Lifestyle",
      amount: -55000,
      type: "expense",
    },
    {
      id: 2,
      name: "Listrik & Air",
      date: "05 May 2026",
      category: "Bills",
      amount: -450000,
      type: "expense",
    },
    {
      id: 3,
      name: "Subscription Netflix",
      date: "10 May 2026",
      category: "Entertainment",
      amount: -186000,
      type: "expense",
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
          title="Monthly Income"
          value="Rp 8.500.000"
          icon={<Wallet weight="bold" className="text-tertiary" size={20} />} // Ukuran ikon sedikit lebih kecil untuk mobile
        />
        <StatCards
          title="Monthly Spend"
          value="Rp 4.200.000"
          icon={<TrendUp weight="bold" className="text-red-500" size={20} />}
        />
        <StatCards
          title="Savings Rate"
          value="48%"
          subValue="Rp 4.300.000"
          icon={
            <TargetIcon weight="bold" className="text-tertiary" size={20} />
          }
        />
        <StatCards
          title="AI Health Score"
          value="92/100"
          icon={
            <ChartPieSlice weight="bold" className="text-tertiary" size={20} />
          }
        />
      </div>

      {/* --- Section 2: Goals (Responsive List) --- */}
      <div className="px-6 md:px-12 mt-10 md:mt-16">
        <div className="bg-white rounded-lg p-6 md:p-10 border border-secondary/5 shadow-xl shadow-secondary/5">
          <div className="flex flex-row items-center justify-between mb-8 md:mb-12">
            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-secondary">
              Financial Goals
            </h3>
            <button className="text-tertiary text-[10px] md:text-xs font-black uppercase tracking-widest hover:underline transition-all whitespace-nowrap">
              Manage Targets
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
              Expenses
            </h3>
            <button className="text-tertiary text-[10px] md:text-xs font-black uppercase tracking-widest hover:underline transition-all whitespace-nowrap">
              Manage Expenses
            </button>
          </div>

          <div className="space-y-4">
            {transactions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 md:p-4 rounded-xl hover:bg-secondary/2 transition-all border border-transparent hover:border-secondary/5"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Info */}
                  <div className="max-w-30 sm:max-w-none">
                    <p className="text-sm md:text-base font-bold text-secondary tracking-tight truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter text-tertiary bg-tertiary/5 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-[8px] md:text-[9px] font-medium text-secondary/30 hidden sm:block">
                        {item.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p
                    className={`text-sm md:text-lg font-black tracking-tighter ${item.type === "income" ? "text-green-600" : "text-secondary"}`}
                  >
                    {item.type === "income" ? "+" : ""}
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

      {/* --- Section 4: Machine Learning (Responsive Split View) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 px-6 md:px-12 mt-10 md:mt-16">
        {/* K-Means */}
        <div className="bg-white rounded-lg p-6 md:p-8 border border-secondary/5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-secondary">
              K-Means Clustering
            </h4>
            <span className="text-[9px] md:text-[13px] font-black bg-tertiary/10 text-tertiary px-4 py-2 rounded-md uppercase">
              k=3 Optimized
            </span>
          </div>
          <div className="h-48 md:h-64 bg-secondary/2 rounded-xl border border-dashed border-secondary/50 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/4 left-1/3 w-2 h-2 md:w-3 md:h-3 bg-tertiary rounded-full shadow-[0_0_15px_rgba(30,86,205,0.4)]" />
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 md:w-3 md:h-3 bg-secondary rounded-full opacity-30" />
            <p className="text-[9px] md:text-[10px] font-bold text-secondary/20 uppercase tracking-[0.4em]">
              Spending Segments
            </p>
          </div>
        </div>

        {/* DBSCAN */}
        <div className="bg-white rounded-lg p-6 md:p-8 border border-secondary/5 shadow-sm">
          <div className="flex justify-between items-center mb-8 md:mb-10">
            <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-secondary">
              DBSCAN Anomaly
            </h4>
            <WarningCircle size={20} className="text-red-500" weight="fill" />
          </div>
          <div className="h-48 md:h-64 bg-secondary/2 rounded-xl border border-dashed border-secondary/50 flex flex-col items-center justify-center relative">
            <p className="text-3xl md:text-4xl font-black text-red-500 tracking-tighter italic">
              2
            </p>
            <p className="text-[9px] md:text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
              Outliers Detected
            </p>
          </div>
        </div>
      </div>

      {/* --- Section 5: AI Strategy Analysis (Advanced Responsive Layout) --- */}
      <div className="px-6 md:px-12 mt-10 md:mt-16">
        <div className="bg-secondary rounded-lg p-6 sm:p-8 md:p-12 text-primary shadow-2xl shadow-secondary/20 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col xl:flex-row justify-between gap-8 md:gap-12">
            {/* Left Column: Narrative */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-tertiary rounded-xl shadow-[0_0_15px_rgba(30,86,205,0.3)]">
                  <Lightning weight="fill" size={20} />
                </div>
                <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-50">
                  AI Strategy Insight
                </h3>
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-[1.2] md:leading-tight mb-4">
                "Berdasarkan analisis clustering, pengeluaran{" "}
                <span className="text-tertiary italic">Lifestyle</span> Anda
                meningkat 12%. Amankan{" "}
                <span className="underline decoration-tertiary underline-offset-8">
                  Dana Darurat
                </span>{" "}
                lebih cepat dengan membatasi cluster ini."
              </p>
            </div>

            {/* Right Column: Technical Metrics (Grid on Mobile, Stacked on XL) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex xl:flex-col gap-4 w-full xl:w-80">
              {/* Confidence Card */}
              <div className="bg-white/5 border border-white/10 p-5 rounded-md backdrop-blur-sm">
                <p className="text-[9px] md:text-[10px] font-black opacity-40 uppercase tracking-widest mb-2">
                  Confidence Score
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl md:text-3xl font-black text-tertiary tracking-tighter">
                    94.2%
                  </p>
                  <p className="text-[9px] md:text-[10px] font-bold opacity-40 mb-1 uppercase tracking-tighter">
                    High Accuracy
                  </p>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-tertiary w-[94%]" />
                </div>
              </div>

              {/* What-If Card */}
              <div className="bg-white/5 border border-white/10 p-5 rounded-md backdrop-blur-sm">
                <p className="text-[9px] md:text-[10px] font-black opacity-40 uppercase tracking-widest mb-2">
                  What-If Projection
                </p>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-center">
                    <p className="text-[8px] opacity-30 uppercase tracking-tighter font-bold">
                      Current
                    </p>
                    <p className="text-xs md:text-sm font-bold opacity-50 line-through">
                      Jan '27
                    </p>
                  </div>
                  <PaperPlaneRight
                    weight="fill"
                    className="text-tertiary animate-pulse shrink-0"
                    size={16}
                  />
                  <div className="text-center">
                    <p className="text-[8px] text-tertiary uppercase tracking-tighter font-bold">
                      Optimal
                    </p>
                    <p className="text-base md:text-lg font-black text-white">
                      Nov '26
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
