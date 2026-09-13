import Button from '@/Components/ui/Button';
import Field, { Input } from '@/Components/ui/Field';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Kata Sandi - Desa Muneng" />

            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-ink-1">Lupa kata sandi?</h1>
                <p className="text-sm leading-6 text-ink-3">
                    Masukkan alamat email Anda. Kami akan mengirimkan tautan untuk membuat kata sandi baru.
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

                <Button type="submit" fullWidth loading={processing} disabled={processing}>
                    Kirim tautan atur ulang
                </Button>
            </form>
        </GuestLayout>
    );
}
