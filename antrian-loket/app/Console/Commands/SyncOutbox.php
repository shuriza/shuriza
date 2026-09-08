<?php

namespace App\Console\Commands;

use App\Services\SyncReport;
use App\Services\SyncService;
use Illuminate\Console\Command;

/**
 * Kirim antrean outbox ke pusat, dan opsional tarik perubahan balik.
 *
 * Offline BUKAN kegagalan: perintah ini tetap sukses ketika endpoint
 * belum dikonfigurasi atau jaringan sedang mati. Gagal (FAILURE) hanya
 * bila endpoint terkonfigurasi menjawab dengan kesalahan keras.
 */
class SyncOutbox extends Command
{
    protected $signature = 'antrian:sync {--pull : Tarik juga perubahan dari pusat}';

    protected $description = 'Sinkronkan antrean event lokal (outbox) ke server pusat';

    public function handle(SyncService $sync): int
    {
        if (! $sync->isConfigured()) {
            $this->info('Sinkronisasi dilewati: endpoint pusat belum dikonfigurasi (mode offline).');
            $this->line("Entri outbox menunggu: {$sync->pendingCount()}");

            return self::SUCCESS;
        }

        $push = $sync->push();
        $this->report('Kirim ke pusat', $push);

        $pull = null;

        if ($this->option('pull')) {
            $pull = $sync->pull();
            $this->report('Tarik dari pusat', $pull);
        }

        // Kesalahan keras pada endpoint yang terkonfigurasi = gagal.
        if ($push->error !== null || ($pull !== null && $pull->error !== null)) {
            return self::FAILURE;
        }

        return self::SUCCESS;
    }

    private function report(string $label, SyncReport $report): void
    {
        if ($report->error !== null) {
            $this->warn("{$label} gagal: {$report->error}");
            $this->line("Entri outbox menunggu: {$report->pendingAfter}");

            return;
        }

        $this->info("{$label} berhasil: {$report->sent} event terproses, {$report->failed} dilewati.");
        $this->line("Entri outbox menunggu: {$report->pendingAfter}");
    }
}
