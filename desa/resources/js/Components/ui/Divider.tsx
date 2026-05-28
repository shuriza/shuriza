import { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
    variant?: 'default' | 'subtle' | 'strong';
}

const variantMap = {
    default: 'border-line',
    subtle: 'border-line-subtle',
    strong: 'border-line-strong',
} as const;

export default function Divider({ variant = 'default', className, ...rest }: DividerProps) {
    return <hr className={cn('w-full border-t', variantMap[variant], className)} {...rest} />;
}
