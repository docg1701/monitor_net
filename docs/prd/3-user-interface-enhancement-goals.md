# 3. User Interface Enhancement Goals

## 3.1 Integration with Existing UI

**Current UI Patterns:**
- Ionic 8 components with standalone Angular components
- Dark/light theme via `ion-palette-dark` class on `<body>`
- CSS custom properties for theming (`--chart-line-color`, `--chart-fill-color`)
- Single-page layout with `ion-header`, `ion-content`, `ion-card` structure
- Chart.js for data visualization

**Integration Approach:**
- Convert from single-page to `ion-tabs` navigation (standard Ionic pattern)
- Existing Monitor page becomes first tab with minimal changes
- New pages follow same standalone component pattern
- Reuse existing theme infrastructure - all new components will respect dark/light mode
- Extend CSS custom properties as needed for new components

---

## 3.2 Modified/New Screens and Views

| Screen | Type | Description |
|--------|------|-------------|
| **App Shell** | Modified | Add `ion-tabs` wrapper with 3 tabs: Monitor, Settings, Reports |
| **Monitor Tab** | Modified | Current `home.page` relocated to tab; add "Monitoring duration" card |
| **Settings Tab** | New | Form-based configuration with sections for monitoring, region, user data, connection |
| **Reports Tab** | New | Statistics display, data management actions, export functionality |

### Monitor Tab Changes
```
+------------------------------------------+
| NetMonitor                       [dark]  |  <- Existing header
+------------------------------------------+
|  +------------------------------------+  |
|  | Monitoring: 2h 34m 12s             |  |  <- NEW: Duration card
|  +------------------------------------+  |
|                                          |
|  [Existing chart and stats cards...]     |
|                                          |
+------------------------------------------+
|  [Monitor]    [Settings]    [Reports]    |  <- NEW: Tab bar
+------------------------------------------+
```

### Settings Tab Layout
```
+------------------------------------------+
| Settings                                 |
+------------------------------------------+
|  > Monitoring                            |
|  +------------------------------------+  |
|  | Ping Target    [Google DNS v     ]  |  <- Dropdown
|  | Interval (s)   [5               ]  |  |
|  +------------------------------------+  |
|                                          |
|  > Region                                |
|  +------------------------------------+  |
|  | BR Brasil                        * |  |
|  | US United States                   |  |
|  | EU European Union                  |  |
|  | GB United Kingdom                  |  |
|  +------------------------------------+  |
|                                          |
|  > Your Information (for reports)        |
|  +------------------------------------+  |
|  | Name           [                 ]  |  |
|  | CPF            [                 ]  |  <- Dynamic by region
|  | Address        [                 ]  |  |
|  | Phone          [                 ]  |  |
|  +------------------------------------+  |
|                                          |
|  > Connection Details                    |
|  +------------------------------------+  |
|  | Provider       [                 ]  |  |
|  | Plan           [                 ]  |  |
|  | Speed (Mbps)   [                 ]  |  |
|  | Type           [Fiber v         ]  |  |
|  +------------------------------------+  |
|                                          |
|  [Restore Defaults]                      |
+------------------------------------------+
|  [Monitor]    [Settings]    [Reports]    |
+------------------------------------------+
```

### Reports Tab Layout
```
+------------------------------------------+
| Reports                                  |
+------------------------------------------+
|  Statistics                              |
|  +------------------------------------+  |
|  | Period: Dec 1 - Dec 10, 2025      |  |
|  | Total pings: 15,234               |  |
|  | Uptime: 98.38%                    |  |
|  | Avg latency: 45ms                 |  |
|  | Min/Max: 12ms / 890ms             |  |
|  | Outages: 3                        |  |
|  | Total downtime: 23.5 min          |  |
|  +------------------------------------+  |
|                                          |
|  Data Management                         |
|  +------------------------------------+  |
|  |        [Clear All Data]           |  |
|  +------------------------------------+  |
|                                          |
|  AI Export                               |
|  +------------------------------------+  |
|  |  Generate reports using AI         |  |
|  |  (ChatGPT, Claude, Gemini)         |  |
|  |                                    |  |
|  |  [Watch Ad & Export]               |  <- Mobile only
|  |  [Export for AI]                   |  <- Desktop
|  +------------------------------------+  |
+------------------------------------------+
|  [Monitor]    [Settings]    [Reports]    |
+------------------------------------------+
```

---

## 3.3 UI Consistency Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Component Library** | Use only Ionic 8 components (`ion-card`, `ion-item`, `ion-input`, `ion-select`, `ion-button`, `ion-list`, `ion-accordion`) |
| **Theme Support** | All new components MUST respect `ion-palette-dark` toggle |
| **Typography** | Use Ionic default typography - no custom fonts |
| **Icons** | Use Ionicons (already imported) for all icons |
| **Spacing** | Follow Ionic padding/margin standards via CSS utilities |
| **Forms** | Use `ion-item` + `ion-input`/`ion-select` pattern for all form fields |
| **Buttons** | Primary actions: `ion-button fill="solid"`, Secondary: `fill="outline"`, Destructive: `color="danger"` |
| **Feedback** | Use `ion-toast` for success/error messages, `ion-alert` for confirmations |

---
