# UI Refactor Bucket

## Scope
Public website visual direction, shared layout changes, accessibility, and responsive verification.

## Current Direction
- Use a contained photographic hero, quick-access rail, priority banners, fact cards, and compact content grids.
- Preserve the emerald/agrarian identity; borrow information hierarchy rather than reference branding or assets.
- Shared navigation uses a search-centered top row and horizontally scrollable page chips.
- Homepage public submissions remain available without authentication.

## Verification
- `npm run build` passes.
- `composer test` passes with 26 tests and 75 assertions.
- Browser QA passed at 1440x1000 and 390x844 with no horizontal overflow or console errors.

## Follow-up
- Replace the generic Unsplash hero with an optimized original photograph of Desa Muneng when available.

## Auth and warga shell
- Auth, profile, and warga-facing legacy shell now use semantic tokens with the shared Button, Field, Avatar, and public Logo primitives. Legacy Breeze component files and unreachable `Welcome`/`Dashboard` pages were removed after importer checks.
