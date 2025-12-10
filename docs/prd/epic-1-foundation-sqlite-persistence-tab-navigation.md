# Epic 1: Foundation - SQLite Persistence & Tab Navigation

**Epic Goal:** Establish the data persistence layer and restructure the app from single-page to tab-based navigation, enabling all subsequent features.

**Integration Requirements:**
- SQLite must work on both Tauri (desktop) and Capacitor (mobile)
- Existing Monitor functionality must remain fully operational
- Tab navigation must support lazy loading for performance

---

## Story 1.0: Create Regression Test Suite (PREREQUISITE)

> **As a** developer,
> **I want** a comprehensive regression test suite for existing functionality,
> **so that** I can verify no features are broken during the enhancement implementation.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | Unit tests for `MonitorService`: `startMonitoring()`, `stopMonitoring()`, `measureLatency()`, `results$` observable |
| AC2 | Unit tests for `HomePage`: stats calculation (`updateStats()`), chart data binding, theme toggle |
| AC3 | Tests verify ping result processing: ok status, error status, null latency handling |
| AC4 | Tests verify statistics calculation: average, min, max, jitter with exponential smoothing |
| AC5 | Tests verify chart updates with new data points (50-point history limit) |
| AC6 | Tests verify dark/light theme toggle persists to localStorage |
| AC7 | Test coverage report generated with minimum 80% coverage on existing services |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | All tests pass on web (Chrome/Chromium headless) |
| IV2 | Tests can run in CI pipeline (`npm test -- --no-watch --browsers=ChromeHeadless`) |
| IV3 | Test execution time < 30 seconds |

### Test Cases Specification

| Test ID | Component | Test Description |
|---------|-----------|------------------|
| RT-001 | MonitorService | Should emit ping results via results$ observable |
| RT-002 | MonitorService | Should maintain maximum 50 results in history |
| RT-003 | MonitorService | Should correctly detect Tauri platform |
| RT-004 | MonitorService | Should correctly detect Capacitor platform |
| RT-005 | HomePage | Should calculate average latency correctly |
| RT-006 | HomePage | Should calculate min/max latency correctly |
| RT-007 | HomePage | Should calculate jitter with exponential smoothing |
| RT-008 | HomePage | Should filter error results from statistics |
| RT-009 | HomePage | Should update chart data on new results |
| RT-010 | HomePage | Should toggle theme and persist to localStorage |
| RT-011 | HomePage | Should apply ion-palette-dark class for dark theme |
| RT-012 | HomePage | Should load theme preference on init |

---

## Story 1.1: Create Abstract Database Service Layer

> **As a** developer,
> **I want** a platform-agnostic database service interface,
> **so that** I can write business logic once and have it work on both desktop and mobile.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | `DatabaseService` abstract class defines methods: `init()`, `execute()`, `select()`, `close()` |
| AC2 | `TauriDatabaseService` implements the interface using `@tauri-apps/plugin-sql` |
| AC3 | `CapacitorDatabaseService` implements the interface using `@capacitor-community/sqlite` |
| AC4 | Angular DI provides correct implementation based on platform detection |
| AC5 | Database file is created at platform-appropriate location (app data directory) |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Existing `MonitorService` continues to function without database (no regression) |
| IV2 | Platform detection correctly identifies Tauri vs Capacitor vs Web |
| IV3 | Service initializes without blocking app startup |

---

## Story 1.2: Implement SQLite Schema and Migrations

> **As a** developer,
> **I want** a versioned database schema with migration support,
> **so that** future schema changes can be applied safely to existing installations.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | `pings` table created with columns: `id`, `timestamp`, `latency_ms`, `success`, `target` |
| AC2 | `settings` table created with columns: `key`, `value` |
| AC3 | Index created on `pings.timestamp` for query performance |
| AC4 | Migration system tracks schema version in database |
| AC5 | Migrations run automatically on app startup |
| AC6 | Migration failures are logged and don't crash the app |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Fresh install creates schema correctly on both platforms |
| IV2 | App upgrade with existing database applies migrations without data loss |
| IV3 | Database operations complete within acceptable time (<100ms for single inserts) |

---

## Story 1.3: Integrate Ping Persistence into MonitorService

> **As a** user,
> **I want** my ping results automatically saved to the database,
> **so that** I can view historical data and generate reports later.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | Each ping result is persisted to SQLite immediately after measurement |
| AC2 | Database writes are non-blocking (don't delay next ping) |
| AC3 | Failed database writes are logged but don't stop monitoring |
| AC4 | Ping results include all fields: timestamp, latency_ms, success (boolean), target |
| AC5 | Historical data survives app restart |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Real-time chart continues updating at same refresh rate |
| IV2 | Memory usage remains stable (no accumulation from DB operations) |
| IV3 | App startup time not significantly impacted (<500ms additional) |

---

## Story 1.4: Implement Tab-Based Navigation Structure

> **As a** user,
> **I want** tab navigation at the bottom of the screen,
> **so that** I can easily switch between Monitor, Settings, and Reports.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | `ion-tabs` component with 3 tabs: Monitor, Settings, Reports |
| AC2 | Tab icons use Ionicons: `pulse-outline`, `settings-outline`, `document-text-outline` |
| AC3 | Active tab is visually highlighted |
| AC4 | Tab routes are lazy-loaded for performance |
| AC5 | Current Monitor page relocated to `/tabs/monitor` route |
| AC6 | Placeholder pages created for Settings and Reports tabs |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Existing Monitor functionality works identically in new tab location |
| IV2 | Theme toggle (dark/light) continues working across all tabs |
| IV3 | Navigation state preserved when switching tabs (monitoring continues) |

---

## Story 1.5: Add Data Retention and Cleanup

> **As a** user,
> **I want** old monitoring data automatically cleaned up,
> **so that** the database doesn't grow indefinitely and slow down my device.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | Default retention period is 30 days |
| AC2 | Cleanup runs on app startup (after migrations) |
| AC3 | Cleanup deletes pings older than retention period |
| AC4 | Cleanup is logged with count of deleted records |
| AC5 | Retention period will be configurable in Settings (future story) |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Recent data (<30 days) is preserved after cleanup |
| IV2 | Cleanup completes within reasonable time (<2s for 100k records) |
| IV3 | App remains responsive during cleanup operation |

---
