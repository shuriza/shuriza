<?php

namespace Database\Factories;

use App\Enums\TicketStatus;
use App\Models\Service;
use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ticket>
 */
class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // uuid tidak diisi di sini; model membuatnya lewat HasUuids.
            'service_id' => Service::factory(),
            'counter_id' => null,
            'service_date' => now()->toDateString(),
            'number' => fake()->unique()->numberBetween(1, 999),
            'status' => TicketStatus::Menunggu,
            'issued_at' => now(),
            'called_at' => null,
            'finished_at' => null,
            'revision' => 1,
            'origin_device_id' => 'loket-dev-0001',

            // Label bergantung pada kode layanan, yang baru diketahui setelah
            // relasi terselesaikan. Closure atribut lazy menerima atribut lain
            // yang sudah dievaluasi, jadi service_id di sini sudah berupa id.
            'label' => function (array $attributes): string {
                $code = Service::query()->whereKey($attributes['service_id'])->value('code') ?? 'A';

                return $code.str_pad((string) $attributes['number'], 3, '0', STR_PAD_LEFT);
            },
        ];
    }

    /**
     * Tiket yang sedang dipanggil.
     */
    public function called(): static
    {
        return $this->state(fn (): array => [
            'status' => TicketStatus::Dipanggil,
            'called_at' => now(),
            'revision' => 2,
        ]);
    }

    /**
     * Tiket yang sudah selesai dilayani.
     */
    public function finished(): static
    {
        return $this->state(fn (): array => [
            'status' => TicketStatus::Selesai,
            'called_at' => now()->subMinutes(5),
            'finished_at' => now(),
            'revision' => 3,
        ]);
    }

    /**
     * Tiket yang dilewati.
     */
    public function skipped(): static
    {
        return $this->state(fn (): array => [
            'status' => TicketStatus::Dilewati,
            'called_at' => now()->subMinutes(5),
            'finished_at' => now(),
            'revision' => 3,
        ]);
    }
}
