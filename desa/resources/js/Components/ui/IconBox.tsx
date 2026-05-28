import type { LucideIcon } from 'lucide-react';
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import Icon from './Icon';

interface IconBoxProps extends HTMLAttributes<HTMLDivElement> {
    icon: LucideIcon;
    variant?: 'brand' | 'accent' | 'neutral' | 'inverse';
    shape?: 'square' | 'circle';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const variantMap = {
    brand: 'bg-brand-soft text-brand-strong',
    accent: 'bg-accent-soft text-accent-strong',
    neutral: 'bg-surface-3 text-ink-2',
    inverse: 'bg-ink-1 text-white',
} as const;

const sizeBox = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
} as const;

const sizeIcon = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
} as const;

export default function IconBox({
    icon,
    variant = 'brand',
    shape = 'square',
    size = 'md',
    className,
    ...rest
}: IconBoxProps) {
    return (
        <div
            className={cn(
                'inline-flex items-center justify-center shrink-0',
                shape === 'square' ? 'rounded-xl' : 'rounded-full',
                variantMap[variant],
                sizeBox[size],
                className,
            )}
            {...rest}
        >
            <Icon icon={icon} size={sizeIcon[size]} />
        </div>
    );
}
