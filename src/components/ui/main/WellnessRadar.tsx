export function WellnessRadar() {
  return (
    <section className="text-secondary">
      <div className="max-w-full mx-auto">
        <div className="inline-block px-4 py-1.5 mb-6 border-2 border-secondary rounded-md">
          <span className="text-xs font-bold uppercase tracking-wider">
            Rapor Ringkas
          </span>
        </div>

        <h2 className="text-4xl font-extrabold tracking-tighter mb-10 max-w-xl">
          Pantau Kesehatan Dompet Secara Real-Time
        </h2>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-secondary/5 border-2 border-secondary/10 rounded-md">
            <span className="text-xs font-bold opacity-60 block mb-2">
              STATUS KESEHATAN
            </span>
            <span className="text-2xl font-extrabold text-amber-600">
              Waspada
            </span>
            <p className="text-xs opacity-75 mt-2">
              Pengeluaran bulanan Anda mendekati batas ambang 60% alokasi.
            </p>
          </div>

          <div className="p-6 bg-secondary/5 border-2 border-secondary/10 rounded-md">
            <span className="text-xs font-bold opacity-60 block mb-2">
              KARAKTER BELANJA
            </span>
            <span className="text-2xl font-extrabold text-secondary">
              Stabil
            </span>
            <p className="text-xs opacity-75 mt-2">
              Frekuensi belanja konstan dengan ukuran nominal yang terukur aman.
            </p>
          </div>

          <div className="p-6 bg-secondary/5 border-2 border-secondary/10 rounded-md">
            <span className="text-xs font-bold opacity-60 block mb-2">
              POS TERBESAR
            </span>
            <span className="text-2xl font-extrabold text-secondary">
              Makanan dan Minuman
            </span>
            <p className="text-xs opacity-75 mt-2">
              Menyerap 42% dari total seluruh pengeluaran berjalan Anda.
            </p>
          </div>

          <div className="p-6 bg-tertiary text-primary rounded-md shadow-md">
            <span className="text-xs font-bold opacity-80 block mb-2">
              POTENSI TABUNGAN
            </span>
            <span className="text-2xl font-extrabold">Rp 1.250.000</span>
            <p className="text-xs opacity-90 mt-2">
              Sisa dana aman yang bisa Anda alokasikan langsung ke target
              impian.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
