# Smart Budgeting Web Application

Aplikasi manajemen keuangan pintar (_Smart FinTech_) berbasis web yang mengintegrasikan metode statistik _Unsupervised Machine Learning_ dan _Generative Artificial Intelligence_ (Gen-AI).

Sistem ini mengelompokkan perilaku belanja harian pengguna secara objektif menggunakan algoritma **K-Means Clustering** (dengan pendekatan otomatisasi jumlah kelompok lewat **Metode Elbow**), kemudian dikolaborasikan dengan **Gemini 2.5 Flash** untuk memproduksi rekomendasi keuangan personal berdasarkan metodologi **Aturan Anggaran 50/30/20**.

---

## Tech Stack & Arsitektur

- **Framework Utama:** [Next.js 15 (App Router)](https://nextjs.org)
- **Database & ORM:** [Prisma ORM](https://www.prisma.io) dengan PostgreSQL ([Neon Database](https://neon.tech))
- **Intelligence SDK:** [Google Gen AI SDK](https://github.com/google/generative-ai-js) (`gemini-2.5-flash`)
- **Machine Learning Library:** `ml-kmeans` (Euclidean Distance & K-Means++)
- **Visualisasi Data:** [Recharts](https://recharts.org) (Scatter Plot & Line Chart)
- **Styling & UI:** Tailwind CSS

---

## Fitur Utama (Core Features)

### 1. K-Means Clustering & Otomatisasi Metode Elbow

Sistem mengekstraksi fitur 2D dari riwayat pengeluaran pengguna (Sumbu X = Hari/Tanggal, Sumbu Y = Nominal Absolut) dan melakukan _Min-Max Normalization_. Sistem secara otomatis mendeteksi tekukan siku (_curvature_) optimal pada rentang $K=1$ hingga $K=6$ untuk mengunci jumlah klaster terbaik secara _real-time_.

### 2. Split-Grid Analytics Dashboard

Menampilkan visualisasi data science yang komprehensif bagi pengguna:

- **Scatter Plot:** Pemetaan titik transaksi harian berdasarkan zonasi warna klaster ordinal (dari pengeluaran rutin terkecil hingga impulsif terbesar).
- **Kurva Elbow:** Grafik garis penurunan nilai _Within-Cluster Sum of Squares_ (WCSS) sebagai transparansi metodologi ilmiah penentuan nilai $K$ optimal untuk kebutuhan sidang skripsi.

### 3. Financial Audit Berbasis Aturan 50/30/20 & Gen-AI

Data koordinat klaster, frekuensi transaksi (`totalTx`), dan metrik anggaran riil disuapkan ke Gemini 2.5 Flash. AI bertindak sebagai perencana keuangan psikologis yang menghasilkan:

- **Persona Name:** Penamaan kreatif unik berdasarkan pola belanja (e.g., _"Si Penikmat Senja Impulsif"_).
- **Audit Aturan 50/30/20:** Analisis komparasi persentase riil vs standar ideal (50% Kebutuhan, 30% Keinginan, 20% Tabungan).
- **Review Goals:** Ulasan kritis mengenai realitis/tidaknya target keuangan aktif (`FinancialTarget`) pengguna berdasarkan sisa saldo berjalan.

---

## Alur Kerja Sistem (Data Pipeline)

[Transaksi Pengeluaran] ──> Normalisasi Min-Max (Tanggal & Nominal)
│
┌──────────────────────────────────────┘
│
├──> Loop K=1 s/d K=6 ──> Hitung WCSS Nyata ──> Deteksi Elbow Point (K Optimal)
│
├──> Sorting Klaster Ordinal (Rata-rata Nominal Terendah ──> Tertinggi)
│
├──> [Database] Upsert ke KmeansCache & Ambil Target Keuangan Aktif
│
├──> Hitung Rasio Riil Anggaran & Suapi Konteks ke Gemini 2.5 Flash
│
├──> [Database] Simpan Hasil Analisis Terstruktur ke AiInsight & ClusterHistory
│
└──> [UI Component] Render Grafik Recharts & Tampilkan Nasihat Finansial AI

## Memulai (Getting Started)

### 1. Prasyarat (Prerequisites)

Pastikan Anda sudah menginstal Node.js (v18+) dan memiliki akun database PostgreSQL (Neon/Lokal) serta API Key Gemini.

### 2. Kloning Repositori & Instalasi Dependensi

```bash
git clone [https://github.com/ammarrashiddd/mono-smart-budgeting.git]
cd repo-name
npm install

### Sinkronisasi Database (Prisma Migration)
npx prisma generate
npx prisma db push

### Jalankan Server Pengembangan
npm run dev
```
