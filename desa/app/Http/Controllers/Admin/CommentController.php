<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommentController extends Controller
{
    public function index(Request $request): Response
    {
        $filter = $request->status ?? 'all';

        $comments = Comment::query()
            ->when($filter !== 'all', fn ($query) => $query->where('status', $filter))
            ->with('user:id,name', 'commentable')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        // `commentable` is polymorphic across four models with different title columns and
        // URL shapes, so flatten it here rather than teaching the page about each one.
        $comments->getCollection()->transform(function (Comment $comment) {
            $subject = $comment->commentable;

            return [
                'id' => $comment->id,
                'content' => $comment->content,
                'status' => $comment->status,
                'created_at' => $comment->created_at,
                'author' => $comment->user?->name ?? 'Pengguna terhapus',
                'subject' => [
                    'type' => $comment->commentable_type,
                    'label' => $this->typeLabel($comment->commentable_type),
                    'title' => $subject?->title ?? $subject?->name,
                    'url' => $this->subjectUrl($comment),
                ],
            ];
        });

        return Inertia::render('Admin/Comments/Index', [
            'comments' => $comments,
            'filter' => $filter,
            'hiddenCount' => Comment::where('status', 'hidden')->count(),
        ]);
    }

    public function hide(Comment $comment)
    {
        $comment->update(['status' => 'hidden']);

        return back()->with('success', 'Komentar disembunyikan dari halaman publik.');
    }

    public function restore(Comment $comment)
    {
        $comment->update(['status' => 'active']);

        return back()->with('success', 'Komentar ditampilkan kembali.');
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();

        return back()->with('success', 'Komentar berhasil dihapus.');
    }

    private function typeLabel(string $type): string
    {
        return match ($type) {
            'event' => 'Acara',
            'memory' => 'Kenangan',
            'destination' => 'Destinasi',
            'announcement' => 'Berita',
            default => $type,
        };
    }

    private function subjectUrl(Comment $comment): ?string
    {
        $subject = $comment->commentable;

        if (! $subject) {
            return null;
        }

        return match ($comment->commentable_type) {
            'event' => '/acara/'.$subject->slug,
            'memory' => '/kenangan/'.$subject->id,
            'destination' => '/destinasi/'.$subject->slug,
            'announcement' => '/berita/'.$subject->slug,
            default => null,
        };
    }
}
