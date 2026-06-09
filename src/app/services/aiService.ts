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
    // Memastikan data goals masuk ke konsol terminal backend saat eksekusi
    console.log("=== DEBUG GOALS DITERIMA AI SERVICE ===");
    console.log(JSON.stringify(dataKonteks.targetKeuangan, null, 2));
    console.log("=======================================");

    const pemasukanPenyebut = dataKonteks.totalPemasukan || 1;
    const rasioPengeluaranTersisa = (
      (dataKonteks.totalPengeluaran / pemasukanPenyebut) *
      100
    ).toFixed(1);
    const rasioTabunganTersisa = (
      (dataKonteks.sisaSaldo / pemasukanPenyebut) *
      100
    ).toFixed(1);

    // VALIDASI DAN FORMATTING TARGET KEUANGAN
    const anyGoalsExist =
      dataKonteks.targetKeuangan && dataKonteks.targetKeuangan.length > 0;

    // Menyusun string daftar target secara eksplisit untuk disodorkan ke prompt teks Gemini
    const teksDaftarTarget = anyGoalsExist
      ? dataKonteks.targetKeuangan
          .map(
            (g) =>
              `- ${g.title}: Target Rp${g.targetAmount.toLocaleString("id-ID")}, Terkumpul Rp${g.currentAmount.toLocaleString("id-ID")}`,
          )
          .join("\n")
      : "- Tidak ada target keuangan aktif saat ini.";

    const hasZeroProgress = dataKonteks.targetKeuangan.some(
      (g) => g.currentAmount === 0,
    );
    const zeroProgressWarning = hasZeroProgress
      ? "\nPERINGATAN KETAT: Beberapa atau semua target keuangan di atas memiliki nominal terkumpul (currentAmount) bernilai 0. Jangan asumsikan sisa saldo saat ini sebagai dana target tersebut! Nyatakan secara spesifik target mana saja yang progresnya masih Rp 0 atau belum dimulai."
      : "";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Anda adalah seorang Perencana Keuangan (Financial Planner) AI sekaligus Data Scientist yang jenius. Anda mahir menguji anggaran bulanan dan mengaitkannya dengan hasil algoritma K-Means untuk evaluasi saat ini juga.
      
      Data statistik ringkas bulan berjalan ini:
      - Total Pemasukan: ${dataKonteks.totalPemasukan}
      - Total Pengeluaran: ${dataKonteks.totalPengeluaran}
      - Sisa Saldo: ${dataKonteks.sisaSaldo}
      - Klaster Terpilih: Klaster ${dataKonteks.assignedCluster} dari total K = ${dataKonteks.kmeansCacheData.optimalK}
      - Jumlah transaksi pengeluaran bulan ini: ${dataKonteks.kmeansCacheData.totalTx}
      
      Daftar Target Keuangan Pengguna Saat Ini:
      ${teksDaftarTarget}
      
      Daftar pengeluaran terbaru bulan ini (hanya nominal negatif): ${JSON.stringify(dataKonteks.transaksiTerakhir)}.
      Fokus hanya pada pengeluaran ketika menentukan kategori terbesar dan pola belanja. Jangan gunakan transaksi pemasukan.
      
      Sebagai panduan numerik, rasio pengeluaran riil pengguna saat ini adalah ${rasioPengeluaranTersisa}% dari total pemasukan, dan sisa saldo (potensi tabungan) mereka adalah ${rasioTabunganTersisa}% dari total pemasukan.
      ${zeroProgressWarning}
      
      Tugas Utama Anda (Batasi seluruh analisis HANYA pada kondisi pengeluaran bulan saat ini saja):
      1. Berikan nama 'personaName' yang kreatif, unik, dan psikologis berdasarkan pola belanja mereka bulan ini (contoh: "Si Penikmat Senja Impulsif", "Master Hemat Kuadrat", "Whale Spender").
      2. Perhatikan kolom 'deskripsi' pada daftar transaksi pengeluaran (nominal negatif). Tebak kategori dari setiap deskripsi tersebut, lalu tentukan 'kategoriTerbesar' apa yang paling banyak menghabiskan uang pengguna di bulan berjalan ini. Jangan gunakan transaksi pemasukan. Aturan Format: Gunakan spasi yang rapi dan standar manusia. Jika kategori berupa gabungan, wajib gunakan spasi sebelum dan sesudah simbol (Contoh: "Makanan & Minuman", bukan "Makanan&Minuman").
      3. Tentukan 'kondisiKesehatan' finansial mereka saat ini ("Sehat", "Waspada", atau "Kritis").
      
      4. Berikan 'aiSaranText' berupa 3-4 kalimat nasihat finansial yang mendalam dan menonjolkan penerapan Aturan Keuangan 50/30/20. Anda WAJIB:
         - Bedah dan bandingkan secara tajam rasio riil pengeluaran mereka saat ini (${rasioPengeluaranTersisa}%) dan potensi tabungan mereka (${rasioTabunganTersisa}%) terhadap batasan benchmark ideal Aturan 50/30/20 (50% Kebutuhan Pokok, 30% Keinginan/Wants, 20% Tabungan/Investasi).
         - Berikan arahan taktis bagaimana mengonfigurasi ulang atau memotong pos pengeluaran bulan berjalan ini agar bisa presisi mendekati porsi ideal tersebut.
         - Ambil minimal satu contoh deskripsi pengeluaran dari daftar transaksi yang diberikan untuk membuktikan pos mana yang masuk dalam kategori "Kebutuhan (Needs)" atau "Keinginan (Wants)" agar ulasan menjadi sangat konkret.

      5. Berikan ulasan 'reviewGoals' sebanyak 1-2 kalimat yang menganalisis progres target keuangan mereka saat ini. 
         - Aturan Ketat: Anda WAJIB menyebutkan nama dari target keuangan yang tertera pada daftar di atas. Dilarang menuliskan bahwa target tidak spesifik atau tidak diberikan.
         - Jika target tersebut memiliki 'currentAmount' bernilai 0, ulas secara jujur bahwa dana untuk target tersebut saat ini memang masih kosong (Rp 0) atau belum dimulai progresnya.
         - Hubungkan bagaimana sisa saldo saat ini (${rasioTabunganTersisa}%) atau kecenderungan perilaku mereka di kelompok Klaster ${dataKonteks.assignedCluster} dievaluasi agar alokasi tabungan bulan berjalan ini bisa dioptimalkan mendekati porsi ideal minimal 20%.`,
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

    const pemasukanPenyebut = dataKonteks.totalPemasukan || 1;
    const rasioPengeluaranTersisa = (
      (dataKonteks.totalPengeluaran / pemasukanPenyebut) *
      100
    ).toFixed(1);

    const daftarTarget =
      dataKonteks.targetKeuangan && dataKonteks.targetKeuangan.length > 0
        ? dataKonteks.targetKeuangan.map((g) => g.title).join(", ")
        : "tujuan keuangan";

    // 🛠️ RETURN ERROR: Menampilkan status sistem sibuk yang ramah untuk UI Dashboard
    return {
      personaName: "Sistem AI Sedang Sibuk",
      kategoriTerbesar: "Memuat Data...",
      kondisiKesehatan: "Sistem Sibuk",
      aiSaranText: `Layanan Gemini AI sedang mengalami lonjakan antrean yang padat (High Demand). Berdasarkan perhitungan mandiri, rasio pengeluaran riil Anda saat ini berada di angka ${rasioPengeluaranTersisa}% dari total pemasukan. Harap evaluasi ulang alokasi ini secara mandiri agar mendekati batas ideal Aturan 50/30/20 (50% Kebutuhan, 30% Keinginan, 20% Tabungan).`,
      reviewGoals: `Evaluasi khusus untuk target impian Anda (${daftarTarget}) saat ini belum dapat dirumuskan oleh AI karena gangguan server eksternal Google. Sembari menunggu, manfaatkan alokasi minimal 20% dari sisa saldo bulan ini untuk mengamankan tabungan Anda secara mandiri.`,
    };
  }
}
