<?php

namespace Tests\Feature;

use App\Models\OutboxEntry;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class OperationsTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_operator_can_view_outbox_health_and_recent_failure(): void
    {
        OutboxEntry::query()->forceCreate([
            'event_uuid' => 'event-failed',
            'type' => 'issued',
            'payload' => [],
            'attempts' => 2,
            'last_attempt_at' => now(),
            'last_error' => 'pusat menolak event',
        ]);

        $this->get(route('operasional.index'))
            ->assertOk()
            ->assertViewHas('health', fn ($health): bool => $health->pendingCount === 1 && $health->maxAttempts === 2)
            ->assertSee('Operasional')
            ->assertSee('event-failed')
            ->assertSee('pusat menolak event')
            ->assertSee('Endpoint pusat belum dikonfigurasi');
    }

    public function test_manual_sync_is_rejected_when_endpoint_is_not_configured(): void
    {
        config(['antrian.sync.endpoint' => null]);

        $this->from(route('operasional.index'))
            ->post(route('operasional.sinkronkan'))
            ->assertRedirect(route('operasional.index'))
            ->assertSessionHas('error', 'Sinkronisasi belum dapat dijalankan: endpoint pusat belum dikonfigurasi.');
    }

    public function test_manual_sync_pushes_then_pulls_when_endpoint_is_configured(): void
    {
        config([
            'antrian.sync.endpoint' => 'https://pusat.test/api',
            'antrian.device_id' => 'device-ui',
        ]);
        Http::preventStrayRequests();
        Http::fake([
            'https://pusat.test/api/events*' => Http::response([
                'events' => [],
                'cursor' => 'cursor-ui',
            ]),
        ]);

        $this->from(route('operasional.index'))
            ->post(route('operasional.sinkronkan'))
            ->assertRedirect(route('operasional.index'))
            ->assertSessionHas('status', 'Sinkronisasi selesai: 0 event terkirim dan 0 event diterapkan.');

        Http::assertSentCount(1);
    }

    public function test_backup_action_reports_unsupported_in_memory_database(): void
    {
        $this->from(route('operasional.index'))
            ->post(route('operasional.backup'))
            ->assertRedirect(route('operasional.index'))
            ->assertSessionHas('error');

        $this->assertStringContainsString(
            'Database SQLite sumber harus berupa file',
            (string) session('error'),
        );
    }
}
