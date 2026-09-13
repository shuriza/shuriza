<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'email', 'subject', 'message', 'status', 'ip_address', 'read_at',
    ];

    protected function casts(): array
    {
        return ['read_at' => 'datetime'];
    }

    public function scopeUnread($query)
    {
        return $query->where('status', 'unread');
    }

    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    public function markAsRead(): void
    {
        if ($this->status === 'unread') {
            $this->update(['status' => 'read', 'read_at' => now()]);
        }
    }
}
