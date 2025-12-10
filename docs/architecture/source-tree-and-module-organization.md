# Source Tree and Module Organization

## Repository Structure

```
NetMonitor/
├── .bmad-core/              # BMAD framework configuration
├── .claude/                 # Claude Code configuration
├── docs/                    # Documentation
│   ├── references/          # Reference documents
│   │   ├── POST-MVP-ROADMAP.md
│   │   └── RELEASE_PROCESS.md
│   ├── architecture.md      # This document
│   └── prd.md              # Product Requirements Document
├── netmonitor/             # Main application source
│   ├── android/            # Capacitor Android project
│   ├── ios/                # Capacitor iOS project
│   ├── src/                # Angular source code
│   ├── src-tauri/          # Tauri/Rust backend
│   └── www/                # Build output
├── icon.svg                # App icon source
├── install_linux.sh        # Linux installer script
└── README.md               # Project overview
```

## Angular Source (`netmonitor/src/`)

```
src/
├── app/
│   ├── home/                    # Monitor page (standalone)
│   │   ├── home.page.ts         # Component + all monitor logic
│   │   ├── home.page.html       # Template with chart + stats cards
│   │   ├── home.page.scss       # Page-specific styles
│   │   ├── home.page.spec.ts    # Unit tests
│   │   └── home-routing.module.ts  # UNUSED - legacy file
│   ├── models/
│   │   └── ping-result.interface.ts  # PingResult type definition
│   ├── services/
│   │   ├── monitor.service.ts       # Core monitoring logic
│   │   ├── monitor.service.spec.ts  # Service tests
│   │   └── tauri.service.ts         # Tauri IPC wrapper
│   ├── app.component.ts         # Root component (NOT standalone)
│   ├── app.component.html       # <ion-router-outlet> only
│   ├── app.component.scss       # Empty
│   ├── app.component.spec.ts    # Smoke test
│   ├── app.module.ts            # NgModule bootstrap
│   └── app-routing.module.ts    # Route configuration
├── assets/                  # Static assets
│   ├── icon/               # PWA icons
│   └── shapes.svg          # Ionic shapes
├── environments/
│   ├── environment.ts      # Development config
│   └── environment.prod.ts # Production config
├── theme/
│   └── variables.scss      # Ionic theme + custom CSS vars
├── global.scss             # Global styles / Ionic imports
├── index.html              # SPA entry point
├── main.ts                 # Angular bootstrap
├── manifest.webmanifest    # PWA manifest
├── polyfills.ts            # Browser polyfills
├── test.ts                 # Test configuration
└── zone-flags.ts           # Zone.js flags
```

## Tauri Source (`netmonitor/src-tauri/`)

```
src-tauri/
├── capabilities/
│   └── default.json        # Tauri capabilities config
├── icons/                  # App icons (all sizes)
├── src/
│   ├── lib.rs             # Main Rust code (ping command)
│   └── main.rs            # Entry point
├── target/                # Build output (gitignored)
├── build.rs               # Build script
├── Cargo.lock             # Rust dependency lock
├── Cargo.toml             # Rust dependencies
└── tauri.conf.json        # Tauri configuration
```

## Key File Responsibilities

| File | Responsibility |
|------|----------------|
| `home.page.ts` | Chart rendering, statistics calculation, theme toggle, monitoring control |
| `monitor.service.ts` | Platform detection, ping measurement, results streaming |
| `tauri.service.ts` | Tauri IPC abstraction for invoke calls |
| `lib.rs` | Rust HTTP HEAD request for latency measurement |
| `variables.scss` | All CSS custom properties for theming |
| `environment.ts` | Runtime configuration (pingUrl) |

## Key Modules and Their Purpose

| Module | Location | Purpose | Pattern |
|--------|----------|---------|---------|
| **HomePage** | `home/home.page.ts` | All monitor UI + logic | Standalone component with `inject()` |
| **MonitorService** | `services/monitor.service.ts` | Ping measurement, results stream | BehaviorSubject, platform detection |
| **TauriService** | `services/tauri.service.ts` | Tauri IPC abstraction | Simple wrapper around `@tauri-apps/api` |
| **AppModule** | `app.module.ts` | Root NgModule | Traditional NgModule pattern |
| **AppComponent** | `app.component.ts` | App shell | `standalone: false` (legacy) |

---
