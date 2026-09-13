<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Category;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            [
                'title' => 'Kerja Bakti Lingkungan',
                'slug' => 'kerja-bakti-lingkungan',
                'description' => 'Gotong royong membersihkan lingkungan desa setiap minggu.',
                'content' => 'Kegiatan kerja bakti rutin setiap hari Minggu pagi untuk membersihkan lingkungan desa. Warga bergotong royong membersihkan jalan, selokan, dan fasilitas umum demi terciptanya lingkungan yang bersih dan sehat.',
                'event_date' => '2026-05-11',
                'time' => '07:00 WIB',
                'location' => 'Seluruh Wilayah Desa Muneng',
                'status' => 'published',
                'category_id' => 4, // Gotong Royong
            ],
            [
                'title' => 'Pasar UMKM Desa',
                'slug' => 'pasar-umkm-desa',
                'description' => 'Warga memasarkan produk rumahan di pasar UMKM awal bulan.',
                'content' => 'Pasar UMKM Desa Muneng diadakan setiap awal bulan sebagai wadah bagi warga untuk memasarkan produk rumahan. Tersedia berbagai produk mulai dari makanan, kerajinan tangan, hingga produk pertanian lokal.',
                'event_date' => '2026-06-01',
                'time' => '08:00 WIB',
                'location' => 'Balai Desa Muneng',
                'status' => 'published',
                'category_id' => 2, // Budaya
            ],
            [
                'title' => 'Pekan HUT Kemerdekaan',
                'slug' => 'pekan-hut-kemerdekaan',
                'description' => 'Perlombaan, jalan sehat, dan panggung rakyat menyambut HUT RI.',
                'content' => 'Rangkaian acara peringatan HUT Kemerdekaan RI di Desa Muneng meliputi berbagai perlombaan tradisional, jalan sehat bersama warga, dan panggung rakyat dengan penampilan seni budaya lokal. Acara ini diikuti oleh seluruh warga dari berbagai kalangan usia.',
                'event_date' => '2026-08-10',
                'end_date' => '2026-08-17',
                'time' => '07:00 WIB',
                'location' => 'Lapangan Desa Muneng',
                'status' => 'published',
                'category_id' => 5, // Peringatan
            ],
            [
                'title' => 'Doa & Syukuran Akhir Tahun',
                'slug' => 'doa-syukuran-akhir-tahun',
                'description' => 'Refleksi dan doa bersama menyambut tahun baru.',
                'content' => 'Acara doa dan syukuran akhir tahun sebagai bentuk refleksi atas pencapaian selama setahun dan memohon keberkahan untuk tahun yang akan datang. Warga berkumpul bersama untuk berdoa dan berbagi cerita.',
                'event_date' => '2026-12-28',
                'time' => '19:00 WIB',
                'location' => 'Masjid Desa Muneng',
                'status' => 'published',
                'category_id' => 1, // Keagamaan
            ],
        ];

        foreach ($events as $event) {
            Event::create(array_merge($event, ['user_id' => 1]));
        }
    }
}
