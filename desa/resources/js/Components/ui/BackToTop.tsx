import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/cn';

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="Kembali ke atas"
            className={cn(
                'fixed bottom-24 right-6 md:bottom-28 md:right-8 z-40',
                'w-11 h-11 md:w-12 md:h-12 rounded-full',
                'bg-surface-1 text-ink-1 border border-line shadow-md',
                'hover:shadow-lg hover:border-line-strong hover:text-brand-strong',
                'flex items-center justify-center transition-all duration-300',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2',
                visible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-4 scale-75 pointer-events-none',
            )}
        >
            <ChevronUp className="w-5 h-5" aria-hidden />
        </button>
    );
}

