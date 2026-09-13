<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Like;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request): JsonResponse
    {
        $request->validate([
            'likeable_type' => 'required|string|in:event,memory,destination,announcement',
            'likeable_id' => 'required|integer',
        ]);

        $userId = $request->user()->id;
        $likeableType = $this->resolveMorphAlias($request->input('likeable_type'));
        $likeableId = $request->input('likeable_id');

        $existing = Like::where('user_id', $userId)
            ->where('likeable_type', $likeableType)
            ->where('likeable_id', $likeableId)
            ->first();

        if ($existing) {
            $existing->delete();
            $liked = false;
        } else {
            Like::create([
                'user_id' => $userId,
                'likeable_type' => $likeableType,
                'likeable_id' => $likeableId,
            ]);
            $liked = true;
        }

        $count = Like::where('likeable_type', $likeableType)
            ->where('likeable_id', $likeableId)
            ->count();

        return response()->json([
            'liked' => $liked,
            'count' => $count,
        ]);
    }

    /**
     * `*_type` columns hold the morph alias registered in AppServiceProvider.
     */
    private function resolveMorphAlias(string $type): string
    {
        if (! array_key_exists($type, Relation::morphMap())) {
            throw new \InvalidArgumentException("Invalid likeable type: {$type}");
        }

        return $type;
    }
}
