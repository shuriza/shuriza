import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import Container from './Container';
import Eyebrow from './Eyebrow';

interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
    eyebrow?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    breadcrumb?: ReactNode;
    actions?: ReactNode;
    variant?: 'default' | 'brand';
    align?: 'left' | 'center';
}

const variantMap = {
    default: 'bg-gradient-to-b from-surface-2 to-surface-1 border-b border-line',
    brand: 'bg-gradient-to-b from-brand-soft to-surface-1 border-b border-line',
} as const;

export default function PageHeader({
    eyebrow,
    title,
    description,
    breadcrumb,
    actions,
    variant = 'default',
    align = 'left',
    className,
    ...rest
}: PageHeaderProps) {
    return (
        <header className={cn('relative pt-10 md:pt-14 pb-10 md:pb-14', variantMap[variant], className)} {...rest}>
            <Container>
                {breadcrumb && <div className="mb-4">{breadcrumb}</div>}
                <div
                    className={cn(
                        'flex flex-col gap-6',
                        actions ? 'md:flex-row md:items-end md:justify-between' : '',
                        align === 'center' ? 'items-center text-center' : '',
                    )}
                >
                    <div className={cn(align === 'center' ? 'mx-auto max-w-3xl' : 'max-w-3xl')}>
                        {eyebrow && <div className="mb-3"><Eyebrow>{eyebrow}</Eyebrow></div>}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-ink-1">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-3 text-base md:text-lg text-ink-3 leading-relaxed">{description}</p>
                        )}
                    </div>
                    {actions && <div className="shrink-0">{actions}</div>}
                </div>
            </Container>
        </header>
    );
}
