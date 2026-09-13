import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FormEventHandler } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardFooter } from '@/Components/ui/Card';
import Field, { Input, Select, Textarea } from '@/Components/ui/Field';

export default function CreateAnnouncement() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        excerpt: '',
        image: null as File | null,
        is_pinned: false,
        status: 'draft',
        published_at: '',
    });
    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        post('/admin/announcements', { forceFormData: true });
    };

    return (
        <AdminLayout title="Tambah Pengumuman">
            <Head title="Tambah Pengumuman - Admin Desa Muneng" />
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
                            Tambah Pengumuman
                        </h1>
                        <p className="mt-1 text-ink-3">Buat pengumuman baru untuk Desa Muneng</p>
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
                            <Field label="Gambar" htmlFor="image" error={errors.image}>
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
                                Simpan Pengumuman
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
