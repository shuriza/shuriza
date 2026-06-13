import { router } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Calendar, Image as ImageIcon, MapPin, Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SearchResult {
    id: number;
    title: string;
    type: 'event' | 'kenangan' | 'destinasi';
    url: string;
    excerpt?: string;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const typeConfig = {
    event: {
        label: 'Acara',
        color: 'text-blue-700 bg-blue-50',
        icon: Calendar,
    },
    kenangan: {
        label: 'Kenangan',
        color: 'text-accent-strong bg-accent-soft',
        icon: ImageIcon,
    },
    destinasi: {
        label: 'Destinasi',
        color: 'text-brand-strong bg-brand-soft',
        icon: MapPin,
    },
} as const;

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery('');
            setResults([]);
            setActiveIndex(0);
        }
    }, [isOpen]);

    const search = useCallback(async (searchQuery: string) => {
        if (searchQuery.trim().length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get('/api/search', {
                params: { q: searchQuery },
            });
            setResults(response.data.results || []);
            setActiveIndex(0);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleInputChange = (value: string) => {
        setQuery(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            search(value);
        }, 300);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && results[activeIndex]) {
            e.preventDefault();
            navigateToResult(results[activeIndex]);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const navigateToResult = (result: SearchResult) => {
        onClose();
        router.visit(result.url);
    };

    // Group results by type
    const groupedResults = results.reduce<Record<string, SearchResult[]>>((acc, result) => {
        if (!acc[result.type]) acc[result.type] = [];
        acc[result.type].push(result);
        return acc;
    }, {});

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-ink-1/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-surface-1 rounded-2xl shadow-2xl overflow-hidden animate-search-modal-in">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
                    <Search className="w-5 h-5 text-ink-3 flex-shrink-0" aria-hidden />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Cari acara, kenangan, destinasi..."
                        className="flex-1 text-base text-ink-1 placeholder-ink-4 bg-transparent border-none outline-none focus:ring-0"
                    />
                    <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-ink-3 bg-surface-3 rounded-md">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-5 h-5 text-brand animate-spin" aria-hidden />
                            <span className="ml-3 text-sm text-ink-3">Mencari...</span>
                        </div>
                    )}

                    {!loading && query.length >= 2 && results.length === 0 && (
                        <div className="py-12 text-center">
                            <Search className="w-12 h-12 mx-auto text-ink-4 mb-3" aria-hidden strokeWidth={1.5} />
                            <p className="text-sm text-ink-3">Tidak ada hasil untuk &quot;{query}&quot;</p>
                            <p className="text-xs text-ink-4 mt-1">Coba kata kunci lain</p>
                        </div>
                    )}

                    {!loading && query.length < 2 && (
                        <div className="py-12 text-center">
                            <Search className="w-12 h-12 mx-auto text-ink-4 mb-3" aria-hidden strokeWidth={1.5} />
                            <p className="text-sm text-ink-3">Ketik minimal 2 karakter untuk mencari</p>
                            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-ink-4">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-surface-3 rounded text-[10px]">&uarr;&darr;</kbd> Navigasi
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-surface-3 rounded text-[10px]">Enter</kbd> Buka
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-surface-3 rounded text-[10px]">Esc</kbd> Tutup
                                </span>
                            </div>
                        </div>
                    )}

                    {!loading && Object.keys(groupedResults).length > 0 && (
                        <div className="py-2">
                            {Object.entries(groupedResults).map(([type, items]) => {
                                const config = typeConfig[type as keyof typeof typeConfig];
                                const TypeIcon = config.icon;
                                return (
                                    <div key={type}>
                                        <div className="px-5 py-2">
                                            <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', config.color)}>
                                                <TypeIcon className="w-4 h-4" aria-hidden />
                                                {config.label}
                                            </span>
                                        </div>
                                        {items.map((result) => {
                                            const globalIndex = results.indexOf(result);
                                            return (
                                                <button
                                                    key={`${result.type}-${result.id}`}
                                                    onClick={() => navigateToResult(result)}
                                                    className={cn(
                                                        'w-full text-left px-5 py-3 flex items-center gap-3 transition-colors duration-150',
                                                        globalIndex === activeIndex ? 'bg-brand-soft' : 'hover:bg-surface-2',
                                                    )}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-ink-1 truncate">
                                                            {result.title}
                                                        </p>
                                                        {result.excerpt && (
                                                            <p className="text-xs text-ink-3 truncate mt-0.5">
                                                                {result.excerpt}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {globalIndex === activeIndex && (
                                                        <span className="text-brand-strong flex-shrink-0 text-sm">→</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-line bg-surface-2 flex items-center justify-between">
                    <span className="text-xs text-ink-3">Pencarian Desa Muneng</span>
                    <span className="text-xs text-ink-3">
                        <kbd className="px-1.5 py-0.5 bg-surface-1 border border-line rounded text-[10px]">Ctrl</kbd>
                        {' + '}
                        <kbd className="px-1.5 py-0.5 bg-surface-1 border border-line rounded text-[10px]">K</kbd>
                        {' untuk membuka'}
                    </span>
                </div>
            </div>

            <style>{`
                @keyframes searchModalIn {
                    from {
                        transform: scale(0.95) translateY(-10px);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1) translateY(0);
                        opacity: 1;
                    }
                }
                .animate-search-modal-in {
                    animation: searchModalIn 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
