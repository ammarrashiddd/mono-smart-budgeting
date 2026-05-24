"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/nav/Navbar";
import Ai from "@/components/ui/dashboard/Ai";
import Goals from "@/components/ui/dashboard/Goals";
import Ml from "@/components/ui/dashboard/Ml";
import { Stats } from "@/components/ui/dashboard/Stats";
import Transactions from "@/components/ui/dashboard/Transactions";
import { useSession } from "next-auth/react";
import { ChartBar, Sparkle } from "@phosphor-icons/react";
import Charts from "@/components/ui/dashboard/Charts";

export default function DashboardPage() {
  const { data: session } = useSession();
  const username = session?.user?.name;
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  // State untuk mengontrol tampilan analisis ML & AI
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // State sentral untuk menampung hasil fetch riil dari database
  const [mlData, setMlData] = useState<any>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [chartsData, setChartsData] = useState<any>(null);

  // ========================================================
  // 1. FUNGSI PARALEL UNTUK MENGAMBIL DATA DARI BACKEND
  // ========================================================
  const fetchAllAnalysisData = async () => {
    if (!session?.user) return;

    try {
      // 🔥 PERBAIKAN: Tangkap res ketiga (chartRes) di dalam Promise.all
      const [kmeansRes, aiRes, chartRes] = await Promise.all([
        fetch("/api/analysis/kmeans"),
        fetch("/api/analysis/ai-insight"),
        fetch("/api/analysis/charts"), // Endpoint data statistik grafik
      ]);

      // Jika user belum pernah kalkulasi, sembunyikan seksi analisis
      if (kmeansRes.status === 404 || aiRes.status === 404) {
        setShowAnalysis(false);
        return;
      }

      if (kmeansRes.ok && aiRes.ok && chartRes.ok) {
        const kmeansData = await kmeansRes.json();
        const aiInsightData = await aiRes.json();
        const statsChartData = await chartRes.json(); // 🔥 Ambil JSON data grafik

        // Simpan data riil ke dalam state induk masing-masing
        setMlData(kmeansData);
        setAiData(aiInsightData);
        setChartsData(statsChartData); // 🔥 PERBAIKAN: Masukkan ke state chartsData

        // Tampilkan seksi analisis jika koordinat K-Means valid
        if (kmeansData?.points && kmeansData.points.length > 0) {
          setShowAnalysis(true);
        }
      }
    } catch (err) {
      console.error("Gagal memuat integrasi data analisis:", err);
    }
  };

  // Cek cache database secara otomatis saat komponen pertama kali dimuat
  useEffect(() => {
    fetchAllAnalysisData();
  }, [session]);

  // ========================================================
  // 2. FUNGSI MANUAL SAAT TOMBOL DIKLIK (RESET & HITUNG ULANG)
  // ========================================================
  const handleTriggerAnalysis = async () => {
    // Kunci tombol dan aktifkan loading skeleton komponen anak
    setIsAnalyzing(true);

    try {
      // JIKA RE-RUN: Hapus cache lama di tabel KmeansCache & AiInsight melalui API reset
      if (showAnalysis) {
        const resetRes = await fetch("/api/analysis/reset", {
          method: "DELETE",
        });

        if (!resetRes.ok) {
          throw new Error("Gagal membersihkan cache lama di database");
        }

        // Kosongkan state data agar layout langsung bertransisi menjadi skeleton sekejap
        setMlData(null);
        setAiData(null);
      }

      // PICU HITUNG ULANG K-MEANS & PEMANGGILAN ULANG GEMINI AI (POST)
      const res = await fetch("/api/analysis/kmeans?force=true", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Gagal memproses perhitungan algoritma pada backend.");
      }

      // Ambil hasil perhitungan segar yang baru saja masuk ke database
      await fetchAllAnalysisData();
    } catch (error) {
      console.error("Gagal melakukan kalkulasi ulang:", error);
    } finally {
      // Matikan loading state setelah seluruh alur pengunduhan data rampung
      setIsAnalyzing(false);
    }
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

      {/* --- Section 1: Stats --- */}
      <div className="px-4 md:px-12 mt-6 md:mt-10">
        <Stats refreshKey={statsRefreshKey} />
      </div>

      {/* --- Section 2: Goals --- */}
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

      {/* --- SEKSI ANALISIS: OTOMATIS BERUBAH JADI SKELETON SAAT PROSES RUNNING --- */}
      {(showAnalysis || isAnalyzing) && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 joint-analysis-wrapper space-y-6">
          {/* chart */}
          <div className="px-4 md:px-12 mt-8">
            <Charts data={chartsData} isLoading={isAnalyzing} />
          </div>

          {/* ml */}
          <div className="px-4 md:px-12">
            <Ml data={mlData} isLoading={isAnalyzing} />
          </div>

          {/* ai */}
          <div className="px-4 md:px-12">
            <Ai data={aiData} isLoading={isAnalyzing} />
          </div>
        </div>
      )}
    </main>
  );
}
