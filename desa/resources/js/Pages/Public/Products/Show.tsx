import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number | null;
    price_note: string | null;
    category: string;
    image: string | null;
    contact_name: string;
    contact_phone: string | null;
    contact_whatsapp: string | null;
}

interface ProductShowProps {
    product: Product;
    relatedProducts: Product[];
}

function getCategoryColor(category: string): { badge: string; gradient: string } {
    switch (category) {
        case 'makanan': return { badge: 'bg-orange-100 text-orange-700 border-orange-200', gradient: 'from-orange-400 to-red-400' };
        case 'minuman': return { badge: 'bg-sky-100 text-sky-700 border-sky-200', gradient: 'from-sky-400 to-blue-400' };
        case 'kerajinan': return { badge: 'bg-purple-100 text-purple-700 border-purple-200', gradient: 'from-purple-400 to-indigo-400' };
        case 'pertanian': return { badge: 'bg-emerald-100 text-brand-strong border-emerald-200', gradient: 'from-emerald-400 to-green-400' };
        case 'jasa': return { badge: 'bg-amber-100 text-amber-700 border-amber-200', gradient: 'from-amber-400 to-yellow-500' };
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

function getWhatsAppUrl(phone: string, productName: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const message = encodeURIComponent(`Halo, saya tertarik dengan produk "${productName}" yang ada di website Desa Muneng. Apakah masih tersedia?`);
    return `https://wa.me/${waPhone}?text=${message}`;
}

export default function ProductShow({ product, relatedProducts }: ProductShowProps) {
    const colors = getCategoryColor(product.category);

    return (
        <PublicLayout>
            <Head title={`${product.name} - UMKM Desa Muneng`} />

            {/* ===== HERO SECTION (short) ===== */}
            <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="absolute top-10 left-10 w-72 h-72 bg-teal-600/20 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/umkm" className="inline-flex items-center gap-2 text-emerald-200 hover:text-white text-sm font-medium mb-4 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke UMKM
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        {product.name}
                    </h1>
                </div>
            </section>

            {/* Wave Divider */}
            <div className="relative -mt-1">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
                    <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#f9fafb" />
                </svg>
            </div>

            {/* ===== PRODUCT DETAIL ===== */}
            <section className="py-16 bg-surface-2">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Image */}
                        <div className="aspect-square rounded-2xl overflow-hidden bg-surface-1 border border-line shadow-sm">
                            {product.image ? (
                                <img
                                    src={`/storage/${product.image}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${colors.gradient} opacity-20 flex items-center justify-center relative`}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-24 h-24 rounded-full bg-surface-1/40 backdrop-blur-sm flex items-center justify-center">
                                            <svg className="w-12 h-12 text-ink-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="space-y-6">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${colors.badge}`}>
                                {getCategoryLabel(product.category)}
                            </span>

                            <h2 className="text-2xl md:text-3xl font-bold text-ink-1">{product.name}</h2>

                            {/* Price */}
                            <div>
                                {product.price !== null && Number(product.price) > 0 ? (
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-brand-strong">
                                            Rp {new Intl.NumberFormat('id-ID').format(Number(product.price))}
                                        </span>
                                        {product.price_note && (
                                            <span className="text-base text-ink-4">/ {product.price_note}</span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-xl font-semibold text-amber-600">
                                        {product.price_note || 'Hubungi Penjual'}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div className="prose prose-gray max-w-none">
                                    <p className="text-ink-3 leading-relaxed whitespace-pre-line">{product.description}</p>
                                </div>
                            )}

                            {/* Contact Info */}
                            <div className="bg-surface-1 rounded-xl border border-line p-5 space-y-3">
                                <h3 className="font-semibold text-ink-1">Informasi Penjual</h3>
                                <div className="flex items-center gap-3 text-ink-3">
                                    <svg className="w-5 h-5 text-ink-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>{product.contact_name}</span>
                                </div>
                                {product.contact_phone && (
                                    <div className="flex items-center gap-3 text-ink-3">
                                        <svg className="w-5 h-5 text-ink-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <a href={`tel:${product.contact_phone}`} className="hover:text-brand-strong transition-colors">
                                            {product.contact_phone}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {product.contact_whatsapp && (
                                    <a
                                        href={getWhatsAppUrl(product.contact_whatsapp, product.name)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors duration-200 shadow-sm"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                        Hubungi via WhatsApp
                                    </a>
                                )}
                                {product.contact_phone && (
                                    <a
                                        href={`tel:${product.contact_phone}`}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-emerald-200 text-brand-strong font-semibold rounded-xl hover:bg-brand-soft transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Telepon
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16 pt-12 border-t border-line">
                            <h3 className="text-xl font-bold text-ink-1 mb-8">Produk Serupa</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((related) => {
                                    const relColors = getCategoryColor(related.category);
                                    return (
                                        <Link
                                            key={related.id}
                                            href={`/umkm/${related.slug}`}
                                            className="group bg-surface-1 rounded-xl border border-line overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <div className="aspect-[4/3] overflow-hidden">
                                                {related.image ? (
                                                    <img src={`/storage/${related.image}`} alt={related.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className={`w-full h-full bg-gradient-to-br ${relColors.gradient} opacity-15 flex items-center justify-center`}>
                                                        <svg className="w-8 h-8 text-line-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-semibold text-ink-1 text-sm line-clamp-1 group-hover:text-brand-strong transition-colors">{related.name}</h4>
                                                <p className="text-brand-strong font-bold text-sm mt-1">
                                                    {related.price ? `Rp ${new Intl.NumberFormat('id-ID').format(Number(related.price))}` : 'Hubungi Penjual'}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
