export default function Description() {
  return (
    <main>
      {/* Label Section - Minimalist Badge */}
      <div className="inline-block px-4 md:px-6 py-1.5 mb-6 md:mb-4 border-2 border-secondary rounded-md">
        <span className="text-xs md:text-md font-bold text-secondary uppercase tracking-wider">
          About Mono
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Kiri: Hero & Deskripsi Utama */}
        <div className="flex-1 flex flex-col justify-between gap-8 lg:gap-0">
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.1] mb-6 md:mb-0">
              Asisten Pintar Atur Uang Bulanan
            </h1>
            <p className="max-w-xl text-md md:text-lg lg:text-xl text-secondary leading-relaxed font-medium mt-4 md:mt-6">
              Aplikasi pencatat keuangan otomatis yang memanfaatkan kecerdasan
              buatan untuk membaca kebiasaan belanja Anda. Mengubah angka-angka
              rumit menjadi saran keuangan yang santai, tepat, dan mudah
              dipahami.
            </p>
          </div>

          <div className="p-6 md:p-8 border-l-4 border-secondary bg-secondary/5 italic font-md text-secondary/80 text-sm md:text-base">
            "Sistem otomatis kami mempelajari gaya hidup dan cara Anda
            menghabiskan uang secara mandiri, memberikan perhatian khusus pada
            setiap jenis pengeluaran Anda."
          </div>
        </div>

        {/* Kanan: Card Body - Modern Bento Style */}
        <div className="flex-1 flex flex-col gap-4 md:gap-6">
          {/* Card 1: Optimal Cluster */}
          <div className="group p-5 md:p-6 rounded-lg bg-secondary/5 text-secondary shadow-md hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center justify-center">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-5">
                  Pengelompokan Uang Otomatis
                </h3>
                <p className="text-xs md:text-sm leading-relaxed opacity-80">
                  Sistem langsung memilah dan mengelompokkan riwayat pengeluaran
                  Anda ke dalam kategori yang pas secara adil dan akurat, tanpa
                  perlu Anda atur manual.
                </p>
              </div>
              <div className="w-full sm:w-32 md:w-40 h-24 md:h-28 overflow-hidden rounded-xl bg-slate-100 shrink-0">
                <img
                  src="/assets/images/1.jpg"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Visualisasi Data"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Algorithm Benchmarking - Dark Accent */}
          <div className="group p-5 md:p-6 rounded-lg bg-tertiary text-primary shadow-md hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center justify-center">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-5">
                  Buku Harian Sifat Belanja
                </h3>
                <p className="text-xs md:text-sm leading-relaxed opacity-80">
                  Dasbor pintar yang menggabungkan angka pengeluaran nyata Anda
                  dengan penilaian sifat belanja Anda bulan ini, apakah Anda
                  sedang berhemat atau mulai boros.
                </p>
              </div>
              <div className="w-full sm:w-32 md:w-40 h-24 md:h-28 overflow-hidden rounded-xl bg-blue-900/50 shrink-0">
                <img
                  src="/assets/images/2.jpg"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Benchmarking"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Financial Standard */}
          <div className="group p-5 md:p-6 rounded-lg bg-secondary/5 text-secondary shadow-md hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center justify-center">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-5">
                  Panduan Aturan Keuangan Ideal
                </h3>
                <p className="text-xs md:text-sm leading-relaxed opacity-80">
                  Kecerdasan buatan kami memakai standar rumus keuangan dunia
                  (50% kebutuhan, 30% keinginan, 20% tabungan) untuk menjaga
                  dompet Anda tetap sehat.
                </p>
              </div>
              <div className="w-full sm:w-32 md:w-40 h-24 md:h-28 overflow-hidden rounded-xl bg-slate-100 shrink-0">
                <img
                  src="/assets/images/3.jpg"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Standard"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
