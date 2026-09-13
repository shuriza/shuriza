<?php

namespace Database\Seeders;

use App\Models\Memory;
use Illuminate\Database\Seeder;

class MemorySeeder extends Seeder
{
    public function run(): void
    {
        $memories = [
            // Real content from social media about Desa Muneng
            [
                'title' => 'Desa Muneng: Menjelajahi Kecamatan Purwoasri Kediri',
                'description' => 'Enek seng omahmu kene? Menjelajahi suasana Desa Muneng, Kecamatan Purwoasri, Kabupaten Kediri. #purwoasri #kediri',
                'type' => 'video',
                'platform' => 'tiktok',
                'source_url' => 'https://www.tiktok.com/@kedirijalanjalan/video/7618170110896852242',
                'thumbnail_url' => null,
                'status' => 'approved',
                'submitted_by' => 1,
                'approved_by' => 1,
                'approved_at' => now(),
            ],
            [
                'title' => 'Desa Muneng Kecamatan Purwoasri Kabupaten Kediri',
                'description' => 'Dokumentasi suasana Desa Muneng, Kecamatan Purwoasri, Kabupaten Kediri. #jalanajalandikediri #kediri',
                'type' => 'photo',
                'platform' => 'instagram',
                'source_url' => 'https://www.instagram.com/p/DV-2HnDE8de/',
                'thumbnail_url' => null,
                'status' => 'approved',
                'submitted_by' => 1,
                'approved_by' => 1,
                'approved_at' => now(),
            ],
            [
                'title' => 'BBGRM XXII 2025 Desa Muneng',
                'description' => 'Bulan Bakti Gotong Royong Masyarakat (BBGRM) XXII 2025 Desa Muneng Kecamatan Purwoasri Kabupaten Kediri. Bersama Pak Kades & Pak Kasun.',
                'type' => 'video',
                'platform' => 'instagram',
                'source_url' => 'https://www.instagram.com/reel/DJtPPVuSDp6/',
                'thumbnail_url' => null,
                'status' => 'approved',
                'submitted_by' => 1,
                'approved_by' => 1,
                'approved_at' => now(),
            ],
            [
                'title' => 'Halaman Facebook Muneng Purwoasri',
                'description' => 'Halaman komunitas Facebook warga Desa Muneng, Purwoasri. Berisi informasi PTSL, pengumuman desa, dan kegiatan warga.',
                'type' => 'photo',
                'platform' => 'facebook',
                'source_url' => 'https://www.facebook.com/muneng.purwoasri.3/',
                'thumbnail_url' => null,
                'status' => 'approved',
                'submitted_by' => 1,
                'approved_by' => 1,
                'approved_at' => now(),
            ],
            [
                'title' => 'Suasana Pagi di Persawahan Muneng',
                'description' => 'Pemandangan sawah hijau di pagi hari, suasana khas Desa Muneng yang asri dan damai.',
                'type' => 'photo',
                'platform' => 'instagram',
                'source_url' => 'https://www.instagram.com/p/DV-2HnDE8de/',
                'thumbnail_url' => null,
                'status' => 'approved',
                'submitted_by' => 2,
                'approved_by' => 1,
                'approved_at' => now(),
            ],
            [
                'title' => 'Gotong Royong Warga RT 03',
                'description' => 'Semangat gotong royong warga RT 03 Desa Muneng membersihkan lingkungan sekitar balai desa.',
                'type' => 'video',
                'platform' => 'tiktok',
                'source_url' => 'https://www.tiktok.com/@kedirijalanjalan/video/7618170110896852242',
                'thumbnail_url' => null,
                'status' => 'approved',
                'submitted_by' => 2,
                'approved_by' => 1,
                'approved_at' => now(),
            ],
            // Pending submission example
            [
                'title' => 'Jalan Sore di Desa Muneng',
                'description' => 'Suasana jalan sore di Desa Muneng yang teduh dan asri.',
                'type' => 'video',
                'platform' => 'tiktok',
                'source_url' => 'https://www.tiktok.com/@kedirijalanjalan/video/7618170110896852242',
                'thumbnail_url' => null,
                'status' => 'pending',
                'submitted_by' => 2,
                'approved_by' => null,
                'approved_at' => null,
            ],
        ];

        foreach ($memories as $memory) {
            Memory::create($memory);
        }
    }
}
