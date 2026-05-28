import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface Announcement {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    image: string | null;
    is_pinned: boolean;
    published_at: string;
    user: {
        id: number;
        name: string;
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedAnnouncements {
    data: Announcement[];
    links: PaginationLink[];
}

interface AnnouncementsIndexProps {
    announcements: PaginatedAnnouncements;
    pinned: Announcement[];
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

function formatMonthShort(dateString: string): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const date = new Date(dateString);
    return months[date.getMonth()];
}

function truncateText(text: string, maxLength: number = 150): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

export default function AnnouncementsIndex({ announcements, pinned }: AnnouncementsIndexProps) {
    return (
        <PublicLayout>
            <Head title="Berita & Pengumuman - Desa Muneng" />

            {/* ===== HERO SECTION ===== */}
            <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
                {/* Decorative background patterns */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="absolute top-10 right-20 w-72 h-72 bg-brand/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-56 h-56 bg-teal-500/15 rounded-full blur-3xl"></div>

                {/* Decorative newspaper SVG */}
                <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 opacity-10">
                    <svg className="w-48 h-48 md:w-72 md:h-72 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                </div>

                {/* Decorative lines */}
                <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent to-emerald-400/30"></div>
                <div className="absolute bottom-1/3 right-0 w-24 h-px bg-gradient-to-l from-transparent to-teal-400/30"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-1/10 backdrop-blur-sm border border-white/20 text-emerald-200 text-sm font-medium mb-6">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        Informasi Desa
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
                        Berita & Pengumuman
                    </h1>
                    <p className="text-lg md:text-xl text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
                        Informasi terbaru seputar kegiatan dan pengumuman Desa Muneng
                    </p>
                </div>
            </section>

            {/* Wave Divider */}
            <div className="relative -mt-1">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
                    <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#064e3b" />
                </svg>
            </div>

            {/* ===== PINNED ANNOUNCEMENTS - Dark Section ===== */}
            {pinned && pinned.length > 0 && (
                <section className="relative py-20 md:py-28 bg-emerald-900 overflow-hidden">
                    {/* Dot pattern */}
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="absolute top-20 right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-10 w-40 h-40 bg-brand-soft0/10 rounded-full blur-3xl"></div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white">Disematkan</h2>
                            </div>
                            <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-amber-500/30 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pinned.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/berita/${item.slug}`}
                                    className="group relative bg-surface-1/5 backdrop-blur-sm rounded-2xl border border-amber-500/20 hover:border-amber-400/50 transition-all duration-300 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10"
                                >
                                    {/* Top accent border - amber/gold for pinned */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-400"></div>

                                    {/* Pinned Badge */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/90 text-white shadow-lg shadow-amber-500/25 backdrop-blur-sm">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                                            </svg>
                                            Disematkan
                                        </span>
                                    </div>

                                    {item.image ? (
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent"></div>
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-gradient-to-br from-amber-900/30 via-emerald-900/20 to-teal-900/30 flex items-center justify-center relative">
                                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, transparent 75%)', backgroundSize: '20px 20px' }}></div>
                                            <svg className="w-14 h-14 text-amber-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                            </svg>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-3 line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-white/60 text-sm line-clamp-2 mb-5">
                                            {item.excerpt || truncateText(item.content.replace(/<[^>]*>/g, ''))}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs text-emerald-200/70">
                                                <svg className="w-4 h-4 text-amber-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {formatDate(item.published_at)}
                                            </div>
                                            <span className="text-amber-400 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                                                Baca
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Hover glow */}
                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: 'inset 0 0 30px rgba(245, 158, 11, 0.08)' }}></div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Angled Divider */}
            <div className="relative">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block -mb-1">
                    <path d="M0 80L1440 0V80H0Z" fill="#ffffff" />
                </svg>
            </div>

            {/* ===== ALL ANNOUNCEMENTS - Light Section ===== */}
            <section className="py-20 md:py-28 bg-surface-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-brand-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            <h2 className="text-3xl md:text-4xl font-bold text-ink-1">Semua Berita</h2>
                        </div>
                        <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent"></div>
                    </div>

                    {announcements.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {announcements.data.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/berita/${item.slug}`}
                                        className="group relative bg-surface-1 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-line hover:border-brand-soft hover:-translate-y-2"
                                    >
                                        {/* Top accent */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.is_pinned ? 'from-amber-400 to-yellow-400' : 'from-emerald-400 to-teal-400'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                                        {/* Image or placeholder */}
                                        <div className="relative">
                                            {item.image ? (
                                                <div className="aspect-video overflow-hidden">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                            ) : (
                                                <div className="aspect-video bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex items-center justify-center relative overflow-hidden">
                                                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(135deg, rgba(16,185,129,0.1) 25%, transparent 25%, transparent 50%, rgba(16,185,129,0.1) 50%, rgba(16,185,129,0.1) 75%, transparent 75%)', backgroundSize: '20px 20px' }}></div>
                                                    <svg className="w-12 h-12 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Date badge */}
                                            <div className="absolute top-4 right-4">
                                                <div className="bg-surface-1/95 backdrop-blur-sm rounded-xl px-3 py-2 text-center shadow-lg border border-line">
                                                    <span className="block text-xl font-bold text-brand-strong leading-none">{formatDay(item.published_at)}</span>
                                                    <span className="block text-xs font-semibold text-brand-strong uppercase mt-0.5">{formatMonthShort(item.published_at)}</span>
                                                </div>
                                            </div>

                                            {/* Pinned indicator */}
                                            {item.is_pinned && (
                                                <div className="absolute top-4 left-4">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-md">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                                                        </svg>
                                                        Penting
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-ink-1 group-hover:text-brand-strong transition-colors mb-3 line-clamp-2 leading-snug">
                                                {item.title}
                                            </h3>
                                            <p className="text-ink-3 text-sm line-clamp-2 mb-5 leading-relaxed">
                                                {item.excerpt || truncateText(item.content.replace(/<[^>]*>/g, ''))}
                                            </p>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-4 border-t border-line">
                                                <div className="flex items-center gap-2 text-xs text-ink-4">
                                                    <div className="w-6 h-6 rounded-full bg-brand-soft flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-brand-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <span>{item.user.name}</span>
                                                </div>
                                                <span className="inline-flex items-center gap-1.5 text-brand-strong text-sm font-semibold group-hover:text-brand-strong group-hover:gap-2.5 transition-all duration-300">
                                                    Baca selengkapnya
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-16 flex justify-center">
                                <nav className="inline-flex items-center gap-2 p-2 bg-surface-2 rounded-2xl border border-line">
                                    {announcements.links.map((link, index) => (
                                        <span key={index}>
                                            {link.url ? (
                                                <Link
                                                    href={link.url}
                                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 inline-block ${
                                                        link.active
                                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                                                            : 'text-ink-3 hover:bg-surface-1 hover:text-brand-strong hover:shadow-sm'
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
                        <div className="text-center py-24">
                            <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center">
                                <svg className="w-14 h-14 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-ink-2 mb-2">Belum Ada Berita</h3>
                            <p className="text-ink-4 text-base max-w-md mx-auto">
                                Berita dan pengumuman terbaru akan ditampilkan di sini.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
