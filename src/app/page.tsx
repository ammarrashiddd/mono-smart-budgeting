"use client";

import Navbar from "@/components/nav/Navbar";
import { Lightning, PaperPlaneRight, Plus } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const Router = useRouter();
  return (
    <div className="bg-primary h-screen w-full overflow-x-hidden">
      {/* header */}
      <nav className="h-20 mb-10 px-6 md:px-12 bg-tertiary flex items-center shadow-sm">
        <Navbar />
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
              <div className="group p-6 rounded-lg bg-secondary/5 text-secondary shadow-md hover:shadow-2xl transition-all duration-300">
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
              <div className="group p-6 rounded-lg bg-tertiary text-primary shadow-md hover:shadow-2xl transition-all duration-300">
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
              <div className="group p-6 rounded-lg bg-secondary/5 text-secondary shadow-md hover:shadow-2xl transition-all duration-300">
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

        {/* --- Section: The Workflow (System Pipeline) --- */}
        <div className="px-6 md:px-12 mt-15">
          <div className="bg-secondary text-primary rounded-lg p-8 md:p-16 overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-12 opacity-60">
                Data Processing Pipeline
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Step 1 */}
                <div className="group">
                  <div className="text-4xl font-black text-tertiary mb-4 transition-transform group-hover:-translate-y-2 duration-300">
                    01
                  </div>
                  <h4 className="text-lg font-bold mb-2">Ingestion</h4>
                  <p className="text-sm opacity-60 leading-relaxed font-medium">
                    Data transaksi mentah diunggah dan dibersihkan melalui tahap
                    *preprocessing* untuk menghilangkan noise.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="group">
                  <div className="text-4xl font-black text-tertiary mb-4 transition-transform group-hover:-translate-y-2 duration-300">
                    02
                  </div>
                  <h4 className="text-lg font-bold mb-2">Clustering</h4>
                  <p className="text-sm opacity-60 leading-relaxed font-medium">
                    Algoritma K-Means mengelompokkan pengeluaran ke dalam
                    kategori Lifestyle, Needs, dan Bills secara otomatis.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="group">
                  <div className="text-4xl font-black text-tertiary mb-4 transition-transform group-hover:-translate-y-2 duration-300">
                    03
                  </div>
                  <h4 className="text-lg font-bold mb-2">Anomaly Detection</h4>
                  <p className="text-sm opacity-60 leading-relaxed font-medium">
                    DBSCAN memindai *outliers* untuk mendeteksi pengeluaran
                    tidak wajar yang berpotensi merusak anggaran.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="group">
                  <div className="text-4xl font-black text-tertiary mb-4 transition-transform group-hover:-translate-y-2 duration-300">
                    04
                  </div>
                  <h4 className="text-lg font-bold mb-2">AI Inference</h4>
                  <p className="text-sm opacity-60 leading-relaxed font-medium">
                    LLM (Gemini) menerima hasil klaster dan memberikan saran
                    strategi finansial dalam bahasa alami.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Section: Get Started (Image Background Style) --- */}
        <div className="px-6 md:px-12 mt-20 mb-20">
          <div className="relative h-100 md:h-125 w-full rounded-lg overflow-hidden shadow-2xl">
            <img
              src="/assets/images/4.jpg"
              alt="Workspace"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Black Overlay - Menjaga keterbacaan teks */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-8">
                Mulai langkah pertamamu.
              </h2>

              <button
                className="px-10 py-4 bg-white text-secondary font-black rounded-full hover:bg-tertiary hover:text-white transition-all duration-300 shadow-lg scale-100 hover:scale-105 active:scale-95"
                onClick={() => {
                  Router.push("/auth?mode=signup");
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
