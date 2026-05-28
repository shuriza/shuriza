import { Link } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Search, Menu as MenuIcon, X, MessageCircle, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/cn';
import Logo from './Logo';
import { navLinks } from './navLinks';

interface NavbarMobileUser {
    id: number;
    name: string;
    email: string;
    role?: 'admin' | 'warga';
}

interface NavbarMobileProps {
    user: NavbarMobileUser | null;
    currentUrl: string;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onSearch: () => void;
}

function isActive(url: string, href: string) {
    if (href === '/') return url === '/';
    return url === href || url.startsWith(href + '/');
}

export default function NavbarMobile({ user, currentUrl, isOpen, onOpen, onClose, onSearch }: NavbarMobileProps) {
    return (
        <>
            <div className="md:hidden flex items-center justify-between h-16">
                <Logo />
                <div className="flex items-center gap-1">
                    <button
                        onClick={onSearch}
                        aria-label="Cari"
                        className="p-2 rounded-lg text-ink-2 hover:text-brand-strong hover:bg-surface-2 transition-colors"
                    >
                        <Search className="w-5 h-5" aria-hidden />
                    </button>
                    <button
                        onClick={onOpen}
                        aria-label="Buka menu"
                        className="p-2 rounded-lg text-ink-2 hover:text-brand-strong hover:bg-surface-2 transition-colors"
                    >
                        <MenuIcon className="w-6 h-6" aria-hidden />
                    </button>
                </div>
            </div>

            <Transition show={isOpen} as={Fragment}>
                <Dialog onClose={onClose} className="relative z-[45] md:hidden">
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-ink-1/40 backdrop-blur-sm" aria-hidden />
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-transform ease-out duration-300"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition-transform ease-in duration-200"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <Dialog.Panel className="fixed inset-y-0 right-0 w-[88%] max-w-sm bg-surface-1 shadow-2xl flex flex-col">
                            <div className="px-5 pt-6 pb-3 border-b border-line">
                                <Logo />
                                <p className="text-xs text-ink-3 mt-2">Website komunitas Desa Muneng</p>
                            </div>

                            <div className="flex-1 overflow-y-auto px-3 py-4">
                                <nav className="flex flex-col gap-1" aria-label="Navigasi mobile">
                                    {navLinks.map((link) => {
                                        const active = isActive(currentUrl, link.href);
                                        return (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                onClick={onClose}
                                                className={cn(
                                                    'flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors min-h-[48px]',
                                                    active
                                                        ? 'bg-brand-soft text-brand-strong'
                                                        : 'text-ink-1 hover:bg-surface-2',
                                                )}
                                            >
                                                {link.name}
                                            </Link>
                                        );
                                    })}
                                </nav>

                                <div className="my-4 border-t border-line" />

                                {user ? (
                                    <div className="flex flex-col gap-1">
                                        <div className="px-4 py-2 text-xs text-ink-3">
                                            Masuk sebagai <span className="font-semibold text-ink-1">{user.name}</span>
                                        </div>
                                        <Link href="/dashboard-saya" onClick={onClose} className="px-4 py-3 rounded-xl text-base font-medium text-ink-1 hover:bg-surface-2 min-h-[48px] flex items-center">
                                            Dashboard Saya
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link href="/admin" onClick={onClose} className="px-4 py-3 rounded-xl text-base font-medium text-ink-1 hover:bg-surface-2 min-h-[48px] flex items-center">
                                                Dashboard Admin
                                            </Link>
                                        )}
                                        <Link href="/logout" method="post" as="button" className="px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 min-h-[48px] flex items-center text-left">
                                            Keluar
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 px-1">
                                        <Link href="/login" onClick={onClose} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-line text-ink-1 font-medium min-h-[48px]">
                                            <LogIn className="w-4 h-4" aria-hidden /> Masuk
                                        </Link>
                                        <Link href="/register" onClick={onClose} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-white font-semibold min-h-[48px]">
                                            <UserPlus className="w-4 h-4" aria-hidden /> Daftar
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="px-4 py-4 border-t border-line bg-surface-2 flex flex-col gap-2">
                                <a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] text-white font-medium min-h-[48px]"
                                >
                                    <MessageCircle className="w-4 h-4" aria-hidden /> Hubungi WhatsApp
                                </a>
                                <button
                                    onClick={onClose}
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface-1 border border-line text-ink-1 font-medium min-h-[48px]"
                                >
                                    <X className="w-4 h-4" aria-hidden /> Tutup menu
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>
        </>
    );
}
