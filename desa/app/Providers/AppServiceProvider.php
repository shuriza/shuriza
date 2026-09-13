<?php

namespace App\Providers;

use App\Models\Announcement;
use App\Models\Destination;
use App\Models\Event;
use App\Models\Memory;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Store short aliases in `*_type` columns instead of fully-qualified class names,
        // so likes/comments/reactions survive a namespace or class rename. `enforceMorphMap`
        // makes an unmapped morph target fail loudly rather than silently writing a FQCN.
        Relation::enforceMorphMap([
            'event' => Event::class,
            'memory' => Memory::class,
            'destination' => Destination::class,
            'announcement' => Announcement::class,
        ]);
    }
}
