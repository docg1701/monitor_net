# Development and Deployment

## Local Development Setup
- `ng serve`: Starts the Angular development server (remains unchanged).
- `npm run electron:start`: Builds Angular and runs Electron (to be replaced by Tauri's dev workflow).

## Build and Deployment Process
- **Current Desktop Build**: `npm run build && electron-builder` (or similar) is used for Electron desktop packages.
- **New Desktop Build**: `ng build` (for Angular) followed by `cargo tauri build` will be the new process.
- **Android Build**: `ionic cap run android` (remains unchanged).
