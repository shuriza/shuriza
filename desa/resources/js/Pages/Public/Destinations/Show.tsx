import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState } from 'react';

interface DestinationImage {
    id: number;
    url: string;
    caption: string | null;
}

interface Destination {
    id: number;
    name: string;
    slug: string;
    description: string;
    content: string;
    category: string;
    address: string | null;
    featured_image: string | null;
    images: DestinationImage[];
}

interface RelatedDestination {
    id: number;
    name: string;
    slug: string;
    description: string;
    category: string;
    featured_image: string | null;
}

interface DestinationShowProps {
    destination: Destination;
    relatedDestinations: RelatedDestination[];
}

function getCategoryColor(category: string): string {
    switch (category?.toLowerCase()) {
        case 'fasilitas': return 'bg-blue-100 text-blue-700';
        case 'wisata': return 'bg-brand-soft text-brand-strong';
        case 'suasana': return 'bg-amber-100 text-amber-700';
        default: return 'bg-gray-100 text-ink-2';
    }
}

export default function DestinationShow({ destination, relatedDestinations }: DestinationShowProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const allImages = [
        ...(destination.featured_image ? [{ id: 0, url: destination.featured_image, caption: destination.name }] : []),
        ...destination.images,
    ];

    return (
        <PublicLayout>
            <Head title={`${destination.name} - Destinasi Desa Muneng`} />

            {/* Hero */}
            <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-16 md:py-24 overflow-hidden">
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute top-10 right-10 opacity-10">
                    <svg className="w-40 h-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div className="absolute bottom-16 left-10 opacity-10">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/destinasi"
                        className="inline-flex items-center gap-2 bg-surface-1/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-emerald-200 hover:text-white hover:bg-surface-1/20 transition-all duration-300 mb-8"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Destinasi
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(destination.category)}`}>
                            {destination.category}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-4xl">
                        {destination.name}
                    </h1>
                    {destination.address && (
                        <div className="flex items-center gap-2 mt-4 text-emerald-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{destination.address}</span>
                        </div>
                    )}
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Image Gallery */}
            {allImages.length > 0 && (
                <section className="py-8 bg-surface-1">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                            <img
                                src={selectedImage || allImages[0].url}
                                alt={destination.name}
                                className="w-full h-72 md:h-[500px] object-cover cursor-pointer transition-transform duration-500"
                                onClick={() => setSelectedImage(selectedImage || allImages[0].url)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                        </div>

                        {/* Thumbnail Grid */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-4">
                                {allImages.map((image) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImage(image.url)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                                            (selectedImage || allImages[0].url) === image.url
                                                ? 'border-emerald-500 ring-2 ring-emerald-200 shadow-md'
                                                : 'border-transparent hover:border-emerald-300'
                                        }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.caption || destination.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Content Section */}
            <section className="py-12 md:py-16 bg-surface-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="bg-surface-1 rounded-2xl shadow-sm border border-line p-8 md:p-10">
                                {/* Description */}
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                                        <h2 className="text-2xl font-bold text-ink-1">Tentang</h2>
                                    </div>
                                    <p className="text-ink-2 text-lg leading-relaxed">{destination.description}</p>
                                </div>

                                {/* Full Content */}
                                {destination.content && (
                                    <div className="prose prose-lg prose-emerald max-w-none text-ink-2">
                                        <div dangerouslySetInnerHTML={{ __html: destination.content }} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Info Card - Glass morphism style */}
                                <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-2xl p-6 text-white relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                                    <div className="relative">
                                        <h3 className="text-lg font-bold mb-4">Informasi</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-9 h-9 bg-surface-1/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-emerald-300">Kategori</div>
                                                    <div className="font-medium text-white">{destination.category}</div>
                                                </div>
                                            </div>
                                            {destination.address && (
                                                <div className="flex items-start gap-3">
                                                    <div className="w-9 h-9 bg-surface-1/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-emerald-300">Alamat</div>
                                                        <div className="font-medium text-white">{destination.address}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Related Destinations */}
                                {relatedDestinations && relatedDestinations.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-ink-1 mb-4">Destinasi Terkait</h3>
                                        <div className="space-y-4">
                                            {relatedDestinations.map((related) => (
                                                <Link
                                                    key={related.id}
                                                    href={`/destinasi/${related.slug}`}
                                                    className="group flex gap-4 bg-surface-1 rounded-xl overflow-hidden border border-line hover:border-brand-soft hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                                >
                                                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
                                                        {related.featured_image ? (
                                                            <img
                                                                src={related.featured_image}
                                                                alt={related.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                                                                <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="py-3 pr-3 flex flex-col justify-center">
                                                        <span className={`self-start px-2 py-0.5 rounded-full text-xs font-medium mb-1 ${getCategoryColor(related.category)}`}>
                                                            {related.category}
                                                        </span>
                                                        <h4 className="font-semibold text-ink-1 group-hover:text-brand-strong transition-colors text-sm line-clamp-1">
                                                            {related.name}
                                                        </h4>
                                                        <p className="text-ink-3 text-xs line-clamp-1 mt-0.5">{related.description}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 w-10 h-10 bg-surface-1/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-surface-1/20 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={selectedImage}
                        alt={destination.name}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </PublicLayout>
    );
}
