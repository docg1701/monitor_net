# Requirements

## Functional
*   **FR1**: The application shall perform network monitoring using HTTP/TCP HEAD requests to measure latency.
*   **FR2**: The application shall display real-time and historical ping results (last 50 pings).
*   **FR3**: The application shall display latency statistics (Current, Average, Min, Max, Jitter) in a grid of cards.
*   **FR4**: The application shall provide a user interface with an action button to start and stop the monitoring process.
*   **FR5**: The application shall be runnable natively on Android (via Capacitor) and Desktop (Linux .AppImage, Windows .exe via Electron).
*   **FR6**: The application shall support Dark Mode as the mandatory theme.
*   **FR7**: The application shall display a header with the title "NetMonitor" and a status badge (Online/Offline).
*   **FR8**: The application shall display a line graph using `ng2-charts` and `chart.js` for latency visualization, occupying the central part of the screen.
*   **FR9**: The application shall handle HTTP request failures (timeout/network error) by recording them as "Packet Loss" (null latency or error flag) without crashing, and emit the updated state.

## Non Functional
*   **NFR1**: The application shall be built using Angular (v17+), utilizing Standalone Components, and TypeScript with `strict: true` mode activated.
*   **NFR2**: The application UI shall be built using Ionic Framework (v7+) and adhere to its responsive design principles, primarily using Ionic's Grid and Utility components for layout.
*   **NFR3**: The application shall utilize Angular's native `HttpClient` for all network requests; external libraries like Axios or Fetch are prohibited.
*   **NFR4**: The application shall use RxJS `BehaviorSubject<PingResult[]>` for state management, maintaining a history of the last 50 pings without using Redux/NgRx.
*   **NFR5**: The application shall use RxJS `timer` or `interval` operators for the polling loop, ensuring clean cancellation (`unsubscribe`) to prevent memory leaks.
*   **NFR6**: The core business logic and UI shall be 100% shared and function identically across Android and Desktop platforms.
*   **NFR7**: The application's codebase must compile in strict mode (`strict: true`) without any type errors.
*   **NFR8**: The project shall adhere to "The Boring Stack" philosophy, prioritizing long-term stability, maintainability, and zero broken dependencies.
