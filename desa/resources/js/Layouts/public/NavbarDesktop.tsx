import { Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import Logo from './Logo';
import UserMenu from './UserMenu';
import { navLinks } from './navLinks';

interface NavbarDesktopUser {
    id: number;
    name: string;
    email: string;
    role?: 'admin' | 'warga';
}

interface NavbarDesktopProps {
    user: NavbarDesktopUser | null;
    currentUrl: string;
    onSearch: () => void;
}

function isActive(url: string, href: string) {
    if (href === '/') return url === '/';
    return url === href || url.startsWith(href + '/');
}

export default function NavbarDesktop({ user, currentUrl, onSearch }: NavbarDesktopProps) {
    return (
        <div className="hidden md:flex items-center justify-between h-16 gap-4">
            <Logo />
            <nav className="flex items-center gap-1" aria-label="Navigasi utama">
                {navLinks.map((link) => {
                    const active = isActive(currentUrl, link.href);
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                'relative px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                                active
                                    ? 'text-brand-strong bg-brand-soft/60'
                                    : 'text-ink-2 hover:text-brand-strong hover:bg-surface-2',
                            )}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="flex items-center gap-2">
                <button
                    onClick={onSearch}
                    aria-label="Cari (Ctrl+K)"
                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl text-sm text-ink-3 hover:text-ink-1 bg-surface-3 hover:bg-surface-2 transition-colors border border-line"
                >
                    <Search className="w-4 h-4" aria-hidden />
                    <span className="hidden lg:inline text-xs">Cari…</span>
                    <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-medium bg-surface-1 border border-line rounded">Ctrl K</kbd>
                </button>
                {user ? (
                    <UserMenu user={user} />
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="px-3 py-2 text-sm font-medium text-ink-2 hover:text-brand-strong transition-colors"
                        >
                            Masuk
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent-strong transition-all duration-150 shadow-sm hover:shadow active:scale-[0.98]"
                        >
                            Daftar
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
