---
paths:
  - 'database/migrations/**'
---

# Migrations

## Keep integer primary keys with secondary UUIDs
For syncable domain models, keep the integer primary key and add a generated uuid column via HasUuids uniqueIds(). Use UUID fields for external sync references, not local foreign-key IDs.

## Use foreignId constrained foreign keys
Define foreign keys with explicit foreignId(...)->constrained() columns. Chain the intended delete behavior on the same fluent definition.

## Persist domain enums as strings
Define domain enums under App\Enums as string-backed enums with PascalCase cases and small behavior methods. Store their values in string columns and cast owning model attributes to the backed enum.
