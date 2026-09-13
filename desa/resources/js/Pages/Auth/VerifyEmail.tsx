import Button from '@/Components/ui/Button';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email - Desa Muneng" />

            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-ink-1">Verifikasi alamat email</h1>
                <p className="text-sm leading-6 text-ink-3">
                    Kami telah mengirimkan tautan verifikasi ke alamat email Anda. Buka tautan tersebut sebelum melanjutkan.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <p className="mt-6 rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm text-brand-strong" role="status">
                    Tautan verifikasi baru telah dikirim ke alamat email Anda.
                </p>
            )}

            <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button type="submit" loading={processing} disabled={processing} className="flex-1">
                    Kirim ulang email verifikasi
                </Button>
                <Button href={route('logout')} method="post" variant="outline" className="flex-1">
                    Keluar
                </Button>
            </form>
        </GuestLayout>
    );
}
