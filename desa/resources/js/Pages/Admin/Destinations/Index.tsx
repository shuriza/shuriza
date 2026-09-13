import { Head, Link, router } from '@inertiajs/react';
import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardFooter } from '@/Components/ui/Card';
import EmptyState from '@/Components/ui/EmptyState';
import type { Destination, PaginatedData } from '@/types';

interface DestinationsIndexProps {
    destinations: PaginatedData<Destination>;
}

function CategoryBadge({ category }: { category: Destination['category'] }) {
    if (category === 'fasilitas') return <Badge variant="info">Fasilitas</Badge>;
    if (category === 'wisata') return <Badge variant="brand">Wisata</Badge>;
    return <Badge variant="accent">Suasana</Badge>;
}

function DestinationStatusBadge({ status }: { status: Destination['status'] }) {
    return status === 'published' ? (
        <Badge variant="success">Dipublikasi</Badge>
    ) : (
        <Badge variant="warning">Draft</Badge>
    );
}

export default function DestinationsIndex({ destinations }: DestinationsIndexProps) {
    const handleDelete = (id: number, name: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus destinasi "${name}"?`)) {
            router.delete(`/admin/destinations/${id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Destinasi">
            <Head title="Kelola Destinasi - Admin Desa Muneng" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-ink-1">
                            Kelola Destinasi
                        </h1>
                        <p className="mt-1 text-ink-3">Total {destinations.total} destinasi</p>
                    </div>
                    <Button
                        href="/admin/destinations/create"
                        className="gap-2 self-start sm:self-auto"
                    >
                        <Plus className="h-4 w-4" aria-hidden />
                        Tambah Destinasi
                    </Button>
                </div>

                <Card>
                    {destinations.data.length === 0 ? (
                        <CardBody>
                            <EmptyState
                                icon={MapPin}
                                title="Belum ada destinasi"
                                description="Tambahkan destinasi untuk memperkenalkan potensi Desa Muneng."
                                action={
                                    <Button href="/admin/destinations/create" className="gap-2">
                                        <Plus className="h-4 w-4" aria-hidden />
                                        Tambah Destinasi
                                    </Button>
                                }
                            />
                        </CardBody>
                    ) : (
                        <CardBody className="p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-[620px] w-full text-sm">
                                    <thead className="border-b border-line bg-surface-2 text-left text-ink-2">
                                        <tr>
                                            <th className="px-5 py-3.5 font-semibold">Nama</th>
                                            <th className="px-5 py-3.5 font-semibold">Kategori</th>
                                            <th className="px-5 py-3.5 font-semibold">Status</th>
                                            <th className="px-5 py-3.5 text-right font-semibold">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-line-subtle">
                                        {destinations.data.map((destination) => (
                                            <tr
                                                key={destination.id}
                                                className="transition-colors hover:bg-surface-2"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {destination.featured_image && (
                                                            <img
                                                                src={destination.featured_image}
                                                                alt={`Foto ${destination.name}`}
                                                                className="h-10 w-10 rounded-lg border border-line object-cover"
                                                            />
                                                        )}
                                                        <p className="max-w-xs font-medium text-ink-1">
                                                            {destination.name}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <CategoryBadge
                                                        category={destination.category}
                                                    />
                                                </td>
                                                <td className="px-5 py-4">
                                                    <DestinationStatusBadge
                                                        status={destination.status}
                                                    />
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            href={`/admin/destinations/${destination.id}/edit`}
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
                                                                handleDelete(
                                                                    destination.id,
                                                                    destination.name,
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
                    {destinations.links.length > 3 && (
                        <CardFooter className="flex flex-col gap-3 border-t border-line sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-ink-3">
                                Halaman {destinations.current_page} dari {destinations.last_page}
                            </p>
                            <nav className="flex flex-wrap gap-1" aria-label="Paginasi destinasi">
                                {destinations.links.map((link) =>
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
