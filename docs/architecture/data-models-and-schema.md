# Data Models and Schema

## Database Tables

### pings (primary monitoring data)

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| timestamp | INTEGER | Unix timestamp (indexed for query performance) |
| latency_ms | REAL | Latency in milliseconds (nullable for errors) |
| success | INTEGER | 1 = ok, 0 = error |
| target | TEXT | Ping destination address |

**Index:** `CREATE INDEX idx_pings_timestamp ON pings(timestamp)`

### settings (application configuration)

| Column | Type | Description |
|--------|------|-------------|
| key | TEXT | Primary key, setting identifier |
| value | TEXT | JSON-encoded setting value |

**Example keys:** `ping_target`, `ping_interval`, `region`, `user_info`, `connection_info`, `retention_days`

### outages (network interruption tracking)

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| start_time | INTEGER | Unix timestamp of outage start |
| end_time | INTEGER | Unix timestamp of outage end (nullable if ongoing) |
| duration_ms | INTEGER | Calculated duration in milliseconds |
| ip_before | TEXT | Public IP at outage start (optional) |
| ip_after | TEXT | Public IP at outage end (optional) |

## Schema Integration Strategy

**Migration Approach:**
- Version 1: Create `pings` and `settings` tables (Story 1.2)
- Version 2: Add `outages` table (Story 3.2)
- Each migration checks current version before applying
- Migrations are idempotent and non-destructive

**Backward Compatibility:**
- Existing app data preserved during upgrades
- Schema version tracked in settings table
- Failed migrations logged but don't crash app

---

## Repository Structure Reality Check

- **Type:** Monorepo (single `netmonitor/` folder contains all platforms)
- **Package Manager:** npm (package-lock.json present)
- **Notable:**
  - Angular output goes to `www/` (Ionic convention)
  - Tauri looks for frontend in `../www` relative to `src-tauri/`
  - Android project in `android/`, iOS in `ios/`

---
