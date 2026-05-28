import axios from 'axios';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/cn';

interface LikeButtonProps {
    likeable_type: string;
    likeable_id: number;
    initial_count: number;
    is_liked: boolean;
}

export default function LikeButton({
    likeable_type,
    likeable_id,
    initial_count,
    is_liked,
}: LikeButtonProps) {
    const [liked, setLiked] = useState(is_liked);
    const [count, setCount] = useState(initial_count);
    const [animating, setAnimating] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        if (loading) return;

        setLoading(true);
        setAnimating(true);

        try {
            const response = await axios.post('/api/likes', {
                likeable_type,
                likeable_id,
            });

            const { liked: newLiked, count: newCount } = response.data;
            setLiked(newLiked);
            setCount(newCount);
        } catch {
            // Revert on error
        } finally {
            setLoading(false);
            setTimeout(() => setAnimating(false), 600);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={loading}
            className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200',
                liked
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                    : 'bg-surface-1 border-line text-ink-3 hover:bg-surface-2 hover:text-red-500 hover:border-red-200',
                loading && 'opacity-70 cursor-not-allowed',
            )}
            aria-label={liked ? 'Batal suka' : 'Suka'}
        >
            <Heart
                className={cn('w-5 h-5 transition-transform duration-300', animating && 'animate-like-bounce')}
                fill={liked ? 'currentColor' : 'none'}
                aria-hidden
            />
            <span className="text-sm font-medium">{count}</span>

            <style>{`
                @keyframes likeBounce {
                    0% { transform: scale(1); }
                    25% { transform: scale(1.3); }
                    50% { transform: scale(0.9); }
                    75% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                .animate-like-bounce {
                    animation: likeBounce 0.6s ease-in-out;
                }
            `}</style>
        </button>
    );
}
