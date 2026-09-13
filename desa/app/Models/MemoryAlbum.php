<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MemoryAlbum extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'cover_image', 'order'];

    public function memories(): HasMany
    {
        return $this->hasMany(Memory::class, 'album_id');
    }

    public function memoriesCount(): int
    {
        return $this->memories()->approved()->count();
    }
}
