<?php

namespace App\Services;

use App\Models\OutboxEntry;
use Illuminate\Support\Carbon;

final readonly class OutboxHealth
{
    public function __construct(
        public int $pendingCount,
        public int $oldestHours,
        public int $maxAttempts,
        public bool $healthy,
    ) {}
}

class OutboxOperationsService
{
    public function health(): OutboxHealth
    {
        $metrics = OutboxEntry::pending()
            ->selectRaw('COUNT(*) as pending_count, MIN(created_at) as oldest_pending_at, COALESCE(MAX(attempts), 0) as max_attempts')
            ->firstOrFail();

        $oldestHours = $metrics->oldest_pending_at === null
            ? 0
            : (int) floor(Carbon::parse($metrics->oldest_pending_at)->diffInMinutes(now(), true) / 60);
        $pendingCount = (int) $metrics->pending_count;
        $maxAttempts = (int) $metrics->max_attempts;
        $healthy = $pendingCount < max(1, (int) config('antrian.operations.outbox_pending_warning'))
            && $oldestHours < max(1, (int) config('antrian.operations.outbox_oldest_hours_warning'))
            && $maxAttempts < max(1, (int) config('antrian.operations.outbox_attempts_warning'));

        return new OutboxHealth($pendingCount, $oldestHours, $maxAttempts, $healthy);
    }

    public function eligibleForPrune(int $retentionDays): int
    {
        $this->guardRetentionDays($retentionDays);

        return OutboxEntry::query()
            ->whereNotNull('synced_at')
            ->where('synced_at', '<=', now()->subDays($retentionDays))
            ->count();
    }

    public function prune(int $retentionDays): int
    {
        $this->guardRetentionDays($retentionDays);
        $cutoff = now()->subDays($retentionDays);
        $deleted = 0;

        do {
            $ids = OutboxEntry::query()
                ->whereNotNull('synced_at')
                ->where('synced_at', '<=', $cutoff)
                ->orderBy('id')
                ->limit(500)
                ->pluck('id');

            if ($ids->isEmpty()) {
                break;
            }

            $deleted += OutboxEntry::query()->whereKey($ids->all())->delete();
        } while (true);

        return $deleted;
    }

    private function guardRetentionDays(int $retentionDays): void
    {
        if ($retentionDays < 1) {
            throw new \InvalidArgumentException('Retensi outbox minimal 1 hari.');
        }
    }
}
