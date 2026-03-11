# Rdxt Suggestions — Entry-Suite Improvements

**Created:** 2026-03-10  
**Source:** Initial codebase sweep  
**Status:** Proposals for operator review  

---

## Architecture & Structure

**SG01 — Establish a Shared Types Package**  
Bell Engine types (`core.ts`) and Sequelize model types live in separate worlds. A `packages/types/` package could export shared domain types (PhaseKind, VesselType, RunStatus) consumed by both engine and models. Reduces drift between layers.

**SG02 — Monorepo Build Orchestration**  
Consider adding Turborepo or Nx for task orchestration across the monorepo. Current pnpm workspace handles deps but not build ordering, caching, or parallelism. Would accelerate CI and local dev as the project grows.

**SG03 — Phase Module Convention**  
Standardize what goes inside each phase directory. Suggested convention:
```
phases/03_staging/
├── index.ts       — public exports
├── handlers.ts    — phase-specific logic (entry/exit hooks)
├── seals.ts       — phase-specific seal definitions
└── types.ts       — phase-local types (if needed)
```
This gives each phase a predictable shape and keeps the engine config clean.

## Developer Experience

**SG04 — Environment Variable Management**  
No `.env` example or environment configuration visible. Database config points to Supabase in production. Add `.env.example` with documented variables. Guard against secrets leaking.

**SG05 — Extend Runner-Lab as Dev Playground**  
`bell-phase-engine-lab.jsx` is already a 600-line teaching tool. Consider promoting it to a first-class dev tool with hot-reload, state inspection, and edge testing. Could serve as the primary development interface until the web app is ready.

**SG06 — Seed Data Consolidation**  
Three SQL seed files with UUID names exist in `du-system-library/seeds/`. The Sequelize migration also has comprehensive seed data. Clarify which is canonical. Consider consolidating to avoid drift between SQL dumps and ORM seeds.

## Documentation

**SG07 — RDX Runbook: Phase Name Decision Record**  
The phase directory names (station/exchange/descent/gate/drop) diverge from the engine config names (staging/draft/level/door/drop). Record the canonical naming decision in `RUNBOOK/` so all agents and contributors use consistent terminology.

**SG08 — Architecture Decision Records (ADRs)**  
The project has significant design decisions baked into code comments (5-node invariant, wall discipline, seal composition). Extracting these into lightweight ADRs in `docs/` would make them discoverable and citable.

**SG09 — Lattice Ledger Integration Guide**  
The Lattice Run Ledger is innovative but its integration path with the engine and database is unclear. A brief integration guide (how runs flow from engine → ledger → DB) would help future implementers.

## Quality

**SG10 — Add ESLint + Prettier Configuration**  
No linting or formatting config visible at workspace root. Standardize code style across TypeScript and JSX files. Prevents style drift between contributors and AI agents.

**SG11 — Pre-commit Hooks**  
Add Husky + lint-staged for pre-commit validation: lint, type-check, format. Cheap insurance against broken commits.

**SG12 — Model Relationship Diagram**  
The 17-table schema is well-designed but relationships are only visible by reading code. Generate or author an ER diagram (Mermaid or dbdiagram.io) for the RUNBOOK or docs.

---

## Tags

#rdx #suggestions #entry-suite #improvements
