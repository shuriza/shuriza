<?php

namespace Tests\Feature;

use App\Enums\TicketStatus;
use App\Models\Counter;
use App\Models\Service;
use App\Models\Ticket;
use App\Services\QueueService;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class DailyReportTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_daily_report_aggregates_status_and_duration_per_service(): void
    {
        $this->withoutVite();
        $service = Service::factory()->code('A')->create();
        Service::factory()->code('B')->create();
        $date = '2026-09-13';

        $this->ticket($service, $date, TicketStatus::Menunggu, '08:00');
        $this->ticket($service, $date, TicketStatus::Dipanggil, '08:00', '08:10');
        $this->ticket($service, $date, TicketStatus::Selesai, '08:00', '08:05', '08:20');
        $this->ticket($service, $date, TicketStatus::Dilewati, '08:00', '08:20', '08:30');
        $this->ticket($service, '2026-09-12', TicketStatus::Selesai, '08:00', '08:02', '08:04');

        $response = $this->get(route('laporan.harian', ['date' => $date]));

        $response
            ->assertOk()
            ->assertViewHas('issuedCount', 4)
            ->assertViewHas('waitingCount', 1)
            ->assertViewHas('calledCount', 1)
            ->assertViewHas('finishedCount', 1)
            ->assertViewHas('skippedCount', 1)
            ->assertViewHas('services', function ($services): bool {
                $serviceA = $services->firstWhere('code', 'A');
                $serviceB = $services->firstWhere('code', 'B');

                return (int) $serviceA->issued_count === 4
                    && (int) $serviceA->waiting_count === 1
                    && (int) $serviceA->called_count === 1
                    && (int) $serviceA->finished_count === 1
                    && (int) $serviceA->skipped_count === 1
                    && round((float) $serviceA->average_wait_minutes, 1) === 11.7
                    && round((float) $serviceA->average_service_minutes, 1) === 12.5
                    && (int) $serviceB->issued_count === 0;
            });
    }

    public function test_daily_report_rejects_an_invalid_date(): void
    {
        $this->from(route('laporan.harian'))
            ->get(route('laporan.harian', ['date' => '13-09-2026']))
            ->assertRedirect(route('laporan.harian'))
            ->assertSessionHasErrors('date');
    }

    private function ticket(
        Service $service,
        string $date,
        TicketStatus $status,
        string $issuedTime,
        ?string $calledTime = null,
        ?string $finishedTime = null,
    ): Ticket {
        static $number = 0;
        $number++;

        return Ticket::factory()->for($service)->create([
            'service_date' => $date,
            'number' => $number,
            'label' => $service->code.str_pad((string) $number, 3, '0', STR_PAD_LEFT),
            'status' => $status,
            'issued_at' => Carbon::parse("{$date} {$issuedTime}"),
            'called_at' => $calledTime === null ? null : Carbon::parse("{$date} {$calledTime}"),
            'finished_at' => $finishedTime === null ? null : Carbon::parse("{$date} {$finishedTime}"),
        ]);
    }

    /**
     * Panggil ulang dan pengembalian tidak terlihat dari status akhir tiket,
     * jadi laporan menghitungnya dari audit event.
     */
    public function test_daily_report_counts_recall_and_restore_interventions_per_service(): void
    {
        $this->withoutVite();
        $service = Service::factory()->code('A')->create();
        $quiet = Service::factory()->code('B')->create();
        $counter = Counter::factory()->for($service)->create(['is_open' => true]);
        $queue = $this->app->make(QueueService::class);

        // Satu tiket dipanggil ulang dua kali, lalu dilewati dan dikembalikan.
        $queue->issue($service);
        $called = $queue->callNext($counter);
        $queue->recall($called, $counter);
        $queue->recall($called->fresh(), $counter);
        $skipped = $queue->skip($called->fresh(), $counter);
        $queue->restore($skipped->fresh(), $counter);

        $this->get(route('laporan.harian', ['date' => now()->toDateString()]))
            ->assertOk()
            ->assertViewHas('recalledCount', 2)
            ->assertViewHas('restoredCount', 1)
            ->assertViewHas('services', function ($services): bool {
                return (int) $services->firstWhere('code', 'A')->recalled_count === 2
                    && (int) $services->firstWhere('code', 'A')->restored_count === 1
                    && (int) $services->firstWhere('code', 'B')->recalled_count === 0;
            })
            ->assertSee('Panggil ulang');
    }
}
