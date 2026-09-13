<?php

namespace App\Console\Commands;

use App\Services\OutboxOperationsService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('antrian:outbox-health')]
#[Description('Periksa backlog, umur, dan kegagalan pengiriman outbox')]
class InspectOutboxHealth extends Command
{
    public function handle(OutboxOperationsService $outbox): int
    {
        $health = $outbox->health();

        $this->table(
            ['Metrik', 'Nilai', 'Ambang'],
            [
                ['Pending', $health->pendingCount, config('antrian.operations.outbox_pending_warning')],
                ['Umur tertua (jam)', $health->oldestHours, config('antrian.operations.outbox_oldest_hours_warning')],
                ['Percobaan maksimum', $health->maxAttempts, config('antrian.operations.outbox_attempts_warning')],
            ],
        );

        if (! $health->healthy) {
            $this->error('Outbox memerlukan perhatian operator. Jalankan sinkronisasi dan periksa last_error.');

            return self::FAILURE;
        }

        $this->info('Outbox sehat.');

        return self::SUCCESS;
    }
}
