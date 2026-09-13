import { Head, Link, router } from '@inertiajs/react';
import { Check, Store, Trash2, X } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardFooter } from '@/Components/ui/Card';
import EmptyState from '@/Components/ui/EmptyState';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number | null;
    price_note: string | null;
    category: string;
    contact_name: string;
    contact_whatsapp: string | null;
    status: 'pending' | 'published' | 'rejected';
    submitted_by_name: string | null;
    user?: { name: string } | null;
    created_at: string;
}
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
interface PaginatedProducts {
    data: Product[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}
interface ProductsIndexProps {
    products: PaginatedProducts;
    filter: string;
}

function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(dateString));
}
function formatPrice(price: number | null, priceNote: string | null): string {
    if (price === null || price === 0) return priceNote || 'Hubungi';
    return `Rp ${new Intl.NumberFormat('id-ID').format(price)}${priceNote ? ` / ${priceNote}` : ''}`;
}
function ProductStatusBadge({ status }: { status: Product['status'] }) {
    if (status === 'pending') return <Badge variant="warning">Pending</Badge>;
    if (status === 'published') return <Badge variant="success">Dipublikasi</Badge>;
    return <Badge variant="danger">Ditolak</Badge>;
}
function ProductCategoryBadge({ category }: { category: string }) {
    if (category === 'minuman') return <Badge variant="info">Minuman</Badge>;
    if (category === 'pertanian') return <Badge variant="brand">Pertanian</Badge>;
    if (category === 'jasa') return <Badge variant="accent">Jasa</Badge>;
    return (
        <Badge variant="default">
            {category === 'makanan'
                ? 'Makanan'
                : category === 'kerajinan'
                  ? 'Kerajinan'
                  : 'Lainnya'}
        </Badge>
    );
}

export default function ProductsIndex({ products, filter }: ProductsIndexProps) {
    const filters = [
        { label: 'Semua', value: '' },
        { label: 'Pending', value: 'pending' },
        { label: 'Dipublikasi', value: 'published' },
        { label: 'Ditolak', value: 'rejected' },
    ];
    const handleReject = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menolak produk ini?'))
            router.post(`/admin/products/${id}/reject`);
    };
    const handleDelete = (id: number, name: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`))
            router.delete(`/admin/products/${id}`);
    };

    return (
        <AdminLayout title="Kelola UMKM">
            <Head title="Kelola UMKM - Admin Desa Muneng" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-ink-1">Kelola UMKM</h1>
                    <p className="mt-1 text-ink-3">Total {products.total} produk</p>
                </div>
                <nav
                    className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl bg-surface-3 p-1"
                    aria-label="Filter produk"
                >
                    {filters.map((item) => (
                        <Link
                            key={item.value}
                            href={
                                item.value
                                    ? `/admin/products?status=${item.value}`
                                    : '/admin/products'
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
                    {products.data.length === 0 ? (
                        <CardBody>
                            <EmptyState
                                icon={Store}
                                title="Tidak ada produk ditemukan"
                                description="Coba pilih filter lain atau tunggu kiriman produk dari warga."
                            />
                        </CardBody>
                    ) : (
                        <CardBody className="p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-[920px] w-full text-sm">
                                    <thead className="border-b border-line bg-surface-2 text-left text-ink-2">
                                        <tr>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Nama Produk
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">Kategori</th>
                                            <th className="px-5 py-3.5 font-semibold">Harga</th>
                                            <th className="px-5 py-3.5 font-semibold">Kontak</th>
                                            <th className="px-5 py-3.5 font-semibold">Status</th>
                                            <th className="px-5 py-3.5 font-semibold">Tanggal</th>
                                            <th className="px-5 py-3.5 text-right font-semibold">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-line-subtle">
                                        {products.data.map((product) => (
                                            <tr
                                                key={product.id}
                                                className="transition-colors hover:bg-surface-2"
                                            >
                                                <td className="px-5 py-4">
                                                    <p className="max-w-xs font-medium text-ink-1">
                                                        {product.name}
                                                    </p>
                                                    {(product.submitted_by_name ||
                                                        product.user?.name) && (
                                                        <p className="mt-0.5 text-xs text-ink-4">
                                                            oleh{' '}
                                                            {product.submitted_by_name ||
                                                                product.user?.name}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <ProductCategoryBadge
                                                        category={product.category}
                                                    />
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-ink-2">
                                                    {formatPrice(product.price, product.price_note)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <p className="text-ink-2">
                                                        {product.contact_name}
                                                    </p>
                                                    {product.contact_whatsapp && (
                                                        <p className="text-xs text-ink-4">
                                                            {product.contact_whatsapp}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <ProductStatusBadge status={product.status} />
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-ink-2">
                                                    {formatDate(product.created_at)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        {product.status === 'pending' && (
                                                            <>
                                                                <Button
                                                                    type="button"
                                                                    variant="tonal"
                                                                    size="sm"
                                                                    className="gap-1.5"
                                                                    onClick={() =>
                                                                        router.post(
                                                                            `/admin/products/${product.id}/approve`,
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
                                                                        handleReject(product.id)
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
                                                                    product.id,
                                                                    product.name,
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
                    {products.links.length > 3 && (
                        <CardFooter className="flex flex-col gap-3 border-t border-line sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-ink-3">
                                Halaman {products.current_page} dari {products.last_page}
                            </p>
                            <nav className="flex flex-wrap gap-1" aria-label="Paginasi produk">
                                {products.links.map((link) =>
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
