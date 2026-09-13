<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Destination;
use App\Models\Event;
use App\Models\Memory;
use App\Models\Submission;
use App\Models\Poll;
use App\Models\VillageInfo;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $upcomingEvents = Event::published()
            ->upcoming()
            ->with('category')
            ->orderBy('event_date')
            ->take(4)
            ->get();

        $latestMemories = Memory::approved()
            ->latest()
            ->take(6)
            ->get();

        $featuredDestinations = Destination::published()
            ->take(4)
            ->get();

        $villageInfo = VillageInfo::all();

        $latestAnnouncements = Announcement::published()
            ->latest('published_at')
            ->take(3)
            ->get();

        // Perangkat Desa - dari database village_info group 'pemerintahan'
        // Data ini placeholder - bisa diupdate via admin panel
        $perangkatDesa = VillageInfo::byGroup('pemerintahan')->get()->map(function ($item) {
            return [
                'nama' => $item->value ?: '(Belum diisi)',
                'jabatan' => $item->label,
                'periode' => '',
            ];
        })->toArray();

        $recentSubmissions = Submission::approved()
            ->latest('approved_at')
            ->take(5)
            ->get();

        $activePoll = Poll::active()->latest()->first();
        $pollData = null;
        if ($activePoll) {
            $sessionId = request()->session()->getId();
            $pollData = [
                'id' => $activePoll->id,
                'question' => $activePoll->question,
                'options' => $activePoll->options,
                'voteCounts' => $activePoll->getVoteCounts(),
                'totalVotes' => $activePoll->totalVotes(),
                'hasVoted' => $activePoll->hasVoted($sessionId),
                'userVote' => $activePoll->getUserVote($sessionId),
                'ends_at' => $activePoll->ends_at?->toISOString(),
            ];
        }

        return Inertia::render('Public/Home', [
            'upcomingEvents' => $upcomingEvents,
            'latestMemories' => $latestMemories,
            'featuredDestinations' => $featuredDestinations,
            'villageInfo' => $villageInfo,
            'latestAnnouncements' => $latestAnnouncements,
            'perangkatDesa' => $perangkatDesa,
            'recentSubmissions' => $recentSubmissions,
            'activePoll' => $pollData,
        ]);
    }
}
