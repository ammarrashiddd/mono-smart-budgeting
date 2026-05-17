export default function Pipeline() {
  return (
    <main>
      <div className="bg-secondary text-primary rounded-xl p-8 md:p-16 overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-8 md:mb-12 opacity-60">
            Data Processing Pipeline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {/* Step 1: Ingestion & Financial Metrics */}
            <div className="group">
              <div className="text-3xl md:text-4xl font-black text-tertiary mb-3 md:mb-4 transition-transform group-hover:-translate-y-2 duration-300">
                01
              </div>
              <h4 className="text-lg font-bold mb-2">Ingestion & Metrics</h4>
              <p className="text-xs md:text-sm opacity-60 leading-relaxed font-medium">
                Data transaksi mentah di-ingest secara real-time untuk
                mengekstrak metrik finansial riil seperti akumulasi total
                pemasukan, pengeluaran, sisa saldo, dan pos anggaran terbesar.
              </p>
            </div>

            {/* Step 2: Elbow Optimization */}
            <div className="group">
              <div className="text-3xl md:text-4xl font-black text-tertiary mb-3 md:mb-4 transition-transform group-hover:-translate-y-2 duration-300">
                02
              </div>
              <h4 className="text-lg font-bold mb-2">Elbow Optimization</h4>
              <p className="text-xs md:text-sm opacity-60 leading-relaxed font-medium">
                Sistem secara otomatis mengevaluasi nilai WCSS guna menentukan
                jumlah klaster (K) yang paling optimal dan objektif berdasarkan
                variasi sebaran data transaksi unik pengguna.
              </p>
            </div>

            {/* Step 3: Behavioral Clustering */}
            <div className="group">
              <div className="text-3xl md:text-4xl font-black text-tertiary mb-3 md:mb-4 transition-transform group-hover:-translate-y-2 duration-300">
                03
              </div>
              <h4 className="text-lg font-bold mb-2">Behavioral Clustering</h4>
              <p className="text-xs md:text-sm opacity-60 leading-relaxed font-medium">
                Algoritma K-Means memproses data berdasarkan K optimal untuk
                mengelompokkan kebiasaan belanja ke dalam label User Persona
                secara akurat.
              </p>
            </div>

            {/* Step 4: AI Intelligent Diagnosis */}
            <div className="group">
              <div className="text-3xl md:text-4xl font-black text-tertiary mb-3 md:mb-4 transition-transform group-hover:-translate-y-2 duration-300">
                04
              </div>
              <h4 className="text-lg font-bold mb-2">
                AI Intelligent Diagnosis
              </h4>
              <p className="text-xs md:text-sm opacity-60 leading-relaxed font-medium">
                Gemini AI Agent menganalisis gabungan data numerik dan rumpun
                klaster untuk mendiagnosis Status Kesehatan Finansial secara
                otonom, sekaligus merumuskan solusi taktis berbasis aturan
                50/30/20.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
