<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Destination;
use App\Models\Event;
use App\Models\Memory;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SearchController extends Controller
{
    /**
     * The search modal renders a flat, pre-grouped list, so every hit must carry its own
     * `type` and ready-to-visit `url`. Returning collections keyed by domain instead used
     * to crash the React tree (`results.reduce is not a function`).
     */
    public function search(Request $request): JsonResponse
    {
        $term = trim((string) $request->input('q', ''));

        if (Str::length($term) < 2) {
            return response()->json(['results' => [], 'total' => 0]);
        }

        $like = '%'.$term.'%';

        $results = collect()
            ->concat(
                Event::published()
                    ->where(fn ($query) => $query->where('title', 'like', $like)->orWhere('description', 'like', $like))
                    ->latest('event_date')
                    ->take(5)
                    ->get(['id', 'title', 'slug', 'description', 'location'])
                    ->map(fn (Event $event) => [
                        'id' => $event->id,
                        'title' => $event->title,
                        'type' => 'event',
                        'url' => '/acara/'.$event->slug,
                        'excerpt' => $event->location ?: $this->excerpt($event->description),
                    ])
            )
            ->concat(
                Memory::approved()
                    ->where(fn ($query) => $query->where('title', 'like', $like)->orWhere('description', 'like', $like))
                    ->latest()
                    ->take(5)
                    ->get(['id', 'title', 'description', 'platform'])
                    ->map(fn (Memory $memory) => [
                        'id' => $memory->id,
                        'title' => $memory->title,
                        'type' => 'kenangan',
                        'url' => '/kenangan/'.$memory->id,
                        'excerpt' => $this->excerpt($memory->description),
                    ])
            )
            ->concat(
                Destination::published()
                    ->where(fn ($query) => $query->where('name', 'like', $like)->orWhere('description', 'like', $like))
                    ->take(5)
                    ->get(['id', 'name', 'slug', 'description', 'category'])
                    ->map(fn (Destination $destination) => [
                        'id' => $destination->id,
                        'title' => $destination->name,
                        'type' => 'destinasi',
                        'url' => '/destinasi/'.$destination->slug,
                        'excerpt' => $this->excerpt($destination->description),
                    ])
            )
            ->concat(
                Announcement::published()
                    ->where(fn ($query) => $query->where('title', 'like', $like)->orWhere('content', 'like', $like))
                    ->latest('published_at')
                    ->take(5)
                    ->get(['id', 'title', 'slug', 'excerpt', 'content'])
                    ->map(fn (Announcement $announcement) => [
                        'id' => $announcement->id,
                        'title' => $announcement->title,
                        'type' => 'berita',
                        'url' => '/berita/'.$announcement->slug,
                        'excerpt' => $this->excerpt($announcement->excerpt ?: $announcement->content),
                    ])
            )
            ->concat(
                Product::published()
                    ->where(fn ($query) => $query->where('name', 'like', $like)->orWhere('description', 'like', $like))
                    ->take(5)
                    ->get(['id', 'name', 'slug', 'description', 'category'])
                    ->map(fn (Product $product) => [
                        'id' => $product->id,
                        'title' => $product->name,
                        'type' => 'umkm',
                        'url' => '/umkm/'.$product->slug,
                        'excerpt' => $this->excerpt($product->description),
                    ])
            )
            ->values();

        return response()->json([
            'results' => $results,
            'total' => $results->count(),
        ]);
    }

    /**
     * Descriptions may hold rich text from the admin editor.
     */
    private function excerpt(?string $text, int $limit = 90): ?string
    {
        if (! $text) {
            return null;
        }

        return Str::limit(trim(preg_replace('/\s+/', ' ', strip_tags($text))), $limit);
    }
}
