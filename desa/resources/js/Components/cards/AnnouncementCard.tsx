import { Link } from '@inertiajs/react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardBody } from '@/Components/ui/Card';
import Tag from '@/Components/ui/Tag';

export interface AnnouncementCardData {
    id: number;
    title: string;
    slug: string;
    content?: string;
    excerpt?: string;
    published_at: string;
    category?: { name: string } | null;
}

interface AnnouncementCardProps {
    announcement: AnnouncementCardData;
    layout?: 'vertical' | 'horizontal';
}

const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function formatDate(d: string) {
    const date = new Date(d);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getExcerpt(a: AnnouncementCardData) {
    if (a.excerpt) return a.excerpt;
    if (!a.content) return '';
    const plain = a.content.replace(/<[^>]+>/g, '');
    return plain.length > 160 ? plain.slice(0, 157) + '...' : plain;
}

export default function AnnouncementCard({ announcement, layout = 'vertical' }: AnnouncementCardProps) {
    return (
        <Link href={`/berita/${announcement.slug}`} className="group block">
            <Card variant="default" interactive className="h-full">
                <CardBody className={layout === 'horizontal' ? 'md:flex md:items-start md:gap-4' : ''}>
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs text-ink-3">
                            <Calendar className="w-3.5 h-3.5 text-brand-strong" aria-hidden />
                            <span>{formatDate(announcement.published_at)}</span>
                            {announcement.category && (
                                <Tag variant="brand" size="sm">{announcement.category.name}</Tag>
                            )}
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-ink-1 group-hover:text-brand-strong transition-colors line-clamp-2">
                            {announcement.title}
                        </h3>
                        <p className="text-sm text-ink-3 line-clamp-3">{getExcerpt(announcement)}</p>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-strong pt-1">
                            Baca selengkapnya
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                        </span>
                    </div>
                </CardBody>
            </Card>
        </Link>
    );
}
