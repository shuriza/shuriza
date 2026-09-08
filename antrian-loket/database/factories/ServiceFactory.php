<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    protected $model = Service::class;

    /**
     * Nama layanan publik Indonesia yang realistis, dipetakan ke kode satu huruf.
     *
     * @var array<string, string>
     */
    protected static array $serviceNames = [
        'A' => 'Perizinan Usaha (NIB/OSS)',
        'B' => 'Izin Mendirikan Bangunan',
        'C' => 'Legalisasi & Surat Keterangan',
        'D' => 'Pengaduan & Konsultasi',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $code = fake()->randomElement(array_keys(static::$serviceNames));

        return [
            // uuid tidak diisi di sini; model membuatnya lewat HasUuids.
            'code' => $code,
            'name' => static::$serviceNames[$code],
            'estimated_minutes' => fake()->numberBetween(4, 15),
            'is_active' => true,
        ];
    }

    /**
     * Pakai kode tertentu beserta nama layanan bawaannya.
     */
    public function code(string $code): static
    {
        return $this->state(fn (array $attributes) => [
            'code' => $code,
            'name' => static::$serviceNames[$code] ?? $attributes['name'],
        ]);
    }

    /**
     * Layanan nonaktif.
     */
    public function inactive(): static
    {
        return $this->state(fn () => [
            'is_active' => false,
        ]);
    }
}
