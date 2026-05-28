import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FieldProps extends HTMLAttributes<HTMLDivElement> {
    label?: ReactNode;
    htmlFor?: string;
    description?: ReactNode;
    error?: ReactNode;
    required?: boolean;
    children: ReactNode;
}

export default function Field({
    label,
    htmlFor,
    description,
    error,
    required,
    className,
    children,
    ...rest
}: FieldProps) {
    return (
        <div className={cn('flex flex-col gap-1.5', className)} {...rest}>
            {label && (
                <label
                    htmlFor={htmlFor}
                    className="text-sm font-medium text-ink-1 inline-flex items-center gap-1"
                >
                    {label}
                    {required && (
                        <span aria-hidden className="text-red-600">
                            *
                        </span>
                    )}
                </label>
            )}
            {children}
            {description && !error && (
                <p className="text-xs text-ink-3">{description}</p>
            )}
            {error && (
                <p className="text-xs text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

export { Input, Textarea, Select } from './FieldControls';
