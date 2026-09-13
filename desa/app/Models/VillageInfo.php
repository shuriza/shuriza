<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VillageInfo extends Model
{
    use HasFactory;

    protected $table = 'village_info';

    protected $fillable = [
        'key',
        'value',
        'group',
        'label',
        'order',
    ];

    public function scopeByGroup($query, string $group)
    {
        return $query->where('group', $group)->orderBy('order');
    }

    public static function getValue(string $key, $default = null): ?string
    {
        $info = static::where('key', $key)->first();
        return $info ? $info->value : $default;
    }
}
