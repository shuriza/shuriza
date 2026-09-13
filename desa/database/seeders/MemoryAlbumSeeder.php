<?php
namespace Database\Seeders;

use App\Models\MemoryAlbum;
use Illuminate\Database\Seeder;

class MemoryAlbumSeeder extends Seeder
{
    public function run(): void
    {
        $albums = [
            ['name' => '17 Agustus', 'slug' => '17-agustus', 'description' => 'Momen perayaan kemerdekaan di Desa Muneng', 'order' => 1],
            ['name' => 'Gotong Royong', 'slug' => 'gotong-royong', 'description' => 'Semangat kebersamaan warga Muneng', 'order' => 2],
            ['name' => 'Panen Raya', 'slug' => 'panen-raya', 'description' => 'Musim panen dan syukuran warga', 'order' => 3],
            ['name' => 'Suasana Desa', 'slug' => 'suasana-desa', 'description' => 'Keindahan dan keseharian Desa Muneng', 'order' => 4],
            ['name' => 'Acara Keagamaan', 'slug' => 'acara-keagamaan', 'description' => 'Momen keagamaan dan tradisi spiritual', 'order' => 5],
        ];

        foreach ($albums as $album) {
            MemoryAlbum::create($album);
        }
    }
}
