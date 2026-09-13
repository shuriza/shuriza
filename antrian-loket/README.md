# Antrian Loket

[![Antrian Loket CI](https://github.com/shuriza/shuriza/actions/workflows/antrian-loket.yml/badge.svg?branch=feat%2Fui-refactor)](https://github.com/shuriza/shuriza/actions/workflows/antrian-loket.yml)

Aplikasi desktop lokal untuk petugas loket pelayanan publik. Dibangun dengan Laravel 13, NativePHP Desktop 2, SQLite, Blade, Tailwind CSS 4, dan JavaScript tanpa framework frontend. Antarmuka berbahasa Indonesia.

## Status pengembangan

| Area | Status | Batas |
|---|---|---|
| Operasi loket offline | Siap diuji operator | Ambil, panggil, lewati, selesai, dan audit/outbox berjalan lokal |
| Printer NativePHP | Terimplementasi | Validasi akhir memerlukan printer fisik 58 mm dan driver sasaran |
| Sinkronisasi | Klien dan resolusi konflik tersedia | Server pusat dan alokasi nomor lintas perangkat belum tersedia |
| Backup dan kesehatan outbox | Tersedia | Restore tetap manual dan dilakukan ketika aplikasi ditutup |
| Installer internal Windows x64 | Pernah berhasil dibangun | Source aplikasi masih terekspos pada build tanpa secure bundle |
| Distribusi publik | Diblokir release gate | Memerlukan secure bundle Bifrost dan code signing Windows |

Quality gate aktif menjalankan Pint, migrasi database baru, PHPUnit, dan build Vite. Klaim kesiapan rilis harus tetap mengikuti batas di atas, bukan hanya status CI hijau.

## Masalah apa yang diselesaikan?

Petugas tetap perlu menerbitkan nomor, memanggil antrean, melewati tiket, menyelesaikan pelayanan, dan mencetak struk ketika internet kantor putus. Operasi lokal tidak menunggu server pusat: perubahan tiket, riwayat, dan outbox disimpan dalam transaksi database lokal.

## Untuk siapa?

Petugas loket pelayanan publik, dengan contoh layanan perizinan, legalisasi, dan pengaduan. Domain terinspirasi pelayanan publik di Kota Kediri; proyek ini bukan aplikasi resmi pemerintah.

## Apa yang diimplementasikan dalam proyek ini?

- Nomor tiket harian per layanan, misalnya `A001`, tersimpan dengan tanggal `Y-m-d`.
- Pemilih loket, konsol panggil/selesai/lewati, jumlah menunggu, dan estimasi waktu berdasarkan durasi layanan.
- Pratinjau struk 58 mm dan pengiriman ke printer lokal melalui NativePHP; pencetakan browser tetap tersedia untuk pengembangan.
- Identitas perangkat persisten, audit peristiwa tiket, dan outbox untuk perubahan yang belum dikirim.
- Klien sinkronisasi push/pull dan resolusi konflik. **Server pusat tidak disertakan.** Mengisi endpoint saja tidak menyediakan server atau menjamin sinkronisasi berhasil.
- Indikator membedakan mode lokal, jaringan tersedia, dan jaringan terputus. Status jaringan bukan pemeriksaan kesehatan pusat. Jumlah outbox diperbarui ketika halaman dimuat ulang.
- Snapshot SQLite konsisten melalui Online Backup API dan health gate untuk backlog outbox.
- Halaman Operasional untuk melihat kesehatan outbox, kegagalan pending, menjalankan sinkronisasi manual, dan membuat backup lokal.
- Validasi backup, restore offline dengan backup pra-restore, dan retensi aman untuk outbox yang sudah tersinkron.
- Release gate yang menolak distribusi publik tanpa secure bundle, production config, identitas/versi aplikasi, dan code signing.

## Kenapa native, bukan web biasa?

NativePHP membundel runtime PHP dan antarmuka Electron agar aplikasi bisa berjalan di komputer petugas tanpa server PHP terpisah, serta menyediakan API printer sistem. Aplikasi web/PWA juga dapat mendukung sebagian operasi offline, tetapi akses printer langsung dan distribusi runtime lokal menjadi alasan memilih desktop di proyek ini.

Keputusan teknis:

- **Desktop terlebih dahulu**; portal warga, layar TV, dan aplikasi mobile pada dokumen ide belum diimplementasikan.
- **SQLite lokal**; tidak memerlukan MySQL, Redis, atau internet untuk operasi loket.
- **Blade dan JavaScript minimal**; tidak menggunakan React, Inertia, atau Livewire.
- **Outbox transaksional**; kegagalan pusat tidak membatalkan pekerjaan lokal.
- **Dependensi gratis**; NativePHP Desktop berlisensi MIT. Tidak memakai Bifrost, Mimi, atau plugin premium.
- Aplikasi ini untuk komputer lokal tepercaya. Route operator **belum dilindungi login**; jangan mengekspos server pengembangan ke LAN/internet.

## Menjalankan dari source

Prasyarat: PHP 8.3+, Composer 2, Node.js 22.12+ atau versi LTS lebih baru, serta ekstensi PHP SQLite (`pdo_sqlite`, `sqlite3`), `zip`, `mbstring`, `openssl`, `curl`, `fileinfo`, dan `dom`. Pengunduhan dependensi pertama memerlukan internet.

Dari root proyek:

```sh
composer install
php -r "file_exists('.env') || copy('.env.example', '.env');"
php artisan key:generate
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
php artisan migrate --force
npm ci --ignore-scripts
npm run build
```

Untuk **database pengembangan baru/kosong**, data demo bersifat opsional:

```sh
php artisan db:seed --no-interaction
```

Seeder mengisi empat layanan, empat loket, dan antrean contoh untuk tanggal hari ini. Jangan menjalankan seeder pada database operasional: seeder dapat memperbarui baris yang sudah ada. Tidak perlu menjalankan `migrate:fresh`.

### Browser pengembangan

```sh
php artisan serve --host=127.0.0.1 --port=8000
```

Buka alamat lokal yang dicetak perintah tersebut. Aset produksi sudah dibangun dan font tersimpan lokal. `npm run dev` hanya diperlukan saat mengubah frontend.

### Data desktop berbeda dari data browser

NativePHP dalam mode development menggunakan `database/nativephp.sqlite`, bukan `database/database.sqlite`. Jalankan migrasi native setelah dependensi desktop disiapkan:

```sh
php artisan native:migrate --force
```

Hanya untuk **database native baru/kosong**:

```sh
php artisan native:seed --no-interaction
```

Jangan menyamakan hasil query database browser dengan isi jendela desktop. Pada paket produksi, NativePHP menggunakan direktori data aplikasi milik pengguna. Cadangkan database beserta WAL dengan mekanisme backup SQLite saat aplikasi beroperasi, atau tutup aplikasi sebelum menyalin berkasnya.

Pada peluncuran pertama paket desktop, aplikasi membuat empat layanan dan empat loket bawaan jika tabel layanan dan loket sama-sama kosong. Inisialisasi ini tidak membuat tiket demo dan tidak mengubah kantor yang sudah dikonfigurasi.

### Build Windows x64

Build berikut hanya untuk pengembangan/internal dan dapat memuat source aplikasi terbuka:

```sh
composer native:prepare
php artisan native:build win x64 --no-interaction
```

Installer dihasilkan sebagai `nativephp/electron/dist/Antrian Loket-1.0.0-setup.exe`. Electron Builder memerlukan hak membuat symbolic link ketika menyiapkan `winCodeSign`; aktifkan Windows Developer Mode atau jalankan terminal dengan hak Administrator jika ekstraksi cache gagal.

Build saat ini masih menampilkan peringatan `INSECURE BUILD`. NativePHP Desktop 2.3 hanya mengambil secure app bundle dari artefak Bifrost `build/__nativephp_app_bundle`; Bifrost adalah layanan berbayar dan tidak termasuk kebijakan dependensi gratis proyek ini. Artefak source-terbuka sesuai untuk pembuktian lokal, bukan distribusi publik.

Jalur rilis publik bersifat fail-closed:

```sh
composer native:release:check
composer native:release
```

Perintah tersebut menolak build sebelum proses packaging jika secure bundle, mode production, identitas/versi aplikasi, atau code signing Windows belum lengkap. Pilih Azure Trusted Signing atau sertifikat yang dikenali Electron Builder melalui `CSC_LINK` dan `CSC_KEY_PASSWORD`; simpan kredensial hanya di environment lokal/secret store. Kebijakan gratis saat ini berarti jalur ini sengaja belum dapat menghasilkan installer secure sampai tim menyetujui layanan bundle dan menyediakan kredensial signing.

## Konfigurasi kantor dan printer

Isi `.env`:

```dotenv
ANTRIAN_OFFICE_NAME="Kantor Pelayanan Publik"
ANTRIAN_OFFICE_ADDRESS="Kota Kediri, Jawa Timur"
ANTRIAN_PRINTER=
ANTRIAN_DEVICE_ID=
ANTRIAN_DEVICE_NAME="Komputer Loket Utama"
ANTRIAN_SYNC_ENDPOINT=
ANTRIAN_SYNC_TOKEN=
```

- `ANTRIAN_PRINTER` kosong menggunakan printer default sistem. Jika diisi, namanya harus sama persis dengan nama printer terpasang. Printer bernama yang tidak ditemukan menghasilkan error, **bukan** mencetak ke printer lain.
- Struk dirancang untuk 58 mm; sesuaikan ukuran kertas pada driver printer. Pesan berhasil berarti permintaan dikirim ke API printer, bukan sensor memastikan kertas keluar.
- `ANTRIAN_DEVICE_ID` kosong dibuat otomatis dan disimpan di `sync_state`. Jangan menggandakan identitas perangkat ke instalasi lain.
- Nomor harian mengikuti tanggal/jam aplikasi. Pastikan jam komputer dan zona waktu kantor benar sebelum menerbitkan tiket.
- Endpoint kosong berarti lokal penuh. Outbox tetap tersimpan dan memerlukan pengelolaan kapasitas untuk pemakaian jangka panjang.

## Pengujian dan CI

```sh
composer test
vendor/bin/pint --test
npm ci --ignore-scripts
npm run build
```

Suite menggunakan SQLite terisolasi melalui `phpunit.xml`; bukan database operasional. Baseline saat dokumentasi ini diperbarui adalah **52 tes dan 195 assertions**. Workflow monorepo `../.github/workflows/antrian-loket.yml` menjalankan pemeriksaan format, migrasi pada database baru, tes, dan build frontend untuk perubahan proyek ini. Keberhasilan perintah lokal tidak sama dengan status GitHub Actions.

Konvensi tim tersedia di `.ai/rules/index.md`. Alur review, invariant yang wajib dijaga, konflik gaya yang ditunda, dan acceptance rilis berikutnya dijelaskan dalam [panduan kualitas dan roadmap](docs/quality-roadmap.md).

## Operasional backup dan outbox

Buat snapshot konsisten dari database SQLite yang sedang aktif:

```sh
php artisan antrian:backup
php artisan antrian:backup --path="D:\\Backup\\antrian.sqlite"
```

Command memakai SQLite Online Backup API, sehingga data WAL yang sudah commit ikut masuk snapshot. File tujuan yang sudah ada tidak ditimpa kecuali `--force`. Setiap hasil melewati `PRAGMA integrity_check` sebelum file sementara dipindahkan menjadi backup final.

Periksa backlog sinkronisasi:

```sh
php artisan antrian:outbox-health
```

Operator juga dapat membuka menu **Operasional** untuk melihat metrik tersebut, kegagalan terbaru, membuat backup, dan menjalankan push/pull manual ketika endpoint pusat sudah dikonfigurasi.

Validasi dan restore backup dari terminal ketika aplikasi desktop dan server development sudah ditutup:

```sh
php artisan antrian:backup-validate "D:\\Backup\\antrian.sqlite"
php artisan antrian:restore "D:\\Backup\\antrian.sqlite" --confirm=RESTORE
```

Restore menolak file rusak atau SQLite lain yang tidak memiliki skema minimum Antrian Loket. Sebelum mengganti database aktif, command selalu membuat backup pra-restore; bila restore atau validasi akhir gagal, database pra-restore dipulihkan kembali.

Retensi outbox tersinkron bersifat preview secara default:

```sh
php artisan antrian:outbox-prune --days=30
php artisan antrian:outbox-prune --days=30 --execute
```

Hanya entry dengan `synced_at` yang melewati retensi yang dapat dihapus. Pending outbox tidak pernah masuk prune. Exit code `antrian:outbox-health` gagal berarti jumlah pending, umur event tertua, atau percobaan maksimum telah mencapai ambang `ANTRIAN_OUTBOX_*_WARNING`; pulihkan endpoint dan periksa `last_error`, jangan hapus pending untuk menghilangkan alarm.

## Batas penggunaan multi-perangkat dan rilis

Setiap database dapat menerbitkan nomor sendiri saat offline. Dua database yang menerbitkan nomor sama untuk layanan/tanggal sama belum memiliki kebijakan alokasi nomor global. Jangan menganggap beberapa instalasi independen sudah menjadi satu antrean bersama. Resolusi revisi tiket yang sama berbeda dari benturan nomor dua UUID berbeda.

Dokumen dalam `docs/` adalah ide/rencana, bukan daftar fitur yang seluruhnya tersedia. Binary Windows x64 sudah berhasil dibangun dan alur ambil–panggil–selesai sudah diuji pada paket lokal. Secure app bundle, video demo, printer fisik, dan server pusat tetap harus diverifikasi sebelum proyek disebut siap rilis.
