# Requirements

## Functional
- FR1: The system must compile the existing Angular frontend into a Tauri-compatible desktop application.
- FR2: The `electron-builder` dependency and configuration must be completely removed.
- FR3: The application must use `src-tauri` for the backend configuration.
- FR4: The application must launch on Linux using WebKitGTK.
- FR5: The application must support two distinct visual themes: Light and Dark.
- FR6: The UI must include a toggle button to change the active theme.
- FR7: The selected theme must be persisted.
- **FR8**: The CI/CD pipeline (or manual release process) must generate valid installable artifacts for Windows (.msi/.exe), Linux (.AppImage/.deb), macOS (.app/.dmg), and Android (.apk).
- **FR9**: All artifacts must be published to a GitHub Release tagged `v1.0.0`.

## Non Functional
- NFR1: The final Linux AppImage/Deb must be < 20MB.
- NFR2: Theme switching must occur immediately without page reload.
- **NFR4**: macOS builds must be signed (or notarized if possible, otherwise explicitly documented as unsigned).
- **NFR5**: Android release must be a signed APK or App Bundle suitable for sideloading or Play Store.

## Compatibility Requirements
- CR1: API Compatibility: Frontend must operate without Electron IPC.
- CR2: Android Compatibility: Mobile build must also support the new theming system.
- CR3: Developer Experience: `ng serve` must support theme testing.
