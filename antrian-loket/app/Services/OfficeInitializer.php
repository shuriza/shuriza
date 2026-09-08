<?php

namespace App\Services;

use App\Models\Counter;
use App\Models\Service;
use Illuminate\Support\Facades\DB;

final class OfficeInitializer
{
    private const SERVICES = [
        ['uuid' => '00000000-0000-4000-8000-000000000001', 'code' => 'A', 'name' => 'Perizinan Usaha (NIB/OSS)', 'estimated_minutes' => 12],
        ['uuid' => '00000000-0000-4000-8000-000000000002', 'code' => 'B', 'name' => 'Izin Mendirikan Bangunan', 'estimated_minutes' => 15],
        ['uuid' => '00000000-0000-4000-8000-000000000003', 'code' => 'C', 'name' => 'Legalisasi & Surat Keterangan', 'estimated_minutes' => 5],
        ['uuid' => '00000000-0000-4000-8000-000000000004', 'code' => 'D', 'name' => 'Pengaduan & Konsultasi', 'estimated_minutes' => 8],
    ];

    private const COUNTERS = [
        ['uuid' => '00000000-0000-4000-8001-000000000001', 'name' => 'Loket 1', 'service' => 'A', 'operator_name' => 'Budi Santoso'],
        ['uuid' => '00000000-0000-4000-8001-000000000002', 'name' => 'Loket 2', 'service' => 'B', 'operator_name' => 'Siti Rahayu'],
        ['uuid' => '00000000-0000-4000-8001-000000000003', 'name' => 'Loket 3', 'service' => 'C', 'operator_name' => 'Agus Wijaya'],
        ['uuid' => '00000000-0000-4000-8001-000000000004', 'name' => 'Loket 4', 'service' => 'D', 'operator_name' => 'Dewi Lestari'],
    ];

    /**
     * @return array{services: array<string, Service>, counters: array<string, Counter>}
     */
    public function initialize(bool $overwriteExisting = false): array
    {
        return DB::transaction(function () use ($overwriteExisting): array {
            if (! $overwriteExisting && (Service::query()->exists() || Counter::query()->exists())) {
                return ['services' => [], 'counters' => []];
            }

            $services = [];

            foreach (self::SERVICES as $definition) {
                $service = Service::query()->firstOrNew(['code' => $definition['code']]);

                if (! $service->exists) {
                    $service->uuid = $definition['uuid'];
                }

                $service->fill([
                    'name' => $definition['name'],
                    'estimated_minutes' => $definition['estimated_minutes'],
                    'is_active' => true,
                ])->save();

                $services[$definition['code']] = $service;
            }

            $counters = [];

            foreach (self::COUNTERS as $definition) {
                $counter = Counter::query()->firstOrNew(['name' => $definition['name']]);

                if (! $counter->exists) {
                    $counter->uuid = $definition['uuid'];
                }

                $counter->fill([
                    'service_id' => $services[$definition['service']]->id,
                    'operator_name' => $definition['operator_name'],
                    'is_open' => true,
                ])->save();

                $counters[$definition['service']] = $counter;
            }

            return ['services' => $services, 'counters' => $counters];
        });
    }
}
