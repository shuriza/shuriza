<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use SQLite3;

final readonly class DatabaseBackupReport
{
    public function __construct(
        public string $path,
        public int $bytes,
    ) {}
}

final readonly class DatabaseValidationReport
{
    /** @param array<int, string> $errors */
    public function __construct(
        public string $path,
        public bool $valid,
        public array $errors,
        public int $bytes,
    ) {}
}

final readonly class DatabaseRestoreReport
{
    public function __construct(
        public string $sourcePath,
        public string $preRestoreBackupPath,
    ) {}
}

class DatabaseMaintenanceService
{
    private const REQUIRED_TABLES = [
        'counters',
        'migrations',
        'outbox_entries',
        'services',
        'sync_state',
        'ticket_events',
        'tickets',
    ];

    public function backup(?string $destinationPath = null, bool $overwrite = false): DatabaseBackupReport
    {
        $sourcePath = $this->databasePath();
        $destinationPath ??= $this->newBackupPath('antrian');

        if ($this->samePath($sourcePath, $destinationPath)) {
            throw new \RuntimeException('File backup harus berbeda dari database sumber.');
        }

        if (is_file($destinationPath) && ! $overwrite) {
            throw new \RuntimeException("Backup sudah ada: {$destinationPath}. Gunakan --force untuk menimpa.");
        }

        $this->ensureDirectory(dirname($destinationPath));
        $temporaryPath = $destinationPath.'.partial-'.bin2hex(random_bytes(6));
        $previousPath = null;

        try {
            $this->copyDatabase($sourcePath, $temporaryPath);
            $validation = $this->validate($temporaryPath);

            if (! $validation->valid) {
                throw new \RuntimeException('Pemeriksaan backup gagal: '.implode(' ', $validation->errors));
            }

            if (is_file($destinationPath)) {
                $previousPath = $destinationPath.'.previous-'.bin2hex(random_bytes(6));
                if (! rename($destinationPath, $previousPath)) {
                    throw new \RuntimeException('Backup lama tidak dapat diamankan sebelum diganti.');
                }
            }

            if (! rename($temporaryPath, $destinationPath)) {
                throw new \RuntimeException('Backup sementara tidak dapat dipindahkan ke tujuan.');
            }

            if ($previousPath !== null) {
                @unlink($previousPath);
            }
        } catch (\Throwable $exception) {
            @unlink($temporaryPath);

            if ($previousPath !== null && is_file($previousPath) && ! is_file($destinationPath)) {
                @rename($previousPath, $destinationPath);
            }

            throw $exception;
        }

        return new DatabaseBackupReport($destinationPath, (int) filesize($destinationPath));
    }

    public function validate(string $path): DatabaseValidationReport
    {
        $errors = [];

        if (! is_file($path)) {
            return new DatabaseValidationReport($path, false, ['File database tidak ditemukan.'], 0);
        }

        try {
            $database = $this->open($path, SQLITE3_OPEN_READONLY);
            $integrity = $database->querySingle('PRAGMA integrity_check');

            if ($integrity !== 'ok') {
                $errors[] = 'PRAGMA integrity_check tidak menghasilkan ok.';
            }

            $tables = [];
            $result = $database->query("SELECT name FROM sqlite_master WHERE type = 'table'");
            while (($row = $result->fetchArray(SQLITE3_ASSOC)) !== false) {
                $tables[] = $row['name'];
            }
            $result->finalize();
            $database->close();

            $missingTables = array_values(array_diff(self::REQUIRED_TABLES, $tables));
            if ($missingTables !== []) {
                $errors[] = 'Tabel wajib hilang: '.implode(', ', $missingTables).'.';
            }
        } catch (\Throwable $exception) {
            $errors[] = 'Database tidak dapat dibaca: '.$exception->getMessage();
        }

        return new DatabaseValidationReport($path, $errors === [], $errors, (int) filesize($path));
    }

    public function restore(string $backupPath, string $confirmation): DatabaseRestoreReport
    {
        if ($confirmation !== 'RESTORE') {
            throw new \RuntimeException('Restore memerlukan --confirm=RESTORE.');
        }

        if ((bool) config('nativephp-internal.running')) {
            throw new \RuntimeException('Tutup aplikasi desktop sebelum menjalankan restore dari terminal.');
        }

        $databasePath = $this->databasePath();
        if ($this->samePath($backupPath, $databasePath)) {
            throw new \RuntimeException('File restore harus berbeda dari database aktif.');
        }

        $validation = $this->validate($backupPath);
        if (! $validation->valid) {
            throw new \RuntimeException('Backup tidak valid: '.implode(' ', $validation->errors));
        }

        $preRestoreBackup = $this->backup($this->newBackupPath('pre-restore'));

        DB::purge();

        try {
            $this->copyDatabase($backupPath, $databasePath);
            $restored = $this->validate($databasePath);

            if (! $restored->valid) {
                throw new \RuntimeException('Database hasil restore gagal validasi.');
            }
        } catch (\Throwable $exception) {
            $this->copyDatabase($preRestoreBackup->path, $databasePath);

            throw $exception;
        } finally {
            DB::reconnect();
        }

        return new DatabaseRestoreReport($backupPath, $preRestoreBackup->path);
    }

    private function databasePath(): string
    {
        $connection = DB::connection();
        if ($connection->getDriverName() !== 'sqlite') {
            throw new \RuntimeException('Operasi database hanya mendukung koneksi SQLite.');
        }

        $path = $connection->getDatabaseName();
        if ($path === ':memory:' || ! is_file($path)) {
            throw new \RuntimeException('Database SQLite sumber harus berupa file yang tersedia.');
        }

        return $path;
    }

    private function copyDatabase(string $sourcePath, string $destinationPath): void
    {
        $source = $this->open($sourcePath, SQLITE3_OPEN_READONLY);
        $destination = $this->open($destinationPath, SQLITE3_OPEN_READWRITE | SQLITE3_OPEN_CREATE);

        try {
            if (! $source->backup($destination)) {
                throw new \RuntimeException('SQLite Online Backup API gagal membuat snapshot.');
            }
        } finally {
            $destination->close();
            $source->close();
        }
    }

    private function open(string $path, int $flags): SQLite3
    {
        $database = new SQLite3($path, $flags);
        $database->enableExceptions(true);
        $database->busyTimeout(5000);

        return $database;
    }

    private function newBackupPath(string $prefix): string
    {
        $directory = rtrim((string) config('antrian.operations.backup_directory'), '/\\');

        return $directory.DIRECTORY_SEPARATOR.$prefix.'-'.now()->format('Ymd-His').'-'.bin2hex(random_bytes(3)).'.sqlite';
    }

    private function ensureDirectory(string $directory): void
    {
        if (! is_dir($directory) && ! mkdir($directory, 0755, true) && ! is_dir($directory)) {
            throw new \RuntimeException("Direktori backup tidak dapat dibuat: {$directory}");
        }
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
