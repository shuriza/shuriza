<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DestinationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Destination::published()->with('images');

        if ($request->has('category') && $request->category !== 'all') {
            $query->byCategory($request->category);
        }

        $destinations = $query->get();

        return Inertia::render('Public/Destinations/Index', [
            'destinations' => $destinations,
            'filter' => $request->category ?? 'all',
        ]);
    }

    public function show(Request $request, string $slug): Response
    {
        $destination = Destination::where('slug', $slug)
            ->published()
            ->with('images')
            ->firstOrFail();

        $destination->setAttribute('likes_count', $destination->likes()->count());
        $destination->setAttribute('is_liked', $destination->isLikedBy($request->user()?->id));
        $destination->setAttribute('comments', $destination->activeComments()->get()->map(fn ($comment) => [
            'id' => $comment->id,
            'content' => $comment->content,
            'created_at' => $comment->created_at,
            'user' => [
                'id' => $comment->user_id,
                'name' => $comment->user?->name ?? 'Warga Desa Muneng',
            ],
        ]));

        $relatedDestinations = Destination::published()
            ->where('id', '!=', $destination->id)
            ->where('category', $destination->category)
            ->take(3)
            ->get();

        return Inertia::render('Public/Destinations/Show', [
            'destination' => $destination,
            'relatedDestinations' => $relatedDestinations,
        ]);
    }
}
