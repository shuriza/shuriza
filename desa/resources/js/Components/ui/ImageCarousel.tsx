import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface CarouselImage {
    src: string;
    alt: string;
    caption?: string;
}

interface ImageCarouselProps {
    images: CarouselImage[];
    autoPlay?: boolean;
    interval?: number;
    showCaptions?: boolean;
    aspectRatio?: 'video' | 'square' | 'wide';
}

export default function ImageCarousel({
    images,
    autoPlay = true,
    interval = 5000,
    showCaptions = true,
    aspectRatio = 'video',
}: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const aspectClasses = {
        video: 'aspect-video',
        square: 'aspect-square',
        wide: 'aspect-[21/9]',
    };

    const goToSlide = useCallback(
        (index: number) => {
            if (isTransitioning) return;
            setIsTransitioning(true);
            setCurrentIndex(index);
            setTimeout(() => setIsTransitioning(false), 500);
        },
        [isTransitioning]
    );

    const goToNext = useCallback(() => {
        goToSlide((currentIndex + 1) % images.length);
    }, [currentIndex, images.length, goToSlide]);

    const goToPrev = useCallback(() => {
        goToSlide((currentIndex - 1 + images.length) % images.length);
    }, [currentIndex, images.length, goToSlide]);

    useEffect(() => {
        if (autoPlay && !isPaused && images.length > 1) {
            timerRef.current = setInterval(goToNext, interval);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [autoPlay, isPaused, interval, goToNext, images.length]);

    if (images.length === 0) return null;

    if (images.length === 1) {
        return (
            <div className={cn('relative w-full rounded-2xl overflow-hidden', aspectClasses[aspectRatio])}>
                <img
                    src={images[0].src}
                    alt={images[0].alt}
                    className="w-full h-full object-cover"
                />
                {showCaptions && images[0].caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-1/70 to-transparent p-4 pt-8">
                        <p className="text-white text-sm font-medium">{images[0].caption}</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className={cn('relative w-full rounded-2xl overflow-hidden group', aspectClasses[aspectRatio])}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides */}
            <div className="relative w-full h-full">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={cn(
                            'absolute inset-0 transition-opacity duration-500 ease-in-out',
                            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0',
                        )}
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                            loading={index === 0 ? 'eager' : 'lazy'}
                        />
                    </div>
                ))}
            </div>

            {/* Caption Overlay */}
            {showCaptions && images[currentIndex]?.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-1/70 to-transparent p-4 pt-10 z-20">
                    <p className="text-white text-sm font-medium">
                        {images[currentIndex].caption}
                    </p>
                </div>
            )}

            {/* Navigation Arrows */}
            <button
                onClick={goToPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-surface-1/80 backdrop-blur-sm rounded-full flex items-center justify-center text-ink-1 hover:bg-surface-1 hover:text-brand-strong transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
                aria-label="Sebelumnya"
            >
                <ChevronLeft className="w-5 h-5" aria-hidden />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-surface-1/80 backdrop-blur-sm rounded-full flex items-center justify-center text-ink-1 hover:bg-surface-1 hover:text-brand-strong transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
                aria-label="Selanjutnya"
            >
                <ChevronRight className="w-5 h-5" aria-hidden />
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                            'transition-all duration-300 rounded-full',
                            index === currentIndex
                                ? 'w-6 h-2 bg-white'
                                : 'w-2 h-2 bg-white/50 hover:bg-white/80',
                        )}
                        aria-label={`Slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Slide Counter */}
            <div className="absolute top-4 right-4 z-30 px-3 py-1 bg-ink-1/40 backdrop-blur-sm rounded-full">
                <span className="text-white text-xs font-medium">
                    {currentIndex + 1} / {images.length}
                </span>
            </div>
        </div>
    );
}
