# UI Refactor — Website Desa Muneng

**Tanggal**: 2026-05-29
**Status**: Design (siap diimplementasikan)
**Scope**: Semua halaman publik (10 halaman + sub-page)
**Stack target**: Laravel 13 + Inertia v2 + React 18 + TypeScript + Tailwind 3

## Ringkasan Keputusan

| Aspek | Pilihan |
|---|---|
| Fokus | Tampilan lebih modern (visual update, fungsi tetap) |
| Arah visual | Soft modern (Linear/Vercel-style) |
| Scope | Semua halaman publik; admin & auth tidak disentuh |
| Motion | Sedang via framer-motion |
| Palet | Emerald primary + amber accent + zinc neutral (warm) |
| Ikon | `lucide-react` |
| Typography | Plus Jakarta Sans |
| Eksekusi | Branch `feat/ui-refactor` di repo `C:\shuriza`, stage selektif `desa/**` per commit; token-first |

## Tujuan & Non-Tujuan

**Tujuan**

- Tampilan lebih modern dan konsisten di seluruh halaman publik
- Pondasi design system yang reusable (tokens + primitives + cards)
- Hilangkan duplikasi: SVG inline, pola section header, card styling, dropdown manual
- A11y: kontras WCAG, skip link, focus-visible, aria-label di FAB, thumb-friendly mobile

**Non-tujuan**

- Tidak menyentuh backend (controllers, models, migrations, services)
- Tidak menyentuh halaman admin & auth (Login/Register Breeze)
- Tidak ganti routing
- Tidak menambah fitur baru
- Tidak install testing framework baru

## 1. Foundation (Design Tokens)

### 1.1 Branch & Dependencies

- Branch baru: `feat/ui-refactor` dari `main` di repo `C:\shuriza`
- Stage selektif: setiap commit hanya men-stage path `desa/**` (working tree shuriza punya perubahan lain di luar scope)
- Tambah dependency (di `desa/`): `lucide-react`, `clsx`, `tailwind-merge`
- Install: `npm install --legacy-peer-deps lucide-react clsx tailwind-merge`

### 1.2 Font

- Ganti Figtree → Plus Jakarta Sans
- Update di `resources/views/app.blade.php` (link bunny.net), `app.css`, `tailwind.config.js`
- `font-display: swap`, fallback `system-ui` di config

### 1.3 Semantic Color Tokens

Daftarkan flat di `tailwind.config.js` `extend.colors`:

```js
ink:     { 1: '#18181b', 2: '#3f3f46', 3: '#71717a', 4: '#a1a1aa' },
surface: { 1: '#ffffff', 2: '#fafafa', 3: '#f4f4f5', inverse: '#18181b' },
line:    { DEFAULT: '#e4e4e7', subtle: '#f4f4f5', strong: '#d4d4d8' },
brand:   { DEFAULT: '#059669', strong: '#047857', soft: '#ecfdf5', ring: '#10b981' },
accent:  { DEFAULT: '#f59e0b', strong: '#d97706', soft: '#fffbeb' },
```

Pemakaian:

| Niat | Class |
|---|---|
| Heading | `text-ink-1` |
| Body | `text-ink-2` |
| Meta/muted | `text-ink-3` |
| Link / eyebrow | `text-brand-strong` |
| CTA primary | `bg-brand text-white` |
| Section alt bg | `bg-surface-2` |
| Border kartu | `border-line` |
| Highlight hangat | `bg-accent-soft text-accent-strong` |

Warna Tailwind asli (`emerald-*`, `amber-*`, `zinc-*`) tetap tersedia untuk kasus khusus.

### 1.4 Aksesibilitas Kontras

- `emerald-700` / `brand-strong` untuk teks/link/eyebrow di atas surface terang (lolos AA, mendekati AAA)
- `emerald-600` / `brand` untuk fill solid (tombol, badge bg)
- Body default `ink-2`, tidak `ink-3`/`zinc-500` agar lansia nyaman

### 1.5 Spacing, Radius, Shadow

- Container: `max-w-7xl px-4 sm:px-6 lg:px-8`
- Section padding: `py-20 md:py-28` landing, `py-12 md:py-16` sub-page
- Radius: `rounded-xl` (12px) default, `rounded-2xl` (16px) hero/feature, `rounded-full` pills/avatar
- Shadow: `shadow-sm` (default + border-line), `shadow-md` (hover), `shadow-xl` (modal/dropdown)

### 1.6 Typography Scale

| Level | Class |
|---|---|
| Display (hero) | `text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight` |
| H1 (page) | `text-4xl md:text-5xl font-bold tracking-tight` |
| H2 (section) | `text-3xl md:text-4xl font-bold` |
| H3 (card) | `text-xl md:text-2xl font-semibold` |
| Body | `text-base leading-relaxed text-ink-2` |
| Meta | `text-sm text-ink-3` |
| Eyebrow | `text-xs uppercase tracking-wider font-semibold text-brand-strong` |

### 1.7 Motion Tokens (`lib/motion.ts`)

- `fadeIn` — opacity 0→1, duration 0.4
- `fadeInUp` — opacity + y 20px, duration 0.5
- `staggerContainer` — stagger children 0.08s
- `scaleHover` — scale 1.02 on hover
- `pageTransition` — enter 0.25s, exit 0.15s, fade + y 8px
- Respect `prefers-reduced-motion` → durasi 0

### 1.8 Z-Index Hierarchy

| Token | Tailwind | Pemakaian |
|---|---|---|
| sticky | `z-30` | Navbar |
| fab | `z-40` | BackToTop, WhatsAppFloat |
| overlay | `z-[45]` | Mobile drawer backdrop |
| modal | `z-50` | SearchModal, Dialog |
| toast | `z-[55]` | Toast |

> Tailwind 3 default scale hanya `z-0/10/20/30/40/50`. Nilai 45 dan 55 pakai arbitrary value (sintaks bracket).

### 1.9 Helper

- `lib/cn.ts` — wrapper `clsx` + `twMerge`

## 2. Component Library

### 2.1 Primitives Baru (`Components/ui/`)

| Komponen | Tujuan |
|---|---|
| `Container` | Pembungkus `max-w-7xl px-4 sm:px-6 lg:px-8` |
| `Section` | `<section>` dengan padding vertikal + variant `default`/`alt`/`brand`/`dark` |
| `SectionHeader` | Eyebrow + title + description, align `left`/`center` |
| `Eyebrow` | Label kecil di atas heading section dengan bar indicator |
| `Icon` | Wrapper `LucideIcon` dengan size preset + className override |
| `IconBox` | Kotak/lingkaran berwarna berisi ikon |
| `Avatar` | Inisial + warna brand-soft, ukuran preset |
| `Tag` | Pill kategori |
| `EmptyState` | Ikon besar + judul + helper + CTA |
| `PageHeader` | Hero kecil sub-page (judul + breadcrumb + CTA opsional) |
| `MetaList` | List icon+text untuk lokasi/tanggal/jam |
| `Divider` | Garis pemisah |
| `WaveDivider` | SVG wave dengan prop `fill` (token) + `flip` + `variant` |
| `Field` | Composer Label + Input/Textarea/Select + Error untuk form publik |

### 2.2 Icon API

```ts
import { LucideIcon, LucideProps } from 'lucide-react';
import { cn } from '@/lib/cn';

const sizeMap = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
} as const;

type IconProps = Omit<LucideProps, 'ref'> & {
  icon: LucideIcon;
  size?: keyof typeof sizeMap;
};

export function Icon({ icon: IconComponent, size = 'md', className, ...rest }: IconProps) {
  return <IconComponent className={cn(sizeMap[size], className)} {...rest} />;
}
```

### 2.3 WaveDivider API

```ts
type WaveDividerProps = {
  fill?: 'surface-1' | 'surface-2' | 'brand' | 'brand-soft' | 'inverse';
  flip?: boolean;
  variant?: 'soft' | 'bold' | 'layered';
  className?: string;
};
```

`fill` di-map ke `currentColor` lewat `text-*` token agar override via `className` tetap mungkin.

### 2.4 Polish Komponen Existing

| Komponen | Perubahan |
|---|---|
| `Button` | Variant `accent` (amber), `tonal` (brand-soft), motion press scale 0.98, loading pakai `Loader2` lucide |
| `Card` | Tambah `interactive` (hover lift + ring), `media` variant + subcomponent `CardCover` |
| `Badge` | Variant `accent`, `outline`, dot prefix opsional |
| `Breadcrumb` | Pakai `Icon`, separator chevron, hover `brand-strong` |
| `SearchModal` | Backdrop blur, command-style result, kbd hint, framer-motion enter/exit |
| `Toast` | Slide-in spring, ikon per variant via lucide |
| `Skeleton` | Variants `text`/`card`/`circle`, shimmer halus |
| `BackToTop` | `aria-label="Kembali ke atas"`, `z-40`, fade in saat scroll |
| `WhatsAppFloat` | `aria-label="Hubungi Admin Desa via WhatsApp"`, `z-40`, `rel="noopener noreferrer"` |
| `CommentSection`, `LikeButton`, `ShareButton` | Refresh ikon ke lucide, micro-animation, no logic change |
| `MediaEmbed`, `ImageCarousel`, `PollWidget`, `StatsCounter` | Restyle saja (token) |

### 2.5 Card Domain (`Components/cards/`)

`EventCard`, `MemoryCard`, `DestinationCard`, `AnnouncementCard`, `ProductCard`.

Aturan:

- Wajib pakai `Card`, `CardCover`, `CardBody`, `CardFooter` dari `ui/Card.tsx`
- Tidak boleh hardcode `rounded-xl`, `shadow-sm`, `border-line` di domain card
- Konsistensi: kalau radius/shadow scale berubah, cukup update `ui/Card.tsx`

### 2.6 Struktur Folder Akhir

```
resources/js/
├── lib/
│   ├── cn.ts
│   └── motion.ts
├── Components/
│   ├── ui/         # primitives
│   └── cards/      # domain cards
```

### 2.7 Aturan Penulisan

- Semua primitive terima `className` + spread sisanya
- Pakai `cn()` untuk gabung class
- Variant pakai object map (konsisten dengan Button.tsx)
- Tidak pakai CVA — overhead, object map cukup
- Default export untuk komponen besar, named export untuk grup kecil

## 3. Layout (PublicLayout Baru)

### 3.1 Struktur File

```
Layouts/
├── PublicLayout.tsx        # orchestrator, ~80 baris
└── public/
    ├── Navbar.tsx
    ├── NavbarDesktop.tsx
    ├── NavbarMobile.tsx
    ├── UserMenu.tsx        # Headless UI Menu
    └── Footer.tsx
```

Target ukuran: setiap file ≤ 120 baris, single-responsibility.

### 3.2 Navbar Desktop

- Layout 3 kolom: `[Logo] [nav links centered] [search + auth]`
- Sticky transparan-to-solid: scroll 0 → `bg-surface-1/70 backdrop-blur` + border halus, scroll > 8px → `bg-surface-1` solid + `shadow-sm`
- Active state: bar bawah `bg-brand` via framer-motion `layoutId` (sumber dari `usePage().url`)
- Search trigger pill `bg-surface-3` dengan `<kbd>Ctrl K</kbd>`
- Logo: `<Icon icon={Mountain}/>` dalam lingkaran `bg-brand`, label "Desa Muneng" `font-extrabold tracking-tight`
- CTA "Daftar" pakai variant `accent` (amber)
- Mount: fade-down 0.3s

### 3.3 Navbar Mobile (Drawer Thumb-Friendly)

- Trigger: ikon `Menu` lucide + ikon search di kanan
- Drawer dari kanan via Headless UI `Dialog` + `Transition`, backdrop blur, `z-overlay`
- Layout drawer (penting untuk thumb reach):
  - Top tipis: brand kecil + tagline 1 baris (decorative)
  - Tengah: nav links utama, tinggi sentuhan ≥ 48px, divider, auth section
  - Bottom: tombol Close pill lebar + tombol "Hubungi via WhatsApp"
- Tidak ada X kecil di pojok kanan atas
- Tutup via: backdrop tap, tombol Close di bawah
- Auto-close on route change: subscribe `router.on('navigate')`

### 3.4 User Menu

- Pakai `@headlessui/react` Menu (sudah terpasang)
- Trigger: `<Avatar>` + nama
- Items: "Dashboard Saya", "Dashboard Admin" (conditional `auth.user.role === 'admin'`), divider, "Keluar"
- Buang state manual `userDropdownOpen` + outside-click
- **Bug fix sekalian**: saat ini "Dashboard Admin" muncul untuk semua user yang login → diperbaiki jadi conditional

### 3.5 Footer

- 3 kolom (md+) → 1 kolom (sm)
- Background: `bg-ink-1` + pattern dot via Tailwind inline
  - `bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px]`
  - Pattern hanya di area atas, bottom-bar tetap clean
- Kolom 1: logo + tagline + chip lokasi
- Kolom 2: "Jelajahi" — grid 2 kolom internal untuk 10 nav links
- Kolom 3: alamat + disclaimer non-resmi + CTA "Bagikan Kenangan" + sosial
- Bottom bar: copyright + tagline kecil

### 3.6 Page Transitions

```tsx
<AnimatePresence mode="wait">
  <motion.main key={url} variants={pageTransition}>
    {children}
  </motion.main>
</AnimatePresence>
```

- Variants: enter 0.25s, exit 0.15s (total <0.4s)
- Subscribe `router.on('navigate', () => window.scrollTo({ top: 0, behavior: 'instant' }))` di layout
- Honor `preserveScroll` per-link (Inertia default behavior)
- Respect `prefers-reduced-motion` → durasi 0

### 3.7 A11y

- Skip link "Lompat ke konten utama" di paling atas, visible saat focus
- Semua interactive: `focus-visible:ring-2 ring-brand-ring ring-offset-2`
- Mobile drawer: trap focus (Headless UI Dialog)
- FAB punya `aria-label` + z-index semantik

## 4. Migrasi Halaman Publik

### 4.1 Wave 1 — Foundation in action

| # | Halaman | Pendekatan |
|---|---|---|
| 1 | `Home.tsx` (1023 baris) | Pecah dulu ke `Pages/Public/home/`: `HeroSection`, `StatsSection`, `WilayahSection`, `PerangkatDesaSection`, `EventsTeaser`, `MemoriesTeaser`, `DestinationsTeaser`, `AnnouncementsTeaser`, `TimelineSection`, `RuangBerbagiSection`. Tiap section ≤ 120 baris. Home.tsx jadi orchestrator ~80 baris. |
| 2 | `ProfilDesa.tsx` | Hero compact + section sejarah, demografi, perangkat desa, batas wilayah |

### 4.2 Wave 2 — List + Detail

| # | Halaman | Pendekatan |
|---|---|---|
| 3 | `Events/Index` + `Show` | Index: filter chip + grid `EventCard`. Show: hero image + meta + content prose + sidebar related |
| 4 | `Memories/Index` + `Show` + `Submit` | Index: filter + grid `MemoryCard` (Pinned di atas). Show: media embed + reactions + comments. Submit: form pakai `Field` |
| 5 | `Destinations/Index` + `Show` | Index: card grid + filter. Show: image carousel + info sidebar + map embed |

### 4.3 Wave 3 — Konten Ringan

| # | Halaman | Pendekatan |
|---|---|---|
| 6 | `Announcements/Index` + `Show` | List: card horizontal di desktop, vertikal di mobile. Show: prose + share |
| 7 | `Products/Index` + `Show` | Grid `ProductCard` (UMKM): foto, harga, kontak. Show: galeri + deskripsi + CTA WA |
| 8 | `Gallery/Index` | Masonry foto, lightbox via `ImageCarousel` |
| 9 | `Contact.tsx` | 2 kolom: form pakai `Field` + info kontak |
| 10 | `Map.tsx` | OSM iframe + caption + tombol Google Maps |
| 11 | `UserDashboard.tsx` | Card grid: kenangan saya, submission saya, akun |

### 4.4 Pattern Wajib

- Import `PublicLayout`, `Container`, `Section`, `SectionHeader`, `PageHeader`
- Heading hierarchy: 1 `<h1>` per halaman (di `PageHeader`), `<h2>` per section
- Setiap list halaman punya `EmptyState`
- Setiap detail halaman punya `Breadcrumb` di atas hero
- Loading state pakai `Skeleton`
- Pakai `cards/<X>Card` — tidak boleh duplicate styling antar halaman

### 4.5 Yang Tidak Disentuh

- Logic / props dari controller, API endpoints, routes
- Validation server-side
- Pages auth (Login/Register Breeze)
- Pages Admin

### 4.6 Eksekusi Per Halaman

1. Read file lengkap (offset bila > 500 baris)
2. Identifikasi section logis
3. Ekstrak ke sub-komponen via `write` (file baru ≤ 150 baris)
4. Patch file utama via `edit` untuk import + ganti markup
5. `npm run build` (includes `tsc`) — harus pass
6. Manual smoke check via `composer dev`
7. Commit selektif `desa/**`

## 5. Eksekusi

### 5.1 Branch & Stage Strategy

- Repo root: `C:\shuriza` (working tree punya perubahan di luar `desa/` yang tidak boleh ikut)
- Branch baru: `feat/ui-refactor` dari `main`
- Stage selektif per commit: hanya path `desa/**`
- Verifikasi sebelum tiap commit: `git diff --cached --name-only` — pastikan tidak ada path di luar `desa/`

### 5.2 Dependencies

- Tambah di `desa/`: `lucide-react`, `clsx`, `tailwind-merge`
- `npm install --legacy-peer-deps lucide-react clsx tailwind-merge`
- Tidak ada package yang dihapus
- `framer-motion` & `@headlessui/react` sudah ada

### 5.3 Commit Plan (19 commit)

**Wave 0 — Foundation (4)**

1. `chore(ui): add lucide-react, clsx, tailwind-merge`
2. `feat(ui): design tokens + Plus Jakarta Sans`
3. `feat(ui): lib/cn + lib/motion helpers`
4. `feat(ui): primitives — Container, Section, SectionHeader, Eyebrow, Icon, IconBox, Avatar, Tag, EmptyState, PageHeader, MetaList, Divider, WaveDivider, Field`

**Wave 1 — Polish + Cards (4)**

5. `refactor(ui): polish Button, Card (+CardCover), Badge`
6. `refactor(ui): polish SearchModal, Toast, Skeleton, BackToTop, WhatsAppFloat`
7. `refactor(ui): polish CommentSection, LikeButton, ShareButton, MediaEmbed, ImageCarousel, PollWidget, StatsCounter, Breadcrumb`
8. `feat(ui): card domain — EventCard, MemoryCard, DestinationCard, AnnouncementCard, ProductCard`

**Wave 2 — Layout (2)**

9. `refactor(layout): split PublicLayout into Navbar/Footer subcomponents`
10. `feat(layout): redesign Navbar, Footer, mobile drawer, page transitions`

**Wave 3 — Pages (9)**

11. `refactor(public): split Home.tsx into section components`
12. `feat(public): redesign Home with new design system`
13. `feat(public): redesign ProfilDesa`
14. `feat(public): redesign Events index + show`
15. `feat(public): redesign Memories index + show + submit`
16. `feat(public): redesign Destinations index + show`
17. `feat(public): redesign Announcements index + show`
18. `feat(public): redesign Products + Gallery`
19. `feat(public): redesign Contact, Map, UserDashboard`

### 5.4 Verifikasi Per Commit

- `npm run build` (includes `tsc --noEmit`) harus pass
- `git diff --cached --name-only` tidak menampilkan path di luar `desa/`
- Manual smoke check di browser via `composer dev` untuk halaman yang baru disentuh
- Console browser bersih dari error/warning baru
- Bila build gagal: rollback edit terakhir, pecah lebih kecil, retry

### 5.5 Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Plus Jakarta Sans bikin layout reflow | `font-display: swap`, fallback `system-ui` |
| `lucide-react` bundle bloat | Tree-shake otomatis ESM, import per ikon |
| `AnimatePresence` + Inertia clash scroll | Subscribe `router.on('navigate')` reset scroll, exit duration 0.15s |
| File besar tidak bisa edit dalam satu chunk | Read → edit kecil. Home.tsx dipecah dulu (commit 11) sebelum redesign (commit 12) |
| LSP false positives Intelephense | Diabaikan sesuai AGENTS.md |
| Stage selektif terlewat | Verifikasi `git diff --cached --name-only` sebelum tiap commit |

### 5.6 Rollback

- Branch terpisah → `git checkout main` cukup bila ada blocker
- Per-wave commit memungkinkan revert granular (mis. revert Wave 3 saja, simpan tokens & primitives)

### 5.7 Tidak Dilakukan

- Tidak menyentuh kode backend (controllers, models, migrations, services)
- Tidak menyentuh halaman admin & auth
- Tidak ganti routing
- Tidak install testing framework baru
- Tidak push otomatis (push/PR di tangan user setelah review)

## 6. Definition of Done

- [ ] 19 commit di branch `feat/ui-refactor`, semua hijau di `npm run build`
- [ ] Tidak ada path di luar `desa/` masuk ke commit branch ini
- [ ] Semua 10 halaman publik konsisten pakai design system (tokens, primitives, cards)
- [ ] Tidak ada SVG inline duplikat tersisa di halaman publik
- [ ] `Home.tsx` ≤ 100 baris (orchestrator), tiap section file ≤ 150 baris
- [ ] `PublicLayout.tsx` ≤ 100 baris, tiap sub-layout file ≤ 150 baris
- [ ] FAB punya `aria-label`, focus-visible ring konsisten, skip link aktif
- [ ] Mobile drawer thumb-friendly (close di bawah, nav di tengah)
- [ ] Page transition + scroll reset bekerja tanpa "loncat"
- [ ] No TypeScript errors, no new console errors di browser smoke test
