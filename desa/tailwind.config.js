import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                ink: {
                    1: '#18181b',
                    2: '#3f3f46',
                    3: '#71717a',
                    4: '#a1a1aa',
                },
                surface: {
                    1: '#ffffff',
                    2: '#fafafa',
                    3: '#f4f4f5',
                    inverse: '#18181b',
                },
                line: {
                    DEFAULT: '#e4e4e7',
                    subtle: '#f4f4f5',
                    strong: '#d4d4d8',
                },
                brand: {
                    DEFAULT: '#059669',
                    strong: '#047857',
                    soft: '#ecfdf5',
                    ring: '#10b981',
                },
                accent: {
                    DEFAULT: '#f59e0b',
                    strong: '#d97706',
                    soft: '#fffbeb',
                },
            },
            borderColor: {
                DEFAULT: '#e4e4e7',
            },
        },
    },

    plugins: [forms],
};
