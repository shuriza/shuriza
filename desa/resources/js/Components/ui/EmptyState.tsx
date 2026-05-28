import type { LucideIcon } from 'lucide-react';
import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import IconBox from './IconBox';

interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    icon: LucideIcon;
    title: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-20',
} as const;

export default function EmptyState({
    icon,
    title,
    description,
    action,
    size = 'md',
    className,
    ...rest
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center text-center',
                sizeMap[size],
                className,
            )}
            {...rest}
        >
            <IconBox icon={icon} variant="brand" shape="circle" size="xl" className="mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-ink-1 mb-2">{title}</h3>
            {description && (
                <p className="text-ink-3 text-sm md:text-base max-w-sm">{description}</p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}
