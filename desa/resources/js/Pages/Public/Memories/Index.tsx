import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ShareButton from '@/Components/ui/ShareButton';
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

type Platform = 'youtube' | 'tiktok' | 'facebook' | 'instagram';

interface Memory {
    id: number;
    title: string;
    description: string;
    type: string;
    platform: Platform;
    source_url: string;
    thumbnail_url: string | null;
    is_pinned: boolean;
    year: number | null;
    submitter?: { name: string } | null;
    album?: { id: number; name: string; slug: string } | null;
    created_at: string;
}

interface Album {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    memories_count: number;
}

interface PaginatedMemories {
    data: Memory[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    current_page: number;
    last_page: number;
    next_page_url: string | null;
}

interface Filters {
    platform: string | null;
    type: string | null;
    year: string | null;
    album: string | null;
}

interface MemoriesIndexProps {
    memories: PaginatedMemories;
    pinnedMemories: Memory[];
    albums: Album[];
    years: number[];
    filters: Filters;
}

type ViewMode = 'feed' | 'grid';

interface Reactions {
    [memoryId: number]: { [emoji: string]: number };
}

interface UserReactions {
    [memoryId: number]: { [emoji: string]: boolean };
}

const REACTION_EMOJIS = [
    { key: 'heart', emoji: '❤️' },
    { key: 'laugh', emoji: '😂' },
    { key: 'wow', emoji: '😮' },
    { key: 'pray', emoji: '🙏' },
    { key: 'fire', emoji: '🔥' },
];

// ─── Helper Functions ────────────────────────────────────────────────────────

function getPlatformIcon(platform: string) {
    switch (platform.toLowerCase()) {
        case 'youtube':
            return (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
            );
        case 'tiktok':
            return (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.82.11V9.4a6.33 6.33 0 0 0-.82-.05A6.34 6.34 0 0 0 3.15 15.7 6.34 6.34 0 0 0 9.49 22a6.34 6.34 0 0 0 6.34-6.34V9.01a8.16 8.16 0 0 0 4.77 1.52V7.08a4.84 4.84 0 0 1-1.01-.39z"/>
                </svg>
            );
        case 'facebook':
            return (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
            );
        case 'instagram':
            return (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
            );
        default:
            return null;
    }
}

function getPlatformColor(platform: string): string {
    switch (platform.toLowerCase()) {
        case 'youtube': return 'text-red-600 bg-red-50';
        case 'tiktok': return 'text-black bg-surface-3';
        case 'facebook': return 'text-blue-600 bg-blue-50';
        case 'instagram': return 'text-pink-600 bg-pink-50';
        default: return 'text-ink-3 bg-surface-2';
    }
}

function getPlatformLabel(platform: string): string {
    switch (platform.toLowerCase()) {
        case 'youtube': return 'YouTube';
        case 'tiktok': return 'TikTok';
        case 'facebook': return 'Facebook';
        case 'instagram': return 'Instagram';
        default: return platform;
    }
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
                return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(sourceUrl)}&show_text=false&width=560`;
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

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hari ini';
    if (days === 1) return 'Kemarin';
    if (days < 7) return `${days} hari lalu`;
    if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
    if (days < 365) return `${Math.floor(days / 30)} bulan lalu`;
    return `${Math.floor(days / 365)} tahun lalu`;
}

// ─── Embed Component ─────────────────────────────────────────────────────────

function MemoryEmbed({ memory, maxHeight }: { memory: Memory; maxHeight?: string }) {
    const embedUrl = getEmbedUrl(memory.platform, memory.source_url);
    const isTikTok = memory.platform === 'tiktok';

    if (!embedUrl) {
        return (
            <div className="w-full aspect-video bg-surface-3 flex items-center justify-center rounded-lg">
                <div className="text-center text-ink-4">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Tidak dapat memuat embed</p>
                </div>
            </div>
        );
    }

    if (isTikTok) {
        return (
            <div className="w-full flex justify-center">
                <div className={`w-full max-w-[325px] ${maxHeight || 'max-h-[580px]'}`} style={{ aspectRatio: '9/16' }}>
                    <iframe
                        src={embedUrl}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full" style={{ aspectRatio: '16/9' }}>
            <iframe
                src={embedUrl}
                className="w-full h-full rounded-lg"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
        </div>
    );
}

// ─── Quick Reactions Component ───────────────────────────────────────────────

function QuickReactions({
    memoryId,
    reactions,
    userReactions,
    onToggle,
}: {
    memoryId: number;
    reactions: { [emoji: string]: number };
    userReactions: { [emoji: string]: boolean };
    onToggle: (memoryId: number, emoji: string) => void;
}) {
    const [animating, setAnimating] = useState<string | null>(null);

    const handleClick = (emoji: string) => {
        setAnimating(emoji);
        setTimeout(() => setAnimating(null), 300);
        onToggle(memoryId, emoji);
    };

    return (
        <div className="flex items-center gap-1 flex-wrap">
            {REACTION_EMOJIS.map(({ key, emoji }) => {
                const count = reactions[key] || 0;
                const isActive = userReactions[key] || false;
                const isAnimatingThis = animating === key;

                return (
                    <button
                        key={key}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick(key);
                        }}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-200 border ${
                            isActive
                                ? 'bg-brand-soft border-emerald-300 shadow-sm'
                                : 'bg-surface-1 border-line hover:border-gray-300 hover:bg-surface-2'
                        } ${isAnimatingThis ? 'animate-bounce scale-110' : ''}`}
                    >
                        <span className="text-sm">{emoji}</span>
                        {count > 0 && (
                            <span className={`font-medium ${isActive ? 'text-brand-strong' : 'text-ink-3'}`}>
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

// ─── Memory Card Component ───────────────────────────────────────────────────

function MemoryCard({
    memory,
    viewMode,
    reactions,
    userReactions,
    onReactionToggle,
    onOpenModal,
}: {
    memory: Memory;
    viewMode: ViewMode;
    reactions: { [emoji: string]: number };
    userReactions: { [emoji: string]: boolean };
    onReactionToggle: (memoryId: number, emoji: string) => void;
    onOpenModal: (memory: Memory) => void;
}) {
    const isFeed = viewMode === 'feed';

    return (
        <article
            className={`bg-surface-1 rounded-2xl shadow-sm border border-line overflow-hidden hover:shadow-md transition-all duration-300 ${
                isFeed ? 'max-w-2xl mx-auto' : ''
            }`}
        >
            {/* Embed Area - Clickable */}
            <div
                className="cursor-pointer relative group"
                onClick={() => onOpenModal(memory)}
            >
                <MemoryEmbed memory={memory} maxHeight={isFeed ? undefined : 'max-h-[400px]'} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-t-2xl flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-surface-1/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                            <svg className="w-6 h-6 text-ink-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Info */}
            <div className="p-4">
                {/* Platform Badge & Date */}
                <div className="flex items-center justify-between mb-2">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getPlatformColor(memory.platform)}`}>
                        {getPlatformIcon(memory.platform)}
                        <span>{getPlatformLabel(memory.platform)}</span>
                    </div>
                    <span className="text-xs text-ink-4">{formatDate(memory.created_at)}</span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-ink-1 line-clamp-2 mb-1">{memory.title}</h3>

                {/* Description */}
                {memory.description && (
                    <p className="text-sm text-ink-3 line-clamp-2 mb-2">{memory.description}</p>
                )}

                {/* Album & Submitter */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                    {memory.album && (
                        <span className="inline-flex items-center gap-1 text-xs text-brand-strong bg-brand-soft px-2 py-0.5 rounded-full">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            {memory.album.name}
                        </span>
                    )}
                    {memory.submitter && (
                        <span className="text-xs text-ink-4">
                            oleh {memory.submitter.name}
                        </span>
                    )}
                    {memory.year && (
                        <span className="text-xs text-ink-4 bg-surface-3 px-2 py-0.5 rounded-full">
                            {memory.year}
                        </span>
                    )}
                </div>

                {/* Reactions */}
                <QuickReactions
                    memoryId={memory.id}
                    reactions={reactions}
                    userReactions={userReactions}
                    onToggle={onReactionToggle}
                />

                {/* Share Button */}
                <div className="mt-3 flex justify-end">
                    <ShareButton title={memory.title} url={memory.source_url} />
                </div>
            </div>
        </article>
    );
}

// ─── Fullscreen Modal Component ──────────────────────────────────────────────

function FullscreenModal({
    memory,
    memories,
    onClose,
    onNavigate,
}: {
    memory: Memory;
    memories: Memory[];
    onClose: () => void;
    onNavigate: (direction: 'prev' | 'next') => void;
}) {
    const currentIndex = memories.findIndex((m) => m.id === memory.id);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < memories.length - 1;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft' && hasPrev) onNavigate('prev');
            if (e.key === 'ArrowRight' && hasNext) onNavigate('next');
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose, onNavigate, hasPrev, hasNext]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 bg-surface-1/10 hover:bg-surface-1/20 rounded-full text-white transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Navigation - Previous */}
            {hasPrev && (
                <button
                    onClick={() => onNavigate('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-surface-1/10 hover:bg-surface-1/20 rounded-full text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Navigation - Next */}
            {hasNext && (
                <button
                    onClick={() => onNavigate('next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-surface-1/10 hover:bg-surface-1/20 rounded-full text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Content */}
            <div className="relative z-10 w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="bg-black rounded-2xl overflow-hidden">
                    {/* Embed */}
                    <div className="w-full">
                        <MemoryEmbed memory={memory} maxHeight="max-h-[70vh]" />
                    </div>

                    {/* Info */}
                    <div className="p-6 bg-ink-1 text-white">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getPlatformColor(memory.platform)}`}>
                                {getPlatformIcon(memory.platform)}
                                <span>{getPlatformLabel(memory.platform)}</span>
                            </div>
                            <span className="text-sm text-ink-4">{formatDate(memory.created_at)}</span>
                            {memory.year && (
                                <span className="text-xs text-ink-4 bg-gray-700 px-2 py-0.5 rounded-full">
                                    {memory.year}
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl font-bold mb-2">{memory.title}</h2>
                        {memory.description && (
                            <p className="text-ink-4 text-sm">{memory.description}</p>
                        )}
                        {memory.submitter && (
                            <p className="text-ink-4 text-xs mt-2">Dibagikan oleh {memory.submitter.name}</p>
                        )}
                        {memory.album && (
                            <p className="text-brand-ring text-xs mt-1">Album: {memory.album.name}</p>
                        )}

                        {/* Counter */}
                        <div className="mt-4 text-xs text-ink-3">
                            {currentIndex + 1} / {memories.length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function MemoriesIndex({ memories, pinnedMemories, albums, years, filters }: MemoriesIndexProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('feed');
    const [allMemories, setAllMemories] = useState<Memory[]>(memories.data);
    const [currentPage, setCurrentPage] = useState(memories.current_page);
    const [lastPage, setLastPage] = useState(memories.last_page);
    const [nextPageUrl, setNextPageUrl] = useState(memories.next_page_url);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [modalMemory, setModalMemory] = useState<Memory | null>(null);
    const [reactions, setReactions] = useState<Reactions>({});
    const [userReactions, setUserReactions] = useState<UserReactions>({});
    const [animatingReaction, setAnimatingReaction] = useState<string | null>(null);

    // Reset memories when filters change (page reloads via Inertia)
    useEffect(() => {
        setAllMemories(memories.data);
        setCurrentPage(memories.current_page);
        setLastPage(memories.last_page);
        setNextPageUrl(memories.next_page_url);
    }, [memories]);

    // All memories for modal navigation (pinned + regular)
    const allMemoriesForNav = [...(pinnedMemories || []), ...allMemories];

    // ─── Load More ───────────────────────────────────────────────────────────

    const handleLoadMore = () => {
        if (!nextPageUrl || isLoadingMore) return;
        setIsLoadingMore(true);

        router.get(
            nextPageUrl,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['memories'],
                onSuccess: (page: any) => {
                    const newMemories = page.props.memories as PaginatedMemories;
                    setAllMemories((prev) => [...prev, ...newMemories.data]);
                    setCurrentPage(newMemories.current_page);
                    setLastPage(newMemories.last_page);
                    setNextPageUrl(newMemories.next_page_url);
                    setIsLoadingMore(false);
                },
                onError: () => {
                    setIsLoadingMore(false);
                },
            }
        );
    };

    // ─── Reactions ───────────────────────────────────────────────────────────

    const handleReactionToggle = useCallback(async (memoryId: number, emoji: string) => {
        // Optimistic update
        setUserReactions((prev) => {
            const memReactions = prev[memoryId] || {};
            const isActive = memReactions[emoji] || false;
            return {
                ...prev,
                [memoryId]: { ...memReactions, [emoji]: !isActive },
            };
        });

        setReactions((prev) => {
            const memReactions = prev[memoryId] || {};
            const currentCount = memReactions[emoji] || 0;
            const isActive = userReactions[memoryId]?.[emoji] || false;
            return {
                ...prev,
                [memoryId]: {
                    ...memReactions,
                    [emoji]: isActive ? Math.max(0, currentCount - 1) : currentCount + 1,
                },
            };
        });

        try {
            await axios.post('/api/reactions/toggle', {
                memory_id: memoryId,
                reaction: emoji,
            });
        } catch {
            // Revert on error
            setUserReactions((prev) => {
                const memReactions = prev[memoryId] || {};
                return {
                    ...prev,
                    [memoryId]: { ...memReactions, [emoji]: !memReactions[emoji] },
                };
            });
        }
    }, [userReactions]);

    // ─── Modal ───────────────────────────────────────────────────────────────

    const openModal = (memory: Memory) => {
        setModalMemory(memory);
    };

    const closeModal = () => {
        setModalMemory(null);
    };

    const navigateModal = useCallback((direction: 'prev' | 'next') => {
        if (!modalMemory) return;
        const currentIndex = allMemoriesForNav.findIndex((m) => m.id === modalMemory.id);
        const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex >= 0 && newIndex < allMemoriesForNav.length) {
            setModalMemory(allMemoriesForNav[newIndex]);
        }
    }, [modalMemory, allMemoriesForNav]);

    // ─── Filter Handlers ─────────────────────────────────────────────────────

    const applyFilter = (key: string, value: string | null) => {
        const newFilters: Record<string, string | null> = { ...filters, [key]: value };
        // Remove null values
        const params: Record<string, string> = {};
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v) params[k] = v;
        });

        router.get('/kenangan', params, {
            preserveState: false,
            preserveScroll: false,
        });
    };

    const platforms: Platform[] = ['youtube', 'tiktok', 'facebook', 'instagram'];
    const types = ['video', 'short', 'reel', 'live'];

    const hasActiveFilters = filters.platform || filters.type || filters.year || filters.album;

    return (
        <PublicLayout>
            <Head title="Kenangan Desa Muneng" />

            {/* ─── Compact Hero ────────────────────────────────────────────────── */}
            <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 py-12 md:py-16 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-surface-1 rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-surface-1 rounded-full translate-x-1/3 translate-y-1/3" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Kenangan Desa Muneng
                    </h1>
                    <p className="text-emerald-100 text-base md:text-lg max-w-2xl mx-auto">
                        Kumpulan momen berharga dari warga dan kegiatan Desa Muneng yang terabadikan dalam video
                    </p>
                </div>
            </section>

            {/* ─── Sticky Filter Bar ──────────────────────────────────────────── */}
            <div className="sticky top-16 z-30 bg-surface-1/95 backdrop-blur-md border-b border-line shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex flex-col gap-3">
                        {/* Row 1: Platform & Type Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Platform Pills */}
                            <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-xs font-medium text-ink-3 mr-1">Platform:</span>
                                {platforms.map((platform) => (
                                    <button
                                        key={platform}
                                        onClick={() => applyFilter('platform', filters.platform === platform ? null : platform)}
                                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                            filters.platform === platform
                                                ? 'bg-brand text-white shadow-sm'
                                                : 'bg-surface-3 text-ink-3 hover:bg-gray-200'
                                        }`}
                                    >
                                        {getPlatformLabel(platform)}
                                    </button>
                                ))}
                            </div>

                            <div className="w-px h-6 bg-gray-200 hidden sm:block" />

                            {/* Type Pills */}
                            <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-xs font-medium text-ink-3 mr-1">Tipe:</span>
                                {types.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => applyFilter('type', filters.type === type ? null : type)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                            filters.type === type
                                                ? 'bg-brand text-white shadow-sm'
                                                : 'bg-surface-3 text-ink-3 hover:bg-gray-200'
                                        }`}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Row 2: Year & Album Filters + View Toggle + Submit */}
                        <div className="flex flex-wrap items-center gap-2 justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Year Pills */}
                                {years && years.length > 0 && (
                                    <div className="flex items-center gap-1 flex-wrap">
                                        <span className="text-xs font-medium text-ink-3 mr-1">Tahun:</span>
                                        {years.map((year) => (
                                            <button
                                                key={year}
                                                onClick={() => applyFilter('year', filters.year === String(year) ? null : String(year))}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                                    filters.year === String(year)
                                                        ? 'bg-brand text-white shadow-sm'
                                                        : 'bg-surface-3 text-ink-3 hover:bg-gray-200'
                                                }`}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Album Pills */}
                                {albums && albums.length > 0 && (
                                    <div className="flex items-center gap-1 flex-wrap">
                                        <span className="text-xs font-medium text-ink-3 mr-1">Album:</span>
                                        {albums.map((album) => (
                                            <button
                                                key={album.id}
                                                onClick={() => applyFilter('album', filters.album === album.slug ? null : album.slug)}
                                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                                    filters.album === album.slug
                                                        ? 'bg-brand text-white shadow-sm'
                                                        : 'bg-surface-3 text-ink-3 hover:bg-gray-200'
                                                }`}
                                            >
                                                {album.name}
                                                <span className={`ml-1 text-[10px] ${
                                                    filters.album === album.slug ? 'text-brand-soft' : 'text-ink-4'
                                                }`}>
                                                    ({album.memories_count})
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Clear Filters */}
                                {hasActiveFilters && (
                                    <button
                                        onClick={() => router.get('/kenangan', {}, { preserveState: false })}
                                        className="px-3 py-1.5 rounded-full text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                                    >
                                        Hapus Filter
                                    </button>
                                )}
                            </div>

                            {/* Right side: View Toggle + Submit */}
                            <div className="flex items-center gap-2">
                                {/* View Toggle */}
                                <div className="flex items-center bg-surface-3 rounded-lg p-0.5">
                                    <button
                                        onClick={() => setViewMode('feed')}
                                        className={`p-2 rounded-md transition-all duration-200 ${
                                            viewMode === 'feed'
                                                ? 'bg-surface-1 text-brand-strong shadow-sm'
                                                : 'text-ink-4 hover:text-ink-3'
                                        }`}
                                        title="Tampilan Feed"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-all duration-200 ${
                                            viewMode === 'grid'
                                                ? 'bg-surface-1 text-brand-strong shadow-sm'
                                                : 'text-ink-4 hover:text-ink-3'
                                        }`}
                                        title="Tampilan Grid"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Submit Button */}
                                <Link
                                    href="/kenangan/submit"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-xs font-medium rounded-lg hover:bg-brand-strong transition-colors shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Bagikan Kenangan
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Main Content ────────────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ─── Pinned Memories Section ─────────────────────────────────── */}
                {pinnedMemories && pinnedMemories.length > 0 && (
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-lg">⭐</span>
                            <h2 className="text-lg font-bold text-ink-1">Kenangan Pilihan</h2>
                        </div>

                        {/* Desktop: Grid, Mobile: Horizontal Scroll */}
                        <div className="hidden md:grid md:grid-cols-3 gap-4">
                            {pinnedMemories.map((memory) => (
                                <div
                                    key={memory.id}
                                    className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-amber-300 transition-all duration-300 cursor-pointer"
                                    onClick={() => openModal(memory)}
                                >
                                    <div className="relative">
                                        <MemoryEmbed memory={memory} maxHeight="max-h-[250px]" />
                                        <div className="absolute top-2 left-2">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-sm">
                                                ⭐ Pilihan
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-semibold text-ink-1 text-sm line-clamp-1">{memory.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getPlatformColor(memory.platform)}`}>
                                                {getPlatformLabel(memory.platform)}
                                            </span>
                                            <span className="text-xs text-ink-4">{formatDate(memory.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile: Horizontal Scroll Carousel */}
                        <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                            <div className="flex gap-4" style={{ width: 'max-content' }}>
                                {pinnedMemories.map((memory) => (
                                    <div
                                        key={memory.id}
                                        className="w-72 flex-shrink-0 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                                        onClick={() => openModal(memory)}
                                    >
                                        <div className="relative">
                                            <MemoryEmbed memory={memory} maxHeight="max-h-[200px]" />
                                            <div className="absolute top-2 left-2">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-sm">
                                                    ⭐ Pilihan
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-semibold text-ink-1 text-sm line-clamp-1">{memory.title}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getPlatformColor(memory.platform)}`}>
                                                    {getPlatformLabel(memory.platform)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Main Feed / Grid ───────────────────────────────────────── */}
                {allMemories.length > 0 ? (
                    <div
                        className={
                            viewMode === 'feed'
                                ? 'flex flex-col gap-8'
                                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        }
                    >
                        {allMemories.map((memory) => (
                            <MemoryCard
                                key={memory.id}
                                memory={memory}
                                viewMode={viewMode}
                                reactions={reactions[memory.id] || {}}
                                userReactions={userReactions[memory.id] || {}}
                                onReactionToggle={handleReactionToggle}
                                onOpenModal={openModal}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-surface-3 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-ink-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-ink-3 text-lg font-medium">Belum ada kenangan</p>
                        <p className="text-ink-4 text-sm mt-2 mb-6">
                            {hasActiveFilters
                                ? 'Tidak ada kenangan yang sesuai dengan filter. Coba ubah filter Anda.'
                                : 'Jadilah yang pertama membagikan kenangan tentang Desa Muneng!'}
                        </p>
                        {!hasActiveFilters && (
                            <Link
                                href="/kenangan/submit"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-strong transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Bagikan Kenangan
                            </Link>
                        )}
                    </div>
                )}

                {/* ─── Load More Button ───────────────────────────────────────── */}
                {allMemories.length > 0 && (
                    <div className="mt-10 text-center">
                        {nextPageUrl ? (
                            <button
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-strong disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                {isLoadingMore ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Memuat...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                        Muat Lebih Banyak
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 text-ink-4 py-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm font-medium">Semua kenangan sudah ditampilkan</span>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* ─── Fullscreen Modal ────────────────────────────────────────────── */}
            {modalMemory && (
                <FullscreenModal
                    memory={modalMemory}
                    memories={allMemoriesForNav}
                    onClose={closeModal}
                    onNavigate={navigateModal}
                />
            )}
        </PublicLayout>
    );
}
