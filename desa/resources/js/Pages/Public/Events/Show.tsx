import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ShareButton from '@/Components/ui/ShareButton';

interface Event {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    event_date: string;
    event_time: string | null;
    location: string;
    category: string;
    image: string | null;
}

interface RelatedEvent {
    id: number;
    title: string;
    slug: string;
    event_date: string;
    location: string;
    category: string;
    image: string | null;
}

interface EventShowProps {
    event: Event;
    relatedEvents: RelatedEvent[];
}

function formatDate(dateString: string): string {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const date = new Date(dateString);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getCategoryBadgeColor(category: string): string {
    switch (category?.toLowerCase()) {
        case 'budaya': return 'bg-purple-100 text-purple-700';
        case 'keagamaan': return 'bg-amber-100 text-amber-700';
        case 'sosial': return 'bg-blue-100 text-blue-700';
        case 'olahraga': return 'bg-red-100 text-red-700';
        case 'pendidikan': return 'bg-cyan-100 text-cyan-700';
        default: return 'bg-brand-soft text-brand-strong';
    }
}

export default function EventShow({ event, relatedEvents }: EventShowProps) {
    return (
        <PublicLayout>
            <Head title={`${event.title} - Acara Desa Muneng`} />

            {/* Hero / Header */}
            <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-16 md:py-24 overflow-hidden">
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute top-10 right-10 opacity-10">
                    <svg className="w-40 h-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div className="absolute bottom-10 left-10 opacity-10">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/acara"
                        className="inline-flex items-center gap-2 bg-surface-1/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-emerald-200 hover:text-white hover:bg-surface-1/20 transition-all duration-300 mb-8"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Acara
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(event.category)}`}>
                            {event.category}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-4xl">
                        {event.title}
                    </h1>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Info Bar - Glass morphism on dark */}
            <section className="relative -mt-1 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-surface-1 rounded-2xl shadow-lg border border-line p-6 -mt-6 relative z-10">
                        <div className="flex flex-wrap gap-6 items-center justify-between">
                            <div className="flex flex-wrap gap-6">
                                <div className="flex items-center gap-3 text-ink-2">
                                    <div className="w-10 h-10 bg-brand-soft rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-brand-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs text-ink-3">Tanggal</div>
                                        <div className="text-sm font-semibold">{formatDate(event.event_date)}</div>
                                    </div>
                                </div>
                                {event.event_time && (
                                    <div className="flex items-center gap-3 text-ink-2">
                                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-xs text-ink-3">Waktu</div>
                                            <div className="text-sm font-semibold">{event.event_time}</div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-ink-2">
                                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs text-ink-3">Lokasi</div>
                                        <div className="text-sm font-semibold">{event.location}</div>
                                    </div>
                                </div>
                            </div>
                            <ShareButton title={event.title} url={`/acara/${event.slug}`} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 md:py-16 bg-surface-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {event.image && (
                            <div className="rounded-2xl overflow-hidden mb-10 shadow-lg">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="bg-surface-1 rounded-2xl shadow-sm border border-line p-8 md:p-12">
                            <div className="prose prose-lg prose-emerald max-w-none text-ink-2">
                                <div dangerouslySetInnerHTML={{ __html: event.content }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Events - Dark Section */}
            {relatedEvents && relatedEvents.length > 0 && (
                <section className="relative py-16 md:py-20 bg-gradient-to-br from-emerald-900 to-teal-900 overflow-hidden">
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Acara Terkait</h2>
                            <div className="w-16 h-1 bg-emerald-400 mx-auto rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedEvents.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/acara/${related.slug}`}
                                    className="group bg-surface-1/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-surface-1/15 hover:-translate-y-1 transition-all duration-300"
                                >
                                    {related.image && (
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={related.image}
                                                alt={related.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(related.category)}`}>
                                            {related.category}
                                        </span>
                                        <h4 className="font-semibold text-white group-hover:text-emerald-200 transition-colors mt-3 mb-2 line-clamp-2">
                                            {related.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-emerald-300">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {formatDate(related.event_date)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
