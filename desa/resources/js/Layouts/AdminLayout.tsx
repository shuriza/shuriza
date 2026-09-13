import { Link, router, usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import {
    ArrowLeft,
    BarChart3,
    CalendarDays,
    Camera,
    FileText,
    Images,
    Inbox,
    Landmark,
    LayoutDashboard,
    LogOut,
    Mail,
    MapPin,
    Megaphone,
    Menu,
    Store,
    X,
    type LucideIcon,
} from 'lucide-react';
import Toast from '@/Components/ui/Toast';
import Avatar from '@/Components/ui/Avatar';
import { cn } from '@/lib/cn';
import type { PageProps } from '@/types';

interface AdminLayoutProps extends PropsWithChildren {
    title?: string;
}

interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
    exact?: boolean;
}

const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Kelola Event', href: '/admin/events', icon: CalendarDays },
    { name: 'Kelola Kenangan', href: '/admin/memories', icon: Images },
    { name: 'Kelola Destinasi', href: '/admin/destinations', icon: MapPin },
    { name: 'Kelola Pengumuman', href: '/admin/announcements', icon: Megaphone },
    { name: 'Kelola Kiriman', href: '/admin/submissions', icon: Inbox },
    { name: 'Pesan Masuk', href: '/admin/contacts', icon: Mail },
    { name: 'Kelola UMKM', href: '/admin/products', icon: Store },
    { name: 'Info Desa', href: '/admin/village-info', icon: FileText },
    { name: 'Galeri Foto', href: '/admin/gallery', icon: Camera },
    { name: 'Polling', href: '/admin/polls', icon: BarChart3 },
];

export default function AdminLayout({ children, title = 'Desa Muneng' }: AdminLayoutProps) {
    const { auth } = usePage<PageProps>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePage().url.split('?')[0];
    const user = auth.user;

    useEffect(() => {
        return router.on('navigate', () => setSidebarOpen(false));
    }, []);

    const isActive = (item: NavItem) =>
        item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
        <div className="min-h-screen bg-surface-2 text-ink-1">
            <Toast />

            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Tutup menu navigasi"
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                aria-label="Navigasi admin"
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-surface-inverse text-white transition-transform duration-300 lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-3 rounded-lg text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-inverse"
                    >
                        <span
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white"
                            aria-hidden
                        >
                            <Landmark className="h-5 w-5" />
                        </span>
                        <span className="text-base font-bold">Admin Desa</span>
                    </Link>
                    <button
                        type="button"
                        aria-label="Tutup menu navigasi"
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-ink-4 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-inverse lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" aria-hidden />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Menu utama">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const active = isActive(item);
                            const Icon = item.icon;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        aria-current={active ? 'page' : undefined}
                                        className={cn(
                                            'flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-inverse',
                                            active
                                                ? 'bg-brand text-white shadow-sm'
                                                : 'text-ink-4 hover:bg-white/10 hover:text-white',
                                        )}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" aria-hidden />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="shrink-0 border-t border-white/10 p-3">
                    <Link
                        href="/"
                        className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-ink-4 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-inverse"
                    >
                        <ArrowLeft className="h-5 w-5" aria-hidden />
                        <span>Kembali ke Website</span>
                    </Link>
                </div>
            </aside>

            <div className="min-h-screen lg:ml-72">
                <header className="sticky top-0 z-30 border-b border-line bg-surface-1/95 backdrop-blur">
                    <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                type="button"
                                aria-label="Buka menu navigasi"
                                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="h-5 w-5" aria-hidden />
                            </button>
                            <p className="truncate text-base font-semibold text-ink-1 sm:text-lg">
                                {title}
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-3">
                                <Avatar name={user?.name ?? 'Admin'} src={user?.avatar} size="sm" />
                                <div className="hidden text-right sm:block">
                                    <p className="text-sm font-semibold text-ink-1">
                                        {user?.name ?? 'Admin'}
                                    </p>
                                    <p className="text-xs text-ink-3">{user?.email ?? ''}</p>
                                </div>
                            </div>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            >
                                <LogOut className="h-4 w-4" aria-hidden />
                                <span className="hidden sm:inline">Keluar</span>
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
