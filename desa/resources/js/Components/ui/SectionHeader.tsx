import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import Eyebrow from './Eyebrow';

interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, PropsWithChildren {
    eyebrow?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    align?: 'left' | 'center';
    actions?: ReactNode;
    titleSize?: 'md' | 'lg' | 'xl';
}

const titleSizeMap = {
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl',
    xl: 'text-4xl md:text-5xl',
} as const;

export default function SectionHeader({
    eyebrow,
    title,
    description,
    align = 'left',
    actions,
    titleSize = 'lg',
    className,
    children,
    ...rest
}: SectionHeaderProps) {
    return (
        <div
            className={cn(
                'flex flex-col',
                align === 'center'
                    ? 'items-center text-center mx-auto max-w-3xl'
                    : 'items-start',
                actions ? 'md:flex-row md:items-end md:justify-between md:gap-6' : '',
                className,
            )}
            {...rest}
        >
            <div className={cn('flex flex-col', align === 'center' ? 'items-center' : 'items-start')}>
                {eyebrow && <div className="mb-3"><Eyebrow>{eyebrow}</Eyebrow></div>}
                <h2 className={cn('font-bold tracking-tight text-ink-1', titleSizeMap[titleSize])}>
                    {title}
                </h2>
                {description && (
                    <p className={cn('mt-3 text-ink-3 text-base md:text-lg leading-relaxed', align === 'center' ? '' : 'max-w-2xl')}>
                        {description}
                    </p>
                )}
                {children}
            </div>
            {actions && <div className="mt-4 md:mt-0 shrink-0">{actions}</div>}
        </div>
    );
}
