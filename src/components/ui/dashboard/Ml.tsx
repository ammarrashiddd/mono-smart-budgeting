export default function MlVisualitation() {
  return (
    <main>
      <div className="bg-white rounded-xl p-6 md:p-8 border border-secondary/5 shadow-sm">
        {/* Header Section - Ramping dengan Sentuhan Warna */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 pb-4 border-b border-secondary/50">
          <div>
            <h3 className="text-lg font-black text-secondary ">
              K-Means Clustering
            </h3>
          </div>
          <div className="text-[10px] font-bold text-tertiary bg-tertiary/5 px-2.5 py-1 rounded border border-tertiary/10">
            Metode Elbow
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Box Visualisasi Scatter Plot (Berwarna Terarah) */}
          <div className="lg:col-span-2 h-60 bg-secondary/1 rounded-xl border border-secondary/50 flex flex-col items-center justify-center relative overflow-hidden p-4">
            {/* Titik Pusat Centroid (Warna Solid Penanda Klaster) */}
            <div className="absolute top-1/4 left-1/3 w-2.5 h-2.5 bg-tertiary rounded-full shadow-md z-10" />
            <div className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-md z-10" />
            <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-amber-500 rounded-full shadow-md z-10" />

            {/* Titik Anggota Klaster (Muted Dots Sesuai Warna Centroid) */}
            {/* Cluster 1 - Blue/Tertiary Group */}
            <div className="absolute top-[22%] left-[29%] w-1 h-1 bg-tertiary/60 rounded-full" />
            <div className="absolute top-[28%] left-[35%] w-1 h-1 bg-tertiary/40 rounded-full" />
            <div className="absolute top-[18%] left-[32%] w-1 h-1 bg-tertiary/30 rounded-full" />

            {/* Cluster 2 - Emerald/Green Group */}
            <div className="absolute bottom-[32%] right-[28%] w-1 h-1 bg-emerald-500/60 rounded-full" />
            <div className="absolute bottom-[38%] right-[24%] w-1 h-1 bg-emerald-500/40 rounded-full" />
            <div className="absolute bottom-[26%] right-[22%] w-1 h-1 bg-emerald-500/30 rounded-full" />

            {/* Cluster 3 - Amber/Yellow Group */}
            <div className="absolute top-[50%] right-[35%] w-1 h-1 bg-amber-500/60 rounded-full" />
            <div className="absolute top-[54%] right-[31%] w-1 h-1 bg-amber-500/40 rounded-full" />
            <div className="absolute top-[44%] right-[38%] w-1 h-1 bg-amber-500/30 rounded-full" />
          </div>

          {/* Box Parameter Analisis Statistik K-Means (1 Kolom) */}
          <div className="flex flex-col justify-between py-1">
            <div className="space-y-4">
              {/* Metrik 1: Nilai K Optimal */}
              <div>
                <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-wider mb-0.5">
                  Optimized Cluster
                </p>
                <p className="text-xl font-bold text-secondary tracking-tight">
                  K = 3{" "}
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-1">
                    Optimal
                  </span>
                </p>
              </div>

              {/* Metrik 2: Skor WCSS/Inertia */}
              <div>
                <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-wider mb-0.5">
                  Cluster Inertia (WCSS)
                </p>
                <p className="text-xl font-bold text-secondary/80 tracking-tight">
                  0.1428{" "}
                  <span className="text-[10px] font-bold text-tertiary bg-tertiary/5 px-1.5 py-0.5 rounded ml-1">
                    Variance
                  </span>
                </p>
              </div>
            </div>

            {/* Catatan Keterangan Khas Desain Minimalis */}
            <div className="pt-4 border-t border-secondary/5 mt-6 lg:mt-0">
              <p className="text-[11px] text-secondary/50 leading-relaxed">
                Pemisahan data berbasis jarak *Euclidean* murni ini
                divisualisasikan melalui 3 rumpun warna kontras, yang kemudian
                disuplai sebagai parameter utama diagnosis bimbingan finansial
                oleh AI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
