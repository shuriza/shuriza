# Multi Brain Session Index

## Purpose
Use this file first for short-lived project memory. Read this before broader repository exploration, then open the most relevant bucket in `.multibrain/indexes/`.

## Active Buckets
- `agents` - agent/tooling setup, repo instructions, and AI workflow notes
- `ui-refactor` - public website visual direction, responsive QA, and reusable UI decisions
- `completion` - final feature pass: bug fixes, contact inbox, admin/auth modernization

## Current Notes
- Public site, admin panel, and auth/profile pages now all share the semantic-token design system.
- `/api/*` lives in `routes/web.php`, not a stateless `api` group: those endpoints need the session (reactions/polls key off `session_id`) and CSRF. `routes/api.php` was deleted and `laravel/sanctum` removed — no API tokens are issued.
- Contact form persists to `contact_messages` with a `website` honeypot; admin reviews at `/admin/contacts`.
- Memory detail pages exist at `/kenangan/{id}`; `MemoryCard` links there (previously 404).
- `GallerySeeder` generates its own JPEGs into `storage/app/public/gallery`, so a fresh seed always renders.
- Image URLs are host-relative (`/storage/...`). Never use `Storage::url()` here — it builds absolute URLs from `APP_URL` and breaks on other hosts/ports.
- Frontend/backend prop names must match exactly; several silent bugs came from drift (`totalUsers` vs `totalWarga`, `currentAlbum` vs `filter`, `filter` vs `status`).

## Writing Rules
- Keep entries short and reusable.
- Add one context note when a decision, blocker, or handoff matters.
- Summarize older entries once a bucket gets too long.
