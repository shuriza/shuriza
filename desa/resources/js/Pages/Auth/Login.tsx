import Button from '@/Components/ui/Button';
import Field, { Input } from '@/Components/ui/Field';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk - Desa Muneng" />

            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-ink-1">Masuk</h1>
                <p className="text-sm leading-6 text-ink-3">
                    Masuk untuk mengirim kenangan atau informasi UMKM Anda.
                </p>
            </div>

            {status && (
                <p className="mt-6 rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm text-brand-strong" role="status">
                    {status}
                </p>
            )}

            <form onSubmit={submit} className="mt-6 space-y-5">
                <Field label="Alamat email" htmlFor="email" error={errors.email} required>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        autoFocus
                        required
                        invalid={Boolean(errors.email)}
                        placeholder="nama@contoh.com"
                        onChange={(event) => setData('email', event.target.value)}
                    />
                </Field>

                <Field label="Kata sandi" htmlFor="password" error={errors.password} required>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        required
                        invalid={Boolean(errors.password)}
                        placeholder="Masukkan kata sandi Anda"
                        onChange={(event) => setData('password', event.target.value)}
                    />
                </Field>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <label htmlFor="remember" className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-2">
                        <input
                            id="remember"
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(event) => setData('remember', event.target.checked)}
                            className="h-5 w-5 rounded border-line text-brand focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                        />
                        Ingat saya
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="min-h-11 inline-flex items-center text-sm font-medium text-brand-strong hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                        >
                            Lupa kata sandi?
                        </Link>
                    )}
                </div>

                <Button type="submit" fullWidth loading={processing} disabled={processing}>
                    Masuk
                </Button>
            </form>

            <div className="mt-6 space-y-3 text-center">
                <p className="text-sm text-ink-3">
                    Belum memiliki akun?{' '}
                    <Link
                        href={route('register')}
                        className="font-semibold text-brand-strong hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                    >
                        Daftar sekarang
                    </Link>
                </p>
                <p className="text-xs leading-5 text-ink-3">
                    Anda tetap dapat menjelajahi seluruh situs tanpa akun. Akun hanya diperlukan untuk mengirim kenangan atau informasi UMKM.
                </p>
            </div>
        </GuestLayout>
    );
}
