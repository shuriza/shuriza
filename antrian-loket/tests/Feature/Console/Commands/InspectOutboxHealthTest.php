<?php

namespace Tests\Feature\Console\Commands;

use App\Models\OutboxEntry;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class InspectOutboxHealthTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_empty_outbox_is_healthy(): void
    {
        $this->artisan('antrian:outbox-health')
            ->expectsOutput('Outbox sehat.')
            ->assertSuccessful();
    }

    public function test_pending_count_at_threshold_requires_attention(): void
    {
        config(['antrian.operations.outbox_pending_warning' => 2]);
        OutboxEntry::query()->forceCreate($this->entry('event-1'));
        OutboxEntry::query()->forceCreate($this->entry('event-2'));

        $this->artisan('antrian:outbox-health')
            ->expectsOutputToContain('memerlukan perhatian operator')
            ->assertFailed();
    }

    public function test_old_pending_entry_requires_attention(): void
    {
        config(['antrian.operations.outbox_oldest_hours_warning' => 24]);
        OutboxEntry::query()->forceCreate($this->entry('event-old', [
            'created_at' => now()->subHours(25),
        ]));

        $this->artisan('antrian:outbox-health')->assertFailed();
    }

    public function test_repeated_delivery_failures_require_attention(): void
    {
        config(['antrian.operations.outbox_attempts_warning' => 5]);
        OutboxEntry::query()->forceCreate($this->entry('event-failed', [
            'attempts' => 5,
            'last_error' => 'pusat tidak tersedia',
        ]));

        $this->artisan('antrian:outbox-health')->assertFailed();
    }

    public function test_synced_entries_do_not_make_outbox_unhealthy(): void
    {
        config([
            'antrian.operations.outbox_pending_warning' => 1,
            'antrian.operations.outbox_oldest_hours_warning' => 1,
            'antrian.operations.outbox_attempts_warning' => 1,
        ]);
        OutboxEntry::query()->forceCreate($this->entry('event-synced', [
            'attempts' => 10,
            'created_at' => now()->subDays(5),
            'synced_at' => now(),
        ]));

        $this->artisan('antrian:outbox-health')->assertSuccessful();
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function entry(string $eventUuid, array $overrides = []): array
    {
        return array_merge([
            'event_uuid' => $eventUuid,
            'type' => 'issued',
            'payload' => [],
            'attempts' => 0,
            'synced_at' => null,
        ], $overrides);
    }
}
