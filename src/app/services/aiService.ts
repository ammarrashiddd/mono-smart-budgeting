import { GoogleGenAI } from "@google/genai";

// Inisialisasi klien SDK Gemini terbaru menggunakan arsitektur Interactions API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface FinancialInsightInput {
  totalPemasukan: number;
  totalPengeluaran: number;
  sisaSaldo: number;
  assignedCluster: number;
  kmeansCacheData: {
    optimalK: number;
    points: any;
    totalTx: number;
    month: number;
    year: number;
  };
  transaksiTerakhir: Array<{
    deskripsi: string;
    nominal: number;
    tanggal: string;
    category: string;
  }>;
  rekapKategori: Record<string, number>;
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
    // Logging debug untuk memantau integritas data di terminal server
    console.log("=== DEBUG GOALS DITERIMA AI SERVICE ===");
    console.log(JSON.stringify(dataKonteks.targetKeuangan, null, 2));
    console.log("=== DEBUG REKAP KATEGORI DITERIMA AI SERVICE ===");
    console.log(JSON.stringify(dataKonteks.rekapKategori, null, 2));
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

    // Validasi dan Formatting Target Keuangan
    const anyGoalsExist =
      dataKonteks.targetKeuangan && dataKonteks.targetKeuangan.length > 0;

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

    // Skema validasi output JSON terstruktur sesuai spesifikasi Zod/JSON-Schema
    const jsonOutputSchema = {
      type: "OBJECT",
      properties: {
        kategoriTerbesar: { type: "STRING" },
        kondisiKesehatan: { type: "STRING" },
        aiSaranText: { type: "STRING" },
        reviewGoals: { type: "STRING" },
      },
      required: [
        "kategoriTerbesar",
        "kondisiKesehatan",
        "aiSaranText",
        "reviewGoals",
      ],
    };

    // Eksekusi pemanggilan menggunakan rute Interactions API baru untuk performa stabil
    const interaction = await ai.interactions.create({
      model: "gemini-3.1-flash-lite",
      input: `Anda adalah seorang Perencana Keuangan (Financial Planner) AI yang cerdas sekaligus Data Scientist yang mampu menerjemahkan pola matematika rumit menjadi kesimpulan gaya hidup yang sangat seru dan mudah dipahami orang awam.

      Sistem baru saja melakukan klasifikasi data belanja dan menemukan posisi kelompok pengguna saat ini. Tugas Anda adalah menonjolkan karakteristik kelompok tersebut di awal ulasan menggunakan SATU KATA inti saja secara polos, tanpa menggunakan penekanan huruf tebal atau istilah teknis.

      Data statistik ringkas bulan berjalan ini:
      - Total Pemasukan: ${dataKonteks.totalPemasukan}
      - Total Pengeluaran: ${dataKonteks.totalPengeluaran}
      - Sisa Saldo: ${dataKonteks.sisaSaldo}
      - Status Klaster Sistem: Klaster ${dataKonteks.assignedCluster} dari total K = ${dataKonteks.kmeansCacheData.optimalK} kelompok pola belanja.
      - Jumlah transaksi pengeluaran bulan ini: ${dataKonteks.kmeansCacheData.totalTx}

      Akumulasi Pengeluaran Berdasarkan Kategori (Rekap Makro):
      ${JSON.stringify(dataKonteks.rekapKategori)}

      Daftar Target Keuangan Pengguna Saat Ini:
      ${teksDaftarTarget}

      Daftar pengeluaran terbaru bulan ini (lengkap dengan data Kategori): ${JSON.stringify(dataKonteks.transaksiTerakhir)}.

      Sebagai panduan numerik, rasio pengeluaran riil pengguna saat ini adalah ${rasioPengeluaranTersisa}% dari total pemasukan, and sisa saldo (potensi tabungan) mereka adalah ${rasioTabunganTersisa}% dari total pemasukan.
      ${zeroProgressWarning}

      ATURAN BAHASA SANGAT KETAT (PANDUAN PENERJEMAHAN KLASIFIKASI):
      - DILARANG KERAS menggunakan kata "Klaster", "Cluster", "Centroid", "Klasifikasi", "K=3", atau angka indeks "0, 1, 2" pada output teks.
      - DILARANG KERAS menggunakan simbol Markdown atau tanda bintang bintang (seperti **) untuk menebalkan kata di dalam teks string. Tulis semua kata sebagai teks polos biasa.
      - Anda WAJIB menonjolkan hasil pengelompokan sistem dengan memberikan 'LABEL KARAKTER BELANJA' berupa SATU KATA SAJA (berupa kata sifat/pola perilaku dasar) langsung di dalam teks string tanpa format tebal.
      - Petakan status data numerik di atas menjadi klasifikasi 1 kata berikut:
        * Jika Rasio Pengeluaran Rendah (< 40%): Wajib gunakan kata "Hemat".
        * Jika Rasio Pengeluaran Tinggi (> 60%) ATAU frekuensi transaksi banyak: Wajib gunakan kata "Boros".
        * Jika jumlah transaksi sedikit tapi nominalnya langsung melonjak besar: Wajib gunakan kata "Impulsif".
        * Jika berada di antara batas tersebut (40% - 60%), analisis secara mandiri rasio pengeluaran mereka dan berikan label 1 kata manusiawi yang relevan (Wajib pilih salah satu dari kata: "Stabil" atau "Wajar").

      Tugas Utama Anda (Kembalikan jawaban murni dalam struktur JSON objek yang valid):
      1. Tentukan 'kategoriTerbesar' dengan aturan format dan kondisional yang sangat ketat berikut:
        - DAFTAR KATEGORI RESMI DATABASE: [MAKANAN_MINUMAN, TAGIHAN, TRANSPORTASI, PENDIDIKAN, KESEHATAN, HIBURAN_GAYA_HIDUP, BELANJA_FASHION, HOBI, PEMASUKAN, INVESTASI_TABUNGAN, LAIN_LAIN].
        - ATURAN FORMATTING: Jika kategori resmi di atas memiliki tanda underscore (_), Anda WAJIB mengubah tanda underscore tersebut menjadi kata "dan" serta memformat teksnya menjadi Title Case (Huruf besar di awal kata).
          * Contoh Konversi: 
            "MAKANAN_MINUMAN" wajib ditulis "Makanan dan Minuman"
            "HIBURAN_GAYA_HIDUP" wajib ditulis "Hiburan dan Gaya Hidup"
            "BELANJA_FASHION" wajib ditulis "Belanja dan Fashion"
            "INVESTASI_TABUNGAN" wajib ditulis "Investasi dan Tabungan"
            "TRANSPORTASI" cukup ditulis "Transportasi"
        - ATURAN KONDISIONAL:
          * Jika nominal tertinggi pada rekap pengeluaran adalah salah satu kategori resmi di atas (selain LAIN_LAIN), ambil kategori tersebut dan konversi sesuai ATURAN FORMATTING. DILARANG KERAS menggabungkan dua kategori resmi menjadi satu string baru (seperti "Hobi dan Belanja dan Fashion").
          * Jika nominal tertinggi jatuh pada "LAIN_LAIN", Anda DILARANG KERAS menuliskan kata "Lain-lain". Anda WAJIB membedah data 'transaksiTerakhir' untuk menganalisis deskripsi teks pengeluaran apa yang paling dominan di dalam kategori tersebut, lalu buatlah nama kategori baru yang spesifik, mandiri, dan manusiawi (Contoh: jika di dalam transaksi banyak deskripsi 'kaos' atau 'baju', buatlah menjadi "Belanja Fashion").

      2. Tentukan 'kondisiKesehatan' finansial mereka saat ini ("Sehat", "Waspada", atau "Kritis").

      3. Berikan 'aiSaranText' berupa 3-4 kalimat nasihat finansial. Anda WAJIB:
        - Buka kalimat pertama dengan langsung menyebutkan label Karakter Belanja 1 kata hasil analisis sistem tersebut tanpa tambahan kata 'tipe', 'pengelola', atau format huruf tebal (Contoh: "Bulan ini, pola transaksi Anda secara nyata masuk dalam kategori Stabil. Karakteristik ini menunjukkan bahwa..."). Jelaskan apa arti karakter 1 kata tersebut bagi dompet mereka secara nyata (frekuensi transaksi vs ukuran nominal uang yang keluar).
        - Bedah dan bandingkan rasio riil pengeluaran mereka saat ini (${rasioPengeluaranTersisa}%) dan potensi tabungan mereka (${rasioTabunganTersisa}%) terhadap batasan benchmark ideal Aturan 50/30/20 (50% Kebutuhan Pokok, 30% Keinginan, 20% Tabungan).
        - Sebutkan minimal satu contoh deskripsi pengeluaran dari daftar transaksi untuk membuktikan pos tersebut masuk kategori Kebutuhan atau Keinginan.

      4. Berikan ulasan 'reviewGoals' sebanyak 1-2 kalimat yang menganalisis progres target keuangan mereka saat ini.
        - Anda WAJIB menyebutkan nama dari target keuangan mereka secara eksplisit.
        - Hubungkan bagaimana sisa saldo saat ini (${rasioTabunganTersisa}%) atau kecenderungan dari Karakter Belanja 1 kata mereka bulan ini (Hemat / Boros / Stabil / Impulsif) dalam membantu atau menghambat pencapaian target tersebut tanpa menggunakan format huruf tebal.`,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: jsonOutputSchema,
      },
    });

    // Sesuai dokumentasi baru, ambil teks output terstruktur dari properti output_text
    if (interaction.output_text) {
      return JSON.parse(interaction.output_text);
    }
    throw new Error("Respon kosong dari Gemini Interactions API.");
  } catch (error) {
    console.error("=== DETAIL ERROR GEMINI ASLI ===");
    console.error(error);
    console.error("================================");

    const pemasukanPenyebut = dataKonteks.totalPemasukan || 1;
    const rasioPengeluaranTersisa = (
      (dataKonteks.totalPengeluaran / pemasukanPenyebut) *
      100
    ).toFixed(1);

    const daftarTarget =
      dataKonteks.targetKeuangan && dataKonteks.targetKeuangan.length > 0
        ? dataKonteks.targetKeuangan.map((g) => g.title).join(", ")
        : "tujuan keuangan";

    // Kembalikan objek fallback lokal jika server Google down/mengalami overload eksternal
    return {
      kategoriTerbesar: "Memuat Data...",
      kondisiKesehatan: "Sistem Sibuk",
      aiSaranText: `Layanan Gemini AI sedang mengalami lonjakan antrean yang padat (High Demand). Berdasarkan perhitungan mandiri, rasio pengeluaran riil Anda saat ini berada di angka ${rasioPengeluaranTersisa}% dari total pemasukan. Harap evaluasi ulang alokasi ini secara mandiri agar mendekati batas ideal Aturan 50/30/20 (50% Kebutuhan, 30% Keinginan, 20% Tabungan).`,
      reviewGoals: `Evaluasi khusus untuk target impian Anda (${daftarTarget}) saat ini belum dapat dirumuskan oleh AI karena gangguan server eksternal Google. Sembari menunggu, manfaatkan alokasi minimal 20% dari sisa saldo bulan ini untuk mengamankan tabungan Anda secara mandiri.`,
    };
  }
}
