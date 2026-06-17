import { useState } from "react";

export default function BeforeAfterSimulation() {
  const [activeTab, setActiveTab] = useState("mono");

  return (
    <section className="py-6 px-4 text-gray-900 font-sans">
      <div className="max-w-4xl mx-auto text-center">
        {/* Judul Seksi */}
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          Masih Zaman Catat Uang Secara Manual?
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-10 text-base md:text-lg">
          Lihat perbandingan bagaimana asisten pintar kami mengubah cara ribet
          jadi super simpel.
        </p>

        {/* Tab Kontrol */}
        <div className="inline-flex p-1.5 bg-gray-200 rounded-xl mb-12 gap-2 shadow-inner">
          <button
            onClick={() => setActiveTab("manual")}
            className={`px-6 py-2.5 text-sm font-bold rounded-lg cursor-pointer transition-all duration-200 ${
              activeTab === "manual"
                ? "bg-red-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Cara Lama (Ribet)
          </button>
          <button
            onClick={() => setActiveTab("mono")}
            className={`px-6 py-2.5 text-sm font-bold rounded-lg cursor-pointer transition-all duration-200 ${
              activeTab === "mono"
                ? "bg-tertiary text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Cara MONO (Pintar)
          </button>
        </div>

        {/* Area Konten Simulasi */}
        <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden min-h-85 flex flex-col md:flex-row">
          {/* Sisi Kiri: Visualisasi Status / Kondisi */}
          <div
            className={`p-8 md:w-2/5 flex flex-col justify-center items-center text-white transition-all duration-300 ${
              activeTab === "manual"
                ? "bg-linear-to-br from-red-600 to-red-600"
                : "bg-linear-to-br from-tertiary to-tertiary"
            }`}
          >
            <span className="text-5xl mb-4">
              {activeTab === "manual" ? "🤯" : "😎"}
            </span>
            <h3 className="text-xl font-bold uppercase tracking-wider mb-2">
              {activeTab === "manual" ? "Bikin Pusing" : "Tenang & Beres"}
            </h3>
            <p className="text-xs opacity-90 text-center max-w-50">
              {activeTab === "manual"
                ? "Banyak waktu terbuang hanya untuk urusan angka."
                : "Biarkan teknologi kecerdasan buatan bekerja untuk Anda."}
            </p>
          </div>

          {/* Sisi Kanan: Poin-Poin Detail Masalah/Solusi */}
          <div className="p-8 md:w-3/5 flex flex-col justify-center text-left">
            {activeTab === "manual" ? (
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-red-500 font-bold mr-3 text-lg">✕</span>
                  <p className="text-gray-700 text-sm md:text-base">
                    Harus ketik rumus Excel manual atau catat di buku satu per
                    satu.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 font-bold mr-3 text-lg">✕</span>
                  <p className="text-gray-700 text-sm md:text-base">
                    Kategori <strong>"Lain-lain"</strong> menumpuk dan
                    membingungkan di akhir bulan.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 font-bold mr-3 text-lg">✕</span>
                  <p className="text-gray-700 text-sm md:text-base">
                    Melihat angka doang, tetap bingung uang habis buat apa saja.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 font-bold mr-3 text-lg">✕</span>
                  <p className="text-gray-700 text-sm md:text-base">
                    Baru sadar dompet kritis saat saldo ATM sudah benar-benar
                    sekarat.
                  </p>
                </li>
              </ul>
            ) : (
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-emerald-500 font-bold mr-3 text-lg">
                    ✓
                  </span>
                  <p className="text-gray-700 text-sm md:text-base">
                    Cukup masukkan angka pengeluaran, sistem rapikan semuanya.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 font-bold mr-3 text-lg">
                    ✓
                  </span>
                  <p className="text-gray-700 text-sm md:text-base">
                    AI otomatis membedah isi catatan dan mengelompokkan
                    kategorinya.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 font-bold mr-3 text-lg">
                    ✓
                  </span>
                  <p className="text-gray-700 text-sm md:text-base">
                    Grafik titik interaktif yang langsung dibaca lewat sekali
                    sentuh.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 font-bold mr-3 text-lg">
                    ✓
                  </span>
                  <p className="text-gray-700 text-sm md:text-base">
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
