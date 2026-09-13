<?php

namespace Tests\Feature;

use App\Enums\TicketEventType;
use App\Enums\TicketStatus;
use App\Models\Counter;
use App\Models\OutboxEntry;
use App\Models\Service;
use App\Models\Ticket;
use App\Services\QueueService;
use App\Services\TicketEventRecorder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Tests\TestCase;

class TicketHistoryTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_search_finds_a_ticket_by_bare_number_and_by_label(): void
    {
        $service = Service::factory()->code('A')->create();
        $this->ticket($service, 42);
        $this->ticket($service, 7);

        // Diperiksa lewat result set, bukan teks halaman: placeholder form
        // memuat contoh label sehingga assertSee bisa lulus tanpa hasil.
        $this->assertSame(['A042'], $this->searchLabels(['q' => '42']));
        $this->assertSame(['A007'], $this->searchLabels(['q' => 'A007']));

        // Pencarian kosong mengembalikan seluruh tiket tanggal itu.
        $this->assertSame(['A007', 'A042'], $this->searchLabels([]));
    }

    public function test_search_is_scoped_to_the_requested_service_date(): void
    {
        // Tanggal dipatok supaya tes tidak bergantung pada hari menjalankan.
        Carbon::setTestNow('2026-09-13 10:00:00');

        $service = Service::factory()->code('A')->create();
        $this->ticket($service, 1, '2026-09-12');
        $this->ticket($service, 2, '2026-09-13');

        $this->assertSame(['A001'], $this->searchLabels(['date' => '2026-09-12']));
        $this->assertSame(['A002'], $this->searchLabels(['date' => '2026-09-13']));
    }

    public function test_search_rejects_a_malformed_date(): void
    {
        $this->from(route('riwayat.index'))
            ->get(route('riwayat.index', ['date' => '13-09-2026']))
            ->assertRedirect(route('riwayat.index'))
            ->assertSessionHasErrors('date');
    }

    public function test_timeline_lists_every_event_in_occurrence_order(): void
    {
        $service = Service::factory()->code('A')->create();
        $counter = Counter::factory()->for($service)->create(['is_open' => true]);
        $queue = $this->app->make(QueueService::class);

        $ticket = $queue->issue($service);
        $called = $queue->callNext($counter);
        $queue->recall($called, $counter);
        $queue->finish($called->fresh(), $counter);

        $response = $this->get(route('riwayat.show', $ticket))
            ->assertOk()
            ->assertViewHas('events', fn ($events): bool => $events->count() === 4);

        // Urutan event adalah inti halaman ini, bukan hanya kehadirannya.
        $body = $response->getContent();
        $positions = array_map(
            fn (string $label): int => (int) strpos($body, $label),
            ['Tiket diambil', 'Dipanggil ulang', 'Selesai dilayani'],
        );
        $sorted = $positions;
        sort($sorted);

        $this->assertSame($sorted, $positions);
    }

    public function test_timeline_reports_sync_state_per_event(): void
    {
        $service = Service::factory()->code('A')->create();
        $counter = Counter::factory()->for($service)->create(['is_open' => true]);
        $queue = $this->app->make(QueueService::class);

        $ticket = $queue->issue($service);
        $called = $queue->callNext($counter);

        $events = $ticket->fresh()->events()->orderBy('id')->get();

        // Event pertama sudah di-ack pusat, event kedua gagal terkirim.
        OutboxEntry::query()->where('event_uuid', $events[0]->uuid)->update([
            'synced_at' => now(),
        ]);
        OutboxEntry::query()->where('event_uuid', $events[1]->uuid)->update([
            'attempts' => 3,
            'last_error' => 'pusat menolak event',
        ]);

        $this->get(route('riwayat.show', $ticket))
            ->assertOk()
            ->assertSee('Terkirim')
            ->assertSee('Gagal kirim (3x): pusat menolak event');

        $this->assertSame(TicketStatus::Dipanggil, $called->fresh()->status);
    }

    public function test_timeline_marks_an_imported_event_as_received_from_central(): void
    {
        $service = Service::factory()->code('A')->create();
        $ticket = $this->ticket($service, 5);

        // Event hasil import tidak punya baris outbox: itu benar, bukan hilang.
        $this->app->make(TicketEventRecorder::class)->recordImported(
            $ticket,
            TicketEventType::Issued,
            ['counter_name' => 'Loket Pusat'],
            (string) Str::uuid(),
            Carbon::parse('2026-09-13 09:00:00'),
        );

        $this->assertSame(0, OutboxEntry::query()->count());

        $this->get(route('riwayat.show', $ticket))
            ->assertOk()
            ->assertSee('Diterima dari pusat')
            ->assertDontSee('Menunggu dikirim');
    }

    public function test_timeline_shows_pending_events_as_awaiting_send(): void
    {
        $service = Service::factory()->code('A')->create();
        $ticket = $this->app->make(QueueService::class)->issue($service);

        $this->get(route('riwayat.show', $ticket))
            ->assertOk()
            ->assertSee('Menunggu dikirim')
            ->assertDontSee('Diterima dari pusat');
    }

    private function ticket(Service $service, int $number, ?string $date = null): Ticket
    {
        return Ticket::factory()->for($service)->create([
            'service_date' => $date ?? now()->toDateString(),
            'number' => $number,
            'label' => $service->code.str_pad((string) $number, 3, '0', STR_PAD_LEFT),
        ]);
    }

    /**
     * Label tiket hasil pencarian, urut sesuai tampilan.
     *
     * @param  array<string, string>  $query
     * @return array<int, string>
     */
    private function searchLabels(array $query): array
    {
        $response = $this->get(route('riwayat.index', $query))->assertOk();

        return $response->viewData('tickets')->pluck('label')->all();
    }
}
