# Technical Debt and Known Issues

## Critical Technical Debt

1. **Hardcoded Ping Target in Rust Backend**
   - **Location:** `src-tauri/src/lib.rs:15`
   - **Issue:** `ALLOWED_DOMAIN` is hardcoded to `www.google.com`
   - **Impact:** PRD FR3 (configurable ping target) requires Rust changes
   - **Solution:** Expand to whitelist of allowed targets (dropdown selection in UI)

   ```rust
   // Current constraint
   const ALLOWED_DOMAIN: &str = "www.google.com";

   // Will be changed to whitelist:
   const ALLOWED_TARGETS: &[&str] = &[
       "8.8.8.8",           // Google DNS
       "1.1.1.1",           // Cloudflare DNS
       "9.9.9.9",           // Quad9 DNS
       "208.67.222.222",    // OpenDNS
       "www.google.com",    // Google Web
       "www.cloudflare.com" // Cloudflare Web
   ];
   ```

   **Design Decision:** Use dropdown with pre-defined targets instead of free-form input. This maintains security while giving users meaningful choices.

2. **Unused Routing Module**
   - **Location:** `home/home-routing.module.ts`
   - **Issue:** Legacy file from Ionic scaffolding, not used
   - **Impact:** None, but creates confusion
   - **Recommendation:** Delete during cleanup

3. **Inconsistent App ID**
   - **Tauri:** `com.galvani.netmonitor`
   - **Capacitor:** `io.ionic.starter` (default!)
   - **Impact:** Should align before Play Store submission

4. **No Database - All Data In Memory**
   - **Issue:** `MonitorService` keeps last 50 results in BehaviorSubject
   - **Impact:** Data lost on app close - this is the main reason for SQLite enhancement

## Workarounds and Gotchas

| Issue | Workaround | Location |
|-------|------------|----------|
| Chart not updating | Force `cd.detectChanges()` after data update | `home.page.ts:80` |
| Theme not applying to chart | Use `setTimeout(() => ..., 0)` to wait for CSS | `home.page.ts:116-119` |
| CORS on web | Use `mode: 'no-cors'` for fetch (loses response) | `monitor.service.ts:80` |
| Capacitor HTTP | Use `CapacitorHttp` instead of fetch on mobile | `monitor.service.ts:73-77` |

## Platform-Specific Constraints

| Platform | Constraint | Impact |
|----------|------------|--------|
| **Tauri** | No AdMob support | Desktop is ad-free by design |
| **Tauri** | Rust security check on ping URL | Must modify to allow configurable targets |
| **Android** | Currently portrait-only | `screenOrientation="portrait"` in manifest |
| **iOS** | Manual build only | No CI/CD for iOS releases |
| **Web** | CORS blocks proper latency measurement | Development-only concern |

---
