import { Link } from '@inertiajs/react';
import { MapPin, Info, Plus, Sprout } from 'lucide-react';
import Container from '@/Components/ui/Container';
import { navLinks } from './navLinks';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative bg-emerald-950 text-white">
            <div
                className="absolute inset-x-0 top-0 h-2/3 pointer-events-none opacity-50"
                style={{
                    backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                }}
                aria-hidden
            />
            <Container>
                <div className="relative py-12 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
                                    <Sprout className="h-5 w-5 text-white" aria-hidden />
                                </span>
                                <span className="text-lg font-extrabold tracking-tight">Desa Muneng</span>
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Dibuat oleh warga, untuk warga. Tempat berbagi kenangan, informasi acara, dan keindahan
                                Desa Muneng, Kecamatan Purwoasri, Kabupaten Kediri.
                            </p>
                            <p className="mt-3 text-xs text-zinc-400">
                                24 km utara Kota Kediri &bull; 3 km dari Kertosono &bull; 100 km dari Surabaya
                            </p>
                        </div>

                        <div>
                            <h3 className="text-base font-semibold mb-4">Jelajahi</h3>
                            <ul className="grid grid-cols-2 gap-y-2 text-sm text-zinc-400">
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="hover:text-brand transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-base font-semibold mb-4">Tentang Website</h3>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                <li className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-ring" aria-hidden />
                                    <span>Desa Muneng, Kec. Purwoasri, Kab. Kediri, Jawa Timur 64154</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-ring" aria-hidden />
                                    <span>
                                        Website ini bukan website resmi pemerintah desa. Dibuat secara independen oleh warga
                                        untuk berbagi informasi dan kenangan.
                                    </span>
                                </li>
                            </ul>
                            <div className="mt-4">
                                <Link
                                    href="/kenangan/submit"
                                    className="inline-flex items-center gap-2 text-brand-ring hover:text-brand transition-colors text-sm font-medium"
                                >
                                    <Plus className="w-4 h-4" aria-hidden />
                                    Bagikan Kenangan Anda
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-zinc-400">
                            &copy; {year} Komunitas Warga Desa Muneng
                        </p>
                        <p className="text-xs text-zinc-400">Dibuat dengan cinta untuk kampung halaman</p>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
