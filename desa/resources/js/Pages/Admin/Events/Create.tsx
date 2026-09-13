import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FormEventHandler } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardFooter } from '@/Components/ui/Card';
import Field, { Input, Select, Textarea } from '@/Components/ui/Field';

interface CategoryOption {
    id: number;
    name: string;
}

interface CreateEventProps {
    categories: CategoryOption[];
}

export default function CreateEvent({ categories }: CreateEventProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        content: '',
        event_date: '',
        end_date: '',
        time: '',
        location: '',
        image: null as File | null,
        status: 'draft',
        category_id: '',
    });

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        post('/admin/events', { forceFormData: true });
    };

    return (
        <AdminLayout title="Tambah Event">
            <Head title="Tambah Event - Admin Desa Muneng" />

            <div className="space-y-6">
                <div className="flex items-start gap-3">
                    <Button
                        href="/admin/events"
                        variant="ghost"
                        size="sm"
                        className="min-h-11 min-w-11 px-0"
                    >
                        <ArrowLeft className="h-5 w-5" aria-hidden />
                        <span className="sr-only">Kembali ke daftar event</span>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-ink-1">
                            Tambah Event
                        </h1>
                        <p className="mt-1 text-ink-3">Buat event baru untuk Desa Muneng</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardBody className="space-y-6 p-5 sm:p-6">
                            <Field
                                label="Judul Event"
                                htmlFor="title"
                                error={errors.title}
                                required
                            >
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(event) => setData('title', event.target.value)}
                                    placeholder="Masukkan judul event"
                                    invalid={Boolean(errors.title)}
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
                                    placeholder="Deskripsi singkat tentang event"
                                    invalid={Boolean(errors.description)}
                                />
                            </Field>
                            <Field label="Konten Detail" htmlFor="content" error={errors.content}>
                                <Textarea
                                    id="content"
                                    rows={6}
                                    value={data.content}
                                    onChange={(event) => setData('content', event.target.value)}
                                    placeholder="Detail lengkap tentang event..."
                                    invalid={Boolean(errors.content)}
                                />
                            </Field>
                            <div className="grid gap-4 md:grid-cols-3">
                                <Field
                                    label="Tanggal Mulai"
                                    htmlFor="event_date"
                                    error={errors.event_date}
                                    required
                                >
                                    <Input
                                        id="event_date"
                                        type="date"
                                        value={data.event_date}
                                        onChange={(event) =>
                                            setData('event_date', event.target.value)
                                        }
                                        invalid={Boolean(errors.event_date)}
                                    />
                                </Field>
                                <Field
                                    label="Tanggal Selesai"
                                    htmlFor="end_date"
                                    error={errors.end_date}
                                >
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(event) =>
                                            setData('end_date', event.target.value)
                                        }
                                        invalid={Boolean(errors.end_date)}
                                    />
                                </Field>
                                <Field label="Waktu" htmlFor="time" error={errors.time}>
                                    <Input
                                        id="time"
                                        type="time"
                                        value={data.time}
                                        onChange={(event) => setData('time', event.target.value)}
                                        invalid={Boolean(errors.time)}
                                    />
                                </Field>
                            </div>
                            <Field
                                label="Lokasi"
                                htmlFor="location"
                                error={errors.location}
                                required
                            >
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(event) => setData('location', event.target.value)}
                                    placeholder="Lokasi penyelenggaraan event"
                                    invalid={Boolean(errors.location)}
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
                            <div className="grid gap-4 md:grid-cols-2">
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
                                        <option value="archived">Diarsipkan</option>
                                    </Select>
                                </Field>
                                <Field
                                    label="Kategori"
                                    htmlFor="category_id"
                                    error={errors.category_id}
                                    required
                                >
                                    <Select
                                        id="category_id"
                                        value={data.category_id}
                                        onChange={(event) =>
                                            setData('category_id', event.target.value)
                                        }
                                        invalid={Boolean(errors.category_id)}
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Select>
                                </Field>
                            </div>
                        </CardBody>
                        <CardFooter className="flex justify-end gap-3 border-t border-line">
                            <Button href="/admin/events" variant="outline">
                                Batal
                            </Button>
                            <Button type="submit" loading={processing} disabled={processing}>
                                Simpan Event
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
