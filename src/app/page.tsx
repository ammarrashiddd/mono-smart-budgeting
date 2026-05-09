"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-primary">
      {/* header */}
      <nav className="h-20 mb-15 px-6 md:px-12 bg-tertiary flex items-center justify-between shadow-sm">
        <h1 className="text-primary text-3xl md:text-4xl font-black tracking-tighter">
          MONO.
        </h1>
        <div className="flex gap-2 md:gap-4">
          <Link
            className="text-primary font-bold px-4 py-2 hover:bg-primary/10 rounded-full transition-all text-sm md:text-base"
            href="/auth/signin"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="bg-primary text-secondary font-bold px-5 py-2 rounded-full hover:scale-105 active:scale-95 transition-all text-sm md:text-base"
          >
            Get started
          </Link>
        </div>
      </nav>

      <main>
        <div className="px-6 md:px-12 ">
          {/* Label Section - Minimalist Badge */}
          <div className="inline-block px-6 py-1.5 mb-4 border-2 border-secondary rounded-md">
            <span className="text-md font-bold text-secondary">About Mono</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Kiri: Hero & Deskripsi Utama */}
            <div className="flex-1 flex flex-col justify-between">
              <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.1]">
                Built for <br />
                <span className="text-secondary">Smart Budgeting</span>
              </h1>
              <p className="max-w-xl text-lg lg:text-xl text-secondary leading-relaxed font-medium">
                Platform manajemen keuangan personal berbasis web yang
                mengintegrasikan <span>Machine Learning</span> dan{" "}
                <span>Generative AI </span>
                untuk mentransformasi data mentah menjadi wawasan strategis.
              </p>
              <div className="p-8 border-l-4 border-secondary bg-secondary/5 italic font-md text-secondary/80">
                "Bekerja secara dinamis menggunakan pendekatan Unsupervised
                Learning untuk memahami perilaku belanja unik setiap pengguna."
              </div>
            </div>

            {/* Kanan: Card Body - Modern Bento Style */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Card 1: Optimal Cluster */}
              <div className="group p-6 rounded-3xl bg-secondary/5 text-secondary shadow-md hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-2">
                      Analysis 01
                    </h4>
                    <h3 className="text-2xl font-bold mb-3">
                      Optimal Cluster Validation
                    </h3>
                    <p className="text-sm leading-relaxed">
                      Menggunakan Metode Elbow untuk menentukan jumlah klaster
                      (K) yang paling objektif secara matematis.
                    </p>
                  </div>
                  <div className="w-full md:w-40 h-28 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src="/assets/images/1.jpg"
                      className="w-full h-full object-cover"
                      alt="Visualisasi Data"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Algorithm Benchmarking - Dark Accent */}
              <div className="group p-6 rounded-3xl bg-tertiary text-primary shadow-md hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-2">
                      Analysis 02
                    </h4>
                    <h3 className="text-2xl font-bold mb-3">
                      Algorithm Benchmarking
                    </h3>
                    <p className="text-sm leading-relaxed">
                      Komparasi K-Means dan DBSCAN untuk menyeimbangkan
                      kecepatan dan deteksi transaksi tidak lazim.
                    </p>
                  </div>
                  <div className="w-full md:w-40 h-28 overflow-hidden rounded-xl bg-blue-900/50">
                    <img
                      src="/assets/images/2.jpg"
                      className="w-full h-full object-cover"
                      alt="Benchmarking"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Financial Standard */}
              <div className="group p-6 rounded-3xl bg-secondary/5 text-secondary shadow-md hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">
                      Analysis 03
                    </h4>
                    <h3 className="text-2xl font-bold mb-3">
                      Financial Standard Alignment
                    </h3>
                    <p className="text-sm leading-relaxed">
                      Integrasi aturan 50/30/20 ke dalam AI untuk memastikan
                      saran manajerial yang profesional.
                    </p>
                  </div>
                  <div className="w-full md:w-40 h-28 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src="/assets/images/3.jpg"
                      className="w-full h-full object-cover"
                      alt="Standard"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
