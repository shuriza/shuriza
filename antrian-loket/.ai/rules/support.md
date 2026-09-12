---
paths:
  - 'app/Support/**'
---

# Support

## Use idempotent helpers for repeatable writes
For repeatable setup and state writes, use Eloquent idempotent helpers keyed by the natural unique identifier. Prefer updateOrCreate, firstOrNew, or insertOrIgnore over blind inserts.

## Keep runtime helpers injectable
Place custom runtime helpers in app/Support as injectable classes. Do not add global helper functions for application state such as device identity.
