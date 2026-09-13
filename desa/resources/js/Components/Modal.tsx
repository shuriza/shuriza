import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { PropsWithChildren } from 'react';

interface ModalProps extends PropsWithChildren {
    show: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    closeable?: boolean;
    onClose: () => void;
}

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose,
}: ModalProps) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                className="fixed inset-0 z-50 flex items-center overflow-y-auto px-4 py-6 sm:px-0"
                onClose={close}
            >
                <TransitionChild
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-surface-inverse/50" />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-200"
                    enterFrom="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
                    enterTo="translate-y-0 opacity-100 sm:scale-100"
                    leave="ease-in duration-150"
                    leaveFrom="translate-y-0 opacity-100 sm:scale-100"
                    leaveTo="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel className={`relative mb-6 w-full overflow-hidden rounded-2xl border border-line bg-surface-1 shadow-xl sm:mx-auto ${maxWidthClass}`}>
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
