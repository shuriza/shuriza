<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class GalleryPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image_path',
        'album',
        'uploaded_by',
        'status',
        'is_featured',
    ];

    /**
     * The frontend renders `image_url`; `image_path` alone is not resolvable.
     */
    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
        ];
    }

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image_path) {
            return null;
        }

        if (Str::startsWith($this->image_path, ['http://', 'https://'])) {
            return $this->image_path;
        }

        // Host-relative on purpose: an absolute URL built from APP_URL breaks whenever
        // the site is served from another host or port (dev server, tunnel, staging).
        return '/storage/'.ltrim($this->image_path, '/');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByAlbum($query, string $album)
    {
        return $query->where('album', $album);
    }
}
