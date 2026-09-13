import { Head, Link, router } from '@inertiajs/react';
import { Archive, Mail, MailOpen, Trash2 } from 'lucide-react';
import { Fragment, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardFooter } from '@/Components/ui/Card';
import EmptyState from '@/Components/ui/EmptyState';

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'unread' | 'read' | 'archived';
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedMessages {
    data: ContactMessage[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    messages: PaginatedMessages;
    filter: string;
    unreadCount: number;
}

const filters = [
    { label: 'Semua', value: 'all' },
    { label: 'Belum dibaca', value: 'unread' },
    { label: 'Sudah dibaca', value: 'read' },
    { label: 'Diarsipkan', value: 'archived' },
];

function StatusBadge({ status }: { status: ContactMessage['status'] }) {
    if (status === 'unread') return <Badge variant="warning">Belum dibaca</Badge>;
    if (status === 'read') return <Badge variant="success">Sudah dibaca</Badge>;
    return <Badge variant="default">Diarsipkan</Badge>;
}

export default function ContactsIndex({ messages, filter, unreadCount }: Props) {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
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

    const toggleRow = (message: ContactMessage) => {
        const next = expandedRow === message.id ? null : message.id;
        setExpandedRow(next);

        // Opening an unread message is the natural "read" signal.
        if (next !== null && message.status === 'unread') {
            runAction(message.id, `/admin/contacts/${message.id}/read`, 'post');
        }
    };

    return (
        <AdminLayout title="Pesan Masuk">
            <Head title="Pesan Masuk - Admin Desa Muneng" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-ink-1">Pesan Masuk</h1>
                    <p className="mt-1 text-sm text-ink-3">
                        Total {messages.total} pesan dari formulir kontak
                        {unreadCount > 0 && ` — ${unreadCount} belum dibaca`}
                    </p>
                </div>

                <nav
                    className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl bg-surface-3 p-1"
                    aria-label="Filter pesan"
                >
                    {filters.map((item) => (
                        <Link
                            key={item.value}
                            href={
                                item.value === 'all'
                                    ? '/admin/contacts'
                                    : `/admin/contacts?status=${item.value}`
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
                    {messages.data.length === 0 ? (
                        <CardBody>
                            <EmptyState
                                icon={Mail}
                                title="Belum ada pesan"
                                description="Pesan dari formulir kontak warga akan muncul di sini."
                            />
                        </CardBody>
                    ) : (
                        <CardBody className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[820px] text-sm">
                                    <thead className="border-b border-line bg-surface-2 text-left text-ink-2">
                                        <tr>
                                            <th className="px-4 py-3.5 font-semibold">Pengirim</th>
                                            <th className="px-4 py-3.5 font-semibold">Subjek</th>
                                            <th className="px-4 py-3.5 font-semibold">Status</th>
                                            <th className="px-4 py-3.5 font-semibold">Tanggal</th>
                                            <th className="px-4 py-3.5 text-center font-semibold">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-line-subtle">
                                        {messages.data.map((message) => (
                                            <Fragment key={message.id}>
                                                <tr
                                                    className={
                                                        expandedRow === message.id
                                                            ? 'bg-brand-soft/50'
                                                            : 'transition-colors hover:bg-surface-2'
                                                    }
                                                >
                                                    <td className="px-4 py-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleRow(message)}
                                                            aria-expanded={expandedRow === message.id}
                                                            className="inline-flex min-h-11 flex-col items-start text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                                                        >
                                                            <span
                                                                className={
                                                                    message.status === 'unread'
                                                                        ? 'font-bold text-ink-1'
                                                                        : 'font-medium text-ink-1'
                                                                }
                                                            >
                                                                {message.name}
                                                            </span>
                                                            <span className="text-xs text-ink-3">
                                                                {message.email}
                                                            </span>
                                                        </button>
                                                    </td>
                                                    <td className="max-w-[260px] truncate px-4 py-3 text-ink-2">
                                                        {message.subject}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <StatusBadge status={message.status} />
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3 text-ink-3">
                                                        {new Intl.DateTimeFormat('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        }).format(new Date(message.created_at))}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex justify-center gap-1">
                                                            {message.status === 'unread' && (
                                                                <Button
                                                                    type="button"
                                                                    variant="tonal"
                                                                    size="sm"
                                                                    className="min-h-11 min-w-11 p-0"
                                                                    aria-label={`Tandai pesan dari ${message.name} sudah dibaca`}
                                                                    disabled={
                                                                        processingId === message.id
                                                                    }
                                                                    onClick={() =>
                                                                        runAction(
                                                                            message.id,
                                                                            `/admin/contacts/${message.id}/read`,
                                                                            'post',
                                                                        )
                                                                    }
                                                                >
                                                                    <MailOpen
                                                                        className="h-4 w-4"
                                                                        aria-hidden
                                                                    />
                                                                </Button>
                                                            )}
                                                            {message.status !== 'archived' && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="min-h-11 min-w-11 p-0"
                                                                    aria-label={`Arsipkan pesan dari ${message.name}`}
                                                                    disabled={
                                                                        processingId === message.id
                                                                    }
                                                                    onClick={() =>
                                                                        runAction(
                                                                            message.id,
                                                                            `/admin/contacts/${message.id}/archive`,
                                                                            'post',
                                                                        )
                                                                    }
                                                                >
                                                                    <Archive
                                                                        className="h-4 w-4"
                                                                        aria-hidden
                                                                    />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="min-h-11 min-w-11 p-0 text-red-600"
                                                                aria-label={`Hapus pesan dari ${message.name}`}
                                                                disabled={processingId === message.id}
                                                                onClick={() => {
                                                                    if (
                                                                        window.confirm(
                                                                            `Hapus pesan dari ${message.name}? Tindakan ini tidak dapat dibatalkan.`,
                                                                        )
                                                                    ) {
                                                                        runAction(
                                                                            message.id,
                                                                            `/admin/contacts/${message.id}`,
                                                                            'delete',
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2
                                                                    className="h-4 w-4"
                                                                    aria-hidden
                                                                />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {expandedRow === message.id && (
                                                    <tr>
                                                        <td
                                                            colSpan={5}
                                                            className="border-b border-brand-soft bg-brand-soft/30 px-4 py-4"
                                                        >
                                                            <h2 className="text-sm font-semibold text-ink-1">
                                                                {message.subject}
                                                            </h2>
                                                            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-2">
                                                                {message.message}
                                                            </p>
                                                            <a
                                                                href={`mailto:${message.email}?subject=${encodeURIComponent(`Balasan: ${message.subject}`)}`}
                                                                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface-1 px-4 py-2 text-sm font-medium text-brand-strong hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                                                            >
                                                                <Mail className="h-4 w-4" aria-hidden />
                                                                Balas via email
                                                            </a>
                                                        </td>
                                                    </tr>
                                                )}
                                            </Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                    )}

                    {messages.last_page > 1 && (
                        <CardFooter className="flex flex-col gap-3 border-t border-line sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-ink-3">
                                Halaman {messages.current_page} dari {messages.last_page}
                            </p>
                            <nav className="flex flex-wrap gap-1" aria-label="Paginasi pesan">
                                {messages.links.map((link) =>
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
