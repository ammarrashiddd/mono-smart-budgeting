"use client";

import { InvoiceIcon } from "@phosphor-icons/react";

interface AiInsightData {
  personaName: string;
  kategoriTerbesar: string;
  kondisiKesehatan: string;
  aiSaranText: string;
}

// Menentukan kontrak tipe data Props agar terintegrasi dengan DashboardPage parent
interface AiProps {
  data: AiInsightData | null;
  isLoading: boolean;
}

export default function Ai({ data, isLoading }: AiProps) {
  // ========================================================
  // 1. KONDISI TAMPILAN SKELETON (SAAT PROSES HITUNG/FETCH BERJALAN)
  // ========================================================
  // Mengunci tampilan agar tetap berdenyut selama state global parent masih memuat data baru
  if (isLoading || !data) {
    return (
      <div className="bg-secondary rounded-xl p-6 md:p-8 border border-secondary/5 animate-pulse w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          {/* Skeleton Kolom Kiri */}
          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
              <div className="h-4 bg-primary/10 rounded w-48" />
            </div>
            <div className="space-y-3 pt-2">
              <div className="h-5 bg-primary/10 rounded w-full" />
              <div className="h-5 bg-primary/10 rounded w-11/12" />
              <div className="h-5 bg-primary/10 rounded w-4/5" />
            </div>
          </div>

          {/* Skeleton Kolom Kanan */}
          <div className="w-full lg:w-64 shrink-0 border-t lg:border-t-0 lg:border-l border-primary/5 pt-6 lg:pt-0 lg:pl-6 space-y-5">
            <div>
              <div className="h-3 bg-primary/10 rounded w-20 mb-3" />
              <div className="h-6 bg-primary/10 rounded w-28 mb-3" />
              <div className="h-4 bg-primary/10 rounded w-full" />
            </div>
            <div className="border border-primary/5 my-2"></div>
            <div>
              <div className="h-3 bg-primary/10 rounded w-24 mb-3" />
              <div className="h-8 bg-primary/10 rounded w-36" />
            </div>
          </div>
        </div>
      </div>
    );
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
          {/* Kolom Kiri: Fokus Diagnosis & Narasi AI */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-1.5">
              <h4 className="text-lg font-black uppercase text-primary/80">
                Gemini AI Insights • {data.personaName}
              </h4>
            </div>

            <p className="text-lg md:text-xl font-bold text-primary/80 leading-relaxed">
              "{data.aiSaranText}"
            </p>
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
