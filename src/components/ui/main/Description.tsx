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
              Built for <br />
              <span className="text-secondary">Smart Budgeting</span>
            </h1>
            <p className="max-w-xl text-md md:text-lg lg:text-xl text-secondary leading-relaxed font-medium mt-4 md:mt-6">
              Platform manajemen keuangan personal berbasis web yang
              mengintegrasikan{" "}
              <span className="font-bold">Machine Learning</span> dan{" "}
              <span className="font-bold">Generative AI </span>
              untuk mentransformasi data mentah menjadi wawasan strategis.
            </p>
          </div>

          <div className="p-6 md:p-8 border-l-4 border-secondary bg-secondary/5 italic font-md text-secondary/80 text-sm md:text-base">
            "Bekerja secara dinamis menggunakan pendekatan Unsupervised Learning
            untuk memahami perilaku belanja unik setiap pengguna."
          </div>
        </div>

        {/* Kanan: Card Body - Modern Bento Style */}
        <div className="flex-1 flex flex-col gap-4 md:gap-6">
          {/* Card 1: Optimal Cluster */}
          <div className="group p-5 md:p-6 rounded-lg bg-secondary/5 text-secondary shadow-md hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <div className="flex-1">
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2 opacity-60">
                  Analysis 01
                </h4>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">
                  Optimal Cluster Validation
                </h3>
                <p className="text-xs md:text-sm leading-relaxed opacity-80">
                  Menggunakan Metode Elbow untuk menentukan jumlah klaster (K)
                  yang paling objektif secara matematis.
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
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <div className="flex-1">
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2 opacity-60">
                  Analysis 02
                </h4>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">
                  Hybrid Financial Pattern Analysis
                </h3>
                <p className="text-xs md:text-sm leading-relaxed opacity-80">
                  Panel dashboard yang mengombinasikan kalkulasi statistik riil
                  dengan label User Persona hasil klastering K-Means.
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
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <div className="flex-1">
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2 opacity-60">
                  Analysis 03
                </h4>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">
                  Financial Standard Alignment
                </h3>
                <p className="text-xs md:text-sm leading-relaxed opacity-80">
                  Integrasi aturan 50/30/20 ke dalam AI untuk memastikan saran
                  manajerial yang profesional.
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
