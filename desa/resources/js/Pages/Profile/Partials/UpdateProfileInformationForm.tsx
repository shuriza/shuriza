import Button from '@/Components/ui/Button';
import Field, { Input } from '@/Components/ui/Field';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user!;
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-semibold text-ink-1">Informasi profil</h2>
                <p className="mt-1 text-sm leading-6 text-ink-3">
                    Perbarui nama dan alamat email yang terhubung dengan akun Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <Field label="Nama lengkap" htmlFor="name" error={errors.name} required>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                        required
                        autoFocus
                        autoComplete="name"
                        invalid={Boolean(errors.name)}
                    />
                </Field>

                <Field label="Alamat email" htmlFor="email" error={errors.email} required>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        required
                        autoComplete="username"
                        invalid={Boolean(errors.email)}
                    />
                </Field>

                {mustVerifyEmail && !user.email_verified_at && (
                    <div className="rounded-xl border border-line bg-surface-2 p-4 text-sm text-ink-2">
                        <p>
                            Alamat email Anda belum terverifikasi.{' '}
                            <Button href={route('verification.send')} method="post" variant="ghost" size="sm" className="h-auto px-0 py-0 font-semibold text-brand-strong hover:bg-transparent hover:text-brand">
                                Kirim ulang email verifikasi
                            </Button>
                        </p>
                        {status === 'verification-link-sent' && (
                            <p className="mt-2 font-medium text-brand-strong" role="status">
                                Tautan verifikasi baru telah dikirim ke alamat email Anda.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" loading={processing} disabled={processing}>
                        Simpan perubahan
                    </Button>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-150"
                        enterFrom="opacity-0"
                        leave="transition ease-in duration-100"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-medium text-brand-strong" role="status">Tersimpan.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
