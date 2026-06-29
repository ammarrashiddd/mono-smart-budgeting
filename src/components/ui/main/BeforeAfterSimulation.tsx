import { useState } from "react";

export default function BeforeAfterSimulation() {
  const [activeTab, setActiveTab] = useState("mono");

  return (
    <section className="text-secondary">
      <div className="max-w-full mx-auto">
        {/* Label Section - Disamakan dengan gaya About Mono */}
        <div className="inline-block px-4 md:px-6 py-1.5 mb-6 border-2 border-secondary rounded-md">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">
            Comparison
          </span>
        </div>

        {/* Judul Seksi - Meniru tipografi Hero Description */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] max-w-2xl">
            Masih Zaman Catat Uang Secara Manual?
          </h2>
          <p className="text-secondary/80 max-w-md text-sm md:text-base font-medium">
            Lihat perbandingan bagaimana asisten pintar kami mengubah cara ribet
            menjadi super simpel.
          </p>
        </div>

        {/* Tab Kontrol - Menggunakan variasi warna secondary/5 */}
        <div className="flex justify-start mb-8">
          <div className="inline-flex p-1 bg-secondary/5 border border-secondary/10 rounded-md gap-1">
            <button
              onClick={() => setActiveTab("manual")}
              className={`px-5 py-2 text-xs md:text-sm font-bold uppercase tracking-wider rounded-md cursor-pointer transition-all duration-200 ${
                activeTab === "manual"
                  ? "bg-red-600 text-primary shadow-sm"
                  : "text-secondary/60 hover:text-secondary"
              }`}
            >
              Cara Lama (Ribet)
            </button>
            <button
              onClick={() => setActiveTab("mono")}
              className={`px-5 py-2 text-xs md:text-sm font-bold uppercase tracking-wider rounded-md cursor-pointer transition-all duration-200 ${
                activeTab === "mono"
                  ? "bg-tertiary text-primary shadow-sm"
                  : "text-secondary/60 hover:text-secondary"
              }`}
            >
              Cara MONO (Pintar)
            </button>
          </div>
        </div>

        {/* Area Konten Simulasi - Menggunakan skema Bento Card Style */}
        <div className="bg-white rounded-lg border-2 border-secondary/10 overflow-hidden min-h-85 flex flex-col md:flex-row transition-all duration-300">
          {/* Sisi Kiri: Visualisasi Status / Kondisi */}
          <div
            className={`p-8 md:w-2/5 flex flex-col justify-center items-center text-center transition-all duration-500 ${
              activeTab === "manual"
                ? "bg-red-600 text-primary border-b md:border-b-0 md:border-r border-secondary/10"
                : "bg-tertiary text-primary"
            }`}
          >
            <span className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">
              {activeTab === "manual" ? "🤯" : "😎"}
            </span>
            <h3 className="text-2xl font-extrabold tracking-tight mb-2">
              {activeTab === "manual" ? "Bikin Pusing" : "Tenang & Beres"}
            </h3>
            <p className={`text-xs md:text-sm font-medium opacity-80 max-w-xs`}>
              {activeTab === "manual"
                ? "Banyak waktu terbuang hanya untuk urusan angka."
                : "Biarkan teknologi kecerdasan buatan bekerja untuk Anda."}
            </p>
          </div>

          {/* Sisi Kanan: Poin-Poin Detail */}
          <div className="p-8 md:w-3/5 flex flex-col justify-center bg-secondary/5">
            {activeTab === "manual" ? (
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-secondary font-bold mr-3 text-lg">
                    ✕
                  </span>
                  <p className="text-secondary/90 text-sm md:text-base font-medium">
                    Harus ketik rumus Excel manual atau catat di buku satu per
                    satu.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary font-bold mr-3 text-lg">
                    ✕
                  </span>
                  <p className="text-secondary/90 text-sm md:text-base font-medium">
                    Kategori{" "}
                    <span className="underline decoration-2">"Lain-lain"</span>{" "}
                    menumpuk dan membingungkan di akhir bulan.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary font-bold mr-3 text-lg">
                    ✕
                  </span>
                  <p className="text-secondary/90 text-sm md:text-base font-medium">
                    Melihat angka doang, tetap bingung uang habis buat apa saja.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary font-bold mr-3 text-lg">
                    ✕
                  </span>
                  <p className="text-secondary/90 text-sm md:text-base font-medium">
                    Baru sadar dompet kritis saat saldo ATM sudah benar-benar
                    sekarat.
                  </p>
                </li>
              </ul>
            ) : (
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-secondary font-bold mr-3 text-lg">
                    ✓
                  </span>
                  <p className="text-secondary/90 text-sm md:text-base font-medium">
                    Cukup masukkan angka pengeluaran, sistem rapikan semuanya.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary font-bold mr-3 text-lg">
                    ✓
                  </span>
                  <p className="text-secondary/90 text-sm md:text-base font-medium">
                    AI otomatis membedah isi catatan dan mengelompokkan
                    kategorinya.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary font-bold mr-3 text-lg">
                    ✓
                  </span>
                  <p className="text-secondary/90 text-sm md:text-base font-medium">
                    Grafik titik interaktif yang langsung dibaca lewat sekali
                    sentuh.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary font-bold mr-3 text-lg">
                    ✓
                  </span>
                  <p className="text-secondary/90 text-sm md:text-base font-medium">
                    Dapat rapor sifat belanja dan peringatan dini langsung dari
                    AI.
                  </p>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
