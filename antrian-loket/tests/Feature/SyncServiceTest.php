<?php

namespace Tests\Feature;

use App\Enums\TicketEventType;
use App\Enums\TicketStatus;
use App\Models\OutboxEntry;
use App\Models\Service;
use App\Models\SyncState;
use App\Models\Ticket;
use App\Models\TicketEvent;
use App\Services\QueueService;
use App\Services\SyncService;
use App\Support\DeviceIdentity;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Tests\TestCase;

class SyncServiceTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_pull_rejects_unknown_services_without_advancing_cursor_or_writing_data(): void
    {
        $this->configureSync();
        SyncState::query()->updateOrCreate(['key' => 'last_pull_cursor'], ['value' => 'cursor-sebelum']);

        Http::fake([
            '*' => Http::response([
                'events' => [
                    $this->remoteEvent([
                        'service_code' => 'Z',
                        'revision' => 2,
                    ]),
                ],
                'cursor' => 'cursor-sesudah',
            ], 200),
        ]);

        $report = app(SyncService::class)->pull();

        $this->assertNotNull($report->error);
        $this->assertStringContainsString('tidak ditemukan', $report->error);
        $this->assertSame('cursor-sebelum', SyncState::query()->find('last_pull_cursor')?->value);
        $this->assertSame(0, Ticket::query()->count());
        $this->assertSame(0, TicketEvent::query()->count());
    }

    public function test_pull_is_idempotent_for_replayed_remote_events(): void
    {
        $this->configureSync();
        Service::factory()->code('A')->create();

        $cursor = 'cursor-idempoten';
        $event = $this->remoteEvent([
            'event_uuid' => (string) Str::uuid(),
            'ticket_uuid' => (string) Str::uuid(),
            'service_code' => 'A',
            'revision' => 1,
            'status' => TicketStatus::Menunggu->value,
            'event_type' => TicketEventType::Issued->value,
        ]);

        Http::fake([
            '*' => Http::response([
                'events' => [$event],
                'cursor' => $cursor,
            ], 200),
        ]);

        $service = app(SyncService::class);
        $first = $service->pull();
        $second = $service->pull();

        $this->assertNull($first->error);
        $this->assertSame(1, $first->sent);
        $this->assertNull($second->error);
        $this->assertSame(0, $second->sent);
        $this->assertSame(1, Ticket::query()->count());
        $this->assertSame(1, TicketEvent::query()->count());
        $this->assertSame($cursor, SyncState::query()->find('last_pull_cursor')?->value);
    }

    public function test_pull_skips_an_event_uuid_that_was_already_recorded(): void
    {
        $this->configureSync();
        $service = Service::factory()->code('A')->create();
        $ticket = app(QueueService::class)->issue($service);
        $eventUuid = $ticket->events()->firstOrFail()->uuid;

        Http::fake([
            '*' => Http::response([
                'events' => [
                    $this->remoteEvent([
                        'event_uuid' => $eventUuid,
                        'ticket_uuid' => $ticket->uuid,
                        'service_code' => $service->code,
                        'service_date' => $ticket->service_date->toDateString(),
                        'number' => $ticket->number,
                        'label' => $ticket->label,
                        'status' => TicketStatus::Dipanggil->value,
                        'revision' => 2,
                        'event_type' => TicketEventType::Called->value,
                        'counter_uuid' => (string) Str::uuid(),
                    ]),
                ],
                'cursor' => 'cursor-duplikat',
            ], 200),
        ]);

        $report = app(SyncService::class)->pull();

        $this->assertNull($report->error);
        $this->assertSame(0, $report->sent);
        $this->assertSame('cursor-duplikat', SyncState::query()->find('last_pull_cursor')?->value);
        $this->assertSame(TicketStatus::Menunggu, $ticket->fresh()->status);
        $this->assertSame(1, TicketEvent::query()->where('uuid', $eventUuid)->count());
    }

    public function test_pull_rolls_back_when_number_collides_and_keeps_the_cursor(): void
    {
        $this->configureSync();
        $service = Service::factory()->code('A')->create();
        Ticket::factory()->for($service)->create([
            'service_date' => now()->toDateString(),
            'number' => 1,
            'label' => 'A001',
            'status' => TicketStatus::Menunggu,
            'revision' => 1,
            'origin_device_id' => 'loket-lokal',
        ]);
        SyncState::query()->updateOrCreate(['key' => 'last_pull_cursor'], ['value' => 'cursor-awal']);

        Http::fake([
            '*' => Http::response([
                'events' => [
                    $this->remoteEvent([
                        'event_uuid' => (string) Str::uuid(),
                        'ticket_uuid' => (string) Str::uuid(),
                        'service_code' => 'A',
                        'service_date' => now()->toDateString(),
                        'number' => 1,
                        'label' => 'A001',
                        'status' => TicketStatus::Menunggu->value,
                        'revision' => 2,
                        'event_type' => TicketEventType::Issued->value,
                    ]),
                ],
                'cursor' => 'cursor-baru',
            ], 200),
        ]);

        $report = app(SyncService::class)->pull();

        $this->assertNotNull($report->error);
        $this->assertStringContainsString('bentrok', $report->error);
        $this->assertSame('cursor-awal', SyncState::query()->find('last_pull_cursor')?->value);
        $this->assertSame(1, Ticket::query()->count());
        $this->assertSame(0, TicketEvent::query()->count());
    }

    public function test_pull_rejects_out_of_range_integer_strings_without_advancing_cursor_or_writing_batch(): void
    {
        $this->configureSync();
        Service::factory()->code('A')->create();
        SyncState::query()->updateOrCreate(['key' => 'last_pull_cursor'], ['value' => 'cursor-awal']);

        Http::fake([
            '*' => Http::response([
                'events' => [
                    $this->remoteEvent(),
                    $this->remoteEvent([
                        'number' => 2,
                        'revision' => PHP_INT_MAX.'0',
                    ]),
                ],
                'cursor' => 'cursor-baru',
            ], 200),
        ]);

        $report = app(SyncService::class)->pull();

        $this->assertNotNull($report->error);
        $this->assertSame('cursor-awal', SyncState::query()->find('last_pull_cursor')?->value);
        $this->assertSame(0, Ticket::query()->count());
        $this->assertSame(0, TicketEvent::query()->count());
    }

    public function test_pull_accepts_php_int_max_integer_strings_for_revision_and_number(): void
    {
        $this->configureSync();
        Service::factory()->code('A')->create();

        Http::fake([
            '*' => Http::response([
                'events' => [
                    $this->remoteEvent([
                        'number' => (string) PHP_INT_MAX,
                        'revision' => (string) PHP_INT_MAX,
                    ]),
                ],
                'cursor' => 'cursor-maksimum',
            ], 200),
        ]);

        $report = app(SyncService::class)->pull();
        $ticket = Ticket::query()->sole();

        $this->assertNull($report->error);
        $this->assertSame(1, $report->sent);
        $this->assertSame(PHP_INT_MAX, $ticket->number);
        $this->assertSame(PHP_INT_MAX, $ticket->revision);
        $this->assertSame('cursor-maksimum', SyncState::query()->find('last_pull_cursor')?->value);
    }

    public function test_push_requires_explicit_ack_contract_and_keeps_pending_entries(): void
    {
        $this->configureSync();
        $service = Service::factory()->code('A')->create();
        app(QueueService::class)->issue($service);

        $pendingBefore = OutboxEntry::pending()->count();

        Http::fake([
            '*' => Http::response(['ok' => true], 200),
        ]);

        $report = app(SyncService::class)->push();
        $entry = OutboxEntry::query()->firstOrFail();

        $this->assertNotNull($report->error);
        $this->assertStringContainsString('acked', $report->error);
        $this->assertSame(0, $report->sent);
        $this->assertSame($pendingBefore, $report->failed);
        $this->assertSame($pendingBefore, OutboxEntry::pending()->count());
        $this->assertNull($entry->synced_at);
        $this->assertSame(1, $entry->attempts);
        $this->assertNotEmpty($entry->last_error);
    }

    public function test_push_marks_only_acked_entries_and_retains_the_rest(): void
    {
        $this->configureSync();
        $service = Service::factory()->code('A')->create();
        app(QueueService::class)->issue($service);
        app(QueueService::class)->issue($service);

        $pending = OutboxEntry::pending()->orderBy('id')->get();
        $ackedUuid = $pending[0]->event_uuid;
        $pendingUuid = $pending[1]->event_uuid;

        Http::fake([
            '*' => Http::response(['acked' => [$ackedUuid]], 200),
        ]);

        $report = app(SyncService::class)->push();

        $ackedEntry = OutboxEntry::query()->where('event_uuid', $ackedUuid)->firstOrFail();
        $pendingEntry = OutboxEntry::query()->where('event_uuid', $pendingUuid)->firstOrFail();

        $this->assertNull($report->error);
        $this->assertSame(1, $report->sent);
        $this->assertSame(1, $report->failed);
        $this->assertSame(1, OutboxEntry::pending()->count());
        $this->assertNotNull($ackedEntry->synced_at);
        $this->assertNull($pendingEntry->synced_at);
        $this->assertSame('menunggu ack server', $pendingEntry->last_error);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function remoteEvent(array $overrides = []): array
    {
        return array_merge([
            'event_uuid' => (string) Str::uuid(),
            'event_type' => TicketEventType::Issued->value,
            'ticket_uuid' => (string) Str::uuid(),
            'service_code' => 'A',
            'service_date' => now()->toDateString(),
            'number' => 1,
            'label' => 'A001',
            'status' => TicketStatus::Menunggu->value,
            'revision' => 1,
            'origin_device_id' => '1',
            'occurred_at' => now()->toIso8601String(),
        ], $overrides);
    }

    private function configureSync(): void
    {
        config([
            'antrian.sync.endpoint' => 'https://central.test',
            'antrian.device_id' => 'loket-01',
        ]);

        app(DeviceIdentity::class)->flush();
    }
}
