---
paths:
  - 'tests/**'
---

# Tests

## Use PHPUnit class tests
Write tests as PHPUnit classes extending Tests\TestCase. Prefer public test_* methods over Pest closure syntax.

## Exercise first-party collaborators directly
Use real first-party services and collaborators in tests. Fake only framework or external facades when isolating boundaries.
