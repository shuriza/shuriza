# Website Desa Muneng

Website komunitas untuk **Desa Muneng, Kecamatan Purwoasri, Kabupaten Kediri, Jawa Timur**.

> **Bukan situs resmi pemerintah desa.** Dibangun secara independen oleh dan untuk warga
> sebagai ruang berbagi kabar, agenda, kenangan, dan potensi desa.

## Fitur

### Publik (tanpa login)

| Halaman | Rute | Keterangan |
|---|---|---|
| Beranda | `/` | Hero, akses cepat, pengumuman prioritas, ringkasan tiap kanal |
| Profil Desa | `/profil-desa` | Sejarah, demografi, geografi, visi-misi, perangkat desa |
| Berita | `/berita`, `/berita/{slug}` | Pengumuman & kabar desa, item tersemat di atas |
| Acara | `/acara`, `/acara/{slug}` | Agenda desa, hanya menampilkan acara dari hari ini ke depan |
| Kenangan | `/kenangan`, `/kenangan/{id}` | Feed kenangan warga dengan embed YouTube/TikTok/Facebook/Instagram, reaksi emoji, komentar |
| Destinasi | `/destinasi`, `/destinasi/{slug}` | Tempat & fasilitas desa, galeri foto, peta |
| UMKM | `/umkm`, `/umkm/{slug}` | Produk & jasa warga, kontak WhatsApp langsung |
| Galeri | `/galeri` | Grid foto dengan lightbox dan filter album |
| Peta | `/peta` | Peta wilayah desa (OpenStreetMap) |
| Kontak | `/kontak` | Formulir pesan ke pengelola + informasi kontak |
| Sitemap | `/sitemap.xml` | Termasuk seluruh halaman detail acara, destinasi, berita, UMKM, kenangan |

Yang bisa dilakukan tanpa akun:

- **Kirim informasi** (`POST /submissions`) — usulan berita/acara/UMKM dari warga
- **Daftarkan UMKM** (`/umkm/submit`) — masuk antrean moderasi admin
- **Kirim pesan** (`/kontak`) — tersimpan di kotak masuk admin
- **Reaksi emoji** & **ikut polling** — diidentifikasi lewat sesi, bukan akun

### Warga (perlu login)

- `/kenangan/submit` — kirim kenangan; tautan otomatis di-scrape (judul, deskripsi, thumbnail, embed)
- `/dashboard-saya` — kenangan & UMKM yang pernah dikirim beserta statusnya
- `/profile` — ubah profil, kata sandi, hapus akun
- Menyukai dan mengomentari konten

### Admin (`/admin`)

| Modul | Kemampuan |
|---|---|
| Dashboard | 11 metrik ringkas + antrean moderasi terbaru |
| Event, Destinasi, Pengumuman | CRUD penuh termasuk unggah gambar & galeri |
| Kenangan, Kiriman, UMKM | Moderasi: setujui / tolak / hapus |
| Pesan Masuk | Kotak masuk formulir kontak: tandai dibaca, arsipkan, hapus, balas via email |
| Info Desa | Ubah data profil desa secara inline |
| Galeri Foto | Unggah & hapus foto |
| Polling | Buat polling, aktif/nonaktif, lihat hasil |

## Stack

- **Backend** — Laravel 13 (PHP 8.3), SQLite untuk pengembangan
- **Frontend** — Inertia.js v2 + React 18 + TypeScript, Vite 8
- **Styling** — Tailwind CSS 3 dengan token semantik, `framer-motion`, `lucide-react`
- **Auth** — Laravel Breeze (React), peran `admin` / `warga`

Angka saat ini: 18 model, 41 controller, 46 halaman React, 31 primitif UI, 5 kartu domain,
21 migrasi, 13 berkas test.

## Menjalankan secara lokal

```bash
cd desa

# 1. Dependensi
composer install
npm install --legacy-peer-deps   # wajib: lihat catatan di bawah

# 2. Environment
cp .env.example .env
php artisan key:generate

# 3. Database + data contoh
touch database/database.sqlite
php artisan migrate:fresh --seed

# 4. Symlink storage (agar foto tampil)
php artisan storage:link

# 5. Jalankan
composer dev          # Laravel + queue + log + Vite sekaligus
# atau dua terminal:
php artisan serve
npm run dev
```

Buka `http://localhost:8000`.

> Di Windows, `composer dev` menjalankan `php artisan pail` yang membutuhkan ekstensi
> `pcntl` dan akan gagal. Pakai dua terminal (`php artisan serve` + `npm run dev`).

### Akun contoh

| Peran | Email | Kata sandi |
|---|---|---|
| Admin | `admin@desamuneng.id` | `password` |
| Warga | `warga@desamuneng.id` | `password` |

> Kredensial ini **hanya untuk pengembangan**. Ganti sebelum dipakai publik.

### Catatan instalasi npm

`laravel-vite-plugin@3.1` membutuhkan Vite 8, sedangkan `@vitejs/plugin-react@4.x`
membatasi di Vite 7. Karena itu instalasi harus memakai:

```bash
npm install --legacy-peer-deps
```

## Perintah

```bash
npm run build     # tsc + vite build (typecheck ikut dijalankan)
npm run dev       # Vite dev server
composer test     # PHPUnit
composer dev      # Laravel + queue listener + pail + Vite (pail perlu pcntl)

php artisan migrate:fresh --seed        # reset database + data contoh
php artisan memories:scrape --url="…"   # scrape satu tautan jadi kenangan
php artisan memories:scrape --all       # perbarui metadata semua kenangan
```

## Arsitektur

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Public/     # HomeController, EventController, MemoryController, …
│   │   ├── Admin/      # Dashboard, CRUD, moderasi (middleware: auth + admin)
│   │   ├── Api/        # Search, Reaction, Like, Comment, Poll, Scraper
│   │   └── Auth/       # Breeze
│   ├── Middleware/     # AdminMiddleware, HandleInertiaRequests
│   └── Requests/
├── Models/             # 18 model; Traits/ berisi Likeable & Commentable (polimorfik)
└── Services/           # MediaScraper (oEmbed + Open Graph)

resources/js/
├── Pages/
│   ├── Public/         # Halaman publik
│   ├── Admin/          # Panel admin
│   ├── Auth/           # Login, Register, reset kata sandi
│   └── Profile/
├── Layouts/
│   ├── PublicLayout.tsx + public/   # Navbar, Footer, Logo, UserMenu
│   ├── AdminLayout.tsx              # Sidebar admin
│   ├── AuthenticatedLayout.tsx      # Shell warga
│   └── GuestLayout.tsx              # Shell auth
├── Components/
│   ├── ui/             # 31 primitif: Button, Card, Field, Badge, EmptyState, …
│   └── cards/          # EventCard, MemoryCard, DestinationCard, AnnouncementCard, ProductCard
├── lib/                # cn.ts (clsx + tailwind-merge), motion.ts
└── types/index.d.ts

routes/
├── web.php             # Publik + warga + admin + endpoint SPA (`/api/*`)
├── auth.php            # Breeze
└── console.php
```

### Kenapa `/api/*` ada di `web.php`

Endpoint `/api/*` hanya dipakai oleh XHR dari halaman Inertia yang sama-origin. Endpoint
tersebut **butuh sesi** (reaksi dan polling diidentifikasi lewat `session_id`) dan **butuh
proteksi CSRF** (tulis terautentikasi diotorisasi oleh cookie sesi). Grup middleware `api`
milik Laravel bersifat stateless sehingga tidak menyediakan keduanya — karena itu rute-rute
ini didaftarkan di `web.php` dengan prefix `api`. Tidak ada token API yang diterbitkan.

## Konvensi

- **Bahasa Indonesia** untuk seluruh teks antarmuka dan konten
- **Token semantik**, bukan literal palet Tailwind:
  - teks: `text-ink-1` (judul), `text-ink-2` (isi), `text-ink-3` (meta)
  - permukaan: `bg-surface-1` / `-2` / `-3`, `bg-surface-inverse`
  - garis: `border-line`, `border-line-subtle`, `border-line-strong`
  - merek: `bg-brand`, `text-brand-strong`, `bg-brand-soft`, `ring-brand-ring`
  - aksen: `bg-accent`, `text-accent-strong`, `bg-accent-soft`
  - Warna status (`red-*`, `amber-*`, `blue-*`) dipakai lewat varian `Badge`
- Ikon memakai `lucide-react`; tidak ada `<svg>` inline di halaman
- Tidak ada rute bernama `dashboard` — setelah login, admin ke `/admin`, warga ke `/`
- Kiriman publik tidak memerlukan autentikasi; endpoint tulis publik dibatasi `throttle`
- `is_pinned` pada kenangan menandai "Kenangan Pilihan" di bagian atas feed

## Database

SQLite di `database/database.sqlite` (pengembangan), 21 migrasi.

Tabel utama: `users`, `events`, `memories`, `destinations`, `destination_images`,
`announcements`, `submissions`, `products`, `gallery_photos`, `polls`, `poll_votes`,
`reactions`, `likes`, `comments`, `memory_albums`, `village_info`, `categories`,
`contact_messages`.

`GallerySeeder` membuat sendiri berkas foto contoh di `storage/app/public/gallery`, sehingga
`migrate:fresh --seed` selalu menghasilkan galeri yang benar-benar tampil.

## Test

```bash
composer test
```

Mencakup moderasi & visibilitas kenangan, alur pesan kontak (termasuk honeypot dan
otorisasi admin), endpoint SPA (sesi reaksi, autentikasi like, otorisasi hapus komentar),
filter acara di beranda, serta seluruh alur autentikasi Breeze.

## Catatan pengembangan

- **False positive LSP PHP** — Intelephense melaporkan "Undefined type" untuk referensi
  antar-model dan metode trait (`morphMany`). Kode berjalan normal; abaikan.
- **Email** — `MAIL_MAILER=log` pada pengembangan, jadi tautan verifikasi dan reset kata
  sandi hanya muncul di `storage/logs/laravel.log`.
- **Foto** — perlu `php artisan storage:link` agar `/storage/*` bisa diakses.

## Aset eksternal

- Latar hero: foto sawah dari Unsplash (hotlink)
- Peta: sematan iframe OpenStreetMap
- Font: Plus Jakarta Sans via fonts.bunny.net
