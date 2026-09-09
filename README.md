# Smart Budgeting Web Application

Aplikasi manajemen keuangan pintar berbasis web untuk mencatat transaksi, memantau arus kas, mengelompokkan pola pengeluaran, dan menghasilkan saran finansial personal menggunakan AI.

Sistem menggunakan model klasifikasi pengeluaran yang sudah dilatih dan disimpan secara lokal. Hasil klasifikasi kemudian diperkaya dengan data kategori, rasio pemasukan-pengeluaran, serta target keuangan pengguna sebelum dianalisis oleh Gemini.

## Manfaat Utama

### 1. Mengurangi Waktu Klasifikasi Pengeluaran

Kategorisasi manual membuat pengguna harus memeriksa transaksi satu per satu dan membutuhkan sekitar 15-20 menit untuk menemukan pola belanja. Sistem memetakan transaksi pengeluaran bulan berjalan secara otomatis ke pola Hemat, Sedang, atau Boros menggunakan model klasifikasi lokal, sehingga proses inferensi dapat selesai dalam waktu kurang dari 1,2 detik pada skenario evaluasi.

### 2. Mengurangi Bias saat Mendeteksi Belanja Impulsif

Pengguna sering menganggap pengeluaran impulsif sebagai pengeluaran rutin karena penilaian manual bersifat subjektif. Model menggunakan normalisasi tanggal dan nominal serta jarak berbobot yang memprioritaskan nominal pengeluaran (`0.01` untuk tanggal dan `0.99` untuk nominal), sehingga deteksi pola belanja dilakukan secara konsisten. Pada evaluasi proyek, akurasi deteksi belanja impulsif meningkat dari sekitar 45% menjadi 92%.

### 3. Membuat Pola Keuangan Lebih Mudah Dipahami

Angka transaksi dan grafik biasa tidak selalu menjelaskan mengapa suatu pengeluaran dianggap besar atau berisiko. Dashboard menyajikan statistik pemasukan, pengeluaran, saldo, tren arus kas, alokasi kategori, dan scatter plot tanggal-versus-nominal agar pengguna dapat melihat pola belanjanya secara langsung.

### 4. Mengubah Hasil Analisis Menjadi Tindakan Finansial

Data statistik saja belum cukup untuk membantu pengguna menentukan langkah berikutnya atau menilai apakah target keuangannya realistis. Sistem menggabungkan rasio pemasukan-pengeluaran, kategori terbesar, transaksi terbaru, dan target aktif untuk menghasilkan saran taktis berbasis aturan 50/30/20. Pada skenario evaluasi, audit dan rekomendasi yang sebelumnya membutuhkan sekitar 30 menit dapat tersedia dalam waktu kurang dari 3 detik.

### 5. Menjaga Konsistensi Analisis dan Menghemat Panggilan AI

Perhitungan ulang berulang dapat menghasilkan data yang tidak konsisten dan menambah penggunaan API. Hasil klasifikasi disimpan per pengguna, bulan, dan tahun, sedangkan insight AI menggunakan hash SHA-256 dari transaksi serta target. Jika data tidak berubah, sistem memakai insight yang tersimpan tanpa memanggil AI kembali.

## Dampak dan Metrik Evaluasi

Tabel berikut merangkum perbandingan proses sebelum dan sesudah Smart Budgeting digunakan pada skenario evaluasi proyek:

| Metrik Evaluasi                  | Sebelum Sistem                                              | Sesudah Sistem                                     |
| -------------------------------- | ----------------------------------------------------------- | -------------------------------------------------- |
| Waktu klasifikasi pola belanja   | Sekitar 15-20 menit secara manual                           | Kurang dari 1,2 detik melalui inferensi model      |
| Akurasi deteksi belanja impulsif | Sekitar 45%, dipengaruhi bias subjektif                     | 92% berdasarkan evaluasi proyek                    |
| Waktu audit dan rekomendasi      | Sekitar 30 menit melalui perhitungan atau konsultasi manual | Kurang dari 3 detik melalui AI                     |
| Penentuan jumlah klaster         | Subjektif dan trial-and-error                               | Otomatis menggunakan model terlatih dengan `K = 3` |

Angka waktu dan akurasi tersebut adalah hasil evaluasi pada skenario dan dataset proyek, sehingga dapat berbeda bergantung pada jumlah transaksi, kondisi database, koneksi API, dan lingkungan deployment.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) App Router dan React 19
- **Database:** PostgreSQL, cocok digunakan dengan [Neon](https://neon.tech)
- **ORM:** [Prisma 7](https://www.prisma.io) dengan `@prisma/adapter-pg`
- **AI:** [`@google/genai`](https://github.com/googleapis/js-genai) melalui Gemini Interactions API dengan model `gemini-3.1-flash-lite`
- **Klasifikasi:** Model hasil pelatihan lokal di `src/config/trained-model.json`; library `ml-kmeans` tersedia untuk kebutuhan pemodelan
- **Visualisasi:** [Recharts](https://recharts.org)
- **UI:** Tailwind CSS 4 dan `@phosphor-icons/react`
- **Autentikasi:** NextAuth Credentials dengan password yang di-hash menggunakan `bcrypt`
- **Validasi:** Zod

## Arsitektur Analisis

### 1. Inferensi Model Offline

Endpoint `/api/analysis/classification` mengambil transaksi pengeluaran bulan dan tahun yang dipilih. Tanggal transaksi dan nominal absolut dinormalisasi menggunakan parameter pada `trained-model.json`, lalu dibandingkan dengan centroid model menggunakan jarak berbobot:

- Bobot tanggal: `0.01`
- Bobot nominal: `0.99`
- Jumlah klaster model saat ini: `3`
- Klaster `0`: Hemat
- Klaster `1`: Sedang
- Klaster `2`: Boros

Model tidak menjalankan proses training atau pencarian Elbow pada setiap request. Nilai `optimalK`, centroid, parameter normalisasi, dan evaluasi WCSS disimpan sebagai artefak model di `src/config/trained-model.json`.

### 2. Penyimpanan Cache Klasifikasi

Hasil inferensi disimpan dengan `upsert` pada tabel `KmeansCache` menggunakan kombinasi unik `userId`, `month`, dan `year`. Request `GET` membaca cache, sedangkan `POST` menjalankan inferensi ulang dan memperbarui cache.

### 3. Insight Finansial oleh AI

Sistem menghitung total pemasukan, total pengeluaran, saldo, rekap pengeluaran per kategori, transaksi pengeluaran, dan target keuangan aktif. Data tersebut dikirim ke `gemini-3.1-flash-lite` melalui `@google/genai` dengan output JSON terstruktur.

Insight disimpan pada tabel `AiInsight`. SHA-256 dari transaksi dan target keuangan digunakan sebagai `dataHash`; selama hash tidak berubah, hasil insight yang tersimpan digunakan kembali tanpa memanggil AI.

### 4. Riwayat Analisis

Setiap proses analisis menyimpan rekam jejak pada tabel `ClusterHistory`, termasuk nilai klaster, metrik pemasukan/pengeluaran, kondisi kesehatan finansial, saran AI, dan review target.

## Endpoint Analisis Utama

- `GET /api/analysis/charts`: Mengambil tren pemasukan-pengeluaran tahunan dan alokasi kategori.
- `GET /api/analysis/classification?month={bulan}&year={tahun}`: Mengambil klasifikasi dari cache.
- `POST /api/analysis/classification?month={bulan}&year={tahun}`: Menjalankan inferensi dan menyimpan hasil terbaru.
- `GET /api/analysis/ai-insight?month={bulan}&year={tahun}`: Mengambil insight AI yang tersimpan.

Semua endpoint analisis membutuhkan sesi pengguna yang sudah terautentikasi.

## Memulai

### Prasyarat

- Node.js 18 atau lebih baru
- PostgreSQL lokal atau akun PostgreSQL seperti Neon
- API key Google Gemini

### Instalasi

```bash
git clone https://github.com/ammarrashiddd/mono-smart-budgeting.git
cd mono-smart-budgeting
npm install
```

### Environment Variables

Buat file `.env` di root project:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
GEMINI_API_KEY="your-gemini-api-key"
NEXTAUTH_SECRET="your-long-random-secret"
```

`DATABASE_URL` digunakan oleh Prisma adapter dan konfigurasi Prisma. `NEXTAUTH_SECRET` digunakan untuk session authentication; `BETTER_AUTH_SECRET` juga dapat digunakan sebagai fallback.

### Database dan Development Server

Untuk menerapkan migration yang sudah tersedia:

```bash
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) setelah server berjalan.

Perintah lain yang tersedia:

```bash
npm run build
npm run start
```

## Struktur Direktori Penting

```text
src/
	app/                  Halaman, layout, dan API routes Next.js
	components/           Form, navigasi, chart, dan skeleton UI
	config/               Artefak model klasifikasi terlatih
	generated/prisma/      Prisma Client hasil generate
	lib/                  Prisma client, kalkulasi finansial, dan helper analisis
prisma/
	schema.prisma         Model database dan enum kategori transaksi
	migrations/           Riwayat perubahan schema database
```
