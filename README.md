<div align="center">

[![Contributors](https://img.shields.io/github/contributors/Humble011/ecosort-hacktiv8.svg?style=for-the-badge)](https://github.com/Humble011/ecosort-hacktiv8/graphs/contributors)
[![Forks](https://img.shields.io/github/forks/Humble011/ecosort-hacktiv8.svg?style=for-the-badge)](https://github.com/Humble011/ecosort-hacktiv8/network/members)
[![Stargazers](https://img.shields.io/github/stars/Humble011/ecosort-hacktiv8.svg?style=for-the-badge)](https://github.com/Humble011/ecosort-hacktiv8/stargazers)
[![Issues](https://img.shields.io/github/issues/Humble011/ecosort-hacktiv8.svg?style=for-the-badge)](https://github.com/Humble011/ecosort-hacktiv8/issues)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<br />

<a href="https://github.com/Humble011/ecosort-hacktiv8">
  <img src="public/ecosort-ai.png" alt="Logo" width="100" height="100">
</a>

<h2 align="center">EcoSort AI</h2>

<p align="center">
  Smart Multimodal Waste Sorting Assistant powered by Gemini 3.5 Flash Lite
  <br />
  <a href="https://ecosort-hacktiv8.vercel.app/"><strong>View Demo »</strong></a>
  <br />
  <br />
  <a href="https://ecosort-hacktiv8.vercel.app/">Explore the App</a>
  ·
  <a href="https://github.com/Humble011/ecosort-hacktiv8/issues">Report Bug</a>
  ·
  <a href="https://github.com/Humble011/ecosort-hacktiv8/issues">Request Feature</a>
</p>

</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#key-features">Key Features</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

---

## About The Project

EcoSort AI adalah asisten cerdas berbasis web yang memandu pengguna mengidentifikasi, memilah, dan mengelola sampah harian secara tepat serta ramah lingkungan. Sistem memanfaatkan kapabilitas multimodal **Gemini 3.5 Flash Lite** untuk menganalisis input teks, citra foto fisik, dokumen daftar limbah, maupun rekaman suara langsung via browser.

---

## Built With

* [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
* [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
* [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
* [![Google Gemini](https://img.shields.io/badge/Gemini_AI-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
* [![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)


## Key Features

* **Pemrosesan Multimodal Terpadu:**
  * **Teks:** Penjelasan interaktif seputar pemilahan, jenis material, dan cara daur ulang sampah.
  * **Gambar:** Identifikasi visual sampah fisik secara instan (`JPG`, `PNG`, `WebP`).
  * **Dokumen:** Analisis daftar atau laporan inventaris limbah dari berkas (`PDF`, `TXT`, `CSV`).
  * **Audio Langsung:** Perekaman suara langsung dari peramban (`audio/webm`) tanpa alur transkripsi eksternal.
* **Klasifikasi Terstruktur:** Mengelompokkan sampah ke kategori baku (Organik, Anorganik, B3/E-Waste, Residu) dilengkapi panduan penanganan awal dan rekomendasi titik pembuangan.
* **Penyimpanan Riwayat Percakapan:** Memanfaatkan HTML5 LocalStorage agar percakapan tetap tersimpan saat halaman dimuat ulang.
* **Tampilan Responsif & Adaptif:** Antarmuka ramah pengguna di perangkat seluler maupun komputer, dengan dukungan Mode Terang dan Mode Gelap.

---

## Getting Started

### Prasyarat

Pastikan perangkat lokal sudah terpasang:
* [Node.js](https://nodejs.org/) (versi 18 ke atas)
* npm (Node Package Manager)
* Kunci API dari [Google AI Studio](https://aistudio.google.com/)

### Langkah Instalasi

1. **Clone repositori:**
   ```bash
   git clone [https://github.com/Humble011/ecosort-hacktiv8.git](https://github.com/Humble011/ecosort-hacktiv8.git)
   cd ecosort-hacktiv8

2. **Pasang dependensi:**
```bash
npm install

```

3. **Konfigurasi Environment Variable:**
Buat file `.env` pada direktori utama:
```env
GEMINI_API_KEY=masukkan_api_key_gemini_anda
PORT=3000

```

4. **Jalankan server:**
```bash
npm start

```

Buka peramban di `http://localhost:3000`.

---

## License

Didistribusikan di bawah Lisensi MIT. Proyek ini disusun untuk penyelesaian Final Project program Hacktiv8 "Maju Bareng AI for IT Professional".
