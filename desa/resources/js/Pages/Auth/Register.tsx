import Button from '@/Components/ui/Button';
import Field, { Input } from '@/Components/ui/Field';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar - Desa Muneng" />

            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-ink-1">Buat akun</h1>
                <p className="text-sm leading-6 text-ink-3">
                    Daftarkan akun untuk membagikan kenangan dan informasi UMKM.
                </p>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <Field label="Nama lengkap" htmlFor="name" error={errors.name} required>
                    <Input
                        id="name"
                        name="name"
                        value={data.name}
                        autoComplete="name"
                        autoFocus
                        required
                        invalid={Boolean(errors.name)}
                        placeholder="Nama lengkap Anda"
                        onChange={(event) => setData('name', event.target.value)}
                    />
                </Field>

                <Field label="Alamat email" htmlFor="email" error={errors.email} required>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
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
                        autoComplete="new-password"
                        required
                        invalid={Boolean(errors.password)}
                        placeholder="Minimal 8 karakter"
                        onChange={(event) => setData('password', event.target.value)}
                    />
                </Field>

                <Field
                    label="Konfirmasi kata sandi"
                    htmlFor="password_confirmation"
                    error={errors.password_confirmation}
                    required
                >
                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        required
                        invalid={Boolean(errors.password_confirmation)}
                        placeholder="Ulangi kata sandi"
                        onChange={(event) => setData('password_confirmation', event.target.value)}
                    />
                </Field>

                <Button type="submit" fullWidth loading={processing} disabled={processing}>
                    Daftar
                </Button>
            </form>

            <div className="mt-6 space-y-3 text-center">
                <p className="text-sm text-ink-3">
                    Sudah memiliki akun?{' '}
                    <Link
                        href={route('login')}
                        className="font-semibold text-brand-strong hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
                    >
                        Masuk di sini
                    </Link>
                </p>
                <p className="text-xs leading-5 text-ink-3">
                    Anda tetap dapat menjelajahi seluruh situs tanpa akun. Akun hanya diperlukan untuk mengirim kenangan atau informasi UMKM.
                </p>
            </div>
        </GuestLayout>
    );
}
