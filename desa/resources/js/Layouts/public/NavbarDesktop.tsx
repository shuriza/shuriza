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
            className="hidden md:block"
        >
            <div className="flex h-[74px] items-center gap-5">
                <motion.div variants={itemVariants} className="shrink-0">
                    <Logo />
                </motion.div>

                <motion.button
                    variants={itemVariants}
                    onClick={onSearch}
                    aria-label="Cari informasi desa (Ctrl+K)"
                    title="Cari informasi desa (Ctrl+K)"
                    className="group mx-auto flex h-11 max-w-xl flex-1 items-center gap-3 rounded-xl border border-line bg-surface-2 px-4 text-left text-sm text-ink-3 transition hover:border-line-strong hover:bg-surface-1 hover:shadow-sm"
                >
                    <Search className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="flex-1">Cari berita, acara, atau tempat...</span>
                    <kbd className="hidden items-center rounded-md border border-line bg-surface-1 px-2 py-1 text-[10px] font-bold text-ink-3 lg:inline-flex">
                        Ctrl K
                    </kbd>
                </motion.button>

                <motion.div variants={itemVariants} className="flex shrink-0 items-center gap-2">
                    {user ? (
                        <UserMenu user={user} />
                    ) : (
                        <>
                            <Link href="/login" className="px-3 py-2 text-sm font-bold text-ink-2 transition-colors hover:text-brand-strong">
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-xl bg-brand-strong px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.98]"
                            >
                                Daftar
                            </Link>
                        </>
                    )}
                </motion.div>
            </div>

            <nav
                className="flex gap-1 overflow-x-auto border-t border-line-subtle py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                aria-label="Navigasi utama"
            >
                {navLinks.map((link) => {
                    const active = isActive(currentUrl, link.href);
                    return (
                        <motion.div key={link.name} variants={itemVariants} className="shrink-0">
                            <Link
                                href={link.href}
                                className={cn(
                                    'inline-flex min-h-9 items-center rounded-full px-4 text-sm font-bold transition-colors',
                                    active ? 'bg-brand-soft text-brand-strong' : 'text-ink-2 hover:bg-surface-2 hover:text-ink-1',
                                )}
                            >
                                {link.name}
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>
        </motion.div>
    );
}
