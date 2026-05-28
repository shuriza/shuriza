import { PropsWithChildren, useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import SearchModal from '@/Components/ui/SearchModal';
import Toast from '@/Components/ui/Toast';
import BackToTop from '@/Components/ui/BackToTop';
import WhatsAppFloat from '@/Components/ui/WhatsAppFloat';
import Navbar from './public/Navbar';
import Footer from './public/Footer';
import { pageTransition } from '@/lib/motion';

interface PageUser {
    id: number;
    name: string;
    email: string;
    role?: 'admin' | 'warga';
}

export default function PublicLayout({ children }: PropsWithChildren) {
    const { auth, url } = usePage().props as unknown as {
        auth: { user: PageUser | null };
        url?: string;
    };
    const inertiaUrl = usePage().url;
    const [searchOpen, setSearchOpen] = useState(false);

    // Ctrl+K opens search
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    // Force scroll-to-top on navigation start (avoids feel of lingering scroll during AnimatePresence exit)
    useEffect(() => {
        const off = router.on('start', (event) => {
            if (!event.detail.visit.preserveScroll) {
                window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
            }
        });
        return off;
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-surface-1 text-ink-2 font-sans">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-ink-1 focus:text-white focus:rounded-md focus:shadow-lg"
            >
                Lompat ke konten utama
            </a>

            <Toast />
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            <Navbar user={auth.user} onSearch={() => setSearchOpen(true)} />

            <main id="main-content" className="flex-1">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={inertiaUrl}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageTransition}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            <Footer />

            <BackToTop />
            <WhatsAppFloat />
        </div>
    );
}
