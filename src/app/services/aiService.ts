import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface FinancialInsightInput {
  totalPemasukan: number;
  totalPengeluaran: number;
  sisaSaldo: number;
  assignedCluster: number;
  kmeansCacheData: {
    optimalK: number;
    wcss: number;
    points: any;
    elbow: any;
    totalTx: number;
  };
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
    const pemasukanPenyebut = dataKonteks.totalPemasukan || 1;
    const rasioPengeluaranTersisa = (
      (dataKonteks.totalPengeluaran / pemasukanPenyebut) *
      100
    ).toFixed(1);
    const rasioTabunganTersisa = (
      (dataKonteks.sisaSaldo / pemasukanPenyebut) *
      100
    ).toFixed(1);

    // 🛠️ DETEKSI APAKAH ADA TARGET YANG MASIH KOSONG (0) UNTUK DIJADIKAN WARNING PROMPT
    const hasZeroProgress = dataKonteks.targetKeuangan.some(
      (g) => g.currentAmount === 0,
    );
    const zeroProgressWarning = hasZeroProgress
      ? "\n PERINGATAN: Beberapa atau semua target keuangan memiliki currentAmount bernilai 0. Jangan asumsikan sisaSaldo saat ini sebagai dana yang sudah terkumpul untuk target tersebut! Nyatakan dengan jujur bahwa progres target tersebut masih belum dimulai atau masih Rp 0."
      : "";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Anda adalah seorang Perencana Keuangan (Financial Planner) AI sekaligus Data Scientist yang jenius. Anda mahir menguji anggaran dengan metode Aturan Keuangan 50/30/20 dan mengaitkannya dengan hasil algoritma Unsupervised Learning K-Means.
      
      Analisis data keuangan pengguna dan log data statistik K-Means berikut ini: ${JSON.stringify(dataKonteks)}.
      Sebagai panduan numerik, rasio pengeluaran riil pengguna saat ini adalah ${rasioPengeluaranTersisa}% dari total pemasukan, dan sisa saldo (potensi tabungan) mereka adalah ${rasioTabunganTersisa}% dari total pemasukan.
      ${zeroProgressWarning}
      
      Tugas Utama Anda:
      1. Berikan nama 'personaName' yang kreatif, unik, dan psikologis berdasarkan pola belanja mereka (contoh: "Si Penikmat Senja Impulsif", "Master Hemat Kuadrat", "Whale Spender").
      2. Perhatikan kolom 'deskripsi' pada daftar transaksi pengeluaran (nominal negatif). Tebak kategori dari setiap deskripsi tersebut, lalu tentukan 'kategoriTerbesar' apa yang paling banyak menghabiskan uang pengguna (contoh hasil: "Makanan & Minuman", "Transportasi", "Lifestyle", atau "Kebutuhan Pokok").
      3. Tentukan 'kondisiKesehatan' finansial mereka saat ini ("Sehat", "Waspada", atau "Kritis").
      
      4. Berikan 'aiSaranText' berupa 3-4 kalimat nasihat finansial yang taktis dan ilmiah. Anda WAJIB:
         - Mengevaluasi performa rasio mereka (${rasioPengeluaranTersisa}% pengeluaran vs ${rasioTabunganTersisa}% tabungan) terhadap benchmark ideal Aturan 50/30/20 (50% Kebutuhan, 30% Keinginan, 20% Tabungan).
         - Mengaitkan temuan tersebut dengan fakta bahwa mereka dikelompokkan ke "Klaster ${dataKonteks.assignedCluster}" dari total "K = ${dataKonteks.kmeansCacheData.optimalK}" kelompok yang terbentuk dari metode Elbow.
         - Jelaskan hubungan antara frekuensi transaksi mereka (${dataKonteks.kmeansCacheData.totalTx} kali transaksi) dengan pembengkakan alokasi keinginan (Wants). Berikan kritik tajam jika mereka berada di klaster yang tidak efisien.

      5. Berikan ulasan 'reviewGoals' sebanyak 1-2 kalimat yang menganalisis progres target keuangan mereka. 
         - Aturan Ketat: Jika 'currentAmount' pada data target adalah 0, Anda HARUS mengulas bahwa tabungan/dana untuk target tersebut memang masih kosong (Rp 0).
         - Hubungkan bagaimana sisa saldo saat ini (${rasioTabunganTersisa}%) atau kecenderungan perilaku mereka di kelompok Klaster ${dataKonteks.assignedCluster} dapat digunakan secara realistis mulai bulan depan untuk menyisihkan porsi ideal 20% agar target yang masih 0 tersebut bisa segera tercapai.`,
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
      "Gagal mendapatkan analisis dari Gemini AI Service, menggunakan logika fallback:",
      error,
    );

    const clusterId = dataKonteks.assignedCluster;
    const totalMetrikTx = dataKonteks.kmeansCacheData?.totalTx || 0;
    const daftarTarget =
      dataKonteks.targetKeuangan?.map((g) => g.title).join(", ") ||
      "tujuan keuangan";

    return {
      personaName:
        clusterId === 0 ? "Si Hemat / Low Spender" : "Si Boros / High Spender",
      kategoriTerbesar: "Pengeluaran Umum (Fallback)",
      kondisiKesehatan:
        clusterId === 0
          ? dataKonteks.sisaSaldo >= 0
            ? "Sehat"
            : "Waspada"
          : "Kritis",
      aiSaranText: `Berdasarkan pemodelan K-Means (K=${dataKonteks.kmeansCacheData?.optimalK || 3}), Anda berada pada Klaster ${clusterId} dengan intensitas ${totalMetrikTx} transaksi. Evaluasi mandiri alokasi anggaran Anda; pastikan mendekati rumus ideal 50% kebutuhan pokok, 30% keinginan, dan minimal 20% untuk tabungan/investasi.`,
      reviewGoals: `Target impian Anda (${daftarTarget}) saat ini belum memiliki alokasi dana khusus yang terkumpul. Manfaatkan kecenderungan positif Anda di Klaster ${clusterId} untuk mulai menyisihkan sisa saldo secara disiplin demi memicu progres finansial tersebut.`,
    };
  }
}
