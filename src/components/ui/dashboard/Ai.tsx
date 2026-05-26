"use client";

import AiSkeleton from "@/components/skeleton/AiSkeleton";
import { InvoiceIcon } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

interface AiInsightData {
  personaName: string;
  kategoriTerbesar: string;
  kondisiKesehatan: string;
  aiSaranText: string;
}

interface GoalItem {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
}

// Menentukan kontrak tipe data Props agar terintegrasi dengan DashboardPage parent
interface AiProps {
  data: AiInsightData | null;
  isLoading: boolean;
}

export default function Ai({ data, isLoading }: AiProps) {
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(true);

  // Fetch data goals saat komponen dimount
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch("/api/goals");
        if (res.ok) {
          const data = await res.json();
          setGoals(data);
        }
      } catch (err) {
        console.error("Gagal memuat data tujuan keuangan:", err);
      } finally {
        setGoalsLoading(false);
      }
    };

    fetchGoals();

    // Listen untuk update transaksi
    const handleTransactionUpdate = () => {
      fetchGoals();
    };
    window.addEventListener("transaction-updated", handleTransactionUpdate);
    return () => {
      window.removeEventListener(
        "transaction-updated",
        handleTransactionUpdate,
      );
    };
  }, []);

  // Helper function untuk generate goals review text
  const generateGoalsReview = (): string => {
    if (goals.length === 0) {
      return "Anda belum memiliki tujuan keuangan yang ditetapkan. Mulai tentukan target keuangan Anda untuk mencapai kesuksesan finansial jangka panjang.";
    }

    const totalProgress = goals.reduce(
      (sum, goal) => sum + (goal.currentAmount / goal.targetAmount) * 100,
      0,
    );
    const avgProgress = Math.round(totalProgress / goals.length);
    const completedGoals = goals.filter(
      (g) => g.currentAmount >= g.targetAmount,
    ).length;

    if (avgProgress >= 100) {
      return `Luar biasa! Anda telah mencapai ${completedGoals} dari ${goals.length} tujuan keuangan. Pertahankan momentum ini dengan menetapkan target baru yang lebih ambisius.`;
    } else if (avgProgress >= 75) {
      return `Anda berada di jalur yang sangat baik dengan rata-rata kemajuan ${avgProgress}%. Terus fokus untuk menyelesaikan sisa tujuan keuangan Anda dalam waktu dekat.`;
    } else if (avgProgress >= 50) {
      return `Kemajuan ${avgProgress}% terhadap tujuan keuangan Anda menunjukkan komitmen yang solid. Pertahankan konsistensi penghematan untuk mencapai target lebih cepat.`;
    } else {
      return `Anda memiliki ${goals.length} tujuan keuangan dengan kemajuan ${avgProgress}%. Mulai tingkatkan tabungan rutin untuk mempercepat pencapaian target Anda.`;
    }
  };
  // ========================================================
  // 1. KONDISI TAMPILAN SKELETON (SAAT PROSES HITUNG/FETCH BERJALAN)
  // ========================================================
  // Mengunci tampilan agar tetap berdenyut selama state global parent masih memuat data baru
  if (isLoading || !data || goalsLoading) {
    return <AiSkeleton />;
  }

  // ========================================================
  // 2. KONDISI ERROR AMAN (PENCEGAHAN RACE CONDITION)
  // ========================================================
  // Hanya dipicu jika proses memuat data selesai total, namun backend mengembalikan nilai kosong
  if (!isLoading && !data) {
    return (
      <div className="bg-secondary rounded-xl p-6 border border-red-500/10 text-center w-full">
        <p className="text-sm text-red-400 font-medium">
          Gagal memuat Gemini AI Insights dari database.
        </p>
      </div>
    );
  }

  // ========================================================
  // 3. TAMPILAN UTAMA DINAMIS (JIKA DATA BARU SUDAH SIAP)
  // ========================================================
  return (
    <main className="w-full">
      <div className="bg-secondary rounded-xl p-6 md:p-8 border border-secondary/5">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          {/* Kolom Kiri: Dua Paragraf Terpisah */}
          <div className="flex-1 space-y-6">
            {/* Paragraf 1: AI Saran Text */}
            <div className="space-y-4">
              <div className="flex items-center gap-1.5">
                <h4 className="text-lg font-black uppercase text-primary/80">
                  Gemini AI Insights • {data.personaName}
                </h4>
              </div>

              <p className="text-lg md:text-xl font-medium text-primary/80 leading-relaxed">
                {data.aiSaranText}
              </p>
            </div>

            {/* Separator */}
            <div className="border border-primary/5"></div>

            {/* Paragraf 2: Goals Review */}
            <div className="space-y-4">
              <div className="flex items-center gap-1.5">
                <h4 className="text-lg font-black uppercase text-primary/80">
                  Goals Review
                </h4>
              </div>

              <p className="text-base md:text-lg font-medium text-primary/70 leading-relaxed">
                {generateGoalsReview()}
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Status Kesehatan Finansial */}
          <div className="w-full lg:w-64 shrink-0 border-t lg:border-t-0 lg:border-l border-primary/5 pt-6 lg:pt-0 lg:pl-6">
            <div>
              <p className="text-xs font-bold text-primary/40 uppercase mb-2">
                Financial Health
              </p>

              <div className="flex items-center gap-2 mb-3">
                <p
                  className={`text-2xl font-black uppercase ${
                    data.kondisiKesehatan.toLowerCase() === "sehat"
                      ? "text-emerald-500/80"
                      : data.kondisiKesehatan.toLowerCase() === "kritis"
                        ? "text-red-500/80"
                        : "text-amber-500/80"
                  }`}
                >
                  {data.kondisiKesehatan}
                </p>
              </div>

              <p className="text-[11px] text-primary/50 leading-relaxed font-medium">
                {data.kondisiKesehatan.toLowerCase() === "sehat"
                  ? "Arus kas Anda seimbang. Alokasi pemasukan berhasil menutup pos pengeluaran dengan sangat baik."
                  : data.kondisiKesehatan.toLowerCase() === "kritis"
                    ? "Peringatan! Akumulasi pengeluaran Anda sudah melampaui batas aman sisa saldo efektif."
                    : "Rasio akumulasi pengeluaran bulanan berjalan mendesak kapasitas sisa saldo efektif Anda."}
              </p>
            </div>

            <div className="border border-primary/5 my-5"></div>

            {/* Kategori Terbesar */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-primary/40 uppercase">
                  Kategori Terbesar
                </span>
              </div>

              <p className="text-2xl lg:text-3xl font-black text-primary/60 leading-none truncate">
                {data.kategoriTerbesar}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
