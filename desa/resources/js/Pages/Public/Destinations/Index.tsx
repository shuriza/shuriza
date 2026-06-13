import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface Destination {
    id: number;
    name: string;
    slug: string;
    description: string;
    category: string;
    featured_image: string | null;
}

interface DestinationsIndexProps {
    destinations: Destination[];
    filter: string;
}

const filterTabs = [
    { label: 'Semua', value: '', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { label: 'Fasilitas', value: 'fasilitas', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'Wisata', value: 'wisata', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Suasana', value: 'suasana', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
];

function getCategoryIcon(category: string): string {
    switch (category?.toLowerCase()) {
        case 'fasilitas': return 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4';
        case 'wisata': return 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
        case 'suasana': return 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z';
        default: return 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z';
    }
}

function getCategoryColor(category: string): { badge: string; accent: string } {
    switch (category?.toLowerCase()) {
        case 'fasilitas': return { badge: 'bg-blue-100 text-blue-700 border-blue-200', accent: 'from-blue-500 to-blue-600' };
        case 'wisata': return { badge: 'bg-brand-soft text-brand-strong border-brand-soft', accent: 'from-brand-ring to-brand' };
        case 'suasana': return { badge: 'bg-amber-100 text-amber-700 border-amber-200', accent: 'from-amber-500 to-amber-600' };
        default: return { badge: 'bg-surface-3 text-ink-2 border-line', accent: 'from-gray-500 to-gray-600' };
    }
}

export default function DestinationsIndex({ destinations, filter }: DestinationsIndexProps) {
    function applyFilter(value: string) {
        const params: Record<string, string> = {};
        if (value) params.filter = value;
        router.get('/destinasi', params, { preserveState: true, preserveScroll: true });
    }

    return (
        <PublicLayout>
            <Head title="Destinasi - Desa Muneng" />

            {/* ===== HERO SECTION ===== */}
            <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
                {/* Decorative background patterns */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="absolute top-10 left-10 w-72 h-72 bg-teal-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-56 h-56 bg-brand/15 rounded-full blur-3xl"></div>

                {/* Decorative compass/map SVG */}
                <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 opacity-10">
                    <svg className="w-48 h-48 md:w-72 md:h-72 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                </div>

                {/* Decorative floating elements */}
                <div className="absolute top-20 left-1/4 w-2 h-2 bg-emerald-400/40 rounded-full"></div>
                <div className="absolute top-32 right-1/3 w-3 h-3 bg-teal-300/30 rounded-full"></div>
                <div className="absolute bottom-24 left-1/3 w-2 h-2 bg-emerald-300/40 rounded-full"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-1/10 backdrop-blur-sm border border-white/20 text-emerald-200 text-sm font-medium mb-6">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Jelajahi Desa
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
                        Destinasi Desa Muneng
                    </h1>
                    <p className="text-lg md:text-xl text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
                        Jelajahi berbagai tempat menarik, fasilitas, dan suasana indah di Desa Muneng
                    </p>
                </div>
            </section>

            {/* Wave Divider */}
            <div className="relative -mt-1">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
                    <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#f9fafb" />
                </svg>
            </div>

            {/* ===== DESTINATIONS GRID ===== */}
            <section className="py-16 md:py-24 bg-surface-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-3 mb-12 justify-center">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => applyFilter(tab.value)}
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                                    (filter || '') === tab.value
                                        ? 'bg-gradient-to-r from-brand to-teal-600 text-white shadow-lg shadow-brand-ring/25 scale-105'
                                        : 'bg-surface-1 text-ink-3 border border-line hover:border-emerald-300 hover:text-brand-strong hover:shadow-md hover:-translate-y-0.5'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                                </svg>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Destinations Grid */}
                    {destinations.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {destinations.map((destination) => {
                                const colors = getCategoryColor(destination.category);
                                return (
                                    <Link
                                        key={destination.id}
                                        href={`/destinasi/${destination.slug}`}
                                        className="group relative bg-surface-1 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-line hover:border-brand-soft hover:-translate-y-2"
                                    >
                                        {/* Image with overlay */}
                                        <div className="aspect-[4/3] overflow-hidden relative">
                                            {destination.featured_image ? (
                                                <>
                                                    <img
                                                        src={destination.featured_image}
                                                        alt={destination.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                                                </>
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-teal-50 to-brand-soft flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-emerald-200/50 flex items-center justify-center">
                                                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={getCategoryIcon(destination.category)} />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Category badge on image */}
                                            <div className="absolute top-4 left-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm bg-surface-1/90 ${colors.badge}`}>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getCategoryIcon(destination.category)} />
                                                    </svg>
                                                    {destination.category}
                                                </span>
                                            </div>

                                            {/* Bottom gradient overlay with name on hover */}
                                            {destination.featured_image && (
                                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                    <span className="text-white text-sm font-medium flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        Lihat Detail
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-ink-1 group-hover:text-brand-strong transition-colors mb-2">
                                                {destination.name}
                                            </h3>
                                            <p className="text-ink-3 text-sm line-clamp-2 leading-relaxed">{destination.description}</p>

                                            {/* View link */}
                                            <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
                                                <span className="text-brand-strong text-sm font-semibold group-hover:text-brand-strong transition-colors flex items-center gap-1.5">
                                                    Jelajahi
                                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </span>
                                                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${colors.accent} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Top accent line */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-24">
                            <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center">
                                <svg className="w-14 h-14 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-ink-2 mb-2">Belum Ada Destinasi</h3>
                            <p className="text-ink-4 text-base max-w-md mx-auto">
                                Destinasi yang tersedia akan ditampilkan di sini. Silakan coba filter lain atau kembali lagi nanti.
                            </p>
                            {filter && (
                                <button
                                    onClick={() => applyFilter('')}
                                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-full font-medium hover:bg-brand-strong transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Tampilkan Semua
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
