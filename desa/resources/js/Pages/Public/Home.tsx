import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import PollWidget from '@/Components/ui/PollWidget';
import { FormEventHandler, useState } from 'react';

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
    perangkatDesa: Array<{
        nama: string;
        jabatan: string;
        periode: string;
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

function formatDate(dateString: string): string {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const date = new Date(dateString);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default function Home({
    upcomingEvents = [],
    latestMemories = [],
    featuredDestinations = [],
    villageInfo = [],
    latestAnnouncements = [],
    perangkatDesa = [],
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

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/submissions', {
            onSuccess: () => {
                reset();
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 5000);
            },
        });
    };

    const kenanganTimeline = [
        { year: '2024', title: 'Malam Tirakatan & Doa Bersama', description: 'Warga berkumpul menyambut HUT RI dengan doa dan renungan bersama di balai desa.' },
        { year: '2023', title: 'Panen Raya & Syukuran Warga', description: 'Hasil panen melimpah, warga mengadakan syukuran bersama di area persawahan.' },
        { year: '2022', title: 'Karang Taruna Bangkit', description: 'Pemuda desa menghidupkan kembali kegiatan karang taruna dengan program kreatif.' },
        { year: '2021', title: 'Gotong Royong Pascapandemi', description: 'Semangat baru warga membangun kembali aktivitas sosial setelah pandemi mereda.' },
    ];

    return (
        <PublicLayout>
            <Head title="Beranda - Desa Muneng" />

            {/* ===== 1. HERO SECTION ===== */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Pemandangan sawah Desa Muneng"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                    <div className="absolute inset-0 bg-ink-1/20"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                            Website profil, agenda & ruang cerita warga
                        </h1>
                        <p className="text-xl md:text-2xl text-brand-ring font-semibold mb-4">
                            Desa Muneng, Purwoasri
                        </p>
                        <p className="text-base md:text-lg text-white/80 mb-8 leading-relaxed max-w-2xl">
                            Desa di Kabupaten Kediri, Jawa Timur yang dikenal dengan posisi strategis dan semangat gotong royong warganya. Website ini hadir untuk mengenal, berbagi, dan mengenang cerita Muneng.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mb-16">
                            <a
                                href="#ruang-berbagi"
                                className="inline-flex items-center justify-center px-8 py-4 bg-brand text-white font-semibold rounded-xl hover:bg-brand-strong transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Kirim Info Publik
                            </a>
                            <a
                                href="#tentang"
                                className="inline-flex items-center justify-center px-8 py-4 bg-surface-1/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-surface-1/20 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Kenali Desa
                            </a>
                        </div>
                    </div>

                    {/* Bottom Stats Row */}
                    <div className="absolute bottom-8 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                <div className="bg-surface-1/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                                    <p className="text-white/60 text-xs">Jarak</p>
                                    <p className="text-white font-semibold text-sm">±24 km dari Kota Kediri</p>
                                </div>
                                <div className="bg-surface-1/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                                    <p className="text-white/60 text-xs">Jarak</p>
                                    <p className="text-white font-semibold text-sm">±3 km dari Kertosono</p>
                                </div>
                                <div className="bg-surface-1/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                                    <p className="text-white/60 text-xs">Jarak</p>
                                    <p className="text-white font-semibold text-sm">±100 km dari Surabaya</p>
                                </div>
                                <div className="bg-surface-1/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                                    <p className="text-white/60 text-xs">Provinsi</p>
                                    <p className="text-white font-semibold text-sm">Jawa Timur, Indonesia</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== WAVE DIVIDER ===== */}
            <div className="relative -mt-1">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
                    <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#064e3b" />
                </svg>
            </div>

            {/* ===== 2. STATS SECTION ===== */}
            <section id="stats" className="relative py-20 md:py-28 bg-ink-1 overflow-hidden">
                {/* Dot pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                {/* Decorative circles */}
                <div className="absolute top-10 right-10 w-64 h-64 bg-brand-strong/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-48 h-48 bg-teal-600/20 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Data Desa Muneng</h2>
                        <p className="text-brand-soft text-lg">Statistik kependudukan dan wilayah</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                        {[
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                ),
                                value: '1.808', label: 'Penduduk'
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                ),
                                value: '677', label: 'Jiwa/km²'
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                ),
                                value: '24 km', label: 'dari Kediri'
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                ),
                                value: '64154', label: 'Kode Pos'
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                ),
                                value: '2,67 km\u00B2', label: 'Luas Wilayah'
                            },
                        ].map((stat, idx) => (
                            <div
                                key={idx}
                                className="bg-surface-1/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/10 hover:bg-surface-1/15 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 group"
                            >
                                <div className="text-brand-ring mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-brand-soft font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Poll Widget */}
                    {activePoll && (
                        <div className="mt-12 max-w-md mx-auto">
                            <PollWidget poll={activePoll} />
                        </div>
                    )}
                </div>
            </section>

            {/* ===== WAVE DIVIDER ===== */}
            <div className="relative">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
                    <path d="M0 0V30C240 60 480 60 720 30C960 0 1200 0 1440 30V0H0Z" fill="#064e3b" />
                </svg>
            </div>

            {/* ===== 3. TENTANG DESA SECTION ===== */}
            <section id="tentang" className="relative py-20 md:py-28 bg-surface-1 overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-brand-soft/50 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-soft/80 rounded-full translate-x-1/3 translate-y-1/3"></div>
                <div className="absolute top-1/2 right-10 w-20 h-20 bg-brand-soft/40 rounded-full"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 bg-brand-soft text-brand-strong text-sm font-semibold rounded-full mb-4">Tentang Kami</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-ink-1 mb-4">Tentang Desa Muneng</h2>
                        <p className="text-xl text-brand-strong font-medium mb-3">Tempat hidup, singgah, dan bertumbuh.</p>
                        <p className="text-ink-3 max-w-2xl mx-auto text-lg">
                            Desa dengan karakter agraris, komunitas yang kuat, dan posisi yang strategis di Kediri bagian utara.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                ),
                                title: 'Karakter Agraris',
                                desc: 'Sawah dan ladang menjadi bagian dari identitas Muneng yang mengakar kuat sejak generasi ke generasi.',
                                color: 'emerald',
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                ),
                                title: 'Gotong Royong',
                                desc: 'Semangat kebersamaan warga dalam membangun desa, dari kerja bakti hingga perayaan bersama.',
                                color: 'rose',
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                ),
                                title: 'Posisi Strategis',
                                desc: 'Terletak di jalur utama Kediri-Surabaya, dekat dengan Kertosono dan akses tol Jombang.',
                                color: 'blue',
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                ),
                                title: 'Menuju Digital',
                                desc: 'Website ini adalah langkah awal digitalisasi informasi desa untuk warga dan perantau.',
                                color: 'purple',
                            },
                        ].map((item, idx) => {
                            const colorMap: Record<string, { border: string; bg: string; text: string }> = {
                                emerald: { border: 'border-l-brand-ring', bg: 'bg-brand-soft', text: 'text-brand-strong' },
                                rose: { border: 'border-l-rose-500', bg: 'bg-rose-100', text: 'text-rose-600' },
                                blue: { border: 'border-l-blue-500', bg: 'bg-blue-100', text: 'text-blue-600' },
                                purple: { border: 'border-l-purple-500', bg: 'bg-purple-100', text: 'text-purple-600' },
                            };
                            const colors = colorMap[item.color];
                            return (
                                <div
                                    key={idx}
                                    className={`bg-surface-1 rounded-xl p-6 border border-line border-l-4 ${colors.border} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`flex-shrink-0 w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center ${colors.text}`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-ink-1 mb-2">{item.title}</h3>
                                            <p className="text-ink-3 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== 4. POSISI WILAYAH ===== */}
            <section className="relative py-20 md:py-28 bg-gradient-to-b from-brand-soft to-white overflow-hidden">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23059669\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-12 bg-brand-ring rounded-full"></div>
                                <span className="text-brand-strong font-semibold text-sm uppercase tracking-wider">Posisi Wilayah</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-ink-1 mb-6">
                                Lokasi Strategis di Jawa Timur
                            </h2>
                            <p className="text-lg text-ink-3 leading-relaxed mb-8">
                                Desa Muneng terletak di Kecamatan Purwoasri, Kabupaten Kediri, Jawa Timur. Posisinya yang strategis di jalur utama memberikan kemudahan akses ke berbagai kota besar di sekitarnya.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {['Kec. Purwoasri', 'Kab. Kediri', 'Jawa Timur'].map((badge, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-2 px-4 py-2 bg-surface-1 rounded-full shadow-sm border border-brand-soft text-sm font-medium text-ink-2">
                                        <svg className="w-4 h-4 text-brand-ring" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            {/* Map illustration placeholder */}
                            <div className="bg-surface-1 rounded-2xl shadow-xl border border-brand-soft p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-soft rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-brand-soft rounded-xl">
                                        <div className="w-10 h-10 bg-brand-ring rounded-lg flex items-center justify-center text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-ink-3">Kecamatan</p>
                                            <p className="font-bold text-ink-1">Purwoasri</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-ink-3">Kabupaten</p>
                                            <p className="font-bold text-ink-1">Kediri</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
                                        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-ink-3">Provinsi</p>
                                            <p className="font-bold text-ink-1">Jawa Timur</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== 5. PERANGKAT DESA ===== */}
            <section className="relative py-20 md:py-28 bg-surface-1 overflow-hidden">
                {/* Diagonal pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #059669 0, #059669 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 bg-brand-soft text-brand-strong text-sm font-semibold rounded-full mb-4">Pemerintahan</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-ink-1 mb-4">Perangkat Desa</h2>
                        <p className="text-ink-3 text-lg max-w-2xl mx-auto">
                            Aparatur pemerintahan Desa Muneng yang melayani masyarakat
                        </p>
                    </div>

                    {perangkatDesa && perangkatDesa.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {perangkatDesa.map((pejabat, idx) => (
                                <div
                                    key={idx}
                                    className="bg-surface-1 rounded-xl p-6 border border-line shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-brand-ring to-brand rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            {pejabat.nama.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-ink-1 text-lg">{pejabat.nama}</h3>
                                            <p className="text-brand-strong font-medium text-sm">{pejabat.jabatan}</p>
                                            <p className="text-ink-4 text-xs mt-0.5">{pejabat.periode}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-surface-2 rounded-2xl border border-line">
                            <svg className="w-12 h-12 text-ink-4 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-ink-3">Data perangkat desa belum tersedia.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ===== 6. LOKASI & AKSES ===== */}
            <section className="relative py-20 md:py-28 bg-surface-1 overflow-hidden">
                {/* Decorative compass SVG */}
                <div className="absolute top-10 right-10 opacity-[0.04]">
                    <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">Aksesibilitas</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-ink-1 mb-4">Lokasi & Akses</h2>
                        <p className="text-ink-3 text-lg max-w-2xl mx-auto">
                            Jarak tempuh dari Desa Muneng ke kota-kota terdekat
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6 mb-12">
                        {[
                            {
                                icon: (
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                ),
                                city: 'Kota Kediri',
                                distance: '±24 km',
                                time: '~40 menit',
                                color: 'emerald',
                            },
                            {
                                icon: (
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                ),
                                city: 'Kertosono',
                                distance: '±3 km',
                                time: '~5 menit',
                                color: 'blue',
                            },
                            {
                                icon: (
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                    </svg>
                                ),
                                city: 'Surabaya',
                                distance: '±100 km',
                                time: '~2 jam',
                                color: 'amber',
                            },
                        ].map((item, idx) => {
                            const colorMap: Record<string, { border: string; bg: string; text: string }> = {
                                emerald: { border: 'border-t-brand-ring', bg: 'bg-brand-soft', text: 'text-brand-strong' },
                                blue: { border: 'border-t-blue-500', bg: 'bg-blue-100', text: 'text-blue-600' },
                                amber: { border: 'border-t-amber-500', bg: 'bg-amber-100', text: 'text-amber-600' },
                            };
                            const colors = colorMap[item.color];
                            return (
                                <div
                                    key={idx}
                                    className={`bg-surface-1 rounded-xl p-6 border border-line border-t-4 ${colors.border} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center`}
                                >
                                    <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center ${colors.text} mx-auto mb-4`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="font-bold text-ink-1 text-lg mb-1">{item.city}</h3>
                                    <p className="text-3xl font-extrabold text-ink-1 mb-1">{item.distance}</p>
                                    <p className="text-ink-3 text-sm">{item.time}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Map buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://maps.app.goo.gl/8Y89T3eMxZdmYyNeA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-strong transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Buka di Google Maps
                        </a>
                        <a
                            href="https://www.openstreetmap.org/?mlat=-7.6257&mlon=112.1040#map=15/-7.6257/112.1040"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface-1 text-ink-2 font-semibold rounded-xl border-2 border-line hover:border-brand-ring hover:text-brand-strong transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Lihat di OpenStreetMap
                        </a>
                    </div>
                </div>
            </section>

            {/* ===== ANGLED DIVIDER ===== */}
            <div className="relative h-20 bg-surface-1">
                <div className="absolute inset-0 bg-ink-1" style={{ clipPath: 'polygon(0 40%, 100% 0%, 100% 100%, 0% 100%)' }}></div>
            </div>

            {/* ===== 7. AGENDA & EVENT ===== */}
            <section className="relative py-20 md:py-28 bg-ink-1 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-brand-ring/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 bg-brand-ring/20 text-brand-ring text-sm font-semibold rounded-full mb-4 border border-brand-ring/30">Agenda</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Agenda & Event Desa</h2>
                        <p className="text-ink-4 text-lg max-w-2xl mx-auto">
                            Kegiatan dan acara yang akan datang di Desa Muneng
                        </p>
                    </div>

                    {upcomingEvents && upcomingEvents.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            {upcomingEvents.slice(0, 6).map((event, idx) => (
                                <div
                                    key={event.id}
                                    className="bg-surface-1/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-surface-1/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-brand-ring rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                {event.category && (
                                                    <span className="px-2 py-0.5 bg-brand-ring/20 text-brand-ring text-xs font-medium rounded-full border border-brand-ring/30">
                                                        {event.category.name}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-white text-base mb-2 group-hover:text-brand-ring transition-colors truncate">
                                                {event.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-ink-4 text-sm mb-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {formatDate(event.event_date)}
                                            </div>
                                            <div className="flex items-center gap-2 text-ink-4 text-sm">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {event.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-surface-1/5 backdrop-blur-sm rounded-2xl border border-white/10 mb-10">
                            <svg className="w-16 h-16 text-ink-3 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-ink-4 text-lg">Belum ada agenda mendatang.</p>
                            <p className="text-ink-3 text-sm mt-2">Usulkan event untuk desa melalui form di bawah!</p>
                        </div>
                    )}

                    <div className="text-center">
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-surface-1 text-ink-1 font-semibold rounded-xl hover:bg-brand-soft transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Usulkan Event
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== ANGLED DIVIDER ===== */}
            <div className="relative h-20 bg-ink-1">
                <div className="absolute inset-0 bg-gradient-to-br from-ink-1 via-brand-strong to-ink-1" style={{ clipPath: 'polygon(0 40%, 100% 0%, 100% 100%, 0% 100%)' }}></div>
            </div>

            {/* ===== 8. KENANGAN TIMELINE ===== */}
            <section className="relative py-20 md:py-28 bg-gradient-to-br from-ink-1 via-brand-strong to-ink-1 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-20 right-20 opacity-10">
                    <svg className="w-48 h-48 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div className="absolute bottom-10 left-10 w-64 h-64 bg-teal-600/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-0 w-48 h-48 bg-brand-ring/10 rounded-full blur-2xl"></div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 bg-surface-1/10 text-brand-soft text-sm font-semibold rounded-full mb-4 border border-white/20">Kenangan</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Jejak Kenangan Desa</h2>
                        <p className="text-brand-soft text-lg max-w-2xl mx-auto">
                            Momen-momen berharga yang menjadi bagian dari sejarah Desa Muneng
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-surface-1/20 md:-translate-x-px"></div>

                        <div className="space-y-10">
                            {kenanganTimeline.map((item, idx) => (
                                <div key={idx} className={`relative flex items-start gap-6 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                    {/* Dot */}
                                    <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-amber-400 rounded-full border-4 border-brand-strong -translate-x-1/2 mt-2 z-10 shadow-lg shadow-amber-400/30"></div>

                                    {/* Content */}
                                    <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${idx % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                                        <div className="bg-surface-1/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-surface-1/15 transition-all duration-300">
                                            <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-300 text-sm font-bold rounded-full mb-3 border border-amber-400/30">
                                                {item.year}
                                            </span>
                                            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                            <p className="text-brand-soft/80 leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/memories"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-surface-1/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-surface-1/20 transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Lihat Semua Kenangan
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== WAVE DIVIDER ===== */}
            <div className="relative">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block bg-gradient-to-r from-ink-1 to-brand-strong">
                    <path d="M0 0V30C360 60 720 0 1080 30C1260 45 1380 50 1440 45V0H0Z" fill="#f9fafb" />
                </svg>
            </div>

            {/* ===== 9. BERITA TERBARU ===== */}
            <section className="relative py-20 md:py-28 bg-surface-2 overflow-hidden">
                {/* Subtle pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-14">
                        <div>
                            <span className="inline-block px-4 py-1.5 bg-brand-soft text-brand-strong text-sm font-semibold rounded-full mb-4">Informasi</span>
                            <h2 className="text-3xl md:text-5xl font-bold text-ink-1">Berita Terbaru</h2>
                        </div>
                        <Link
                            href="/announcements"
                            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-brand-strong font-semibold rounded-xl border-2 border-brand-soft hover:bg-brand-soft hover:border-brand-ring transition-all duration-300"
                        >
                            Semua Berita
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {latestAnnouncements && latestAnnouncements.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {latestAnnouncements.slice(0, 3).map((news) => (
                                <Link
                                    key={news.id}
                                    href={`/announcements/${news.slug}`}
                                    className="group bg-surface-1 rounded-xl overflow-hidden border border-line shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Image placeholder */}
                                    <div className="h-48 bg-gradient-to-br from-brand-ring to-brand relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300"></div>
                                        <div className="absolute bottom-3 left-3">
                                            <span className="px-3 py-1 bg-surface-1/90 backdrop-blur-sm text-brand-strong text-xs font-semibold rounded-full">
                                                {formatDate(news.published_at)}
                                            </span>
                                        </div>
                                        <div className="absolute top-4 right-4 w-10 h-10 bg-surface-1/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-ink-1 text-lg mb-2 group-hover:text-brand-strong transition-colors line-clamp-2">
                                            {news.title}
                                        </h3>
                                        <p className="text-ink-3 text-sm line-clamp-2 leading-relaxed">
                                            {news.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-surface-1 rounded-2xl border border-line shadow-sm">
                            <svg className="w-16 h-16 text-ink-4 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            <p className="text-ink-3 text-lg">Belum ada berita terbaru.</p>
                        </div>
                    )}

                    <div className="text-center mt-8 md:hidden">
                        <Link
                            href="/announcements"
                            className="inline-flex items-center gap-2 text-brand-strong font-semibold"
                        >
                            Semua Berita
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== 10. RUANG BERBAGI ===== */}
            <section id="ruang-berbagi" className="relative py-20 md:py-28 overflow-hidden">
                {/* Two-tone background */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-soft via-white to-white"></div>
                {/* Decorative megaphone SVG */}
                <div className="absolute -bottom-10 -right-10 opacity-[0.04]">
                    <svg className="w-[500px] h-[500px]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 8a3 3 0 013 3v2a3 3 0 01-3 3h-1.22l.305 1.222a3 3 0 01-2.9 3.778h-1.37a3 3 0 01-2.9-2.222L9.5 16H5a3 3 0 01-3-3v-2a3 3 0 013-3h4.5l1.415-2.83A3 3 0 0113.585 3h1.37a3 3 0 012.9 3.778L17.55 8H18z" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 bg-brand-soft text-brand-strong text-sm font-semibold rounded-full mb-4">Partisipasi</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-ink-1 mb-4">Ruang Berbagi</h2>
                        <p className="text-ink-3 text-lg max-w-2xl mx-auto">
                            Kirimkan informasi, cerita, atau kenangan Anda tentang Desa Muneng. Semua kiriman akan ditinjau oleh admin sebelum dipublikasikan.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Form */}
                        <div className="bg-surface-1 rounded-2xl p-6 md:p-8 border border-line shadow-lg">
                            {submitted && (
                                <div className="mb-6 bg-brand-soft border border-brand-soft rounded-xl p-4 flex items-center gap-3">
                                    <svg className="w-5 h-5 text-brand-strong flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-brand-strong text-sm font-medium">
                                        Terima kasih! Kiriman Anda telah diterima dan akan ditinjau oleh admin desa.
                                    </p>
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-ink-2 mb-2">Nama</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-ink-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-line focus:border-brand-ring focus:ring-2 focus:ring-brand-soft transition-all duration-200 text-base"
                                            placeholder="Nama Anda"
                                            required
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-ink-2 mb-2">Kategori</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-ink-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                        </div>
                                        <select
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-line focus:border-brand-ring focus:ring-2 focus:ring-brand-soft transition-all duration-200 text-base appearance-none bg-surface-1"
                                            required
                                        >
                                            <option value="">Pilih kategori...</option>
                                            <option value="info_event">Info Event</option>
                                            <option value="pengumuman">Pengumuman</option>
                                            <option value="umkm">UMKM</option>
                                            <option value="kenangan">Kenangan</option>
                                            <option value="lainnya">Lainnya</option>
                                        </select>
                                    </div>
                                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-ink-2 mb-2">Judul</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-ink-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-line focus:border-brand-ring focus:ring-2 focus:ring-brand-soft transition-all duration-200 text-base"
                                            placeholder="Judul kiriman"
                                            required
                                        />
                                    </div>
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-ink-2 mb-2">Isi Informasi</label>
                                    <textarea
                                        rows={5}
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl border border-line focus:border-brand-ring focus:ring-2 focus:ring-brand-soft transition-all duration-200 text-base resize-none"
                                        placeholder="Tulis informasi, cerita, atau kenangan Anda..."
                                        required
                                    />
                                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full px-6 py-4 bg-brand text-white font-bold text-lg rounded-xl hover:bg-brand-strong transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Kirim ke Admin Desa
                                        </>
                                    )}
                                </button>

                                <p className="text-ink-4 text-xs text-center">
                                    Kiriman Anda akan masuk antrian moderasi admin desa sebelum ditampilkan ke publik.
                                </p>
                            </form>
                        </div>

                        {/* Recent Submissions */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <svg className="w-6 h-6 text-brand-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                                <h3 className="text-xl font-bold text-ink-1">Kiriman Terbaru</h3>
                            </div>
                            {recentSubmissions && recentSubmissions.length > 0 ? (
                                <div className="space-y-4">
                                    {recentSubmissions.map((submission) => {
                                        const categoryColors: Record<string, string> = {
                                            'Info Event': 'border-l-blue-500 bg-blue-50/50',
                                            'Pengumuman': 'border-l-amber-500 bg-amber-50/50',
                                            'UMKM': 'border-l-purple-500 bg-purple-50/50',
                                            'Kenangan': 'border-l-rose-500 bg-rose-50/50',
                                            'Lainnya': 'border-l-ink-3 bg-surface-2/50',
                                        };
                                        const colorClass = categoryColors[submission.category] || categoryColors['Lainnya'];
                                        return (
                                            <div
                                                key={submission.id}
                                                className={`rounded-xl p-5 border border-line border-l-4 ${colorClass} hover:shadow-md transition-all duration-300`}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2.5 py-0.5 bg-surface-1 text-ink-2 text-xs font-semibold rounded-full border border-line">
                                                        {submission.category}
                                                    </span>
                                                    <span className="text-ink-4 text-xs">
                                                        {formatDate(submission.created_at)}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-ink-1 mb-1">{submission.title}</h4>
                                                <p className="text-ink-3 text-sm line-clamp-2 leading-relaxed">{submission.content}</p>
                                                <p className="text-ink-4 text-xs mt-2 font-medium">— {submission.name}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-surface-1 rounded-2xl p-10 border border-line text-center shadow-sm">
                                    <svg className="w-12 h-12 text-ink-4 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p className="text-ink-3 font-medium">Belum ada kiriman yang dipublikasikan.</p>
                                    <p className="text-ink-4 text-sm mt-1">Jadilah yang pertama berbagi!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
