# Security and Privacy

## Core Privacy Requirements (NFR4)

All user data SHALL remain **100% local** - no telemetry or data transmission to external servers.

**Allowed Exceptions:**
- `ipify.org` - Read-only IP lookup for export feature
- `AdMob` - Mobile ads only (no user data sent)

## Data Storage

| Data Type | Storage Location | Encryption |
|-----------|------------------|------------|
| Ping results | SQLite database | None (local only) |
| User settings | SQLite database | None (local only) |
| User info | SQLite database | None (local only) |
| Connection info | SQLite database | None (local only) |
| Theme preference | localStorage | None |

## Data Retention

- **Default:** 30 days
- **Configurable:** 7, 14, 30, 60, 90 days (Story 4.2)
- **Auto-cleanup:** Runs on app startup
- **Manual clear:** Users can delete all data via Reports tab (Story 3.4)

## User Control

- **Clear Data (Story 3.4):**
  - Confirmation dialog required
  - Clears: pings, outages, IP history
  - Preserves: user settings, user info, connection info

- **Export Control:**
  - Users choose when to export
  - Export files stored locally by user
  - No automatic uploads

## Offline Operation (NFR5)

App works fully offline except:
- IP lookup (silently fails if unreachable)
- AdMob ads (mobile only)
- Geolocation (optional, requires user permission)

---
