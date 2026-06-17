export default function Pipeline() {
  return (
    <main>
      <div className="bg-secondary text-primary rounded-xl p-8 md:p-16 overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-8 md:mb-12 opacity-60">
            Cara Kerja Asisten Pintar Anda
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {/* Langkah 1: Pengumpulan Catatan */}
            <div className="group">
              <div className="text-3xl md:text-4xl font-black text-tertiary mb-3 md:mb-4 transition-transform group-hover:-translate-y-2 duration-300">
                01
              </div>
              <h4 className="text-lg font-bold mb-2">Kumpulkan Catatan</h4>
              <p className="text-xs md:text-sm opacity-60 leading-relaxed font-medium">
                Sistem langsung mengumpulkan riwayat uang masuk, uang keluar,
                sisa saldo, serta mencari tahu pengeluaran terbesar Anda
                seketika itu juga.
              </p>
            </div>

            {/* Langkah 2: Hitung Kelompok Otomatis */}
            <div className="group">
              <div className="text-3xl md:text-4xl font-black text-tertiary mb-3 md:mb-4 transition-transform group-hover:-translate-y-2 duration-300">
                02
              </div>
              <h4 className="text-lg font-bold mb-2">Bagi Kelompok Belanja</h4>
              <p className="text-xs md:text-sm opacity-60 leading-relaxed font-medium">
                Sistem secara otomatis menghitung dan menentukan jumlah
                pengelompokan belanja yang paling pas dan adil, sesuai dengan
                kebiasaan unik cara Anda memakai uang.
              </p>
            </div>

            {/* Langkah 3: Pemetaan Sifat Belanja */}
            <div className="group">
              <div className="text-3xl md:text-4xl font-black text-tertiary mb-3 md:mb-4 transition-transform group-hover:-translate-y-2 duration-300">
                03
              </div>
              <h4 className="text-lg font-bold mb-2">Baca Sifat Belanja</h4>
              <p className="text-xs md:text-sm opacity-60 leading-relaxed font-medium">
                Melalui kecerdasan buatan, semua riwayat belanja Anda dipilah
                kembali untuk melihat kecenderungan sifat asli Anda dalam
                membelanjakan uang secara akurat.
              </p>
            </div>

            {/* Langkah 4: Diagnosis & Solusi AI */}
            <div className="group">
              <div className="text-3xl md:text-4xl font-black text-tertiary mb-3 md:mb-4 transition-transform group-hover:-translate-y-2 duration-300">
                04
              </div>
              <h4 className="text-lg font-bold mb-2">Rekomendasi Pintar AI</h4>
              <p className="text-xs md:text-sm opacity-60 leading-relaxed font-medium">
                Asisten AI menganalisis seluruh data untuk menilai kesehatan
                dompet Anda, sekaligus memberikan tips nyata berdasarkan rumus
                keuangan ideal (50/30/20).
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
