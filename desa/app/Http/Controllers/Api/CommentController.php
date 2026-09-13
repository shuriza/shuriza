<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(string $type, int $id): JsonResponse
    {
        $commentableType = $this->resolveModelClass($type);

        $comments = Comment::where('commentable_type', $commentableType)
            ->where('commentable_id', $id)
            ->active()
            ->with('user:id,name')
            ->latest()
            ->paginate(20);

        return response()->json($comments);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'commentable_type' => 'required|string|in:event,memory,destination,announcement',
            'commentable_id' => 'required|integer',
            'content' => 'required|string|min:2|max:1000',
        ]);

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'commentable_type' => $this->resolveModelClass($request->input('commentable_type')),
            'commentable_id' => $request->input('commentable_id'),
            'content' => $request->input('content'),
            'status' => 'active',
        ]);

        $comment->load('user:id,name');

        return response()->json([
            'message' => 'Komentar berhasil ditambahkan.',
            'comment' => $comment,
        ], 201);
    }

    public function destroy(Request $request, Comment $comment): JsonResponse
    {
        $user = $request->user();

        if ($comment->user_id !== $user->id && ! $user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Komentar berhasil dihapus.']);
    }

    private function resolveModelClass(string $type): string
    {
        return match ($type) {
            'event' => \App\Models\Event::class,
            'memory' => \App\Models\Memory::class,
            'destination' => \App\Models\Destination::class,
            'announcement' => \App\Models\Announcement::class,
            default => throw new \InvalidArgumentException("Invalid commentable type: {$type}"),
        };
    }
}
