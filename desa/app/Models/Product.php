<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'price_note',
        'category',
        'image',
        'contact_name',
        'contact_phone',
        'contact_whatsapp',
        'is_available',
        'status',
        'user_id',
        'submitted_by_name',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:0',
            'is_available' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}
