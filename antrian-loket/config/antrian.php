<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Identitas perangkat
    |--------------------------------------------------------------------------
    |
    | Setiap instalasi desktop punya device_id sendiri. Nilai ini menjadi
    | bagian dari identitas tiket dan tie-breaker saat resolusi konflik.
    | Kalau kosong, DeviceIdentity akan membuat dan menyimpannya sekali
    | ke tabel sync_state.
    |
    */

    'device_id' => env('ANTRIAN_DEVICE_ID'),

    'device_name' => env('ANTRIAN_DEVICE_NAME'),

    /*
    |--------------------------------------------------------------------------
    | Sinkronisasi
    |--------------------------------------------------------------------------
    |
    | Loket bekerja penuh tanpa jaringan. Event ditulis ke outbox lokal dan
    | dikirim ke pusat saat endpoint tersedia. Endpoint kosong berarti mode
    | offline permanen: aplikasi tetap jalan, outbox terus menumpuk.
    |
    */

    'sync' => [
        'endpoint' => env('ANTRIAN_SYNC_ENDPOINT'),
        'token' => env('ANTRIAN_SYNC_TOKEN'),
        'timeout' => (int) env('ANTRIAN_SYNC_TIMEOUT', 5),
        'batch_size' => (int) env('ANTRIAN_SYNC_BATCH_SIZE', 200),
    ],

    'operations' => [
        'backup_directory' => env('ANTRIAN_BACKUP_DIRECTORY') ?: storage_path('app/backups'),
        'outbox_pending_warning' => (int) env('ANTRIAN_OUTBOX_PENDING_WARNING', 1000),
        'outbox_oldest_hours_warning' => (int) env('ANTRIAN_OUTBOX_OLDEST_HOURS_WARNING', 24),
        'outbox_attempts_warning' => (int) env('ANTRIAN_OUTBOX_ATTEMPTS_WARNING', 5),
        'outbox_synced_retention_days' => (int) env('ANTRIAN_OUTBOX_SYNCED_RETENTION_DAYS', 30),
    ],

    /*
    |--------------------------------------------------------------------------
    | Cetak tiket
    |--------------------------------------------------------------------------
    |
    | Nama printer lokal. Kosong berarti pakai printer default sistem.
    |
    */

    'printer' => env('ANTRIAN_PRINTER'),

    /*
    |--------------------------------------------------------------------------
    | Identitas kantor pada tiket cetak
    |--------------------------------------------------------------------------
    */

    'office' => [
        'name' => env('ANTRIAN_OFFICE_NAME', 'Kantor Pelayanan Publik'),
        'address' => env('ANTRIAN_OFFICE_ADDRESS', 'Kota Kediri, Jawa Timur'),
    ],

];
