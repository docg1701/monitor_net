# Epic 3: Reporting & Export - Reports Tab + AdMob

**Epic Goal:** Enable users to view monitoring statistics, export data for AI-powered report generation, and monetize mobile app through non-intrusive ads.

**Integration Requirements:**
- Statistics must aggregate data from SQLite
- Export format must match POST-MVP-ROADMAP specification exactly
- AdMob must not impact desktop version

---

## Story 3.1: Implement Reports Tab with Statistics Display

> **As a** user,
> **I want** to see aggregated statistics of my monitoring data,
> **so that** I can understand my network quality at a glance.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | Display monitoring period (first ping to last ping dates) |
| AC2 | Display total ping count |
| AC3 | Display uptime percentage |
| AC4 | Display latency stats: average, minimum, maximum |
| AC5 | Display outage count and total downtime |
| AC6 | Statistics refresh when tab becomes active |
| AC7 | Empty state shown if no data exists |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Statistics match actual database contents |
| IV2 | Tab switch doesn't interrupt active monitoring |
| IV3 | Performance acceptable with large datasets (>100k pings) |

---

## Story 3.2: Implement Outage Detection and Recording

> **As a** user,
> **I want** network outages automatically detected and recorded,
> **so that** I have evidence of service interruptions.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | Outage defined as 3+ consecutive failed pings |
| AC2 | Outage record includes: start time, end time, duration |
| AC3 | `outages` table added to schema (migration) |
| AC4 | Outages list displayed in Reports tab (most recent first) |
| AC5 | Each outage shows date/time and duration |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Outage detection doesn't impact monitoring performance |
| IV2 | Outages included in export JSON |
| IV3 | Schema migration preserves existing ping data |

---

## Story 3.3: Implement Public IP Tracking

> **As a** user,
> **I want** my public IP address recorded,
> **so that** reports can document IP changes that may indicate reconnections.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | `IpService` fetches IP from `https://api.ipify.org?format=json` |
| AC2 | IP checked on app startup and after detected reconnection (outage end) |
| AC3 | Current IP stored in settings |
| AC4 | IP changes logged with timestamp |
| AC5 | Outage records include IP before/after when available |
| AC6 | Graceful handling if ipify.org unreachable |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | IP lookup doesn't block app startup |
| IV2 | App works fully offline (IP lookup silently fails) |
| IV3 | IP data included in export JSON |

---

## Story 3.4: Implement Data Clear Functionality

> **As a** user,
> **I want** to clear all monitoring data,
> **so that** I can start fresh or free up storage.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | "Clear All Data" button in Reports tab |
| AC2 | Confirmation dialog before deletion |
| AC3 | Clears: pings, outages, IP history |
| AC4 | Does NOT clear: user settings, user info, connection info |
| AC5 | Success toast after completion |
| AC6 | Statistics display updates to empty state |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Settings preserved after data clear |
| IV2 | Monitor tab can immediately start collecting new data |
| IV3 | Clear operation completes in reasonable time |

---

## Story 3.5: Implement JSON Export Generation

> **As a** user,
> **I want** to export my monitoring data as JSON,
> **so that** I can use it with AI assistants for report generation.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | Export generates `netmonitor_dados.json` matching POST-MVP-ROADMAP spec |
| AC2 | Includes: app version, export date, region, user info, connection info |
| AC3 | Includes: period, summary statistics, outages array |
| AC4 | Includes: hourly_summary array for trend analysis |
| AC5 | File saved to device downloads folder |
| AC6 | Success toast with file location |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Generated JSON is valid and parseable |
| IV2 | Large datasets export without app freeze (use async/chunked) |
| IV3 | Export works on both desktop and mobile |

---

## Story 3.6: Implement AI Prompt Export

> **As a** user,
> **I want** an AI prompt file exported alongside my data,
> **so that** I have clear instructions for using the data with ChatGPT/Claude/Gemini.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | Export generates `netmonitor_prompt.txt` with instructions |
| AC2 | Prompt content matches POST-MVP-ROADMAP specification |
| AC3 | Prompt language matches selected region (Portuguese for BR, English for others) |
| AC4 | Both files exported together as single action |
| AC5 | Clear user instructions in the prompt file |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Prompt file is human-readable plain text |
| IV2 | Region-specific complaint bodies mentioned in prompt |
| IV3 | Export action creates both files in same location |

---

## Story 3.7: Implement AdMob Banner Ads (Mobile Only)

> **As a** mobile user,
> **I want** to see non-intrusive banner ads,
> **so that** the app can be monetized while I use it for free.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | Banner ad displayed above tab bar on mobile |
| AC2 | Ad rotation: 60 seconds visible, 120 seconds hidden |
| AC3 | Smooth fade animation on show/hide |
| AC4 | Uses test ad IDs in development |
| AC5 | No ads on desktop (Tauri) version |
| AC6 | Ad failures logged but don't crash app |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Banner doesn't overlap or shift tab content |
| IV2 | Monitoring performance unaffected by ad loading |
| IV3 | Desktop build has no AdMob code/dependencies |

---

## Story 3.8: Implement Rewarded Ad for Export (Mobile Only)

> **As a** mobile user,
> **I want** to watch a video ad to unlock export,
> **so that** I can access the export feature for free while supporting the app.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | "Watch Ad & Export" button on mobile Reports tab |
| AC2 | Rewarded video ad plays full screen |
| AC3 | Export unlocked only after ad completion |
| AC4 | If ad skipped/closed early, show message and don't export |
| AC5 | Fallback: if offline or ad fails to load, allow export without ad |
| AC6 | Desktop shows regular "Export" button (no ad) |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Ad completion correctly triggers export |
| IV2 | Offline fallback works reliably |
| IV3 | User informed clearly about ad requirement |

---
