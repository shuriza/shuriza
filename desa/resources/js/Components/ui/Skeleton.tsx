interface SkeletonProps {
    variant?: 'text' | 'card' | 'image' | 'avatar' | 'paragraph';
    width?: string;
    height?: string;
    count?: number;
    className?: string;
}

function SkeletonBase({ className = '' }: { className?: string }) {
    return (
        <div
            className={`animate-pulse bg-line rounded ${className}`}
        />
    );
}

function SkeletonText({ width, height, className = '' }: { width?: string; height?: string; className?: string }) {
    return (
        <SkeletonBase
            className={`h-4 ${className}`}
            {...(width || height ? { style: { width: width || '100%', height: height || undefined } } : {})}
        />
    );
}

function SkeletonAvatar({ width, height, className = '' }: { width?: string; height?: string; className?: string }) {
    const size = width || '40px';
    return (
        <SkeletonBase
            className={`rounded-full flex-shrink-0 ${className}`}
            {...{ style: { width: size, height: height || size } }}
        />
    );
}

function SkeletonImage({ width, height, className = '' }: { width?: string; height?: string; className?: string }) {
    return (
        <SkeletonBase
            className={`rounded-lg ${className}`}
            {...{ style: { width: width || '100%', height: height || '200px' } }}
        />
    );
}

function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`bg-surface-1 rounded-xl border border-line p-4 space-y-4 ${className}`}>
            <SkeletonImage height="160px" />
            <div className="space-y-2">
                <SkeletonText className="w-3/4 h-5" />
                <SkeletonText className="w-full" />
                <SkeletonText className="w-2/3" />
            </div>
            <div className="flex items-center gap-3 pt-2">
                <SkeletonAvatar width="32px" />
                <div className="space-y-1.5 flex-1">
                    <SkeletonText className="w-24 h-3" />
                    <SkeletonText className="w-16 h-3" />
                </div>
            </div>
        </div>
    );
}

function SkeletonParagraph({ count = 4, className = '' }: { count?: number; className?: string }) {
    return (
        <div className={`space-y-2.5 ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonText
                    key={index}
                    className={index === count - 1 ? 'w-3/5' : index % 3 === 0 ? 'w-full' : 'w-11/12'}
                />
            ))}
        </div>
    );
}

export default function Skeleton({ variant = 'text', width, height, count = 1, className = '' }: SkeletonProps) {
    switch (variant) {
        case 'avatar':
            return <SkeletonAvatar width={width} height={height} className={className} />;
        case 'image':
            return <SkeletonImage width={width} height={height} className={className} />;
        case 'card':
            return (
                <>
                    {Array.from({ length: count }).map((_, index) => (
                        <SkeletonCard key={index} className={className} />
                    ))}
                </>
            );
        case 'paragraph':
            return <SkeletonParagraph count={count} className={className} />;
        case 'text':
        default:
            return (
                <div className={`space-y-2.5 ${className}`}>
                    {Array.from({ length: count }).map((_, index) => (
                        <SkeletonText
                            key={index}
                            width={width}
                            height={height}
                        />
                    ))}
                </div>
            );
    }
}

// Export individual components for custom composition
export { SkeletonBase, SkeletonText, SkeletonAvatar, SkeletonImage, SkeletonCard, SkeletonParagraph };
