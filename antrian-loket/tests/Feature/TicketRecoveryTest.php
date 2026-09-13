<?php

namespace Tests\Feature;

use App\Enums\TicketEventType;
use App\Enums\TicketStatus;
use App\Exceptions\QueueConflictException;
use App\Models\Counter;
use App\Models\OutboxEntry;
use App\Models\Service;
use App\Models\Ticket;
use App\Models\TicketEvent;
use App\Services\QueueService;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

/**
 * Pemulihan antrean di loket: panggil ulang tiket yang sedang dilayani dan
 * kembalikan tiket yang dilewati tanpa menghapus nomornya.
 */
class TicketRecoveryTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_recall_keeps_the_ticket_called_and_advances_call_time(): void
    {
        $queue = $this->queue();
        $service = Service::factory()->code('A')->create();
        $counter = Counter::factory()->for($service)->create(['is_open' => true]);

        Carbon::setTestNow('2026-09-13 08:00:00');
        $queue->issue($service);
        $called = $queue->callNext($counter);
        $firstCalledAt = $called->called_at;

        Carbon::setTestNow('2026-09-13 08:04:30');
        $recalled = $queue->recall($called, $counter);

        // Tiket tetap milik loket ini dan tetap dipanggil: panggil ulang bukan
        // transisi status, jadi operator tidak kehilangan tiket aktifnya.
        $this->assertSame(TicketStatus::Dipanggil, $recalled->status);
        $this->assertSame($counter->id, (int) $recalled->counter_id);
        $this->assertTrue($recalled->called_at->greaterThan($firstCalledAt));

        // Revision naik supaya panggilan terakhir menang saat resolusi konflik.
        $this->assertSame(3, (int) $recalled->revision);
        $this->assertSame($counter->id, (int) $counter->refresh()->currentTicket()->id);
    }

    public function test_restore_returns_a_skipped_ticket_to_the_front_of_its_queue(): void
    {
        $queue = $this->queue();
        $service = Service::factory()->code('A')->create();
        $counter = Counter::factory()->for($service)->create(['is_open' => true]);

        $first = $queue->issue($service);
        $second = $queue->issue($service);
        $queue->skip($queue->callNext($counter), $counter);

        $this->assertSame(TicketStatus::Dilewati, $first->fresh()->status);

        $restored = $queue->restore($first->fresh(), $counter);

        // Nomor asli dipertahankan: warga terlambat tidak kehilangan urutan.
        $this->assertSame(TicketStatus::Menunggu, $restored->status);
        $this->assertSame($first->number, $restored->number);
        $this->assertSame($first->label, $restored->label);
        $this->assertNull($restored->counter_id);
        $this->assertNull($restored->called_at);
        $this->assertNull($restored->finished_at);

        // Nomor lebih kecil, jadi tiket kembali dipanggil lebih dulu.
        $this->assertSame($first->label, $queue->callNext($counter)->label);
        $this->assertSame(TicketStatus::Menunggu, $second->fresh()->status);
    }

    public function test_restore_refuses_a_ticket_that_is_not_skipped(): void
    {
        $queue = $this->queue();
        $service = Service::factory()->code('A')->create();
        $counter = Counter::factory()->for($service)->create(['is_open' => true]);

        $ticket = $queue->issue($service);
        $called = $queue->callNext($counter);

        $this->assertQueueConflict(
            fn () => $queue->restore($called, $counter),
            'tidak berstatus dilewati',
        );

        $queue->finish($called, $counter);

        $this->assertQueueConflict(
            fn () => $queue->restore($ticket->fresh(), $counter),
            'tidak berstatus dilewati',
        );
    }

    public function test_restore_refuses_a_skipped_ticket_from_another_service_date(): void
    {
        $queue = $this->queue();
        $service = Service::factory()->code('A')->create();
        $counter = Counter::factory()->for($service)->create(['is_open' => true]);

        // Tiket kemarin tidak boleh kembali ke antrean hari ini: callNext
        // memfilter tanggal, jadi tiket itu akan menunggu tanpa pernah dipanggil.
        $stale = Ticket::factory()->for($service)->skipped()->create([
            'service_date' => now()->subDay()->toDateString(),
            'counter_id' => $counter->id,
            'number' => 7,
            'label' => 'A007',
        ]);

        $this->assertQueueConflict(
            fn () => $queue->restore($stale, $counter),
            'tidak bisa dikembalikan ke antrean hari ini',
        );

        $this->assertSame(TicketStatus::Dilewati, $stale->fresh()->status);
    }

    public function test_restore_refuses_a_ticket_skipped_by_another_counter(): void
    {
        $queue = $this->queue();
        $service = Service::factory()->code('A')->create();
        $owner = Counter::factory()->for($service)->create(['is_open' => true]);
        $other = Counter::factory()->for($service)->create(['is_open' => true]);

        $queue->issue($service);
        $skipped = $queue->skip($queue->callNext($owner), $owner);

        $this->assertQueueConflict(
            fn () => $queue->restore($skipped, $other),
            'bukan milik loket',
        );
    }

    public function test_recovery_mutations_write_matching_audit_and_outbox_records(): void
    {
        $queue = $this->queue();
        $service = Service::factory()->code('A')->create();
        $counter = Counter::factory()->for($service)->create(['is_open' => true]);

        $queue->issue($service);
        $called = $queue->callNext($counter);
        $queue->recall($called, $counter);
        $skipped = $queue->skip($called->fresh(), $counter);
        $queue->restore($skipped->fresh(), $counter);

        $events = TicketEvent::query()->orderBy('id')->get();
        $this->assertSame(
            ['issued', 'called', 'recalled', 'skipped', 'restored'],
            $events->pluck('type')->map(fn (TicketEventType $type): string => $type->value)->all(),
        );

        // Revision naik monoton pada setiap event, termasuk panggil ulang.
        $this->assertSame([1, 2, 3, 4, 5], $events->pluck('revision')->all());

        // Setiap audit event punya tepat satu pasangan outbox.
        $this->assertSame(
            $events->pluck('uuid')->sort()->values()->all(),
            OutboxEntry::query()->pluck('event_uuid')->sort()->values()->all(),
        );

        // Tiket yang dikembalikan tidak lagi terikat loket pada payload outbox.
        $restoredPayload = OutboxEntry::query()
            ->where('type', TicketEventType::Restored->value)
            ->sole()
            ->payload;
        $this->assertSame(TicketStatus::Menunggu->value, $restoredPayload['status']);
        $this->assertNull($restoredPayload['counter_uuid']);
    }

    public function test_console_offers_recall_and_restore_actions(): void
    {
        $this->withoutVite();
        $queue = $this->queue();
        $service = Service::factory()->code('A')->create();
        $counter = Counter::factory()->for($service)->create(['is_open' => true]);

        $queue->issue($service);
        $queue->issue($service);
        $queue->skip($queue->callNext($counter), $counter);
        $active = $queue->callNext($counter);

        $this->get(route('loket.show', $counter))
            ->assertOk()
            ->assertSee('Panggil Ulang '.$active->label)
            ->assertSee('Kembalikan ke Antrean')
            ->assertViewHas('skippedTickets', fn ($tickets): bool => $tickets->count() === 1);
    }

    public function test_operator_restores_a_skipped_ticket_through_the_console(): void
    {
        $queue = $this->queue();
        $service = Service::factory()->code('A')->create();
        $counter = Counter::factory()->for($service)->create(['is_open' => true]);

        $queue->issue($service);
        $skipped = $queue->skip($queue->callNext($counter), $counter);

        $this->from(route('loket.show', $counter))
            ->post(route('loket.kembalikan', [$counter, $skipped]))
            ->assertRedirect(route('loket.show', $counter))
            ->assertSessionHas('status', "Tiket {$skipped->label} dikembalikan ke antrean dan mempertahankan nomornya.");

        $this->assertSame(TicketStatus::Menunggu, $skipped->fresh()->status);
    }

    private function queue(): QueueService
    {
        return $this->app->make(QueueService::class);
    }

    /**
     * @param  callable(): mixed  $callback
     */
    private function assertQueueConflict(callable $callback, string $messageFragment): void
    {
        try {
            $callback();
            $this->fail('Expected QueueConflictException was not thrown.');
        } catch (QueueConflictException $exception) {
            $this->assertStringContainsString($messageFragment, $exception->getMessage());
        }
    }
}
