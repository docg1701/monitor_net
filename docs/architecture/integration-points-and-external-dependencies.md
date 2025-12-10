# Integration Points and External Dependencies

## External Services

| Service | Purpose | Integration Point | Notes |
|---------|---------|-------------------|-------|
| google.com | Ping target | `monitor.service.ts` | HEAD request for latency |
| ipify.org | Public IP | `ip.service.ts` | For export feature |
| AdMob | Ads | `ad.service.ts` | Mobile only |

### ipify.org API (Public IP Tracking)

**Endpoint:** `GET https://api.ipify.org?format=json`

**Response:** `{ "ip": "203.0.113.42" }`

**Integration:**
- Called on app startup
- Called after detected reconnection (outage end)
- Current IP stored in settings table
- IP changes logged with timestamp

**Error Handling:**
- Non-blocking: doesn't block app startup
- Graceful fallback if unreachable
- App continues working offline

### AdMob (Mobile Monetization)

**Banner Ads (Story 3.7):**
- Position: above tab bar
- Rotation: 60s visible, 120s hidden
- Smooth fade animation
- Test IDs in development

**Rewarded Video Ads (Story 3.8):**
- "Watch Ad & Export" button on Reports tab
- Export unlocked only after video completion
- Fallback: if offline/failed, allow export without ad

**Platform Exclusion:** Desktop (Tauri) has zero AdMob code/dependencies (NFR7)

### Geolocation API (Optional)

**Purpose:** Record GPS coordinates for location verification in complaints

**Implementation:**
- Mobile: `@capacitor/geolocation` v7.x
- Desktop: `navigator.geolocation` API
- User-initiated via "Capture Location" button
- Permission handling: graceful fallback if denied

## Tauri Plugin Ecosystem

Current plugins in `Cargo.toml`:
```toml
tauri-plugin-log = "2"    # Logging (debug only)
tauri-plugin-shell = "2"  # Shell commands (unused?)
tauri-plugin-store = "2"  # Key-value storage (unused?)
```

**For SQLite:** Add `tauri-plugin-sql = { version = "2", features = ["sqlite"] }`

## Capacitor Plugin Ecosystem

Current in `package.json`:
```json
"@capacitor/app": "^7.1.1",
"@capacitor/core": "^7.4.4",
"@capacitor/haptics": "^7.0.3",
"@capacitor/keyboard": "^7.0.4",
"@capacitor/status-bar": "^7.0.4"
```

**Plugins needed for PRD:**
- `@capacitor-community/sqlite` - Database
- `@capacitor/geolocation` - GPS coordinates
- `@capacitor-community/admob` - Ads

---
