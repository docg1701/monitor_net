# Technical Assumptions

## Repository Structure: Monorepo
The project will be a single repository (Monorepo style) containing the Angular web app source, the Capacitor Android configuration, and the Electron wrapper configuration all within the same project root.

## Service Architecture: Monolith
The application is a client-side Monolith. All logic (Monitoring Service, UI Components, State Management) resides within the single Angular application bundle.

## Testing Requirements
*   **Unit Testing**: Standard Angular testing (Jasmine/Karma) for Services and Components.
*   **Integration/Platform Verification**: Manual verification steps defined in stories to ensure `HttpClient` and UI layout function correctly on Android and Electron targets.

## Additional Technical Assumptions and Requests
*   **Stack**: Angular 17+, Ionic 7+, Capacitor 5+, Electron LTS.
*   **Strict Mode**: TypeScript `strict: true` is mandatory.
*   **State Management**: RxJS `BehaviorSubject` (No Redux/NgRx).
*   **Networking**: Angular `HttpClient` (HEAD requests) only.
*   **File Structure**: Standard Angular CLI structure (`src/app/models`, `src/app/services`, `src/app/home`).
