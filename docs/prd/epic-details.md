# Epic Details

## NetMonitor Enterprise Modernization
**Goal**: Rebuild the `monitor_net.py` tool as a robust, cross-platform (Android/Linux/Windows) application using Angular, Ionic, Capacitor, and Electron, eliminating dependency issues and ensuring strict type safety.

The new application must function independently of the legacy Python script. Network logic must use standard HTTP HEAD requests to ensure compatibility across Android and Desktop without root permissions. The codebase must be unified (Single Source of Truth) in `src/` and deployable to all target platforms.

### Project Scaffolding & Configuration
**As a** Developer,
**I want** to initialize the Angular/Ionic project with Capacitor and Electron support and configure the build scripts,
**so that** I have a stable foundation for cross-platform development and distribution.

**Acceptance Criteria**:
1.  Project initialized with `ionic start netmonitor blank --type=angular --capacitor`.
2.  Strict mode enabled (`strict: true`) in `tsconfig.json`.
3.  Electron support added with a basic `electron/main.js` that loads the app.
4.  `package.json` scripts configured for `electron:start` and `android:run`.
5.  Project builds successfully for Web and launches in Electron shell.

### Core Monitoring Service Implementation
**As a** Developer,
**I want** to implement the `MonitorService` using `HttpClient` and RxJS,
**so that** I can reliably measure network latency and manage application state without external dependencies.

**Acceptance Criteria**:
1.  `MonitorService` created as a singleton.
2.  `measureLatency` function implements HTTP HEAD request logic.
3.  State managed via `BehaviorSubject<PingResult[]>` (last 50 results).
4.  Polling loop implemented with RxJS `timer`/`interval` with clean cancellation.
5.  Error handling records "Packet Loss" correctly.
6.  Unit tests verify latency calculation and error handling.

### User Interface Implementation (Home Screen)
**As a** User,
**I want** to see the dashboard with the status, chart, and statistics,
**so that** I can monitor network performance in real-time.

**Acceptance Criteria**:
1.  `home.page.html` implemented using `ion-grid`, `ion-card`, `ion-header`, `ion-content`.
2.  Dark Mode theme applied and active by default.
3.  Line chart (`ng2-charts`) displays latency history.
4.  Statistics cards (Current, Avg, Min, Max, Jitter) update in real-time.
5.  Start/Stop button controls the monitoring service.
6.  UI is responsive on both mobile and desktop viewports.

### Android & Desktop Integration Verification
**As a** User,
**I want** to run the application on my Android device and Linux/Windows desktop,
**so that** I can use the tool in my preferred environment without configuration issues.

**Acceptance Criteria**:
1.  Android build (`ionic cap run android`) functions correctly on a device/emulator.
2.  Electron build (`npm run electron:start`) functions correctly on the development machine.
3.  Network requests work successfully on both platforms (no CORS/Permission blocks for standard targets).
4.  App layout handles platform-specific safe areas (status bars, window chrome) correctly.
