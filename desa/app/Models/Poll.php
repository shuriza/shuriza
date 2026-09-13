<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Poll extends Model
{
    protected $fillable = ['question', 'options', 'votes', 'is_active', 'ends_at', 'user_id'];

    protected function casts(): array
    {
        return [
            'options' => 'array',
            'votes' => 'array',
            'is_active' => 'boolean',
            'ends_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pollVotes(): HasMany
    {
        return $this->hasMany(PollVote::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('ends_at')->orWhere('ends_at', '>', now());
            });
    }

    public function totalVotes(): int
    {
        return $this->pollVotes()->count();
    }

    public function getVoteCounts(): array
    {
        $counts = [];
        foreach ($this->options as $index => $option) {
            $counts[$index] = $this->pollVotes()->where('option_index', $index)->count();
        }
        return $counts;
    }

    public function hasVoted(string $sessionId): bool
    {
        return $this->pollVotes()->where('session_id', $sessionId)->exists();
    }

    public function getUserVote(string $sessionId): ?int
    {
        $vote = $this->pollVotes()->where('session_id', $sessionId)->first();
        return $vote ? $vote->option_index : null;
    }
}
