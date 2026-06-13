import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface InfoItem {
    key: string;
    label: string;
    value: string;
}

interface ProfilDesaProps {
    sejarah: string | null;
    deskripsi: string | null;
    visi: string | null;
    misi: string | null;
    profil: InfoItem[];
    demografi: InfoItem[];
    geografi: InfoItem[];
    pemerintahan: InfoItem[];
    latitude: string | null;
    longitude: string | null;
}

export default function ProfilDesa({ sejarah, deskripsi, visi, misi, profil, demografi, geografi, pemerintahan, latitude, longitude }: ProfilDesaProps) {
    // Gunakan Google Maps embed yang sudah terverifikasi
    const mapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2690.6447810900795!2d112.10396155214359!3d-7.6256617763219126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78469e782d258f%3A0x46a17eb93e3ee5f4!2sMuneng%2C%20Kec.%20Purwoasri%2C%20Kabupaten%20Kediri%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1778240753891!5m2!1sid!2sid';

    return (
        <PublicLayout>
            <Head title="Profil Desa - Desa Muneng" />

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
                {/* Decorative SVG icon */}
                <div className="absolute top-12 right-12 opacity-10">
                    <svg className="w-48 h-48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <div className="absolute bottom-12 left-12 opacity-10">
                    <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-surface-1/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-sm font-medium">Profil Desa</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">Profil Desa Muneng</h1>
                    <p className="text-lg md:text-xl text-brand-soft max-w-2xl mx-auto">
                        Kecamatan Purwoasri, Kabupaten Kediri, Jawa Timur
                    </p>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Tentang Section */}
            <section className="py-16 md:py-20 bg-surface-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-12 bg-gradient-to-b from-brand-ring to-teal-500 rounded-full"></div>
                                <div>
                                    <h2 className="text-3xl font-bold text-ink-1">Tentang Desa Muneng</h2>
                                    <p className="text-brand-strong text-sm font-medium mt-1">Sejarah & Deskripsi</p>
                                </div>
                            </div>
                            {deskripsi && (
                                <p className="text-ink-2 leading-relaxed text-lg mb-6">{deskripsi}</p>
                            )}
                            {sejarah && (
                                <p className="text-ink-3 leading-relaxed">{sejarah}</p>
                            )}
                        </div>

                        {/* Quick Facts Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="group bg-surface-1 rounded-2xl p-6 border-l-4 border-brand-ring shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="w-10 h-10 bg-brand-soft rounded-lg flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5 text-brand-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </div>
                                <div className="text-2xl font-bold text-ink-1">267 ha</div>
                                <div className="text-sm text-ink-3 mt-1">Luas Wilayah</div>
                            </div>
                            <div className="group bg-surface-1 rounded-2xl p-6 border-l-4 border-teal-500 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="text-2xl font-bold text-ink-1">1.808</div>
                                <div className="text-sm text-ink-3 mt-1">Jumlah Penduduk</div>
                            </div>
                            <div className="group bg-surface-1 rounded-2xl p-6 border-l-4 border-cyan-500 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="text-2xl font-bold text-ink-1">24 km</div>
                                <div className="text-sm text-ink-3 mt-1">dari Kota Kediri</div>
                            </div>
                            <div className="group bg-surface-1 rounded-2xl p-6 border-l-4 border-emerald-400 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="w-10 h-10 bg-brand-soft rounded-lg flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5 text-brand-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                <div className="text-2xl font-bold text-ink-1">100 km</div>
                                <div className="text-sm text-ink-3 mt-1">dari Surabaya</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section - Dark Background */}
            <section className="relative py-16 md:py-20 bg-gradient-to-br from-emerald-900 to-teal-900 overflow-hidden">
                {/* Decorative dots */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white mb-2">Lokasi Desa Muneng</h2>
                        <div className="w-20 h-1 bg-emerald-400 mx-auto rounded-full"></div>
                        <p className="text-brand-soft mt-4">Koordinat: 7°37'32"S 112°6'14"E</p>
                    </div>
                    <div className="bg-surface-1/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 max-w-4xl mx-auto">
                        {mapUrl ? (
                            <div className="rounded-xl overflow-hidden">
                                <iframe
                                    src={mapUrl}
                                    className="w-full h-80 md:h-[450px]"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            </div>
                        ) : (
                            <div className="w-full h-80 bg-surface-1/5 rounded-xl flex items-center justify-center">
                                <p className="text-brand-soft">Peta tidak tersedia</p>
                            </div>
                        )}
                    </div>
                    <div className="text-center mt-6">
                        <a
                            href="https://maps.app.goo.gl/8Y89T3eMxZdmYyNeA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-surface-1/10 backdrop-blur-sm border border-white/20 text-white hover:bg-surface-1/20 px-5 py-2.5 rounded-full transition-all duration-300 font-medium text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Buka di Google Maps
                        </a>
                    </div>
                </div>
            </section>

            {/* Geografi & Akses */}
            {geografi && geografi.length > 0 && (
                <section className="py-16 md:py-20 bg-surface-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-ink-1 mb-2">Geografi & Akses</h2>
                            <div className="w-20 h-1 bg-brand-ring mx-auto rounded-full"></div>
                            <p className="text-ink-3 mt-4">Lokasi strategis Desa Muneng</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {geografi.filter(item => item.key !== 'desa_tetangga').map((item) => (
                                <div
                                    key={item.key}
                                    className="bg-surface-1 rounded-xl p-6 border-l-4 border-brand-ring shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-brand-soft rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-brand-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm text-ink-3 font-medium">{item.label}</div>
                                            <div className="text-ink-1 font-semibold mt-1">{item.value}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desa Tetangga */}
                        {geografi.find(item => item.key === 'desa_tetangga') && (
                            <div className="mt-8 bg-surface-1 rounded-2xl p-6 border border-line shadow-sm">
                                <h3 className="text-lg font-bold text-ink-1 mb-4">Desa Lain di Kecamatan Purwoasri</h3>
                                <div className="flex flex-wrap gap-2">
                                    {geografi.find(item => item.key === 'desa_tetangga')?.value.split(', ').map((desa) => (
                                        <span
                                            key={desa}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                                                desa === 'Muneng'
                                                    ? 'bg-brand text-white shadow-md'
                                                    : 'bg-surface-3 text-ink-2 hover:bg-brand-soft hover:text-brand-strong'
                                            } transition-colors`}
                                        >
                                            {desa}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Visi & Misi */}
            <section className="py-16 md:py-20 bg-surface-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-ink-1 mb-2">Visi & Misi</h2>
                        <div className="w-20 h-1 bg-brand-ring mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Visi */}
                        <div className="relative bg-gradient-to-br from-brand to-teal-700 rounded-2xl p-8 text-white overflow-hidden">
                            <div className="absolute top-0 right-0 opacity-10">
                                <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-surface-1/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold">Visi</h3>
                                </div>
                                {visi && (
                                    <p className="text-brand-soft leading-relaxed text-lg italic">"{visi}"</p>
                                )}
                            </div>
                        </div>

                        {/* Misi */}
                        <div className="bg-surface-1 rounded-2xl p-8 shadow-md border border-line">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-brand-soft rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-brand-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-ink-1">Misi</h3>
                            </div>
                            {misi && (
                                <div className="space-y-4">
                                    {misi.split('\n').map((item, index) => (
                                        <div key={index} className="flex items-start gap-3 group">
                                            <div className="w-8 h-8 bg-gradient-to-br from-brand-ring to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm group-hover:scale-110 transition-transform">
                                                <span className="text-xs font-bold text-white">{index + 1}</span>
                                            </div>
                                            <p className="text-ink-2 leading-relaxed">{item.replace(/^\d+\.\s*/, '')}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Administratif */}
            {profil && profil.length > 0 && (
                <section className="py-16 md:py-20 bg-surface-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-ink-1 mb-2">Data Administratif</h2>
                            <div className="w-20 h-1 bg-brand-ring mx-auto rounded-full"></div>
                        </div>
                        <div className="bg-surface-1 rounded-2xl shadow-sm border border-line overflow-hidden max-w-4xl mx-auto">
                            <div className="divide-y divide-line-subtle">
                                {profil.filter(item => !['latitude', 'longitude'].includes(item.key)).map((item, index) => (
                                    <div key={item.key} className={`flex items-center px-6 py-4 hover:bg-brand-soft/50 transition-colors ${index % 2 === 0 ? 'bg-surface-1' : 'bg-surface-2/50'}`}>
                                        <div className="w-10 h-10 bg-brand-soft rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                                            <svg className="w-5 h-5 text-brand-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm text-ink-3 font-medium">{item.label}</div>
                                            <div className="text-ink-1 font-semibold">{item.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Demografi - Dark Section */}
            {demografi && demografi.length > 0 && (
                <section className="relative py-16 md:py-20 bg-gradient-to-br from-emerald-900 to-teal-900 overflow-hidden">
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-2">Demografi</h2>
                            <div className="w-20 h-1 bg-emerald-400 mx-auto rounded-full"></div>
                            <p className="text-brand-soft mt-4">Data kependudukan Desa Muneng</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                            {demografi.map((item) => (
                                <div
                                    key={item.key}
                                    className="bg-surface-1/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center hover:bg-surface-1/15 hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                                        {item.value}
                                    </div>
                                    <div className="text-sm text-brand-soft font-medium">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Pemerintahan */}
            {pemerintahan && pemerintahan.length > 0 && (
                <section className="py-16 md:py-20 bg-surface-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-ink-1 mb-2">Pemerintahan Desa</h2>
                            <div className="w-20 h-1 bg-brand-ring mx-auto rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pemerintahan.map((item, index) => (
                                <div
                                    key={item.key}
                                    className="bg-surface-1 rounded-2xl p-6 border border-line hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group"
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto bg-gradient-to-br ${
                                        index % 3 === 0 ? 'from-emerald-400 to-teal-500' :
                                        index % 3 === 1 ? 'from-teal-400 to-cyan-500' :
                                        'from-cyan-400 to-brand-ring'
                                    } shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="text-lg font-bold text-ink-1 mb-1">{item.value || '-'}</div>
                                    <div className="text-sm text-brand-strong font-medium">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Sumber Data */}
            <section className="py-8 bg-surface-1 border-t border-line">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm text-ink-3">
                        Sumber data: <a href="https://id.wikipedia.org/wiki/Muneng,_Purwoasri,_Kediri" target="_blank" rel="noopener noreferrer" className="text-brand-strong hover:underline">Wikipedia - Muneng, Purwoasri, Kediri</a>
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
