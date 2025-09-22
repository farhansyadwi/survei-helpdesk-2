# Survei Kepuasan Pengguna Helpdesk Acset

Aplikasi web sederhana (Node.js + Express) untuk mengumpulkan survei dan meneruskan data ke Discord Webhook.

## Fitur
- Landing page bertema putih-biru-kuning.
- Form survei dengan identitas, 9 pertanyaan skala Likert (1-5), dan pertanyaan terbuka.
- Kirim ke endpoint backend yang akan menambahkan IP, User-Agent (device), dan waktu.
- Data diteruskan ke Discord Webhook dalam format embed.
- Halaman terima kasih setelah submit.

## Menjalankan secara lokal
1. Pastikan Node.js terinstal (versi 18+ disarankan).
2. Buka terminal pada folder proyek ini.
3. Install dependency:
   ```bash
   npm install
   ```
4. Salin `.env.example` menjadi `.env` (opsional). Secara default, aplikasi menggunakan URL webhook yang sudah ditentukan. Anda dapat menggantinya:
   ```env
   WEBHOOK_URL="<url_webhook_discord_anda>"
   PORT=3000
   ```
5. Jalankan aplikasi:
   ```bash
   npm start
   ```
6. Buka browser ke `http://localhost:3000`.

## Struktur Proyek
```text
acset-helpdesk-survey/
├─ api/                      # Endpoint serverless untuk Vercel
│  └─ submit.js              # POST /api/submit (Vercel)
├─ public/                   # File statis (untuk lokal & Vercel)
│  ├─ index.html             # Landing + Form Data Diri
│  ├─ survey.html            # Form survei (Likert + Saran)
│  ├─ thankyou.html          # Halaman terima kasih
│  ├─ styles.css             # Gaya global (tema putih-biru-kuning)
│  ├─ survey.js              # Logika submit form survei
│  ├─ index.js               # Simpan Data Diri -> localStorage
│  └─ assets/                # (opsional) folder aset/logo
├─ server.js                 # Server Express untuk menjalankan lokal
├─ package.json
├─ vercel.json               # Konfigurasi deploy Vercel
├─ .gitignore
└─ .env.example
```

Keterangan:
- Untuk LOKAL, aplikasi dijalankan oleh `server.js` (Express) dan endpoint ada di `POST /api/submit`.
- Untuk VERCEL, aplikasi dilayani statis dari folder `public/` dan endpoint di-serve oleh fungsi serverless `api/submit.js` (jalur tetap `POST /api/submit`).

## Deploy ke GitHub
1. Inisialisasi repository (jika belum):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Acset Helpdesk Survey"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
2. Pastikan file `.gitignore` sudah ada agar `node_modules/` tidak ikut terdorong.

## Deploy ke Vercel
1. Buat project baru di Vercel dan hubungkan ke repo GitHub Anda.
2. Pada Project Settings → Environment Variables, tambahkan:
   - `WEBHOOK_URL` = URL Discord Webhook Anda.
3. Vercel akan otomatis mendeteksi `vercel.json` dan melakukan build & deploy:
   - Static files dari `public/`
   - API route dari `api/submit.js` (akses di `/api/submit`)
4. Setelah deploy, uji:
   - Buka halaman: `https://<project-name>.vercel.app/`
   - Isi Data Diri → Mulai Survei → isi survei → Submit
   - Periksa channel Discord untuk pesan embed yang masuk.

## Catatan Keamanan
- Untuk produksi, sebaiknya simpan URL webhook di variabel lingkungan (`.env`) dan jangan commit `.env` ke repo.
- Jika aplikasi di-deploy di belakang proxy (mis. Nginx), aktifkan header `X-Forwarded-For` agar IP asli tercatat.

## Catatan
- Jika Anda menyimpan logo di `public/assets/logo.png` maka referensi gambar di HTML adalah `/assets/logo.png`. Jika Anda memindahkan logo ke `public/logo.png`, gunakan `src="/logo.png"`.
- Data Diri disimpan di `localStorage` dan dikirim saat submit survei. Anda bisa menghapusnya otomatis di `thankyou.html` bila diperlukan.
