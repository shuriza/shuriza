<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Memory;
use App\Models\Destination;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q', '');

        if (strlen($query) < 2) {
            return response()->json(['results' => []]);
        }

        $events = Event::published()
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%");
            })
            ->take(5)
            ->get(['id', 'title', 'slug', 'event_date', 'location']);

        $memories = Memory::approved()
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%");
            })
            ->take(5)
            ->get(['id', 'title', 'platform', 'type']);

        $destinations = Destination::published()
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%");
            })
            ->take(5)
            ->get(['id', 'name', 'slug', 'category']);

        return response()->json([
            'results' => [
                'events' => $events,
                'memories' => $memories,
                'destinations' => $destinations,
            ],
            'total' => $events->count() + $memories->count() + $destinations->count(),
        ]);
    }
}
