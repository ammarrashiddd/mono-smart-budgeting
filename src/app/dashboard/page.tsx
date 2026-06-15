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

  // 🛠️ STATE: Menampung detail error utama untuk memblokir komponen modul analisis
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
  // 1. FUNGSI AMBIL DATA (SIKLUS SCOUTING AKTIF)
  // ========================================================
  const fetchAllAnalysisData = async () => {
    if (!session?.user) return;

    try {
      // Ambil semua data secara paralel menggunakan Promise.allSettled
      const [kmeansRes, aiRes, chartRes] = await Promise.allSettled([
        fetch("/api/analysis/kmeans"),
        fetch("/api/analysis/ai-insight"),
        fetch("/api/analysis/charts"),
      ]);

      // 🔍 LANGKAH SCOUTING 0: Pengecekan Kondisi Awal Terbuka (Belum Pernah Analisis)
      if (kmeansRes.status === "fulfilled" && kmeansRes.value.ok) {
        const checkInitial = await kmeansRes.value.clone().json();
        if (checkInitial?.hasNeverAnalyzed || checkInitial?.isInitialOpen) {
          setGlobalError({ status: false, title: "", description: "" });
          setShowAnalysis(false);
          return;
        }
      }

      // 🔍 LANGKAH SCOUTING 1: Cek Grafik Statistik
      if (
        chartRes.status === "rejected" ||
        (chartRes.status === "fulfilled" && !chartRes.value.ok)
      ) {
        triggerGlobalError(
          "Gagal Memuat Grafik Statistik",
          "Terjadi kesalahan saat mengambil visualisasi tren transaksi harian Anda dari server.",
        );
        return;
      }

      // 🔍 LANGKAH SCOUTING 2: Cek Jaringan/API K-Means
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

      // 🔍 LANGKAH SCOUTING 3: Cek Validitas Jumlah Transaksi K-Means Terbaru
      let kmeansData = await (kmeansRes.value as Response).json();

      if (
        kmeansData?.isInsufficient ||
        !kmeansData?.points ||
        kmeansData.points.length <= 6
      ) {
        // Coba bypass data cache internal server dengan force fetch terbaru
        const forceRes = await fetch("/api/analysis/kmeans?force=true");
        if (forceRes.ok) {
          const freshKmeansData = await forceRes.json();
          if (
            !freshKmeansData?.isInsufficient &&
            freshKmeansData?.points?.length > 6
          ) {
            kmeansData = freshKmeansData;
          }
        }
      }

      // Pengecekan final setelah usaha force update
      if (
        kmeansData?.isInsufficient ||
        !kmeansData?.points ||
        kmeansData.points.length <= 6
      ) {
        const totalTx = kmeansData?.points?.length || 0;
        triggerGlobalError(
          "Data Transaksi Belum Mencukupi",
          `Sistem mendeteksi transaksi pengeluaran Anda baru berjumlah ${totalTx} data. Algoritma K-Means Clustering memerlukan minimal 7 transaksi pengeluaran agar hasil pemetaan klaster akurat.`,
        );
        setMlData(kmeansData);
        return;
      }

      // 🔍 LANGKAH SCOUTING 4: Pengecekan Status Server Integrasi AI (Gemini 503 Overload)
      if (
        aiRes.status === "rejected" ||
        (aiRes.status === "fulfilled" && !aiRes.value.ok)
      ) {
        triggerGlobalError(
          "Analisis Kecerdasan Buatan Tertunda",
          "Sistem kecerdasan buatan (Gemini AI) sedang mengalami lonjakan antrean yang padat di server Google (503). Harap tekan tombol Ulangi Analisis beberapa saat lagi.",
        );
        return;
      }

      // JIKA LOLOS SELURUH TAHAPAN SCOUTING: Ambil payload bersih
      const aiInsightData = await (aiRes.value as Response).json();
      const statsChartData = await (chartRes.value as Response).json();

      // Pasang data segar ke dalam state komponen
      setMlData(kmeansData);
      setAiData(aiInsightData);
      setChartsData(statsChartData);

      // Bersihkan error lama dan hidupkan Layout Dashboard Utama
      setGlobalError({ status: false, title: "", description: "" });
      setShowAnalysis(true);
    } catch (err) {
      console.error("Gagal memuat integrasi data analisis:", err);
      triggerGlobalError(
        "Kesalahan Integrasi Sistem",
        "Terjadi kegagalan internal saat menyatukan seluruh modul analisis finansial.",
      );
    }
  };

  // Fungsi pembantu untuk memblokir layout tanpa pop-up toast
  const triggerGlobalError = (title: string, description: string) => {
    setGlobalError({ status: true, title, description });
    setShowAnalysis(false);
  };

  useEffect(() => {
    fetchAllAnalysisData();
  }, [session]);

  // ========================================================
  // 2. TRIGGER DENGAN HANDLING PILIHAN GAGAL SAAT ANALISIS ULANG
  // ========================================================
  const handleTriggerAnalysis = async () => {
    setIsAnalyzing(true);

    // RESET TOTAL: Bersihkan data lama agar sistem dipaksa menguji validitas kondisi baru dari nol
    setGlobalError({ status: false, title: "", description: "" });
    setShowAnalysis(false);
    setMlData(null);
    setAiData(null);
    setChartsData(null);

    try {
      // Kirim perintah komputasi ulang ke backend clusterizer
      const res = await fetch("/api/analysis/kmeans?force=true", {
        method: "POST",
      });

      // 🔍 FILTER KONDISI GAGAL SECARA INSTAN SAAT AKSI POST ANALISIS ULANG
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));

        if (res.status === 400 || errorData?.isInsufficient) {
          // Kasus 1: Transaksi riil kurang saat dipaksa hitung ulang oleh POST
          const totalTx = errorData?.points?.length || 0;
          triggerGlobalError(
            "Data Transaksi Belum Mencukupi",
            `Sistem mendeteksi transaksi pengeluaran Anda baru berjumlah ${totalTx} data. Algoritma K-Means Clustering memerlukan minimal 7 transaksi pengeluaran agar hasil pemetaan klaster akurat.`,
          );
        } else {
          // Kasus 2: Server Error / K-Means gagal komputasi di backend database
          triggerGlobalError(
            "Komputasi Klaster Gagal",
            "Gagal memproses perhitungan model matematika klasterisasi finansial pada database.",
          );
        }

        setIsAnalyzing(false);
        return; // 🛑 HENTIKAN KODE: Jangan lanjut panggil fetchAllAnalysisData()
      }

      // JALANKAN SYNC AMBIL DATA JIKA POST BERHASIL LOLOS (res.ok === true)
      await fetchAllAnalysisData();
    } catch (error) {
      console.error("Gagal melakukan kalkulasi ulang:", error);
      triggerGlobalError(
        "Gagal Sinkronisasi",
        "Koneksi ke server terputus saat mencoba memperbarui algoritma analisis.",
      );
    } finally {
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
            fetchAllAnalysisData();
          }}
        />
      </div>

      <div className="px-4 md:px-12 mt-6 md:mt-10">
        <Transactions
          onTransactionChange={() => {
            setStatsRefreshKey((prev) => prev + 1);
            fetchAllAnalysisData();
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
      {/* 🛠️ WIDGET STATE DATA BELUM MENCUKUPI / ERROR TUNGGAL */}
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

      {/* --- SEKSI LAYOUT UTAMA (HANYA MUNCUL JIKA SEPENUHNYA LOLOS VALIDASI) --- */}
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
