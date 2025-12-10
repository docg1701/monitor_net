# 2. Requirements

## 2.1 Functional Requirements

| ID | Requirement |
|----|-------------|
| **FR1** | The app SHALL persist all ping results (timestamp, latency_ms, success, target) to a local SQLite database |
| **FR2** | The app SHALL provide a tabbed navigation structure with Monitor, Settings, and Reports tabs |
| **FR3** | The Settings tab SHALL allow users to select ping target from a pre-defined dropdown list and configure ping interval |
| **FR4** | The Settings tab SHALL allow users to select their country/region (Brazil, US, EU, UK) which determines applicable regulatory bodies and document templates |
| **FR5** | The Settings tab SHALL collect optional user information (name, document ID, address, phone) for report personalization |
| **FR6** | The Settings tab SHALL collect connection information (provider, plan name, contracted speed, connection type) |
| **FR7** | The Reports tab SHALL display monitoring statistics: period, total pings, uptime %, latency stats, outages count, total downtime |
| **FR8** | The Reports tab SHALL provide a "Clear Data" action with confirmation dialog |
| **FR9** | The Reports tab SHALL export monitoring data as JSON file (`netmonitor_dados.json`) |
| **FR10** | The Reports tab SHALL export an AI prompt file (`netmonitor_prompt.txt`) with instructions for LLM-based report generation |
| **FR11** | The app SHALL periodically collect and store the user's public IP address (via ipify.org API) |
| **FR12** | The app SHALL request and store GPS coordinates (with user permission) for location verification |
| **FR13** | The app SHALL detect and record outages with start/end times and IP changes |
| **FR14** | (Mobile only) The app SHALL display rotating banner ads (60s on / 120s off cycle) |
| **FR15** | (Mobile only) The app SHALL require users to watch a rewarded video ad before exporting reports |

---

## 2.2 Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| **NFR1** | SQLite operations SHALL NOT block the UI thread or impact real-time monitoring performance |
| **NFR2** | The app SHALL maintain existing startup time (<2 seconds to interactive) |
| **NFR3** | Database size SHALL be manageable - automatic cleanup of data older than configurable retention period (default: 30 days) |
| **NFR4** | All user data SHALL remain 100% local - no telemetry or data transmission to external servers (except ipify.org for IP lookup and AdMob for ads) |
| **NFR5** | The app SHALL work offline (except features requiring network: IP lookup, ads) |
| **NFR6** | Export files SHALL be valid JSON parseable by any LLM |
| **NFR7** | Desktop version (Tauri) SHALL NOT include any advertising |
| **NFR8** | **Regression Testing**: Each epic SHALL pass the regression test suite before being considered complete, ensuring existing functionality remains intact |

---

## 2.3 Testing Requirements

| ID | Requirement |
|----|-------------|
| **TR1** | A regression test suite SHALL be created before Epic 1 implementation begins |
| **TR2** | Regression tests SHALL cover: ping measurement accuracy, chart updates, statistics calculation, theme toggle, and app startup |
| **TR3** | All regression tests SHALL pass on both Tauri (desktop) and Capacitor (mobile) platforms |
| **TR4** | Each story SHALL include unit tests for new functionality |
| **TR5** | Integration tests SHALL verify database operations don't impact real-time monitoring |

---

## 2.4 Compatibility Requirements

| ID | Requirement |
|----|-------------|
| **CR1** | **Existing API Compatibility**: The `MonitorService` interface (`startMonitoring`, `stopMonitoring`, `results$`) SHALL remain unchanged to avoid breaking the Monitor tab |
| **CR2** | **Database Schema Compatibility**: Initial schema SHALL support forward migration - use versioned migrations from day one |
| **CR3** | **UI/UX Consistency**: New tabs SHALL follow existing Ionic component patterns and dark/light theme support |
| **CR4** | **Platform Parity**: Core functionality (persistence, settings, reports) SHALL work identically on Desktop (Tauri) and Mobile (Capacitor), with ads being the only mobile-specific feature |

---
