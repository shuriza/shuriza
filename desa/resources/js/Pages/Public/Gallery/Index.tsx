import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useCallback, useEffect } from 'react';

interface Photo {
    id: number;
    title: string;
    album: string | null;
    image_url: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedPhotos {
    data: Photo[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    photos: PaginatedPhotos;
    albums: string[];
    filter: string;
}

export default function GalleryIndex({ photos, albums, filter }: Props) {
    const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
        open: false,
        index: 0,
    });

    const openLightbox = (index: number) => {
        setLightbox({ open: true, index });
    };

    const closeLightbox = () => {
        setLightbox({ open: false, index: 0 });
    };

    const navigateLightbox = useCallback(
        (direction: 'prev' | 'next') => {
            setLightbox((prev) => {
                const total = photos.data.length;
                let newIndex = direction === 'next' ? prev.index + 1 : prev.index - 1;
                if (newIndex < 0) newIndex = total - 1;
                if (newIndex >= total) newIndex = 0;
                return { ...prev, index: newIndex };
            });
        },
        [photos.data.length]
    );

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!lightbox.open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox('prev');
            if (e.key === 'ArrowRight') navigateLightbox('next');
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [lightbox.open, navigateLightbox]);

    const handleFilter = (album: string) => {
        router.get('/galeri', album ? { album } : {}, {
            preserveState: true,
            preserveScroll: false,
        });
    };

    return (
        <PublicLayout>
            <Head title="Galeri Foto - Desa Muneng" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-24 md:py-32 overflow-hidden">
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 border border-white/30 rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 border border-white/20 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full"></div>
                </div>
                {/* Dot pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                {/* Decorative SVG icon */}
                <div className="absolute top-12 right-12 opacity-10">
                    <svg className="w-48 h-48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div className="absolute bottom-12 left-12 opacity-10">
                    <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-surface-1/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium">Galeri Foto</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                        Galeri Foto Desa Muneng
                    </h1>
                    <p className="text-lg md:text-xl text-emerald-200 max-w-2xl mx-auto">
                        Kumpulan momen dan kegiatan warga Desa Muneng yang terabadikan dalam foto
                    </p>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Filter Section */}
            <section className="sticky top-16 z-30 bg-surface-1/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <button
                            onClick={() => handleFilter('')}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                !filter
                                    ? 'bg-brand text-white shadow-sm'
                                    : 'bg-gray-100 text-ink-2 hover:bg-brand-soft hover:text-brand-strong'
                            }`}
                        >
                            Semua
                        </button>
                        {albums.map((album) => (
                            <button
                                key={album}
                                onClick={() => handleFilter(album)}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                    filter === album
                                        ? 'bg-brand text-white shadow-sm'
                                        : 'bg-gray-100 text-ink-2 hover:bg-brand-soft hover:text-brand-strong'
                                }`}
                            >
                                {album}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Photo Grid */}
            <section className="py-12 md:py-16 bg-surface-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {photos.data.length > 0 ? (
                        <>
                            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                                {photos.data.map((photo, index) => (
                                    <div
                                        key={photo.id}
                                        className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                                        onClick={() => openLightbox(index)}
                                    >
                                        <img
                                            src={photo.image_url}
                                            alt={photo.title}
                                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <p className="text-white font-medium text-sm truncate">{photo.title}</p>
                                                {photo.album && (
                                                    <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-brand-soft0/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                                        {photo.album}
                                                    </span>
                                                )}
                                            </div>
                                            {/* Zoom icon */}
                                            <div className="absolute top-3 right-3">
                                                <div className="w-8 h-8 bg-surface-1/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {photos.links.length > 3 && (
                                <div className="mt-12 flex items-center justify-center">
                                    <nav className="flex items-center gap-1">
                                        {photos.links.map((link, index) => (
                                            <span key={index}>
                                                {link.url ? (
                                                    <Link
                                                        href={link.url}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                            link.active
                                                                ? 'bg-brand text-white shadow-sm'
                                                                : 'text-ink-2 hover:bg-brand-soft hover:text-brand-strong'
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
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-ink-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-ink-1 mb-2">Belum Ada Foto</h3>
                            <p className="text-ink-3">
                                {filter
                                    ? `Tidak ada foto untuk album "${filter}".`
                                    : 'Galeri foto masih kosong. Foto akan segera ditambahkan.'}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox Modal */}
            {lightbox.open && photos.data[lightbox.index] && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/95 backdrop-blur-sm"
                        onClick={closeLightbox}
                    ></div>

                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-surface-1/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-surface-1/20 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Previous Button */}
                    <button
                        onClick={() => navigateLightbox('prev')}
                        className="absolute left-4 z-10 w-12 h-12 bg-surface-1/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-surface-1/20 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={() => navigateLightbox('next')}
                        className="absolute right-4 z-10 w-12 h-12 bg-surface-1/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-surface-1/20 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Image */}
                    <div className="relative z-10 max-w-[90vw] max-h-[85vh] flex flex-col items-center">
                        <img
                            src={photos.data[lightbox.index].image_url}
                            alt={photos.data[lightbox.index].title}
                            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                        />
                        {/* Caption */}
                        <div className="mt-4 text-center">
                            <p className="text-white font-medium text-lg">
                                {photos.data[lightbox.index].title}
                            </p>
                            {photos.data[lightbox.index].album && (
                                <span className="inline-block mt-2 px-3 py-1 bg-brand-soft0/30 backdrop-blur-sm text-emerald-200 text-sm font-medium rounded-full border border-emerald-500/30">
                                    {photos.data[lightbox.index].album}
                                </span>
                            )}
                            <p className="text-ink-4 text-sm mt-2">
                                {lightbox.index + 1} / {photos.data.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
