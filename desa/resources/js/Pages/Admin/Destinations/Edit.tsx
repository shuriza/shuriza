import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import type { ChangeEvent, FormEventHandler } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardFooter } from '@/Components/ui/Card';
import Field, { Input, Select, Textarea } from '@/Components/ui/Field';

interface DestinationImage {
    id: number;
    image_path: string;
}

interface DestinationRecord {
    id: number;
    name: string;
    description: string | null;
    content: string | null;
    category: string;
    address: string | null;
    featured_image: string | null;
    status: string;
    images: DestinationImage[];
}

interface EditDestinationProps {
    destination: DestinationRecord;
}

export default function EditDestination({ destination }: EditDestinationProps) {
    const { data, setData, processing, errors } = useForm({
        _method: 'put' as const,
        name: destination.name || '',
        description: destination.description || '',
        content: destination.content || '',
        category: destination.category || '',
        address: destination.address || '',
        featured_image: null as File | null,
        status: destination.status || 'draft',
        additional_images: [] as File[],
    });

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        router.post(
            `/admin/destinations/${destination.id}`,
            { ...data, _method: 'put' },
            { forceFormData: true },
        );
    };

    const handleAdditionalImages = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) setData('additional_images', Array.from(event.target.files));
    };

    const handleDeleteImage = (imageId: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
            router.delete(`/admin/destinations/${destination.id}/images/${imageId}`);
        }
    };

    return (
        <AdminLayout title="Edit Destinasi">
            <Head title={`Edit Destinasi - ${destination.name} - Admin Desa Muneng`} />
            <div className="space-y-6">
                <div className="flex items-start gap-3">
                    <Button
                        href="/admin/destinations"
                        variant="ghost"
                        size="sm"
                        className="min-h-11 min-w-11 px-0"
                    >
                        <ArrowLeft className="h-5 w-5" aria-hidden />
                        <span className="sr-only">Kembali ke daftar destinasi</span>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-ink-1">
                            Edit Destinasi
                        </h1>
                        <p className="mt-1 text-ink-3">Perbarui informasi destinasi</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardBody className="space-y-6 p-5 sm:p-6">
                            <Field
                                label="Nama Destinasi"
                                htmlFor="name"
                                error={errors.name}
                                required
                            >
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(event) => setData('name', event.target.value)}
                                    placeholder="Masukkan nama destinasi"
                                    invalid={Boolean(errors.name)}
                                />
                            </Field>
                            <Field
                                label="Deskripsi Singkat"
                                htmlFor="description"
                                error={errors.description}
                                required
                            >
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(event) => setData('description', event.target.value)}
                                    placeholder="Deskripsi singkat tentang destinasi"
                                    invalid={Boolean(errors.description)}
                                />
                            </Field>
                            <Field label="Konten Detail" htmlFor="content" error={errors.content}>
                                <Textarea
                                    id="content"
                                    rows={6}
                                    value={data.content}
                                    onChange={(event) => setData('content', event.target.value)}
                                    placeholder="Detail lengkap tentang destinasi..."
                                    invalid={Boolean(errors.content)}
                                />
                            </Field>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field
                                    label="Kategori"
                                    htmlFor="category"
                                    error={errors.category}
                                    required
                                >
                                    <Select
                                        id="category"
                                        value={data.category}
                                        onChange={(event) =>
                                            setData('category', event.target.value)
                                        }
                                        invalid={Boolean(errors.category)}
                                    >
                                        <option value="">Pilih Kategori</option>
                                        <option value="fasilitas">Fasilitas</option>
                                        <option value="wisata">Wisata</option>
                                        <option value="suasana">Suasana</option>
                                    </Select>
                                </Field>
                                <Field
                                    label="Status"
                                    htmlFor="status"
                                    error={errors.status}
                                    required
                                >
                                    <Select
                                        id="status"
                                        value={data.status}
                                        onChange={(event) => setData('status', event.target.value)}
                                        invalid={Boolean(errors.status)}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Dipublikasi</option>
                                    </Select>
                                </Field>
                            </div>
                            <Field label="Alamat" htmlFor="address" error={errors.address}>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(event) => setData('address', event.target.value)}
                                    placeholder="Alamat lengkap destinasi"
                                    invalid={Boolean(errors.address)}
                                />
                            </Field>
                            <Field
                                label="Gambar Utama"
                                htmlFor="featured_image"
                                error={errors.featured_image}
                                description={
                                    destination.featured_image
                                        ? 'Kosongkan jika tidak ingin mengubah gambar utama.'
                                        : undefined
                                }
                            >
                                {destination.featured_image && (
                                    <img
                                        src={destination.featured_image}
                                        alt={`Gambar utama ${destination.name}`}
                                        className="mb-3 h-20 w-32 rounded-lg border border-line object-cover"
                                    />
                                )}
                                <Input
                                    id="featured_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) =>
                                        setData('featured_image', event.target.files?.[0] ?? null)
                                    }
                                    invalid={Boolean(errors.featured_image)}
                                />
                            </Field>
                            {destination.images.length > 0 && (
                                <section aria-labelledby="current-images">
                                    <h2
                                        id="current-images"
                                        className="mb-3 text-sm font-medium text-ink-1"
                                    >
                                        Gambar Tambahan Saat Ini
                                    </h2>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                        {destination.images.map((image) => (
                                            <div key={image.id} className="group relative">
                                                <img
                                                    src={image.image_path}
                                                    alt={`Gambar tambahan ${destination.name}`}
                                                    className="h-24 w-full rounded-lg border border-line object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="danger"
                                                    size="sm"
                                                    className="absolute right-1 top-1 min-h-11 min-w-11 p-0 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                                                    aria-label="Hapus gambar"
                                                    onClick={() => handleDeleteImage(image.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" aria-hidden />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                            <Field
                                label="Tambah Gambar Baru"
                                htmlFor="additional_images"
                                error={errors.additional_images}
                                description="Anda dapat memilih beberapa gambar sekaligus."
                            >
                                <Input
                                    id="additional_images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleAdditionalImages}
                                    invalid={Boolean(errors.additional_images)}
                                />
                            </Field>
                        </CardBody>
                        <CardFooter className="flex justify-end gap-3 border-t border-line">
                            <Button href="/admin/destinations" variant="outline">
                                Batal
                            </Button>
                            <Button type="submit" loading={processing} disabled={processing}>
                                Perbarui Destinasi
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
