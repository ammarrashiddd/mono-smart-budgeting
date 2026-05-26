import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface FinancialInsightInput {
  totalPemasukan: number;
  totalPengeluaran: number;
  sisaSaldo: number;
  assignedCluster: number;
  transaksiTerakhir: Array<{
    deskripsi: string;
    nominal: number;
    tanggal: string;
  }>;
  targetKeuangan: Array<{
    title: string;
    targetAmount: number;
    currentAmount: number;
  }>;
}

export async function generateFinancialInsight(
  dataKonteks: FinancialInsightInput,
) {
  try {
    // 🛠️ HITUNG PERSENTASE RIIL UNTUK MEMUDAHKAN ANALISIS ATURAN 50/30/20 OLEH GEMINI
    // Menghindari pembagian dengan angka 0 jika pemasukan kosong
    const pemasukanPenyebut = dataKonteks.totalPemasukan || 1;
    const rasioPengeluaranTersisa = (
      (dataKonteks.totalPengeluaran / pemasukanPenyebut) *
      100
    ).toFixed(1);
    const rasioTabunganTersisa = (
      (dataKonteks.sisaSaldo / pemasukanPenyebut) *
      100
    ).toFixed(1);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Anda adalah seorang Perencana Keuangan (Financial Planner) AI yang jenius dan disiplin menguji anggaran menggunakan metode Aturan Keuangan 50/30/20.
      
      Analisis data keuangan pengguna berikut: ${JSON.stringify(dataKonteks)}.
      Sebagai panduan tambahan, rasio total pengeluaran pengguna saat ini adalah ${rasioPengeluaranTersisa}% dari total pemasukan, dan sisa saldo (potensi tabungan) mereka adalah ${rasioTabunganTersisa}% dari total pemasukan.
      
      Tugas Anda:
      1. Berikan nama 'personaName' yang kreatif, unik, dan psikologis berdasarkan pola belanja mereka (contoh: "Si Penikmat Senja Impulsif", "Master Hemat Kuadrat", "Whale Spender").
      2. Perhatikan kolom 'deskripsi' pada daftar transaksi pengeluaran (nominal negatif). Tebak kategori dari setiap deskripsi tersebut, lalu tentukan 'kategoriTerbesar' apa yang paling banyak menghabiskan uang pengguna (contoh hasil: "Makanan & Minuman", "Transportasi", "Lifestyle", atau "Kebutuhan Pokok").
      3. Tentukan 'kondisiKesehatan' finansial mereka saat ini ("Sehat", "Waspada", atau "Kritis").
      
      4. Berikan 'aiSaranText' berupa 3-4 kalimat nasihat finansial yang taktis. Anda WAJIB mengevaluasi anggaran mereka menggunakan standar ideal Aturan 50/30/20 (50% Kebutuhan Pokok/Needs, 30% Keinginan/Wants, dan 20% Tabungan atau Investasi/Savings). 
         - Bandingkan performa rasio mereka saat ini (${rasioPengeluaranTersisa}% pengeluaran vs ${rasioTabunganTersisa}% tabungan) terhadap aturan ideal tersebut.
         - Berikan kritik membangun/sentilan tajam jika alokasi 'Wants' (keinginan) mereka dari daftar deskripsi transaksi terlihat membengkak melampaui batas 30%, atau jika tabungan mereka jauh di bawah 20%.

      5. Berikan ulasan 'reviewGoals' sebanyak 1-2 kalimat yang menganalisis progres target keuangan mereka. Hubungkan apakah sisa saldo (${rasioTabunganTersisa}%) atau kebiasaan belanja mereka saat ini realistis untuk mempercepat pencapaian target/goals tersebut jika diproyeksikan dengan aturan ideal 20% investasi tabungan.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            personaName: { type: "STRING" },
            kategoriTerbesar: { type: "STRING" },
            kondisiKesehatan: { type: "STRING" },
            aiSaranText: { type: "STRING" },
            reviewGoals: { type: "STRING" },
          },
          required: [
            "personaName",
            "kategoriTerbesar",
            "kondisiKesehatan",
            "aiSaranText",
            "reviewGoals",
          ],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("Respon kosong dari Gemini AI.");
  } catch (error) {
    console.error(
      "Gagal mendapatkan analisis dari Gemini AI Service, menggunakan logik fallback:",
      error,
    );

    const isHemat = dataKonteks.assignedCluster === 0;
    const daftarTarget =
      dataKonteks.targetKeuangan?.map((g) => g.title).join(", ") ||
      "tujuan keuangan";

    // Fallback matematis sederhana yang juga mencerminkan aturan 50/30/20 secara tekstual
    return {
      personaName: isHemat
        ? "Si Hemat / Low Spender"
        : "Si Boros / High Spender",
      kategoriTerbesar: "Pengeluaran Umum (Fallback)",
      kondisiKesehatan: isHemat
        ? dataKonteks.sisaSaldo >= 0
          ? "Sehat"
          : "Waspada"
        : "Kritis",
      aiSaranText: `Gagal memuat saran otomatis dari AI. Evaluasi mandiri alokasi finansial Anda. Pastikan untuk membagi pemasukan Anda menggunakan rumus 50% untuk kebutuhan esensial, 30% untuk rekreasi/keinginan, dan minimal alokasikan 20% penuh untuk tabungan atau investasi.`,
      reviewGoals: `Tetap fokus pada target impian Anda (${daftarTarget}). Dekati porsi ideal tabungan 20% agar akselerasi pencapaian target segera terpenuhi secara realistis.`,
    };
  }
}
