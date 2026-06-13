import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { FormEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface MemoryFormData {
    title: string;
    description: string;
    type: string;
    platform: string;
    source_url: string;
}

interface ScrapedMetadata {
    title: string;
    description: string;
    thumbnail_url: string | null;
    embed_code: string | null;
    type: string;
    platform: string;
    source_url: string;
    author: string | null;
    author_url: string | null;
    provider: string | null;
}

function getEmbedUrl(platform: string, sourceUrl: string): string | null {
    if (!sourceUrl) return null;

    try {
        switch (platform) {
            case 'youtube': {
                const match = sourceUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
                if (match) return `https://www.youtube.com/embed/${match[1]}`;
                break;
            }
            case 'tiktok': {
                const match = sourceUrl.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
                if (match) return `https://www.tiktok.com/embed/v2/${match[1]}`;
                break;
            }
            case 'facebook': {
                return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(sourceUrl)}&show_text=false`;
            }
            case 'instagram': {
                const match = sourceUrl.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
                if (match) return `https://www.instagram.com/p/${match[1]}/embed`;
                break;
            }
        }
    } catch {
        return null;
    }
    return null;
}

function detectPlatformFromUrl(url: string): string | null {
    const lower = url.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
    if (lower.includes('tiktok.com')) return 'tiktok';
    if (lower.includes('facebook.com') || lower.includes('fb.watch')) return 'facebook';
    if (lower.includes('instagram.com')) return 'instagram';
    return null;
}

export default function MemoriesCreate() {
    const { data, setData, post, processing, errors, reset } = useForm<MemoryFormData>({
        title: '',
        description: '',
        type: 'video',
        platform: 'youtube',
        source_url: '',
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [scraping, setScraping] = useState(false);
    const [scraped, setScraped] = useState<ScrapedMetadata | null>(null);
    const [scrapeError, setScrapeError] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Auto-detect platform and update preview when URL changes
    useEffect(() => {
        const embedUrl = getEmbedUrl(data.platform, data.source_url);
        setPreviewUrl(embedUrl);
    }, [data.platform, data.source_url]);

    // Auto-scrape when URL is pasted/changed (with debounce)
    const handleUrlChange = useCallback((url: string) => {
        setData('source_url', url);
        setScrapeError(null);

        // Auto-detect platform
        const detectedPlatform = detectPlatformFromUrl(url);
        if (detectedPlatform) {
            setData('platform', detectedPlatform);
        }

        // Debounce scraping
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (url && url.startsWith('http')) {
            debounceRef.current = setTimeout(() => {
                scrapeUrl(url);
            }, 1000);
        }
    }, []);

    // Scrape URL metadata
    const scrapeUrl = async (url: string) => {
        setScraping(true);
        setScrapeError(null);
        setScraped(null);

        try {
            const response = await axios.post('/kenangan/preview', { url });
            const metadata = response.data.data as ScrapedMetadata;
            setScraped(metadata);

            // Auto-fill empty fields with scraped data
            if (metadata.title && !data.title) {
                setData('title', metadata.title);
            }
            if (metadata.description && !data.description) {
                setData('description', metadata.description);
            }
            if (metadata.platform && metadata.platform !== 'unknown') {
                setData('platform', metadata.platform);
            }
            if (metadata.type) {
                setData('type', metadata.type);
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                setScrapeError('Silakan login terlebih dahulu untuk menggunakan fitur preview.');
            } else {
                setScrapeError('Gagal mengambil metadata. Anda tetap bisa submit secara manual.');
            }
        } finally {
            setScraping(false);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/kenangan/submit', {
            onSuccess: () => reset(),
        });
    };

    return (
        <PublicLayout>
            <Head title="Submit Kenangan - Desa Muneng" />

            {/* Hero */}
            <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-14 md:py-20 overflow-hidden">
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute top-8 right-8 opacity-10">
                    <svg className="w-36 h-36" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div className="absolute bottom-12 left-8 opacity-10">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/kenangan"
                        className="inline-flex items-center gap-2 bg-surface-1/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-emerald-200 hover:text-white hover:bg-surface-1/20 transition-all duration-300 mb-6"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Kenangan
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-surface-1/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center">
                            <svg className="w-7 h-7 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Submit Kenangan</h1>
                            <p className="text-emerald-200 mt-1">Bagikan momen berharga Anda tentang Desa Muneng</p>
                        </div>
                    </div>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 40V20C360 0 720 40 1080 20C1260 10 1380 15 1440 20V40H0Z" fill="#f9fafb" />
                    </svg>
                </div>
            </section>

            <section className="py-12 md:py-16 bg-surface-2">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Form */}
                        <div className="lg:col-span-3">
                            <div className="bg-surface-1 rounded-2xl shadow-sm border border-line p-6 md:p-8">
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Source URL - First! */}
                                    <div>
                                        <label htmlFor="source_url" className="block text-sm font-medium text-ink-2 mb-2">
                                            URL Sumber <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                </svg>
                                            </div>
                                            <input
                                                id="source_url"
                                                type="url"
                                                value={data.source_url}
                                                onChange={(e) => handleUrlChange(e.target.value)}
                                                className="w-full pl-11 pr-12 py-3 rounded-xl border border-line focus:border-brand focus:ring-2 focus:ring-brand-soft transition-all duration-200 outline-none"
                                                placeholder="Paste link YouTube, TikTok, Facebook, atau Instagram..."
                                            />
                                            {scraping && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <svg className="animate-spin h-5 w-5 text-brand-ring" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        {errors.source_url && (
                                            <p className="mt-1 text-sm text-red-600">{errors.source_url}</p>
                                        )}
                                        {scrapeError && (
                                            <p className="mt-1 text-sm text-amber-600">{scrapeError}</p>
                                        )}
                                        <p className="mt-1 text-xs text-ink-3">
                                            Paste link dan kami akan otomatis mengambil judul, thumbnail, dan informasi lainnya.
                                        </p>
                                    </div>

                                    {/* Scraped info banner */}
                                    {scraped && scraped.title && (
                                        <div className="bg-brand-soft border border-brand-soft rounded-xl p-4">
                                            <div className="flex items-start gap-3">
                                                {scraped.thumbnail_url && (
                                                    <img
                                                        src={scraped.thumbnail_url}
                                                        alt="Thumbnail"
                                                        className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-emerald-800 truncate">
                                                        {scraped.title}
                                                    </p>
                                                    {scraped.author && (
                                                        <p className="text-xs text-brand-strong mt-0.5">
                                                            oleh {scraped.author}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-soft text-brand-strong">
                                                            {scraped.platform}
                                                        </span>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-surface-3 text-ink-2">
                                                            {scraped.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <svg className="w-5 h-5 text-brand-ring flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}

                                    {/* Title */}
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-ink-2 mb-2">
                                            Judul {!scraped?.title && <span className="text-ink-4">(opsional - akan diambil otomatis)</span>}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="title"
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-line focus:border-brand focus:ring-2 focus:ring-brand-soft transition-all duration-200 outline-none"
                                                placeholder={scraped?.title || "Judul akan diambil otomatis dari URL..."}
                                            />
                                        </div>
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-ink-2 mb-2">
                                            Deskripsi <span className="text-ink-4">(opsional)</span>
                                        </label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-line focus:border-brand focus:ring-2 focus:ring-brand-soft transition-all duration-200 outline-none resize-none"
                                            placeholder="Ceritakan tentang kenangan ini (opsional)..."
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                        )}
                                    </div>

                                    {/* Type & Platform (auto-detected but editable) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="type" className="block text-sm font-medium text-ink-2 mb-2">
                                                Tipe
                                            </label>
                                            <select
                                                id="type"
                                                value={data.type}
                                                onChange={(e) => setData('type', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-line focus:border-brand focus:ring-2 focus:ring-brand-soft transition-all duration-200 outline-none bg-surface-1"
                                            >
                                                <option value="video">Video</option>
                                                <option value="photo">Foto</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="platform" className="block text-sm font-medium text-ink-2 mb-2">
                                                Platform
                                            </label>
                                            <select
                                                id="platform"
                                                value={data.platform}
                                                onChange={(e) => setData('platform', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-line focus:border-brand focus:ring-2 focus:ring-brand-soft transition-all duration-200 outline-none bg-surface-1"
                                            >
                                                <option value="youtube">YouTube</option>
                                                <option value="tiktok">TikTok</option>
                                                <option value="facebook">Facebook</option>
                                                <option value="instagram">Instagram</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-line">
                                        <Link
                                            href="/kenangan"
                                            className="px-6 py-3 text-ink-2 font-medium hover:text-ink-1 transition-colors"
                                        >
                                            Batal
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing || !data.source_url}
                                            className="px-8 py-3 bg-gradient-to-r from-brand to-teal-600 text-white font-semibold rounded-xl hover:from-brand-strong hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Mengirim...
                                                </span>
                                            ) : 'Submit Kenangan'}
                                        </button>
                                    </div>

                                    <p className="text-xs text-ink-3 text-center">
                                        Kenangan yang Anda submit akan ditinjau oleh admin sebelum ditampilkan.
                                    </p>
                                </form>
                            </div>
                        </div>

                        {/* Preview Panel */}
                        <div className="lg:col-span-2">
                            <div className="sticky top-24 space-y-4">
                                <h3 className="text-sm font-semibold text-ink-2 uppercase tracking-wider flex items-center gap-2">
                                    <svg className="w-4 h-4 text-brand-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Preview
                                </h3>

                                {previewUrl ? (
                                    <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-2xl p-3 shadow-lg">
                                        <div className="bg-surface-1/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
                                            <div className="aspect-video">
                                                <iframe
                                                    src={previewUrl}
                                                    className="w-full h-full"
                                                    allowFullScreen
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                />
                                            </div>
                                            {scraped?.title && (
                                                <div className="p-4">
                                                    <p className="text-sm font-medium text-white line-clamp-2">{scraped.title}</p>
                                                    {scraped.author && (
                                                        <p className="text-xs text-emerald-300 mt-1">{scraped.author}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : scraped?.thumbnail_url ? (
                                    <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-2xl p-3 shadow-lg">
                                        <div className="bg-surface-1/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
                                            <img
                                                src={scraped.thumbnail_url}
                                                alt="Preview"
                                                className="w-full aspect-video object-cover"
                                            />
                                            {scraped.title && (
                                                <div className="p-4">
                                                    <p className="text-sm font-medium text-white line-clamp-2">{scraped.title}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-2xl p-3 shadow-lg">
                                        <div className="bg-surface-1/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
                                            <svg className="w-16 h-16 text-emerald-400/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm text-emerald-200/70">
                                                Paste URL di kolom sebelah kiri untuk melihat preview
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Tips */}
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        <h4 className="text-sm font-semibold text-amber-800">Tips</h4>
                                    </div>
                                    <ul className="text-xs text-amber-700 space-y-2">
                                        <li className="flex items-start gap-2">
                                            <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Cukup paste link, platform & tipe akan terdeteksi otomatis
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Judul & deskripsi akan diambil dari metadata URL
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Anda bisa mengedit judul & deskripsi sesuai keinginan
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Mendukung: YouTube, TikTok, Facebook, Instagram
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
