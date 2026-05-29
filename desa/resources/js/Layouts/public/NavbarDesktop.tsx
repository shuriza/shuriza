import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
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

const containerVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const, staggerChildren: 0.04 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: -6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function NavbarDesktop({ user, currentUrl, onSearch }: NavbarDesktopProps) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:flex items-center justify-between h-16 gap-3 lg:gap-6"
        >
            <motion.div variants={itemVariants}>
                <Logo />
            </motion.div>

            <nav className="flex items-center" aria-label="Navigasi utama">
                {navLinks.map((link) => {
                    const active = isActive(currentUrl, link.href);
                    return (
                        <motion.div key={link.name} variants={itemVariants} className="relative">
                            <Link
                                href={link.href}
                                className={cn(
                                    'relative inline-block px-2.5 py-1.5 lg:px-3 text-sm font-medium transition-colors duration-150',
                                    active ? 'text-brand-strong' : 'text-ink-2 hover:text-ink-1',
                                )}
                            >
                                {link.name}
                                {active && (
                                    <motion.span
                                        layoutId="navbar-active-indicator"
                                        className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-brand"
                                        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                                    />
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            <motion.div variants={itemVariants} className="flex items-center gap-2 shrink-0">
                <button
                    onClick={onSearch}
                    aria-label="Cari (Ctrl+K)"
                    title="Cari (Ctrl+K)"
                    className="group flex items-center gap-2 p-2 lg:pl-2.5 lg:pr-2 lg:py-1.5 rounded-xl text-ink-3 hover:text-ink-1 hover:bg-surface-2 transition-all duration-150"
                >
                    <Search className="w-4 h-4" aria-hidden />
                    <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium bg-surface-3 border border-line rounded text-ink-3 group-hover:bg-surface-1 transition-colors">
                        Ctrl K
                    </kbd>
                </button>

                {user ? (
                    <UserMenu user={user} />
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="px-3 py-1.5 text-sm font-medium text-ink-2 hover:text-brand-strong transition-colors"
                        >
                            Masuk
                        </Link>
                        <Link
                            href="/register"
                            className="px-3.5 py-1.5 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent-strong transition-all duration-150 shadow-sm hover:shadow active:scale-[0.98]"
                        >
                            Daftar
                        </Link>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
}
