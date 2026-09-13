<?php

namespace Database\Seeders;

use App\Models\Submission;
use Illuminate\Database\Seeder;

class SubmissionSeeder extends Seeder
{
    public function run(): void
    {
        $submissions = [
            [
                'name' => 'Redaksi Desa Muneng',
                'category' => 'pengumuman',
                'title' => 'Website Desa Muneng Diluncurkan',
                'content' => 'Halo warga dan perantau Muneng! Website ini adalah rumah digital kita bersama. Kirimkan cerita, agenda, info UMKM, atau kenangan tentang Desa Muneng.',
                'status' => 'approved',
                'approved_by' => 1,
                'approved_at' => now(),
            ],
            [
                'name' => 'Pak Budi (RT 03)',
                'category' => 'info_event',
                'title' => 'Kerja Bakti Minggu Pagi',
                'content' => 'Warga RT 03 harap hadir kerja bakti Minggu pagi pukul 07.00 di sekitar balai desa. Mohon bawa perlengkapan masing-masing.',
                'status' => 'approved',
                'approved_by' => 1,
                'approved_at' => now(),
            ],
            [
                'name' => 'Bu Sari',
                'category' => 'umkm',
                'title' => 'Jual Keripik Singkong Homemade',
                'content' => 'Tersedia keripik singkong gurih produksi rumahan. Tersedia rasa original, pedas manis, dan balado. Hubungi langsung atau titip ke warung RT 05.',
                'status' => 'approved',
                'approved_by' => 1,
                'approved_at' => now(),
            ],
        ];

        foreach ($submissions as $submission) {
            Submission::create($submission);
        }
    }
}
