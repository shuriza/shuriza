<?php

namespace App\Models;

use Database\Factories\ServiceFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    /** @use HasFactory<ServiceFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'uuid',
        'code',
        'name',
        'estimated_minutes',
        'is_active',
    ];

    protected $casts = [
        'estimated_minutes' => 'int',
        'is_active' => 'bool',
    ];

    /**
     * HasUuids would otherwise treat the primary key as a UUID. Here the
     * primary key stays an auto-increment id; only `uuid` is generated.
     *
     * @return array<int, string>
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /** @return HasMany<Ticket, $this> */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    /** @return HasMany<Counter, $this> */
    public function counters(): HasMany
    {
        return $this->hasMany(Counter::class);
    }
}
