<?php

namespace App\Support;

use App\Models\SyncState;
use Illuminate\Support\Str;

/**
 * Identitas perangkat untuk satu instalasi desktop.
 *
 * Dipakai sebagai `origin_device_id` pada tiket dan event. Nilainya harus
 * stabil selama umur instalasi: kalau berubah, tie-breaker resolusi konflik
 * ikut berubah dan dua device bisa saling menimpa tanpa konvergensi.
 *
 * Urutan sumber nilai:
 *   1. config('antrian.device_id') — dipakai di test dan build khusus.
 *   2. Baris `device_id` di tabel sync_state — hasil generate pertama kali.
 *   3. Generate ULID baru lalu simpan permanen.
 */
class DeviceIdentity
{
    private const KEY = 'device_id';

    private ?string $cached = null;

    public function id(): string
    {
        if ($this->cached !== null) {
            return $this->cached;
        }

        $configured = config('antrian.device_id');

        if (is_string($configured) && $configured !== '') {
            return $this->cached = $configured;
        }

        $stored = SyncState::query()->find(self::KEY);

        if ($stored !== null && is_string($stored->value) && $stored->value !== '') {
            return $this->cached = $stored->value;
        }

        $generated = (string) Str::ulid();
        $now = now();

        SyncState::query()->insertOrIgnore([
            'key' => self::KEY,
            'value' => $generated,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->cached = (string) SyncState::query()
            ->findOrFail(self::KEY)
            ->value;
    }

    public function name(): string
    {
        $configured = config('antrian.device_name');

        if (is_string($configured) && $configured !== '') {
            return $configured;
        }

        return gethostname() ?: 'loket-desktop';
    }

    /**
     * Hanya untuk test: buang nilai yang sudah di-cache di memori.
     */
    public function flush(): void
    {
        $this->cached = null;
    }
}
