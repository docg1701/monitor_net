# Epic 2: Configuration - Settings Tab

**Epic Goal:** Provide users with a comprehensive settings interface to configure monitoring parameters, regional preferences, and personal/connection information for reports.

**Integration Requirements:**
- Settings must persist to SQLite
- Settings changes must be reflected immediately in monitoring behavior
- Region selection must dynamically adjust form fields

---

## Story 2.1: Create Settings Service and Data Model

> **As a** developer,
> **I want** a centralized settings service,
> **so that** all app components can access and react to configuration changes.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | `SettingsService` provides reactive access to all settings via `settings$` Observable |
| AC2 | Settings interface defines: monitoring config, region, user info, connection info |
| AC3 | Default values provided for all settings |
| AC4 | Settings loaded from SQLite on app startup |
| AC5 | Settings changes persisted immediately to SQLite |
| AC6 | `MonitorService` reacts to ping target/interval changes |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | App starts with defaults if no settings exist |
| IV2 | Settings survive app restart |
| IV3 | Changing ping interval immediately affects monitoring (after restart monitoring) |

---

## Story 2.2: Implement Monitoring Configuration Section

> **As a** user,
> **I want** to configure the ping target and interval,
> **so that** I can monitor my specific network conditions.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | Dropdown selector for ping target with pre-defined options (see table below) |
| AC2 | Input field for ping interval (seconds) with min/max validation (1-60s) |
| AC3 | Default values: target `Google DNS (8.8.8.8)`, interval `5` seconds |
| AC4 | Changes saved on selection/blur |
| AC5 | "Restore Defaults" button resets monitoring settings |
| AC6 | Toast notification confirms settings saved |

**Pre-defined Ping Targets (Dropdown Options):**

| Label | Value | Protocol | Rationale |
|-------|-------|----------|-----------|
| Google DNS (8.8.8.8) | `8.8.8.8` | ICMP/HTTP | Most reliable, global presence |
| Cloudflare DNS (1.1.1.1) | `1.1.1.1` | ICMP/HTTP | Known for low latency |
| Quad9 DNS (9.9.9.9) | `9.9.9.9` | ICMP/HTTP | Security-focused alternative |
| OpenDNS (208.67.222.222) | `208.67.222.222` | ICMP/HTTP | Popular enterprise choice |
| Google Web | `www.google.com` | HTTP HEAD | Web-based measurement |
| Cloudflare Web | `www.cloudflare.com` | HTTP HEAD | Web-based alternative |

**Note:** This approach maintains backend security by whitelisting allowed targets in Rust code, while giving users meaningful choices.

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Dropdown displays all pre-defined targets correctly |
| IV2 | Saved settings persist after app restart |
| IV3 | Monitor tab uses new settings when monitoring restarted |
| IV4 | Rust backend accepts all whitelisted targets |

---

## Story 2.3: Implement Region Selection with Dynamic Forms

> **As a** user,
> **I want** to select my country/region,
> **so that** reports include the correct regulatory bodies and document templates.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | Radio group with 4 options: Brasil, United States, European Union, United Kingdom |
| AC2 | Selection persisted to settings |
| AC3 | Region data model includes: country_code, country_name, regulatory_body, consumer_protection, applicable_law |
| AC4 | User info form fields change based on region (document type, phone format) |
| AC5 | Default region based on device locale (if detectable), otherwise Brasil |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Region change immediately updates user info form fields |
| IV2 | Export includes correct region metadata |
| IV3 | Region survives app restart |

---

## Story 2.4: Implement User Information Form

> **As a** user,
> **I want** to enter my personal information,
> **so that** exported reports are personalized with my details for regulatory complaints.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | Fields: name, document (type varies by region), address, phone |
| AC2 | Document field label changes by region: CPF (BR), SSN (US), National ID (EU), NIN (UK) |
| AC3 | Phone field includes country code prefix |
| AC4 | All fields are optional (don't block app usage) |
| AC5 | Basic format validation for document numbers (CPF checksum for Brazil) |
| AC6 | Data saved on blur |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Validation errors displayed inline without blocking save |
| IV2 | Partial data can be saved (user can fill incrementally) |
| IV3 | Data included in export JSON when present |

---

## Story 2.5: Implement Connection Information Form

> **As a** user,
> **I want** to enter my ISP and plan details,
> **so that** reports include context about my contracted service.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | Fields: provider name, plan name, contracted speed (Mbps), connection type, contract number (optional) |
| AC2 | Connection type is dropdown: Fiber, Cable, DSL, Wireless, Satellite, Other |
| AC3 | Speed field is numeric with Mbps suffix |
| AC4 | All fields optional |
| AC5 | Data saved on blur |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Connection info included in export JSON |
| IV2 | Data survives app restart |
| IV3 | No impact on monitoring functionality |

---

## Story 2.6: Implement Geolocation Capture

> **As a** user,
> **I want** to optionally capture my GPS coordinates,
> **so that** reports can verify my location matches my declared address.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | "Capture Location" button in user info section |
| AC2 | Requests geolocation permission on button press |
| AC3 | Displays captured coordinates and accuracy |
| AC4 | "Clear Location" option to remove stored coordinates |
| AC5 | Uses `@capacitor/geolocation` on mobile, `navigator.geolocation` on desktop |
| AC6 | Graceful handling if permission denied |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | App functions normally if location permission denied |
| IV2 | Coordinates included in export when captured |
| IV3 | Location capture works on both desktop and mobile |

---
