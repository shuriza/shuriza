import Button from '@/Components/ui/Button';
import Field, { Input } from '@/Components/ui/Field';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }: { className?: string }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const deleteUser: FormEventHandler = (event) => {
        event.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-5 ${className}`}>
            <header>
                <h2 className="text-lg font-semibold text-ink-1">Hapus akun</h2>
                <p className="mt-1 text-sm leading-6 text-ink-3">
                    Setelah dihapus, semua data dan sumber daya akun Anda akan hilang secara permanen. Pastikan Anda telah menyimpan informasi yang masih diperlukan.
                </p>
            </header>

            <Button type="button" variant="danger" onClick={() => setConfirmingUserDeletion(true)}>
                Hapus akun
            </Button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 sm:p-8">
                    <h2 className="text-xl font-semibold text-ink-1">Hapus akun secara permanen?</h2>
                    <p className="mt-2 text-sm leading-6 text-ink-3">
                        Tindakan ini tidak dapat dibatalkan. Masukkan kata sandi Anda untuk mengonfirmasi penghapusan akun.
                    </p>

                    <div className="mt-6">
                        <Field label="Kata sandi" htmlFor="delete_password" error={errors.password} required>
                            <Input
                                id="delete_password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(event) => setData('password', event.target.value)}
                                autoComplete="current-password"
                                autoFocus
                                required
                                invalid={Boolean(errors.password)}
                                placeholder="Masukkan kata sandi Anda"
                            />
                        </Field>
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={closeModal} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" variant="danger" loading={processing} disabled={processing}>
                            Hapus akun permanen
                        </Button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
