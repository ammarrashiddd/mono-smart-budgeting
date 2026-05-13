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

      {/* Goals Section */}
      <div className="flex flex-col lg:flex-row gap-8 px-6 md:px-12 mt-12">
        {/* Main Goals Display */}
        <div className="flex-[2.5] bg-white rounded-3xl p-8 border border-secondary/5 shadow-xl shadow-secondary/5">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-secondary/40">
              Financial Goals
            </h3>
            <button className="text-tertiary text-xs font-black uppercase tracking-widest hover:underline transition-all">
              Manage Targets
            </button>
          </div>

          <div className="space-y-8">
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

        {/* New Goal Action & AI Insights */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-tertiary rounded-3xl p-8 text-primary shadow-2xl shadow-tertiary/20 group relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">
                AI Advisor
              </h3>
              <p className="text-lg font-bold leading-tight">
                "You can reach your Emergency Fund 2 months faster by reducing
                your 'Wants' cluster."
              </p>
            </div>
            {/* Dekorasi halus di background card AI */}
            <div className="absolute -right-4 -bottom-4 opacity-20 transform group-hover:scale-110 transition-transform">
              <TargetIcon size={120} weight="fill" />
            </div>
          </div>

          <button className="flex-1 border-2 border-dashed border-tertiary/20 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 text-tertiary/60 hover:border-tertiary hover:text-tertiary hover:bg-tertiary/5 transition-all group">
            <div className="p-3 bg-tertiary/5 rounded-full group-hover:scale-110 transition-all">
              <Plus size={24} weight="bold" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">
              Add New Goal
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
