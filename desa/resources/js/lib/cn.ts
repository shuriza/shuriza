import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine class names with proper Tailwind conflict resolution.
 * Usage: cn('px-2 py-1', condition && 'bg-brand', className)
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
