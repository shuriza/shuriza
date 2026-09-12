---
paths:
  - 'app/Http/Controllers/**'
---

# Controllers

## Use plain multi-method controllers
Group related HTTP actions as named methods on conventional controllers. Do not introduce invokable or resource controllers unless the surrounding area already uses them.

## Delegate workflow logic to services
Put queue workflow and mutation rules in injected service classes. Keep controllers focused on route-bound inputs, responses, redirects, and flash messaging.

## Query Eloquent directly
Build application queries directly with Eloquent in controllers and services. Do not introduce repository or query-object layers for ordinary model reads and writes.

## Eager-load at the call site
Eager-load relationships where the query or workflow needs them with with(), load(), or loadMissing(). Leave models free of default $with relationship lists.
