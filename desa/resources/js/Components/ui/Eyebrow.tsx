import { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/cn';

interface EyebrowProps extends HTMLAttributes<HTMLSpanElement>, PropsWithChildren {
    withBar?: boolean;
}

export default function Eyebrow({ withBar = true, className, children, ...rest }: EyebrowProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-strong',
                className,
            )}
            {...rest}
        >
            {withBar && <span className="inline-block h-0.5 w-6 bg-brand-strong" aria-hidden />}
            {children}
        </span>
    );
}
