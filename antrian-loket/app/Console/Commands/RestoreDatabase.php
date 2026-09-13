<?php

namespace App\Console\Commands;

use App\Services\DatabaseMaintenanceService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('antrian:restore {path : File backup SQLite} {--confirm= : Harus persis RESTORE}')]
#[Description('Pulihkan database offline setelah validasi dan backup pra-restore')]
class RestoreDatabase extends Command
{
    public function handle(DatabaseMaintenanceService $databases): int
    {
        try {
            $report = $databases->restore(
                (string) $this->argument('path'),
                (string) $this->option('confirm'),
            );
        } catch (\Throwable $exception) {
            $this->error('Restore gagal: '.$exception->getMessage());

            return self::FAILURE;
        }

        $this->info("Restore berhasil dari {$report->sourcePath}.");
        $this->line("Backup pra-restore: {$report->preRestoreBackupPath}");

        return self::SUCCESS;
    }
}
