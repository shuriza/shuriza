import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
    variant?: 'default' | 'bordered' | 'elevated' | 'flat' | 'glow';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    interactive?: boolean;
    className?: string;
}

interface CardHeaderProps extends PropsWithChildren {
    className?: string;
}

interface CardBodyProps extends PropsWithChildren {
    className?: string;
}

interface CardFooterProps extends PropsWithChildren {
    className?: string;
}

interface CardCoverProps extends PropsWithChildren {
    image?: string | null;
    alt?: string;
    ratio?: '16/9' | '4/3' | '1/1' | '3/2';
    className?: string;
    overlay?: ReactNode;
}

const variantClasses: Record<string, string> = {
    default: 'bg-surface-1 rounded-xl shadow-sm border border-line',
    bordered: 'bg-surface-1 rounded-xl border border-line-strong',
    elevated: 'bg-surface-1 rounded-xl shadow-lg border border-line-subtle',
    flat: 'bg-surface-2 rounded-xl',
    glow: 'bg-surface-1 rounded-xl border border-brand-soft shadow-[0_0_0_4px_rgba(16,185,129,0.06)]',
};

const paddingClasses: Record<string, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
};

export function Card({
    variant = 'default',
    padding = 'none',
    interactive = false,
    className,
    children,
    ...rest
}: CardProps) {
    return (
        <div
            className={cn(
                variantClasses[variant],
                paddingClasses[padding],
                'overflow-hidden transition-all duration-200',
                interactive && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-line-strong',
                className,
            )}
            {...rest}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className = '', children }: CardHeaderProps) {
    return (
        <div className={cn('px-5 py-4 border-b border-line', className)}>
            {children}
        </div>
    );
}

export function CardBody({ className = '', children }: CardBodyProps) {
    return (
        <div className={cn('px-5 py-4', className)}>
            {children}
        </div>
    );
}

export function CardFooter({ className = '', children }: CardFooterProps) {
    return (
        <div className={cn('px-5 py-4 border-t border-line bg-surface-2/60', className)}>
            {children}
        </div>
    );
}

const ratioMap = {
    '16/9': 'aspect-[16/9]',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '3/2': 'aspect-[3/2]',
} as const;

export function CardCover({ image, alt = '', ratio = '16/9', className, overlay, children }: CardCoverProps) {
    return (
        <div className={cn('relative overflow-hidden bg-surface-3', ratioMap[ratio], className)}>
            {image ? (
                <img src={image} alt={alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-ink-4">
                    {children}
                </div>
            )}
            {overlay && <div className="absolute inset-0 pointer-events-none">{overlay}</div>}
        </div>
    );
}

export default Card;
