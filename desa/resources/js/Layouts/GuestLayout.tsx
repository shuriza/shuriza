import { Link } from '@inertiajs/react';
import { ArrowLeft, Sprout } from 'lucide-react';
import { PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-surface-2 px-4 py-8 sm:px-6">
            <main className="w-full max-w-md">
                <div className="mb-6 flex justify-center">
                    <Link
                        href="/"
                        aria-label="Kembali ke beranda Desa Muneng"
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white shadow-sm transition-colors hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                    >
                        <Sprout className="h-6 w-6" aria-hidden />
                    </Link>
                </div>

                <section className="rounded-2xl border border-line bg-surface-1 p-6 shadow-sm sm:p-8">
                    {children}
                </section>

                <div className="mt-5 text-center">
                    <Link
                        href="/"
                        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-3 transition-colors hover:text-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                    >
                        <ArrowLeft className="h-4 w-4" aria-hidden />
                        Kembali ke beranda
                    </Link>
                </div>
            </main>
        </div>
    );
}
