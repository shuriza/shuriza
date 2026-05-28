export interface NavLink {
    name: string;
    href: string;
}

export const navLinks: NavLink[] = [
    { name: 'Beranda', href: '/' },
    { name: 'Profil Desa', href: '/profil-desa' },
    { name: 'Acara', href: '/acara' },
    { name: 'Kenangan', href: '/kenangan' },
    { name: 'Destinasi', href: '/destinasi' },
    { name: 'UMKM', href: '/umkm' },
    { name: 'Berita', href: '/berita' },
    { name: 'Galeri', href: '/galeri' },
    { name: 'Peta', href: '/peta' },
    { name: 'Kontak', href: '/kontak' },
];
