# Portfolio Nahza Maesarah

Portofolio ini dibuat dengan Next.js, React, TypeScript, Tailwind CSS, Express, dan SQLite. Next.js menampilkan situs di port 3000. Express menangani API di port 4000, sedangkan SQLite menyimpan proyek, sertifikat, keterampilan, pesan kontak, Suka, komentar, serta testimoni.

## Menjalankan di komputer

Perlu Node.js 24.10 atau lebih baru karena server Express memuat pengaturan `.env.local` melalui opsi Node dan database memakai SQLite bawaan Node.js.

1. Buka folder proyek ini di terminal.
2. Pasang paket: `npm install`
3. Salin `.env.example` menjadi `.env.local`.
4. Ganti `ADMIN_PASSWORD` dengan kata sandi pilihanmu dan isi `ADMIN_SESSION_SECRET` dengan string acak panjang.
5. Jalankan `npm run dev`. Perintah ini menyalakan Express API dan Next.js bersamaan; buka http://localhost:3000.

Untuk membuat secret acak di PowerShell: `[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))`

Database dibuat otomatis di `data/portfolio.sqlite` saat situs pertama kali dijalankan. File database tidak dimasukkan ke Git.

Permintaan `/api/...` dari situs diteruskan Next.js ke Express melalui rewrite. Untuk mencoba API langsung, buka `http://127.0.0.1:4000/api/health`; hasilnya `{ "ok": true, "service": "express-api" }`.

## Mengelola konten

Buka `/admin` secara langsung dan masuk menggunakan `ADMIN_PASSWORD` dari `.env.local`. Tautan Admin tidak ditampilkan di Footer publik. Halaman Admin dapat menambah/mengubah/menghapus proyek, sertifikat, dan keterampilan, menyetujui atau menyembunyikan testimoni, serta menghapus pesan kontak dan komentar proyek.

Untuk proyek dan sertifikat, Admin dapat memilih gambar JPG, PNG, atau WEBP hingga 5 MB. File disimpan di `public/uploads/` dan alamat gambarnya disimpan pada database.

Testimoni yang dikirim pengunjung menunggu persetujuan admin. Pesan dari formulir kontak, komentar proyek, dan jumlah Suka tersimpan di database. Pesan kontak hanya terlihat di halaman Admin; formulir tersebut belum mengirim email.

## CV

Tautan CV membuka PDF asli yang diberikan pemilik, `public/CV-Nahza-Maesarah.pdf`.

Formulir kontak hanya tersedia di halaman `/contact`; Footer global hanya menampilkan alamat email, Instagram, dan tautan ke halaman Kontak. Form testimoni tetap tersedia di `/testimoni` saja.

## Catatan penerapan

SQLite lokal cocok untuk tugas dan penggunaan satu komputer. Untuk menerbitkan situs ke layanan hosting, siapkan database persisten yang didukung layanan tersebut dan pindahkan variabel rahasia melalui pengaturan environment hosting. Jangan mengunggah `.env.local` atau database yang berisi pesan pribadi.
