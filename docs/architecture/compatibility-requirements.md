# Compatibility Requirements

## CR1: Existing API Compatibility

The `MonitorService` interface SHALL remain unchanged to avoid breaking the Monitor tab.

**Protected Methods:**
- `startMonitoring(intervalMs)` - begin real-time ping measurement
- `stopMonitoring()` - pause real-time ping measurement
- `results$` - Observable stream of PingResult objects

**Implementation Impact:** Internal modifications allowed (add persistence layer), but public interface must remain unchanged. Regression test suite (Story 1.0) verifies these methods continue working identically.

## CR2: Database Schema Compatibility

Initial schema SHALL support forward migration using versioned migrations from day one.

**Migration Strategy:**
- Each schema version numbered sequentially (v1, v2, etc.)
- Migrations idempotent (safe to run multiple times)
- Migration system tracks schema version in database
- Future schema changes applied safely without data loss

## CR3: UI/UX Consistency

New tabs SHALL follow existing Ionic component patterns and dark/light theme support.

**Required Patterns:**
- All components MUST respect `ion-palette-dark` toggle
- Use only Ionic 8 components: `ion-card`, `ion-item`, `ion-input`, `ion-select`, `ion-button`, `ion-list`, `ion-accordion`
- Ionicons for all icons (already imported)
- Forms: `ion-item` + `ion-input`/`ion-select` pattern
- Feedback: `ion-toast` for success/error, `ion-alert` for confirmations

## CR4: Platform Parity

Core functionality SHALL work identically on Desktop (Tauri) and Mobile (Capacitor), with ads being the only mobile-specific feature.

| Feature | Desktop (Tauri) | Mobile (Capacitor) |
|---------|-----------------|-------------------|
| SQLite persistence | tauri-plugin-sql | @capacitor-community/sqlite |
| Settings management | Identical | Identical |
| Reports & export | Identical | Identical |
| Banner ads | None | @capacitor-community/admob |
| Rewarded ads | None | @capacitor-community/admob |
| Geolocation | navigator.geolocation | @capacitor/geolocation |

---
