import type { LucideIcon } from 'lucide-react';
import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import Icon from './Icon';

export interface MetaItem {
    icon: LucideIcon;
    text: ReactNode;
    label?: string;
}

interface MetaListProps extends HTMLAttributes<HTMLUListElement> {
    items: MetaItem[];
    layout?: 'stacked' | 'inline';
    size?: 'sm' | 'md';
}

const sizeMap = {
    sm: 'text-xs gap-x-3 gap-y-1.5',
    md: 'text-sm gap-x-4 gap-y-2',
} as const;

export default function MetaList({
    items,
    layout = 'stacked',
    size = 'sm',
    className,
    ...rest
}: MetaListProps) {
    return (
        <ul
            className={cn(
                'flex flex-wrap text-ink-3',
                layout === 'stacked' ? 'flex-col' : 'flex-row',
                sizeMap[size],
                className,
            )}
            {...rest}
        >
            {items.map((item, idx) => (
                <li key={idx} className="inline-flex items-center gap-2 min-w-0">
                    <Icon icon={item.icon} size={size === 'sm' ? 'sm' : 'md'} className="text-brand-strong shrink-0" />
                    <span className="truncate" aria-label={item.label}>
                        {item.text}
                    </span>
                </li>
            ))}
        </ul>
    );
}
