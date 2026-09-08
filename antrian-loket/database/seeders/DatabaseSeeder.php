<?php

namespace Database\Seeders;

use App\Enums\TicketStatus;
use App\Models\Service;
use App\Models\Ticket;
use App\Models\User;
use App\Services\OfficeInitializer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Isi kantor loket demo secara deterministik: satu petugas admin,
     * empat layanan berkode tetap A–D, empat loket, dan antrian tengah
     * pagi untuk HARI INI.
     *
     * Seeder sengaja TIDAK menulis baris ticket_events maupun
     * outbox_entries: riwayat seeding bukan pekerjaan nyata device,
     * dan outbox palsu akan meracuni demo sinkronisasi.
     */
    public function run(): void
    {
        // Petugas admin — idempoten lewat email.
        User::query()->updateOrCreate(
            ['email' => 'petugas@antrian.test'],
            [
                'name' => 'Petugas Loket',
                'password' => Hash::make('password'),
            ],
        );

        ['services' => $services, 'counters' => $counters] = app(OfficeInitializer::class)
            ->initialize(overwriteExisting: true);

        // Antrian tengah pagi untuk hari ini. Bentuknya deterministik:
        // [jumlah selesai, 1 tiket dipanggil?, jumlah menunggu].
        // Nomor mulai dari 1 per layanan sehingga selalu memenuhi
        // UNIQUE (service_id, service_date, number).
        $today = now()->toDateString();

        $queueShapes = [
            'A' => ['finished' => 4, 'called' => true, 'waiting' => 5],
            'B' => ['finished' => 3, 'called' => true, 'waiting' => 4],
            'C' => ['finished' => 6, 'called' => true, 'waiting' => 6],
            'D' => ['finished' => 2, 'called' => false, 'waiting' => 6],
        ];

        $totalTickets = 0;

        foreach ($queueShapes as $code => $shape) {
            $service = $services[$code];
            $counter = $counters[$code];
            $number = 0;

            $baseTime = now()->setTime(8, 0);

            // Tiket yang sudah selesai dilayani pagi tadi.
            for ($i = 0; $i < $shape['finished']; $i++) {
                $number++;
                $issuedAt = $baseTime->copy()->addMinutes($number * 7);
                $calledAt = $issuedAt->copy()->addMinutes(3);

                $this->seedTicket($service, $today, $number, [
                    'counter_id' => $counter->id,
                    'status' => TicketStatus::Selesai,
                    'issued_at' => $issuedAt,
                    'called_at' => $calledAt,
                    'finished_at' => $calledAt->copy()->addMinutes($service->estimated_minutes),
                    'revision' => 3,
                ]);
            }

            // Satu tiket yang sedang dipanggil di loket layanan ini.
            if ($shape['called']) {
                $number++;
                $issuedAt = $baseTime->copy()->addMinutes($number * 7);

                $this->seedTicket($service, $today, $number, [
                    'counter_id' => $counter->id,
                    'status' => TicketStatus::Dipanggil,
                    'issued_at' => $issuedAt,
                    'called_at' => now()->subMinutes(2),
                    'revision' => 2,
                ]);
            }

            // Antrian yang masih menunggu.
            for ($i = 0; $i < $shape['waiting']; $i++) {
                $number++;

                $this->seedTicket($service, $today, $number, [
                    'status' => TicketStatus::Menunggu,
                    'issued_at' => $baseTime->copy()->addMinutes($number * 7),
                    'revision' => 1,
                ]);
            }

            $totalTickets += $number;
        }

        $this->command?->info(sprintf(
            'Data demo tersedia: 1 petugas, %d layanan (A–D), %d loket, %d tiket untuk hari ini (%s).',
            count($services),
            count($counters),
            $totalTickets,
            $today,
        ));
    }

    /**
     * Buat satu tiket seed secara idempoten per (layanan, tanggal, nomor).
     *
     * @param  array<string, mixed>  $attributes
     */
    protected function seedTicket(Service $service, string $date, int $number, array $attributes): void
    {
        // Format label harus sama dengan QueueService::issue(): kode + 3 digit.
        $label = $service->code.str_pad((string) $number, 3, '0', STR_PAD_LEFT);

        Ticket::query()->updateOrCreate(
            [
                'service_id' => $service->id,
                'service_date' => $date,
                'number' => $number,
            ],
            array_merge([
                'label' => $label,
                'counter_id' => null,
                'status' => TicketStatus::Menunggu,
                'issued_at' => now(),
                'called_at' => null,
                'finished_at' => null,
                'revision' => 1,
                'origin_device_id' => 'seeder-demo',
            ], $attributes),
        );
    }
}
