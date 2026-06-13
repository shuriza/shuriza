import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import LikeButton from '@/Components/ui/LikeButton';
import CommentSection from '@/Components/ui/CommentSection';
import ShareButton from '@/Components/ui/ShareButton';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
}

interface Comment {
    id: number;
    user: User;
    content: string;
    created_at: string;
}

interface Announcement {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    image: string | null;
    published_at: string;
    user: User;
    likes_count: number;
    is_liked: boolean;
    comments: Comment[];
}

interface RelatedAnnouncement {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    published_at: string;
    excerpt: string | null;
}

interface AnnouncementShowProps {
    announcement: Announcement;
    relatedAnnouncements: RelatedAnnouncement[];
}

function formatDate(dateString: string): string {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const date = new Date(dateString);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default function AnnouncementShow({ announcement, relatedAnnouncements }: AnnouncementShowProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <PublicLayout>
            <Head title={`${announcement.title} - Berita Desa Muneng`} />

            {/* Hero / Header */}
            <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-16 md:py-24 overflow-hidden">
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute top-10 right-10 opacity-10">
                    <svg className="w-40 h-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                </div>
                <div className="absolute bottom-16 left-10 opacity-10">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/berita"
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-emerald-200 hover:text-white hover:bg-white/20 transition-all duration-300 mb-8"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Berita
                    </Link>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-4xl">
                        {announcement.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 mt-6">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                            <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-emerald-100">{formatDate(announcement.published_at)}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                            <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm text-emerald-100">{announcement.user.name}</span>
                        </div>
                    </div>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {announcement.image && (
                        <div className="rounded-2xl overflow-hidden mb-10 shadow-lg">
                            <img
                                src={announcement.image}
                                alt={announcement.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    {/* Article Content */}
                    <div className="bg-white rounded-2xl">
                        <div className="prose prose-lg prose-emerald max-w-none text-ink-2">
                            <div dangerouslySetInnerHTML={{ __html: announcement.content }} />
                        </div>
                    </div>

                    {/* Share & Like Section */}
                    <div className="mt-10 pt-8 border-t border-line-subtle">
                        <div className="flex flex-wrap items-center gap-4">
                            <LikeButton
                                likeable_type="announcement"
                                likeable_id={announcement.id}
                                initial_count={announcement.likes_count}
                                is_liked={announcement.is_liked}
                            />

                            <button
                                onClick={handleCopyLink}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
                                    copied
                                        ? 'bg-brand-soft border-emerald-200 text-brand-strong'
                                        : 'bg-white border-line text-ink-3 hover:bg-surface-2 hover:text-brand-strong hover:border-emerald-200'
                                }`}
                            >
                                {copied ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm font-medium">Tersalin!</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                        <span className="text-sm font-medium">Bagikan</span>
                                    </>
                                )}
                            </button>

                            <ShareButton title={announcement.title} url={`/berita/${announcement.slug}`} />
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-10">
                        <CommentSection
                            comments={announcement.comments}
                            commentable_type="announcement"
                            commentable_id={announcement.id}
                        />
                    </div>
                </div>
            </section>

            {/* Related Announcements - Dark Section */}
            {relatedAnnouncements && relatedAnnouncements.length > 0 && (
                <section className="relative py-16 md:py-20 bg-gradient-to-br from-emerald-900 to-teal-900 overflow-hidden">
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Berita Terkait</h2>
                            <div className="w-16 h-1 bg-emerald-400 mx-auto rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedAnnouncements.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/berita/${related.slug}`}
                                    className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 hover:-translate-y-1 transition-all duration-300"
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
                                        <h4 className="font-semibold text-white group-hover:text-emerald-200 transition-colors mb-2 line-clamp-2">
                                            {related.title}
                                        </h4>
                                        {related.excerpt && (
                                            <p className="text-emerald-200/70 text-sm line-clamp-2 mb-3">{related.excerpt}</p>
                                        )}
                                        <div className="flex items-center gap-2 text-xs text-emerald-300">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {formatDate(related.published_at)}
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
