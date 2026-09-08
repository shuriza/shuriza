<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class OutboxEntry extends Model
{
    protected $fillable = [
        'event_uuid',
        'type',
        'payload',
        'synced_at',
        'attempts',
        'last_attempt_at',
        'last_error',
    ];

    protected $casts = [
        'payload' => 'array',
        'attempts' => 'int',
        'synced_at' => 'datetime',
        'last_attempt_at' => 'datetime',
    ];

    /**
     * @param  Builder<OutboxEntry>  $query
     * @return Builder<OutboxEntry>
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->whereNull('synced_at');
    }
}
