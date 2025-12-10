# Quick Reference - Key Files and Entry Points

## Critical Files for Understanding the System

| Purpose | File Path | Notes |
|---------|-----------|-------|
| **Angular Entry** | `netmonitor/src/main.ts` | Bootstraps AppModule |
| **App Module** | `netmonitor/src/app/app.module.ts` | NgModule-based (NOT standalone) |
| **App Component** | `netmonitor/src/app/app.component.ts` | Root component, `standalone: false` |
| **App Routing** | `netmonitor/src/app/app-routing.module.ts` | Single route to home |
| **Monitor Page** | `netmonitor/src/app/home/home.page.ts` | Main UI, standalone component |
| **Monitor Service** | `netmonitor/src/app/services/monitor.service.ts` | Core ping logic |
| **Tauri Service** | `netmonitor/src/app/services/tauri.service.ts` | Tauri IPC wrapper |
| **Tauri Backend** | `netmonitor/src-tauri/src/lib.rs` | Rust ping command |
| **Tauri Config** | `netmonitor/src-tauri/tauri.conf.json` | App metadata, window config |
| **Capacitor Config** | `netmonitor/capacitor.config.ts` | Mobile app config |
| **Theme Variables** | `netmonitor/src/theme/variables.scss` | CSS custom properties |
| **Environment** | `netmonitor/src/environments/environment.ts` | Runtime config |

## Enhancement Impact Areas

Based on the PRD, these areas will be modified or created:

**Files to Modify:**
- `app.component.html` - Add `ion-tabs` wrapper
- `app-routing.module.ts` - Convert to tab-based routing
- `monitor.service.ts` - Add database persistence calls
- `AndroidManifest.xml` - Add AdMob, geolocation permissions
- `Cargo.toml` - Add `tauri-plugin-sql`
- `lib.rs` - Register SQL plugin, possibly modify ping target handling

**New Files Needed:**
- `src/app/tabs/` - Tab container component
- `src/app/settings/` - Settings page
- `src/app/reports/` - Reports page
- `src/app/services/database.service.ts` - SQLite abstraction
- `src/app/services/settings.service.ts` - Settings management
- `src/app/services/export.service.ts` - JSON/prompt export
- `src/app/services/ip.service.ts` - Public IP lookup
- `src/app/services/ad.service.ts` - AdMob wrapper (mobile)
- `src/app/models/settings.interface.ts` - Settings data model

---
