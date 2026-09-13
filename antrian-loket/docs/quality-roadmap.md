# Panduan kualitas dan rencana lanjutan

## Batas pekerjaan

Dokumen ini memisahkan quality gate yang dapat dijalankan sekarang dari kesiapan rilis yang memerlukan server pusat, perangkat printer, dan konfigurasi distribusi. Dokumen ide produk bukan kontrak fitur yang sudah tersedia.

Konvensi kode tim berada di `.ai/rules/index.md`. Baca semua aturan dengan glob yang cocok sebelum mengubah kode. Konvensi mendokumentasikan pilihan yang ada, bukan bukti bahwa seluruh implementasi bebas bug.

## Alur kerja developer dan reviewer

1. Jelaskan perilaku yang berubah, invariant yang harus tetap benar, dan risiko pengguna. Sertakan langkah reproduksi untuk bug; jangan mulai dari pilihan pola desain.
2. Telusuri controller, service, persistence, serta caller yang terdampak. Pertahankan controller sebagai pengikat input/respons dan service sebagai pemilik workflow; jangan menambah repository, action, atau event layer hanya untuk membungkus satu panggilan.
3. Untuk bug, tulis regression case yang gagal karena perilakunya salah, lalu buktikan lulus setelah perbaikan. Pakai collaborator aplikasi nyata dan fake hanya batas eksternal. Hindari assertion terhadap source code atau susunan pemanggilan internal.
4. Jalankan tes terkait saat implementasi, kemudian seluruh suite dan build sebelum commit. Review diff hanya untuk scope yang dimaksud; jangan menyertakan `.env`, database operasional, hasil build, atau perubahan proyek tetangga.
5. Dalam PR, tulis: masalah, keputusan dan alasannya, bukti verifikasi, serta batas yang belum diuji. Reviewer memisahkan cacat correctness yang menghalangi merge dari saran gaya yang tidak mengubah perilaku.

Perintah dari direktori `antrian-loket`:

```sh
php artisan test --compact tests/Feature/SyncServiceTest.php
php vendor/bin/pint --dirty --format agent
composer test
npm run build
```

Pilih file test yang sesuai perubahan; contoh di atas untuk sinkronisasi. Test memakai database terisolasi. Jangan mengganti reset khusus concurrency dengan database in-memory: worker proses terpisah harus melihat database yang sama.

## Invariant yang wajib dipahami tim

- **Identitas:** integer `id` adalah primary key lokal; UUID adalah identitas lintas perangkat. Lookup UUID tidak memakai `whereKey()` pada model ber-PK integer.
- **Atomicity lokal:** perubahan tiket, audit event, dan outbox harus berhasil atau rollback bersama. Akses jaringan tidak berada di transaksi mutasi lokal.
- **Kepemilikan:** satu loket tidak boleh menyelesaikan atau melewati tiket loket lain; perubahan state harus memeriksa state dan kepemilikan saat write, bukan hanya sebelum write.
- **Pemulihan antrean:** panggil ulang tidak mengubah status dan tetap menaikkan `revision`; pengembalian tiket dilewati mempertahankan nomor asli, melepas `counter_id`, dan hanya berlaku untuk tanggal layanan hari ini oleh loket pemiliknya.
- **Pasangan event/status:** `TicketEventType::resultingStatus()` adalah satu-satunya sumber kebenaran. ConflictResolver dan SyncService memakai `matchesStatus()`; jangan menulis ulang match itu per pemanggil, karena case enum baru harus gagal kompilasi bukan lolos diam-diam.
- **Replay:** event remote yang sudah diterima tidak menghasilkan audit ganda atau outbox echo. Kegagalan batch tidak boleh memajukan cursor.
- **Angka protokol:** angka remote harus dapat direpresentasikan tanpa kehilangan nilai; cast digit string ke integer bukan validasi batas.
- **Konvergensi:** revision dan identitas perangkat adalah bagian protokol. Jangan mengganti tie-break dengan jam komputer atau mengasumsikan ID perangkat numerik selalu muat dalam integer PHP.
- **Transaksi sync:** pertahankan helper write transaction SQLite untuk `BEGIN IMMEDIATE`; transaksi queue/setup memakai Laravel transaction closure.
- **Printer:** sukses API berarti permintaan terkirim, bukan bukti kertas keluar. Printer bernama yang hilang tidak boleh dialihkan diam-diam ke printer lain.
- **Backup:** database aktif tidak disalin sebagai file mentah. Gunakan `antrian:backup`, yang membuat snapshot konsisten melalui SQLite Online Backup API dan memvalidasi integritas serta skema minimum sebelum publish.
- **Restore:** jalankan offline dengan `--confirm=RESTORE`. Sumber divalidasi lebih dulu, database aktif dibackup, hasil restore divalidasi lagi, dan kegagalan memulihkan backup pra-restore.
- **Outbox:** backlog pending tidak dihapus untuk mengurangi ukuran. `antrian:outbox-health` memantau jumlah pending, umur tertua, dan jumlah percobaan; `antrian:outbox-prune` hanya menghapus entry tersinkron setelah retensi dan default-nya preview.
- **Konfigurasi kantor:** jangan menghapus layanan/loket yang memiliki histori. Kode layanan adalah identitas sinkronisasi setelah tiket terbit; layanan/loket dengan pekerjaan aktif tidak boleh dinonaktifkan atau dipindahkan.
- **Laporan:** metrik harian adalah data lokal per perangkat. Jangan menyebutnya laporan kantor gabungan sebelum server pusat dan kontrak agregasi tersedia. Hitungan panggil ulang/pengembalian berasal dari audit event, bukan status akhir tiket, jadi satu tiket dapat menyumbang lebih dari sekali.
- **Agregasi SQL:** `pluck()` dengan ekspresi `DB::raw` tidak memberi alias kolom dan menghasilkan baris tanpa properti yang diminta. Gunakan `selectRaw(... as alias)` lalu `pluck('alias_nilai', 'alias_kunci')`.

## Quality gate otomatis

Workflow monorepo berada di `../.github/workflows/antrian-loket.yml`, bukan di subfolder `.github` milik aplikasi. Workflow menjalankan Pint, migrasi database CI baru, PHPUnit, dan build aset; pemicu dibatasi perubahan aplikasi atau workflow ini. Semua perintah aplikasi memakai working directory `antrian-loket`, termasuk path cache dependency yang terikat lockfile proyek.

Lulus lokal tidak membuktikan GitHub Actions lulus. Bukti CI harus diambil dari run untuk commit yang sama. Branch protection/required checks adalah konfigurasi repository terpisah, bukan otomatis aktif karena YAML tersedia.

## Hasil quality review 12 September 2026

- Parser revision/number sinkronisasi menolak digit string di atas `PHP_INT_MAX` tanpa clamp. Dua regression case gagal pada implementasi sebelumnya dan lulus setelah perbaikan; batas maksimum valid tetap diterima.
- Ringkasan loket memakai satu agregasi antrian per layanan. Smoke pada database terisolasi menunjukkan 4 query baik untuk 2 maupun 10 loket, dibanding 7 dan 23 query pada implementasi sebelumnya. Tiket kemarin dan tiket selesai tidak masuk jumlah menunggu; estimasi dan halaman detail memakai hasil yang benar.
- Ditambahkan coverage korespondensi audit/outbox untuk issue–call–finish dan issue–call–skip, serta pelaporan kegagalan API printer tanpa pesan sukses.
- `composer test` kompatibel dengan Composer terpasang setelah token khusus Composer yang tidak dikenali dihapus. Gunakan Artisan langsung untuk meneruskan filter/opsi tes.
- Verifikasi lokal: 26 tes lulus dengan 121 assertions; Pint untuk perubahan PHP, build Vite, dan validasi sintaks workflow dengan actionlint berhasil. Build masih memberi peringatan dependency opsional `fontaine`; tidak ada dependency baru yang ditambahkan.

## Hasil pekerjaan pemulihan antrean 13 September 2026

- Ditambahkan `recall()` dan `restore()` pada `QueueService` beserta rute, konsol loket, dan hitungan laporan. Empat retry loop yang identik digabung menjadi `withRetry()`, dan cabang kegagalan write tiket `dipanggil` menjadi `failCalledTicketWrite()`.
- `eventTypeMatchesStatus()` sebelumnya diduplikasi di `ConflictResolver` dan `SyncService`. Keduanya adalah match non-exhaustive, sehingga case enum baru akan melempar `UnhandledMatchError` pada dua tempat. Aturannya dipindahkan ke `TicketEventType::resultingStatus()`/`matchesStatus()`.
- Pull sinkronisasi kini memajukan `called_at` untuk event `recalled`; sebelumnya `?? ` mempertahankan waktu panggil pertama sehingga panggilan ulang dari perangkat lain tidak terlihat.
- Bug ditemukan lewat smoke test, bukan suite: `/laporan/harian` mengembalikan 500 (`Undefined property: stdClass::$type`) karena `pluck()` memakai ekspresi `DB::raw` tanpa alias. Diganti `selectRaw(... as alias)`; regression case memproduksi 500 yang sama sebelum perbaikan.
- Mutation check: menghapus guard `service_date`, menghapus kenaikan `revision` pada panggil ulang, memetakan `Restored` ke status salah, dan mengembalikan `pluck` lama masing-masing menggagalkan tes yang dimaksud. Tanpa tes protokol sinkronisasi yang baru, kesalahan pemetaan enum lolos tanpa terdeteksi.
- Verifikasi lokal: 75 tes lulus dengan 297 assertions; Pint bersih; `npm run build` berhasil. Smoke test terhadap `php artisan serve` menjalankan panggil ulang dan pengembalian melalui POST sebenarnya, memastikan nomor tiket dipertahankan, `counter_id` dilepas, dan setiap audit event punya pasangan outbox.
- Belum diverifikasi: perilaku dua perangkat nyata terhadap event `recalled`/`restored` menunggu server pusat, dan pengumuman suara/tampilan TV tidak termasuk scope aplikasi desktop ini.

## Keputusan gaya yang tetap ditunda

|Area|Status|Syarat sebelum menjadi aturan baru|
|---|---|---|
|Reset database tests|RefreshDatabase dan LazilyRefreshDatabase tetap ada; file SQLite concurrency dipertahankan|Tentukan kebutuhan lifecycle/isolasi per kategori test, bukan mengganti trait massal|
|Fixture tests|Factory dan manual setup tetap ada|Bandingkan pembuatan record setara dan kebutuhan worker/singleton|
|Iterasi|foreach dan collection pipelines tetap ada|Pisahkan transformasi data dari side effect/control flow|
|String|Native PHP dan Str tetap ada|Bandingkan operasi setara, bukan jumlah semua fungsi|
|Tanggal|Helper waktu sekarang dan parsing Carbon tetap ada|Pisahkan sumber waktu, parsing, dan kebijakan mutability|

Tidak adanya authorization, Form Requests, API resources, atau pagination bukan alasan menambahkan fitur tersebut pada aplikasi lokal ini tanpa kebutuhan produk.

## Rencana berikutnya: penerimaan rilis

Urutan berikut adalah rencana, bukan fitur yang sudah selesai atau otomatis diimplementasikan oleh quality review ini.

|Prioritas|Pekerjaan|Acceptance dan prasyarat|
|---|---|---|
|P0|Kontrak server pusat dan alokasi nomor multi-perangkat|Sepakati identitas layanan/loket, ACK/cursor, otorisasi perangkat, serta kebijakan nomor unik lintas instalasi; jalankan integrasi dua database offline lalu online dengan server nyata. Server belum disertakan proyek ini.|
|P0|Secure desktop bundle dan distribusi|Gate `composer native:release` sudah fail-closed. NativePHP Desktop 2.3 memerlukan bundle Bifrost berbayar, bertentangan dengan kebijakan dependensi gratis saat ini; tim harus menyetujui layanan tersebut dan menyediakan Azure Trusted Signing atau sertifikat Windows sebelum installer secure dapat dibangun. Setelah tersedia, uji install/upgrade dengan database pengguna tetap utuh dan pastikan tidak ada peringatan insecure build.|
|P1|Uji printer fisik 58 mm|Uji printer default, nama printer eksplisit, offline/hilang, lebar struk, dan hasil kertas; memerlukan perangkat/driver sasaran.|
|P1|Backup/restore dan kapasitas outbox|Selesai untuk aplikasi lokal: snapshot WAL-safe, validasi backup, restore dengan backup pra-restore, health gate, retention preview/execute, dan halaman Operasional tersedia. Acceptance produksi tetap membutuhkan drill restore pada salinan database paket dengan aplikasi ditutup.|
|P1|Konfigurasi kantor lokal|Selesai: layanan dan loket dapat ditambah/diperbarui dengan guard terhadap perubahan identitas sinkronisasi dan pekerjaan aktif. Penghapusan historis sengaja tidak disediakan.|
|P1|Laporan operasional harian|Selesai untuk database lokal: status per layanan dan durasi rata-rata tersedia dengan filter tanggal. Agregasi lintas perangkat menunggu server pusat.|
|P1|Bukti penerimaan operator|Rekam demo installer lokal: ambil, panggil, lewati, selesai, cetak, restart, serta operasi tanpa jaringan; operator memverifikasi pesan kegagalan dan pemulihan.|
|P2|Penyelesaian perbedaan gaya test|Gunakan hasil review kategori test di atas; perubahan hanya setelah ada manfaat isolasi, determinisme, atau pemeliharaan yang terukur.|

Portal warga, layar TV, dan aplikasi mobile tetap di luar scope aplikasi desktop saat ini. Jangan mengklaim satu antrean multi-perangkat hanya karena resolusi revisi tiket yang sama sudah tersedia.
