import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number | null;
    price_note: string | null;
    category: string;
    image: string | null;
    contact_name: string;
    contact_phone: string | null;
    contact_whatsapp: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ProductsIndexProps {
    products: {
        data: Product[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filter: string;
}

const categoryFilters = [
    { label: 'Semua', value: 'all' },
    { label: 'Makanan', value: 'makanan' },
    { label: 'Minuman', value: 'minuman' },
    { label: 'Kerajinan', value: 'kerajinan' },
    { label: 'Pertanian', value: 'pertanian' },
    { label: 'Jasa', value: 'jasa' },
    { label: 'Lainnya', value: 'lainnya' },
];

function getCategoryColor(category: string): { badge: string; gradient: string } {
    switch (category) {
        case 'makanan': return { badge: 'bg-orange-100 text-orange-700 border-orange-200', gradient: 'from-orange-400 to-red-400' };
        case 'minuman': return { badge: 'bg-sky-100 text-sky-700 border-sky-200', gradient: 'from-sky-400 to-blue-400' };
        case 'kerajinan': return { badge: 'bg-purple-100 text-purple-700 border-purple-200', gradient: 'from-purple-400 to-indigo-400' };
        case 'pertanian': return { badge: 'bg-brand-soft text-brand-strong border-brand-soft', gradient: 'from-emerald-400 to-green-400' };
        case 'jasa': return { badge: 'bg-amber-100 text-amber-700 border-amber-200', gradient: 'from-amber-400 to-yellow-500' };
        case 'lainnya': return { badge: 'bg-surface-3 text-ink-2 border-line', gradient: 'from-gray-400 to-slate-400' };
        default: return { badge: 'bg-surface-3 text-ink-2 border-line', gradient: 'from-gray-400 to-slate-400' };
    }
}

function getCategoryLabel(category: string): string {
    switch (category) {
        case 'makanan': return 'Makanan';
        case 'minuman': return 'Minuman';
        case 'kerajinan': return 'Kerajinan';
        case 'pertanian': return 'Pertanian';
        case 'jasa': return 'Jasa';
        case 'lainnya': return 'Lainnya';
        default: return category;
    }
}

function formatPrice(price: number | null, priceNote: string | null): string {
    if (price === null || price === 0) {
        return 'Hubungi Penjual';
    }
    const formatted = new Intl.NumberFormat('id-ID').format(price);
    return `Rp ${formatted}${priceNote ? ` / ${priceNote}` : ''}`;
}

function getWhatsAppUrl(phone: string, productName: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const message = encodeURIComponent(`Halo, saya tertarik dengan produk "${productName}" yang ada di website Desa Muneng. Apakah masih tersedia?`);
    return `https://wa.me/${waPhone}?text=${message}`;
}

export default function ProductsIndex({ products, filter }: ProductsIndexProps) {
    function applyFilter(value: string) {
        const params: Record<string, string> = {};
        if (value && value !== 'all') params.category = value;
        router.get('/umkm', params, { preserveState: true, preserveScroll: true });
    }

    return (
        <PublicLayout>
            <Head title="UMKM - Produk & Jasa Warga Desa Muneng" />

            {/* ===== HERO SECTION ===== */}
            <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
                {/* Decorative background patterns */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="absolute top-10 left-10 w-72 h-72 bg-teal-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-56 h-56 bg-brand-soft0/15 rounded-full blur-3xl"></div>

                {/* Decorative shopping bag SVG */}
                <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 opacity-10">
                    <svg className="w-48 h-48 md:w-72 md:h-72 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>

                {/* Decorative floating elements */}
                <div className="absolute top-20 left-1/4 w-2 h-2 bg-emerald-400/40 rounded-full"></div>
                <div className="absolute top-32 right-1/3 w-3 h-3 bg-teal-300/30 rounded-full"></div>
                <div className="absolute bottom-24 left-1/3 w-2 h-2 bg-emerald-300/40 rounded-full"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-1/10 backdrop-blur-sm border border-white/20 text-emerald-200 text-sm font-medium mb-6">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        UMKM Desa
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
                        Produk & Jasa Warga
                    </h1>
                    <p className="text-lg md:text-xl text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
                        Dukung ekonomi lokal dengan membeli produk dari warga Desa Muneng
                    </p>
                </div>
            </section>

            {/* Wave Divider */}
            <div className="relative -mt-1">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
                    <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#f9fafb" />
                </svg>
            </div>

            {/* ===== PRODUCTS GRID ===== */}
            <section className="py-16 md:py-24 bg-surface-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-3 mb-12 justify-center">
                        {categoryFilters.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => applyFilter(cat.value)}
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                                    (filter || 'all') === cat.value
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-105'
                                        : 'bg-surface-1 text-ink-3 border border-line hover:border-emerald-300 hover:text-brand-strong hover:shadow-md hover:-translate-y-0.5'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Submit Product CTA */}
                    <div className="flex justify-center mb-12">
                        <Link
                            href="/umkm/submit"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-surface-1 border-2 border-dashed border-emerald-300 text-brand-strong rounded-xl font-semibold hover:bg-brand-soft hover:border-emerald-400 transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Daftarkan Produk Anda
                        </Link>
                    </div>

                    {/* Products Grid */}
                    {products.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.data.map((product) => {
                                const colors = getCategoryColor(product.category);
                                return (
                                    <div
                                        key={product.id}
                                        className="group relative bg-surface-1 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-line hover:border-brand-soft hover:-translate-y-2"
                                    >
                                        {/* Image / Placeholder */}
                                        <div className="aspect-[4/3] overflow-hidden relative">
                                            {product.image ? (
                                                <>
                                                    <img
                                                        src={`/storage/${product.image}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                                </>
                                            ) : (
                                                <div className={`w-full h-full bg-gradient-to-br ${colors.gradient} opacity-20 flex items-center justify-center`}>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="text-center">
                                                            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-surface-1/30 backdrop-blur-sm flex items-center justify-center">
                                                                <svg className="w-8 h-8 text-ink-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Category badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm bg-surface-1/90 ${colors.badge}`}>
                                                    {getCategoryLabel(product.category)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-ink-1 group-hover:text-brand-strong transition-colors mb-2 line-clamp-1">
                                                {product.name}
                                            </h3>

                                            {product.description && (
                                                <p className="text-ink-3 text-sm line-clamp-2 leading-relaxed mb-4">
                                                    {product.description}
                                                </p>
                                            )}

                                            {/* Price */}
                                            <div className="mb-4">
                                                {product.price !== null && product.price > 0 ? (
                                                    <div className="flex items-baseline gap-1.5">
                                                        <span className="text-xl font-bold text-brand-strong">
                                                            Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                                                        </span>
                                                        {product.price_note && (
                                                            <span className="text-sm text-ink-4">/ {product.price_note}</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-base font-semibold text-amber-600">
                                                        {product.price_note || 'Hubungi Penjual'}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Contact info */}
                                            <div className="flex items-center gap-2 text-sm text-ink-3 mb-4">
                                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span className="truncate">{product.contact_name}</span>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex gap-2 pt-4 border-t border-line">
                                                {product.contact_whatsapp && (
                                                    <a
                                                        href={getWhatsAppUrl(product.contact_whatsapp, product.name)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                                        </svg>
                                                        WhatsApp
                                                    </a>
                                                )}
                                                {product.contact_phone && !product.contact_whatsapp && (
                                                    <a
                                                        href={`tel:${product.contact_phone}`}
                                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-strong transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                        Hubungi
                                                    </a>
                                                )}
                                                <Link
                                                    href={`/umkm/${product.slug}`}
                                                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-line text-ink-3 text-sm font-semibold rounded-xl hover:bg-surface-2 hover:border-gray-300 transition-colors duration-200 ${
                                                        product.contact_whatsapp || product.contact_phone ? '' : 'flex-1'
                                                    }`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Detail
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Top accent line */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-24">
                            <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center">
                                <svg className="w-14 h-14 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-ink-2 mb-2">Belum Ada Produk</h3>
                            <p className="text-ink-4 text-base max-w-md mx-auto">
                                Produk yang tersedia akan ditampilkan di sini. Silakan coba kategori lain atau kembali lagi nanti.
                            </p>
                            {filter && filter !== 'all' && (
                                <button
                                    onClick={() => applyFilter('all')}
                                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-full font-medium hover:bg-brand-strong transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Tampilkan Semua
                                </button>
                            )}
                            <div className="mt-8">
                                <Link
                                    href="/umkm/submit"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-full font-semibold hover:bg-brand-strong transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Daftarkan Produk Pertama
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {products.links.length > 3 && (
                        <div className="mt-12 flex justify-center">
                            <nav className="flex items-center gap-1">
                                {products.links.map((link, index) => (
                                    <span key={index}>
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    link.active
                                                        ? 'bg-brand text-white shadow-sm'
                                                        : 'text-ink-2 hover:bg-surface-3'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                className="px-4 py-2 rounded-lg text-sm font-medium text-ink-4 cursor-not-allowed"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )}
                                    </span>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
