# 5. Epic Structure

## Epic Approach Decision

**Decision: 4 Epics**

| Epic | Phases Covered | Rationale |
|------|----------------|-----------|
| **Epic 1: Foundation** | Phase 1 (SQLite) + Tab Navigation | Must be complete before any other work; establishes data layer |
| **Epic 2: Configuration** | Phase 2 (Settings Tab) | Standalone feature, can be developed once tabs exist |
| **Epic 3: Reporting & Export** | Phase 3 (Reports) + Phase 4 (AdMob) | Core value delivery - grouped because AdMob gates export |
| **Epic 4: Polish** | Phase 5 (UX) | Enhancement to existing features |

**Rationale:**
- SQLite + Tab navigation forms the foundational infrastructure (Epic 1)
- Settings is an independent feature module (Epic 2)
- Reports and AdMob share the export flow - splitting them would create incomplete features (Epic 3)
- UX polish can be delivered as a final enhancement pass (Epic 4)

---
