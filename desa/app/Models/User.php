<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'phone',
        'address',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isWarga(): bool
    {
        return $this->role === 'warga';
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function memories(): HasMany
    {
        return $this->hasMany(Memory::class, 'submitted_by');
    }

    public function approvedMemories(): HasMany
    {
        return $this->hasMany(Memory::class, 'approved_by');
    }

    public function destinations(): HasMany
    {
        return $this->hasMany(Destination::class);
    }
}
