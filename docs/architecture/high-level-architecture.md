# High Level Architecture

## Technical Summary
The NetMonitor application currently utilizes an Ionic/Angular frontend, packaged with Capacitor for Android, and Electron for desktop builds. The desktop build is monolithic, bundling Chromium and Node.js. The proposed change involves replacing Electron with Tauri, which leverages native webviews and a Rust backend, drastically reducing the desktop binary footprint.

## Actual Tech Stack (Current State)

| Category | Technology | Version | Notes |
| :--- | :--- | :--- | :--- |
| Frontend Framework | Angular | ~21 | Used across all platforms (Web, Android, Desktop) |
| UI Framework | Ionic | ~8 | Provides UI components for cross-platform consistency |
| Mobile Container | Capacitor | ~7 | Used for Android builds |
| Desktop Container | Electron | ~39 | **Target for removal/replacement** (bloated desktop build) |
| Desktop Builder | electron-builder | ~26 | **Target for removal/replacement** |
| Languages | TypeScript, JavaScript | | For frontend and Electron main process |
| Package Manager | npm/yarn | | (Based on `package-lock.json`) |

## Repository Structure Reality Check
- Type: Hybrid (Monorepo-like for app, separate mobile/desktop build tools)
- Package Manager: npm (implied by `package-lock.json`)
- Notable: Contains `src/` for Angular, `electron/` for desktop, `android/` for mobile. `node_modules` are shared.
