import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. PERBAIKAN INTERFACE: Menambahkan array targetKeuangan (Goals)
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
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Anda adalah seorang Perencana Keuangan (Financial Planner) AI yang jenius. 
      Analisis data keuangan pengguna berikut ini termasuk riwayat transaksi dan target impian/tujuan keuangan mereka: ${JSON.stringify(dataKonteks)}.
      
      Tugas Anda:
      1. Berikan nama 'personaName' yang kreatif, unik, dan psikologis berdasarkan pola belanja mereka (contoh: "Si Penikmat Senja Impulsif", "Master Hemat Kuadrat", "Whale Spender").
      2. Perhatikan kolom 'deskripsi' pada daftar transaksi pengeluaran (nominal negatif). Tebak kategori dari setiap deskripsi tersebut, lalu tentukan 'kategoriTerbesar' apa yang paling banyak menghabiskan uang pengguna (contoh hasil: "Makanan & Minuman", "Transportasi", "Lifestyle", atau "Kebutuhan Pokok").
      3. Tentukan 'kondisiKesehatan' finansial mereka saat ini ("Sehat", "Waspada", atau "Kritis").
      4. Berikan 'aiSaranText' berupa 2-3 kalimat nasihat finansial yang taktis, solutif, dan menyentil kebiasaan buruk mereka berdasarkan nama-nama deskripsi transaksi pengeluaran mereka.
      5. Berikan ulasan 'reviewGoals' sebanyak 1-2 kalimat yang menganalisis progres target keuangan mereka. Hubungkan apakah sisa saldo atau kebiasaan belanja mereka saat ini realistis untuk mempercepat pencapaian target/goals tersebut.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            personaName: { type: "STRING" },
            kategoriTerbesar: { type: "STRING" },
            kondisiKesehatan: { type: "STRING" },
            aiSaranText: { type: "STRING" },
            reviewGoals: { type: "STRING" }, // <-- Ditambahkan ke dalam Schema JSON
          },
          required: [
            "personaName",
            "kategoriTerbesar",
            "kondisiKesehatan",
            "aiSaranText",
            "reviewGoals", // <-- Wajib diisi oleh Gemini
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

    // Mengecek apakah ada nama target finansial yang bisa dimasukkan ke teks fallback
    const daftarTarget =
      dataKonteks.targetKeuangan?.map((g) => g.title).join(", ") ||
      "tujuan keuangan";

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
      aiSaranText:
        "Gagal memuat saran otomatis dari AI. Evaluasi mandiri pola pengeluaran Anda saat ini.",
      // Fallback untuk ulasan goals jika Gemini gagal merespons
      reviewGoals: `Tetap fokus pada target impian Anda (${daftarTarget}). Alokasikan sisa saldo secara disiplin agar target segera terpenuhi.`,
    };
  }
}
