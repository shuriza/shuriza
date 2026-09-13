<?php

namespace Tests\Feature\Console\Commands;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use SQLite3;
use Tests\TestCase;

class BackupDatabaseTest extends TestCase
{
    private string $sourcePath;

    private string $backupPath;

    protected function setUp(): void
    {
        parent::setUp();

        $directory = sys_get_temp_dir().'/antrian-backup-'.bin2hex(random_bytes(8));
        File::ensureDirectoryExists($directory);
        $this->sourcePath = $directory.'/source.sqlite';
        $this->backupPath = $directory.'/backup.sqlite';

        config([
            'database.default' => 'backup_test',
            'antrian.operations.backup_directory' => $directory,
            'database.connections.backup_test' => [
                'driver' => 'sqlite',
                'database' => $this->sourcePath,
                'prefix' => '',
                'foreign_key_constraints' => true,
            ],
        ]);
        File::put($this->sourcePath, '');
        DB::purge('backup_test');
        Artisan::call('migrate', ['--database' => 'backup_test', '--force' => true]);
    }

    protected function tearDown(): void
    {
        DB::purge('backup_test');
        File::deleteDirectory(dirname($this->sourcePath));

        parent::tearDown();
    }

    public function test_backup_captures_committed_wal_data_and_is_integral(): void
    {
        DB::connection()->statement('PRAGMA journal_mode=WAL');
        DB::connection()->table('sync_state')->insert(['key' => 'proof', 'value' => 'committed']);

        $this->artisan('antrian:backup', ['--path' => $this->backupPath])
            ->assertSuccessful();

        $backup = new SQLite3($this->backupPath, SQLITE3_OPEN_READONLY);
        $this->assertSame('ok', $backup->querySingle('PRAGMA integrity_check'));
        $this->assertSame('committed', $backup->querySingle("SELECT value FROM sync_state WHERE key = 'proof'"));
        $backup->close();
    }

    public function test_backup_does_not_overwrite_an_existing_file_without_force(): void
    {
        File::put($this->backupPath, 'jangan ditimpa');

        $this->artisan('antrian:backup', ['--path' => $this->backupPath])
            ->expectsOutputToContain('Gunakan --force')
            ->assertFailed();

        $this->assertSame('jangan ditimpa', File::get($this->backupPath));
    }

    public function test_backup_replaces_an_existing_file_with_force(): void
    {
        File::put($this->backupPath, 'lama');

        $this->artisan('antrian:backup', ['--path' => $this->backupPath, '--force' => true])
            ->assertSuccessful();

        $backup = new SQLite3($this->backupPath, SQLITE3_OPEN_READONLY);
        $this->assertSame('ok', $backup->querySingle('PRAGMA integrity_check'));
        $backup->close();
    }

    public function test_backup_never_overwrites_the_source_database(): void
    {
        $this->artisan('antrian:backup', ['--path' => $this->sourcePath, '--force' => true])
            ->expectsOutputToContain('harus berbeda dari database sumber')
            ->assertFailed();

        $this->assertTrue(DB::connection()->getSchemaBuilder()->hasTable('sync_state'));
    }

    public function test_valid_backup_passes_schema_and_integrity_validation(): void
    {
        $this->artisan('antrian:backup', ['--path' => $this->backupPath])
            ->assertSuccessful();

        $this->artisan('antrian:backup-validate', ['path' => $this->backupPath])
            ->expectsOutputToContain('Backup valid')
            ->assertSuccessful();
    }

    public function test_unrelated_sqlite_database_is_rejected_as_a_backup(): void
    {
        $unrelatedPath = dirname($this->sourcePath).'/unrelated.sqlite';
        $database = new SQLite3($unrelatedPath);
        $database->exec('CREATE TABLE unrelated (id INTEGER PRIMARY KEY)');
        $database->close();

        $this->artisan('antrian:backup-validate', ['path' => $unrelatedPath])
            ->expectsOutputToContain('Tabel wajib hilang')
            ->assertFailed();
    }

    public function test_restore_requires_confirmation_without_changing_the_database(): void
    {
        DB::connection()->table('sync_state')->insert(['key' => 'proof', 'value' => 'current']);
        $this->artisan('antrian:backup', ['--path' => $this->backupPath])->assertSuccessful();
        DB::connection()->table('sync_state')->where('key', 'proof')->update(['value' => 'changed']);

        $this->artisan('antrian:restore', ['path' => $this->backupPath])
            ->expectsOutputToContain('--confirm=RESTORE')
            ->assertFailed();

        $this->assertSame('changed', DB::connection()->table('sync_state')->where('key', 'proof')->value('value'));
    }

    public function test_restore_replaces_database_and_keeps_a_pre_restore_backup(): void
    {
        DB::connection()->table('sync_state')->insert(['key' => 'proof', 'value' => 'backup-value']);
        $this->artisan('antrian:backup', ['--path' => $this->backupPath])->assertSuccessful();
        DB::connection()->table('sync_state')->where('key', 'proof')->update(['value' => 'current-value']);

        $this->artisan('antrian:restore', [
            'path' => $this->backupPath,
            '--confirm' => 'RESTORE',
        ])->assertSuccessful();

        $this->assertSame('backup-value', DB::connection()->table('sync_state')->where('key', 'proof')->value('value'));
        $preRestoreBackups = File::glob(dirname($this->sourcePath).'/pre-restore-*.sqlite');
        $this->assertCount(1, $preRestoreBackups);

        $preRestore = new SQLite3($preRestoreBackups[0], SQLITE3_OPEN_READONLY);
        $this->assertSame('current-value', $preRestore->querySingle("SELECT value FROM sync_state WHERE key = 'proof'"));
        $preRestore->close();
    }
}
