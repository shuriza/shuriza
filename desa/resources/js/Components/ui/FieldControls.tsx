import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

const baseClasses =
    'w-full rounded-xl border border-line bg-surface-1 text-ink-1 placeholder:text-ink-4 ' +
    'focus:border-brand focus:ring-2 focus:ring-brand-soft focus:outline-none ' +
    'transition-colors duration-150 disabled:bg-surface-2 disabled:text-ink-3';

const sizeClasses = 'px-4 py-2.5 text-sm md:text-base';

export interface InputBaseProps {
    invalid?: boolean;
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & InputBaseProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { invalid, className, ...rest },
    ref,
) {
    return (
        <input
            ref={ref}
            aria-invalid={invalid || undefined}
            className={cn(baseClasses, sizeClasses, invalid && 'border-red-500 focus:ring-red-100', className)}
            {...rest}
        />
    );
});

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & InputBaseProps;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
    { invalid, className, ...rest },
    ref,
) {
    return (
        <textarea
            ref={ref}
            aria-invalid={invalid || undefined}
            className={cn(baseClasses, sizeClasses, 'resize-y min-h-[120px]', invalid && 'border-red-500 focus:ring-red-100', className)}
            {...rest}
        />
    );
});

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & InputBaseProps;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
    { invalid, className, children, ...rest },
    ref,
) {
    return (
        <select
            ref={ref}
            aria-invalid={invalid || undefined}
            className={cn(baseClasses, sizeClasses, invalid && 'border-red-500 focus:ring-red-100', className)}
            {...rest}
        >
            {children}
        </select>
    );
});
