<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Memory;
use App\Models\MemoryAlbum;
use App\Services\MediaScraper;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MemoryController extends Controller
{
    public function __construct(
        private MediaScraper $scraper
    ) {}

    public function index(Request $request): Response
    {
        $query = Memory::approved()->with('submitter', 'album')->latest();

        if ($request->has('platform') && $request->platform !== 'all') {
            $query->where('platform', $request->platform);
        }

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->has('year') && $request->year) {
            $query->where('year', $request->year);
        }

        if ($request->has('album') && $request->album) {
            $query->where('album_id', $request->album);
        }

        $memories = $query->paginate(8);

        $pinnedMemories = Memory::approved()->pinned()->with('submitter')->latest()->take(3)->get();

        $albums = MemoryAlbum::withCount(['memories' => function ($q) {
            $q->where('status', 'approved');
        }])->orderBy('order')->get();

        $years = Memory::approved()
            ->selectRaw('year')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year')
            ->filter();

        return Inertia::render('Public/Memories/Index', [
            'memories' => $memories,
            'pinnedMemories' => $pinnedMemories,
            'albums' => $albums,
            'years' => $years,
            'filters' => [
                'platform' => $request->platform ?? 'all',
                'type' => $request->type ?? 'all',
                'year' => $request->year ?? null,
                'album' => $request->album ?? null,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Public/Memories/Create');
    }

    public function show(Request $request, Memory $memory): Response
    {
        abort_unless($memory->status === 'approved', 404);

        $memory->load('submitter:id,name', 'album:id,name,slug', 'category:id,name');

        $sessionId = $request->session()->getId();

        $related = Memory::approved()
            ->whereKeyNot($memory->id)
            ->when($memory->album_id, fn ($query) => $query->where('album_id', $memory->album_id))
            ->with('submitter:id,name')
            ->latest()
            ->take(3)
            ->get();

        // Album may hold fewer than 3 siblings; top up from the newest approved memories.
        if ($related->count() < 3) {
            $related = $related->concat(
                Memory::approved()
                    ->whereKeyNot($memory->id)
                    ->whereNotIn('id', $related->pluck('id'))
                    ->with('submitter:id,name')
                    ->latest()
                    ->take(3 - $related->count())
                    ->get()
            );
        }

        return Inertia::render('Public/Memories/Show', [
            'memory' => $memory,
            'related' => $related->values(),
            'reactions' => $memory->reactions()
                ->selectRaw('emoji, count(*) as count')
                ->groupBy('emoji')
                ->pluck('count', 'emoji'),
            'userReactions' => $memory->reactions()
                ->where('session_id', $sessionId)
                ->pluck('emoji'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'type' => 'nullable|in:video,photo',
            'platform' => 'nullable|in:youtube,tiktok,facebook,instagram',
            'source_url' => 'required|url|max:500',
        ]);

        $url = $validated['source_url'];

        // Auto-scrape metadata from URL
        $metadata = $this->scraper->scrape($url);

        // Auto-detect platform if not provided
        $platform = $validated['platform'] ?? $metadata['platform'] ?? $this->scraper->detectPlatform($url);

        // Auto-detect type if not provided
        $type = $validated['type'] ?? $metadata['type'] ?? $this->scraper->detectType($url, $platform);

        // Use scraped title if user didn't provide one
        $title = !empty($validated['title']) ? $validated['title'] : ($metadata['title'] ?? 'Kenangan Desa Muneng');

        // Use scraped description if user didn't provide one
        $description = !empty($validated['description']) ? $validated['description'] : ($metadata['description'] ?? '');

        $memory = Memory::create([
            'title' => $title,
            'description' => $description,
            'type' => $type,
            'platform' => $platform,
            'source_url' => $url,
            'embed_code' => $metadata['embed_code'] ?? null,
            'thumbnail_url' => $metadata['thumbnail_url'] ?? null,
            'status' => 'pending',
            'submitted_by' => $request->user()->id,
        ]);

        return redirect()->route('memories.index')
            ->with('success', 'Kenangan berhasil dikirim! Menunggu persetujuan admin.');
    }

    /**
     * API endpoint for URL preview (scrape without saving)
     * Called via AJAX from the frontend form
     */
    public function preview(Request $request)
    {
        $request->validate([
            'url' => 'required|url|max:500',
        ]);

        $metadata = $this->scraper->scrape($request->input('url'));

        return response()->json([
            'success' => true,
            'data' => $metadata,
        ]);
    }
}
