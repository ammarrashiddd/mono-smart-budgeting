import { useState } from "react";

export default function MiniFaq() {
  // State untuk menyimpan indeks FAQ yang sedang terbuka (null artinya semua tertutup)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "Apakah data keuangan saya aman di MONO?",
      answer:
        "Sangat aman. Seluruh data transaksi Anda disimpan secara terenkripsi menggunakan Neon Database dengan proteksi ketat. Kami memprioritaskan privasi total dan tidak pernah menjual atau membagikan histori finansial Anda ke pihak ketiga manapun.",
    },
    {
      question: "Apakah saya harus menghubungkan rekening bank atau e-wallet?",
      answer:
        "Tidak perlu. MONO dirancang demi kenyamanan privasi Anda. Anda cukup memasukkan nominal angka pengeluaran secara cepat dan membiarkan kecerdasan buatan kami yang bekerja membaca polanya.",
    },
    {
      question: "Bagaimana cara AI mengelompokkan kategori belanja saya?",
      answer:
        "Aplikasi kami menggunakan algoritma klasifikasi untuk memetakan frekuensi dan ukuran nominal transaksi Anda secara otomatis. Sistem akan langsung mencocokkannya ke dalam kategori resmi yang pas tanpa perlu konfigurasi manual.",
    },
    {
      question: "Apa itu Aturan Keuangan Ideal 50/30/20 yang digunakan AI?",
      answer:
        "Ini adalah standar perencanaan finansial global yang membagi pendapatan Anda menjadi tiga pos makro: 50% untuk Kebutuhan Pokok (tagihan, makanan), 30% untuk Keinginan (hiburan, hobi), dan 20% untuk Tabungan atau Target Keuangan Anda.",
    },
    {
      question: "Bagaimana sistem membantu saya mencapai Target Keuangan?",
      answer:
        "Setiap akhir bulan, AI akan memberikan rapor evaluasi khusus (reviewGoals) yang mendeteksi apakah kebiasaan belanja Anda bulan ini mendukung atau justru menghambat progres tabungan impian yang sudah Anda tetapkan.",
    },
    {
      question: "Apakah analisis keuangan dari AI diperbarui secara real-time?",
      answer:
        "Ya. Setiap kali Anda menambahkan, mengubah, atau menghapus riwayat pengeluaran baru, mesin AI (Gemini SDK Integration) akan langsung mengalkulasi ulang rasio dan memberikan saran finansial teranyar di dasbor Anda.",
    },
  ];

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="text-secondary">
      <div className="max-w-full mx-auto">
        {/* Label Section */}
        <div className="inline-block px-4 py-1.5 mb-6 border-2 border-secondary rounded-md">
          <span className="text-xs font-bold uppercase tracking-wider">
            FAQ
          </span>
        </div>

        {/* Judul Seksi */}
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-10">
          Pertanyaan Umum
        </h2>

        {/* Accordion Container */}
        <div className="flex flex-col gap-4">
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className="rounded-lg border-2 border-secondary/10 overflow-hidden bg-secondary/5 transition-all duration-200"
              >
                {/* Tombol Pertanyaan (Header) */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 flex justify-between items-center text-left font-bold text-base md:text-lg text-secondary cursor-pointer hover:bg-secondary/5 transition-colors duration-150"
                >
                  <span>{item.question}</span>
                  {/* Ikon Indikator Plus/Minus */}
                  <span
                    className={`text-xl font-light transform transition-transform duration-200 shrink-0 ml-4`}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {/* Konten Jawaban (Bisa Dibuka/Tutup) */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-50 border-t border-secondary/10" : "max-h-0"
                  }`}
                >
                  <p className="p-5 text-sm md:text-base opacity-80 leading-relaxed font-medium">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
