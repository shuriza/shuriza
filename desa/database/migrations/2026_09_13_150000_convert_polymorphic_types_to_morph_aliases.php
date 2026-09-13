<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Polymorphic columns previously stored fully-qualified class names because no morph map
 * was registered. AppServiceProvider now enforces short aliases, so existing rows would
 * no longer match any query. Rewrite them.
 */
return new class extends Migration
{
    /**
     * @var array<string, string>
     */
    private array $columns = [
        'likes' => 'likeable_type',
        'comments' => 'commentable_type',
        'reactions' => 'reactable_type',
    ];

    /**
     * @var array<string, string>
     */
    private array $aliases = [
        'App\Models\Event' => 'event',
        'App\Models\Memory' => 'memory',
        'App\Models\Destination' => 'destination',
        'App\Models\Announcement' => 'announcement',
    ];

    public function up(): void
    {
        foreach ($this->columns as $table => $column) {
            foreach ($this->aliases as $class => $alias) {
                DB::table($table)->where($column, $class)->update([$column => $alias]);
            }
        }
    }

    public function down(): void
    {
        foreach ($this->columns as $table => $column) {
            foreach ($this->aliases as $class => $alias) {
                DB::table($table)->where($column, $alias)->update([$column => $class]);
            }
        }
    }
};
