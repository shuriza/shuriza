import { Head, router, useForm } from '@inertiajs/react';
import { BarChart3, Check, Plus, Trash2, Users, X } from 'lucide-react';
import { useState, type FormEventHandler } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardFooter, CardHeader } from '@/Components/ui/Card';
import EmptyState from '@/Components/ui/EmptyState';
import Field, { Input } from '@/Components/ui/Field';

interface Poll {
    id: number;
    question: string;
    options: string[];
    is_active: boolean;
    ends_at: string | null;
    vote_counts: Record<number, number>;
    total_votes: number;
    created_at: string;
}
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
interface PaginatedPolls {
    data: Poll[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}
interface PollsIndexProps {
    polls: PaginatedPolls;
}

function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(dateString));
}

export default function PollsIndex({ polls }: PollsIndexProps) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        question: '',
        options: ['', ''],
        ends_at: '',
    });
    const addOption = () => {
        if (data.options.length < 6) setData('options', [...data.options, '']);
    };
    const removeOption = (index: number) => {
        if (data.options.length > 2)
            setData(
                'options',
                data.options.filter((_, itemIndex) => itemIndex !== index),
            );
    };
    const updateOption = (index: number, value: string) => {
        const options = [...data.options];
        options[index] = value;
        setData('options', options);
    };
    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        post('/admin/polls', {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };
    const handleDelete = (id: number, question: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus polling "${question}"?`))
            router.delete(`/admin/polls/${id}`);
    };

    return (
        <AdminLayout title="Kelola Polling">
            <Head title="Kelola Polling - Admin Desa Muneng" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-ink-1">
                            Kelola Polling
                        </h1>
                        <p className="mt-1 text-sm text-ink-3">
                            Buat dan kelola jajak pendapat untuk warga desa
                        </p>
                    </div>
                    <Button
                        type="button"
                        className="gap-2 self-start sm:self-auto"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? (
                            <>
                                <X className="h-4 w-4" aria-hidden />
                                Tutup Form
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4" aria-hidden />
                                Buat Polling Baru
                            </>
                        )}
                    </Button>
                </div>
                {showForm && (
                    <Card>
                        <CardHeader className="border-b border-line">
                            <h2 className="text-lg font-semibold text-ink-1">Buat Polling Baru</h2>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardBody className="space-y-5">
                                <Field
                                    label="Pertanyaan"
                                    htmlFor="question"
                                    error={errors.question}
                                    required
                                >
                                    <Input
                                        id="question"
                                        value={data.question}
                                        onChange={(event) =>
                                            setData('question', event.target.value)
                                        }
                                        placeholder="Contoh: Kegiatan apa yang paling Anda nantikan?"
                                        maxLength={500}
                                        invalid={Boolean(errors.question)}
                                    />
                                </Field>
                                <Field
                                    label={`Pilihan Jawaban (${data.options.length}/6)`}
                                    htmlFor="option-0"
                                    error={errors.options}
                                    required
                                >
                                    <div className="space-y-2">
                                        {data.options.map((option, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <span className="w-5 text-center text-xs font-medium text-ink-4">
                                                    {index + 1}.
                                                </span>
                                                <Input
                                                    id={`option-${index}`}
                                                    value={option}
                                                    onChange={(event) =>
                                                        updateOption(index, event.target.value)
                                                    }
                                                    placeholder={`Pilihan ${index + 1}`}
                                                    maxLength={255}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="min-h-11 min-w-11 p-0 text-red-600"
                                                    aria-label={`Hapus pilihan ${index + 1}`}
                                                    disabled={data.options.length <= 2}
                                                    onClick={() => removeOption(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" aria-hidden />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    {data.options.length < 6 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2 gap-1 text-brand-strong"
                                            onClick={addOption}
                                        >
                                            <Plus className="h-4 w-4" aria-hidden />
                                            Tambah Pilihan
                                        </Button>
                                    )}
                                </Field>
                                <Field
                                    label="Berakhir Pada"
                                    htmlFor="ends_at"
                                    error={errors.ends_at}
                                    description="Kosongkan jika polling tidak memiliki batas waktu."
                                >
                                    <Input
                                        id="ends_at"
                                        type="datetime-local"
                                        value={data.ends_at}
                                        onChange={(event) => setData('ends_at', event.target.value)}
                                        invalid={Boolean(errors.ends_at)}
                                    />
                                </Field>
                            </CardBody>
                            <CardFooter className="flex justify-end gap-3 border-t border-line">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        reset();
                                        setShowForm(false);
                                    }}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" loading={processing} disabled={processing}>
                                    Buat Polling
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                )}
                <section className="space-y-4" aria-label="Daftar polling">
                    {polls.data.length > 0 ? (
                        polls.data.map((poll) => {
                            const maxVotes = Math.max(...Object.values(poll.vote_counts), 0);
                            return (
                                <Card key={poll.id}>
                                    <CardBody className="p-5">
                                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <div className="mb-1 flex flex-wrap items-center gap-2">
                                                    {poll.is_active ? (
                                                        <Badge variant="success">Aktif</Badge>
                                                    ) : (
                                                        <Badge variant="default">Nonaktif</Badge>
                                                    )}
                                                    <span className="text-xs text-ink-4">
                                                        {formatDate(poll.created_at)}
                                                        {poll.ends_at &&
                                                            ` · Berakhir ${formatDate(poll.ends_at)}`}
                                                    </span>
                                                </div>
                                                <h2 className="text-base font-semibold text-ink-1">
                                                    {poll.question}
                                                </h2>
                                            </div>
                                            <div className="flex shrink-0 gap-2">
                                                <Button
                                                    type="button"
                                                    variant={poll.is_active ? 'accent' : 'tonal'}
                                                    size="sm"
                                                    onClick={() =>
                                                        router.post(
                                                            `/admin/polls/${poll.id}/toggle`,
                                                        )
                                                    }
                                                >
                                                    {poll.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(poll.id, poll.question)
                                                    }
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            {poll.options.map((option, index) => {
                                                const count = poll.vote_counts[index] || 0;
                                                const percentage =
                                                    poll.total_votes > 0
                                                        ? Math.round(
                                                              (count / poll.total_votes) * 100,
                                                          )
                                                        : 0;
                                                const isMax = count === maxVotes && count > 0;
                                                return (
                                                    <div
                                                        key={index}
                                                        className={
                                                            isMax
                                                                ? 'relative overflow-hidden rounded-lg border border-brand-soft bg-brand-soft/50'
                                                                : 'relative overflow-hidden rounded-lg border border-line-subtle bg-surface-2'
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                isMax
                                                                    ? 'absolute inset-y-0 left-0 bg-brand-soft transition-all duration-500'
                                                                    : 'absolute inset-y-0 left-0 bg-surface-3 transition-all duration-500'
                                                            }
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                        <div className="relative flex items-center justify-between gap-3 px-4 py-2.5">
                                                            <span
                                                                className={
                                                                    isMax
                                                                        ? 'text-sm font-medium text-brand-strong'
                                                                        : 'text-sm font-medium text-ink-2'
                                                                }
                                                            >
                                                                {option}
                                                            </span>
                                                            <span className="shrink-0 text-sm font-bold text-ink-2">
                                                                {count} suara · {percentage}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-sm font-medium text-ink-3">
                                            <Users className="h-4 w-4" aria-hidden />
                                            Total: {poll.total_votes} suara
                                        </div>
                                    </CardBody>
                                </Card>
                            );
                        })
                    ) : (
                        <Card>
                            <CardBody>
                                <EmptyState
                                    icon={BarChart3}
                                    title="Belum ada polling"
                                    description="Buat polling pertama untuk mengetahui pendapat warga desa."
                                    action={
                                        <Button
                                            type="button"
                                            className="gap-2"
                                            onClick={() => setShowForm(true)}
                                        >
                                            <Plus className="h-4 w-4" aria-hidden />
                                            Buat Polling
                                        </Button>
                                    }
                                />
                            </CardBody>
                        </Card>
                    )}
                </section>
                {polls.links.length > 3 && (
                    <Card>
                        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-ink-3">
                                Halaman {polls.current_page} dari {polls.last_page}
                            </p>
                            <nav className="flex flex-wrap gap-1" aria-label="Paginasi polling">
                                {polls.links.map((link) => {
                                    const url = link.url;
                                    return url !== null ? (
                                        <Button
                                            key={link.label}
                                            type="button"
                                            variant={link.active ? 'primary' : 'ghost'}
                                            size="sm"
                                            onClick={() => router.get(url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={link.label}
                                            className="rounded-lg px-3 py-1.5 text-sm text-ink-4"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </nav>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
