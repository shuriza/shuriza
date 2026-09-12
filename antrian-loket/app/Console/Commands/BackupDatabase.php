<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use SQLite3;

#[Signature('antrian:backup {--path= : Lokasi file backup SQLite} {--force : Timpa file tujuan jika sudah ada}')]
#[Description('Buat snapshot konsisten database SQLite yang sedang digunakan')]
class BackupDatabase extends Command
{
    public function handle(): int
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            $this->error('Backup hanya mendukung koneksi SQLite.');

            return self::FAILURE;
        }

        $sourcePath = DB::connection()->getDatabaseName();
        if ($sourcePath === ':memory:' || ! is_file($sourcePath)) {
            $this->error('Database SQLite sumber harus berupa file yang tersedia.');

            return self::FAILURE;
        }

        $destinationPath = $this->destinationPath();
        if ($this->samePath($sourcePath, $destinationPath)) {
            $this->error('File backup harus berbeda dari database sumber.');

            return self::FAILURE;
        }

        if (is_file($destinationPath) && ! $this->option('force')) {
            $this->error("Backup sudah ada: {$destinationPath}. Gunakan --force untuk menimpa.");

            return self::FAILURE;
        }

        $directory = dirname($destinationPath);
        if (! is_dir($directory) && ! mkdir($directory, 0755, true) && ! is_dir($directory)) {
            $this->error("Direktori backup tidak dapat dibuat: {$directory}");

            return self::FAILURE;
        }

        $temporaryPath = $destinationPath.'.partial-'.bin2hex(random_bytes(6));

        try {
            $source = new SQLite3($sourcePath, SQLITE3_OPEN_READONLY);
            $source->busyTimeout(5000);
            $destination = new SQLite3($temporaryPath, SQLITE3_OPEN_READWRITE | SQLITE3_OPEN_CREATE);
            $destination->busyTimeout(5000);

            if (! $source->backup($destination)) {
                throw new \RuntimeException('SQLite Online Backup API gagal membuat snapshot.');
            }

            $integrity = $destination->querySingle('PRAGMA integrity_check');
            $destination->close();
            $source->close();

            if ($integrity !== 'ok') {
                throw new \RuntimeException('Pemeriksaan integritas backup gagal.');
            }

            if (is_file($destinationPath) && ! unlink($destinationPath)) {
                throw new \RuntimeException('Backup lama tidak dapat diganti.');
            }

            if (! rename($temporaryPath, $destinationPath)) {
                throw new \RuntimeException('Backup sementara tidak dapat dipindahkan ke tujuan.');
            }
        } catch (\Throwable $exception) {
            @unlink($temporaryPath);
            $this->error('Backup gagal: '.$exception->getMessage());

            return self::FAILURE;
        }

        $this->info("Backup konsisten dibuat: {$destinationPath}");

        return self::SUCCESS;
    }

    private function destinationPath(): string
    {
        $requestedPath = $this->option('path');

        if (is_string($requestedPath) && trim($requestedPath) !== '') {
            return $requestedPath;
        }

        $directory = rtrim((string) config('antrian.operations.backup_directory'), '/\\');

        return $directory.DIRECTORY_SEPARATOR.'antrian-'.now()->format('Ymd-His').'.sqlite';
    }

    private function samePath(string $sourcePath, string $destinationPath): bool
    {
        $source = realpath($sourcePath) ?: $sourcePath;
        $destination = realpath($destinationPath) ?: $destinationPath;

        return strcasecmp(
            str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $source),
            str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $destination),
        ) === 0;
    }
}
