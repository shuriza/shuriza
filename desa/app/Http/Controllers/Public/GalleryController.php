<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\GalleryPhoto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = GalleryPhoto::published()->latest();

        if ($request->filled('album')) {
            $query->byAlbum($request->album);
        }

        $photos = $query->paginate(20)->withQueryString();

        $albums = GalleryPhoto::published()
            ->whereNotNull('album')
            ->distinct()
            ->pluck('album');

        return Inertia::render('Public/Gallery/Index', [
            'photos' => $photos,
            'albums' => $albums,
            'filter' => $request->album ?? '',
        ]);
    }
}
