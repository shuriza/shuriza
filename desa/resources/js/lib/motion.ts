import type { Variants, Transition } from 'framer-motion';

const easeOut: Transition['ease'] = [0.16, 1, 0.3, 1];

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: easeOut } },
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

export const staggerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const scaleHover: Variants = {
    rest: { scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2, ease: easeOut } },
};

export const pageTransition: Variants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: easeOut } },
    exit: { opacity: 0, y: -4, transition: { duration: 0.15, ease: easeOut } },
};

export const slideRight: Variants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { duration: 0.3, ease: easeOut } },
    exit: { x: '100%', transition: { duration: 0.2, ease: easeOut } },
};

export const viewportOnce = { once: true, amount: 0.2 };
