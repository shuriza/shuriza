<?php

namespace Database\Seeders;

use App\Models\Destination;
use Illuminate\Database\Seeder;

class DestinationSeeder extends Seeder
{
    public function run(): void
    {
        $destinations = [
            [
                'name' => 'Balai Desa Muneng',
                'slug' => 'balai-desa-muneng',
                'description' => 'Pusat pemerintahan dan pelayanan masyarakat Desa Muneng.',
                'content' => 'Balai Desa Muneng merupakan pusat kegiatan pemerintahan desa dan pelayanan administrasi bagi warga. Di sini tersedia berbagai layanan seperti pembuatan surat keterangan, pengurusan administrasi kependudukan, dan tempat musyawarah desa.',
                'category' => 'fasilitas',
                'address' => 'Jl. Raya Muneng, Desa Muneng, Kec. Purwoasri, Kab. Kediri',
                'status' => 'published',
            ],
            [
                'name' => 'Masjid Desa Muneng',
                'slug' => 'masjid-desa-muneng',
                'description' => 'Masjid utama desa yang menjadi pusat kegiatan keagamaan warga.',
                'content' => 'Masjid Desa Muneng merupakan masjid utama yang menjadi pusat kegiatan keagamaan warga. Selain untuk sholat berjamaah, masjid ini juga digunakan untuk pengajian rutin, peringatan hari besar Islam, dan kegiatan TPA untuk anak-anak.',
                'category' => 'fasilitas',
                'address' => 'Desa Muneng, Kec. Purwoasri, Kab. Kediri',
                'status' => 'published',
            ],
            [
                'name' => 'Lapangan Desa Muneng',
                'slug' => 'lapangan-desa-muneng',
                'description' => 'Lapangan serbaguna untuk kegiatan olahraga dan acara desa.',
                'content' => 'Lapangan Desa Muneng digunakan untuk berbagai kegiatan seperti olahraga (sepak bola, voli), upacara bendera, dan acara-acara besar desa. Lapangan ini menjadi tempat berkumpul warga terutama di sore hari.',
                'category' => 'fasilitas',
                'address' => 'Desa Muneng, Kec. Purwoasri, Kab. Kediri',
                'status' => 'published',
            ],
            [
                'name' => 'Persawahan Desa Muneng',
                'slug' => 'persawahan-desa-muneng',
                'description' => 'Hamparan sawah hijau yang menjadi pemandangan khas Desa Muneng.',
                'content' => 'Area persawahan Desa Muneng membentang luas dan menjadi sumber mata pencaharian utama warga. Pemandangan sawah yang hijau di musim tanam dan keemasan saat musim panen menjadi daya tarik tersendiri bagi pengunjung.',
                'category' => 'suasana',
                'address' => 'Area Persawahan, Desa Muneng',
                'status' => 'published',
            ],
            [
                'name' => 'Jalan Desa yang Asri',
                'slug' => 'jalan-desa-yang-asri',
                'description' => 'Suasana jalan desa yang teduh dengan pepohonan rindang.',
                'content' => 'Jalan-jalan di Desa Muneng dikelilingi pepohonan rindang yang memberikan suasana sejuk dan asri. Cocok untuk jalan-jalan santai di pagi atau sore hari sambil menikmati udara segar pedesaan.',
                'category' => 'suasana',
                'address' => 'Desa Muneng, Kec. Purwoasri, Kab. Kediri',
                'status' => 'published',
            ],
            [
                'name' => 'SDN Muneng',
                'slug' => 'sdn-muneng',
                'description' => 'Sekolah Dasar Negeri yang menjadi tempat pendidikan anak-anak desa.',
                'content' => 'SDN Muneng merupakan sekolah dasar negeri yang melayani pendidikan dasar bagi anak-anak Desa Muneng dan sekitarnya. Sekolah ini memiliki fasilitas yang memadai dan tenaga pengajar yang berdedikasi.',
                'category' => 'fasilitas',
                'address' => 'Desa Muneng, Kec. Purwoasri, Kab. Kediri',
                'status' => 'published',
            ],
        ];

        foreach ($destinations as $destination) {
            Destination::create(array_merge($destination, ['user_id' => 1]));
        }
    }
}
