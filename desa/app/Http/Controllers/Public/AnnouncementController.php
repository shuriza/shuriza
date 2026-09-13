<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/Announcements/Index', [
            'announcements' => Announcement::published()
                ->with('user:id,name')
                ->orderByDesc('is_pinned')
                ->latest('published_at')
                ->paginate(12),
            // The page renders a dedicated "disematkan" band above the list.
            'pinned' => Announcement::published()
                ->pinned()
                ->with('user:id,name')
                ->latest('published_at')
                ->take(3)
                ->get(),
        ]);
    }

    public function show(Request $request, string $slug): Response
    {
        $announcement = Announcement::published()
            ->where('slug', $slug)
            ->with('user:id,name')
            ->firstOrFail();

        $userId = $request->user()?->id;

        // The page renders a like button and comment thread, so both must be primed here.
        $announcement->setAttribute('likes_count', $announcement->likes()->count());
        $announcement->setAttribute('is_liked', $announcement->isLikedBy($userId));
        $announcement->setAttribute('comments', $announcement->activeComments()->get()->map(fn ($comment) => [
            'id' => $comment->id,
            'content' => $comment->content,
            'created_at' => $comment->created_at,
            'user' => [
                'id' => $comment->user_id,
                'name' => $comment->user?->name ?? 'Warga Desa Muneng',
            ],
        ]));

        return Inertia::render('Public/Announcements/Show', [
            'announcement' => $announcement,
            'relatedAnnouncements' => Announcement::published()
                ->whereKeyNot($announcement->id)
                ->latest('published_at')
                ->take(3)
                ->get(['id', 'title', 'slug', 'image', 'published_at', 'excerpt']),
        ]);
    }
}
