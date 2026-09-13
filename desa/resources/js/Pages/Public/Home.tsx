import { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowRight,
    Bell,
    CalendarDays,
    Camera,
    CheckCircle2,
    Clock3,
    Image,
    Landmark,
    Map,
    MapPin,
    Megaphone,
    MessageSquareText,
    Newspaper,
    Send,
    ShoppingBag,
    Sparkles,
    Sprout,
    Users,
} from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/ui/Container';
import PollWidget from '@/Components/ui/PollWidget';

interface HomeProps {
    upcomingEvents: Array<{
        id: number;
        title: string;
        slug: string;
        description: string;
        event_date: string;
        location: string;
        time?: string;
        category?: { name: string };
    }>;
    latestMemories: Array<{
        id: number;
        title: string;
        description: string;
        type: string;
        platform: string;
        source_url: string;
        thumbnail_url: string | null;
        created_at: string;
    }>;
    featuredDestinations: Array<{
        id: number;
        name: string;
        slug: string;
        description: string;
        category: string;
        featured_image: string | null;
    }>;
    villageInfo: Array<{ key: string; value: string; label: string }>;
    latestAnnouncements: Array<{
        id: number;
        title: string;
        slug: string;
        content: string;
        published_at: string;
    }>;
    recentSubmissions: Array<{
        id: number;
        title: string;
        content: string;
        category: string;
        name: string;
        created_at: string;
    }>;
    activePoll: {
        id: number;
        question: string;
        options: string[];
        voteCounts: Record<number, number>;
        totalVotes: number;
        hasVoted: boolean;
        userVote: number | null;
        ends_at: string | null;
    } | null;
}

const quickLinks = [
    { label: 'Berita', href: '/berita', icon: Newspaper },
    { label: 'Acara', href: '/acara', icon: CalendarDays },
    { label: 'Kenangan', href: '/kenangan', icon: Camera },
    { label: 'Destinasi', href: '/destinasi', icon: MapPin },
    { label: 'UMKM', href: '/umkm', icon: ShoppingBag },
    { label: 'Peta Desa', href: '/peta', icon: Map },
];

function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(dateString));
}

function stripHtml(content: string): string {
    return content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function SectionHeading({
    eyebrow,
    title,
    description,
    href,
    linkLabel,
}: {
    eyebrow: string;
    title: string;
    description: string;
    href: string;
    linkLabel: string;
}) {
    return (
        <div className="mb-6 flex items-end justify-between gap-5 md:mb-8">
            <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-strong">{eyebrow}</p>
                <h2 className="text-2xl font-extrabold tracking-tight text-ink-1 md:text-3xl">{title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-3 md:text-base">{description}</p>
            </div>
            <Link
                href={href}
                className="hidden shrink-0 items-center gap-2 text-sm font-bold text-brand-strong transition-colors hover:text-brand md:inline-flex"
            >
                {linkLabel}
                <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
        </div>
    );
}

export default function Home({
    upcomingEvents = [],
    latestMemories = [],
    featuredDestinations = [],
    villageInfo = [],
    latestAnnouncements = [],
    recentSubmissions = [],
    activePoll = null,
}: HomeProps) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        category: '',
        title: '',
        content: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const getInfo = (key: string, fallback: string) =>
        villageInfo.find((item) => item.key === key)?.value || fallback;

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        post('/submissions', {
            onSuccess: () => {
                reset();
                setSubmitted(true);
                window.setTimeout(() => setSubmitted(false), 5000);
            },
        });
    };

    const primaryAnnouncement = latestAnnouncements[0];
    const facts = [
        { icon: Users, label: 'Penduduk', value: getInfo('jumlah_penduduk', '1.808 jiwa') },
        { icon: Map, label: 'Luas wilayah', value: getInfo('luas_wilayah', '2,67 km²') },
        { icon: Landmark, label: 'Kode pos', value: getInfo('kode_pos', '64154') },
        { icon: Sprout, label: 'Karakter desa', value: 'Agraris & gotong royong' },
    ];

    return (
        <PublicLayout>
            <Head title="Desa Muneng - Ruang Informasi dan Cerita Warga" />

            <div className="bg-surface-2 pb-16 md:pb-24">
                <section className="pt-5 md:pt-7" aria-labelledby="hero-title">
                    <Container>
                        <div className="relative flex min-h-[480px] items-end overflow-hidden rounded-[1.75rem] bg-ink-1 shadow-sm md:min-h-[500px]">
                            <img
                                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=85"
                                alt="Hamparan persawahan yang mewakili suasana agraris Desa Muneng"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" aria-hidden />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden />

                            <div className="relative z-10 w-full p-6 sm:p-9 md:p-12 lg:p-14">
                                <div className="max-w-3xl">
                                    <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                                        <Sparkles className="h-3.5 w-3.5 text-amber-300" aria-hidden />
                                        Ruang digital warga Muneng
                                    </span>
                                    <h1 id="hero-title" className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                                        Dekat dengan desa, terhubung dengan cerita.
                                    </h1>
                                    <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
                                        Temukan kabar, agenda, kenangan, dan potensi Desa Muneng dalam satu ruang yang dibuat bersama warga.
                                    </p>
                                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                        <Link
                                            href="/berita"
                                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-strong px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/15 transition hover:bg-emerald-800"
                                        >
                                            Lihat kabar terbaru
                                            <ArrowRight className="h-4 w-4" aria-hidden />
                                        </Link>
                                        <a
                                            href="#ruang-berbagi"
                                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                                        >
                                            <Send className="h-4 w-4" aria-hidden />
                                            Kirim informasi
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                <section className="mt-4" aria-label="Akses cepat">
                    <Container>
                        <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-line bg-surface-1 shadow-sm sm:grid-cols-6">
                            {quickLinks.map(({ label, href, icon: Icon }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="group flex min-h-[94px] flex-col items-center justify-center gap-2 border-b border-r border-line p-3 text-center transition hover:bg-brand-soft sm:border-b-0"
                                >
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-3 text-ink-2 transition group-hover:bg-brand-strong group-hover:text-white">
                                        <Icon className="h-5 w-5" aria-hidden />
                                    </span>
                                    <span className="text-xs font-bold text-ink-2 sm:text-sm">{label}</span>
                                </Link>
                            ))}
                        </div>
                    </Container>
                </section>

                <section className="mt-5" aria-label="Informasi prioritas">
                    <Container className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
                        {primaryAnnouncement ? (
                            <Link
                                href={`/berita/${primaryAnnouncement.slug}`}
                                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-strong to-emerald-950 p-6 text-white shadow-sm md:p-8"
                            >
                                <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border-[28px] border-white/5" aria-hidden />
                                <div className="relative flex h-full min-h-[150px] flex-col justify-between">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
                                        <Bell className="h-4 w-4" aria-hidden /> Pengumuman terbaru
                                    </div>
                                    <div className="mt-8">
                                        <p className="text-xl font-extrabold leading-snug md:text-2xl">{primaryAnnouncement.title}</p>
                                        <p className="mt-2 text-sm text-white/70">{formatDate(primaryAnnouncement.published_at)}</p>
                                    </div>
                                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">
                                        Baca selengkapnya
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                                    </span>
                                </div>
                            </Link>
                        ) : (
                            <div className="rounded-2xl bg-gradient-to-br from-brand-strong to-emerald-950 p-6 text-white md:p-8">
                                <Megaphone className="h-7 w-7 text-emerald-200" aria-hidden />
                                <h2 className="mt-8 text-2xl font-extrabold">Belum ada pengumuman baru</h2>
                                <p className="mt-2 text-sm text-white/70">Informasi terbaru desa akan tampil di sini.</p>
                            </div>
                        )}

                        <a
                            href="#ruang-berbagi"
                            className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-100 p-6 md:p-8"
                        >
                            <MessageSquareText className="h-7 w-7 text-amber-800" aria-hidden />
                            <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-amber-800">Dari warga, untuk warga</p>
                            <h2 className="mt-2 text-xl font-extrabold leading-snug text-ink-1 md:text-2xl">Punya kabar atau cerita tentang Muneng?</h2>
                            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-amber-800">
                                Bagikan sekarang
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                            </span>
                        </a>
                    </Container>
                </section>

                <section className="mt-5" aria-label="Data singkat Desa Muneng">
                    <Container>
                        <div className="grid rounded-2xl border border-line bg-surface-1 p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
                            {facts.map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-center gap-3 rounded-xl p-4">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
                                        <Icon className="h-5 w-5" aria-hidden />
                                    </span>
                                    <div>
                                        <p className="text-xs font-semibold text-ink-3">{label}</p>
                                        <p className="mt-0.5 text-sm font-extrabold text-ink-1">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Container>
                </section>

                <section className="pt-16 md:pt-24">
                    <Container>
                        <SectionHeading
                            eyebrow="Informasi warga"
                            title="Kabar terbaru dari Muneng"
                            description="Pengumuman penting dan informasi yang perlu diketahui warga hari ini."
                            href="/berita"
                            linkLabel="Lihat semua berita"
                        />
                        {latestAnnouncements.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-3">
                                {latestAnnouncements.slice(0, 3).map((announcement, index) => (
                                    <Link
                                        key={announcement.id}
                                        href={`/berita/${announcement.slug}`}
                                        aria-label={`Baca berita: ${announcement.title}`}
                                        className="group overflow-hidden rounded-2xl border border-line bg-surface-1 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className={`h-2 ${index === 0 ? 'bg-brand' : index === 1 ? 'bg-amber-400' : 'bg-sky-500'}`} />
                                        <div className="p-5 md:p-6">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-ink-3">
                                                <Newspaper className="h-4 w-4 text-brand-strong" aria-hidden />
                                                {formatDate(announcement.published_at)}
                                            </div>
                                            <h3 className="mt-4 line-clamp-2 text-lg font-extrabold leading-snug text-ink-1 transition-colors group-hover:text-brand-strong">
                                                {announcement.title}
                                            </h3>
                                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink-3">
                                                {stripHtml(announcement.content)}
                                            </p>
                                            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-strong">
                                                Baca kabar <ArrowRight className="h-4 w-4" aria-hidden />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-line-strong bg-surface-1 p-10 text-center text-ink-3">
                                Belum ada kabar yang diterbitkan.
                            </div>
                        )}
                        <Link href="/berita" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-strong md:hidden">
                            Lihat semua berita <ArrowRight className="h-4 w-4" aria-hidden />
                        </Link>
                    </Container>
                </section>

                <section className="pt-16 md:pt-24">
                    <Container>
                        <SectionHeading
                            eyebrow="Kalender desa"
                            title="Agenda yang akan datang"
                            description="Catat waktunya dan ikut hadir dalam kegiatan bersama di Desa Muneng."
                            href="/acara"
                            linkLabel="Lihat semua acara"
                        />
                        {upcomingEvents.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {upcomingEvents.slice(0, 4).map((event) => {
                                    const date = new Date(event.event_date);
                                    return (
                                        <Link
                                            key={event.id}
                                            href={`/acara/${event.slug}`}
                                            className="group rounded-2xl border border-line bg-surface-1 p-5 shadow-sm transition hover:border-brand-ring hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="rounded-xl bg-brand-soft px-3 py-2 text-center">
                                                    <p className="text-2xl font-extrabold leading-none text-brand-strong">{date.getDate()}</p>
                                                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-brand-strong">
                                                        {date.toLocaleDateString('id-ID', { month: 'short' })}
                                                    </p>
                                                </div>
                                                {event.category && (
                                                    <span className="rounded-full bg-surface-3 px-2.5 py-1 text-xs font-bold text-ink-2">{event.category.name}</span>
                                                )}
                                            </div>
                                            <h3 className="mt-5 line-clamp-2 font-extrabold leading-snug text-ink-1 transition-colors group-hover:text-brand-strong">{event.title}</h3>
                                            <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-ink-3">
                                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
                                                {event.location}
                                            </p>
                                            {event.time && (
                                                <p className="mt-1.5 flex items-center gap-2 text-xs text-ink-3">
                                                    <Clock3 className="h-3.5 w-3.5 text-brand" aria-hidden /> {event.time}
                                                </p>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-line-strong bg-surface-1 p-10 text-center text-ink-3">
                                Belum ada agenda mendatang.
                            </div>
                        )}
                    </Container>
                </section>

                <section className="pt-16 md:pt-24">
                    <Container>
                        <SectionHeading
                            eyebrow="Jelajahi Muneng"
                            title="Cerita dan tempat yang dekat"
                            description="Simpan kenangan warga dan kenali kembali sudut-sudut Desa Muneng."
                            href="/kenangan"
                            linkLabel="Jelajahi kenangan"
                        />
                        <div className="grid gap-5 lg:grid-cols-2">
                            <div className="rounded-2xl border border-line bg-surface-1 p-4 shadow-sm sm:p-5">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 font-extrabold text-ink-1">
                                        <Camera className="h-5 w-5 text-brand" aria-hidden /> Kenangan warga
                                    </h3>
                                    <Link href="/kenangan" className="text-xs font-bold text-brand-strong">Semua</Link>
                                </div>
                                <div className="space-y-3">
                                    {latestMemories.slice(0, 3).map((memory) => (
                                        <Link key={memory.id} href="/kenangan" className="group flex gap-4 rounded-xl p-2 transition hover:bg-surface-2">
                                            <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-brand-soft to-emerald-200">
                                                {memory.thumbnail_url ? (
                                                    <img src={memory.thumbnail_url} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
                                                ) : (
                                                    <Image className="m-auto h-full w-7 text-brand" aria-hidden />
                                                )}
                                            </div>
                                            <div className="min-w-0 py-1">
                                                <p className="text-xs font-bold uppercase tracking-wider text-brand-strong">{memory.platform}</p>
                                                <h4 className="mt-1 line-clamp-2 text-sm font-extrabold leading-5 text-ink-1">{memory.title}</h4>
                                                <p className="mt-1 text-xs text-ink-3">{formatDate(memory.created_at)}</p>
                                            </div>
                                        </Link>
                                    ))}
                                    {latestMemories.length === 0 && <p className="p-6 text-center text-sm text-ink-3">Belum ada kenangan yang dibagikan.</p>}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-line bg-surface-1 p-4 shadow-sm sm:p-5">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 font-extrabold text-ink-1">
                                        <MapPin className="h-5 w-5 text-accent" aria-hidden /> Destinasi sekitar
                                    </h3>
                                    <Link href="/destinasi" className="text-xs font-bold text-brand-strong">Semua</Link>
                                </div>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {featuredDestinations.slice(0, 3).map((destination) => (
                                        <Link key={destination.id} href={`/destinasi/${destination.slug}`} className="group overflow-hidden rounded-xl border border-line">
                                            <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-amber-50 to-emerald-100">
                                                {destination.featured_image ? (
                                                    <img src={destination.featured_image} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                                                ) : (
                                                    <MapPin className="m-auto h-full w-7 text-brand" aria-hidden />
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <p className="truncate text-xs font-extrabold text-ink-1">{destination.name}</p>
                                                <p className="mt-1 truncate text-xs font-semibold uppercase tracking-wider text-ink-3">{destination.category}</p>
                                            </div>
                                        </Link>
                                    ))}
                                    {featuredDestinations.length === 0 && <p className="col-span-full p-6 text-center text-sm text-ink-3">Destinasi belum tersedia.</p>}
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                <section id="ruang-berbagi" className="scroll-mt-32 pt-16 md:pt-24">
                    <Container>
                        <div className="overflow-hidden rounded-[1.75rem] bg-ink-1">
                            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
                                <div className="relative p-6 text-white sm:p-9 md:p-12">
                                    <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand/20 blur-3xl" aria-hidden />
                                    <div className="relative">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
                                            <Send className="h-3.5 w-3.5" aria-hidden /> Ruang berbagi
                                        </span>
                                        <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-4xl">Satu kabar kecil bisa berarti besar bagi warga.</h2>
                                        <p className="mt-4 text-sm leading-7 text-white/65 md:text-base">
                                            Kirim informasi kegiatan, pengumuman, UMKM, atau cerita tentang Muneng. Setiap kiriman ditinjau sebelum dipublikasikan.
                                        </p>

                                        {activePoll && <div className="mt-8"><PollWidget poll={activePoll} /></div>}

                                        {recentSubmissions.length > 0 && (
                                            <div className="mt-8 border-t border-white/10 pt-6">
                                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Baru dibagikan warga</p>
                                                <div className="mt-4 space-y-3">
                                                    {recentSubmissions.slice(0, 2).map((submission) => (
                                                        <div key={submission.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                                                            <p className="text-sm font-bold text-white">{submission.title}</p>
                                                            <p className="mt-1 text-xs text-white/50">{submission.category} · {submission.name}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="m-3 rounded-2xl bg-surface-1 p-5 sm:m-5 sm:p-7 md:p-9">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-extrabold text-ink-1">Kirim informasi warga</h3>
                                        <p className="mt-1 text-sm text-ink-3">Isi data singkat berikut. Tidak perlu masuk akun.</p>
                                    </div>

                                    {submitted && (
                                        <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-brand-soft p-4 text-sm font-semibold text-brand-strong" role="status">
                                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                                            Kiriman diterima dan akan ditinjau sebelum dipublikasikan.
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="submission-name" className="mb-1.5 block text-sm font-bold text-ink-2">Nama</label>
                                                <input
                                                    id="submission-name"
                                                    value={data.name}
                                                    onChange={(event) => setData('name', event.target.value)}
                                                    className="min-h-12 w-full rounded-xl border-line bg-surface-2 px-4 text-sm focus:border-brand focus:ring-brand"
                                                    placeholder="Nama Anda"
                                                    required
                                                />
                                                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="submission-category" className="mb-1.5 block text-sm font-bold text-ink-2">Kategori</label>
                                                <select
                                                    id="submission-category"
                                                    value={data.category}
                                                    onChange={(event) => setData('category', event.target.value)}
                                                    className="min-h-12 w-full rounded-xl border-line bg-surface-2 px-4 text-sm focus:border-brand focus:ring-brand"
                                                    required
                                                >
                                                    <option value="">Pilih kategori</option>
                                                    <option value="info_event">Info Event</option>
                                                    <option value="pengumuman">Pengumuman</option>
                                                    <option value="umkm">UMKM</option>
                                                    <option value="kenangan">Kenangan</option>
                                                    <option value="lainnya">Lainnya</option>
                                                </select>
                                                {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="submission-title" className="mb-1.5 block text-sm font-bold text-ink-2">Judul informasi</label>
                                            <input
                                                id="submission-title"
                                                value={data.title}
                                                onChange={(event) => setData('title', event.target.value)}
                                                className="min-h-12 w-full rounded-xl border-line bg-surface-2 px-4 text-sm focus:border-brand focus:ring-brand"
                                                placeholder="Contoh: Kerja bakti hari Minggu"
                                                required
                                            />
                                            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="submission-content" className="mb-1.5 block text-sm font-bold text-ink-2">Isi informasi</label>
                                            <textarea
                                                id="submission-content"
                                                rows={5}
                                                value={data.content}
                                                onChange={(event) => setData('content', event.target.value)}
                                                className="w-full resize-none rounded-xl border-line bg-surface-2 px-4 py-3 text-sm focus:border-brand focus:ring-brand"
                                                placeholder="Tuliskan informasi selengkapnya..."
                                                required
                                            />
                                            {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content}</p>}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-strong px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <Send className="h-4 w-4" aria-hidden />
                                            {processing ? 'Mengirim...' : 'Kirim ke pengelola'}
                                        </button>
                                        <p className="text-center text-xs leading-5 text-ink-3">Website ini dikelola independen oleh warga dan bukan situs resmi pemerintah desa.</p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>
            </div>
        </PublicLayout>
    );
}
