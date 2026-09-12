---
paths:
  - 'database/seeders/**'
---

# Seeders

## Use idempotent helpers for repeatable writes
For repeatable setup and state writes, use Eloquent idempotent helpers keyed by the natural unique identifier. Prefer updateOrCreate, firstOrNew, or insertOrIgnore over blind inserts.
