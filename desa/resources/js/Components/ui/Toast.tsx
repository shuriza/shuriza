import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FlashMessages {
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
}

interface ToastItem {
    id: number;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
}

const toastStyles = {
    success: {
        bg: 'bg-brand-soft border-brand-soft',
        icon: 'text-brand-strong',
        text: 'text-brand-strong',
        progress: 'bg-brand',
    },
    error: {
        bg: 'bg-red-50 border-red-200',
        icon: 'text-red-600',
        text: 'text-red-700',
        progress: 'bg-red-500',
    },
    info: {
        bg: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-600',
        text: 'text-blue-700',
        progress: 'bg-blue-500',
    },
    warning: {
        bg: 'bg-accent-soft border-accent-soft',
        icon: 'text-accent-strong',
        text: 'text-accent-strong',
        progress: 'bg-accent',
    },
};

const icons = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
} as const;

export default function Toast() {
    const { flash } = usePage().props as { flash: FlashMessages };
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        const newToasts: ToastItem[] = [];

        if (flash?.success) {
            newToasts.push({ id: Date.now(), type: 'success', message: flash.success });
        }
        if (flash?.error) {
            newToasts.push({ id: Date.now() + 1, type: 'error', message: flash.error });
        }
        if (flash?.info) {
            newToasts.push({ id: Date.now() + 2, type: 'info', message: flash.info });
        }
        if (flash?.warning) {
            newToasts.push({ id: Date.now() + 3, type: 'warning', message: flash.warning });
        }

        if (newToasts.length > 0) {
            setToasts((prev) => [...prev, ...newToasts]);
        }
    }, [flash]);

    useEffect(() => {
        if (toasts.length === 0) return;

        const timer = setTimeout(() => {
            setToasts((prev) => prev.slice(1));
        }, 5000);

        return () => clearTimeout(timer);
    }, [toasts]);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[55] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => {
                const style = toastStyles[toast.type];
                const IconComp = icons[toast.type];
                return (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto animate-slide-in-right border rounded-xl p-4 shadow-lg ${style.bg} relative overflow-hidden`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={cn('flex-shrink-0', style.icon)}>
                                <IconComp className="w-5 h-5" aria-hidden />
                            </div>
                            <p className={`text-sm font-medium flex-1 ${style.text}`}>
                                {toast.message}
                            </p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                aria-label="Tutup notifikasi"
                                className={cn('flex-shrink-0 hover:opacity-70 transition-opacity', style.icon)}
                            >
                                <X className="w-4 h-4" aria-hidden />
                            </button>
                        </div>
                        {/* Progress bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1">
                            <div className={`h-full ${style.progress} animate-shrink-width`} />
                        </div>
                    </div>
                );
            })}

            <style>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes shrinkWidth {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.3s ease-out forwards;
                }
                .animate-shrink-width {
                    animation: shrinkWidth 5s linear forwards;
                }
            `}</style>
        </div>
    );
}
