export default function Ai() {
  return (
    <main>
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
              "Evaluasi data mendeteksi variasi transaksi pada pos non-esensial
              telah melampaui batas aman aturan 50/30/20. Diperlukan
              restrukturisasi anggaran guna memulihkan stabilitas alokasi Target
              Dana Darurat Anda."
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
    </main>
  );
}
