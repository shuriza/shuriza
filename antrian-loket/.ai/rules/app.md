---
paths:
  - 'app/**'
---

# App

## Acquire collaborators through injection
Acquire application collaborators through constructor or method injection. Reserve service-location for framework bootstrapping boundaries where injection is not available.

## Use direct service calls for workflows
Call collaborating services directly for business workflows. Do not introduce Events and Listeners as the default decoupling layer for these paths.

## Keep a flat role-based App namespace
Keep application code in flat App role-based namespaces that mirror top-level folders. Do not introduce Domain, Modules, or bounded-context roots for new code.

## Prefer helpers for helper-backed interactions
Use helpers such as config(), view(), redirect(), back(), now(), and filled() for helper-backed framework interactions. Keep facades for facade-centric APIs such as DB, Http, Log, System, and Window.
