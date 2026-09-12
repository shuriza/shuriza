---
paths:
  - 'app/Models/**'
---

# Models

## Use mass-assignment allow lists
Define mass-assignable model attributes with allow lists. Do not switch models to guarded block lists.

## Keep integer primary keys with secondary UUIDs
For syncable domain models, keep the integer primary key and add a generated uuid column via HasUuids uniqueIds(). Use UUID fields for external sync references, not local foreign-key IDs.

## Use local scopes for reusable filters
Put reusable Eloquent filters on models as local scopeXxx methods. Do not add custom builder classes for ordinary query scopes.

## Persist domain enums as strings
Define domain enums under App\Enums as string-backed enums with PascalCase cases and small behavior methods. Store their values in string columns and cast owning model attributes to the backed enum.
