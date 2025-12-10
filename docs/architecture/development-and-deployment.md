# Development and Deployment

## Local Development Setup

```bash
cd netmonitor
npm install

# Web development (no Tauri/Capacitor features)
npm start                    # Serves at localhost:4200

# Desktop development (with Tauri)
npm run tauri:dev           # Starts Tauri dev server

# Android development
npx cap sync android        # Sync web assets
npx cap open android        # Open in Android Studio
# OR
ionic cap run android -l    # Live reload on device
```

## Build Commands

| Command | Output | Notes |
|---------|--------|-------|
| `npm run build` | `www/` | Angular production build |
| `npm run tauri build` | `src-tauri/target/release/bundle/` | Desktop bundles |
| `npx cap sync android` | Syncs to `android/` | Required before Android build |
| `cd android && ./gradlew assembleRelease` | APK in `app/build/outputs/` | Requires signing |

## CI/CD Pipeline

GitHub Actions workflow triggers on version tags (`v*`):
- `release-linux` - AppImage, .deb
- `release-windows` - .exe, .msi
- `release-macos` - .app, .dmg
- `release-android` - .apk, .aab

**See:** `docs/RELEASE_PROCESS.md` for full details.
