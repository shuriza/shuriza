import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface Event {
    id: number;
    title: string;
    slug: string;
    description: string;
    event_date: string;
    location: string;
    image: string | null;
    category: { id: number; name: string; slug: string } | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedEvents {
    data: Event[];
    links: PaginationLink[];
}

interface EventsIndexProps {
    upcomingEvents: Event[];
    pastEvents: PaginatedEvents;
}

function formatDate(dateString: string): string {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const date = new Date(dateString);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDay(dateString: string): string {
    const date = new Date(dateString);
    return String(date.getDate()).padStart(2, '0');
}

function formatMonth(dateString: string): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const date = new Date(dateString);
    return months[date.getMonth()];
}

function getCategoryBadgeColor(category: string): string {
    switch (category?.toLowerCase()) {
        case 'budaya': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
        case 'keagamaan': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
        case 'sosial': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        case 'olahraga': return 'bg-red-500/20 text-red-300 border-red-500/30';
        case 'pendidikan': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
        default: return 'bg-brand/20 text-emerald-300 border-emerald-500/30';
    }
}

function getCategoryBadgeColorLight(category: string): string {
    switch (category?.toLowerCase()) {
        case 'budaya': return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'keagamaan': return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'sosial': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'olahraga': return 'bg-red-100 text-red-700 border-red-200';
        case 'pendidikan': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
        default: return 'bg-brand-soft text-brand-strong border-brand-soft';
    }
}

export default function EventsIndex({ upcomingEvents, pastEvents }: EventsIndexProps) {
    return (
        <PublicLayout>
            <Head title="Acara - Desa Muneng" />

            {/* ===== HERO SECTION ===== */}
            <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
                {/* Decorative background patterns */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="absolute top-10 right-10 w-72 h-72 bg-brand/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-56 h-56 bg-teal-500/15 rounded-full blur-3xl"></div>

                {/* Decorative SVG calendar icon */}
                <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 opacity-10">
                    <svg className="w-48 h-48 md:w-72 md:h-72 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-1/10 backdrop-blur-sm border border-white/20 text-emerald-200 text-sm font-medium mb-6">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Agenda Desa
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
                        Acara Desa Muneng
                    </h1>
                    <p className="text-lg md:text-xl text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
                        Informasi kegiatan dan acara yang diselenggarakan di Desa Muneng, Kecamatan Purwoasri
                    </p>
                </div>
            </section>

            {/* Wave Divider */}
            <div className="relative -mt-1">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
                    <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#064e3b" />
                </svg>
            </div>

            {/* ===== UPCOMING EVENTS - Dark Section ===== */}
            {upcomingEvents && upcomingEvents.length > 0 && (
                <section className="relative py-20 md:py-28 bg-emerald-900 overflow-hidden">
                    {/* Dot pattern */}
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="absolute top-20 left-10 w-40 h-40 bg-brand/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl"></div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white">Acara Mendatang</h2>
                            </div>
                            <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {upcomingEvents.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/acara/${event.slug}`}
                                    className="group relative bg-surface-1/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-emerald-400/50 transition-all duration-300 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10"
                                >
                                    {/* Top accent border */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400"></div>

                                    {event.image && (
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent"></div>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            {event.category && (
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryBadgeColor(event.category.name)}`}>
                                                    {event.category.name}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-3">
                                            {event.title}
                                        </h3>
                                        <p className="text-white/60 text-sm line-clamp-2 mb-5">{event.description}</p>

                                        <div className="flex flex-col gap-3 text-sm">
                                            <div className="flex items-center gap-3 text-emerald-200/80">
                                                <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <span>{formatDate(event.event_date)}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-emerald-200/80">
                                                <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <span>{event.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover glow */}
                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: 'inset 0 0 30px rgba(16, 185, 129, 0.1)' }}></div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Angled Divider */}
            <div className="relative">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block -mb-1">
                    <path d="M0 80L1440 0V80H0Z" fill="#f9fafb" />
                </svg>
            </div>

            {/* ===== PAST EVENTS - Light Section ===== */}
            <section className="py-20 md:py-28 bg-surface-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-brand-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-3xl md:text-4xl font-bold text-ink-1">Acara Sebelumnya</h2>
                        </div>
                        <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent"></div>
                    </div>

                    {pastEvents.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pastEvents.data.map((event) => (
                                    <Link
                                        key={event.id}
                                        href={`/acara/${event.slug}`}
                                        className="group relative flex bg-surface-1 rounded-2xl overflow-hidden border border-line hover:border-brand-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        {/* Left accent */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Date badge */}
                                        <div className="flex-shrink-0 w-20 md:w-24 flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-teal-50 border-r border-line">
                                            <span className="text-2xl md:text-3xl font-bold text-brand-strong">{formatDay(event.event_date)}</span>
                                            <span className="text-xs font-semibold text-brand-strong uppercase">{formatMonth(event.event_date)}</span>
                                        </div>

                                        {event.image && (
                                            <div className="w-28 md:w-36 flex-shrink-0 overflow-hidden">
                                                <img
                                                    src={event.image}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}

                                        <div className="p-5 flex flex-col justify-center flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                {event.category && (
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryBadgeColorLight(event.category.name)}`}>
                                                        {event.category.name}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-ink-1 group-hover:text-brand-strong transition-colors mb-1 truncate">
                                                {event.title}
                                            </h3>
                                            <p className="text-ink-3 text-sm line-clamp-1 mb-3">{event.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-ink-3">
                                                <span className="flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 text-brand-ring" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {event.location}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Arrow indicator */}
                                        <div className="flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <svg className="w-5 h-5 text-brand-ring" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-14 flex justify-center">
                                <nav className="inline-flex items-center gap-2 p-2 bg-surface-1 rounded-2xl shadow-sm border border-line">
                                    {pastEvents.links.map((link, index) => (
                                        <span key={index}>
                                            {link.url ? (
                                                <Link
                                                    href={link.url}
                                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 inline-block ${
                                                        link.active
                                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                                                            : 'text-ink-3 hover:bg-brand-soft hover:text-brand-strong'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-ink-4 cursor-not-allowed inline-block"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )}
                                        </span>
                                    ))}
                                </nav>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface-3 flex items-center justify-center">
                                <svg className="w-12 h-12 text-ink-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-ink-3 text-lg font-medium">Belum ada acara sebelumnya</p>
                            <p className="text-ink-4 text-sm mt-2">Acara yang telah berlalu akan ditampilkan di sini</p>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
