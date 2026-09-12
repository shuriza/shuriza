---
paths:
  - 'app/Enums/**'
---

# Enums

## Persist domain enums as strings
Define domain enums under App\Enums as string-backed enums with PascalCase cases and small behavior methods. Store their values in string columns and cast owning model attributes to the backed enum.
