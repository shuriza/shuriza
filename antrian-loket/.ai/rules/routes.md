---
paths:
  - 'routes/**'
---

# Routes

## Route HTTP requests to controller methods
Define HTTP routes with controller class-array handlers. Avoid route closures for web endpoints.

## Generate web URLs from named routes
Name web routes and generate internal URLs from route names. Use route(...) in Blade/form actions and redirect()->route(...) in controllers instead of literal paths or action helpers.

## Keep queue mutations on POST routes
Name queue routes with the existing Indonesian loket/tiket/layanan vocabulary. Use GET for pages/previews and POST for every queue or print mutation.
