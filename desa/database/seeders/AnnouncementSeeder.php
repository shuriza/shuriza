<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first() ?? User::first();

        $announcements = [
            [
                'title' => 'Jadwal Posyandu Bulan Mei 2026',
                'slug' => 'jadwal-posyandu-bulan-mei-2026',
                'content' => '<p>Diberitahukan kepada seluruh warga Desa Muneng bahwa kegiatan Posyandu untuk bulan Mei 2026 akan dilaksanakan pada:</p><ul><li><strong>Hari/Tanggal:</strong> Rabu, 14 Mei 2026</li><li><strong>Waktu:</strong> 08.00 - 12.00 WIB</li><li><strong>Tempat:</strong> Balai Desa Muneng</li></ul><p>Kegiatan meliputi penimbangan balita, imunisasi, dan pemeriksaan ibu hamil. Mohon membawa KMS (Kartu Menuju Sehat) dan buku KIA.</p><p>Atas perhatian dan kehadiran Bapak/Ibu warga, kami ucapkan terima kasih.</p>',
                'excerpt' => 'Posyandu bulan Mei 2026 akan dilaksanakan pada Rabu, 14 Mei 2026 di Balai Desa Muneng pukul 08.00-12.00 WIB.',
                'is_pinned' => true,
                'status' => 'published',
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Pengumuman Penyaluran Bantuan Langsung Tunai (BLT)',
                'slug' => 'pengumuman-penyaluran-bantuan-langsung-tunai-blt',
                'content' => '<p>Dengan ini kami informasikan bahwa penyaluran Bantuan Langsung Tunai (BLT) Dana Desa tahap II tahun 2026 akan dilaksanakan pada:</p><ul><li><strong>Hari/Tanggal:</strong> Senin, 19 Mei 2026</li><li><strong>Waktu:</strong> 09.00 - 15.00 WIB</li><li><strong>Tempat:</strong> Kantor Desa Muneng</li></ul><p>Bagi warga yang terdaftar sebagai penerima BLT, harap membawa:</p><ol><li>KTP asli</li><li>Kartu Keluarga (KK)</li><li>Buku tabungan (jika ada)</li></ol><p>Daftar penerima BLT dapat dilihat di papan pengumuman Kantor Desa atau menghubungi RT/RW setempat.</p>',
                'excerpt' => 'Penyaluran BLT Dana Desa tahap II tahun 2026 akan dilaksanakan pada Senin, 19 Mei 2026 di Kantor Desa Muneng.',
                'is_pinned' => true,
                'status' => 'published',
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Info Pembangunan Jalan Dusun Krajan',
                'slug' => 'info-pembangunan-jalan-dusun-krajan',
                'content' => '<p>Kami informasikan kepada seluruh warga Desa Muneng bahwa proyek pembangunan jalan di Dusun Krajan telah memasuki tahap pelaksanaan. Berikut detail proyek:</p><ul><li><strong>Panjang jalan:</strong> 500 meter</li><li><strong>Lebar:</strong> 3 meter</li><li><strong>Jenis:</strong> Rabat beton</li><li><strong>Sumber dana:</strong> Dana Desa 2026</li><li><strong>Estimasi selesai:</strong> Juni 2026</li></ul><p>Selama masa pembangunan, mohon warga yang melintas berhati-hati dan mengikuti arahan petugas. Kami mohon maaf atas ketidaknyamanan selama proses pembangunan berlangsung.</p><p>Terima kasih atas pengertian dan kerjasamanya.</p>',
                'excerpt' => 'Proyek pembangunan jalan rabat beton sepanjang 500 meter di Dusun Krajan telah dimulai, estimasi selesai Juni 2026.',
                'is_pinned' => false,
                'status' => 'published',
                'published_at' => now()->subDays(10),
            ],
            [
                'title' => 'Undangan Musyawarah Desa (Musdes) Tahun 2026',
                'slug' => 'undangan-musyawarah-desa-musdes-tahun-2026',
                'content' => '<p>Kepada seluruh warga Desa Muneng yang terhormat,</p><p>Dengan ini kami mengundang Bapak/Ibu/Saudara untuk menghadiri Musyawarah Desa (Musdes) yang akan dilaksanakan pada:</p><ul><li><strong>Hari/Tanggal:</strong> Sabtu, 24 Mei 2026</li><li><strong>Waktu:</strong> 13.00 - selesai</li><li><strong>Tempat:</strong> Balai Desa Muneng</li></ul><p><strong>Agenda:</strong></p><ol><li>Laporan realisasi APBDes semester I tahun 2026</li><li>Pembahasan rencana kegiatan semester II</li><li>Usulan pembangunan infrastruktur</li><li>Tanya jawab dan aspirasi warga</li></ol><p>Kehadiran Bapak/Ibu/Saudara sangat kami harapkan demi kemajuan Desa Muneng bersama.</p>',
                'excerpt' => 'Musyawarah Desa (Musdes) akan dilaksanakan pada Sabtu, 24 Mei 2026 di Balai Desa Muneng pukul 13.00 WIB.',
                'is_pinned' => false,
                'status' => 'published',
                'published_at' => now()->subDay(),
            ],
        ];

        foreach ($announcements as $data) {
            $data['user_id'] = $admin->id;
            Announcement::create($data);
        }
    }
}
