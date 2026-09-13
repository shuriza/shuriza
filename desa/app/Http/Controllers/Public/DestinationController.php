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

    public function show(string $slug): Response
    {
        $destination = Destination::where('slug', $slug)
            ->published()
            ->with('images')
            ->firstOrFail();

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
