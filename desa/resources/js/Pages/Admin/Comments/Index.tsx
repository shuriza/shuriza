import { Head, Link, router } from '@inertiajs/react';
import { Eye, EyeOff, MessageSquareText, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardFooter } from '@/Components/ui/Card';
import EmptyState from '@/Components/ui/EmptyState';

interface CommentSubject {
    type: string;
    label: string;
    title: string | null;
    url: string | null;
}

interface AdminComment {
    id: number;
    content: string;
    status: 'active' | 'hidden';
    created_at: string;
    author: string;
    subject: CommentSubject;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedComments {
    data: AdminComment[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    comments: PaginatedComments;
    filter: string;
    hiddenCount: number;
}

const filters = [
    { label: 'Semua', value: 'all' },
    { label: 'Tampil', value: 'active' },
    { label: 'Disembunyikan', value: 'hidden' },
];

export default function CommentsIndex({ comments, filter, hiddenCount }: Props) {
    const [processingId, setProcessingId] = useState<number | null>(null);

    const runAction = (id: number, url: string, method: 'post' | 'delete') => {
        setProcessingId(id);
        const options = { preserveScroll: true, onFinish: () => setProcessingId(null) };

        if (method === 'post') {
            router.post(url, {}, options);
        } else {
            router.delete(url, options);
        }
    };

    return (
        <AdminLayout title="Moderasi Komentar">
            <Head title="Moderasi Komentar - Admin Desa Muneng" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-ink-1">
                        Moderasi Komentar
                    </h1>
                    <p className="mt-1 text-sm text-ink-3">
                        Total {comments.total} komentar
                        {hiddenCount > 0 && ` — ${hiddenCount} disembunyikan`}
                    </p>
                </div>

                <nav
                    className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl bg-surface-3 p-1"
                    aria-label="Filter komentar"
                >
                    {filters.map((item) => (
                        <Link
                            key={item.value}
                            href={
                                item.value === 'all'
                                    ? '/admin/comments'
                                    : `/admin/comments?status=${item.value}`
                            }
                            className={
                                filter === item.value
                                    ? 'min-h-10 whitespace-nowrap rounded-lg bg-surface-1 px-4 py-2 text-sm font-semibold text-brand-strong shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2'
                                    : 'min-h-10 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-ink-2 hover:text-ink-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2'
                            }
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <Card>
                    {comments.data.length === 0 ? (
                        <CardBody>
                            <EmptyState
                                icon={MessageSquareText}
                                title="Belum ada komentar"
                                description="Komentar warga pada berita, acara, kenangan, dan destinasi akan muncul di sini."
                            />
                        </CardBody>
                    ) : (
                        <CardBody className="p-0">
                            <ul className="divide-y divide-line-subtle">
                                {comments.data.map((comment) => (
                                    <li
                                        key={comment.id}
                                        className={
                                            comment.status === 'hidden'
                                                ? 'bg-surface-2 p-4'
                                                : 'p-4 transition-colors hover:bg-surface-2'
                                        }
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-semibold text-ink-1">
                                                        {comment.author}
                                                    </span>
                                                    <Badge variant="default" rounded>
                                                        {comment.subject.label}
                                                    </Badge>
                                                    {comment.status === 'hidden' && (
                                                        <Badge variant="warning" rounded>
                                                            Disembunyikan
                                                        </Badge>
                                                    )}
                                                </div>

                                                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-2">
                                                    {comment.content}
                                                </p>

                                                <p className="mt-2 text-xs text-ink-3">
                                                    {comment.subject.url ? (
                                                        <Link
                                                            href={comment.subject.url}
                                                            className="font-medium text-brand-strong hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                                                        >
                                                            {comment.subject.title ?? 'Lihat konten'}
                                                        </Link>
                                                    ) : (
                                                        <span className="italic">
                                                            Konten sudah dihapus
                                                        </span>
                                                    )}
                                                    <span aria-hidden> · </span>
                                                    {new Intl.DateTimeFormat('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    }).format(new Date(comment.created_at))}
                                                </p>
                                            </div>

                                            <div className="flex shrink-0 gap-1">
                                                {comment.status === 'active' ? (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="min-h-11 min-w-11 p-0"
                                                        aria-label={`Sembunyikan komentar dari ${comment.author}`}
                                                        disabled={processingId === comment.id}
                                                        onClick={() =>
                                                            runAction(
                                                                comment.id,
                                                                `/admin/comments/${comment.id}/hide`,
                                                                'post',
                                                            )
                                                        }
                                                    >
                                                        <EyeOff className="h-4 w-4" aria-hidden />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        variant="tonal"
                                                        size="sm"
                                                        className="min-h-11 min-w-11 p-0"
                                                        aria-label={`Tampilkan komentar dari ${comment.author}`}
                                                        disabled={processingId === comment.id}
                                                        onClick={() =>
                                                            runAction(
                                                                comment.id,
                                                                `/admin/comments/${comment.id}/restore`,
                                                                'post',
                                                            )
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" aria-hidden />
                                                    </Button>
                                                )}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="min-h-11 min-w-11 p-0 text-red-600"
                                                    aria-label={`Hapus komentar dari ${comment.author}`}
                                                    disabled={processingId === comment.id}
                                                    onClick={() => {
                                                        if (
                                                            window.confirm(
                                                                `Hapus komentar dari ${comment.author}? Tindakan ini tidak dapat dibatalkan.`,
                                                            )
                                                        ) {
                                                            runAction(
                                                                comment.id,
                                                                `/admin/comments/${comment.id}`,
                                                                'delete',
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" aria-hidden />
                                                </Button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardBody>
                    )}

                    {comments.last_page > 1 && (
                        <CardFooter className="flex flex-col gap-3 border-t border-line sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-ink-3">
                                Halaman {comments.current_page} dari {comments.last_page}
                            </p>
                            <nav className="flex flex-wrap gap-1" aria-label="Paginasi komentar">
                                {comments.links.map((link) =>
                                    link.url ? (
                                        <Link
                                            key={link.label}
                                            href={link.url}
                                            preserveScroll
                                            className={
                                                link.active
                                                    ? 'rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white'
                                                    : 'rounded-lg px-3 py-1.5 text-sm font-medium text-ink-2 hover:bg-surface-2'
                                            }
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={link.label}
                                            className="rounded-lg px-3 py-1.5 text-sm text-ink-4"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ),
                                )}
                            </nav>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}
