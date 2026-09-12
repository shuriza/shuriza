<?php

namespace Tests\Feature\Console\Commands;

use Illuminate\Support\Facades\File;
use Tests\TestCase;

class VerifyReleaseReadinessTest extends TestCase
{
    private string $bundlePath;

    protected function setUp(): void
    {
        parent::setUp();

        $this->bundlePath = sys_get_temp_dir().'/antrian-release-check-'.bin2hex(random_bytes(8));
        File::ensureDirectoryExists(dirname($this->bundlePath));
        File::delete($this->bundlePath);
        $this->app->detectEnvironment(fn (): string => 'production');

        config([
            'app.debug' => false,
            'nativephp.app_id' => 'id.antrianloket.app',
            'nativephp.version' => '1.0.1',
            'nativephp.release_bundle_path' => $this->bundlePath,
            'nativephp.release_signing.azure' => [
                'tenant_id' => 'tenant',
                'client_id' => 'client',
                'client_secret' => 'secret',
                'publisher_name' => 'Publisher',
                'endpoint' => 'https://example.codesigning.azure.net/',
                'certificate_profile_name' => 'profile',
                'code_signing_account_name' => 'account',
            ],
            'nativephp.release_signing.certificate' => ['link' => null, 'password' => null],
        ]);
    }

    protected function tearDown(): void
    {
        File::delete($this->bundlePath);

        parent::tearDown();
    }

    public function test_release_is_rejected_without_a_secure_bundle(): void
    {
        $this->artisan('antrian:release-check', ['--target' => 'win'])
            ->expectsOutputToContain('Rilis ditolak')
            ->expectsOutputToContain('Secure app bundle')
            ->assertFailed();
    }

    public function test_windows_release_is_rejected_without_code_signing(): void
    {
        File::put($this->bundlePath, 'secure-bundle');
        config([
            'nativephp.release_signing.azure' => [],
            'nativephp.release_signing.certificate' => [],
        ]);

        $this->artisan('antrian:release-check', ['--target' => 'win'])
            ->expectsOutputToContain('Code signing Windows belum lengkap')
            ->assertFailed();
    }

    public function test_windows_release_passes_with_bundle_and_complete_azure_signing(): void
    {
        File::put($this->bundlePath, 'secure-bundle');

        $this->artisan('antrian:release-check', ['--target' => 'win'])
            ->expectsOutput('Prasyarat rilis win terpenuhi.')
            ->assertSuccessful();
    }

    public function test_windows_release_accepts_complete_certificate_signing(): void
    {
        File::put($this->bundlePath, 'secure-bundle');
        config([
            'nativephp.release_signing.azure' => [],
            'nativephp.release_signing.certificate' => [
                'link' => 'C:/certificates/antrian-loket.pfx',
                'password' => 'secret',
            ],
        ]);

        $this->artisan('antrian:release-check', ['--target' => 'win'])
            ->assertSuccessful();
    }

    public function test_release_is_rejected_with_default_identity_and_empty_version(): void
    {
        File::put($this->bundlePath, 'secure-bundle');
        config([
            'nativephp.app_id' => 'com.nativephp.app',
            'nativephp.version' => '',
        ]);

        $this->artisan('antrian:release-check', ['--target' => 'win'])
            ->expectsOutputToContain('NATIVEPHP_APP_ID masih memakai nilai bawaan')
            ->expectsOutputToContain('NATIVEPHP_APP_VERSION wajib diisi')
            ->assertFailed();
    }

    public function test_release_is_rejected_for_local_debug_configuration(): void
    {
        File::put($this->bundlePath, 'secure-bundle');
        $this->app->detectEnvironment(fn (): string => 'local');
        config(['app.debug' => true]);

        $this->artisan('antrian:release-check', ['--target' => 'win'])
            ->expectsOutputToContain('APP_ENV harus production')
            ->expectsOutputToContain('APP_DEBUG harus false')
            ->assertFailed();
    }
}
