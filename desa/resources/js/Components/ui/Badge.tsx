import { PropsWithChildren } from 'react';
import { cn } from '@/lib/cn';

interface BadgeProps extends PropsWithChildren {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'emerald' | 'brand' | 'accent' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    rounded?: boolean;
    withDot?: boolean;
    className?: string;
}

const variantClasses: Record<string, string> = {
    default: 'bg-surface-3 text-ink-2 border-line',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-brand-soft text-brand-strong border-brand-soft',
    brand: 'bg-brand-soft text-brand-strong border-brand-soft',
    accent: 'bg-accent-soft text-accent-strong border-accent-soft',
    outline: 'bg-surface-1 text-ink-2 border-line',
};

const dotMap: Record<string, string> = {
    default: 'bg-ink-3',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    emerald: 'bg-brand',
    brand: 'bg-brand',
    accent: 'bg-accent',
    outline: 'bg-ink-3',
};

const sizeClasses: Record<string, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1 text-sm',
};

export default function Badge({
    variant = 'default',
    size = 'md',
    rounded = false,
    withDot = false,
    className = '',
    children,
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 font-medium border',
                variantClasses[variant],
                sizeClasses[size],
                rounded ? 'rounded-full' : 'rounded-md',
                className,
            )}
        >
            {withDot && <span className={cn('inline-block w-1.5 h-1.5 rounded-full', dotMap[variant])} aria-hidden />}
            {children}
        </span>
    );
}
