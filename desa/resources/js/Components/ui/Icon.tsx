import type { LucideIcon, LucideProps } from 'lucide-react';
import { cn } from '@/lib/cn';

const sizeMap = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
} as const;

interface IconProps extends Omit<LucideProps, 'ref'> {
    icon: LucideIcon;
    size?: keyof typeof sizeMap;
}

/**
 * Wrapper around lucide-react icons with size presets that can still be
 * overridden via `className` (twMerge resolves conflicts).
 *
 * Usage: <Icon icon={MapPin} size="sm" className="text-brand" />
 */
export default function Icon({ icon: Component, size = 'md', className, ...rest }: IconProps) {
    return <Component className={cn(sizeMap[size], className)} aria-hidden={rest['aria-label'] ? undefined : true} {...rest} />;
}
