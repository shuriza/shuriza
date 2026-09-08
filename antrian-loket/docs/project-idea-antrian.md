# Project Idea: Sistem Antrian & Pelayanan Publik Realtime

Status: rencana. Kandidat proyek flagship berikutnya untuk portofolio.

## Kenapa proyek ini

Empat proyek yang ada (`rekap_absensi`, `todos`, portfolio CMS, `bawang`)
semuanya CRUD request-response. Yang belum pernah dibuktikan:

- state realtime antar banyak klien
- multi-tenant / isolasi data antar instansi
- background job dan queue
- test + CI + Docker

Empat hal itu justru yang ditanyakan saat interview junior fullstack.

Domainnya juga sudah punya kredibilitas: pengalaman DPMPTSP Kota Kediri.
Target kerja (software house dan vendor layanan publik di Kediri, Malang,
Surabaya) mengenali masalahnya tanpa perlu dijelaskan.

## Ruang lingkup

Jangan lebih dari ini:

1. Warga ambil tiket antrian lewat web atau QR, dapat nomor dan estimasi tunggu.
2. Layar TV display antrian, update realtime tanpa refresh.
3. Loket petugas: panggil, lewati, selesai. Role per instansi.
4. Notifikasi WhatsApp saat sisa 3 antrian, lewat queue, bukan sinkron.
5. Dashboard: rata-rata waktu tunggu, waktu layan per loket, jam sibuk.
6. Multi-tenant: satu deploy melayani banyak instansi, data terisolasi.

## Stack

| Layer | Pilihan |
|-------|---------|
| API | Laravel 12 + MySQL |
| Realtime | Laravel Reverb (WebSocket) |
| Async | Redis queue + Horizon |
| Frontend web | Next.js 16 App Router + TypeScript |
| Infra | Docker Compose, GitHub Actions (Pest + build) |

## Yang dibuktikan ke recruiter

1. Realtime state antar banyak klien, bukan polling.
2. Tenant isolation lewat global scope dan policy. Lanjutan cerita RLS Supabase
   di portfolio ini.
3. Race condition nyata: dua loket memanggil nomor yang sama, diselesaikan
   dengan `lockForUpdate()`. Ini jawaban untuk pertanyaan interview soal bug
   produksi yang pernah ditemukan dan bagaimana memverifikasi perbaikannya.
4. Job gagal di-retry dengan backoff, API tidak ikut mati saat WhatsApp down.

## Acceptance sebelum dipin di GitHub

- Test: ambil tiket, panggil antrian, tenant A tidak bisa baca data tenant B,
  job WA di-retry saat gagal.
- CI hijau di setiap pull request.
- `docker compose up` langsung jalan.
- README menjawab lima pertanyaan di `docs/job-readiness-roadmap.md`.
- Demo video 60-90 detik.

## Estimasi

Tiga minggu.

- Minggu 1: domain, auth, multi-tenant.
- Minggu 2: realtime, queue, notifikasi.
- Minggu 3: dashboard, test, CI, demo.

## Catatan

Ini pengganti proyek pin terlemah, bukan proyek kelima. Tidak bertentangan
dengan `docs/job-readiness-roadmap.md` yang melarang menambah banyak proyek
tutorial.

## Opsi NativePHP

Lihat `docs/project-idea-nativephp.md`. Dua ide ini bisa digabung: aplikasi
loket petugas dibuat sebagai desktop app NativePHP.

## Alternatif yang sempat dipertimbangkan

- POS multi-cabang offline-first (PWA + IndexedDB, sinkron saat online).
  Pasar SME besar, tapi resolusi konflik stok rawan scope creep.
- Billing dan invoice berulang (webhook Midtrans/Xendit + idempotency).
  Paling banyak dicari, tapi lemah untuk demo.

Jangan dibangun: wrapper chatbot AI, todo app lain, clone e-commerce.
Portofolio sudah punya integrasi AI (`todos`) dan marketplace (`bawang`).
