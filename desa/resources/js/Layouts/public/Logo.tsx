import { Link } from '@inertiajs/react';
import { Sprout } from 'lucide-react';
import { cn } from '@/lib/cn';

interface LogoProps {
    className?: string;
    onClick?: () => void;
    compact?: boolean;
}

export default function Logo({ className, onClick, compact = false }: LogoProps) {
    return (
        <Link href="/" onClick={onClick} className={cn('group flex items-center gap-2.5', className)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-sm transition-all group-hover:bg-brand-strong group-hover:shadow">
                <Sprout className="h-5 w-5" aria-hidden />
            </span>
            {!compact && (
                <span className="leading-tight">
                    <span className="block text-base font-extrabold tracking-tight text-ink-1 sm:text-lg">Desa Muneng</span>
                    <span className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-3 sm:block">Purwoasri, Kediri</span>
                </span>
            )}
        </Link>
    );
}
