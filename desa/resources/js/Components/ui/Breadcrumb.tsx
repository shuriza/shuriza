import { Link } from '@inertiajs/react';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn('flex items-center text-sm overflow-x-auto scrollbar-hide', className)}
        >
            <ol className="flex items-center gap-1 min-w-0">
                {items.map((item, index) => {
                    const isFirst = index === 0;
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="flex items-center gap-1 min-w-0">
                            {!isFirst && (
                                <ChevronRight className="w-4 h-4 text-ink-4 flex-shrink-0" aria-hidden />
                            )}

                            {isLast ? (
                                <span className="font-semibold text-ink-1 truncate max-w-[200px] sm:max-w-none">
                                    {item.label}
                                </span>
                            ) : item.href ? (
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-1 text-ink-3 hover:text-brand-strong transition-colors duration-150 whitespace-nowrap"
                                >
                                    {isFirst && <HomeIcon className="w-4 h-4 flex-shrink-0" aria-hidden />}
                                    <span className="hidden sm:inline">{item.label}</span>
                                    {isFirst && <span className="sm:hidden">{item.label}</span>}
                                </Link>
                            ) : (
                                <span className="text-ink-3 whitespace-nowrap flex items-center gap-1">
                                    {isFirst && <HomeIcon className="w-4 h-4 flex-shrink-0" aria-hidden />}
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
