import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState } from 'react';

interface Memory {
    id: number;
    title: string;
    description?: string;
    type: 'video' | 'photo';
    platform: 'youtube' | 'tiktok' | 'facebook' | 'instagram' | 'upload';
    source_url: string;
    thumbnail_url?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description?: string;
    category: string;
    price?: number;
    image?: string;
    status: string;
    is_available: boolean;
    created_at: string;
}

interface Stats {
    totalMemories: number;
    approvedMemories: number;
    pendingMemories: number;
    totalProducts: number;
}

interface UserDashboardProps {
    myMemories: Memory[];
    myProducts: Product[];
    stats: Stats;
    auth: { user: { id: number; name: string; email: string } };
}

export default function UserDashboard({ myMemories, myProducts, stats, auth }: UserDashboardProps) {
    const [activeTab, setActiveTab] = useState<'kenangan' | 'produk'>('kenangan');

    const statusBadge = (status: string) => {
        switch (status) {
            case 'approved':
            case 'published':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-soft text-emerald-800">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Disetujui
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Menunggu
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Ditolak
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-3 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    const platformIcon = (platform: string) => {
        switch (platform) {
            case 'youtube':
                return <span className="text-red-500 text-xs font-medium">YouTube</span>;
            case 'tiktok':
                return <span className="text-gray-800 text-xs font-medium">TikTok</span>;
            case 'facebook':
                return <span className="text-blue-600 text-xs font-medium">Facebook</span>;
            case 'instagram':
                return <span className="text-pink-500 text-xs font-medium">Instagram</span>;
            default:
                return <span className="text-ink-3 text-xs font-medium">Upload</span>;
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const statCards = [
        {
            label: 'Total Kenangan',
            value: stats.totalMemories,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            color: 'bg-brand-soft text-brand-strong',
        },
        {
            label: 'Disetujui',
            value: stats.approvedMemories,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-green-50 text-green-600',
        },
        {
            label: 'Menunggu',
            value: stats.pendingMemories,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-yellow-50 text-yellow-600',
        },
        {
            label: 'Total Produk',
            value: stats.totalProducts,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            color: 'bg-teal-50 text-teal-600',
        },
    ];

    return (
        <PublicLayout>
            <Head title="Dashboard Saya - Desa Muneng" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-20 md:py-28 overflow-hidden">
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 border border-white/30 rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 border border-white/20 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full"></div>
                </div>
                {/* Dot pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                {/* Decorative SVG */}
                <div className="absolute top-12 right-12 opacity-10">
                    <svg className="w-48 h-48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div className="absolute bottom-12 left-12 opacity-10">
                    <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* User avatar */}
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-1/10 backdrop-blur-sm border border-white/20 mb-6">
                        <svg className="w-10 h-10 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Dashboard Saya</h1>
                    <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
                        Selamat datang, <span className="font-semibold text-white">{auth.user.name}</span>
                    </p>
                </div>
            </section>

            {/* Stats Cards */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-surface-1 rounded-2xl shadow-lg border border-line p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} mb-3`}>
                                {stat.icon}
                            </div>
                            <p className="text-2xl md:text-3xl font-bold text-ink-1">{stat.value}</p>
                            <p className="text-sm text-ink-3 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tabs & Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Tab Buttons */}
                <div className="flex items-center gap-2 mb-8 border-b border-line">
                    <button
                        onClick={() => setActiveTab('kenangan')}
                        className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                            activeTab === 'kenangan'
                                ? 'border-emerald-600 text-brand-strong'
                                : 'border-transparent text-ink-3 hover:text-ink-2 hover:border-gray-300'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Kenangan Saya
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('produk')}
                        className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                            activeTab === 'produk'
                                ? 'border-emerald-600 text-brand-strong'
                                : 'border-transparent text-ink-3 hover:text-ink-2 hover:border-gray-300'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            Produk Saya
                        </span>
                    </button>
                </div>

                {/* Kenangan Tab */}
                {activeTab === 'kenangan' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-ink-1">Kenangan Saya</h2>
                            <Link
                                href="/kenangan/submit"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-medium rounded-xl hover:bg-brand-strong transition-colors duration-200 shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Kirim Kenangan Baru
                            </Link>
                        </div>

                        {myMemories.length === 0 ? (
                            <div className="text-center py-16 bg-surface-1 rounded-2xl border border-line">
                                <svg className="w-16 h-16 text-ink-4 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-ink-3 mb-4">Anda belum mengirimkan kenangan apapun.</p>
                                <Link
                                    href="/kenangan/submit"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white text-sm font-medium rounded-xl hover:bg-brand-strong transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Kirim Kenangan Pertama
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myMemories.map((memory) => (
                                    <div
                                        key={memory.id}
                                        className="bg-surface-1 rounded-2xl border border-line p-5 hover:shadow-lg transition-all duration-300 hover:border-brand-soft"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-base font-semibold text-ink-1 truncate">
                                                        {memory.title}
                                                    </h3>
                                                    {statusBadge(memory.status)}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-ink-3">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {formatDate(memory.created_at)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
                                                        </svg>
                                                        {platformIcon(memory.platform)}
                                                    </span>
                                                    <span className="capitalize text-ink-4">{memory.type}</span>
                                                </div>
                                            </div>
                                            {memory.thumbnail_url && (
                                                <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-surface-3">
                                                    <img
                                                        src={memory.thumbnail_url}
                                                        alt={memory.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Produk Tab */}
                {activeTab === 'produk' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-ink-1">Produk Saya</h2>
                            <Link
                                href="/umkm/submit"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-medium rounded-xl hover:bg-brand-strong transition-colors duration-200 shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Produk Baru
                            </Link>
                        </div>

                        {myProducts.length === 0 ? (
                            <div className="text-center py-16 bg-surface-1 rounded-2xl border border-line">
                                <svg className="w-16 h-16 text-ink-4 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <p className="text-ink-3 mb-4">Anda belum mendaftarkan produk apapun.</p>
                                <Link
                                    href="/umkm/submit"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white text-sm font-medium rounded-xl hover:bg-brand-strong transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Daftarkan Produk Pertama
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="bg-surface-1 rounded-2xl border border-line p-5 hover:shadow-lg transition-all duration-300 hover:border-brand-soft"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-base font-semibold text-ink-1 truncate">
                                                        {product.name}
                                                    </h3>
                                                    {statusBadge(product.status)}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-ink-3">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {formatDate(product.created_at)}
                                                    </span>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-surface-3 text-ink-3 capitalize">
                                                        {product.category}
                                                    </span>
                                                    {product.price !== undefined && product.price !== null && (
                                                        <span className="text-brand-strong font-medium">
                                                            Rp {Number(product.price).toLocaleString('id-ID')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {product.image && (
                                                <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-surface-3">
                                                    <img
                                                        src={`/storage/${product.image}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
