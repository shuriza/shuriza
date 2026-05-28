import { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/cn';

interface SectionProps extends HTMLAttributes<HTMLElement>, PropsWithChildren {
    variant?: 'default' | 'alt' | 'brand' | 'dark';
    spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const variantMap = {
    default: 'bg-surface-1 text-ink-2',
    alt: 'bg-surface-2 text-ink-2',
    brand: 'bg-brand-soft text-ink-2',
    dark: 'bg-ink-1 text-white',
} as const;

const spacingMap = {
    none: '',
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-20',
    xl: 'py-20 md:py-28',
} as const;

export default function Section({
    variant = 'default',
    spacing = 'xl',
    className,
    children,
    ...rest
}: SectionProps) {
    return (
        <section
            className={cn('relative', variantMap[variant], spacingMap[spacing], className)}
            {...rest}
        >
            {children}
        </section>
    );
}
