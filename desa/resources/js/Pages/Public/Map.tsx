import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState } from 'react';

interface DestinationItem {
    id: number;
    name: string;
    slug: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    address: string;
}

interface MapProps {
    destinations: DestinationItem[];
    center: { lat: number; lng: number };
}

export default function Map({ destinations, center }: MapProps) {
    const categories = ['semua', ...Array.from(new Set(destinations.map((d) => d.category)))];
    const [activeCategory, setActiveCategory] = useState('semua');

    const filtered =
        activeCategory === 'semua'
            ? destinations
            : destinations.filter((d) => d.category === activeCategory);

    const categoryLabel = (cat: string): string => {
        switch (cat) {
            case 'fasilitas':
                return 'Fasilitas';
            case 'wisata':
                return 'Wisata';
            case 'suasana':
                return 'Suasana';
            case 'semua':
                return 'Semua';
            default:
                return cat.charAt(0).toUpperCase() + cat.slice(1);
        }
    };

    const categoryColor = (cat: string): string => {
        switch (cat) {
            case 'fasilitas':
                return 'bg-blue-100 text-blue-700';
            case 'wisata':
                return 'bg-brand-soft text-brand-strong';
            case 'suasana':
                return 'bg-amber-100 text-amber-700';
            default:
                return 'bg-surface-3 text-ink-2';
        }
    };

    const categoryIcon = (cat: string) => {
        switch (cat) {
            case 'fasilitas':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                );
            case 'wisata':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'suasana':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
        }
    };

    // Google Maps embed yang sudah terverifikasi untuk Desa Muneng
    const mapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2690.6447810900795!2d112.10396155214359!3d-7.6256617763219126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78469e782d258f%3A0x46a17eb93e3ee5f4!2sMuneng%2C%20Kec.%20Purwoasri%2C%20Kabupaten%20Kediri%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1778240753891!5m2!1sid!2sid';

    return (
        <PublicLayout>
            <Head title="Peta Desa Muneng" />

            {/* Hero Section (shorter) */}
            <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-16 md:py-20 overflow-hidden">
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 border border-white/30 rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 border border-white/20 rounded-full"></div>
                </div>
                {/* Dot pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                {/* Decorative SVG */}
                <div className="absolute top-8 right-12 opacity-10">
                    <svg className="w-40 h-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-1/10 backdrop-blur-sm border border-white/20 mb-5">
                        <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-3">Peta Desa Muneng</h1>
                    <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
                        Jelajahi lokasi-lokasi menarik di Desa Muneng, Kecamatan Purwoasri, Kabupaten Kediri
                    </p>
                </div>
            </section>

            {/* Map Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="bg-surface-1 rounded-2xl shadow-xl border border-line-subtle overflow-hidden">
                    <iframe
                        title="Peta Desa Muneng"
                        src={mapUrl}
                        className="w-full border-0"
                        style={{ height: '70vh', minHeight: '400px' }}
                        loading="lazy"
                        allowFullScreen
                    ></iframe>
                </div>
            </section>

            {/* Destinations List */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-ink-1 mb-2">Lokasi di Desa Muneng</h2>
                    <p className="text-ink-3">Temukan tempat-tempat menarik yang bisa Anda kunjungi</p>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                activeCategory === cat
                                    ? 'bg-brand text-white shadow-md'
                                    : 'bg-surface-1 text-ink-3 border border-line hover:border-emerald-300 hover:text-brand-strong'
                            }`}
                        >
                            {categoryLabel(cat)}
                        </button>
                    ))}
                </div>

                {/* Destination Cards */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16 bg-surface-1 rounded-2xl border border-line-subtle">
                        <svg className="w-16 h-16 text-line-strong mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-ink-3">Belum ada lokasi dengan koordinat yang tersedia.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((dest) => (
                            <Link
                                key={dest.id}
                                href={`/destinasi/${dest.slug}`}
                                className="group bg-surface-1 rounded-2xl border border-line-subtle p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${categoryColor(dest.category)}`}>
                                        {categoryIcon(dest.category)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-ink-1 group-hover:text-brand-strong transition-colors mb-1 truncate">
                                            {dest.name}
                                        </h3>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor(dest.category)} mb-2`}>
                                            {categoryLabel(dest.category)}
                                        </span>
                                        {dest.address && (
                                            <p className="text-sm text-ink-3 flex items-start gap-1 mt-1">
                                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="line-clamp-2">{dest.address}</span>
                                            </p>
                                        )}
                                    </div>
                                    <svg className="w-5 h-5 text-line-strong group-hover:text-brand-ring transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
