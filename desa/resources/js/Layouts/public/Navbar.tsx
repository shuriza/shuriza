import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { cn } from '@/lib/cn';
import Container from '@/Components/ui/Container';
import NavbarDesktop from './NavbarDesktop';
import NavbarMobile from './NavbarMobile';

interface NavbarUser {
    id: number;
    name: string;
    email: string;
    role?: 'admin' | 'warga';
}

interface NavbarProps {
    user: NavbarUser | null;
    onSearch: () => void;
}

export default function Navbar({ user, onSearch }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { url } = usePage();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const off = router.on('navigate', () => setMobileOpen(false));
        return off;
    }, []);

    return (
        <header
            className={cn(
                'sticky top-0 z-30 transition-all duration-200',
                scrolled
                    ? 'bg-surface-1 border-b border-line shadow-sm'
                    : 'bg-surface-1/70 backdrop-blur border-b border-transparent',
            )}
        >
            <Container>
                <NavbarDesktop user={user} currentUrl={url} onSearch={onSearch} />
                <NavbarMobile
                    user={user}
                    currentUrl={url}
                    isOpen={mobileOpen}
                    onOpen={() => setMobileOpen(true)}
                    onClose={() => setMobileOpen(false)}
                    onSearch={onSearch}
                />
            </Container>
        </header>
    );
}
