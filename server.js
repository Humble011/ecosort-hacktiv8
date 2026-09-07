import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Batasan format berkas multimodal yang didukung
const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/webp',
    'application/pdf', 'text/plain', 'text/csv',
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/webm'
];

// Konfigurasi Multer memory storage dengan batas ukuran 10MB
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Tipe berkas tidak didukung: ${file.mimetype}`));
        }
    }
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Panduan persona dan instruksi alur percakapan Gemini
const SYSTEM_INSTRUCTION = `
Role: Anda adalah EcoSort AI, asisten pemilahan dan pengelolaan sampah ramah lingkungan yang solutif, ramah, dan interaktif.

Gaya Komunikasi:
- Gunakan bahasa Indonesia yang santai tapi tetap sopan, jelas, dan tidak kaku/robotik.
- Hindari template kalimat penutup yang sama berulang-ulang.

Aturan Respons:
1. Panduan Cepat & Terstruktur (Langsung to-the-point):
   Ketika pengguna mengirimkan foto, rekaman suara, dokumen, atau menyebutkan suatu benda:
   - Sebutkan nama/identitas benda dan Klasifikasinya: Organik, Anorganik (Kertas/Plastik/Kaca/Logam), B3 (Bahan Berbahaya & Beracun), atau Residu.
   - Berikan Langkah Singkat Persiapan: Pembersihan awal praktis (misal: bilas sisa minyak/minuman, tiriskan, pipihkan, atau pisahkan tutup botol).
   - Berikan Rekomendasi Pembuangan: Tong sampah yang sesuai (Kompos/Biopori, Bank Sampah, Dropbox E-Waste/B3, atau TPS Residu).

2. Interaksi Dua Arah yang Dinamis (Contextual Follow-up):
   - Jangan menanyakan "Apakah Anda ingin tahu cara pembuangan?" (karena sudah dijawab di atas).
   - Buat pertanyaan penutup atau penawaran yang relevan dengan benda tersebut, misalnya:
     * Untuk botol/kardus: Menawarkan ide kreasi daur ulang (DIY) atau cara menjualnya ke bank sampah.
     * Untuk sisa makanan/organik: Menawarkan cara membuat kompos sederhana atau lubang biopori di rumah.
     * Untuk sampah B3/elektronik: Menawarkan informasi bahaya kandungannya atau lokasi drop-point terdekat.

3. Penolakan Topik di Luar Konteks:
   - Jika pengguna bertanya di luar topik lingkungan, pengelolaan sampah, daur ulang, atau keberlanjutan alam, tolak secara sopan dan arahkan kembali ke topik sampah/lingkungan.

Gunakan Markdown yang rapi (bold, bullet points) agar mudah dibaca sekilas.
`;

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Endpoint inferensi chat dan pemrosesan multimodal
app.post('/api/chat', upload.single('file'), async (req, res) => {
    try {
        const userMessage = req.body.message || '';
        const uploadedFile = req.file;
        let history = [];

        // Ekstraksi konteks percakapan multi-turn dari client
        if (req.body.history) {
            try {
                history = JSON.parse(req.body.history);
            } catch (err) {
                history = [];
            }
        }

        if (!userMessage && !uploadedFile) {
            return res.status(400).json({ error: 'Harap berikan teks pertanyaan atau unggah berkas.' });
        }

        // Penyusunan komponen data input (inline buffer base64 & teks)
        const currentParts = [];

        if (uploadedFile) {
            currentParts.push({
                inlineData: {
                    data: uploadedFile.buffer.toString('base64'),
                    mimeType: uploadedFile.mimetype
                }
            });
        }

        if (userMessage.trim()) {
            currentParts.push({ text: userMessage.trim() });
        } else {
            currentParts.push({ text: 'Tolong identifikasi sampah pada berkas ini.' });
        }

        const contents = [
            ...history,
            {
                role: 'user',
                parts: currentParts
            }
        ];

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash-lite',
            contents: contents,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.2
            }
        });

        res.json({
            status: 'success',
            reply: response.text
        });

    } catch (error) {
        console.error('Error pada Gemini API:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Gagal memproses analisis AI.'
        });
    }
});

app.listen(port, () => {
    console.log(`Server EcoSort AI aktif di http://localhost:${port}`);
});