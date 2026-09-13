import { Head, Link, router, useForm } from '@inertiajs/react';
import { ImagePlus, Images, Trash2, Upload } from 'lucide-react';
import { useEffect, useState, type ChangeEvent, type FormEventHandler } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardFooter, CardHeader } from '@/Components/ui/Card';
import EmptyState from '@/Components/ui/EmptyState';
import Field, { Input } from '@/Components/ui/Field';
import IconBox from '@/Components/ui/IconBox';

interface Photo {
    id: number;
    title: string;
    album: string | null;
    image_url: string;
    created_at: string;
}
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
interface PaginatedPhotos {
    data: Photo[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}
interface Props {
    photos: PaginatedPhotos;
}

export default function GalleryIndex({ photos }: Props) {
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const { data, setData, post, processing, errors, reset } = useForm<{
        photos: File[];
        album: string;
        title: string;
    }>({ photos: [], album: '', title: '' });

    useEffect(() => () => previewUrls.forEach((url) => URL.revokeObjectURL(url)), [previewUrls]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const fileArray = event.target.files ? Array.from(event.target.files) : [];
        setData('photos', fileArray);
        setPreviewUrls(fileArray.map((file) => URL.createObjectURL(file)));
    };
    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        post('/admin/gallery', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreviewUrls([]);
            },
        });
    };
    const handleDelete = (id: number, title: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus foto "${title}"?`))
            router.delete(`/admin/gallery/${id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Kelola Galeri">
            <Head title="Kelola Galeri - Admin Desa Muneng" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-ink-1">Kelola Galeri</h1>
                    <p className="mt-1 text-ink-3">Total {photos.total} foto</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader className="flex items-center gap-3 border-b border-line">
                            <IconBox icon={ImagePlus} variant="brand" size="md" />
                            <div>
                                <h2 className="text-lg font-semibold text-ink-1">Upload Foto</h2>
                                <p className="text-xs text-ink-3">
                                    Upload satu atau beberapa foto sekaligus
                                </p>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field
                                    label="Judul Foto"
                                    htmlFor="title"
                                    error={errors.title}
                                    required
                                >
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(event) => setData('title', event.target.value)}
                                        placeholder="Masukkan judul foto"
                                        invalid={Boolean(errors.title)}
                                    />
                                </Field>
                                <Field label="Nama Album" htmlFor="album" error={errors.album}>
                                    <Input
                                        id="album"
                                        value={data.album}
                                        onChange={(event) => setData('album', event.target.value)}
                                        placeholder="Contoh: Kegiatan Desa 2024"
                                        invalid={Boolean(errors.album)}
                                    />
                                </Field>
                            </div>
                            <Field
                                label="Pilih Foto"
                                htmlFor="photos"
                                error={errors.photos}
                                required
                            >
                                <Input
                                    id="photos"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    invalid={Boolean(errors.photos)}
                                />
                            </Field>
                            {previewUrls.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                                    {previewUrls.map((url, index) => (
                                        <div
                                            key={url}
                                            className="aspect-square overflow-hidden rounded-lg border border-line"
                                        >
                                            <img
                                                src={url}
                                                alt={`Pratinjau foto ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                        <CardFooter className="flex justify-end border-t border-line">
                            <Button
                                type="submit"
                                loading={processing}
                                disabled={processing}
                                className="gap-2"
                            >
                                <Upload className="h-4 w-4" aria-hidden />
                                Upload Foto
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
                <Card>
                    <CardHeader className="border-b border-line">
                        <h2 className="text-lg font-semibold text-ink-1">Daftar Foto</h2>
                    </CardHeader>
                    {photos.data.length > 0 ? (
                        <CardBody>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {photos.data.map((photo) => (
                                    <article
                                        key={photo.id}
                                        className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-surface-2"
                                    >
                                        <img
                                            src={photo.image_url}
                                            alt={photo.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 text-white">
                                            <p className="truncate text-xs font-semibold">
                                                {photo.title}
                                            </p>
                                            {photo.album && (
                                                <Badge
                                                    variant="brand"
                                                    rounded
                                                    className="mt-1 border-0 bg-brand/80 text-white"
                                                >
                                                    {photo.album}
                                                </Badge>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="danger"
                                            size="sm"
                                            aria-label={`Hapus foto ${photo.title}`}
                                            className="absolute right-2 top-2 min-h-11 min-w-11 p-0 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                                            onClick={() => handleDelete(photo.id, photo.title)}
                                        >
                                            <Trash2 className="h-4 w-4" aria-hidden />
                                        </Button>
                                    </article>
                                ))}
                            </div>
                        </CardBody>
                    ) : (
                        <CardBody>
                            <EmptyState
                                icon={Images}
                                title="Belum ada foto"
                                description="Upload foto pertama Anda melalui formulir di atas."
                            />
                        </CardBody>
                    )}
                    {photos.links.length > 3 && (
                        <CardFooter className="flex flex-col gap-3 border-t border-line sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-ink-3">
                                Halaman {photos.current_page} dari {photos.last_page}
                            </p>
                            <nav className="flex flex-wrap gap-1" aria-label="Paginasi galeri">
                                {photos.links.map((link) =>
                                    link.url ? (
                                        <Link
                                            key={link.label}
                                            href={link.url}
                                            className={
                                                link.active
                                                    ? 'rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white'
                                                    : 'rounded-lg px-3 py-1.5 text-sm font-medium text-ink-2 hover:bg-surface-2'
                                            }
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={link.label}
                                            className="rounded-lg px-3 py-1.5 text-sm text-ink-4"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ),
                                )}
                            </nav>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}
