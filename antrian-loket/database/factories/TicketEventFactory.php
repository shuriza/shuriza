<?php

namespace Database\Factories;

use App\Enums\TicketEventType;
use App\Models\Ticket;
use App\Models\TicketEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TicketEvent>
 */
class TicketEventFactory extends Factory
{
    protected $model = TicketEvent::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // uuid tidak diisi di sini; model membuatnya lewat HasUuids.
            'ticket_id' => Ticket::factory(),
            'type' => TicketEventType::Issued,
            'revision' => 1,
            'origin_device_id' => 'loket-dev-0001',
            'occurred_at' => now(),

            // ticket_uuid harus selalu cocok dengan tiket terkait; atribut lazy
            // dievaluasi setelah ticket_id berisi id nyata.
            'ticket_uuid' => function (array $attributes): string {
                return (string) Ticket::query()->whereKey($attributes['ticket_id'])->value('uuid');
            },

            'payload' => function (array $attributes): array {
                /** @var Ticket|null $ticket */
                $ticket = Ticket::query()->whereKey($attributes['ticket_id'])->first();

                return [
                    'ticket_uuid' => $ticket?->uuid,
                    'label' => $ticket?->label,
                    'status' => $ticket?->status->value,
                ];
            },
        ];
    }
}
