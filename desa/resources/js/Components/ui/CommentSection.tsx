import { router, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { MessageCircle, Send, LogIn, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Comment {
    id: number;
    user: {
        id: number;
        name: string;
    };
    content: string;
    created_at: string;
}

interface CommentSectionProps {
    comments: Comment[];
    commentable_type: string;
    commentable_id: number;
}

interface PageProps {
    auth: {
        user: { id: number; name: string; email: string } | null;
    };
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export default function CommentSection({
    comments,
    commentable_type,
    commentable_id,
}: CommentSectionProps) {
    const { auth } = usePage().props as PageProps;
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!content.trim() || submitting) return;

        setSubmitting(true);
        router.post(
            '/comments',
            {
                commentable_type,
                commentable_id,
                content: content.trim(),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setContent('');
                },
                onFinish: () => {
                    setSubmitting(false);
                },
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-brand-strong" aria-hidden />
                <h3 className="text-lg font-semibold text-ink-1">
                    Komentar ({comments.length})
                </h3>
            </div>

            {/* Comment Form */}
            {auth.user ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-brand-soft rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-brand-strong font-semibold text-xs">
                                {getInitials(auth.user.name)}
                            </span>
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Tulis komentar Anda..."
                                rows={3}
                                className="w-full px-4 py-3 border border-line rounded-xl text-sm text-ink-1 placeholder-ink-4 focus:outline-none focus:ring-2 focus:ring-brand-soft focus:border-brand resize-none transition-shadow duration-200 bg-surface-1"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={!content.trim() || submitting}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-medium rounded-xl hover:bg-brand-strong disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 active:scale-[0.98]"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" aria-hidden />
                                            Kirim Komentar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-surface-2 border border-line rounded-xl p-6 text-center">
                    <User className="w-10 h-10 mx-auto text-ink-4 mb-3" aria-hidden strokeWidth={1.5} />
                    <p className="text-sm text-ink-2 mb-3">Login untuk berkomentar</p>
                    <a
                        href="/login"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-medium rounded-xl hover:bg-brand-strong transition-colors duration-200 active:scale-[0.98]"
                    >
                        <LogIn className="w-4 h-4" aria-hidden />
                        Masuk
                    </a>
                </div>
            )}

            {/* Comments List */}
            {comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="flex items-start gap-3 p-4 bg-surface-1 border border-line rounded-xl"
                        >
                            <div className="w-9 h-9 bg-brand-soft rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-brand-strong font-semibold text-xs">
                                    {getInitials(comment.user.name)}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold text-ink-1">
                                        {comment.user.name}
                                    </span>
                                    <span className="text-xs text-ink-3">
                                        {formatDate(comment.created_at)}
                                    </span>
                                </div>
                                <p className="text-sm text-ink-2 leading-relaxed whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 mx-auto text-ink-4 mb-3" aria-hidden strokeWidth={1.5} />
                    <p className="text-sm text-ink-3">Belum ada komentar. Jadilah yang pertama!</p>
                </div>
            )}
        </div>
    );
}
