import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ButtonBaseProps extends PropsWithChildren {
    variant?: 'primary' | 'secondary' | 'accent' | 'tonal' | 'danger' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

interface ButtonAsButtonProps extends ButtonBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
    href?: never;
}

interface ButtonAsLinkProps extends ButtonBaseProps {
    href: string;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const variantClasses: Record<string, string> = {
    primary: 'bg-brand text-white hover:bg-brand-strong focus-visible:ring-brand-ring shadow-sm active:scale-[0.98]',
    secondary: 'bg-ink-1 text-white hover:bg-ink-2 focus-visible:ring-ink-3 shadow-sm active:scale-[0.98]',
    accent: 'bg-accent text-white hover:bg-accent-strong focus-visible:ring-accent shadow-sm active:scale-[0.98]',
    tonal: 'bg-brand-soft text-brand-strong hover:bg-brand/10 focus-visible:ring-brand-ring',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm active:scale-[0.98]',
    outline: 'border border-line text-ink-1 hover:bg-surface-2 hover:border-line-strong focus-visible:ring-brand-ring bg-surface-1',
    ghost: 'text-ink-2 hover:bg-surface-2 focus-visible:ring-line-strong',
};

const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

export default function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    className = '',
    children,
    ...props
}: ButtonProps) {
    const baseClasses =
        'inline-flex items-center justify-center font-medium rounded-xl ' +
        'transition-all duration-200 ease-out ' +
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

    const classes = cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
    );

    const content = (
        <>
            {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" aria-hidden />}
            {children}
        </>
    );

    if ('href' in props && props.href) {
        const { href, method, ...linkProps } = props as ButtonAsLinkProps;
        return (
            <Link
                href={href}
                method={method}
                className={classes}
                {...(linkProps as any)}
            >
                {content}
            </Link>
        );
    }

    const { href: _, ...buttonProps } = props as ButtonAsButtonProps;
    return (
        <button
            className={classes}
            disabled={disabled || loading}
            {...buttonProps}
        >
            {content}
        </button>
    );
}
