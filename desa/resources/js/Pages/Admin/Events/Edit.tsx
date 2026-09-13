import { Head, router, useForm } from '@inertiajs/react';
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

interface EventRecord {
    id: number;
    title: string;
    description: string | null;
    content: string | null;
    event_date: string;
    end_date: string | null;
    time: string | null;
    location: string | null;
    image: string | null;
    status: string;
    category_id: number | null;
}

interface EditEventProps {
    event: EventRecord;
    categories: CategoryOption[];
}

export default function EditEvent({ event, categories }: EditEventProps) {
    const { data, setData, processing, errors } = useForm({
        _method: 'put' as const,
        title: event.title || '',
        description: event.description || '',
        content: event.content || '',
        event_date: event.event_date || '',
        end_date: event.end_date || '',
        time: event.time || '',
        location: event.location || '',
        image: null as File | null,
        status: event.status || 'draft',
        category_id: event.category_id?.toString() || '',
    });

    const handleSubmit: FormEventHandler = (formEvent) => {
        formEvent.preventDefault();
        router.post(
            `/admin/events/${event.id}`,
            { ...data, _method: 'put' },
            { forceFormData: true },
        );
    };

    return (
        <AdminLayout title="Edit Event">
            <Head title={`Edit Event - ${event.title} - Admin Desa Muneng`} />

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
                        <h1 className="text-2xl font-bold tracking-tight text-ink-1">Edit Event</h1>
                        <p className="mt-1 text-ink-3">Perbarui informasi event</p>
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
                                    onChange={(formEvent) =>
                                        setData('title', formEvent.target.value)
                                    }
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
                                    onChange={(formEvent) =>
                                        setData('description', formEvent.target.value)
                                    }
                                    placeholder="Deskripsi singkat tentang event"
                                    invalid={Boolean(errors.description)}
                                />
                            </Field>
                            <Field label="Konten Detail" htmlFor="content" error={errors.content}>
                                <Textarea
                                    id="content"
                                    rows={6}
                                    value={data.content}
                                    onChange={(formEvent) =>
                                        setData('content', formEvent.target.value)
                                    }
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
                                        onChange={(formEvent) =>
                                            setData('event_date', formEvent.target.value)
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
                                        onChange={(formEvent) =>
                                            setData('end_date', formEvent.target.value)
                                        }
                                        invalid={Boolean(errors.end_date)}
                                    />
                                </Field>
                                <Field label="Waktu" htmlFor="time" error={errors.time}>
                                    <Input
                                        id="time"
                                        type="time"
                                        value={data.time}
                                        onChange={(formEvent) =>
                                            setData('time', formEvent.target.value)
                                        }
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
                                    onChange={(formEvent) =>
                                        setData('location', formEvent.target.value)
                                    }
                                    placeholder="Lokasi penyelenggaraan event"
                                    invalid={Boolean(errors.location)}
                                />
                            </Field>
                            <Field
                                label="Gambar"
                                htmlFor="image"
                                error={errors.image}
                                description={
                                    event.image
                                        ? 'Kosongkan jika tidak ingin mengubah gambar.'
                                        : undefined
                                }
                            >
                                {event.image && (
                                    <img
                                        src={event.image}
                                        alt={`Gambar event ${event.title}`}
                                        className="mb-3 h-20 w-32 rounded-lg border border-line object-cover"
                                    />
                                )}
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(formEvent) =>
                                        setData('image', formEvent.target.files?.[0] ?? null)
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
                                        onChange={(formEvent) =>
                                            setData('status', formEvent.target.value)
                                        }
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
                                        onChange={(formEvent) =>
                                            setData('category_id', formEvent.target.value)
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
                                Perbarui Event
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
