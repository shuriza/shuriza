import { Link } from '@inertiajs/react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Card, CardBody, CardCover } from '@/Components/ui/Card';
import Tag from '@/Components/ui/Tag';
import MetaList, { type MetaItem } from '@/Components/ui/MetaList';

export interface EventCardData {
    id: number;
    title: string;
    slug: string;
    description?: string;
    event_date: string;
    time?: string;
    location?: string;
    image?: string;
    category?: { name: string } | null;
}

interface EventCardProps {
    event: EventCardData;
    variant?: 'default' | 'compact';
}

const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function formatDate(d: string) {
    const date = new Date(d);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default function EventCard({ event, variant = 'default' }: EventCardProps) {
    const meta: MetaItem[] = [
        { icon: Calendar, text: formatDate(event.event_date) },
        ...(event.time ? [{ icon: Clock, text: event.time }] : []),
        ...(event.location ? [{ icon: MapPin, text: event.location }] : []),
    ];

    return (
        <Link href={`/acara/${event.slug}`} className="group block">
            <Card variant="default" interactive className="h-full flex flex-col">
                {variant === 'default' && (
                    <CardCover image={event.image} alt={event.title} ratio="16/9">
                        {event.category && (
                            <div className="absolute top-3 left-3">
                                <Tag variant="brand" size="md">{event.category.name}</Tag>
                            </div>
                        )}
                    </CardCover>
                )}
                <CardBody className="flex-1 flex flex-col gap-3">
                    {variant === 'compact' && event.category && (
                        <Tag variant="brand" size="sm" className="self-start">{event.category.name}</Tag>
                    )}
                    <h3 className="text-lg md:text-xl font-semibold text-ink-1 group-hover:text-brand-strong transition-colors line-clamp-2">
                        {event.title}
                    </h3>
                    {event.description && (
                        <p className="text-sm text-ink-3 line-clamp-2">{event.description}</p>
                    )}
                    <MetaList items={meta} layout="stacked" className="mt-auto" />
                </CardBody>
            </Card>
        </Link>
    );
}
