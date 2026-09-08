# Project Idea: NativePHP

Status: rencana. Pelengkap `docs/project-idea-antrian.md`.

## Kondisi NativePHP per 2026-09

Diverifikasi dari Packagist dan blog resmi:

- `nativephp/mobile` v4.3.2, lisensi MIT, butuh PHP ^8.4, Laravel 10-13.
- `nativephp/desktop` v2, lisensi MIT, butuh PHP ^8.3.
- Core mobile jadi gratis dan open source sejak v3 (pengumuman 1 Februari 2026).
  Bukan trial, bukan freemium. Versi sebelum v3 masih Business Source License.
- v4 punya EDGE components: Blade component yang render jadi native view,
  bukan sekadar webview wrapper.

### Plugin gratis (MIT)

Browser, Camera, Device, Dialog, File, Microphone, Network, Share, System.

### Plugin premium (bayar sekali, seat license, unlimited project)

Biometrics, Geolocation, Push Notifications (Firebase), Scanner,
Secure Storage.

Konsekuensi: kalau butuh GPS atau scan barcode, itu berbayar. Perhitungkan
sebelum memilih fitur. Untuk testing, app Jump gratis dan sudah termasuk
semua plugin first-party termasuk yang premium.

## Kenapa NativePHP masuk akal untuk portofolio ini

Positioning saat ini Laravel dan Next.js. NativePHP menambah kemampuan
distribusi aplikasi native tanpa mengganti stack dan tanpa belajar Swift atau
Kotlin. Nilainya untuk recruiter: satu keahlian Laravel, tiga target
distribusi (web, desktop, mobile).

Yang benar-benar dibuktikan oleh NativePHP, bukan sekadar dipakai:

- Offline-first. Aplikasi hidup di device, jalan tanpa sinyal.
- Sinkronisasi dan resolusi konflik saat kembali online.
- Akses API device dari PHP: kamera, file, network state.
- Distribusi binary, bukan deploy ke server.

Ini persis empat hal yang tidak bisa ditunjukkan oleh keempat proyek CRUD
yang sudah ada.

## Ide utama: gabungkan dengan sistem antrian

Cara paling efisien. Backend Laravel yang sama dipakai ulang, tiga klien
berbeda:

| Klien | Teknologi | Peran |
|-------|-----------|-------|
| Portal warga dan TV display | Next.js 16 | Ambil tiket, layar antrian |
| Aplikasi loket petugas | NativePHP Desktop | Panggil, lewati, selesai |
| Aplikasi supervisor | NativePHP Mobile | Pantau antrian, notifikasi |

Alasan teknisnya nyata, bukan dipaksakan: loket pelayanan publik butuh
aplikasi yang tetap jalan saat internet kantor putus, dan butuh cetak tiket
ke printer lokal. Browser tidak bisa keduanya dengan baik.

Yang membuatnya kuat saat interview: satu domain, tiga model distribusi,
dan satu masalah sinkronisasi yang nyata. Bukan tiga proyek terpisah.

## Alternatif berdiri sendiri: aplikasi pendataan lapangan offline-first

Untuk petugas survei dinas, penyuluh pertanian, atau pendataan aset desa
di area sinyal buruk.

- Form pendataan lengkap dengan foto (plugin Camera, gratis).
- Data tersimpan di SQLite on-device, tetap jalan tanpa sinyal.
- Antrian sinkronisasi saat online kembali, dengan penanganan konflik.
- Dashboard web Laravel untuk supervisor melihat hasil.

Kalau butuh koordinat GPS, plugin Geolocation berbayar. Alternatif gratis:
input alamat manual, atau tunda fitur GPS.

Kekuatan cerita teknisnya: konflik sinkronisasi. Dua petugas mengedit
data yang sama saat offline, lalu keduanya online. Siapa yang menang, dan
kenapa. Ini pertanyaan level menengah yang jarang bisa dijawab pelamar junior.

## Acceptance

- Sinkronisasi diuji dengan skenario offline lalu online, termasuk konflik.
- Build menghasilkan binary yang benar-benar jalan, dibuktikan lewat video.
- README menjelaskan kenapa native, bukan web. Kalau alasannya tidak kuat,
  proyeknya salah pilih.
- Test untuk logika sinkronisasi dan resolusi konflik.

## Risiko

- PHP ^8.4 untuk mobile. Pastikan environment lokal memenuhi.
- Build iOS butuh Mac. Android cukup dari Windows. Untuk portofolio,
  Android dan desktop sudah cukup.
- Jangan pakai NativePHP hanya karena baru. Kalau fiturnya tidak butuh
  offline, device API, atau distribusi binary, web biasa lebih tepat dan
  recruiter akan menanyakan itu.

## Referensi

- https://nativephp.com/docs/mobile/4/getting-started/introduction
- https://nativephp.com/blog/nativephp-for-mobile-is-now-free
- https://github.com/NativePHP/mobile-air
- https://github.com/NativePHP/desktop
