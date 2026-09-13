import { Head, Link, router } from '@inertiajs/react';
import { Check, Images, Trash2, X } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardFooter } from '@/Components/ui/Card';
import EmptyState from '@/Components/ui/EmptyState';

interface MemoryRecord {
    id: number;
    title: string;
    platform: string;
    type: string;
    submitted_by: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
interface PaginatedMemories {
    data: MemoryRecord[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}
interface MemoriesIndexProps {
    memories: PaginatedMemories;
    filter: string;
}

function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(dateString));
}
function MemoryStatusBadge({ status }: { status: MemoryRecord['status'] }) {
    if (status === 'pending') return <Badge variant="warning">Pending</Badge>;
    if (status === 'approved') return <Badge variant="success">Disetujui</Badge>;
    return <Badge variant="danger">Ditolak</Badge>;
}
function PlatformBadge({ platform }: { platform: string }) {
    if (platform.toLowerCase() === 'youtube') return <Badge variant="danger">YouTube</Badge>;
    if (platform.toLowerCase() === 'facebook') return <Badge variant="info">Facebook</Badge>;
    if (platform.toLowerCase() === 'galeri') return <Badge variant="brand">Galeri</Badge>;
    return <Badge variant="default">{platform}</Badge>;
}

export default function MemoriesIndex({ memories, filter }: MemoriesIndexProps) {
    const filters = [
        { label: 'Semua', value: '' },
        { label: 'Pending', value: 'pending' },
        { label: 'Disetujui', value: 'approved' },
        { label: 'Ditolak', value: 'rejected' },
    ];
    const handleReject = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menolak kenangan ini?'))
            router.post(`/admin/memories/${id}/reject`);
    };
    const handleDelete = (id: number, title: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus kenangan "${title}"?`))
            router.delete(`/admin/memories/${id}`);
    };

    return (
        <AdminLayout title="Kelola Kenangan">
            <Head title="Kelola Kenangan - Admin Desa Muneng" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-ink-1">
                        Kelola Kenangan
                    </h1>
                    <p className="mt-1 text-ink-3">Total {memories.total} kenangan</p>
                </div>
                <nav
                    className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl bg-surface-3 p-1"
                    aria-label="Filter kenangan"
                >
                    {filters.map((item) => (
                        <Link
                            key={item.value}
                            href={
                                item.value
                                    ? `/admin/memories?status=${item.value}`
                                    : '/admin/memories'
                            }
                            className={
                                filter === (item.value || 'all')
                                    ? 'min-h-10 whitespace-nowrap rounded-lg bg-surface-1 px-4 py-2 text-sm font-semibold text-brand-strong shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2'
                                    : 'min-h-10 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-ink-2 hover:text-ink-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2'
                            }
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <Card>
                    {memories.data.length === 0 ? (
                        <CardBody>
                            <EmptyState
                                icon={Images}
                                title="Tidak ada kenangan ditemukan"
                                description="Coba pilih filter lain atau tunggu kiriman kenangan dari warga."
                            />
                        </CardBody>
                    ) : (
                        <CardBody className="p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-[850px] w-full text-sm">
                                    <thead className="border-b border-line bg-surface-2 text-left text-ink-2">
                                        <tr>
                                            <th className="px-5 py-3.5 font-semibold">Judul</th>
                                            <th className="px-5 py-3.5 font-semibold">Platform</th>
                                            <th className="px-5 py-3.5 font-semibold">Tipe</th>
                                            <th className="px-5 py-3.5 font-semibold">Pengirim</th>
                                            <th className="px-5 py-3.5 font-semibold">Status</th>
                                            <th className="px-5 py-3.5 font-semibold">Tanggal</th>
                                            <th className="px-5 py-3.5 text-right font-semibold">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-line-subtle">
                                        {memories.data.map((memory) => (
                                            <tr
                                                key={memory.id}
                                                className="transition-colors hover:bg-surface-2"
                                            >
                                                <td className="max-w-xs px-5 py-4 font-medium text-ink-1">
                                                    {memory.title}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <PlatformBadge platform={memory.platform} />
                                                </td>
                                                <td className="px-5 py-4 capitalize text-ink-2">
                                                    {memory.type}
                                                </td>
                                                <td className="px-5 py-4 text-ink-2">
                                                    {memory.submitted_by}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <MemoryStatusBadge status={memory.status} />
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-ink-2">
                                                    {formatDate(memory.created_at)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        {memory.status === 'pending' && (
                                                            <>
                                                                <Button
                                                                    type="button"
                                                                    variant="tonal"
                                                                    size="sm"
                                                                    className="gap-1.5"
                                                                    onClick={() =>
                                                                        router.post(
                                                                            `/admin/memories/${memory.id}/approve`,
                                                                        )
                                                                    }
                                                                >
                                                                    <Check
                                                                        className="h-3.5 w-3.5"
                                                                        aria-hidden
                                                                    />
                                                                    Setujui
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="gap-1.5 text-red-600"
                                                                    onClick={() =>
                                                                        handleReject(memory.id)
                                                                    }
                                                                >
                                                                    <X
                                                                        className="h-3.5 w-3.5"
                                                                        aria-hidden
                                                                    />
                                                                    Tolak
                                                                </Button>
                                                            </>
                                                        )}
                                                        <Button
                                                            type="button"
                                                            variant="danger"
                                                            size="sm"
                                                            className="gap-1.5"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    memory.id,
                                                                    memory.title,
                                                                )
                                                            }
                                                        >
                                                            <Trash2
                                                                className="h-3.5 w-3.5"
                                                                aria-hidden
                                                            />
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                    )}
                    {memories.links.length > 3 && (
                        <CardFooter className="flex flex-col gap-3 border-t border-line sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-ink-3">
                                Halaman {memories.current_page} dari {memories.last_page}
                            </p>
                            <nav className="flex flex-wrap gap-1" aria-label="Paginasi kenangan">
                                {memories.links.map((link) =>
                                    link.url ? (
                                        <Link
                                            key={link.label}
                                            href={link.url}
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
