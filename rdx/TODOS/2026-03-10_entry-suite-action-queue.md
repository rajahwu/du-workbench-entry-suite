# Rdxt TODO — Entry-Suite Action Queue

**Created:** 2026-03-10  
**Source:** Initial codebase sweep  
**Owner:** Operator  

---

## Priority Legend

- **P0** — Blocks development; fix immediately
- **P1** — Causes confusion or debt; fix this sprint
- **P2** — Should fix; schedule when appropriate
- **P3** — Nice to have; park for later

---

## Action Items

### P0 — Critical

- [x] **T01** — Create root `tsconfig.json` with monorepo references for `apps/*` and `packages/*` *(DONE 2026-03-10)*
  - Root tsconfig.json: ES2022, strict, bundler resolution, react-jsx
  - apps/bell-runner/tsconfig.json: extends root, path aliases for @bell/engine
  - IDE type checking now active

- [ ] **T02** — Implement `apps/bell-runner/web/main.tsx` React entry point
  - ReactDOM.createRoot setup
  - Basic App shell component
  - Wire to existing session/router structure

- [ ] **T03** — Create the 7 core docs in `apps/du-system-library/docs/`
  - Dudael_Architecture.md
  - Dudael_Lore_Bible.md
  - Dudael_Bound_Spec.md
  - Dudael_Systems_Spec.md
  - Sinerine_Brand_Guide.md
  - Dudael_Content_Pipeline.md
  - Dudael_Refactor_Log.md

### P1 — Major

- [x] **T04** — Fix filename typos across codebase *(DONE 2026-03-10)*
  - Renamed `engine/phases/iindex.ts` → `index.ts`
  - Renamed `engine/config/registery/` → `registry/` (config/index.ts import already correct)
  - Renamed `app/pags.tsx` → `pages.tsx` + fixed internal comment
  - No broken imports — config/index.ts was already importing from `./registry/`

- [ ] **T05** — Reconcile phase directory names with engine config
  - Align directory names to dudael.ts phase IDs  
  - Decide canonical names: staging vs station, draft vs exchange, etc.
  - Add missing 05_* directory
  - Remove or repurpose extra 08_drop
  - Document decision in RUNBOOK

- [ ] **T06** — Populate phase directories with phase-specific logic
  - Each phase dir gets at least: index.ts (exports), types, handlers
  - Wire phase modules into engine config registry

- [ ] **T07** — Bootstrap `packages/ui/` component library
  - Create package.json with React/TypeScript deps
  - Establish component structure (atoms/molecules or flat)
  - Move any reusable components from apps into packages/ui

### P2 — Moderate

- [ ] **T08** — Wire Sequelize models into bell-runner app layer
  - Create ORM initialization module
  - Build service layer or data access pattern
  - Connect models to API routes or server actions

- [ ] **T09** — Complete web app skeleton
  - Layout component, routing, navigation
  - Connect bell-bridge.ts to engine
  - Build session flow UI for phase progression

- [ ] **T10** — Fix DU System Library app component
  - Rename pags.tsx → pages.tsx
  - Fix hero image path (replace UUID with valid asset path)
  - Add routing and additional pages

- [ ] **T11** — Populate asset directories
  - Download/move 31 assets documented in ASSET_INVENTORY.md
  - Validate paths match documentation
  - Verify dimensions match specifications

- [ ] **T12** — Flesh out root package.json metadata
  - Add description, repository URL, license
  - Review scripts for completeness

### P3 — Deferred

- [ ] **T13** — Create engine/phases/index.ts as master phase export
  - Decide purpose: re-export all phase modules, or phase registry helper
  - Implement after phase directories are populated (depends on T06)

- [ ] **T14** — Add integration test suite
  - Bell Engine unit tests (seal evaluation, edge traversal)
  - Database model validation (migration up/down)
  - Web app smoke tests

- [ ] **T15** — Establish CI/CD pipeline
  - Lint, type-check, test, build
  - Per-package build validation

---

## Status

| ID | Priority | Status | Notes |
|----|:---:|:---:|-------|
| T01 | P0 | **DONE** | Root + bell-runner tsconfig created |
| T02 | P0 | NOT STARTED | Blocks web development |
| T03 | P0 | NOT STARTED | 7 core docs |
| T04 | P1 | **DONE** | 3 renames completed, imports clean |
| T05 | P1 | NOT STARTED | Needs operator decision |
| T06 | P1 | NOT STARTED | Depends on T05 |
| T07 | P1 | NOT STARTED | Depends on design decisions |
| T08 | P2 | NOT STARTED | — |
| T09 | P2 | NOT STARTED | Depends on T02 |
| T10 | P2 | NOT STARTED | Overlaps T04 |
| T11 | P2 | NOT STARTED | Asset sourcing needed |
| T12 | P2 | NOT STARTED | Quick win |
| T13 | P3 | NOT STARTED | Depends on T06 |
| T14 | P3 | NOT STARTED | — |
| T15 | P3 | NOT STARTED | — |

## Tags

#rdx #todos #entry-suite #action-queue
