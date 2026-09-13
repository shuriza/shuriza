<?php

namespace App\Models;

use App\Models\Traits\Likeable;
use App\Models\Traits\Commentable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    use HasFactory, Likeable, Commentable;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'content',
        'event_date',
        'end_date',
        'time',
        'location',
        'image',
        'status',
        'category_id',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeUpcoming($query)
    {
        return $query->whereDate('event_date', '>=', today());
    }

    public function scopePast($query)
    {
        return $query->whereDate('event_date', '<', today());
    }
}
