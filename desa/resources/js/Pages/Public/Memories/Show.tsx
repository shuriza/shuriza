import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import {
    ArrowLeft,
    CalendarDays,
    ExternalLink,
    Images,
    Pin,
    User as UserIcon,
} from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import Breadcrumb from '@/Components/ui/Breadcrumb';
import Container from '@/Components/ui/Container';
import MediaEmbed from '@/Components/ui/MediaEmbed';
import MemoryCard, { type MemoryCardData } from '@/Components/cards/MemoryCard';
import ShareButton from '@/Components/ui/ShareButton';
import Tag from '@/Components/ui/Tag';
import { cn } from '@/lib/cn';

type Platform = 'youtube' | 'tiktok' | 'facebook' | 'instagram';

interface Memory {
    id: number;
    title: string;
    description: string | null;
    type: string;
    platform: Platform;
    source_url: string;
    thumbnail_url: string | null;
    is_pinned: boolean;
    year: number | null;
    created_at: string;
    submitter?: { id: number; name: string } | null;
    album?: { id: number; name: string; slug: string } | null;
    category?: { id: number; name: string } | null;
}

interface Props {
    memory: Memory;
    related: MemoryCardData[];
    reactions: Record<string, number>;
    userReactions: string[];
}

const REACTIONS = [
    { key: 'heart', emoji: '❤️', label: 'Suka' },
    { key: 'laugh', emoji: '😂', label: 'Lucu' },
    { key: 'wow', emoji: '😮', label: 'Kagum' },
    { key: 'pray', emoji: '🙏', label: 'Syukur' },
    { key: 'fire', emoji: '🔥', label: 'Keren' },
] as const;

export default function MemoryShow({ memory, related, reactions, userReactions }: Props) {
    const [counts, setCounts] = useState<Record<string, number>>(reactions ?? {});
    const [mine, setMine] = useState<string[]>(userReactions ?? []);
    const [pending, setPending] = useState<string | null>(null);

    const toggleReaction = async (emoji: string) => {
        if (pending) return;
        setPending(emoji);

        try {
            const response = await axios.post('/api/reactions/toggle', {
                emoji,
                reactable_type: 'memory',
                reactable_id: memory.id,
            });
            setCounts(response.data.counts ?? {});
            setMine((prev) =>
                response.data.reacted ? [...prev, emoji] : prev.filter((item) => item !== emoji),
            );
        } catch {
            // Leave existing counts untouched on failure.
        } finally {
            setPending(null);
        }
    };

    const submittedOn = new Date(memory.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <PublicLayout>
            <Head title={`${memory.title} - Kenangan Desa Muneng`}>
                <meta
                    name="description"
                    content={memory.description ?? `Kenangan warga Desa Muneng: ${memory.title}`}
                />
            </Head>

            <Container className="py-8 md:py-12">
                <Breadcrumb
                    className="mb-6"
                    items={[
                        { label: 'Beranda', href: '/' },
                        { label: 'Kenangan', href: '/kenangan' },
                        { label: memory.title },
                    ]}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-wrap items-center gap-2">
                            {memory.is_pinned && (
                                <Tag variant="accent" size="sm">
                                    <Pin className="w-3 h-3" aria-hidden /> Kenangan Pilihan
                                </Tag>
                            )}
                            {memory.album && (
                                <Link href={`/kenangan?album=${memory.album.id}`}>
                                    <Tag variant="brand" size="sm">
                                        {memory.album.name}
                                    </Tag>
                                </Link>
                            )}
                            {memory.year && (
                                <Tag variant="default" size="sm">
                                    {memory.year}
                                </Tag>
                            )}
                        </div>

                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-ink-1">
                            {memory.title}
                        </h1>

                        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-3">
                            <li className="inline-flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-brand-strong" aria-hidden />
                                {memory.submitter?.name ?? 'Warga Desa Muneng'}
                            </li>
                            <li className="inline-flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-brand-strong" aria-hidden />
                                {submittedOn}
                            </li>
                        </ul>

                        <MediaEmbed
                            platform={memory.platform}
                            source_url={memory.source_url}
                            title={memory.title}
                        />

                        {memory.description && (
                            <p className="text-base leading-relaxed text-ink-2 whitespace-pre-wrap">
                                {memory.description}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            {REACTIONS.map(({ key, emoji, label }) => {
                                const active = mine.includes(key);

                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => toggleReaction(key)}
                                        disabled={pending !== null}
                                        aria-pressed={active}
                                        aria-label={label}
                                        className={cn(
                                            'inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
                                            'focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2',
                                            active
                                                ? 'border-brand bg-brand-soft text-brand-strong'
                                                : 'border-line bg-surface-1 text-ink-2 hover:bg-surface-2',
                                            pending !== null && 'opacity-70',
                                        )}
                                    >
                                        <span aria-hidden>{emoji}</span>
                                        <span className="font-medium">{counts[key] ?? 0}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-2xl border border-line bg-surface-1 p-5 shadow-sm">
                            <h2 className="text-base font-semibold text-ink-1">Bagikan kenangan ini</h2>
                            <p className="mt-1 text-sm text-ink-3">
                                Sebarkan agar warga lain bisa ikut mengenang.
                            </p>
                            <div className="mt-4 flex flex-col gap-3">
                                <ShareButton title={memory.title} url={`/kenangan/${memory.id}`} />
                                <a
                                    href={memory.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                                >
                                    <ExternalLink className="w-4 h-4" aria-hidden />
                                    Buka sumber asli
                                </a>
                                <Link
                                    href="/kenangan"
                                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-brand-strong transition-colors hover:bg-brand-soft focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                                >
                                    <ArrowLeft className="w-4 h-4" aria-hidden />
                                    Semua kenangan
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>

                {related.length > 0 && (
                    <section className="mt-14">
                        <div className="mb-6 flex items-center gap-2">
                            <Images className="w-5 h-5 text-brand-strong" aria-hidden />
                            <h2 className="text-xl font-bold text-ink-1">Kenangan lainnya</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((item) => (
                                <MemoryCard key={item.id} memory={item} />
                            ))}
                        </div>
                    </section>
                )}
            </Container>
        </PublicLayout>
    );
}
