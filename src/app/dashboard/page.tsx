"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/nav/Navbar";
import Ai from "@/components/ui/dashboard/Ai";
import Goals from "@/components/ui/dashboard/Goals";
import Ml from "@/components/ui/dashboard/Ml";
import { Stats } from "@/components/ui/dashboard/Stats";
import Transactions from "@/components/ui/dashboard/Transactions";
import { useSession } from "next-auth/react";
import { ChartBar, Sparkle, WarningCircle } from "@phosphor-icons/react";
import Charts from "@/components/ui/dashboard/Charts";

export default function DashboardPage() {
  const { data: session } = useSession();
  const username = session?.user?.name;
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // 🛠️ STATE BARU: Menampung satu detail error utama untuk memblokir halaman
  const [globalError, setGlobalError] = useState<{
    status: boolean;
    title: string;
    description: string;
  }>({
    status: false,
    title: "",
    description: "",
  });

  const [mlData, setMlData] = useState<any>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [chartsData, setChartsData] = useState<any>(null);

  // ========================================================
  // 1. FUNGSI AMBIL DATA DENGAN BLOCKING ERROR HANDLER
  // ========================================================
  const fetchAllAnalysisData = async () => {
    if (!session?.user) return;

    // Reset status error sebelum melakukan penyisiran (scouting)
    setGlobalError({ status: false, title: "", description: "" });

    try {
      // Ambil semua data secara paralel menggunakan Promise.allSettled
      const [kmeansRes, aiRes, chartRes] = await Promise.allSettled([
        fetch("/api/analysis/kmeans"),
        fetch("/api/analysis/ai-insight"),
        fetch("/api/analysis/charts"),
      ]);

      // 🔍 LANGKAH SCOUTING 1: Cek apakah ada request network yang gagal/rejected
      if (
        chartRes.status === "rejected" ||
        (chartRes.status === "fulfilled" && !chartRes.value.ok)
      ) {
        triggerGlobalError(
          "Gagal Memuat Grafik Statistik",
          "Terjadi kesalahan saat mengambil visualisasi tren transaksi harian Anda dari server.",
        );
        return; // Hentikan fungsi, jangan eksekusi kode di bawahnya
      }

      if (
        kmeansRes.status === "rejected" ||
        (kmeansRes.status === "fulfilled" && !kmeansRes.value.ok)
      ) {
        triggerGlobalError(
          "Komputasi Klaster Gagal",
          "Gagal memproses perhitungan model matematika klasterisasi finansial pada database.",
        );
        return;
      }

      if (
        aiRes.status === "rejected" ||
        (aiRes.status === "fulfilled" && !aiRes.value.ok)
      ) {
        triggerGlobalError(
          "Rekomendasi AI Tidak Tersedia",
          "Modul kecerdasan buatan (Gemini AI) gagal merumuskan keputusan penasihat keuangan untuk akun Anda.",
        );
        return;
      }

      // 🔍 LANGKAH SCOUTING 2: Cek validasi payload internal data (Misal: Transaksi Kurang)
      const kmeansData = await (kmeansRes.value as Response).json();

      if (
        kmeansData?.isInsufficient ||
        !kmeansData?.points ||
        kmeansData.points.length <= 6
      ) {
        const totalTx = kmeansData?.points?.length || 0;
        triggerGlobalError(
          "Data Transaksi Belum Mencukupi",
          `Sistem mendeteksi transaksi pengeluaran Anda baru berjumlah ${totalTx} data. Algoritma K-Means Clustering memerlukan minimal lebih dari 6 transaksi pengeluaran agar hasil pemetaan klaster akurat.`,
        );
        setMlData(kmeansData); // Tetap simpan untuk referensi jumlah data
        return;
      }

      // 🎯 JIKA SEMUA API AMAN & LOLOS VALIDASI
      const aiInsightData = await (aiRes.value as Response).json();
      const statsChartData = await (chartRes.value as Response).json();

      setMlData(kmeansData);
      setAiData(aiInsightData);
      setChartsData(statsChartData);

      // Tampilkan ketiga komponen secara bersamaan
      setShowAnalysis(true);
    } catch (err) {
      console.error("Gagal memuat integrasi data analisis:", err);
      triggerGlobalError(
        "Kesalahan Integrasi Sistem",
        "Terjadi kegagalan internal saat menyatukan seluruh modul analisis finansial.",
      );
    }
  };

  // Fungsi pembantu untuk memblokir layout dan menyalakan panel error
  const triggerGlobalError = (title: string, description: string) => {
    setGlobalError({ status: true, title, description });
    setShowAnalysis(false); // Sembunyikan seksi analisis komponen (Charts, Ml, Ai)
  };

  useEffect(() => {
    fetchAllAnalysisData();
  }, [session]);

  const handleTriggerAnalysis = async () => {
    setIsAnalyzing(true);
    setGlobalError({ status: false, title: "", description: "" }); // Bersihkan error lama saat memproses ulang

    try {
      // Tidak perlu menghapus cache saat user menekan Ulangi Analisis.
      // Jika data transaksi tidak berubah, backend akan mendeteksi dan
      // menggunakan kembali hasil sebelumnya tanpa melakukan komputasi ulang.
      const res = await fetch("/api/analysis/kmeans?force=true", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Gagal memproses perhitungan pada backend.");
    } catch (error) {
      console.error("Gagal melakukan kalkulasi ulang:", error);
    } finally {
      await fetchAllAnalysisData();
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="bg-primary min-h-screen w-full pb-10 text-secondary">
      <nav className="h-16 md:h-20 px-4 md:px-12 bg-tertiary flex items-center border-b border-tertiary/10 shadow-sm sticky top-0 z-50">
        <Navbar name={username} />
      </nav>

      <header className="px-4 md:px-12 mt-6 md:mt-10">
        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tighter text-secondary leading-tight capitalize">
          Hello {username}
        </h3>
      </header>

      <div className="px-4 md:px-12 mt-6 md:mt-10">
        <Stats refreshKey={statsRefreshKey} />
      </div>

      <div className="px-4 md:px-12 mt-6 md:mt-10">
        <Goals
          onGoalChange={() => {
            setStatsRefreshKey((prev) => prev + 1);
            fetchAllAnalysisData(); // Otomatis cek ulang kondisi error jika ada target keuangan masuk/keluar baru
          }}
        />
      </div>

      <div className="px-4 md:px-12 mt-6 md:mt-10">
        <Transactions
          onTransactionChange={() => {
            setStatsRefreshKey((prev) => prev + 1);
            fetchAllAnalysisData(); // Otomatis cek ulang kondisi error jika ada transaksi masuk/keluar baru
          }}
        />
      </div>

      {/* --- TOMBOL AKSI ANALISIS --- */}
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

      {/* ======================================================== */}
      {/* 🛠️ WIDGET ERROR GLOBAL TUNGGAL (MENGGANTIKAN KETIGA MODUL) */}
      {/* ======================================================== */}
      {globalError.status && !isAnalyzing && (
        <div className="px-4 md:px-12 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white rounded-xl p-10 border border-secondary/5 shadow-sm flex flex-col items-center justify-center text-center min-h-70">
            <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mb-4 border border-amber-100">
              <WarningCircle size={32} weight="duotone" />
            </div>
            <h4 className="text-base font-black text-secondary tracking-tight">
              {globalError.title}
            </h4>
            <p className="text-xs text-secondary/50 max-w-md mt-2 leading-relaxed">
              {globalError.description}
            </p>
          </div>
        </div>
      )}

      {/* --- SEKSI LAYOUT UTAMA (HANYA MUNCUL JIKA KETIGANYA LOLOS FETCH & VALIDASI) --- */}
      {showAnalysis && !globalError.status && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 joint-analysis-wrapper space-y-6 mt-8">
          <div className="px-4 md:px-12">
            <Charts data={chartsData} isLoading={isAnalyzing} />
          </div>

          <div className="px-4 md:px-12">
            <Ml data={mlData} isLoading={isAnalyzing} />
          </div>

          <div className="px-4 md:px-12">
            <Ai data={aiData} isLoading={isAnalyzing} />
          </div>
        </div>
      )}
    </main>
  );
}
