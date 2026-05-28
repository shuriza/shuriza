import { Link } from '@inertiajs/react';
import { Video, Music2, Camera, Image as ImageIcon, Pin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardBody, CardCover } from '@/Components/ui/Card';
import Tag from '@/Components/ui/Tag';

export interface MemoryCardData {
    id: number;
    title: string;
    description?: string;
    type: string;
    platform: string;
    source_url: string;
    thumbnail_url?: string | null;
    is_pinned?: boolean;
    category?: { name: string } | null;
    created_at: string;
}

interface MemoryCardProps {
    memory: MemoryCardData;
}

const platformIcons: Record<string, LucideIcon> = {
    youtube: Video,
    tiktok: Music2,
    facebook: Camera,
    instagram: Camera,
};

export default function MemoryCard({ memory }: MemoryCardProps) {
    const PlatformIcon = platformIcons[memory.platform] ?? ImageIcon;

    return (
        <Link href={`/kenangan/${memory.id}`} className="group block">
            <Card
                variant={memory.is_pinned ? 'glow' : 'default'}
                interactive
                className="h-full flex flex-col"
            >
                <CardCover image={memory.thumbnail_url} alt={memory.title} ratio="16/9">
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                        {memory.is_pinned && (
                            <Tag variant="accent" size="sm" className="shadow-sm">
                                <Pin className="w-3 h-3" aria-hidden /> Pilihan
                            </Tag>
                        )}
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface-1/90 text-ink-1 shadow-sm">
                            <PlatformIcon className="w-3.5 h-3.5" aria-hidden />
                        </span>
                    </div>
                </CardCover>
                <CardBody className="flex-1 flex flex-col gap-2">
                    {memory.category && (
                        <Tag variant="brand" size="sm" className="self-start">{memory.category.name}</Tag>
                    )}
                    <h3 className="text-base md:text-lg font-semibold text-ink-1 group-hover:text-brand-strong transition-colors line-clamp-2">
                        {memory.title}
                    </h3>
                    {memory.description && (
                        <p className="text-sm text-ink-3 line-clamp-2">{memory.description}</p>
                    )}
                </CardBody>
            </Card>
        </Link>
    );
}
