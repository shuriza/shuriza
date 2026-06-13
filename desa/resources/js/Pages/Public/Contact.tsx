import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { FormEventHandler, useState } from 'react';

interface ContactProps {
    villageInfo: Array<{ key: string; value: string; label: string }>;
}

export default function Contact({ villageInfo = [] }: ContactProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/kontak', {
            onSuccess: () => {
                reset();
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 5000);
            },
        });
    };

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const getInfoValue = (key: string): string => {
        const item = villageInfo.find((i) => i.key === key);
        return item?.value || '-';
    };

    const faqs = [
        {
            question: 'Apakah website ini resmi dari pemerintah desa?',
            answer: 'Tidak. Website ini dibuat secara independen oleh warga Desa Muneng untuk berbagi informasi dan kenangan tentang desa. Bukan website resmi pemerintah desa.',
        },
        {
            question: 'Bagaimana cara mengirimkan kenangan atau foto?',
            answer: 'Anda bisa mengirimkan kenangan melalui halaman "Bagikan Kenangan" yang tersedia di menu navigasi. Cukup isi formulir dan kirimkan link video atau foto Anda.',
        },
        {
            question: 'Bagaimana cara menghubungi perangkat desa?',
            answer: 'Untuk urusan administrasi resmi, silakan datang langsung ke Kantor Desa Muneng pada jam kerja (Senin-Jumat, 08.00-15.00 WIB). Anda juga bisa menghubungi melalui nomor telepon yang tertera di halaman ini.',
        },
        {
            question: 'Apakah informasi di website ini akurat?',
            answer: 'Kami berusaha menyajikan informasi yang akurat berdasarkan data yang tersedia. Namun untuk keperluan resmi, silakan konfirmasi langsung ke kantor desa.',
        },
    ];

    return (
        <PublicLayout>
            <Head title="Hubungi Kami - Desa Muneng" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-24 md:py-32 overflow-hidden">
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 border border-white/30 rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 border border-white/20 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full"></div>
                </div>
                {/* Dot pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                {/* Decorative SVG icons */}
                <div className="absolute top-12 right-12 opacity-10">
                    <svg className="w-48 h-48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <div className="absolute bottom-12 left-12 opacity-10">
                    <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-surface-1/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium">Kontak</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                        Hubungi Kami
                    </h1>
                    <p className="text-lg md:text-xl text-emerald-200 max-w-2xl mx-auto">
                        Ada pertanyaan atau saran? Jangan ragu untuk menghubungi kami
                    </p>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16 md:py-20 bg-surface-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left: Contact Form */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-12 bg-gradient-to-b from-brand-ring to-teal-500 rounded-full"></div>
                                <div>
                                    <h2 className="text-2xl font-bold text-ink-1">Kirim Pesan</h2>
                                    <p className="text-brand-strong text-sm font-medium mt-1">Kami akan merespon secepatnya</p>
                                </div>
                            </div>

                            {submitted && (
                                <div className="mb-6 p-4 bg-brand-soft border border-emerald-200 rounded-xl flex items-center gap-3">
                                    <div className="w-8 h-8 bg-brand-soft rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-brand-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-emerald-800 font-medium">
                                        Pesan Anda berhasil dikirim! Terima kasih telah menghubungi kami.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="bg-surface-1 rounded-2xl border border-line shadow-sm p-6 space-y-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-ink-2 mb-1.5">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-ink-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full pl-11 pr-4 py-2.5 border border-line-strong rounded-lg focus:ring-2 focus:ring-brand-ring focus:border-brand transition-colors"
                                            placeholder="Masukkan nama Anda"
                                        />
                                    </div>
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-ink-2 mb-1.5">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-ink-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full pl-11 pr-4 py-2.5 border border-line-strong rounded-lg focus:ring-2 focus:ring-brand-ring focus:border-brand transition-colors"
                                            placeholder="contoh@email.com"
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-ink-2 mb-1.5">
                                        Subjek <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-ink-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="subject"
                                            type="text"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            className="w-full pl-11 pr-4 py-2.5 border border-line-strong rounded-lg focus:ring-2 focus:ring-brand-ring focus:border-brand transition-colors"
                                            placeholder="Subjek pesan"
                                        />
                                    </div>
                                    {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-ink-2 mb-1.5">
                                        Pesan <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3.5 pointer-events-none">
                                            <svg className="w-5 h-5 text-ink-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </div>
                                        <textarea
                                            id="message"
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            rows={5}
                                            className="w-full pl-11 pr-4 py-2.5 border border-line-strong rounded-lg focus:ring-2 focus:ring-brand-ring focus:border-brand transition-colors resize-y"
                                            placeholder="Tulis pesan Anda di sini..."
                                        />
                                    </div>
                                    {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-brand rounded-lg hover:bg-brand-strong transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Kirim Pesan
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Right: Info Cards */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-12 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></div>
                                <div>
                                    <h2 className="text-2xl font-bold text-ink-1">Informasi Kontak</h2>
                                    <p className="text-teal-600 text-sm font-medium mt-1">Desa Muneng, Kec. Purwoasri</p>
                                </div>
                            </div>

                            {/* Info Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-2xl p-5 text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute -top-4 -right-4 w-24 h-24 border border-white/30 rounded-full"></div>
                                    </div>
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-surface-1/10 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-sm font-medium text-emerald-200 mb-1">Alamat</h3>
                                        <p className="text-white font-semibold text-sm leading-relaxed">
                                            Desa Muneng, Kec. Purwoasri, Kab. Kediri, Jawa Timur 64154
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-teal-900 to-cyan-900 rounded-2xl p-5 text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute -top-4 -right-4 w-24 h-24 border border-white/30 rounded-full"></div>
                                    </div>
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-surface-1/10 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-sm font-medium text-teal-200 mb-1">Telepon</h3>
                                        <p className="text-white font-semibold text-sm">
                                            {getInfoValue('telepon')}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-cyan-900 to-emerald-900 rounded-2xl p-5 text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute -top-4 -right-4 w-24 h-24 border border-white/30 rounded-full"></div>
                                    </div>
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-surface-1/10 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-sm font-medium text-cyan-200 mb-1">Email</h3>
                                        <p className="text-white font-semibold text-sm">
                                            {getInfoValue('email')}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-emerald-800 to-teal-800 rounded-2xl p-5 text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute -top-4 -right-4 w-24 h-24 border border-white/30 rounded-full"></div>
                                    </div>
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-surface-1/10 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-sm font-medium text-emerald-200 mb-1">Jam Kerja</h3>
                                        <p className="text-white font-semibold text-sm">
                                            Senin - Jumat<br />08.00 - 15.00 WIB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="rounded-2xl overflow-hidden border border-line shadow-sm">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2690.6447810900795!2d112.10396155214359!3d-7.6256617763219126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78469e782d258f%3A0x46a17eb93e3ee5f4!2sMuneng%2C%20Kec.%20Purwoasri%2C%20Kabupaten%20Kediri%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1778240753891!5m2!1sid!2sid"
                                    className="w-full h-64 border-0"
                                    loading="lazy"
                                    title="Peta Desa Muneng"
                                ></iframe>
                                <div className="bg-surface-2 px-4 py-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-brand-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-sm text-ink-3">Desa Muneng, Kec. Purwoasri, Kab. Kediri</span>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="bg-surface-2 rounded-2xl p-6 border border-line">
                                <h3 className="text-lg font-semibold text-ink-1 mb-4">Media Sosial</h3>
                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-1 rounded-xl border border-line text-sm font-medium text-ink-2 hover:border-emerald-300 hover:text-brand-strong hover:shadow-sm transition-all duration-200"
                                    >
                                        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                        Facebook
                                    </a>
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-1 rounded-xl border border-line text-sm font-medium text-ink-2 hover:border-emerald-300 hover:text-brand-strong hover:shadow-sm transition-all duration-200"
                                    >
                                        <svg className="w-5 h-5 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                        </svg>
                                        Instagram
                                    </a>
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-1 rounded-xl border border-line text-sm font-medium text-ink-2 hover:border-emerald-300 hover:text-brand-strong hover:shadow-sm transition-all duration-200"
                                    >
                                        <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                        </svg>
                                        YouTube
                                    </a>
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-1 rounded-xl border border-line text-sm font-medium text-ink-2 hover:border-emerald-300 hover:text-brand-strong hover:shadow-sm transition-all duration-200"
                                    >
                                        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 md:py-20 bg-surface-2">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-ink-1 mb-2">Pertanyaan yang Sering Diajukan</h2>
                        <div className="w-20 h-1 bg-brand mx-auto rounded-full"></div>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-surface-1 rounded-xl border border-line shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                                >
                                    <span className="text-sm font-semibold text-ink-1 pr-4">{faq.question}</span>
                                    <svg
                                        className={`w-5 h-5 text-brand-strong flex-shrink-0 transition-transform duration-300 ${
                                            openFaq === index ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${
                                        openFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="px-6 pb-4">
                                        <p className="text-sm text-ink-3 leading-relaxed">{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
