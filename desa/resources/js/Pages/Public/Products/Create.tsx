import { Head, useForm, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { FormEventHandler } from 'react';

interface ProductForm {
    name: string;
    description: string;
    price: string;
    price_note: string;
    category: string;
    contact_name: string;
    contact_phone: string;
    contact_whatsapp: string;
    image: File | null;
}

export default function ProductCreate() {
    const { data, setData, post, processing, errors, reset } = useForm<ProductForm>({
        name: '',
        description: '',
        price: '',
        price_note: '',
        category: '',
        contact_name: '',
        contact_phone: '',
        contact_whatsapp: '',
        image: null,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/umkm/submit', {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const categories = [
        { value: 'makanan', label: 'Makanan' },
        { value: 'minuman', label: 'Minuman' },
        { value: 'kerajinan', label: 'Kerajinan' },
        { value: 'pertanian', label: 'Pertanian' },
        { value: 'jasa', label: 'Jasa' },
        { value: 'lainnya', label: 'Lainnya' },
    ];

    return (
        <PublicLayout>
            <Head title="Daftarkan Produk - UMKM Desa Muneng" />

            {/* ===== HERO SECTION (shorter) ===== */}
            <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="absolute top-10 left-10 w-72 h-72 bg-teal-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-56 h-56 bg-brand/15 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-1/10 backdrop-blur-sm border border-white/20 text-emerald-200 text-sm font-medium mb-6">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Daftarkan Produk
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
                        Daftarkan Produk Anda
                    </h1>
                    <p className="text-lg text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
                        Promosikan produk atau jasa Anda kepada warga Desa Muneng dan sekitarnya
                    </p>
                </div>
            </section>

            {/* Wave Divider */}
            <div className="relative -mt-1">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
                    <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#f9fafb" />
                </svg>
            </div>

            {/* ===== FORM SECTION ===== */}
            <section className="py-16 md:py-24 bg-surface-2">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Info notice */}
                    <div className="mb-8 p-4 bg-brand-soft border border-brand-soft rounded-xl">
                        <div className="flex gap-3">
                            <svg className="w-5 h-5 text-brand-strong flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-emerald-800">
                                <p className="font-semibold mb-1">Informasi</p>
                                <p>Produk yang didaftarkan akan ditinjau oleh admin terlebih dahulu sebelum ditampilkan di halaman UMKM. Tidak perlu login untuk mendaftarkan produk.</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-surface-1 rounded-2xl shadow-sm border border-line p-6 sm:p-8 space-y-6">
                        {/* Product Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-ink-2 mb-2">
                                Nama Produk / Jasa <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3 border border-line rounded-xl focus:ring-2 focus:ring-brand-ring focus:border-brand transition-colors"
                                placeholder="Contoh: Keripik Singkong Bu Sari"
                            />
                            {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-ink-2 mb-2">
                                Deskripsi
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-line rounded-xl focus:ring-2 focus:ring-brand-ring focus:border-brand transition-colors resize-none"
                                placeholder="Jelaskan produk atau jasa Anda..."
                            />
                            {errors.description && <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        {/* Price & Price Note */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-semibold text-ink-2 mb-2">
                                    Harga (Rp)
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="w-full px-4 py-3 border border-line rounded-xl focus:ring-2 focus:ring-brand-ring focus:border-brand transition-colors"
                                    placeholder="15000"
                                    min="0"
                                />
                                <p className="mt-1 text-xs text-ink-4">Kosongkan jika harga nego/hubungi langsung</p>
                                {errors.price && <p className="mt-1.5 text-sm text-red-600">{errors.price}</p>}
                            </div>
                            <div>
                                <label htmlFor="price_note" className="block text-sm font-semibold text-ink-2 mb-2">
                                    Keterangan Harga
                                </label>
                                <input
                                    id="price_note"
                                    type="text"
                                    value={data.price_note}
                                    onChange={(e) => setData('price_note', e.target.value)}
                                    className="w-full px-4 py-3 border border-line rounded-xl focus:ring-2 focus:ring-brand-ring focus:border-brand transition-colors"
                                    placeholder="per kg, per bungkus, nego"
                                />
                                {errors.price_note && <p className="mt-1.5 text-sm text-red-600">{errors.price_note}</p>}
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-ink-2 mb-2">
                                Kategori <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="category"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="w-full px-4 py-3 border border-line rounded-xl focus:ring-2 focus:ring-brand-ring focus:border-brand transition-colors"
                            >
                                <option value="">Pilih kategori...</option>
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                            {errors.category && <p className="mt-1.5 text-sm text-red-600">{errors.category}</p>}
                        </div>

                        {/* Image */}
                        <div>
                            <label htmlFor="image" className="block text-sm font-semibold text-ink-2 mb-2">
                                Foto Produk
                            </label>
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                className="w-full px-4 py-3 border border-line rounded-xl focus:ring-2 focus:ring-brand-ring focus:border-brand transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-soft file:text-brand-strong hover:file:bg-brand-soft"
                            />
                            <p className="mt-1 text-xs text-ink-4">Format: JPG, PNG. Maksimal 2MB</p>
                            {errors.image && <p className="mt-1.5 text-sm text-red-600">{errors.image}</p>}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-line pt-6">
                            <h3 className="text-base font-bold text-ink-1 mb-4">Informasi Kontak</h3>
                        </div>

                        {/* Contact Name */}
                        <div>
                            <label htmlFor="contact_name" className="block text-sm font-semibold text-ink-2 mb-2">
                                Nama Penjual <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="contact_name"
                                type="text"
                                value={data.contact_name}
                                onChange={(e) => setData('contact_name', e.target.value)}
                                className="w-full px-4 py-3 border border-line rounded-xl focus:ring-2 focus:ring-brand-ring focus:border-brand transition-colors"
                                placeholder="Nama Anda"
                            />
                            {errors.contact_name && <p className="mt-1.5 text-sm text-red-600">{errors.contact_name}</p>}
                        </div>

                        {/* Contact Phone & WhatsApp */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="contact_phone" className="block text-sm font-semibold text-ink-2 mb-2">
                                    No. Telepon
                                </label>
                                <input
                                    id="contact_phone"
                                    type="tel"
                                    value={data.contact_phone}
                                    onChange={(e) => setData('contact_phone', e.target.value)}
                                    className="w-full px-4 py-3 border border-line rounded-xl focus:ring-2 focus:ring-brand-ring focus:border-brand transition-colors"
                                    placeholder="081234567890"
                                />
                                {errors.contact_phone && <p className="mt-1.5 text-sm text-red-600">{errors.contact_phone}</p>}
                            </div>
                            <div>
                                <label htmlFor="contact_whatsapp" className="block text-sm font-semibold text-ink-2 mb-2">
                                    No. WhatsApp
                                </label>
                                <input
                                    id="contact_whatsapp"
                                    type="tel"
                                    value={data.contact_whatsapp}
                                    onChange={(e) => setData('contact_whatsapp', e.target.value)}
                                    className="w-full px-4 py-3 border border-line rounded-xl focus:ring-2 focus:ring-brand-ring focus:border-brand transition-colors"
                                    placeholder="081234567890"
                                />
                                {errors.contact_whatsapp && <p className="mt-1.5 text-sm text-red-600">{errors.contact_whatsapp}</p>}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-brand to-teal-600 text-white font-semibold rounded-xl hover:from-brand-strong hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
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
                                        Kirim Produk
                                    </>
                                )}
                            </button>
                            <Link
                                href="/umkm"
                                className="px-6 py-3 text-ink-3 font-medium hover:text-ink-1 transition-colors"
                            >
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </section>
        </PublicLayout>
    );
}
