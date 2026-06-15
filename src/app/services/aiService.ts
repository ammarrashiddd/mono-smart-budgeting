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
    // Memastikan data goals masuk ke konsol terminal backend saat eksekusi (untuk kebutuhan debug)
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
      contents: `Anda adalah seorang Perencana Keuangan (Financial Planner) AI yang cerdas sekaligus Data Scientist yang mampu menerjemahkan pola matematika rumit menjadi kesimpulan gaya hidup yang sangat seru dan mudah dipahami orang awam.

Sistem baru saja melakukan pengelompokan data belanja (K-Means) dan menemukan posisi kelompok pengguna saat ini. Tugas Anda adalah menonjolkan karakteristik kelompok tersebut di awal ulasan menggunakan SATU KATA inti saja secara polos, tanpa menggunakan penekanan huruf tebal atau istilah teknis.

Data statistik ringkas bulan berjalan ini:
- Total Pemasukan: ${dataKonteks.totalPemasukan}
- Total Pengeluaran: ${dataKonteks.totalPengeluaran}
- Sisa Saldo: ${dataKonteks.sisaSaldo}
- Status Klaster Sistem: Klaster ${dataKonteks.assignedCluster} dari total K = ${dataKonteks.kmeansCacheData.optimalK} kelompok pola belanja.
- Jumlah transaksi pengeluaran bulan ini: ${dataKonteks.kmeansCacheData.totalTx}

Daftar Target Keuangan Pengguna Saat Ini:
${teksDaftarTarget}

Daftar pengeluaran terbaru bulan ini (hanya nominal negatif): ${JSON.stringify(dataKonteks.transaksiTerakhir)}.

Sebagai panduan numerik, rasio pengeluaran riil pengguna saat ini adalah ${rasioPengeluaranTersisa}% dari total pemasukan, dan sisa saldo (potensi tabungan) mereka adalah ${rasioTabunganTersisa}% dari total pemasukan.
${zeroProgressWarning}

ATURAN BAHASA SANGAT KETAT (PANDUAN PENERJEMAHAN K-MEANS):
- DILARANG KERAS menggunakan kata "Klaster", "Cluster", "Centroid", "K-Means", "K=3", atau angka indeks "0, 1, 2" pada output teks.
- DILARANG KERAS menggunakan simbol Markdown atau tanda bintang bintang (seperti **) untuk menebalkan kata di dalam teks string. Tulis semua kata sebagai teks polos biasa.
- Anda WAJIB menonjolkan hasil pengelompokan sistem dengan memberikan 'LABEL KARAKTER BELANJA' berupa SATU KATA SAJA (berupa kata sifat/pola perilaku dasar) langsung di dalam teks string tanpa format tebal.
- Petakan status data numerik di atas menjadi klasifikasi 1 kata berikut:
  * Jika Rasio Pengeluaran Rendah (< 40%): Wajib gunakan kata "Hemat".
  * Jika Rasio Pengeluaran Tinggi (> 60%) ATAU frekuensi transaksi banyak: Wajib gunakan kata "Boros".
  * Jika jumlah transaksi sedikit tapi nominalnya langsung melonjak besar: Wajib gunakan kata "Impulsif".
  * Jika berada di antara batas tersebut (40% - 60%), analisis secara mandiri rasio pengeluaran mereka dan berikan label 1 kata manusiawi yang relevan (Wajib pilih salah satu dari kata: "Stabil" atau "Wajar").

Tugas Utama Anda (Kembalikan jawaban murni dalam struktur JSON objek yang valid):
1. Tentukan 'kategoriTerbesar' apa yang paling banyak menghabiskan uang pengguna di bulan berjalan ini (Contoh format: "Makanan & Minuman"). Gunakan spasi sebelum dan sesudah simbol &.
2. Tentukan 'kondisiKesehatan' finansial mereka saat ini ("Sehat", "Waspada", atau "Kritis").

3. Berikan 'aiSaranText' berupa 3-4 kalimat nasihat finansial. Anda WAJIB:
   - Buka kalimat pertama dengan langsung menyebutkan label Karakter Belanja 1 kata hasil analisis sistem tersebut tanpa tambahan kata 'tipe', 'pengelola', atau format huruf tebal (Contoh: "Bulan ini, pola transaksi Anda secara nyata masuk dalam kategori Stabil. Karakteristik ini menunjukkan bahwa..."). Jelaskan apa arti karakter 1 kata tersebut bagi dompet mereka secara nyata (frekuensi transaksi vs ukuran nominal uang yang keluar).
   - Bedah dan bandingkan rasio riil pengeluaran mereka saat ini (${rasioPengeluaranTersisa}%) dan potensi tabungan mereka (${rasioTabunganTersisa}%) terhadap batasan benchmark ideal Aturan 50/30/20 (50% Kebutuhan Pokok, 30% Keinginan, 20% Tabungan).
   - Sebutkan minimal satu contoh deskripsi pengeluaran dari daftar transaksi untuk membuktikan pos tersebut masuk kategori Kebutuhan atau Keinginan.

4. Berikan ulasan 'reviewGoals' sebanyak 1-2 kalimat yang menganalisis progres target keuangan mereka saat ini.
   - Anda WAJIB menyebutkan nama dari target keuangan mereka secara eksplisit.
   - Hubungkan bagaimana sisa saldo saat ini (${rasioTabunganTersisa}%) atau kecenderungan dari Karakter Belanja 1 kata mereka bulan ini (Hemat / Boros / Stabil / Impulsif) dalam membantu atau menghambat pencapaian target tersebut tanpa menggunakan format huruf tebal.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
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

    // RETURN FALLBACK (Ambil data lokal jika server penuh/gagal)
    return {
      kategoriTerbesar: "Memuat Data...",
      kondisiKesehatan: "Sistem Sibuk",
      aiSaranText: `Layanan Gemini AI sedang mengalami lonjakan antrean yang padat (High Demand). Berdasarkan perhitungan mandiri, rasio pengeluaran riil Anda saat ini berada di angka ${rasioPengeluaranTersisa}% dari total pemasukan. Harap evaluasi ulang alokasi ini secara mandiri agar mendekati batas ideal Aturan 50/30/20 (50% Kebutuhan, 30% Keinginan, 20% Tabungan).`,
      reviewGoals: `Evaluasi khusus untuk target impian Anda (${daftarTarget}) saat ini belum dapat dirumuskan oleh AI karena gangguan server eksternal Google. Sembari menunggu, manfaatkan alokasi minimal 20% dari sisa saldo bulan ini untuk mengamankan tabungan Anda secara mandiri.`,
    };
  }
}
