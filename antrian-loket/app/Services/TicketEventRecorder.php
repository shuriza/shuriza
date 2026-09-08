<?php

namespace App\Services;

use App\Enums\TicketEventType;
use App\Models\OutboxEntry;
use App\Models\Ticket;
use App\Models\TicketEvent;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * Menulis satu perubahan tiket menjadi dua baris sekaligus:
 * `ticket_events` (riwayat lokal, sumber kebenaran untuk audit) dan
 * `outbox_entries` (antrian kirim ke pusat).
 *
 * Keduanya ditulis dalam transaksi pemanggil, jadi tidak mungkin ada event
 * lokal yang tidak punya pasangan outbox. Itu syarat supaya sinkronisasi
 * tidak pernah kehilangan perubahan yang terjadi saat offline.
 */
class TicketEventRecorder
{
    /**
     * @param  array<string, mixed>  $payload
     */
    public function record(
        Ticket $ticket,
        TicketEventType $type,
        array $payload = [],
    ): TicketEvent {
        $eventUuid = (string) Str::uuid();

        $body = array_merge([
            'ticket_uuid' => $ticket->uuid,
            'service_code' => $ticket->service?->code,
            'service_date' => $ticket->service_date->format('Y-m-d'),
            'number' => $ticket->number,
            'label' => $ticket->label,
            'status' => $ticket->status->value,
            'revision' => $ticket->revision,
            'origin_device_id' => $ticket->origin_device_id,
            'counter_uuid' => $ticket->counter?->uuid,
        ], $payload);

        return $this->persist($ticket, $type, $eventUuid, $body, now(), true);
    }

    /**
     * Menulis event dari pusat ke audit lokal tanpa membuat echo ke outbox.
     *
     * @param  array<string, mixed>  $payload
     */
    public function recordImported(
        Ticket $ticket,
        TicketEventType $type,
        array $payload,
        string $eventUuid,
        Carbon $occurredAt,
    ): TicketEvent {
        return $this->persist($ticket, $type, $eventUuid, $payload, $occurredAt, false);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function persist(
        Ticket $ticket,
        TicketEventType $type,
        string $eventUuid,
        array $payload,
        Carbon $occurredAt,
        bool $mirrorOutbox,
    ): TicketEvent {
        $event = TicketEvent::query()->create([
            'uuid' => $eventUuid,
            'ticket_uuid' => $ticket->uuid,
            'ticket_id' => $ticket->id,
            'type' => $type,
            'revision' => $ticket->revision,
            'origin_device_id' => $ticket->origin_device_id,
            'payload' => $payload,
            'occurred_at' => $occurredAt,
        ]);

        if ($mirrorOutbox) {
            OutboxEntry::query()->create([
                'event_uuid' => $eventUuid,
                'type' => $type->value,
                'payload' => array_merge($payload, [
                    'event_uuid' => $eventUuid,
                    'event_type' => $type->value,
                    'occurred_at' => $occurredAt->toIso8601String(),
                ]),
            ]);
        }

        return $event;
    }
}
