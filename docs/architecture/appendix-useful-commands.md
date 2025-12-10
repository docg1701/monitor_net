# Appendix - Useful Commands

## Development

```bash
# Install dependencies
cd netmonitor && npm install

# Start dev server (web)
npm start

# Start Tauri dev
npm run tauri:dev

# Sync Capacitor
npx cap sync

# Open Android Studio
npx cap open android

# Run on connected Android device
ionic cap run android -l --external
```

## Build

```bash
# Production build
npm run build

# Tauri release build
npm run tauri build

# Android release APK
cd android && ./gradlew assembleRelease
```

## Testing

```bash
# Unit tests
npm test

# Lint
npm run lint
```

## Debugging

```bash
# Tauri logs (when running dev)
tail -f tauri.log

# Android logcat
adb logcat | grep -i netmonitor
```
