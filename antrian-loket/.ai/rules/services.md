---
paths:
  - 'app/Services/**'
  - app/Services/SyncService.php
---

# Services

## Use service objects with named domain methods
Put business workflows in service objects and expose named domain methods such as issue(), push(), resolve(), or record(). Do not introduce Action classes or handle()/execute()/__invoke() wrappers for these workflows.

## Query Eloquent directly
Build application queries directly with Eloquent in controllers and services. Do not introduce repository or query-object layers for ordinary model reads and writes.

## Eager-load at the call site
Eager-load relationships where the query or workflow needs them with with(), load(), or loadMissing(). Leave models free of default $with relationship lists.

## Use idempotent helpers for repeatable writes
For repeatable setup and state writes, use Eloquent idempotent helpers keyed by the natural unique identifier. Prefer updateOrCreate, firstOrNew, or insertOrIgnore over blind inserts.

## Record queue mutations through TicketEventRecorder
After local ticket mutations, call TicketEventRecorder so audit rows and outbox entries are written together. For remote imports, use the imported-event path so synced events do not echo back out.

## Preserve revision/device conflict semantics
When changing ticket state, increment revision and stamp origin_device_id from DeviceIdentity. Resolve remote/local ties with ConflictResolver instead of wall-clock ordering.

## Keep SQLite sync write transactions specialized
Use DB::transaction() for ordinary application writes. In SyncService, keep the dedicated write transaction helper that acquires SQLite write access with BEGIN IMMEDIATE.
