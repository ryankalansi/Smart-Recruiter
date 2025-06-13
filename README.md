# AI Smart Recruiter

Sebuah aplikasi web berbasis kecerdasan buatan (AI) yang dirancang untuk membantu para pencari kerja khususnya fresh graduate untuk meningkatkan CV mereka. Aplikasi ini menyediakan analisis komprehensif, penilaian (scoring), dan rekomendasi pekerjaan yang disesuaikan berdasarkan kualifikasi pengguna dengan nilai persentase yang diberikan.

## ✨ Fitur Utama

-   **Penilaian CV (CV Scoring)**: Dapatkan skor komprehensif berdasarkan struktur, konten, dan kesesuaian CV Anda dengan standar industri.
-   **Rekomendasi Pekerjaan**: AI akan menyarankan posisi pekerjaan yang paling sesuai dengan keahlian dan pengalaman Anda.
-   **Analisis Kompatibilitas**: Ukur seberapa cocok CV Anda dengan pekerjaan tertentu melalui nilai persentase yang diberikan.

## 🚀 Cara Kerja

Sistem ini bekerja dalam tiga langkah sederhana:

1.  **Upload**: Upload CV Anda dalam format PDF.
2.  **Analisis AI**: Model AI kami akan menganalisis konten, format, dan relevansi CV Anda.
3.  **Lihat Hasil**: Dapatkan laporan komprehensif beserta penilaian yang diberikan.

## 📄 Halaman Aplikasi

Aplikasi ini terdiri dari beberapa halaman utama:

-   **Landing Page**: Halaman utama yang memperkenalkan fitur-fitur aplikasi.
-   **Login & Register**: Halaman untuk autentikasi pengguna.
-   **Upload Page**: Halaman di mana pengguna dapat mengunggah CV mereka untuk dianalisis.
-   **Result Page**: Menampilkan hasil analisis mendalam dari CV yang telah diunggah.

## 🛠️ Tumpukan Teknologi (Tech Stack)

Proyek ini dibangun menggunakan teknologi modern berikut:

-   **Frontend**: React.js & Vite
-   **Styling**: Tailwind CSS
-   **Routing**: React Router DOM
-   **HTTP Client**: Axios
-   **Linting**: ESLint
-   **Deployment**: Konfigurasi untuk Vercel disertakan.

## ⚙️ Memulai Proyek

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut.

### Prasyarat

Pastikan Anda telah menginstal Node.js dan npm (atau package manager lain seperti Yarn/pnpm) di mesin Anda.

### Instalasi & Menjalankan

1.  **Clone repositori ini:**
    ```bash
    git clone <URL_REPOSITORI_ANDA>
    ```

2.  **Masuk ke direktori proyek:**
    ```bash
    cd smart-recruiter
    ```

3.  **Instal dependensi:**
    ```bash
    npm install
    ```

4.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:5150`.

## 📦 Skrip yang Tersedia

Dalam file `package.json`, Anda akan menemukan beberapa skrip:

-   `npm run dev`: Menjalankan aplikasi dalam mode pengembangan dengan Vite.
-   `npm run build`: Mem-bundle aplikasi untuk produksi ke dalam folder `dist`. Skrip ini juga akan melakukan minifikasi dan menghapus `console.log`.
-   `npm run lint`: Menjalankan ESLint untuk memeriksa masalah pada kode.
-   `npm run preview`: Menjalankan server lokal untuk melihat hasil build produksi.

## 🌐 API Backend

Frontend ini terhubung ke layanan backend yang di-host di Vercel untuk fungsionalitas autentikasi dan analisis CV. Endpoint utama API berada di:
`https://be-dicoding-cv-o8hg.vercel.app/api/`.
