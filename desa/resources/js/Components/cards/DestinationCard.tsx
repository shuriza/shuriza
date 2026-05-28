import { Link } from '@inertiajs/react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Card, CardBody, CardCover } from '@/Components/ui/Card';
import Tag from '@/Components/ui/Tag';

export interface DestinationCardData {
    id: number;
    name: string;
    slug: string;
    description?: string;
    category: string;
    address?: string;
    featured_image?: string | null;
}

interface DestinationCardProps {
    destination: DestinationCardData;
}

const categoryLabel: Record<string, string> = {
    fasilitas: 'Fasilitas',
    wisata: 'Wisata',
    suasana: 'Suasana',
};

export default function DestinationCard({ destination }: DestinationCardProps) {
    return (
        <Link href={`/destinasi/${destination.slug}`} className="group block">
            <Card variant="default" interactive className="h-full flex flex-col">
                <CardCover image={destination.featured_image} alt={destination.name} ratio="4/3">
                    <div className="absolute top-3 left-3">
                        <Tag variant="brand" size="md" className="shadow-sm">
                            {categoryLabel[destination.category] ?? destination.category}
                        </Tag>
                    </div>
                </CardCover>
                <CardBody className="flex-1 flex flex-col gap-2">
                    <h3 className="text-lg md:text-xl font-semibold text-ink-1 group-hover:text-brand-strong transition-colors line-clamp-2">
                        {destination.name}
                    </h3>
                    {destination.description && (
                        <p className="text-sm text-ink-3 line-clamp-2">{destination.description}</p>
                    )}
                    {destination.address && (
                        <p className="text-xs text-ink-3 inline-flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-brand-strong shrink-0" aria-hidden />
                            <span className="truncate">{destination.address}</span>
                        </p>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-strong mt-auto pt-2">
                        Selengkapnya
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                </CardBody>
            </Card>
        </Link>
    );
}
