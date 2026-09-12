<?php

namespace App\Console\Commands;

use App\Models\OutboxEntry;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

#[Signature('antrian:outbox-health')]
#[Description('Periksa backlog, umur, dan kegagalan pengiriman outbox')]
class InspectOutboxHealth extends Command
{
    public function handle(): int
    {
        $pending = OutboxEntry::pending();
        $pendingCount = (clone $pending)->count();
        $oldestPendingAt = (clone $pending)->min('created_at');
        $maxAttempts = (int) ((clone $pending)->max('attempts') ?? 0);
        $oldestHours = $oldestPendingAt === null
            ? 0
            : (int) floor(Carbon::parse($oldestPendingAt)->diffInMinutes(now(), true) / 60);

        $this->table(
            ['Metrik', 'Nilai', 'Ambang'],
            [
                ['Pending', $pendingCount, config('antrian.operations.outbox_pending_warning')],
                ['Umur tertua (jam)', $oldestHours, config('antrian.operations.outbox_oldest_hours_warning')],
                ['Percobaan maksimum', $maxAttempts, config('antrian.operations.outbox_attempts_warning')],
            ],
        );

        $unhealthy = $pendingCount >= (int) config('antrian.operations.outbox_pending_warning')
            || $oldestHours >= (int) config('antrian.operations.outbox_oldest_hours_warning')
            || $maxAttempts >= (int) config('antrian.operations.outbox_attempts_warning');

        if ($unhealthy) {
            $this->error('Outbox memerlukan perhatian operator. Jalankan sinkronisasi dan periksa last_error.');

            return self::FAILURE;
        }

        $this->info('Outbox sehat.');

        return self::SUCCESS;
    }
}
