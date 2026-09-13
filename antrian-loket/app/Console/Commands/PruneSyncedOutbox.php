<?php

namespace App\Console\Commands;

use App\Services\OutboxOperationsService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('antrian:outbox-prune {--days= : Retensi entry tersinkron} {--execute : Hapus entry yang memenuhi syarat}')]
#[Description('Pratinjau atau hapus entry outbox tersinkron yang melewati retensi')]
class PruneSyncedOutbox extends Command
{
    public function handle(OutboxOperationsService $outbox): int
    {
        $retentionDays = $this->retentionDays();

        try {
            $eligible = $outbox->eligibleForPrune($retentionDays);

            if (! $this->option('execute')) {
                $this->info("Pratinjau: {$eligible} entry tersinkron berumur minimal {$retentionDays} hari dapat dihapus.");
                $this->line('Tidak ada data yang dihapus. Tambahkan --execute untuk menjalankan.');

                return self::SUCCESS;
            }

            $deleted = $outbox->prune($retentionDays);
        } catch (\Throwable $exception) {
            $this->error('Prune gagal: '.$exception->getMessage());

            return self::FAILURE;
        }

        $this->info("{$deleted} entry outbox tersinkron dihapus. Entry pending tetap dipertahankan.");

        return self::SUCCESS;
    }

    private function retentionDays(): int
    {
        $days = $this->option('days');

        return is_numeric($days)
            ? (int) $days
            : (int) config('antrian.operations.outbox_synced_retention_days');
    }
}
