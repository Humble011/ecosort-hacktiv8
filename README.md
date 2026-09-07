# EcoSort AI — Smart Waste Sorting Assistant

EcoSort AI adalah asisten cerdas berbasis web yang memandu pengguna mengidentifikasi, memilah, dan mengelola sampah secara tepat serta ramah lingkungan. Aplikasi ini mengintegrasikan kapabilitas multimodal dari model **Gemini 3.5 Flash Lite** untuk memproses input teks, citra fisik, dokumen daftar limbah, maupun rekaman suara langsung dari antarmuka web.

---

## Teknologi yang Digunakan

* ![Node.js](https://img.shields.io/badge/NODE.JS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
* ![Express.js](https://img.shields.io/badge/EXPRESS.JS-000000?style=for-the-badge&logo=express&logoColor=white)
* ![Tailwind CSS](https://img.shields.io/badge/TAILWIND_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
* ![Google Gemini](https://img.shields.io/badge/GEMINI_AI-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white)
* ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
* ![JavaScript](https://img.shields.io/badge/JAVASCRIPT-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
* ![Vercel](https://img.shields.io/badge/VERCEL-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## Tautan Proyek

* **Live Deployment:** [https://ecosort-hacktiv8.vercel.app](https://ecosort-hacktiv8.vercel.app/)
* **Repositori GitHub:** [https://github.com/Humble011/ecosort-hacktiv8](https://github.com/Humble011/ecosort-hacktiv8)

---

## Fitur Utama

* **Pemrosesan Multimodal Terpadu:**
  * **Teks:** Pertanyaan terbuka seputar penanganan dan tata cara daur ulang sampah.
  * **Gambar:** Unggah foto objek sampah (`JPG`, `PNG`, `WebP`) untuk identifikasi jenis material secara visual.
  * **Dokumen:** Analisis daftar atau laporan inventaris limbah melalui dokumen (`PDF`, `TXT`, `CSV`).
  * **Audio Langsung:** Perekaman suara melalui browser menggunakan MediaStream Recording API (`audio/webm`) yang diproses langsung oleh Gemini API.
* **Klasifikasi Terstruktur:** Menghasilkan kategori sampah (Organik, Anorganik, B3/E-Waste, Residu) beserta instruksi persiapan pembuangan (seperti pembilasan, pelepasan baterai, atau pemipihan wadah).
* **Penyimpanan Lokal Sesi:** Menggunakan HTML5 LocalStorage untuk menjaga kontinuitas riwayat obrolan pengguna.
* **Tata Letak Adaptif:** Antarmuka responsif penuh untuk peramban ponsel dan layar komputer meja, dilengkapi dukungan Mode Terang dan Mode Gelap.

---

## Struktur Direktori

```text
ecosort-hacktiv8/
├── api/
│   └── index.js              # Serverless handler Express.js untuk deployment Vercel
├── public/
│   ├── index.html            # Antarmuka web utama
│   ├── style.css             # Penataan tata letak, variabel tema, dan media queries
│   ├── script.js             # Logika interaksi klien, rekaman audio, dan penyimpanan lokal
│   ├── ecosort-ai.png        # Aset visual logo dan maskot
│   └── pattern.svg           # Aset latar belakang desktop
├── .env.example              # Draf konfigurasi environment variable
├── package.json              # Daftar pustaka dan metadata aplikasi Node.js
├── vercel.json               # Konfigurasi routing serverless Vercel
└── README.md                 # Berkas dokumentasi repositori

```

---

## Panduan Instalasi dan Pengujian Lokal

### Prasyarat Sistem

* Node.js versi 18 ke atas
* npm (Node Package Manager)
* Kunci akses Google Gemini API

### Langkah-langkah

1. **Kloning repositori:**
```bash
git clone [https://github.com/Humble011/ecosort-hacktiv8.git](https://github.com/Humble011/ecosort-hacktiv8.git)
cd ecosort-hacktiv8

```


2. **Pasang paket dependensi:**
```bash
npm install

```


3. **Siapkan konfigurasi variabel lingkungan:**
Salin berkas contoh konfigurasi:
```bash
cp .env.example .env

```


Isikan nilai variabel di dalam file `.env`:
```env
GEMINI_API_KEY=masukkan_api_key_gemini_anda
PORT=3000

```


4. **Jalankan aplikasi:**
```bash
npm start

```


Akses aplikasi pada peramban melalui alamat `http://localhost:3000`.

---

## Konfigurasi Variabel Lingkungan

| Variabel | Tipe | Deskripsi | Wajib |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | String | Kunci otentikasi Google Gemini API dari Google AI Studio | Ya |
| `PORT` | Number | Port server lokal (default: 3000) | Tidak |

---

## Lisensi dan Hak Cipta

Proyek ini disusun untuk penyelesaian Final Project program Hacktiv8 AI Engineering Track dan didistribusikan di bawah lisensi MIT.

