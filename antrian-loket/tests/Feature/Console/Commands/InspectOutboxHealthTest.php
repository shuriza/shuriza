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

    public function test_prune_is_a_non_destructive_preview_by_default(): void
    {
        OutboxEntry::query()->forceCreate($this->entry('event-old-synced', [
            'synced_at' => now()->subDays(31),
        ]));

        $this->artisan('antrian:outbox-prune', ['--days' => 30])
            ->expectsOutputToContain('Pratinjau: 1')
            ->expectsOutputToContain('Tidak ada data yang dihapus')
            ->assertSuccessful();

        $this->assertSame(1, OutboxEntry::query()->count());
    }

    public function test_prune_deletes_only_synced_entries_past_retention(): void
    {
        OutboxEntry::query()->forceCreate($this->entry('event-old-synced', [
            'synced_at' => now()->subDays(31),
        ]));
        OutboxEntry::query()->forceCreate($this->entry('event-recent-synced', [
            'synced_at' => now()->subDays(29),
        ]));
        OutboxEntry::query()->forceCreate($this->entry('event-old-pending', [
            'created_at' => now()->subDays(60),
        ]));

        $this->artisan('antrian:outbox-prune', ['--days' => 30, '--execute' => true])
            ->expectsOutputToContain('1 entry outbox tersinkron dihapus')
            ->assertSuccessful();

        $this->assertFalse(OutboxEntry::query()->where('event_uuid', 'event-old-synced')->exists());
        $this->assertTrue(OutboxEntry::query()->where('event_uuid', 'event-recent-synced')->exists());
        $this->assertTrue(OutboxEntry::pending()->where('event_uuid', 'event-old-pending')->exists());
    }

    public function test_prune_rejects_zero_day_retention(): void
    {
        $this->artisan('antrian:outbox-prune', ['--days' => 0, '--execute' => true])
            ->expectsOutputToContain('Retensi outbox minimal 1 hari')
            ->assertFailed();
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
