import { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeMap = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none',
} as const;

export default function Container({ size = 'xl', className, children, ...rest }: ContainerProps) {
    return (
        <div
            className={cn('mx-auto px-4 sm:px-6 lg:px-8', sizeMap[size], className)}
            {...rest}
        >
            {children}
        </div>
    );
}
