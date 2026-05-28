import { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/cn';

interface TagProps extends HTMLAttributes<HTMLSpanElement>, PropsWithChildren {
    variant?: 'default' | 'brand' | 'accent' | 'outline';
    size?: 'sm' | 'md';
    withDot?: boolean;
}

const variantMap = {
    default: 'bg-surface-3 text-ink-2',
    brand: 'bg-brand-soft text-brand-strong',
    accent: 'bg-accent-soft text-accent-strong',
    outline: 'border border-line text-ink-2 bg-surface-1',
} as const;

const sizeMap = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
} as const;

const dotMap = {
    default: 'bg-ink-3',
    brand: 'bg-brand',
    accent: 'bg-accent',
    outline: 'bg-ink-3',
} as const;

export default function Tag({
    variant = 'default',
    size = 'sm',
    withDot = false,
    className,
    children,
    ...rest
}: TagProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center font-medium rounded-full',
                variantMap[variant],
                sizeMap[size],
                className,
            )}
            {...rest}
        >
            {withDot && <span className={cn('inline-block w-1.5 h-1.5 rounded-full', dotMap[variant])} aria-hidden />}
            {children}
        </span>
    );
}
