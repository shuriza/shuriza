<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(): Response
    {
        $announcements = Announcement::published()
            ->with('user:id,name')
            ->orderByDesc('is_pinned')
            ->latest('published_at')
            ->paginate(12);

        return Inertia::render('Public/Announcements/Index', [
            'announcements' => $announcements,
        ]);
    }

    public function show(string $slug): Response
    {
        $announcement = Announcement::published()
            ->where('slug', $slug)
            ->with('user:id,name')
            ->firstOrFail();

        $related = Announcement::published()
            ->where('id', '!=', $announcement->id)
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('Public/Announcements/Show', [
            'announcement' => $announcement,
            'related' => $related,
        ]);
    }
}
