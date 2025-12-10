# Epic 4: Polish - UX Improvements

**Epic Goal:** Enhance user experience with quality-of-life improvements to the monitoring interface.

**Integration Requirements:**
- Must not disrupt existing functionality
- Visual changes must respect theme system

---

## Story 4.1: Add Monitoring Duration Display

> **As a** user,
> **I want** to see how long I've been monitoring,
> **so that** I know the extent of my current monitoring session.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | Card displays "Monitoring: Xh Xm Xs" when active |
| AC2 | Timer updates every second |
| AC3 | Timer resets when monitoring stopped/started |
| AC4 | Card hidden when monitoring is stopped |
| AC5 | Positioned at top of Monitor tab, below header |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Timer accurate to within 1 second |
| IV2 | Timer doesn't cause memory leaks |
| IV3 | Card respects dark/light theme |

---

## Story 4.2: Add Data Retention Configuration

> **As a** user,
> **I want** to configure how long data is retained,
> **so that** I can balance storage usage with data availability.

### Acceptance Criteria
| # | Criteria |
|---|----------|
| AC1 | Retention period setting in Settings tab (days) |
| AC2 | Options: 7, 14, 30, 60, 90 days |
| AC3 | Default: 30 days |
| AC4 | Change triggers immediate cleanup of expired data |
| AC5 | Confirmation dialog if reducing retention will delete data |

### Integration Verification
| # | Verification |
|---|--------------|
| IV1 | Cleanup respects new retention setting |
| IV2 | Setting persists across app restarts |
| IV3 | Reports statistics updated after cleanup |

---
