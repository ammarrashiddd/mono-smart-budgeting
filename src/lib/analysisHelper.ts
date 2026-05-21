import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai"; // Pastikan Anda sudah menginstal @google/genai

// Inisialisasi Gemini AI menggunakan API Key dari .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface SaveHistoryParams {
  userId: string;
  optimalK: number;
  assignedCluster: number;
}

export async function saveFinancialAnalysisHistory({
  userId,
  optimalK,
  assignedCluster,
}: SaveHistoryParams) {
  // 1. Tarik semua transaksi milik user murni berdasarkan deskripsi, nominal, dan tanggal
  const allTransactions = await prisma.transaction.findMany({
    where: { userId },
  });

  let totalPemasukan = 0;
  let totalPengeluaran = 0;

  // Strukturkan transaksi menjadi ringkasan teks mentah untuk dibaca oleh Gemini
  const ringkasanTransaksi = allTransactions.map((tx) => {
    const amt = tx.amount;
    if (amt >= 0) {
      totalPemasukan += amt;
    } else {
      totalPengeluaran += Math.abs(amt);
    }

    return {
      deskripsi: tx.description, // Kunci utama bagi AI untuk menebak kategori
      nominal: tx.amount,
      tanggal: new Date(tx.date).toLocaleDateString("id-ID"),
    };
  });

  const sisaSaldo = totalPemasukan - totalPengeluaran;

  // Siapkan objek ringkas yang dikirim ke Gemini AI
  const dataKonteksFinansial = {
    totalPemasukan,
    totalPengeluaran,
    sisaSaldo,
    K_Means_Cluster_Terpilih: assignedCluster, // 0 = Rendah, 1 = Sedang, 2 = Tinggi
    // Kirim 20 transaksi terbaru saja agar menghemat kuota token API Gemini
    Transaksi_Terakhir: ringkasanTransaksi.slice(-20),
  };

  // 2. Definisikan variabel default (fallback) jika AI mengalami gangguan
  let personaName = "Tipe Finansial Normal";
  let kategoriTerbesar = "Lainnya (Uncategorized)";
  let kondisiKesehatan = "Waspada";
  let aiSaranText = "Pertahankan pola pencatatan keuangan Anda.";

  // 3. Ambil data analisis kategori dan persona murni dari otak Gemini AI
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Anda adalah seorang Perencana Keuangan (Financial Planner) AI yang jenius. 
      Analisis data keuangan pengguna berikut ini: ${JSON.stringify(dataKonteksFinansial)}.
      
      Tugas Anda:
      1. Berikan nama 'personaName' yang kreatif, unik, dan psikologis berdasarkan pola belanja mereka (contoh: "Si Penikmat Senja Impulsif", "Master Hemat Kuadrat", "Whale Spender").
      2. Perhatikan kolom 'deskripsi' pada daftar transaksi pengeluaran (nominal negatif). Tebak kategori dari setiap deskripsi tersebut, lalu tentukan 'kategoriTerbesar' apa yang paling banyak menghabiskan uang pengguna (contoh hasil: "Makanan & Minuman", "Transportasi", "Lifestyle", atau "Kebutuhan Pokok").
      3. Tentukan 'kondisiKesehatan' finansial mereka saat ini ("Sehat", "Waspada", atau "Kritis").
      4. Berikan 'aiSaranText' berupa 2-3 kalimat nasihat finansial yang taktis, solutif, dan menyentil kebiasaan buruk mereka berdasarkan nama-nama deskripsi transaksi pengeluaran mereka.`,
      config: {
        // Mengunci output agar wajib berbentuk JSON Object sesuai cetakan di bawah
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            personaName: { type: "STRING" },
            kategoriTerbesar: { type: "STRING" },
            kondisiKesehatan: { type: "STRING" },
            aiSaranText: { type: "STRING" },
          },
          required: [
            "personaName",
            "kategoriTerbesar",
            "kondisiKesehatan",
            "aiSaranText",
          ],
        },
      },
    });

    if (response.text) {
      const aiResult = JSON.parse(response.text);
      personaName = aiResult.personaName;
      kategoriTerbesar = aiResult.kategoriTerbesar;
      kondisiKesehatan = aiResult.kondisiKesehatan;
      aiSaranText = aiResult.aiSaranText;
    }
  } catch (error) {
    console.error(
      "Gagal mendapatkan analisis dari Gemini AI, menggunakan fallback:",
      error,
    );
    // Terapkan logika fallback dasar jika server AI down
    if (assignedCluster === 0) {
      personaName = "Si Hemat / Low Spender";
      kondisiKesehatan = sisaSaldo >= 0 ? "Sehat" : "Waspada";
    } else {
      personaName = "Si Boros / High Spender";
      kondisiKesehatan = "Kritis";
    }
  }

  // 4. Masukkan data hasil kombinasi kalkulasi lokal dan otak AI ke tabel ClusterHistory
  const newHistory = await prisma.clusterHistory.create({
    data: {
      userId,
      optimalK,
      assignedCluster,
      personaName, // Didapat dari Gemini AI
      totalPemasukan, // Dihitung lokal
      totalPengeluaran, // Dihitung lokal
      sisaSaldo, // Dihitung lokal
      kategoriTerbesar, // Didapat dari Gemini AI lewat deskripsi teks
      kondisiKesehatan, // Didapat dari Gemini AI
      aiSaranText, // Didapat dari Gemini AI
    },
  });

  return newHistory;
}
