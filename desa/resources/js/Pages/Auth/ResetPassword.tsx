import Button from '@/Components/ui/Button';
import Field, { Input } from '@/Components/ui/Field';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Atur Ulang Kata Sandi - Desa Muneng" />

            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-ink-1">Buat kata sandi baru</h1>
                <p className="text-sm leading-6 text-ink-3">
                    Gunakan kata sandi yang kuat untuk menjaga keamanan akun Anda.
                </p>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-5">
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

                <Field label="Kata sandi baru" htmlFor="password" error={errors.password} required>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="new-password"
                        autoFocus
                        required
                        invalid={Boolean(errors.password)}
                        placeholder="Minimal 8 karakter"
                        onChange={(event) => setData('password', event.target.value)}
                    />
                </Field>

                <Field
                    label="Konfirmasi kata sandi baru"
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
                        placeholder="Ulangi kata sandi baru"
                        onChange={(event) => setData('password_confirmation', event.target.value)}
                    />
                </Field>

                <Button type="submit" fullWidth loading={processing} disabled={processing}>
                    Simpan kata sandi baru
                </Button>
            </form>
        </GuestLayout>
    );
}
