<?php

namespace App\Console\Commands;

use App\Services\DatabaseMaintenanceService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('antrian:backup {--path= : Lokasi file backup SQLite} {--force : Timpa file tujuan jika sudah ada}')]
#[Description('Buat snapshot konsisten database SQLite yang sedang digunakan')]
class BackupDatabase extends Command
{
    public function handle(DatabaseMaintenanceService $databases): int
    {
        try {
            $backup = $databases->backup($this->destinationPath(), (bool) $this->option('force'));
        } catch (\Throwable $exception) {
            $this->error('Backup gagal: '.$exception->getMessage());

            return self::FAILURE;
        }

        $this->info("Backup konsisten dibuat: {$backup->path} ({$backup->bytes} byte)");

        return self::SUCCESS;
    }

    private function destinationPath(): ?string
    {
        $requestedPath = $this->option('path');

        if (is_string($requestedPath) && trim($requestedPath) !== '') {
            return $requestedPath;
        }

        return null;
    }
}
