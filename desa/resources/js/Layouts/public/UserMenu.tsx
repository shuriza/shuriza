import { Link } from '@inertiajs/react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDown, LayoutDashboard, ShieldCheck, LogOut } from 'lucide-react';
import Avatar from '@/Components/ui/Avatar';
import { cn } from '@/lib/cn';

interface UserMenuUser {
    id: number;
    name: string;
    email: string;
    role?: 'admin' | 'warga';
}

interface UserMenuProps {
    user: UserMenuUser;
}

export default function UserMenu({ user }: UserMenuProps) {
    const isAdmin = user.role === 'admin';

    return (
        <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 px-2 py-1.5 rounded-xl text-sm font-medium text-ink-1 hover:bg-surface-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2">
                <Avatar name={user.name} size="sm" />
                <span className="hidden lg:inline max-w-[120px] truncate">{user.name}</span>
                <ChevronDown className="w-4 h-4 text-ink-3" aria-hidden />
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 scale-95 -translate-y-1"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-surface-1 rounded-xl shadow-lg border border-line py-1 z-50 focus:outline-none">
                    <div className="px-4 py-2 border-b border-line">
                        <p className="text-sm font-semibold text-ink-1 truncate">{user.name}</p>
                        <p className="text-xs text-ink-3 truncate">{user.email}</p>
                    </div>
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                href="/dashboard-saya"
                                className={cn('flex items-center gap-2 px-4 py-2 text-sm', active ? 'bg-brand-soft text-brand-strong' : 'text-ink-2')}
                            >
                                <LayoutDashboard className="w-4 h-4" aria-hidden /> Dashboard Saya
                            </Link>
                        )}
                    </Menu.Item>
                    {isAdmin && (
                        <Menu.Item>
                            {({ active }) => (
                                <Link
                                    href="/admin"
                                    className={cn('flex items-center gap-2 px-4 py-2 text-sm', active ? 'bg-brand-soft text-brand-strong' : 'text-ink-2')}
                                >
                                    <ShieldCheck className="w-4 h-4" aria-hidden /> Dashboard Admin
                                </Link>
                            )}
                        </Menu.Item>
                    )}
                    <div className="border-t border-line my-1" />
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className={cn('w-full text-left flex items-center gap-2 px-4 py-2 text-sm', active ? 'bg-red-50 text-red-700' : 'text-red-600')}
                            >
                                <LogOut className="w-4 h-4" aria-hidden /> Keluar
                            </Link>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
