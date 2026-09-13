import { Link } from '@inertiajs/react';

interface ErrorPageProps {
    status: number;
}

const errorMessages: Record<number, { title: string; description: string }> = {
    403: {
        title: 'Akses Ditolak',
        description: 'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.',
    },
    404: {
        title: 'Halaman Tidak Ditemukan',
        description: 'Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman telah dipindahkan atau dihapus.',
    },
    500: {
        title: 'Kesalahan Server',
        description: 'Maaf, terjadi kesalahan pada server kami. Silakan coba lagi nanti.',
    },
};

export default function Error({ status }: ErrorPageProps) {
    const error = errorMessages[status] || errorMessages[404];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                {/* Village Illustration */}
                <div className="mb-8">
                    <div className="relative inline-block">
                        {/* Background circle */}
                        <div className="w-40 h-40 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                            {/* House/Village icon */}
                            <svg className="w-20 h-20 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-200 rounded-full animate-pulse" />
                        <div className="absolute -bottom-1 -left-3 w-4 h-4 bg-emerald-300 rounded-full animate-pulse delay-300" />
                        <div className="absolute top-4 -left-4 w-3 h-3 bg-emerald-200 rounded-full animate-pulse delay-700" />
                    </div>
                </div>

                {/* Error Code */}
                <h1 className="text-7xl font-bold text-emerald-600 mb-2">{status}</h1>

                {/* Error Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-3">{error.title}</h2>

                {/* Error Description */}
                <p className="text-gray-600 mb-8 leading-relaxed">{error.description}</p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors duration-200 shadow-lg shadow-emerald-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Kembali ke Beranda
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Halaman Sebelumnya
                    </button>
                </div>

                {/* Footer note */}
                <p className="mt-12 text-sm text-gray-400">
                    Desa Muneng &mdash; Website Resmi
                </p>
            </div>
        </div>
    );
}
