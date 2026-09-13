import { Head, Link, router } from '@inertiajs/react';
import { CalendarDays, Pencil, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardFooter } from '@/Components/ui/Card';
import EmptyState from '@/Components/ui/EmptyState';
import type { Event, PaginatedData } from '@/types';

interface EventsIndexProps {
    events: PaginatedData<Event>;
}

function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(dateString));
}

function EventStatusBadge({ status }: { status: Event['status'] }) {
    if (status === 'published') return <Badge variant="success">Dipublikasi</Badge>;
    if (status === 'draft') return <Badge variant="warning">Draft</Badge>;
    return <Badge variant="default">Diarsipkan</Badge>;
}

export default function EventsIndex({ events }: EventsIndexProps) {
    const handleDelete = (id: number, title: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus event "${title}"?`)) {
            router.delete(`/admin/events/${id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Event">
            <Head title="Kelola Event - Admin Desa Muneng" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-ink-1">
                            Kelola Event
                        </h1>
                        <p className="mt-1 text-ink-3">Total {events.total} event</p>
                    </div>
                    <Button href="/admin/events/create" className="gap-2 self-start sm:self-auto">
                        <Plus className="h-4 w-4" aria-hidden />
                        Tambah Event
                    </Button>
                </div>

                <Card>
                    {events.data.length === 0 ? (
                        <CardBody>
                            <EmptyState
                                icon={CalendarDays}
                                title="Belum ada event"
                                description="Tambahkan event pertama untuk membagikan agenda desa kepada warga."
                                action={
                                    <Button href="/admin/events/create" className="gap-2">
                                        <Plus className="h-4 w-4" aria-hidden />
                                        Tambah Event
                                    </Button>
                                }
                            />
                        </CardBody>
                    ) : (
                        <CardBody className="p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-[720px] w-full text-sm">
                                    <thead className="border-b border-line bg-surface-2 text-left text-ink-2">
                                        <tr>
                                            <th className="px-5 py-3.5 font-semibold">Judul</th>
                                            <th className="px-5 py-3.5 font-semibold">Tanggal</th>
                                            <th className="px-5 py-3.5 font-semibold">Lokasi</th>
                                            <th className="px-5 py-3.5 font-semibold">Status</th>
                                            <th className="px-5 py-3.5 font-semibold">Kategori</th>
                                            <th className="px-5 py-3.5 text-right font-semibold">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-line-subtle">
                                        {events.data.map((event) => (
                                            <tr
                                                key={event.id}
                                                className="transition-colors hover:bg-surface-2"
                                            >
                                                <td className="max-w-xs px-5 py-4 font-medium text-ink-1">
                                                    {event.title}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-ink-2">
                                                    {formatDate(event.event_date)}
                                                </td>
                                                <td className="max-w-[180px] px-5 py-4 text-ink-2">
                                                    {event.location || '-'}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <EventStatusBadge status={event.status} />
                                                </td>
                                                <td className="px-5 py-4 text-ink-2">
                                                    {event.category?.name || '-'}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            href={`/admin/events/${event.id}/edit`}
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-1.5"
                                                        >
                                                            <Pencil
                                                                className="h-3.5 w-3.5"
                                                                aria-hidden
                                                            />{' '}
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="danger"
                                                            size="sm"
                                                            className="gap-1.5"
                                                            onClick={() =>
                                                                handleDelete(event.id, event.title)
                                                            }
                                                        >
                                                            <Trash2
                                                                className="h-3.5 w-3.5"
                                                                aria-hidden
                                                            />{' '}
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
                    {events.links.length > 3 && (
                        <CardFooter className="flex flex-col gap-3 border-t border-line sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-ink-3">
                                Halaman {events.current_page} dari {events.last_page}
                            </p>
                            <nav className="flex flex-wrap gap-1" aria-label="Paginasi event">
                                {events.links.map((link) =>
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
