<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            VillageInfoSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            EventSeeder::class,
            MemoryAlbumSeeder::class,
            MemorySeeder::class,
            DestinationSeeder::class,
            AnnouncementSeeder::class,
            SubmissionSeeder::class,
            ProductSeeder::class,
            GallerySeeder::class,
            PollSeeder::class,
        ]);
    }
}
