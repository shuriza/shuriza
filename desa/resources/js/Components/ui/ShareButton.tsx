import { useState, useRef, useEffect } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ShareButtonProps {
    title: string;
    url?: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleWhatsApp = () => {
        const text = `${title}\n${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        setIsOpen(false);
    };

    const handleFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        setIsOpen(false);
    };

    const handleTwitter = () => {
        const text = `${title}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        setIsOpen(false);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Bagikan"
                aria-expanded={isOpen}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-strong text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 active:scale-[0.98]"
            >
                <Share2 className="w-4 h-4" aria-hidden />
                Bagikan
            </button>

            {/* Dropdown */}
            <div
                className={cn(
                    'absolute right-0 mt-2 w-52 bg-surface-1 rounded-xl shadow-lg border border-line py-2 z-50 transition-all duration-200 origin-top-right',
                    isOpen
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none',
                )}
            >
                {/* WhatsApp */}
                <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink-2 hover:bg-green-50 hover:text-green-700 transition-colors duration-150"
                >
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                </button>

                {/* Copy Link */}
                <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink-2 hover:bg-brand-soft hover:text-brand-strong transition-colors duration-150"
                >
                    <LinkIcon className="w-5 h-5 text-brand" aria-hidden />
                    Salin Link
                </button>

                {/* Facebook */}
                <button
                    onClick={handleFacebook}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink-2 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                >
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                </button>

                {/* Twitter/X */}
                <button
                    onClick={handleTwitter}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink-1 transition-colors duration-150"
                >
                    <svg className="w-5 h-5 text-ink-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Twitter / X
                </button>
            </div>

            {/* Copied Toast */}
            <div
                className={cn(
                    'fixed bottom-6 left-1/2 -translate-x-1/2 z-[55] transition-all duration-300',
                    copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
                )}
            >
                <div className="bg-ink-1 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" aria-hidden />
                    Link disalin!
                </div>
            </div>
        </div>
    );
}
