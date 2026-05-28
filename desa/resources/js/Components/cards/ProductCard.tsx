import { Link } from '@inertiajs/react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Card, CardBody, CardCover } from '@/Components/ui/Card';
import Tag from '@/Components/ui/Tag';

export interface ProductCardData {
    id: number;
    name: string;
    slug: string;
    description?: string;
    price?: number | string | null;
    featured_image?: string | null;
    seller_name?: string;
    category?: { name: string } | null;
}

interface ProductCardProps {
    product: ProductCardData;
}

function formatPrice(p: number | string | null | undefined): string | null {
    if (p === null || p === undefined || p === '') return null;
    const n = typeof p === 'string' ? Number(p) : p;
    if (Number.isNaN(n)) return null;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function ProductCard({ product }: ProductCardProps) {
    const price = formatPrice(product.price ?? null);

    return (
        <Link href={`/umkm/${product.slug}`} className="group block">
            <Card variant="default" interactive className="h-full flex flex-col">
                <CardCover image={product.featured_image} alt={product.name} ratio="1/1">
                    {!product.featured_image && (
                        <ShoppingBag className="w-10 h-10 text-ink-4" aria-hidden strokeWidth={1.5} />
                    )}
                    {product.category && (
                        <div className="absolute top-3 left-3">
                            <Tag variant="accent" size="sm" className="shadow-sm">{product.category.name}</Tag>
                        </div>
                    )}
                </CardCover>
                <CardBody className="flex-1 flex flex-col gap-2">
                    <h3 className="text-base md:text-lg font-semibold text-ink-1 group-hover:text-brand-strong transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                    {product.seller_name && (
                        <p className="text-xs text-ink-3">oleh {product.seller_name}</p>
                    )}
                    {product.description && (
                        <p className="text-sm text-ink-3 line-clamp-2">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-2">
                        {price ? (
                            <span className="text-base font-bold text-brand-strong">{price}</span>
                        ) : (
                            <span className="text-sm text-ink-3">Hubungi penjual</span>
                        )}
                        <ArrowRight className="w-4 h-4 text-brand-strong transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </div>
                </CardBody>
            </Card>
        </Link>
    );
}
