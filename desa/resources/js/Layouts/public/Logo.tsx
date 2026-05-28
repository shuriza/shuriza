import { Link } from '@inertiajs/react';
import { Mountain } from 'lucide-react';
import { cn } from '@/lib/cn';

interface LogoProps {
    className?: string;
    onClick?: () => void;
    compact?: boolean;
}

export default function Logo({ className, onClick, compact = false }: LogoProps) {
    return (
        <Link href="/" onClick={onClick} className={cn('flex items-center gap-2 group', className)}>
            <span className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center shadow-sm group-hover:shadow transition-all">
                <Mountain className="w-5 h-5 text-white" aria-hidden />
            </span>
            {!compact && (
                <span className="text-lg font-extrabold tracking-tight text-ink-1">Desa Muneng</span>
            )}
        </Link>
    );
}
