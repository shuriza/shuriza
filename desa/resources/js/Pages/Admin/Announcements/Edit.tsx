import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FormEventHandler } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardFooter } from '@/Components/ui/Card';
import Field, { Input, Select, Textarea } from '@/Components/ui/Field';

interface Announcement {
    id: number;
    title: string;
    content: string;
    excerpt: string | null;
    image: string | null;
    is_pinned: boolean;
    status: string;
    published_at: string | null;
}
interface EditAnnouncementProps {
    announcement: Announcement;
}

export default function EditAnnouncement({ announcement }: EditAnnouncementProps) {
    const { data, setData, processing, errors } = useForm({
        _method: 'put' as const,
        title: announcement.title || '',
        content: announcement.content || '',
        excerpt: announcement.excerpt || '',
        image: null as File | null,
        is_pinned: announcement.is_pinned || false,
        status: announcement.status || 'draft',
        published_at: announcement.published_at || '',
    });
    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        router.post(
            `/admin/announcements/${announcement.id}`,
            { ...data, _method: 'put' },
            { forceFormData: true },
        );
    };

    return (
        <AdminLayout title="Edit Pengumuman">
            <Head title={`Edit Pengumuman - ${announcement.title} - Admin Desa Muneng`} />
            <div className="space-y-6">
                <div className="flex items-start gap-3">
                    <Button
                        href="/admin/announcements"
                        variant="ghost"
                        size="sm"
                        className="min-h-11 min-w-11 px-0"
                    >
                        <ArrowLeft className="h-5 w-5" aria-hidden />
                        <span className="sr-only">Kembali ke daftar pengumuman</span>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-ink-1">
                            Edit Pengumuman
                        </h1>
                        <p className="mt-1 text-ink-3">Perbarui informasi pengumuman</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardBody className="space-y-6 p-5 sm:p-6">
                            <Field label="Judul" htmlFor="title" error={errors.title} required>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(event) => setData('title', event.target.value)}
                                    placeholder="Masukkan judul pengumuman"
                                    invalid={Boolean(errors.title)}
                                />
                            </Field>
                            <Field label="Ringkasan" htmlFor="excerpt" error={errors.excerpt}>
                                <Input
                                    id="excerpt"
                                    value={data.excerpt}
                                    onChange={(event) => setData('excerpt', event.target.value)}
                                    placeholder="Ringkasan singkat (opsional, akan ditampilkan di halaman daftar)"
                                    invalid={Boolean(errors.excerpt)}
                                />
                            </Field>
                            <Field label="Konten" htmlFor="content" error={errors.content} required>
                                <Textarea
                                    id="content"
                                    rows={10}
                                    value={data.content}
                                    onChange={(event) => setData('content', event.target.value)}
                                    placeholder="Tulis konten pengumuman secara lengkap..."
                                    invalid={Boolean(errors.content)}
                                />
                            </Field>
                            {announcement.image && (
                                <section aria-labelledby="current-image">
                                    <h2
                                        id="current-image"
                                        className="mb-2 text-sm font-medium text-ink-1"
                                    >
                                        Gambar Saat Ini
                                    </h2>
                                    <img
                                        src={announcement.image}
                                        alt={`Gambar pengumuman ${announcement.title}`}
                                        className="h-32 w-48 rounded-lg border border-line object-cover"
                                    />
                                </section>
                            )}
                            <Field
                                label={announcement.image ? 'Ganti Gambar' : 'Gambar'}
                                htmlFor="image"
                                error={errors.image}
                            >
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) =>
                                        setData('image', event.target.files?.[0] ?? null)
                                    }
                                    invalid={Boolean(errors.image)}
                                />
                            </Field>
                            <div className="grid gap-4 md:grid-cols-3">
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
                                <Field
                                    label="Tanggal Publikasi"
                                    htmlFor="published_at"
                                    error={errors.published_at}
                                >
                                    <Input
                                        id="published_at"
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={(event) =>
                                            setData('published_at', event.target.value)
                                        }
                                        invalid={Boolean(errors.published_at)}
                                    />
                                </Field>
                                <Field
                                    htmlFor="is_pinned"
                                    label="Pengaturan publikasi"
                                    error={errors.is_pinned}
                                >
                                    <label className="flex min-h-11 items-center gap-3 rounded-xl border border-line px-4 text-sm font-medium text-ink-2">
                                        <Input
                                            id="is_pinned"
                                            type="checkbox"
                                            checked={data.is_pinned}
                                            onChange={(event) =>
                                                setData('is_pinned', event.target.checked)
                                            }
                                            className="h-5 w-5"
                                        />
                                        <span>Sematkan pengumuman</span>
                                    </label>
                                </Field>
                            </div>
                        </CardBody>
                        <CardFooter className="flex justify-end gap-3 border-t border-line">
                            <Button href="/admin/announcements" variant="outline">
                                Batal
                            </Button>
                            <Button type="submit" loading={processing} disabled={processing}>
                                Perbarui Pengumuman
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
