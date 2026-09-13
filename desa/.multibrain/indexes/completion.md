# Completion Bucket

## Scope
Final pass that took the site from "public pages redesigned" to shippable: real bug fixes,
the missing contact-message feature, and modernization of the admin/auth surfaces.

## Bugs found and fixed
- `LikeButton` posted to `/api/likes` (route is `/api/likes/toggle`) — every like silently failed.
- `CommentSection` posted to `/comments` via Inertia `router.post` against a JSON endpoint; rewritten to axios on `/api/comments` with local state and delete support.
- `CommentController::destroy` and `AnnouncementSeeder` read `$user->is_admin`, a column that does not exist (schema uses enum `role`).
- `/api/reactions/counts` returned **500** ("Session store not set on request"): the `api` middleware group has no `StartSession`, yet the controller calls `$request->session()`.
- `Admin/DestinationController::update` ignored `images[]`; also leaked orphaned files on replace/delete and could 500 on slug collision.
- Sitemap omitted UMKM and memory detail pages.
- `GalleryPhoto` had no `image_url` accessor although the page renders `photo.image_url` — every gallery image was `src={undefined}`.
- `GalleryController` passed `currentAlbum` while the page reads `filter` — album chips never highlighted.
- Admin dashboard passed `totalUsers` but the page reads `totalWarga` — the stat rendered blank.
- Admin Submissions/Memories filter links sent `?filter=` while controllers read `?status=` — filtering did nothing.

## Decisions
- Moved every `/api/*` route into `web.php` under an `api` prefix (route names unchanged) so they get session + CSRF. Deleted `routes/api.php`, dropped its `withRouting(api:)` registration, and removed `laravel/sanctum` (installed but never configured; `auth:sanctum` only worked by accidental cookie fallback).
- Throttled all public write endpoints: contact/submissions/UMKM `6,1`, poll vote `20,1`, reactions `60,1`.
- Contact messages persist to a new `contact_messages` table with a `prohibited` honeypot field, surfaced at `/admin/contacts` plus a dashboard panel.
- Gallery seed images are generated with GD at seed time rather than committed, since `storage/app/public` is gitignored.
- Deleted dead Breeze scaffolding: `Pages/Welcome.tsx`, `Pages/Dashboard.tsx`, and 11 unused top-level `Components/*.tsx`. Only `Modal.tsx` survives (used by `DeleteUserForm`).

## Verification
- `composer test`: 42 tests / 141 assertions pass (was 26 tests, only 1 project-specific).
- `npm run build` and `npx tsc --noEmit` clean.
- Browser QA with Playwright Chromium at 1440x1000 and 390x844: no horizontal overflow on any page; gallery reports 0 broken images; reaction toggle verified on→off with POST 200.
- Authenticated curl sweep: all 16 admin/warga routes return 200; contact form persists end-to-end.

## Gotchas
- Laravel's test client does not replay session cookies across requests, and `phpunit.xml` sets `SESSION_DRIVER=array`. Cross-request session continuity is therefore **not** assertable in feature tests — verify session-scoped behavior (reaction toggle-off) in a browser.
- New Inertia page files require `npm run build` before feature tests pass, otherwise Laravel throws `Unable to locate file in Vite manifest`.
- `hub` process restarts can lose `cwd`; always pass `cwd` explicitly when starting `php artisan serve`.
- On Windows `composer dev` fails because `php artisan pail` needs `pcntl`; run `php artisan serve` + `npm run dev` separately.

## Follow-up
- Replace the hotlinked Unsplash hero with an original optimized photograph of Desa Muneng.
- `telepon` / `email` village info are intentionally seeded empty — fill via admin once official channels exist.
- `polls.votes` JSON column and `memories.category_id` remain unused; `Destination.category` is a varchar enum, so the `type='destination'` rows in `categories` are dead data.
