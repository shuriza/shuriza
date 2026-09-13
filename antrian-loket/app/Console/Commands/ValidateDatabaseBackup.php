<?php

namespace App\Console\Commands;

use App\Services\DatabaseMaintenanceService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('antrian:backup-validate {path : File backup SQLite yang diperiksa}')]
#[Description('Validasi integritas dan skema minimum backup Antrian Loket')]
class ValidateDatabaseBackup extends Command
{
    public function handle(DatabaseMaintenanceService $databases): int
    {
        $report = $databases->validate((string) $this->argument('path'));

        if (! $report->valid) {
            $this->error('Backup tidak valid.');
            foreach ($report->errors as $error) {
                $this->line(" - {$error}");
            }

            return self::FAILURE;
        }

        $this->info("Backup valid: {$report->path} ({$report->bytes} byte)");

        return self::SUCCESS;
    }
}
