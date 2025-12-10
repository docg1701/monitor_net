# Enhancement Impact Analysis

## Files That Will Need Modification

Based on the PRD requirements:

| File | Changes Required |
|------|------------------|
| `app.component.html` | Replace `<ion-router-outlet>` with `<ion-tabs>` structure |
| `app-routing.module.ts` | Convert to tab-based routing with child routes |
| `monitor.service.ts` | Add `DatabaseService` injection, persist pings |
| `lib.rs` | Add `tauri-plugin-sql`, consider removing hardcoded domain |
| `Cargo.toml` | Add `tauri-plugin-sql` dependency |
| `AndroidManifest.xml` | Add `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` permissions |
| `capacitor.config.ts` | Update `appId` to match Tauri |
| `environment.ts` | Add configurable defaults for settings |

## New Files/Modules Needed

```
src/app/
├── tabs/
│   ├── tabs.page.ts           # Tab container
│   ├── tabs.page.html         # ion-tabs structure
│   └── tabs.routes.ts         # Child route definitions
├── monitor/                   # Renamed from home/
│   └── (existing files moved)
├── settings/
│   ├── settings.page.ts
│   ├── settings.page.html
│   └── settings.page.scss
├── reports/
│   ├── reports.page.ts
│   ├── reports.page.html
│   └── reports.page.scss
├── services/
│   ├── database.service.ts    # Abstract + platform implementations
│   ├── settings.service.ts    # Settings CRUD
│   ├── export.service.ts      # JSON/prompt generation
│   ├── ip.service.ts          # ipify.org integration
│   └── ad.service.ts          # AdMob wrapper
└── models/
    ├── settings.interface.ts
    ├── region.interface.ts
    ├── outage.interface.ts
    └── export-data.interface.ts
```

## Integration Considerations

1. **Database Service Abstraction**
   - Create abstract interface
   - `TauriDatabaseService` uses `@tauri-apps/plugin-sql`
   - `CapacitorDatabaseService` uses `@capacitor-community/sqlite`
   - Use `useFactory` provider to select based on platform

2. **Existing Service Compatibility**
   - `MonitorService.results$` interface must remain unchanged
   - Add database persistence as side effect, not replacement

3. **Theme Consistency**
   - All new pages must import and use existing CSS variables
   - Use `ion-palette-dark` class for dark mode

4. **AdMob Mobile-Only**
   - Use platform detection to conditionally load
   - Desktop build should have zero AdMob code/dependencies

---
