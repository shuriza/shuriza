<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Poll;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PollController extends Controller
{
    public function index(): Response
    {
        $polls = Poll::latest()->paginate(10);

        // Add vote counts to each poll
        $polls->getCollection()->transform(function ($poll) {
            $poll->vote_counts = $poll->getVoteCounts();
            $poll->total_votes = $poll->totalVotes();
            return $poll;
        });

        return Inertia::render('Admin/Polls/Index', [
            'polls' => $polls,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:500',
            'options' => 'required|array|min:2|max:6',
            'options.*' => 'required|string|max:255',
            'ends_at' => 'nullable|date|after:now',
        ]);

        Poll::create([
            ...$validated,
            'is_active' => true,
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Polling berhasil dibuat.');
    }

    public function toggleActive(Poll $poll)
    {
        $poll->update(['is_active' => !$poll->is_active]);
        return back()->with('success', 'Status polling diperbarui.');
    }

    public function destroy(Poll $poll)
    {
        $poll->delete();
        return back()->with('success', 'Polling berhasil dihapus.');
    }
}
