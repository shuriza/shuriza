import { Head, Link, router } from '@inertiajs/react';
import { Check, ChevronRight, Inbox, Trash2, X } from 'lucide-react';
import { Fragment, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardFooter } from '@/Components/ui/Card';
import EmptyState from '@/Components/ui/EmptyState';

interface Submission {
    id: number;
    sender_name: string;
    category: 'info_event' | 'pengumuman' | 'umkm' | 'kenangan' | 'lainnya';
    title: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
interface PaginatedSubmissions {
    data: Submission[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}
interface Props {
    submissions: PaginatedSubmissions;
    filter: string;
}

const categoryLabels: Record<Submission['category'], string> = {
    info_event: 'Info & Event',
    pengumuman: 'Pengumuman',
    umkm: 'UMKM',
    kenangan: 'Kenangan',
    lainnya: 'Lainnya',
};
function CategoryBadge({ category }: { category: Submission['category'] }) {
    if (category === 'info_event') return <Badge variant="info">{categoryLabels[category]}</Badge>;
    if (category === 'pengumuman')
        return <Badge variant="accent">{categoryLabels[category]}</Badge>;
    if (category === 'kenangan') return <Badge variant="brand">{categoryLabels[category]}</Badge>;
    return <Badge variant="default">{categoryLabels[category]}</Badge>;
}
function SubmissionStatusBadge({ status }: { status: Submission['status'] }) {
    if (status === 'pending') return <Badge variant="warning">Pending</Badge>;
    if (status === 'approved') return <Badge variant="success">Disetujui</Badge>;
    return <Badge variant="danger">Ditolak</Badge>;
}

export default function SubmissionsIndex({ submissions, filter }: Props) {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const tabs = [
        { label: 'Semua', value: '' },
        { label: 'Pending', value: 'pending' },
        { label: 'Disetujui', value: 'approved' },
        { label: 'Ditolak', value: 'rejected' },
    ];
    const formatDate = (dateString: string) =>
        new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(new Date(dateString));
    const submitAction = (id: number, url: string, method: 'post' | 'delete') => {
        setProcessingId(id);
        const options = { preserveScroll: true, onFinish: () => setProcessingId(null) };
        if (method === 'post') {
            router.post(url, {}, options);
        } else {
            router.delete(url, options);
        }
    };
    const handleApprove = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menyetujui kiriman ini?'))
            submitAction(id, `/admin/submissions/${id}/approve`, 'post');
    };
    const handleReject = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menolak kiriman ini?'))
            submitAction(id, `/admin/submissions/${id}/reject`, 'post');
    };
    const handleDelete = (id: number) => {
        if (
            window.confirm(
                'Apakah Anda yakin ingin menghapus kiriman ini? Tindakan ini tidak dapat dibatalkan.',
            )
        )
            submitAction(id, `/admin/submissions/${id}`, 'delete');
    };

    return (
        <AdminLayout title="Kelola Kiriman">
            <Head title="Kelola Kiriman - Admin Desa Muneng" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-ink-1">Kelola Kiriman</h1>
                    <p className="mt-1 text-sm text-ink-3">
                        Total {submissions.total} kiriman dari warga
                    </p>
                </div>
                <nav
                    className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl bg-surface-3 p-1"
                    aria-label="Filter kiriman"
                >
                    {tabs.map((tab) => (
                        <Button
                            key={tab.value}
                            type="button"
                            variant={filter === (tab.value || 'all') ? 'primary' : 'ghost'}
                            size="sm"
                            className="min-h-10 whitespace-nowrap"
                            onClick={() =>
                                router.get(
                                    '/admin/submissions',
                                    tab.value ? { status: tab.value } : {},
                                    { preserveState: true, preserveScroll: true },
                                )
                            }
                        >
                            {tab.label}
                        </Button>
                    ))}
                </nav>
                <Card>
                    {submissions.data.length === 0 ? (
                        <CardBody>
                            <EmptyState
                                icon={Inbox}
                                title="Tidak ada kiriman"
                                description="Belum ada kiriman yang masuk untuk filter ini."
                            />
                        </CardBody>
                    ) : (
                        <CardBody className="p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-[850px] w-full text-sm">
                                    <thead className="border-b border-line bg-surface-2 text-left text-ink-2">
                                        <tr>
                                            <th className="px-4 py-3.5 font-semibold">
                                                Nama Pengirim
                                            </th>
                                            <th className="px-4 py-3.5 font-semibold">Kategori</th>
                                            <th className="px-4 py-3.5 font-semibold">Judul</th>
                                            <th className="px-4 py-3.5 font-semibold">Status</th>
                                            <th className="px-4 py-3.5 font-semibold">Tanggal</th>
                                            <th className="px-4 py-3.5 text-center font-semibold">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-line-subtle">
                                        {submissions.data.map((submission) => (
                                            <Fragment key={submission.id}>
                                                <tr
                                                    className={
                                                        expandedRow === submission.id
                                                            ? 'bg-brand-soft/50'
                                                            : 'transition-colors hover:bg-surface-2'
                                                    }
                                                >
                                                    <td className="px-4 py-3">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setExpandedRow(
                                                                    expandedRow === submission.id
                                                                        ? null
                                                                        : submission.id,
                                                                )
                                                            }
                                                            className="inline-flex min-h-11 items-center gap-2 text-left font-medium text-ink-1 hover:text-brand-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                                                        >
                                                            <ChevronRight
                                                                className={
                                                                    expandedRow === submission.id
                                                                        ? 'h-4 w-4 rotate-90 text-ink-3 transition-transform'
                                                                        : 'h-4 w-4 text-ink-3 transition-transform'
                                                                }
                                                                aria-hidden
                                                            />
                                                            {submission.sender_name}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <CategoryBadge
                                                            category={submission.category}
                                                        />
                                                    </td>
                                                    <td className="max-w-[200px] truncate px-4 py-3 text-ink-2">
                                                        {submission.title}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <SubmissionStatusBadge
                                                            status={submission.status}
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3 text-ink-3">
                                                        {formatDate(submission.created_at)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex justify-center gap-1">
                                                            {submission.status === 'pending' && (
                                                                <>
                                                                    <Button
                                                                        type="button"
                                                                        variant="tonal"
                                                                        size="sm"
                                                                        className="min-h-11 min-w-11 p-0"
                                                                        aria-label="Setujui kiriman"
                                                                        disabled={
                                                                            processingId ===
                                                                            submission.id
                                                                        }
                                                                        onClick={() =>
                                                                            handleApprove(
                                                                                submission.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Check
                                                                            className="h-4 w-4"
                                                                            aria-hidden
                                                                        />
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="min-h-11 min-w-11 p-0 text-red-600"
                                                                        aria-label="Tolak kiriman"
                                                                        disabled={
                                                                            processingId ===
                                                                            submission.id
                                                                        }
                                                                        onClick={() =>
                                                                            handleReject(
                                                                                submission.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <X
                                                                            className="h-4 w-4"
                                                                            aria-hidden
                                                                        />
                                                                    </Button>
                                                                </>
                                                            )}
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="min-h-11 min-w-11 p-0 text-red-600"
                                                                aria-label="Hapus kiriman"
                                                                disabled={
                                                                    processingId === submission.id
                                                                }
                                                                onClick={() =>
                                                                    handleDelete(submission.id)
                                                                }
                                                            >
                                                                <Trash2
                                                                    className="h-4 w-4"
                                                                    aria-hidden
                                                                />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {expandedRow === submission.id && (
                                                    <tr>
                                                        <td
                                                            colSpan={6}
                                                            className="border-b border-brand-soft bg-brand-soft/30 px-4 py-4"
                                                        >
                                                            <div className="pl-6">
                                                                <h2 className="text-sm font-semibold text-ink-1">
                                                                    Isi Kiriman
                                                                </h2>
                                                                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-2">
                                                                    {submission.content}
                                                                </p>
                                                            </div>
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
                    {submissions.last_page > 1 && (
                        <CardFooter className="flex flex-col gap-3 border-t border-line sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-ink-3">
                                Halaman {submissions.current_page} dari {submissions.last_page}
                            </p>
                            <nav className="flex flex-wrap gap-1" aria-label="Paginasi kiriman">
                                {submissions.links.map((link) =>
                                    link.url ? (
                                        <Link
                                            key={link.label}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                            className={
                                                link.active
                                                    ? 'rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white'
                                                    : 'rounded-lg px-3 py-1.5 text-sm text-ink-2 hover:bg-surface-2'
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
