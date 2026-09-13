import Avatar from '@/Components/ui/Avatar';
import Logo from '@/Layouts/public/Logo';
import { cn } from '@/lib/cn';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown, LayoutDashboard, LogOut, Menu as MenuIcon, ShieldCheck, UserRound, X } from 'lucide-react';
import { Fragment, PropsWithChildren, ReactNode, useState } from 'react';

interface AuthenticatedLayoutProps extends PropsWithChildren {
    header?: ReactNode;
}

export default function AuthenticatedLayout({ header, children }: AuthenticatedLayoutProps) {
    const user = usePage().props.auth.user!;
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);
    const isDashboardActive = route().current('user.dashboard');

    return (
        <div className="min-h-screen bg-surface-2">
            <nav className="sticky top-0 z-40 border-b border-line bg-surface-1/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-6">
                        <Logo className="shrink-0" />
                        <div className="hidden items-center gap-1 sm:flex">
                            <Link
                                href="/dashboard-saya"
                                className={cn(
                                    'inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2',
                                    isDashboardActive ? 'bg-brand-soft text-brand-strong' : 'text-ink-2 hover:bg-surface-2 hover:text-ink-1',
                                )}
                            >
                                <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden />
                                Dashboard Saya
                            </Link>
                        </div>
                    </div>

                    <div className="hidden items-center sm:flex">
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex min-h-11 items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium text-ink-1 transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2">
                                <Avatar name={user.name} src={user.avatar} size="sm" />
                                <span className="max-w-36 truncate">{user.name}</span>
                                <ChevronDown className="h-4 w-4 text-ink-3" aria-hidden />
                            </Menu.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-150"
                                enterFrom="-translate-y-1 scale-95 opacity-0"
                                enterTo="translate-y-0 scale-100 opacity-100"
                                leave="transition ease-in duration-100"
                                leaveFrom="translate-y-0 scale-100 opacity-100"
                                leaveTo="-translate-y-1 scale-95 opacity-0"
                            >
                                <Menu.Items className="absolute right-0 z-50 mt-2 w-60 origin-top-right rounded-xl border border-line bg-surface-1 py-1 shadow-lg focus:outline-none">
                                    <div className="border-b border-line px-4 py-3">
                                        <p className="truncate text-sm font-semibold text-ink-1">{user.name}</p>
                                        <p className="truncate text-xs text-ink-3">{user.email}</p>
                                    </div>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href={route('profile.edit')}
                                                className={cn(
                                                    'flex min-h-11 items-center gap-2 px-4 py-2 text-sm',
                                                    active ? 'bg-brand-soft text-brand-strong' : 'text-ink-2',
                                                )}
                                            >
                                                <UserRound className="h-4 w-4" aria-hidden />
                                                Profil saya
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    {user.role === 'admin' && (
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/admin"
                                                    className={cn(
                                                        'flex min-h-11 items-center gap-2 px-4 py-2 text-sm',
                                                        active ? 'bg-brand-soft text-brand-strong' : 'text-ink-2',
                                                    )}
                                                >
                                                    <ShieldCheck className="h-4 w-4" aria-hidden />
                                                    Dashboard admin
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    )}
                                    <div className="my-1 border-t border-line" />
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className={cn(
                                                    'flex min-h-11 w-full items-center gap-2 px-4 py-2 text-left text-sm',
                                                    active ? 'bg-red-50 text-red-700' : 'text-red-600',
                                                )}
                                            >
                                                <LogOut className="h-4 w-4" aria-hidden />
                                                Keluar
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>

                    <button
                        type="button"
                        aria-label={isNavigationOpen ? 'Tutup navigasi' : 'Buka navigasi'}
                        aria-controls="navigasi-warga"
                        aria-expanded={isNavigationOpen}
                        onClick={() => setIsNavigationOpen((open) => !open)}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 sm:hidden"
                    >
                        {isNavigationOpen ? <X className="h-5 w-5" aria-hidden /> : <MenuIcon className="h-5 w-5" aria-hidden />}
                    </button>
                </div>

                {isNavigationOpen && (
                    <div id="navigasi-warga" className="border-t border-line bg-surface-1 px-4 py-3 sm:hidden">
                        <div className="mx-auto max-w-7xl space-y-1">
                            <Link
                                href="/dashboard-saya"
                                onClick={() => setIsNavigationOpen(false)}
                                className={cn('flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium', isDashboardActive ? 'bg-brand-soft text-brand-strong' : 'text-ink-2 hover:bg-surface-2')}
                            >
                                <LayoutDashboard className="h-4 w-4" aria-hidden />
                                Dashboard Saya
                            </Link>
                            <Link
                                href={route('profile.edit')}
                                onClick={() => setIsNavigationOpen(false)}
                                className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-ink-2 hover:bg-surface-2"
                            >
                                <UserRound className="h-4 w-4" aria-hidden />
                                Profil saya
                            </Link>
                            {user.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    onClick={() => setIsNavigationOpen(false)}
                                    className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-ink-2 hover:bg-surface-2"
                                >
                                    <ShieldCheck className="h-4 w-4" aria-hidden />
                                    Dashboard admin
                                </Link>
                            )}
                            <div className="my-2 border-t border-line" />
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                onClick={() => setIsNavigationOpen(false)}
                                className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="h-4 w-4" aria-hidden />
                                Keluar
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {header && (
                <header className="border-b border-line bg-surface-1">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
