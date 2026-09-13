<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Poll;
use App\Models\PollVote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PollController extends Controller
{
    public function vote(Request $request, Poll $poll): JsonResponse
    {
        $request->validate([
            'option_index' => 'required|integer|min:0',
        ]);

        if (!$poll->is_active) {
            return response()->json(['error' => 'Polling sudah ditutup'], 400);
        }

        if ($poll->ends_at && $poll->ends_at->isPast()) {
            return response()->json(['error' => 'Polling sudah berakhir'], 400);
        }

        $sessionId = $request->session()->getId();

        if ($poll->hasVoted($sessionId)) {
            return response()->json(['error' => 'Anda sudah memberikan suara'], 400);
        }

        if ($request->option_index >= count($poll->options)) {
            return response()->json(['error' => 'Pilihan tidak valid'], 400);
        }

        PollVote::create([
            'poll_id' => $poll->id,
            'option_index' => $request->option_index,
            'session_id' => $sessionId,
            'user_id' => $request->user()?->id,
        ]);

        return response()->json([
            'success' => true,
            'voteCounts' => $poll->getVoteCounts(),
            'totalVotes' => $poll->totalVotes(),
            'userVote' => $request->option_index,
        ]);
    }
}
