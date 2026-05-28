import { useState } from 'react';
import axios from 'axios';
import { BarChart3, CheckCircle2, Loader2, Clock } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PollWidgetProps {
    poll: {
        id: number;
        question: string;
        options: string[];
        voteCounts: Record<number, number>;
        totalVotes: number;
        hasVoted: boolean;
        userVote: number | null;
        ends_at: string | null;
    } | null;
}

function getTimeRemaining(endsAt: string | null): string | null {
    if (!endsAt) return null;
    const now = new Date().getTime();
    const end = new Date(endsAt).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Polling telah berakhir';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `Berakhir dalam ${days} hari`;
    if (hours > 0) return `Berakhir dalam ${hours} jam`;
    return 'Berakhir kurang dari 1 jam';
}

export default function PollWidget({ poll }: PollWidgetProps) {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [hasVoted, setHasVoted] = useState(poll?.hasVoted ?? false);
    const [userVote, setUserVote] = useState<number | null>(poll?.userVote ?? null);
    const [voteCounts, setVoteCounts] = useState<Record<number, number>>(poll?.voteCounts ?? {});
    const [totalVotes, setTotalVotes] = useState(poll?.totalVotes ?? 0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!poll) return null;

    const timeRemaining = getTimeRemaining(poll.ends_at);

    const handleVote = async () => {
        if (selectedOption === null || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await axios.post(`/api/polls/${poll.id}/vote`, {
                option_index: selectedOption,
            });

            if (response.data.success) {
                setHasVoted(true);
                setUserVote(response.data.userVote);
                setVoteCounts(response.data.voteCounts);
                setTotalVotes(response.data.totalVotes);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Terjadi kesalahan. Silakan coba lagi.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPercentage = (index: number): number => {
        if (totalVotes === 0) return 0;
        return Math.round(((voteCounts[index] || 0) / totalVotes) * 100);
    };

    return (
        <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

            {/* Header */}
            <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-emerald-300" aria-hidden />
                </div>
                <div>
                    <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">Jajak Pendapat</span>
                    <h3 className="text-white font-bold text-lg leading-tight mt-1">{poll.question}</h3>
                </div>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-5">
                {poll.options.map((option, index) => {
                    const percentage = getPercentage(index);
                    const isSelected = selectedOption === index;
                    const isUserVote = userVote === index;

                    if (hasVoted) {
                        return (
                            <div key={index} className="relative">
                                <div
                                    className={cn(
                                        'relative rounded-xl overflow-hidden border transition-all duration-300',
                                        isUserVote ? 'border-emerald-400/50 bg-emerald-500/10' : 'border-white/10 bg-white/5',
                                    )}
                                >
                                    {/* Progress bar background */}
                                    <div
                                        className={cn(
                                            'absolute inset-y-0 left-0 transition-all duration-700 ease-out rounded-xl',
                                            isUserVote ? 'bg-emerald-500/20' : 'bg-white/5',
                                        )}
                                        style={{ width: `${percentage}%` }}
                                    ></div>

                                    {/* Content */}
                                    <div className="relative flex items-center justify-between px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {isUserVote && (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden />
                                            )}
                                            <span className={cn('text-sm font-medium', isUserVote ? 'text-white' : 'text-white/80')}>
                                                {option}
                                            </span>
                                        </div>
                                        <span className={cn('text-sm font-bold', isUserVote ? 'text-emerald-300' : 'text-white/60')}>
                                            {percentage}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => setSelectedOption(index)}
                            className={`w-full text-left rounded-xl px-4 py-3 border transition-all duration-200 ${
                                isSelected
                                    ? 'border-emerald-400/60 bg-emerald-500/15 text-white'
                                    : 'border-white/10 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                        isSelected ? 'border-emerald-400' : 'border-white/30'
                                    }`}
                                >
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-400"></div>}
                                </div>
                                <span className="text-sm font-medium">{option}</span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Error message */}
            {error && (
                <div className="mb-4 px-3 py-2 bg-red-500/20 border border-red-400/30 rounded-lg">
                    <p className="text-red-200 text-xs font-medium">{error}</p>
                </div>
            )}

            {/* Vote button or info */}
            {!hasVoted ? (
                <button
                    onClick={handleVote}
                    disabled={selectedOption === null || isSubmitting}
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                            Mengirim...
                        </span>
                    ) : (
                        'Kirim Suara'
                    )}
                </button>
            ) : (
                <div className="text-center">
                    <p className="text-emerald-300/80 text-xs font-medium">
                        Terima kasih telah berpartisipasi!
                    </p>
                </div>
            )}

            {/* Footer info */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <span className="text-white/50 text-xs">
                    {totalVotes} suara
                </span>
                {timeRemaining && (
                    <span className="text-white/50 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" aria-hidden />
                        {timeRemaining}
                    </span>
                )}
            </div>
        </div>
    );
}
