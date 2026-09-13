<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\VillageInfo;
use Inertia\Inertia;
use Inertia\Response;

class MapController extends Controller
{
    public function index(): Response
    {
        $destinations = Destination::published()
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get(['id', 'name', 'slug', 'description', 'category', 'latitude', 'longitude', 'address']);

        $center = [
            'lat' => (float) VillageInfo::getValue('latitude', '-7.62139'),
            'lng' => (float) VillageInfo::getValue('longitude', '112.11194'),
        ];

        return Inertia::render('Public/Map', [
            'destinations' => $destinations,
            'center' => $center,
        ]);
    }
}
