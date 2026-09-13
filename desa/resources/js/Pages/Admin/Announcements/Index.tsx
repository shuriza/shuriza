import { Head, Link, router } from '@inertiajs/react';
import { Megaphone, Pencil, Pin, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardFooter } from '@/Components/ui/Card';
import EmptyState from '@/Components/ui/EmptyState';

interface Announcement {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    is_pinned: boolean;
    published_at: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
interface PaginatedAnnouncements {
    data: Announcement[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}
interface AnnouncementsIndexProps {
    announcements: PaginatedAnnouncements;
}

function formatDate(dateString: string | null): string {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(dateString));
}

function AnnouncementStatusBadge({ status }: { status: Announcement['status'] }) {
    return status === 'published' ? (
        <Badge variant="success">Dipublikasi</Badge>
    ) : (
        <Badge variant="warning">Draft</Badge>
    );
}

export default function AnnouncementsIndex({ announcements }: AnnouncementsIndexProps) {
    const handleDelete = (id: number, title: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus pengumuman "${title}"?`))
            router.delete(`/admin/announcements/${id}`);
    };

    return (
        <AdminLayout title="Kelola Pengumuman">
            <Head title="Kelola Pengumuman - Admin Desa Muneng" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-ink-1">
                            Kelola Pengumuman
                        </h1>
                        <p className="mt-1 text-ink-3">Total {announcements.total} pengumuman</p>
                    </div>
                    <Button
                        href="/admin/announcements/create"
                        className="gap-2 self-start sm:self-auto"
                    >
                        <Plus className="h-4 w-4" aria-hidden />
                        Tambah Pengumuman
                    </Button>
                </div>
                <Card>
                    {announcements.data.length === 0 ? (
                        <CardBody>
                            <EmptyState
                                icon={Megaphone}
                                title="Belum ada pengumuman"
                                description="Buat pengumuman untuk menyampaikan informasi penting kepada warga."
                                action={
                                    <Button href="/admin/announcements/create" className="gap-2">
                                        <Plus className="h-4 w-4" aria-hidden />
                                        Tambah Pengumuman
                                    </Button>
                                }
                            />
                        </CardBody>
                    ) : (
                        <CardBody className="p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-[680px] w-full text-sm">
                                    <thead className="border-b border-line bg-surface-2 text-left text-ink-2">
                                        <tr>
                                            <th className="px-5 py-3.5 font-semibold">Judul</th>
                                            <th className="px-5 py-3.5 font-semibold">Status</th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Disematkan
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Tanggal Publikasi
                                            </th>
                                            <th className="px-5 py-3.5 text-right font-semibold">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-line-subtle">
                                        {announcements.data.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition-colors hover:bg-surface-2"
                                            >
                                                <td className="max-w-xs px-5 py-4 font-medium text-ink-1">
                                                    {item.title}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <AnnouncementStatusBadge status={item.status} />
                                                </td>
                                                <td className="px-5 py-4">
                                                    {item.is_pinned ? (
                                                        <Badge variant="brand" className="gap-1">
                                                            <Pin className="h-3 w-3" aria-hidden />
                                                            Ya
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-ink-4">
                                                            Tidak
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-ink-2">
                                                    {formatDate(item.published_at)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            href={`/admin/announcements/${item.id}/edit`}
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-1.5"
                                                        >
                                                            <Pencil
                                                                className="h-3.5 w-3.5"
                                                                aria-hidden
                                                            />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="danger"
                                                            size="sm"
                                                            className="gap-1.5"
                                                            onClick={() =>
                                                                handleDelete(item.id, item.title)
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
                    {announcements.links.length > 3 && (
                        <CardFooter className="flex flex-col gap-3 border-t border-line sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-ink-3">
                                Halaman {announcements.current_page} dari {announcements.last_page}
                            </p>
                            <nav className="flex flex-wrap gap-1" aria-label="Paginasi pengumuman">
                                {announcements.links.map((link) =>
                                    link.url ? (
                                        <Link
                                            key={link.label}
                                            href={link.url}
                                            className={
                                                link.active
                                                    ? 'rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2'
                                                    : 'rounded-lg px-3 py-1.5 text-sm font-medium text-ink-2 hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2'
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
