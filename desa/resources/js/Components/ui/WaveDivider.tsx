import { SVGAttributes } from 'react';
import { cn } from '@/lib/cn';

type FillToken = 'surface-1' | 'surface-2' | 'brand' | 'brand-soft' | 'inverse' | 'accent-soft';

interface WaveDividerProps extends Omit<SVGAttributes<SVGSVGElement>, 'fill'> {
    fill?: FillToken;
    flip?: boolean;
    variant?: 'soft' | 'bold';
    height?: number;
}

const fillTextMap: Record<FillToken, string> = {
    'surface-1': 'text-surface-1',
    'surface-2': 'text-surface-2',
    'brand': 'text-brand',
    'brand-soft': 'text-brand-soft',
    'inverse': 'text-ink-1',
    'accent-soft': 'text-accent-soft',
};

const paths = {
    soft: 'M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z',
    bold: 'M0 60V20C180 60 360 60 540 30C720 0 900 0 1080 20C1260 40 1440 40 1440 40V60H0Z',
};

export default function WaveDivider({
    fill = 'surface-1',
    flip = false,
    variant = 'soft',
    height = 60,
    className,
    ...rest
}: WaveDividerProps) {
    return (
        <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className={cn('w-full block', flip ? '-scale-y-100' : '', fillTextMap[fill], className)}
            style={{ height }}
            {...rest}
        >
            <path d={paths[variant]} fill="currentColor" />
        </svg>
    );
}
