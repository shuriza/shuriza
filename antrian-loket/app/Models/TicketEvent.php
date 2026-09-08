<?php

namespace App\Models;

use App\Enums\TicketEventType;
use Database\Factories\TicketEventFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketEvent extends Model
{
    /** @use HasFactory<TicketEventFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'uuid',
        'ticket_id',
        'ticket_uuid',
        'type',
        'revision',
        'origin_device_id',
        'payload',
        'occurred_at',
    ];

    protected $casts = [
        'type' => TicketEventType::class,
        'payload' => 'array',
        'occurred_at' => 'datetime',
    ];

    /** @return array<int, string> */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /** @return BelongsTo<Ticket, $this> */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }
}
