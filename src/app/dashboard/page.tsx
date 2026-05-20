"use client";

import { useState } from "react";
import Navbar from "@/components/nav/Navbar";
import Ai from "@/components/ui/dashboard/Ai";
import Goals from "@/components/ui/dashboard/Goals";
import Ml from "@/components/ui/dashboard/Ml";
import { Stats } from "@/components/ui/dashboard/Stats";
import Transactions from "@/components/ui/dashboard/Transactions";
import { useSession } from "next-auth/react";
import { ChartBar, Sparkle } from "@phosphor-icons/react"; // Ditambahkan untuk ikon tombol

export default function DashboardPage() {
  const { data: session } = useSession();
  const username = session?.user?.name;
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  // State untuk mengontrol tampilan analisis ML & AI
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fungsi untuk mensimulasikan proses running algoritma ML & AI
  const handleTriggerAnalysis = () => {
    setIsAnalyzing(true);

    // Memberikan efek loading/proses hitung clustering selama 1.5 detik
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAnalysis(true);
    }, 1500);
  };

  return (
    <main className="bg-primary min-h-screen w-full pb-10 text-secondary">
      {/* navbar */}
      <nav className="h-16 md:h-20 px-4 md:px-12 bg-tertiary flex items-center border-b border-tertiary/10 shadow-sm sticky top-0 z-50">
        <Navbar name={username} />
      </nav>

      {/* header */}
      <header className="px-4 md:px-12 mt-6 md:mt-10">
        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tighter text-secondary leading-tight capitalize">
          Hello {username}, <br className="block sm:hidden" /> Welcome Back!
        </h3>
      </header>

      {/* --- Section 1: Stats (Responsive Grid) --- */}
      <div className="px-4 md:px-12 mt-6 md:mt-10">
        <Stats refreshKey={statsRefreshKey} />
      </div>

      {/* --- Section 2: Goals (Responsive List) --- */}
      <div className="px-4 md:px-12 mt-6 md:mt-10">
        <Goals />
      </div>

      {/* --- Section 3: Transaction History */}
      <div className="px-4 md:px-12 mt-6 md:mt-10">
        <Transactions
          onTransactionChange={() => setStatsRefreshKey((prev) => prev + 1)}
        />
      </div>

      {/* --- TOMBOL AKSI ANALISIS (ML & AI) --- */}
      <div className="px-4 md:px-12 mt-10 flex justify-center">
        <button
          onClick={handleTriggerAnalysis}
          disabled={isAnalyzing}
          className={`flex items-center gap-2 px-8 py-4 rounded-lg text-sm md:text-base font-black uppercase tracking-wider transition-all shadow-xl cursor-pointer ${
            isAnalyzing
              ? "bg-secondary/10 text-secondary/40 cursor-not-allowed animate-pulse"
              : "bg-tertiary text-primary hover:opacity-95 hover:scale-[1.02] shadow-tertiary/20"
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Memproses Algoritma...
            </>
          ) : showAnalysis ? (
            <>
              <Sparkle size={20} weight="fill" />
              Ulangi Analisis
            </>
          ) : (
            <>
              <ChartBar size={20} weight="bold" />
              Mulai Analisis AI & K-Means
            </>
          )}
        </button>
      </div>

      {/* --- LOADING SKELETON PLACEHOLDER --- */}
      {isAnalyzing && (
        <div className="px-4 md:px-12 mt-8 space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg p-8 border border-secondary/5 shadow-xl space-y-4 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            <div className="h-48 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
      )}

      {/* --- SEKSI ANALISIS: HANYA MUNCUL JIKA SHOWANALYSIS = TRUE --- */}
      {showAnalysis && !isAnalyzing && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 joint-analysis-wrapper">
          {/* --- Section 4: Machine Learning Visualization */}
          <div className="px-4 md:px-12 mt-8">
            <Ml />
          </div>

          {/* --- Section 5: AI Strategy Analysis */}
          <div className="px-4 md:px-12 mt-6 md:mt-10">
            <Ai />
          </div>
        </div>
      )}
    </main>
  );
}
