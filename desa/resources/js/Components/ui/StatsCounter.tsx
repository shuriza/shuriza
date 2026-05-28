import { useEffect, useRef, useState } from 'react';

interface StatsCounterProps {
    value: number;
    label: string;
    icon?: React.ReactNode;
    suffix?: string;
    prefix?: string;
    duration?: number;
}

export default function StatsCounter({
    value,
    label,
    icon,
    suffix = '',
    prefix = '',
    duration = 2000,
}: StatsCounterProps) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    setIsVisible(true);
                    hasAnimated.current = true;
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function (ease-out cubic)
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(value);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [isVisible, value, duration]);

    return (
        <div
            ref={ref}
            className="flex flex-col items-center p-6 bg-surface-1 rounded-2xl border border-line shadow-sm hover:shadow-md hover:border-line-strong transition-all duration-300"
        >
            {icon && (
                <div className="w-12 h-12 bg-brand-soft rounded-xl flex items-center justify-center mb-4 text-brand-strong">
                    {icon}
                </div>
            )}
            <div className="text-3xl sm:text-4xl font-bold text-ink-1 mb-1">
                {prefix}
                {count.toLocaleString('id-ID')}
                {suffix}
            </div>
            <p className="text-sm text-ink-3 font-medium text-center">{label}</p>
        </div>
    );
}
