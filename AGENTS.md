# AGENTS.md

## Project: Website Desa Muneng

Community website for Desa Muneng, Kecamatan Purwoasri, Kabupaten Kediri, Jawa Timur.  
**Not** an official government site — built independently by/for villagers.

## JCE Worker Version

**Current**: v2.0.22 (May 11, 2026)

**Features**:
- Intent Gate Classification (fix/implement/explain/refactor)
- Anti-Duplication Rule (delegate once, trust result)
- 6-Section Delegation Prompt (structured task assignment)
- Wisdom Accumulation (learn from each task)
- TODO Enforcer (prevent premature completion)

**Documentation**: See `C:\shuriza\bot-wa\JCE-WORKER-v2.0.22.md` for full details

## Stack

- **Backend**: Laravel 13 (PHP 8.3), SQLite (dev), Inertia.js v2
- **Frontend**: React 18, TypeScript, Tailwind CSS 3, Vite 8
- **Auth**: Laravel Breeze (React stack), role-based (admin/warga)
- **Key packages**: framer-motion, axios, ziggy (route generation)

## Commands

```bash
# Working directory
cd C:\shuriza\desa

# Dev (all services)
composer dev
# Or manually:
php artisan serve        # Terminal 1
npm run dev              # Terminal 2

# Build (includes tsc typecheck)
npm run build

# Fresh database with seed data
php artisan migrate:fresh --seed

# Run tests
composer test

# Scrape a social media URL into memories
php artisan memories:scrape --url="https://..."

# Batch update all memory metadata
php artisan memories:scrape --all
```

## NPM install quirk

`laravel-vite-plugin@3.1` requires vite 8, but `@vitejs/plugin-react@4.x` caps at vite 7. Install with:
```bash
npm install --legacy-peer-deps
```

## Architecture

```
app/
├── Http/Controllers/
│   ├── Public/       # HomeController, EventController, MemoryController, etc.
│   ├── Admin/        # Dashboard, CRUD controllers (auth + admin middleware)
│   └── Api/          # SearchController, ReactionController, ScraperController, etc.
├── Models/           # User, Event, Memory, Destination, Announcement, Submission, etc.
│   └── Traits/       # Likeable, Commentable (polymorphic)
├── Services/         # MediaScraper (oEmbed + OG scraping)
└── Console/Commands/ # ScrapeMemories artisan command

resources/js/
├── Pages/
│   ├── Public/       # Home, ProfilDesa, Events/, Memories/, Destinations/, Announcements/
│   ├── Admin/        # Dashboard, Events/, Memories/, Destinations/, Announcements/, Submissions/
│   ├── Auth/         # Login, Register (from Breeze)
│   └── Error.tsx     # Custom 403/404/500
├── Layouts/          # PublicLayout, AdminLayout, AuthenticatedLayout, GuestLayout
├── Components/ui/    # Reusable: Toast, SearchModal, ShareButton, BackToTop, etc.
└── types/index.d.ts  # All TypeScript interfaces

routes/
├── web.php           # Public + auth + admin routes AND the /api/* SPA endpoints
└── auth.php          # Breeze auth routes
```

### No `routes/api.php`

The `/api/*` endpoints (search, reactions, likes, comments, polls, scraper) are consumed
only by same-origin XHR from Inertia pages. They need the **session** (reactions and poll
votes are keyed on `session_id`) and **CSRF protection** (authenticated writes are
authorised by the session cookie). Laravel's `api` middleware group is stateless and
provides neither — it made `/api/reactions/counts` return 500. So these routes live in
`web.php` under an `api` prefix, `routes/api.php` was deleted along with its
`withRouting(api:)` registration, and `laravel/sanctum` was removed. No API tokens exist.

## Key conventions

- **Bahasa Indonesia** for all UI text and content
- **Semantic design tokens**, not raw Tailwind palette literals. Defined in
  `tailwind.config.js`: `ink-1..4` (text), `surface-1..3` + `surface-inverse`,
  `line`/`line-subtle`/`line-strong`, `brand`/`brand-strong`/`brand-soft`/`brand-ring`
  (emerald family), `accent`/`accent-strong`/`accent-soft` (amber). Status colours
  (`red-*`, `amber-*`, `blue-*`) go through `Badge` variants.
- Icons come from `lucide-react`; no inline `<svg>` in pages
- **No `route('dashboard')`** — after login, admin → `/admin`, warga → `/`
- Public submissions (`/submissions` POST) require **no auth** — anyone can submit
- All public write endpoints are `throttle`d
- Memories support embed from YouTube, TikTok, Facebook, Instagram via `MediaScraper` service
- Reactions use **session-based** identification (no login required)
- `is_pinned` on memories marks "Kenangan Pilihan" shown at top of feed
- Inertia prop names must match the page exactly; several silent bugs came from drift
  (`totalUsers` vs `totalWarga`, `currentAlbum` vs `filter`, `?filter=` vs `?status=`)
- Image URLs are host-relative (`/storage/...`); `Storage::url()` builds absolute URLs
  from `APP_URL` and breaks on other hosts/ports

## Middleware

- `admin` alias → `AdminMiddleware` (checks `->isAdmin()`)
- Applied to all `/admin/*` routes

## Database

- SQLite at `database/database.sqlite` (dev)
- 21 migrations total
- Key tables: users, events, memories, destinations, destination_images, announcements,
  submissions, reactions, memory_albums, likes, comments, village_info, categories,
  products, gallery_photos, polls, poll_votes, contact_messages
- `GallerySeeder` generates its own JPEGs into `storage/app/public/gallery` (that path is
  gitignored), so `migrate:fresh --seed` always yields a gallery that actually renders

## Seeder accounts

| Role  | Email                | Password |
|-------|---------------------|----------|
| Admin | admin@desamuneng.id | password |
| Warga | warga@desamuneng.id | password |

## LSP false positives

PHP LSP (Intelephense) shows "Undefined type" errors for cross-model references and trait methods (`morphMany`). These are **false positives** — the code runs correctly. Ignore them.

## External assets

- Hero background: Unsplash rice field image (hotlinked, free)
- Map: OpenStreetMap embed iframe
- Fonts: Figtree via fonts.bunny.net
