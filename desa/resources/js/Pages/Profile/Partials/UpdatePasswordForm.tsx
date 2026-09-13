import Button from '@/Components/ui/Button';
import Field, { Input } from '@/Components/ui/Field';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }: { className?: string }) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (event) => {
        event.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (formErrors) => {
                if (formErrors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (formErrors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-semibold text-ink-1">Ubah kata sandi</h2>
                <p className="mt-1 text-sm leading-6 text-ink-3">
                    Gunakan kata sandi yang panjang dan unik untuk menjaga keamanan akun Anda.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-5">
                <Field label="Kata sandi saat ini" htmlFor="current_password" error={errors.current_password} required>
                    <Input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(event) => setData('current_password', event.target.value)}
                        type="password"
                        autoComplete="current-password"
                        required
                        invalid={Boolean(errors.current_password)}
                    />
                </Field>

                <Field label="Kata sandi baru" htmlFor="password" error={errors.password} required>
                    <Input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(event) => setData('password', event.target.value)}
                        type="password"
                        autoComplete="new-password"
                        required
                        invalid={Boolean(errors.password)}
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
                        value={data.password_confirmation}
                        onChange={(event) => setData('password_confirmation', event.target.value)}
                        type="password"
                        autoComplete="new-password"
                        required
                        invalid={Boolean(errors.password_confirmation)}
                    />
                </Field>

                <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" loading={processing} disabled={processing}>
                        Simpan kata sandi
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
