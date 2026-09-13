<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Event;
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

    public function show(string $slug): Response
    {
        $event = Event::where('slug', $slug)
            ->published()
            ->with('category')
            ->firstOrFail();

        $relatedEvents = Event::published()
            ->where('id', '!=', $event->id)
            ->orderBy('event_date', 'desc')
            ->take(3)
            ->get();

        return Inertia::render('Public/Events/Show', [
            'event' => $event,
            'relatedEvents' => $relatedEvents,
        ]);
    }
}
