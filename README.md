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

1. **Ekstraksi & Normalisasi Data Transaksi**

- Sistem menyaring seluruh data transaksi pengeluaran aktif pengguna pada bulan berjalan.
- Data ditransformasikan ke dalam koordinat 2D (Hari/Tanggal sebagai komponen X, dan Nominal Absolut Pengeluaran sebagai komponen Y).
- Dilakukan **Min-Max Normalization** pada kedua komponen agar skala tanggal ($1-31$) tidak didominasi atau terdistorsi oleh besarnya skala nominal uang.

2. **Iterasi K-Means & Evaluasi Nilai WCSS**

- Sistem melakukan perulangan (_looping_) komputasi algoritma K-Means dari $K=1$ hingga $K=6$.
- Pada setiap nilai $K$, fungsi menghitung nilai inersia kuadrat asli atau _Within-Cluster Sum of Squares_ (WCSS) berbasis jarak _Euclidean_.

3. **Otomatisasi Deteksi Siku (Elbow Point)**

- Sistem menganalisis tingkat penurunan atau kemiringan grafik varians (_curvature_) dari array WCSS yang terkumpul.
- Titik belokan sudut tertajam (_elbow point_) dikunci secara otomatis untuk menentukan jumlah kelompok ($K$ Optimal) terbaik secara matematis.

4. **Sorting Klaster Ordinal (Standardisasi Urutan)**

- Sistem mengurutkan ulang indeks klaster secara ordinal berdasarkan rata-rata nominal pengeluaran terkecil hingga terbesar.
- Hal ini memastikan Klaster #1 selalu merepresentasikan pengeluaran rutin/kecil dan klaster tertinggi merepresentasikan pengeluaran skala besar/impulsif (konsisten di setiap kalkulasi).

5. **Penyimpanan Cache Data Science (Database Write 1)**

- Hasil koordinat titik sebaran (_points_) dan array koordinat belokan siku (_elbow_) di-simpan atau diperbarui ke dalam tabel `KmeansCache` menggunakan operasi `upsert`.
- Pada tahap yang sama, sistem melakukan query paralel untuk mengambil data target keuangan aktif pengguna (`FinancialTarget`).

6. **Kalkulasi Rasio Riil Anggaran & Pengayaan Konteks AI**

- Sistem menghitung persentase riil total pengeluaran dan sisa saldo tabungan saat ini terhadap total pemasukan pengguna.
- Seluruh log statistik K-Means, daftar transaksi terakhir, data target, serta persentase rasio keuangan dibungkus menjadi satu objek JSON (`FinancialInsightInput`) untuk disuapkan ke Google Gemini 2.5 Flash.

7. **Generasi Rekomendasi Finansial Terstruktur oleh LLM**

- Model `gemini-2.5-flash` mengevaluasi data tersebut menggunakan acuan **Aturan Keuangan 50/30/20**.
- AI memproduksi respons JSON terstruktur yang berisi: nama persona psikologis belanja, kategori pengeluaran terbesar, status kondisi kesehatan finansial, teks kritik/saran taktis anggaran, serta ulasan progres target keuangan.

8. **Penyimpanan Hasil Analisis Naratif (Database Write 2 & 3)**

- Data teks naratif hasil produksi AI disimpan bersih ke database.
- Sistem melakukan `upsert` ke tabel `AiInsight` (sebagai data tunggal _real-time dashboard_) dan melakukan `create` ke tabel `ClusterHistory` (sebagai rekam jejak log aktivitas jangka panjang).

9. **Rendering Komponen Antarmuka (UI Render)**

- Frontend menerima respons data bersih dari server.
- Komponen `Ml.tsx` merender **Scatter Plot Pembagian Klaster** berdampingan langsung dengan **Kurva Metode Elbow** menggunakan Recharts, sekaligus menyajikan kotak teks rekomendasi personal dari AI secara interaktif.

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
