<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('antrian:release-check {--target=win : Target rilis (win, mac, atau linux)}')]
#[Description('Verifikasi prasyarat keamanan sebelum membuat paket distribusi')]
class VerifyReleaseReadiness extends Command
{
    public function handle(): int
    {
        $target = strtolower((string) $this->option('target'));
        if (! in_array($target, ['win', 'mac', 'linux'], true)) {
            $this->error('Target rilis harus win, mac, atau linux.');

            return self::INVALID;
        }

        $failures = $this->commonFailures();

        if ($target === 'win' && ! $this->hasWindowsSigning()) {
            $failures[] = 'Code signing Windows belum lengkap. Konfigurasikan Azure Trusted Signing atau CSC_LINK dan CSC_KEY_PASSWORD.';
        }

        if ($target === 'mac' && ! $this->hasMacSigning()) {
            $failures[] = 'Notarization macOS belum lengkap. Konfigurasikan Apple ID, app-specific password, dan team ID.';
        }

        if ($failures !== []) {
            $this->error('Rilis ditolak: prasyarat distribusi belum terpenuhi.');

            foreach ($failures as $failure) {
                $this->line(" - {$failure}");
            }

            return self::FAILURE;
        }

        $this->info("Prasyarat rilis {$target} terpenuhi.");

        return self::SUCCESS;
    }

    /** @return array<int, string> */
    private function commonFailures(): array
    {
        $failures = [];
        $bundlePath = config('nativephp.release_bundle_path');

        if (! is_string($bundlePath) || ! is_file($bundlePath) || filesize($bundlePath) === 0) {
            $failures[] = 'Secure app bundle build/__nativephp_app_bundle tidak tersedia atau kosong.';
        }

        if (! app()->isProduction()) {
            $failures[] = 'APP_ENV harus production.';
        }

        if ((bool) config('app.debug')) {
            $failures[] = 'APP_DEBUG harus false.';
        }

        if (config('nativephp.app_id') === 'com.nativephp.app') {
            $failures[] = 'NATIVEPHP_APP_ID masih memakai nilai bawaan.';
        }

        if (! is_string(config('nativephp.version')) || trim((string) config('nativephp.version')) === '') {
            $failures[] = 'NATIVEPHP_APP_VERSION wajib diisi untuk migrasi dan upgrade desktop.';
        }

        return $failures;
    }

    private function hasWindowsSigning(): bool
    {
        $azure = config('nativephp.release_signing.azure', []);
        $azureReady = $this->allFilled($azure);

        $certificate = config('nativephp.release_signing.certificate', []);
        $certificateReady = $this->allFilled($certificate);

        return $azureReady || $certificateReady;
    }

    private function hasMacSigning(): bool
    {
        return $this->allFilled(config('nativephp.release_signing.apple', []));
    }

    /** @param array<int|string, mixed> $values */
    private function allFilled(array $values): bool
    {
        return $values !== [] && collect($values)->every(
            fn (mixed $value): bool => is_string($value) && trim($value) !== '',
        );
    }
}
