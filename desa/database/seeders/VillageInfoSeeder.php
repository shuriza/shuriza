<?php

namespace Database\Seeders;

use App\Models\VillageInfo;
use Illuminate\Database\Seeder;

class VillageInfoSeeder extends Seeder
{
    public function run(): void
    {
        $info = [
            // Profil (data dari Wikipedia - Muneng, Purwoasri, Kediri)
            ['key' => 'nama_desa', 'value' => 'Desa Muneng', 'group' => 'profil', 'label' => 'Nama Desa', 'order' => 1],
            ['key' => 'kecamatan', 'value' => 'Purwoasri', 'group' => 'profil', 'label' => 'Kecamatan', 'order' => 2],
            ['key' => 'kabupaten', 'value' => 'Kediri', 'group' => 'profil', 'label' => 'Kabupaten', 'order' => 3],
            ['key' => 'provinsi', 'value' => 'Jawa Timur', 'group' => 'profil', 'label' => 'Provinsi', 'order' => 4],
            ['key' => 'negara', 'value' => 'Indonesia', 'group' => 'profil', 'label' => 'Negara', 'order' => 5],
            ['key' => 'kode_pos', 'value' => '64154', 'group' => 'profil', 'label' => 'Kode Pos', 'order' => 6],
            ['key' => 'kode_kemendagri', 'value' => '35.06.15.2016', 'group' => 'profil', 'label' => 'Kode Kemendagri', 'order' => 7],
            ['key' => 'luas_wilayah', 'value' => '267 ha (2,67 km²)', 'group' => 'profil', 'label' => 'Luas Wilayah', 'order' => 8],
            ['key' => 'koordinat', 'value' => '7°37\'32"S 112°6\'14"E', 'group' => 'profil', 'label' => 'Koordinat', 'order' => 9],
            ['key' => 'latitude', 'value' => '-7.6256617', 'group' => 'profil', 'label' => 'Latitude', 'order' => 10],
            ['key' => 'longitude', 'value' => '112.1039615', 'group' => 'profil', 'label' => 'Longitude', 'order' => 11],

            // Demografi (data dari Wikipedia)
            ['key' => 'jumlah_penduduk', 'value' => '1.808', 'group' => 'demografi', 'label' => 'Jumlah Penduduk', 'order' => 1],
            ['key' => 'kepadatan', 'value' => '677,15 jiwa/km²', 'group' => 'demografi', 'label' => 'Kepadatan Penduduk', 'order' => 2],

            // Geografi & Lokasi (data dari Wikipedia)
            ['key' => 'jarak_kota_kediri', 'value' => '24 km sebelah utara Kota Kediri', 'group' => 'geografi', 'label' => 'Jarak ke Kota Kediri', 'order' => 1],
            ['key' => 'jarak_kertosono', 'value' => '3 km dari Persilangan Kertosono', 'group' => 'geografi', 'label' => 'Jarak ke Kertosono', 'order' => 2],
            ['key' => 'jarak_surabaya', 'value' => '100 km dari Surabaya', 'group' => 'geografi', 'label' => 'Jarak ke Surabaya', 'order' => 3],
            ['key' => 'akses_jalur', 'value' => 'Menghubungkan jalur Tulungagung-Surabaya, serta jalur alternatif Kunjang yang menghubungkan Kediri-Jombang', 'group' => 'geografi', 'label' => 'Akses Jalur', 'order' => 4],
            ['key' => 'desa_tetangga', 'value' => 'Belor, Blawe, Bulu, Dawuhan, Dayu, Jantok, Karangpakis, Kempleng, Ketawang, Klampitan, Merjoyo, Mranggen, Mekikis, Pandansari, Pesing, Purwoasri, Purwodadi, Sidomulyo, Sumberjo, Tugu, Wonotengah, Woromarto', 'group' => 'geografi', 'label' => 'Desa Lain di Kec. Purwoasri', 'order' => 5],

            // Pemerintahan - PLACEHOLDER (belum ada data resmi)
            // Nama-nama ini perlu diupdate dengan data asli via admin panel
            ['key' => 'kepala_desa', 'value' => '', 'group' => 'pemerintahan', 'label' => 'Kepala Desa', 'order' => 1],
            ['key' => 'sekretaris_desa', 'value' => '', 'group' => 'pemerintahan', 'label' => 'Sekretaris Desa', 'order' => 2],

            // Deskripsi (dari Wikipedia)
            ['key' => 'deskripsi', 'value' => 'Muneng adalah desa yang berada di Kecamatan Purwoasri, Kabupaten Kediri, Jawa Timur, Indonesia. Desa ini terletak 24 km sebelah utara Kota Kediri, atau 3 km dari Persilangan Kertosono, atau 100 km dari Surabaya. Desa ini cukup strategis karena menghubungkan jalur Tulungagung-Surabaya, serta jalur alternatif Kunjang yang menghubungkan Kediri-Jombang.', 'group' => 'sejarah', 'label' => 'Deskripsi Desa', 'order' => 1],
            ['key' => 'sejarah', 'value' => 'Desa Muneng merupakan salah satu desa di Kecamatan Purwoasri, Kabupaten Kediri, Provinsi Jawa Timur. Posisi strategis di persimpangan jalur Tulungagung-Surabaya dan jalur alternatif Kunjang (Kediri-Jombang) menjadikan desa ini mudah diakses dari berbagai arah. Masyarakat Desa Muneng dikenal dengan semangat gotong royong dan tradisi Jawa yang masih dilestarikan.', 'group' => 'sejarah', 'label' => 'Sejarah Desa', 'order' => 2],

            // Visi Misi (placeholder - bisa diupdate admin)
            ['key' => 'visi', 'value' => 'Mewujudkan Desa Muneng yang maju, mandiri, dan sejahtera berbasis kearifan lokal.', 'group' => 'visi_misi', 'label' => 'Visi', 'order' => 1],
            ['key' => 'misi', 'value' => "1. Meningkatkan kualitas pelayanan publik\n2. Mengembangkan potensi ekonomi desa berbasis pertanian dan UMKM\n3. Melestarikan budaya dan tradisi lokal\n4. Meningkatkan kualitas infrastruktur desa\n5. Membangun sumber daya manusia yang berkualitas", 'group' => 'visi_misi', 'label' => 'Misi', 'order' => 2],

            // Kontak - dibaca oleh halaman /kontak dan footer.
            // Telepon/email sengaja kosong: belum ada kanal resmi yang bisa dipublikasikan.
            ['key' => 'alamat', 'value' => 'Desa Muneng, Kec. Purwoasri, Kab. Kediri, Jawa Timur 64154', 'group' => 'kontak', 'label' => 'Alamat', 'order' => 1],
            ['key' => 'telepon', 'value' => '', 'group' => 'kontak', 'label' => 'Telepon', 'order' => 2],
            ['key' => 'email', 'value' => '', 'group' => 'kontak', 'label' => 'Email', 'order' => 3],
            ['key' => 'jam_kerja', 'value' => "Senin - Jumat: 08.00 - 15.00 WIB\nSabtu - Minggu: Tutup", 'group' => 'kontak', 'label' => 'Jam Kerja', 'order' => 4],
        ];

        foreach ($info as $item) {
            VillageInfo::create($item);
        }
    }
}
