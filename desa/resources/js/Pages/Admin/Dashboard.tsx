import { Head, Link, router } from '@inertiajs/react';
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Images,
    Inbox,
    Mail,
    MapPin,
    MessageSquareText,
    Store,
    Users,
    type LucideIcon,
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardHeader } from '@/Components/ui/Card';
import EmptyState from '@/Components/ui/EmptyState';
import IconBox from '@/Components/ui/IconBox';

interface Stats {
    totalEvents: number;
    publishedEvents: number;
    totalMemories: number;
    pendingMemories: number;
    approvedMemories: number;
    totalDestinations: number;
    totalWarga: number;
    totalSubmissions: number;
    pendingSubmissions: number;
    pendingProducts: number;
    unreadMessages: number;
}

interface RecentMemory {
    id: number;
    title: string;
    platform: string;
    type: string;
    submitted_by: string;
    created_at: string;
}

interface UpcomingEvent {
    id: number;
    title: string;
    event_date: string;
    location: string;
    category: string;
}

interface RecentSubmission {
    id: number;
    name: string;
    category: string;
    title: string;
    content: string;
    status: string;
    created_at: string;
}

interface RecentMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    created_at: string;
}

interface DashboardProps {
    stats: Stats;
    recentMemories: RecentMemory[];
    upcomingEvents: UpcomingEvent[];
    recentSubmissions: RecentSubmission[];
    recentMessages: RecentMessage[];
}

interface StatCard {
    label: string;
    value: number;
    icon: LucideIcon;
    variant: 'brand' | 'accent' | 'neutral' | 'inverse';
}

function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(dateString));
}

function truncateText(text: string, maxLength = 80): string {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
}

export default function Dashboard({
    stats,
    recentMemories,
    upcomingEvents,
    recentSubmissions,
    recentMessages,
}: DashboardProps) {
    const statCards: StatCard[] = [
        { label: 'Total Event', value: stats.totalEvents, icon: CalendarDays, variant: 'neutral' },
        {
            label: 'Event Dipublikasi',
            value: stats.publishedEvents,
            icon: CheckCircle2,
            variant: 'brand',
        },
        { label: 'Total Kenangan', value: stats.totalMemories, icon: Images, variant: 'neutral' },
        {
            label: 'Kenangan Pending',
            value: stats.pendingMemories,
            icon: Clock3,
            variant: 'accent',
        },
        {
            label: 'Kenangan Disetujui',
            value: stats.approvedMemories,
            icon: CheckCircle2,
            variant: 'brand',
        },
        {
            label: 'Total Destinasi',
            value: stats.totalDestinations,
            icon: MapPin,
            variant: 'brand',
        },
        { label: 'Total Warga', value: stats.totalWarga, icon: Users, variant: 'neutral' },
        { label: 'Total Kiriman', value: stats.totalSubmissions, icon: Inbox, variant: 'inverse' },
        {
            label: 'Kiriman Pending',
            value: stats.pendingSubmissions,
            icon: MessageSquareText,
            variant: 'accent',
        },
        {
            label: 'UMKM Pending',
            value: stats.pendingProducts,
            icon: Store,
            variant: 'accent',
        },
        {
            label: 'Pesan Belum Dibaca',
            value: stats.unreadMessages,
            icon: Mail,
            variant: 'inverse',
        },
    ];

    const handleRejectMemory = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menolak kenangan ini?')) {
            router.post(`/admin/memories/${id}/reject`);
        }
    };

    const handleRejectSubmission = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menolak kiriman ini?')) {
            router.post(`/admin/submissions/${id}/reject`);
        }
    };

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard - Admin Desa Muneng" />

            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-ink-1">Dashboard</h1>
                    <p className="mt-1 text-ink-3">Selamat datang di panel admin Desa Muneng</p>
                </div>

                <section
                    aria-label="Ringkasan statistik"
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                    {statCards.map((card) => (
                        <Card key={card.label} interactive>
                            <CardBody className="flex items-center justify-between gap-4 p-5">
                                <div>
                                    <p className="text-sm font-medium text-ink-3">{card.label}</p>
                                    <p className="mt-1 text-2xl font-bold text-ink-1">
                                        {card.value}
                                    </p>
                                </div>
                                <IconBox icon={card.icon} variant={card.variant} size="lg" />
                            </CardBody>
                        </Card>
                    ))}
                </section>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader className="flex items-center justify-between border-b border-line">
                            <h2 className="text-lg font-semibold text-ink-1">
                                Kenangan Menunggu Persetujuan
                            </h2>
                            <Link
                                href="/admin/memories?filter=pending"
                                className="text-sm font-semibold text-brand-strong hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                            >
                                Lihat Semua
                            </Link>
                        </CardHeader>
                        {recentMemories.length > 0 ? (
                            <div className="divide-y divide-line-subtle">
                                {recentMemories.map((memory) => (
                                    <div
                                        key={memory.id}
                                        className="flex flex-col gap-3 p-4 transition-colors hover:bg-surface-2 sm:flex-row sm:items-start sm:justify-between"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-ink-1">
                                                {memory.title}
                                            </p>
                                            <p className="mt-1 text-xs text-ink-3">
                                                {memory.submitted_by} <span aria-hidden>·</span>{' '}
                                                {memory.platform} <span aria-hidden>·</span>{' '}
                                                {formatDate(memory.created_at)}
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 gap-2">
                                            <Button
                                                type="button"
                                                variant="tonal"
                                                size="sm"
                                                onClick={() =>
                                                    router.post(
                                                        `/admin/memories/${memory.id}/approve`,
                                                    )
                                                }
                                            >
                                                Setujui
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleRejectMemory(memory.id)}
                                            >
                                                Tolak
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={Images}
                                title="Tidak ada kenangan menunggu"
                                description="Kenangan baru yang perlu ditinjau akan muncul di sini."
                                size="sm"
                            />
                        )}
                    </Card>

                    <Card>
                        <CardHeader className="flex items-center justify-between border-b border-line">
                            <h2 className="text-lg font-semibold text-ink-1">Acara Mendatang</h2>
                            <Link
                                href="/admin/events"
                                className="text-sm font-semibold text-brand-strong hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                            >
                                Lihat Semua
                            </Link>
                        </CardHeader>
                        {upcomingEvents.length > 0 ? (
                            <div className="divide-y divide-line-subtle">
                                {upcomingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-start justify-between gap-3 p-4 transition-colors hover:bg-surface-2"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-ink-1">
                                                {event.title}
                                            </p>
                                            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-3">
                                                <span className="inline-flex items-center gap-1">
                                                    <CalendarDays
                                                        className="h-3.5 w-3.5"
                                                        aria-hidden
                                                    />
                                                    {formatDate(event.event_date)}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                                                    {event.location}
                                                </span>
                                            </p>
                                        </div>
                                        <Badge variant="brand" rounded>
                                            {event.category}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={CalendarDays}
                                title="Tidak ada acara mendatang"
                                description="Event mendatang akan ditampilkan di sini."
                                size="sm"
                            />
                        )}
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex items-center justify-between border-b border-line">
                        <h2 className="text-lg font-semibold text-ink-1">Kiriman Terbaru</h2>
                        <Link
                            href="/admin/submissions?status=pending"
                            className="text-sm font-semibold text-brand-strong hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                        >
                            Lihat Semua
                        </Link>
                    </CardHeader>
                    {recentSubmissions.length > 0 ? (
                        <div className="divide-y divide-line-subtle">
                            {recentSubmissions.map((submission) => (
                                <div
                                    key={submission.id}
                                    className="flex flex-col gap-3 p-4 transition-colors hover:bg-surface-2 sm:flex-row sm:items-start sm:justify-between"
                                >
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-medium text-ink-1">
                                                {submission.title}
                                            </p>
                                            <Badge variant="brand" rounded>
                                                {submission.category}
                                            </Badge>
                                        </div>
                                        <p className="mt-1 text-sm text-ink-2">
                                            {truncateText(submission.content)}
                                        </p>
                                        <p className="mt-1.5 text-xs font-medium text-ink-3">
                                            {submission.name} <span aria-hidden>·</span>{' '}
                                            {formatDate(submission.created_at)}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 gap-2">
                                        <Button
                                            type="button"
                                            variant="tonal"
                                            size="sm"
                                            onClick={() =>
                                                router.post(
                                                    `/admin/submissions/${submission.id}/approve`,
                                                )
                                            }
                                        >
                                            Setujui
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRejectSubmission(submission.id)}
                                        >
                                            Tolak
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Inbox}
                            title="Tidak ada kiriman menunggu"
                            description="Kiriman baru dari warga akan muncul di sini."
                            size="sm"
                        />
                    )}
                </Card>

                <Card>
                    <CardHeader className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold text-ink-1">Pesan Belum Dibaca</h2>
                        <Link
                            href="/admin/contacts?status=unread"
                            className="text-sm font-semibold text-brand-strong hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                        >
                            Lihat Semua
                        </Link>
                    </CardHeader>
                    {recentMessages.length > 0 ? (
                        <div className="divide-y divide-line-subtle">
                            {recentMessages.map((message) => (
                                <Link
                                    key={message.id}
                                    href="/admin/contacts?status=unread"
                                    className="block p-4 transition-colors hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                                >
                                    <p className="font-medium text-ink-1">{message.subject}</p>
                                    <p className="mt-1.5 text-xs font-medium text-ink-3">
                                        {message.name} <span aria-hidden>·</span> {message.email}{' '}
                                        <span aria-hidden>·</span> {formatDate(message.created_at)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Mail}
                            title="Tidak ada pesan baru"
                            description="Pesan dari formulir kontak warga akan muncul di sini."
                            size="sm"
                        />
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}
