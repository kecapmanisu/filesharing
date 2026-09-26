# LOWEILW FileShare — Vercel

## Yang dipakai
- Next.js
- Vercel Blob
- Client-side multipart upload
- Maksimum file di aplikasi: 1 GB
- List, download, copy link, delete

## Deploy
1. Buat project baru di Vercel dan import repository ini.
2. Buat Vercel Blob Store dari Vercel Dashboard.
3. Hubungkan Blob Store ke project. Vercel akan menyediakan `BLOB_READ_WRITE_TOKEN`.
4. Deploy ulang.
5. Buka URL `*.vercel.app`.

## Catatan
Vercel Blob adalah penyimpanan terpisah dari filesystem deployment Vercel. Biaya, kuota, dan batas ukuran aktual mengikuti paket/storage Vercel yang digunakan.
Untuk website publik, endpoint delete sebaiknya diberi autentikasi/admin. Versi demo ini belum memiliki login.
