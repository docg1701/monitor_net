# NetMonitor Enterprise (Modernização) Product Requirements Document (PRD)

## Goals and Background Context

### Goals
*   Deliver a native-feeling application for Android, Linux, and Windows.
*   Eliminate "dependency hell" and permission issues (Root/ICMP) by using HTTP Head requests.
*   Ensure strict type safety and maintainability using TypeScript and Angular Standalone components.
*   Replicate the core functionality of the legacy Python tool in a modern, robust web stack.

### Background Context
The "NetMonitor Enterprise" project is a brownfield modernization of an existing Python-based network monitoring tool (`monitor_net.py`). The current implementation faces significant limitations regarding cross-platform distribution, particularly on Android, and relies on varying system permissions (root) for ICMP pings across different operating systems.

This project aims to solve these distribution and stability challenges by rewriting the application using "The Boring Stack": Angular (v21+), Ionic Framework (v8+), Capacitor (v7+), and Electron (v39+). The goal is to provide a stable, consistent, and easy-to-distribute application that functions identically across mobile and desktop platforms without requiring complex runtime environments or elevated permissions.

### Change Log
| Date       | Version | Description                 | Author  |
| :--------- | :------ | :-------------------------- | :------ |
| 2025-12-03 | 1.0     | Initial PRD Drafting        | PM      |
| 2025-12-03 | 1.1     | Restructuring to Template   | PO      |

## Requirements

### Functional
*   **FR1**: The application shall perform network monitoring using HTTP/TCP HEAD requests to measure latency.
*   **FR2**: The application shall display real-time and historical ping results (last 50 pings).
*   **FR3**: The application shall display latency statistics (Current, Average, Min, Max, Jitter) in a grid of cards.
*   **FR4**: The application shall provide a user interface with an action button to start and stop the monitoring process.
*   **FR5**: The application shall be runnable natively on Android (via Capacitor) and Desktop (Linux .AppImage, Windows .exe via Electron).
*   **FR6**: The application shall support Dark Mode as the mandatory theme.
*   **FR7**: The application shall display a header with the title "NetMonitor" and a status badge (Online/Offline).
*   **FR8**: The application shall display a line graph using `ng2-charts` and `chart.js` for latency visualization, occupying the central part of the screen.
*   **FR9**: The application shall handle HTTP request failures (timeout/network error) by recording them as "Packet Loss" (null latency or error flag) without crashing, and emit the updated state.

### Non Functional
*   **NFR1**: The application shall be built using Angular (v21+), utilizing Standalone Components, and TypeScript with `strict: true` mode activated.
*   **NFR2**: The application UI shall be built using Ionic Framework (v8+) and adhere to its responsive design principles, primarily using Ionic's Grid and Utility components for layout.
*   **NFR3**: The application shall utilize Angular's native `HttpClient` for all network requests; external libraries like Axios or Fetch are prohibited.
*   **NFR4**: The application shall use RxJS `BehaviorSubject<PingResult[]>` for state management, maintaining a history of the last 50 pings without using Redux/NgRx.
*   **NFR5**: The application shall use RxJS `timer` or `interval` operators for the polling loop, ensuring clean cancellation (`unsubscribe`) to prevent memory leaks.
*   **NFR6**: The core business logic and UI shall be 100% shared and function identically across Android and Desktop platforms.
*   **NFR7**: The application's codebase must compile in strict mode (`strict: true`) without any type errors.
*   **NFR8**: The project shall adhere to "The Boring Stack" philosophy, prioritizing long-term stability, maintainability, and zero broken dependencies.

## User Interface Design Goals

### Overall UX Vision
The UX vision is to provide a "Native Utility" feel. The application should look and behave like a built-in system tool on both Android and Desktop. It implies simplicity, high contrast (Dark Mode), and immediate feedback. The adoption of Ionic's design system (Material Design / iOS Cupertino adaptive styles) will ensure this consistency without custom styling overhead.

### Key Interaction Paradigms
*   **Single Action Control**: The primary interaction is the "Start/Stop" toggle.
*   **Real-Time Visualization**: Passive consumption of data via the live chart and updating statistics cards.
*   **Responsive Layout**: Automatic adaptation from vertical (mobile) to grid/dashboard (desktop) layouts using Ionic Grid.

### Core Screens and Views
*   **Home Screen**: The single, primary dashboard containing:
    *   Header with Status
    *   Main Latency Chart
    *   Statistics Grid (Current, Avg, Min, Max, Jitter)
    *   Footer Control (Start/Stop Button)

### Accessibility
*   **Level**: WCAG AA
*   **Implementation**: Native Ionic components handle most accessibility attributes (ARIA labels, focus states) out of the box. High contrast from mandatory Dark Mode aids visibility.

### Branding
*   **Theme**: Strictly **Dark Mode**. The application must initialize in dark mode and potentially lock to it if system settings differ.
*   **Style**: Minimalist, utility-focused.

### Target Device and Platforms
*   **Platforms**: Cross-Platform (Android, Linux, Windows)
*   **Form Factors**: Mobile (Phone/Tablet) and Desktop (Windowed).

## Technical Assumptions

### Repository Structure: Monorepo
The project will be a single repository (Monorepo style) containing the Angular web app source, the Capacitor Android configuration, and the Electron wrapper configuration all within the same project root.

### Service Architecture: Monolith
The application is a client-side Monolith. All logic (Monitoring Service, UI Components, State Management) resides within the single Angular application bundle.

### Testing Requirements
*   **Unit Testing**: Standard Angular testing (Jasmine/Karma) for Services and Components.
*   **Integration/Platform Verification**: Manual verification steps defined in stories to ensure `HttpClient` and UI layout function correctly on Android and Electron targets.

### Additional Technical Assumptions and Requests
*   **Stack**: Angular 21+, Ionic 8+, Capacitor 7+, Electron 39+.
*   **Strict Mode**: TypeScript `strict: true` is mandatory.
*   **State Management**: RxJS `BehaviorSubject` (No Redux/NgRx).
*   **Networking**: Angular `HttpClient` (HEAD requests) only.
*   **File Structure**: Standard Angular CLI structure (`src/app/models`, `src/app/services`, `src/app/home`).

## Epic List

*   **Epic 1: NetMonitor Enterprise Modernization**: Rebuild the network monitoring tool as a robust, cross-platform application using Angular, Ionic, Capacitor, and Electron.

## Epic Details

### NetMonitor Enterprise Modernization
**Goal**: Rebuild the `monitor_net.py` tool as a robust, cross-platform (Android/Linux/Windows) application using Angular, Ionic, Capacitor, and Electron, eliminating dependency issues and ensuring strict type safety.

The new application must function independently of the legacy Python script. Network logic must use standard HTTP HEAD requests to ensure compatibility across Android and Desktop without root permissions. The codebase must be unified (Single Source of Truth) in `src/` and deployable to all target platforms.

#### Project Scaffolding & Configuration
**As a** Developer,
**I want** to initialize the Angular/Ionic project with Capacitor and Electron support and configure the build scripts,
**so that** I have a stable foundation for cross-platform development and distribution.

**Acceptance Criteria**:
1.  Project initialized with `ionic start netmonitor blank --type=angular --capacitor`.
2.  Strict mode enabled (`strict: true`) in `tsconfig.json`.
3.  Electron support added with a basic `electron/main.js` that loads the app.
4.  `package.json` scripts configured for `electron:start` and `android:run`.
5.  Project builds successfully for Web and launches in Electron shell.

#### Core Monitoring Service Implementation
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

#### User Interface Implementation (Home Screen)
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

#### Android & Desktop Integration Verification
**As a** User,
**I want** to run the application on my Android device and Linux/Windows desktop,
**so that** I can use the tool in my preferred environment without configuration issues.

**Acceptance Criteria**:
1.  Android build (`ionic cap run android`) functions correctly on a device/emulator.
2.  Electron build (`npm run electron:start`) functions correctly on the development machine.
3.  Network requests work successfully on both platforms (no CORS/Permission blocks for standard targets).
4.  App layout handles platform-specific safe areas (status bars, window chrome) correctly.

## Checklist Results Report

### Validation Summary
*   **Project Type**: Brownfield (Rewrite/Modernization) with UI.
*   **Overall Readiness**: 98%
*   **Decision**: **APPROVED**
*   **Critical Blocking Issues**: 0

### Analysis
*   **Integration Risk**: Low. The strategy is "Replacement", effectively decoupling the new system from the old one's constraints.
*   **Existing System Impact**: None. The Python script remains untouched.
*   **MVP Completeness**: The scope is tight and focused. It replicates the core value of the Python script (latency monitoring + graphing) without feature creep.
*   **Developer Clarity**: High. Specific commands and library choices are provided.

## Next Steps

### 8.1 UX Expert Prompt
`@ux-expert` Please review the UI Design Goals in `docs/prd.md` and the `docs/architecture.md`. Create a specific UI specification or wireframe description for the "Home Screen" if needed, focusing on the layout of the Chart and Statistics Grid within the Ionic framework constraints.

### 8.2 Architect Prompt
`@architect` Please review the updated `docs/prd.md` and `docs/architecture.md`. Ensure the "Monolith" Angular architecture and "MonitorService" design are clearly defined in the sharded architecture documents. Confirm the directory structure matches the standard Angular CLI approach as requested.
