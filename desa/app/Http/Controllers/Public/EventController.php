<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(): Response
    {
        $upcomingEvents = Event::published()
            ->upcoming()
            ->orderBy('event_date')
            ->with('category')
            ->get();

        $pastEvents = Event::published()
            ->past()
            ->orderBy('event_date', 'desc')
            ->with('category')
            ->paginate(9);

        return Inertia::render('Public/Events/Index', [
            'upcomingEvents' => $upcomingEvents,
            'pastEvents' => $pastEvents,
        ]);
    }

    public function show(Request $request, string $slug): Response
    {
        $event = Event::where('slug', $slug)
            ->published()
            ->with('category')
            ->firstOrFail();

        $event->setAttribute('likes_count', $event->likes()->count());
        $event->setAttribute('is_liked', $event->isLikedBy($request->user()?->id));
        $event->setAttribute('comments', $event->activeComments()->get()->map(fn ($comment) => [
            'id' => $comment->id,
            'content' => $comment->content,
            'created_at' => $comment->created_at,
            'user' => [
                'id' => $comment->user_id,
                'name' => $comment->user?->name ?? 'Warga Desa Muneng',
            ],
        ]));

        $relatedEvents = Event::published()
            ->where('id', '!=', $event->id)
            ->with('category:id,name,slug')
            ->orderBy('event_date', 'desc')
            ->take(3)
            ->get();

        return Inertia::render('Public/Events/Show', [
            'event' => $event,
            'relatedEvents' => $relatedEvents,
        ]);
    }
}
