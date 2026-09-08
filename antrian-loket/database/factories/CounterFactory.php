<?php

namespace Database\Factories;

use App\Models\Counter;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Counter>
 */
class CounterFactory extends Factory
{
    protected $model = Counter::class;

    /**
     * Nama petugas loket Indonesia.
     *
     * @var array<int, string>
     */
    protected static array $operatorNames = [
        'Budi Santoso',
        'Siti Rahayu',
        'Agus Wijaya',
        'Dewi Lestari',
        'Rina Marlina',
        'Joko Prasetyo',
        'Nur Aini',
        'Hendra Gunawan',
    ];

    /**
     * Penomoran loket berurutan; `fake()->unique()` bisa kehabisan ruang dan
     * melempar OverflowException pada rentang kecil.
     */
    protected static int $sequence = 0;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // uuid tidak diisi di sini; model membuatnya lewat HasUuids.
            'name' => 'Loket '.(++static::$sequence),
            'service_id' => Service::factory(),
            'operator_name' => fake()->randomElement(static::$operatorNames),
            'is_open' => true,
        ];
    }

    /**
     * Loket yang sedang tutup.
     */
    public function closed(): static
    {
        return $this->state(fn () => [
            'is_open' => false,
        ]);
    }
}
