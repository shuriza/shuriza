<?php

namespace Database\Seeders;

use App\Models\Poll;
use Illuminate\Database\Seeder;

class PollSeeder extends Seeder
{
    public function run(): void
    {
        Poll::create([
            'question' => 'Kegiatan apa yang paling Anda nantikan di Desa Muneng?',
            'options' => ['Gotong Royong', 'Turnamen Olahraga', 'Festival Budaya', 'Pasar UMKM'],
            'is_active' => true,
            'ends_at' => now()->addDays(30),
            'user_id' => 1,
        ]);
    }
}
