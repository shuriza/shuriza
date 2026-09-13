<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // Event categories
            ['name' => 'Keagamaan', 'slug' => 'keagamaan', 'type' => 'event', 'description' => 'Acara keagamaan desa'],
            ['name' => 'Budaya', 'slug' => 'budaya', 'type' => 'event', 'description' => 'Acara budaya dan tradisi'],
            ['name' => 'Olahraga', 'slug' => 'olahraga', 'type' => 'event', 'description' => 'Kegiatan olahraga'],
            ['name' => 'Gotong Royong', 'slug' => 'gotong-royong', 'type' => 'event', 'description' => 'Kegiatan gotong royong warga'],
            ['name' => 'Peringatan', 'slug' => 'peringatan', 'type' => 'event', 'description' => 'Peringatan hari besar'],

            // Memory categories
            ['name' => 'Kehidupan Sehari-hari', 'slug' => 'kehidupan-sehari-hari', 'type' => 'memory', 'description' => 'Momen kehidupan sehari-hari di desa'],
            ['name' => 'Pemandangan', 'slug' => 'pemandangan', 'type' => 'memory', 'description' => 'Pemandangan indah desa'],
            ['name' => 'Tradisi', 'slug' => 'tradisi', 'type' => 'memory', 'description' => 'Tradisi dan adat istiadat'],
            ['name' => 'Kuliner', 'slug' => 'kuliner', 'type' => 'memory', 'description' => 'Kuliner khas desa'],

            // Destination categories
            ['name' => 'Fasilitas Umum', 'slug' => 'fasilitas-umum', 'type' => 'destination', 'description' => 'Fasilitas umum desa'],
            ['name' => 'Tempat Ibadah', 'slug' => 'tempat-ibadah', 'type' => 'destination', 'description' => 'Tempat ibadah di desa'],
            ['name' => 'Pendidikan', 'slug' => 'pendidikan', 'type' => 'destination', 'description' => 'Fasilitas pendidikan'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
