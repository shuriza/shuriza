import Button from '@/Components/ui/Button';
import Field, { Input } from '@/Components/ui/Field';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Konfirmasi Kata Sandi - Desa Muneng" />

            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-ink-1">Konfirmasi kata sandi</h1>
                <p className="text-sm leading-6 text-ink-3">
                    Demi keamanan, masukkan kembali kata sandi Anda sebelum melanjutkan.
                </p>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <Field label="Kata sandi" htmlFor="password" error={errors.password} required>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        autoFocus
                        required
                        invalid={Boolean(errors.password)}
                        placeholder="Masukkan kata sandi Anda"
                        onChange={(event) => setData('password', event.target.value)}
                    />
                </Field>

                <Button type="submit" fullWidth loading={processing} disabled={processing}>
                    Konfirmasi
                </Button>
            </form>
        </GuestLayout>
    );
}
