<?php

namespace App\Models;

use App\Enums\TicketStatus;
use Database\Factories\TicketFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class Ticket extends Model
{
    /** @use HasFactory<TicketFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'uuid',
        'service_id',
        'counter_id',
        'service_date',
        'number',
        'label',
        'status',
        'issued_at',
        'called_at',
        'finished_at',
        'revision',
        'origin_device_id',
    ];

    protected $casts = [
        'number' => 'int',
        'revision' => 'int',
        'status' => TicketStatus::class,
        'issued_at' => 'datetime',
        'called_at' => 'datetime',
        'finished_at' => 'datetime',
    ];

    /** @return array<int, string> */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /**
     * `service_date` adalah tanggal murni, bukan timestamp.
     *
     * Cast `date` bawaan Laravel menyimpan nilainya sebagai
     * "Y-m-d H:i:s", sehingga `where('service_date', '2026-09-06')`
     * tidak pernah cocok dan alokasi nomor antrian selalu mulai dari 1.
     * Akibatnya UNIQUE (service_id, service_date, number) langsung
     * dilanggar. Mutator ini memaksa kolom hanya menyimpan "Y-m-d".
     *
     * @return Attribute<Carbon, string>
     */
    protected function serviceDate(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value): Carbon => Carbon::parse($value)->startOfDay(),
            set: fn (mixed $value): string => Carbon::parse(
                $value instanceof \DateTimeInterface ? $value : (string) $value
            )->toDateString(),
        );
    }

    /** @return BelongsTo<Service, $this> */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /** @return BelongsTo<Counter, $this> */
    public function counter(): BelongsTo
    {
        return $this->belongsTo(Counter::class);
    }

    /** @return HasMany<TicketEvent, $this> */
    public function events(): HasMany
    {
        return $this->hasMany(TicketEvent::class);
    }

    /**
     * @param  Builder<Ticket>  $query
     * @return Builder<Ticket>
     */
    public function scopeWaiting(Builder $query): Builder
    {
        return $query->where('status', TicketStatus::Menunggu->value);
    }

    /**
     * @param  Builder<Ticket>  $query
     * @return Builder<Ticket>
     */
    public function scopeForDate(Builder $query, \DateTimeInterface|string $date): Builder
    {
        $value = $date instanceof \DateTimeInterface
            ? $date->format('Y-m-d')
            : $date;

        return $query->where('service_date', $value);
    }
}
