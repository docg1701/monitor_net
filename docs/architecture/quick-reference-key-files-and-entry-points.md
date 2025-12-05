# Quick Reference - Key Files and Entry Points

## Critical Files for Understanding the System
- **Main Entry (Angular)**: `netmonitor/src/main.ts` (Angular bootstrap)
- **Main Entry (Electron)**: `netmonitor/electron/main.js` (Electron's main process, to be removed)
- **Configuration (Angular)**: `netmonitor/angular.json`, `netmonitor/tsconfig.json`
- **Configuration (Electron)**: `netmonitor/electron/main.js` (contains Electron window config), `netmonitor/package.json` (`"build"` section)
- **Core Business Logic (Angular)**: `netmonitor/src/app/` (components, services, modules)
- **Build Scripts**: `netmonitor/package.json` (`"scripts"`), `netmonitor/angular.json`
- **Capacitor Configuration**: `netmonitor/capacitor.config.ts`, `netmonitor/ionic.config.json`

## Enhancement Impact Areas
- `netmonitor/electron/`: This entire directory and its contents will be removed.
- `netmonitor/package.json`: Dependencies (`electron`, `electron-builder`) will be removed; build scripts will be updated; a new `tauri:dev` script will be added.
- `netmonitor/src/`: The Angular frontend will remain largely unchanged, but its build output (`www` or `dist` folder) will be consumed by Tauri.
- Project root: A new `src-tauri/` directory will be created, containing Tauri's configuration (`tauri.conf.json`) and Rust backend code.
