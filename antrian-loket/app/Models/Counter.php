<?php

namespace App\Models;

use App\Enums\TicketStatus;
use Database\Factories\CounterFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Counter extends Model
{
    /** @use HasFactory<CounterFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'uuid',
        'name',
        'service_id',
        'operator_name',
        'is_open',
    ];

    protected $casts = [
        'is_open' => 'bool',
    ];

    /** @return array<int, string> */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /** @return BelongsTo<Service, $this> */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /** @return HasMany<Ticket, $this> */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Tiket yang sedang dipanggil di loket ini, kalau ada.
     */
    public function currentTicket(): ?Ticket
    {
        return $this->tickets()
            ->where('status', TicketStatus::Dipanggil->value)
            ->orderByDesc('called_at')
            ->first();
    }
}
