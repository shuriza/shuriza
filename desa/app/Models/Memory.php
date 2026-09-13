<?php

namespace App\Models;

use App\Models\Traits\Likeable;
use App\Models\Traits\Commentable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Memory extends Model
{
    use HasFactory, Likeable, Commentable;

    protected $fillable = [
        'title',
        'description',
        'type',
        'platform',
        'source_url',
        'embed_code',
        'thumbnail_url',
        'status',
        'is_pinned',
        'year',
        'category_id',
        'album_id',
        'submitted_by',
        'approved_by',
        'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'approved_at' => 'datetime',
            'is_pinned' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function ($memory) {
            if (!$memory->year) {
                $memory->year = now()->year;
            }
        });
    }

    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function album(): BelongsTo
    {
        return $this->belongsTo(MemoryAlbum::class, 'album_id');
    }

    public function reactions(): MorphMany
    {
        return $this->morphMany(Reaction::class, 'reactable');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    /**
     * Generate embed code from source URL based on platform
     */
    public function generateEmbedCode(): ?string
    {
        return match ($this->platform) {
            'youtube' => $this->getYoutubeEmbed(),
            'tiktok' => $this->getTiktokEmbed(),
            'facebook' => $this->getFacebookEmbed(),
            'instagram' => $this->getInstagramEmbed(),
            default => null,
        };
    }

    private function getYoutubeEmbed(): ?string
    {
        $videoId = $this->extractYoutubeId($this->source_url);
        if (!$videoId) return null;

        return '<iframe width="100%" height="315" src="https://www.youtube.com/embed/' . $videoId . '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    }

    private function extractYoutubeId(string $url): ?string
    {
        $patterns = [
            '/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/',
            '/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return $matches[1];
            }
        }

        return null;
    }

    private function getTiktokEmbed(): ?string
    {
        return '<blockquote class="tiktok-embed" cite="' . $this->source_url . '" data-video-id="' . $this->extractTiktokId($this->source_url) . '" style="max-width: 605px;min-width: 325px;"><section></section></blockquote><script async src="https://www.tiktok.com/embed.js"></script>';
    }

    private function extractTiktokId(string $url): ?string
    {
        if (preg_match('/\/video\/(\d+)/', $url, $matches)) {
            return $matches[1];
        }
        return null;
    }

    private function getFacebookEmbed(): ?string
    {
        $encodedUrl = urlencode($this->source_url);
        return '<iframe src="https://www.facebook.com/plugins/video.php?href=' . $encodedUrl . '&show_text=false&width=560" width="100%" height="315" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>';
    }

    private function getInstagramEmbed(): ?string
    {
        return '<blockquote class="instagram-media" data-instgrm-permalink="' . $this->source_url . '" style="max-width:540px; width:100%;"></blockquote><script async src="//www.instagram.com/embed.js"></script>';
    }
}
