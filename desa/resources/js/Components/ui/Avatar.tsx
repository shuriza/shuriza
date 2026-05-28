import { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    name: string;
    src?: string | null;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'brand' | 'accent' | 'neutral';
}

const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
} as const;

const variantMap = {
    brand: 'bg-brand-soft text-brand-strong',
    accent: 'bg-accent-soft text-accent-strong',
    neutral: 'bg-surface-3 text-ink-2',
} as const;

function getInitials(name: string) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

export default function Avatar({
    name,
    src,
    size = 'md',
    variant = 'brand',
    className,
    ...rest
}: AvatarProps) {
    return (
        <div
            className={cn(
                'inline-flex items-center justify-center rounded-full font-semibold overflow-hidden shrink-0',
                variantMap[variant],
                sizeMap[size],
                className,
            )}
            {...rest}
        >
            {src ? (
                <img src={src} alt={name} className="w-full h-full object-cover" />
            ) : (
                <span aria-hidden>{getInitials(name)}</span>
            )}
        </div>
    );
}
