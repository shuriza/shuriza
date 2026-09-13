<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReactionController extends Controller
{
    public function toggle(Request $request): JsonResponse
    {
        $request->validate([
            'emoji' => 'required|in:heart,laugh,wow,pray,fire',
            'reactable_type' => 'required|in:memory,event,announcement',
            'reactable_id' => 'required|integer',
        ]);

        $sessionId = $request->session()->getId();
        // `*_type` holds the morph alias registered in AppServiceProvider; validation
        // above already restricts it to the supported set.
        $reactableType = $request->reactable_type;

        $existing = Reaction::where([
            'emoji' => $request->emoji,
            'reactable_type' => $reactableType,
            'reactable_id' => $request->reactable_id,
            'session_id' => $sessionId,
        ])->first();

        if ($existing) {
            $existing->delete();
            $reacted = false;
        } else {
            Reaction::create([
                'emoji' => $request->emoji,
                'reactable_type' => $reactableType,
                'reactable_id' => $request->reactable_id,
                'session_id' => $sessionId,
                'user_id' => $request->user()?->id,
            ]);
            $reacted = true;
        }

        // Get updated counts
        $counts = Reaction::where('reactable_type', $reactableType)
            ->where('reactable_id', $request->reactable_id)
            ->selectRaw('emoji, count(*) as count')
            ->groupBy('emoji')
            ->pluck('count', 'emoji');

        return response()->json([
            'reacted' => $reacted,
            'counts' => $counts,
        ]);
    }

    public function getCounts(Request $request): JsonResponse
    {
        $request->validate([
            'reactable_type' => 'required|in:memory,event,announcement',
            'reactable_id' => 'required|integer',
        ]);

        $reactableType = $request->reactable_type;

        $counts = Reaction::where('reactable_type', $reactableType)
            ->where('reactable_id', $request->reactable_id)
            ->selectRaw('emoji, count(*) as count')
            ->groupBy('emoji')
            ->pluck('count', 'emoji');

        $sessionId = $request->session()->getId();
        $userReactions = Reaction::where('reactable_type', $reactableType)
            ->where('reactable_id', $request->reactable_id)
            ->where('session_id', $sessionId)
            ->pluck('emoji');

        return response()->json([
            'counts' => $counts,
            'userReactions' => $userReactions,
        ]);
    }
}
