# Dudael Architecture

**Version:** V-00  
**Last Updated:** March 7, 2026  
**Repository:** [github.com/rajahwu/DU-workbench](https://github.com/rajahwu/DU-workbench)  
**Prepared for:** Lattice agents and collaborators entering this codebase

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Tech Stack](#tech-stack)
4. [Core Concepts: The Transfer Model](#core-concepts-the-transfer-model)
   - [PhaseWall](#phasewall)
   - [RunLedger](#runledger)
   - [WallPacket](#wallpacket)
   - [Wall Writing](#wall-writing)
   - [Run Log Packing](#run-log-packing)
5. [The Seven-Phase Loop](#the-seven-phase-loop)
6. [Engine-Shell Separation](#engine-shell-separation)
7. [Transition Pipeline](#transition-pipeline)
8. [Redux State Management](#redux-state-management)
9. [Data Flow & State Discipline](#data-flow--state-discipline)
10. [Naming Glossary](#naming-glossary)
11. [Architecture Inspection Checklist](#architecture-inspection-checklist)
12. [File Structure Reference](#file-structure-reference)
13. [Refactor Roadmap](#refactor-roadmap)

---

## Overview

**Dudael** is a web-based roguelike card game built on a **Hades-style meta-loop**. Five fallen angel archetypes—**the Bound**—are imprisoned in a quarantine zone called **Dudael**. Players descend through a **7-phase loop**, balancing **Light** and **Dark** resources to unlock doors, with **designed death** feeding persistent progression.

The **theological anchor** is **oikētērion** (Greek: "habitation," spiritual covering; Jude 1:6). The Bound abandoned their proper dwelling. The Quarantine Zone is where they wait. The Drop is how they process what they chose—or what happened to them.

The **aesthetic** is **forensic theophany**—clinical, examining, evidence under glass. The game does not explain itself emotionally. It **presents**.

**Key Architecture Goals:**
- **Framework-agnostic engine** (`du/phases`) with React as one shell over it
- **Phase Wall Transfer Model** preventing state bleed between phases
- **RunLedger persistence** tracking the entire descent across all phases
- **Minimal, type-safe WallPackets** for phase-to-phase handoffs
- **Redux as single source of truth** for current phase and run state

---

## Architecture Principles

### 1. **Engine is Canonical for Run Truth**
- The engine (`du/phases`) owns **phase legality**, **transition enforcement**, **run meta side effects**, and **run history tracking**
- The engine is **framework-agnostic**—React app is just one shell over it

### 2. **Shells Own Wiring, Screens Render**
- **Shell** (e.g., `TitleShell`, `SelectShell`) wires selectors, dispatches `requestTransition`, performs "touch wall" logic
- **Screen** (e.g., `TitleScreen`, `SelectScreen`) is mostly presentational—receives props, renders UI
- **If a Screen is dispatching transitions directly, that's a smell**

### 3. **PhaseWall Discipline**
- **Phases are stationary environment structures** (like walls in a maze)
- **Runner travels**, carrying a **RunLedger**
- **Phases cannot read each other's internal state**—they only interact through **WallPacket transfer**
- **Seal** is the only protocol that can mutate the ledger

### 4. **No State Bleed**
- **No `...prev` spreads** in packet building
- **No legacy fields** (`identity`, `selection`, `kind`, `isLegacy`) mixing into new schemas
- **PhaseWall stays tiny**—RunLedger holds persistent truth

### 5. **Redux as Authority**
- Redux `phaseSlice` owns the current phase and last error
- Redux `runSlice` holds the persistent RunLedger (runner, gate lock, depth, alignment, inventory, loop count)
- **`requestTransition` thunk is the ONLY way phases move**

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Language** | TypeScript |
| **Build Tool** | Vite (pnpm monorepo) |
| **Frontend Framework** | React 19 |
| **Routing** | React Router |
| **State Management** | Redux Toolkit |
| **Data Fetching** | TanStack Query (React Query) |
| **Styling** | Tailwind CSS v4 (with design tokens) |
| **Backend/Database** | Supabase |
| **Game Rendering** | PixiJS (for title screen spiral animation) |

---

## Core Concepts: The Transfer Model

### PhaseWall

A **PhaseWall** is the **boundary between phases**. Each phase is a room; between rooms is a **Wall**. You can only **write/read the wall you are touching**.

```
Title → [WALL₁] → Select → [WALL₂] → Staging → [WALL₃] → Draft → [WALL₄] → Level → [WALL₅] → Door → [WALL₆] → Drop
                                                                                                                    ↓
                                                                                                                [WALL₇] → Staging (loop)
```

**Rule:** Phase code can **only read/write its own wall payload**. Everything else must cross via **WallPacket**.

### RunLedger

The **RunLedger** is the **persistent record** of the entire descent. It lives in **Redux `runSlice`** and is mirrored on the engine side as **`RunMetaSnapshot`**.

It accumulates **across the full loop** and persists through **Drop → Staging resets**.

**RunLedger Structure:**

```typescript
interface RunLedger {
  runId: string;
  runner: {
    runnerId: string;
    userId?: string;
    vesselId?: VesselId;
    sigilKey?: string;
    displayName?: string;
  };
  gateLock?: {
    guide: 'light' | 'dark';
    descentMode: 'steward' | 'solo';
    vesselId: VesselId;
    lockedAtPhase: GamePhaseId;
  };
  progress: {
    depth: number;
    loopCount: number;
  };
  alignment: {
    currentLight: number;
    currentDark: number;
  };
  inventory: {
    memoryFragments: number;
    relicIds: string[];
    draftCardIds: string[];
  };
  history: {
    phaseTrail: GamePhaseId[];
    lastDoorChoice?: 'light' | 'dark' | 'secret';
    lastDropReason?: 'death' | 'math-fail' | 'exit';
  };
  metaFlags?: {
    penitentInsight: number;
    rebelBreaches: number;
    unlockedCodexKeys: string[];
  };
  telemetry?: {
    totalClicks: number;
    totalRuns: number;
  };
  debugTrace?: Record<string, unknown>;
}
```

**Key Groups in RunLedger:**
- **`runner`** — where the runner is, what cycle we're in
- **`support`** — stability, repeatability, tooling (not yet fully implemented)
- **`progression`** — depth, loopCount, milestones, gates cleared
- **`shine`** — Light/Dark economy, the reason decisions matter

### WallPacket

**WallPacket** is the **only object allowed to cross phase boundaries**.

**Characteristics:**
- **Small** (hop-only, minimal payload)
- **Non-persistent** (consumed immediately by engine transition)
- **Never merged or spread** (no `...prev` patterns)

**Recommended Structure:**

```typescript
interface PhaseWallPacket<P = unknown> {
  from: PhaseId;
  to: PhaseId;
  at: number; // timestamp or monotonic tick
  payload: P;  // discriminated union per hop
}
```

**Type-Safe Discriminated Union:**

```typescript
type PhaseWallPayload =
  | TitleToSelectWall
  | SelectToStagingWall
  | StagingToDraftWall
  | DraftToLevelWall
  | LevelToDoorWall
  | DoorToDropWall
  | DropToStagingWall
  | DoorToDraftWall    // if player retries
  | DoorToStagingWall  // if math fails
  | LevelToDropWall;   // if death in level

interface TitleToSelectWall {
  kind: 'title-select';
  userRef: { userId: string | 'guest' };
  pathHint?: 'lite' | 'full';
}

interface SelectToStagingWall {
  kind: 'select-staging';
  runId: string;
  runnerRef: { runnerId: string };
  gateChoice: {
    guide: 'light' | 'dark';
    descentMode: 'steward' | 'solo';
    vesselId: VesselId;
  };
}

// Other payloads typically just carry runId + optional hop-specific metadata
interface StagingToDraftWall {
  kind: 'staging-draft';
  runId: string;
}

interface DraftToLevelWall {
  kind: 'draft-level';
  runId: string;
  draftResultId?: string;
}

interface LevelToDoorWall {
  kind: 'level-door';
  runId: string;
}

interface DoorToDropWall {
  kind: 'door-drop';
  runId: string;
  doorChoice?: 'light' | 'dark' | 'secret';
}

interface DropToStagingWall {
  kind: 'drop-staging';
  runId: string;
  dropReason?: 'death' | 'math-fail' | 'exit';
}
```

**The 3 Iron Rules:**
1. **Only the engine consumes WallPacket**. UI doesn't interpret other phase payloads.
2. **A phase may only read `Wall[current]`**. No reaching into other walls.
3. **No packet spreading. Ever.** No `{...prevPacket, ...newStuff}` patterns.

### Wall Writing

**Wall Writing** is the act of a phase committing its **outgoing wall payload**. It follows this discipline:

1. The phase **updates RunLedger first** via Redux actions (`lockGate`, `updateAlignment`, `advanceDepth`)
2. The phase **builds a minimal PhaseWallPayload**—only the fields the next phase needs to orient itself
3. The phase calls `requestTransition(to, payload)` which:
   - Builds a `PhaseWallPacket` from the payload
   - Passes it to the engine's `transition(from, to, wall)` for legality check
   - Engine applies side-effects by reading from **RunLedger/RunMetaSnapshot** (not from the wall)
   - Redux stores the new phase & wall (old wall is discarded)

**WallWrite Step Names:**
- **WallWrite** — derive next wall payload
- **WallTransfer** — commit via WallPacket transition
- **WallTouch** — current phase is allowed to read/write this wall

### Run Log Packing

At **key lifecycle moments**—especially **Drop → Staging**—the **RunLedger is packed (checkpointed)** to persistent storage (sessionStorage, localStorage, or Supabase).

This allows:
- **Recovery on page reload** (`boot.ts` restores snapshot, hydrates Redux)
- **Meta-progression across runs** (Memory Fragments, unlocked codex, Vessel stats)
- **The Staging room to fill up over time** (empty on day one, rich on day twenty)

**Packing Steps:**
1. Finalize the run segment
2. Append log entries to RunLedger
3. Optionally checkpoint run state (serialize to storage)
4. Prepare for next descent loop

---

## The Seven-Phase Loop

The game flows through **seven rooms in sequence**. The phase state machine moves:

```
TITLE → SELECT → STAGING → DRAFT → LEVEL → DOOR → DROP (loop back to STAGING)
```

| Phase | Name | What Happens | Wall Payload Out |
|-------|------|--------------|------------------|
| **01: Title** | The Void | Procedural PixiJS animation. Identity resolution, exchange flow. User becomes runner. | `TitleToSelectWall` (userId, pathHint) |
| **02: Select** | Choose Vessel | Three sub-phases: (0) Choose Guide, (1) Choose Mode, (2) Choose Bound from 3 available Vessels. | `SelectToStagingWall` (runId, runnerRef, gateChoice) |
| **03: Staging** | Locker Room | Breathing room. Keepers offer upgrades. Sparse on first run, rich on return. "The rest stop has teeth." | `StagingToDraftWall` (runId) |
| **04: Draft** | Card Draft | Light keeper & Dark keeper each offer cards. Pick 2 of 4 with 1 reroll. Cards carry lightΔ, darkΔ, tags. Insight-based visibility system. | `DraftToLevelWall` (runId, draftResultId?) |
| **05: Level** | The Descent | Content-agnostic container. First cartridge: 3×3 tap grid. Timer, health bar, depth-scaled difficulty. **SNES Cartridge Model**: stage is the console, game is the cartridge. | `LevelToDoorWall` (runId) |
| **06: Door** | Three Paths | Three doors: Light, Dark, Secret. Alignment requirements scale by depth. Parity snapshot from Draft checked here. | `DoorToDropWall` (runId, doorChoice?) OR `DoorToDraftWall` OR `DoorToStagingWall` |
| **07: Drop** | Dudael Drop | Run summary. Designed death converts to Memory Fragments (meta-currency). Loop returns to Staging. | `DropToStagingWall` (runId, dropReason?) |

**Legality Map** (which transitions are allowed):

```
01:title    → 02:select
02:select   → 03:staging
03:staging  → 04:draft, 02:select
04:draft    → 05:level, 03:staging
05:level    → 06:door
06:door     → 04:draft, 03:staging, 07:drop
07:drop     → 04:draft, 01:title, 03:staging
```

---

## Engine-Shell Separation

### Engine (`du/phases`) — Framework-Agnostic

**Responsible for:**
- Phase legality
- Transition enforcement
- Run meta side effects
- Run history tracking

**Key files:**
- `du/phases/types.ts` — Defines `PhaseId`, `PhaseWallPacket`, `PhaseWallPayload` per-hop union, `Alignment`, `VesselId`, `GateChoice`, `RunnerProfile`, `RunLedger`
- `du/phases/manager.ts` — `transition()`, `isLegalTransition()`, `applySideEffects()`, legality map
- `du/phases/meta.ts` — `RunMetaSnapshot`, `getRunMeta()`, `lockIdentity()`, `incDepth()`, `incLoop()`, `pushPhase()`, snapshot restore/hydrate

**Key Principle:**
```
Engine does NOT own UI state.
Engine does NOT know about React.
Engine does NOT dispatch Redux actions.
```

### Shell (`web/react/app`) — React + Redux

**Responsible for:**
- Rendering shells/screens
- Dispatching transition requests
- Holding the persistent run ledger in Redux

**Key files:**
- `web/react/app/src/app/store.ts` — Redux store wiring
- `web/react/app/src/app/phaseSlice.ts` — Owns current phase, last error, meta snapshot from engine; exposes `requestTransition` thunk (wraps engine's `transition()`)
- `web/react/app/src/app/runSlice.ts` — Holds persistent run state (`RunLedger`: runner, gate lock, depth, alignment, inventory, loop count)
- `web/react/app/src/web/lite-game/pages/phases/` — Phase pages (`01-title/`, `02-select/`, etc.)
  - Each has **Shell** (wiring) + **Screen** (presentational)
  - Shell does wiring, dispatches `requestTransition`
  - Screen is mostly presentational, receives props

**Key Principle:**
```
Shells own wiring. Screens render UI.
If Screens are dispatching transitions directly, that's a smell.
```

---

## Transition Pipeline

The **transition pipeline** enforces architectural boundaries. **Only this pipeline may move phases.**

```
Shell
  ↓
  dispatch(requestTransition(to, payload))
  ↓
Redux: phaseSlice
  ↓
  creates PhaseWallPacket
  ↓
Engine: transition(from, to, WallPacket)
  ↓
  - legality check
  - apply meta side-effects (reads from RunLedger, NOT the wall)
  - returns: (nextPhase, nextWallPayload, metaSnapshot)
  ↓
Redux updates:
  - phase → to
  - wall[to] → nextWallPayload
  - runLedger updated (logs/snapshot)
  ↓
Next Shell renders
```

**Full Flow When a Phase Advances:**

```typescript
// Phase Shell
1. dispatch(lockGate(...))        // update RunLedger in Redux
2. build PhaseWallPayload         // tiny, hop-specific
3. dispatch(requestTransition(to, payload))
   ↓
   buildWallPacket(from, to, payload)
   ↓
   engine.transition(from, to, wall)
     - isLegalTransition(from, to)?
     - pushPhase(to)             // record in meta.history
     - applySideEffects(from, to)
       - lockIdentity()          // reads from RunLedger, not wall
       - incDepth()
       - incLoop()
   ↓
   dispatch(setPhaseAndWall({ phase, wall }))
```

**No phase shell ever reads localStorage directly.** Redux is the **single authority** for both the current wall and the current run state.

---

## Redux State Management

### `phaseSlice.ts`

**Owns:**
- Current phase (`current: PhaseId`)
- Last error (`lastError?: string`)
- Meta snapshot from engine (`meta: RunMetaSnapshot`)

**Exposes:**
- `requestTransition(to: PhaseId, payload: PhaseWallPayload)` — **the ONLY way phases move**

### `runSlice.ts`

**Owns:**
- `RunLedger` (see structure above)

**Actions:**
- `initRun(runId)` — initialize new run
- `lockGate(gateChoice)` — lock Guide/Mode/Vessel selection
- `updateAlignment({ light, dark })` — adjust Light/Dark
- `advanceDepth()` — increment depth
- `recordPhase(phase)` — append to phaseTrail
- `recordDoorChoice(choice)` — log door decision
- `recordDrop(reason)` — log drop event
- `addMemoryFragments(amount)` — increment metacurrency
- `setDraftCards(cardIds)` — record drafted cards

**Selectors:**
- `selectRunId(state)` → `string`
- `selectRunner(state)` → `runner` object
- `selectGateLock(state)` → `gateLock` object
- `selectAlignment(state)` → `{ currentLight, currentDark }`
- `selectDepth(state)` → `number`
- `selectLoopCount(state)` → `number`
- `selectMemoryFragments(state)` → `number`

### Bootstrap Flow

```typescript
// web/react/app/src/main.tsx or boot.ts

// 1. Restore engine snapshot
const snap = restoreSnapshot();
if (snap) hydrateFromSnapshot(snap);

// 2. Get engine meta
const initialState = {
  current: lastPhaseOrTitle,
  meta: getRunMeta(),
};

// 3. Hydrate Redux runSlice from engine meta
import { hydrateRunFromEngineMeta } from './app/runSlice';
const engineSnapRun = hydrateRunFromEngineMeta();

// 4. Create Redux store with preloaded state
const preloadedState = {
  phase: initialPhaseState,
  run: engineSnapRun,
};
const store = configureStore({ preloadedState });
```

**Engine and shell now share the same vocabulary:**
- `runner.userId`, `runner.vesselId`, `runner.sigilKey`
- `gateLock.guide/mode/vesselId`
- `progress.depth`, `alignment.current.light/dark`

---

## Data Flow & State Discipline

### Current Wall vs. RunLedger

**PhaseWall stays tiny and separate:**
- Engine uses **`RunMetaSnapshot`** for persistent run data
- Redux uses **`RunLedger`** for UI-side state
- **PhaseWall only carries the hop payload** (e.g., `TitleToSelectWall`, `SelectToStagingWall`) and **never stores identity or alignment**

**This gives you:**
- **One naming scheme**
- **Engine-meta and Redux-run in sync**
- **Packets that are minimal and easy to reason about**

### Packet Evolution (What Each Phase Writes)

| Phase | Writes to WallPacket | Writes to RunLedger |
|-------|----------------------|---------------------|
| **TITLE** | `{ userId, pathHint }` | Initial `runId` |
| **SELECT** | `{ runId, runnerRef, gateChoice }` | Vessel locked, starting stats (Light, Dark, health, maxHealth, hand size) |
| **DRAFT** | `{ runId, draftResultId? }` | `draftedCards`, `paritySnapshot` |
| **LEVEL** | `{ runId }` | Health decremented, points incremented, Light/Dark adjusted from hits |
| **DOOR** | `{ runId, doorChoice? }` | Light or Dark decremented as cost, `depth` incremented |
| **DROP** | `{ runId, dropReason? }` | Meta counters (`loopCount`), Memory Fragments added |

**No phase writes outside its spec.**

### Redux State Mutations Per Phase

| Phase | Redux Reads | Redux Writes |
|-------|-------------|--------------|
| **SELECT** | Vessel registry, starting stats config | Initialize `vessel`, `Light`, `Dark`, `health`, `maxHealth` |
| **DRAFT** | `vessel.draftBias`, `insight` level, card pool | Increment Light/Dark from card picks. Write `packet.picks`. |
| **LEVEL** | Current Light/Dark, health, drafted cards | Decrement health, increment points, adjust Light/Dark from hits |
| **DOOR** | Parity snapshot from Draft, door costs by depth | Decrement Light or Dark cost, increment `depth` |
| **DROP** | Full run state | Reset to starting values, increment `loopCount`. Meta counters to localStorage. |

**Key Architectural Decisions:**
- **Insight** and **Instability** are **calculated on-the-fly** from current run behavior (not stored long-term). They are **derived state**, not persisted state.
- **Parity snapshot** is taken at the end of **CARDDRAFT** and checked again at **DOOR**. The gap between snapshot and door choice creates tension.
- **Meta counters** (Confessions, Breach, loopCount, unlocked lore) **persist across runs** in localStorage.
- **Draft bias**: Light vessel → 3 Light + 1 Dark cards in pool. Dark vessel → 1 Light + 2 Dark cards.

---

## Naming Glossary

### Locked Terms (Use These Consistently)

| Term | Definition | Usage |
|------|------------|-------|
| **Runner** | The active entity in the descent. NOT "player" or "character" in code. | `runner.userId`, `runner.vesselId` |
| **GateChoice** | The initial lock-in (Guide + Mode + Vessel) made at SELECT phase. | `gateChoice: { guide, descentMode, vesselId }` |
| **GateLock** | The persistent record of GateChoice after it's committed to RunLedger. | `gateLock` in RunLedger |
| **WallPacket** | The only object allowed to carry data across phase boundaries. | `PhaseWallPacket<P>` |
| **RunLedger** | Persistent run state (Redux `runSlice` + engine `RunMetaSnapshot`). | `RunLedger` interface |
| **Wall Writing** | The act of a phase building and committing its outgoing wall payload. | `WallWrite → WallTransfer → WallTouch` |
| **Run Log Packing** | Checkpointing the RunLedger at lifecycle boundaries (Drop → Staging). | `RunLogger.pack()` |
| **AlignmentSnapshot** | One-hop parity snapshot (only when needed, e.g., DRAFT → DOOR). | `alignmentSnapshot: { light, dark }` |

### Deprecated Terms (Do NOT Use)

| Deprecated | Use Instead | Why |
|------------|-------------|-----|
| `identity` | `runner` (for player-in-run) OR `sinerineIdentity` (for brand tokens) | "Identity" in Sinerine system means **brand markers**, not player state |
| `selection` | `gateChoice` or `gateLock` | More specific to the three-layer lock |
| `PhasePacket` | `PhaseWallPacket` | Emphasizes "wall" metaphor |
| `player.vessel` | `runner.vesselId` | Avoid "player" in engine code |
| `kind`, `isLegacy` | Remove entirely | Legacy fields from old schemas |

---

## Architecture Inspection Checklist

**Use this checklist when reviewing code for architectural discipline:**

### ✅ Phase Transition Authority
- [ ] **Find the one transition choke point** (thunk/action)
  - Should be `requestTransition` in `phaseSlice.ts`
- [ ] **Confirm engine transition enforces legality**
  - Check `isLegalTransition(from, to)` in `manager.ts`
- [ ] **Confirm run truth is recorded in meta snapshot**
  - Check `meta.ts` helpers (`incDepth`, `incLoop`, `lockIdentity`, `pushPhase`)

### ✅ Phase Payload Boundaries
- [ ] **Confirm phase payloads are wall-local, not traveler-global**
  - WallPacket should only carry hop-specific payload (e.g., `runId` + optional metadata)
  - RunLedger holds everything else (alignment, inventory, depth, loop count, gate lock, history)
- [ ] **Confirm transfer is explicit — no bleed by spread**
  - No `{ ...prevPacket, ...newStuff }` patterns
  - No legacy fields (`identity`, `selection`, `kind`, `isLegacy`) in new code

### ✅ Shell-Screen Separation
- [ ] **Confirm shells own wiring, screens remain mostly presentational**
  - Shells dispatch `requestTransition`, read selectors, handle side effects
  - Screens receive props, render UI, fire callbacks
- [ ] **If screens are dispatching transitions directly, that's a smell**

### ✅ Redux as Single Authority
- [ ] **No phase shell reads localStorage directly**
  - Redux is the single authority for both current wall and current run state
- [ ] **Engine meta and Redux run slices stay in sync**
  - Bootstrap flow uses `hydrateRunFromEngineMeta()`

### ✅ Whitespace & Type Safety
- [ ] **All TypeScript compiles without errors**
  - Run `pnpm -r typecheck`
- [ ] **Trace first compile error to its contract owner**
  - If phase typing → start in `du/phases/types.ts`
  - If transitions → start in `du/phases/manager.ts`
  - If UI calling convention → start in `app/phaseSlice.ts`

### ✅ Run Full Loop Test
- [ ] **Run one full loop: Title → Select → Staging → Draft → Level → Door → Drop (→ Staging)**
- [ ] **Confirm each phase reads only its own wall + RunLedger**
- [ ] **Confirm no unexpected packet spreading or state leakage**

---

## File Structure Reference

### Engine (`du/phases/`)
```
du/
└── phases/
    ├── types.ts            # PhaseId, PhaseWallPacket, PhaseWallPayload, Alignment, VesselId, GateChoice, RunLedger
    ├── manager.ts          # transition(), isLegalTransition(), applySideEffects(), legality map
    └── meta.ts             # RunMetaSnapshot, getRunMeta(), incDepth(), incLoop(), lockIdentity(), pushPhase()
```

### React App (`web/react/app/`)
```
web/react/app/
└── src/
    ├── app/
    │   ├── store.ts        # Redux store wiring
    │   ├── phaseSlice.ts   # Current phase, requestTransition thunk
    │   └── runSlice.ts     # RunLedger state + actions
    └── web/lite-game/pages/phases/
        ├── 01-title/       # TitleShell + TitleScreen
        ├── 02-select/      # SelectShell + SelectScreen
        ├── 03-staging/     # StagingShell + StagingScreen
        ├── 04-draft/       # DraftShell + DraftScreen
        ├── 05-level/       # LevelShell + LevelScreen
        ├── 06-door/        # DoorShell + DoorScreen
        └── 07-drop/        # DropShell + DropScreen
```

### Quick Navigation
- **Want to understand phase transitions?** → `du/phases/manager.ts`
- **Want to see how UI triggers transitions?** → `app/phaseSlice.ts` (`requestTransition`)
- **Want to inspect run state?** → `app/runSlice.ts` (selectors + actions)
- **Want to see a phase implementation?** → `web/lite-game/pages/phases/01-title/` (Shell + Screen)

---

## Refactor Roadmap

### Current State (March 2026)
- ✅ **Phase enum aligned with documentation**
- ✅ **Router simplified** (pure phase → path mapping)
- ✅ **Engine legality isolated** (`manager.ts` owns transition rules)
- ✅ **Feature-based UI structure** (moved away from legacy Shell folder)
- ✅ **Redux slice fully enforcing phase state machine**
- ✅ **First LEVELPLAY container prototype** (SNES Cartridge Model)

### Open Work
- 🔄 **Complete `runSlice` refactor** — remove all legacy fields (`identity`, `selection`, `kind`, `isLegacy`)
- 🔄 **Implement Draft visibility system** — Insight-based card info reveal
- 🔄 **Design Exile unique mechanic** — distinct from Seraph/Shadow/Penitent/Rebel
- 🔄 **Build second Level cartridge** — demonstrate swappable mini-game architecture
- 🔄 **Implement Door cost scaling** — depth-based Light/Dark requirements
- 🔄 **Add Memory Fragments persistence** — localStorage checkpoint + Supabase sync

### Next Steps (Priority Order)
1. **Normalize `runSlice` schema** — remove deprecated fields, align with `RunLedger` interface
2. **Implement WallPacket type guards** — runtime validation of discriminated union
3. **Add engine unit tests** — test legality map, side effects, packet validation
4. **Implement persistent storage** — sessionStorage for in-run recovery, localStorage for meta-progression
5. **Build Supabase sync layer** — upload completed runs, fetch unlocked lore
6. **Tailwind 4 integration** — migrate from utility classes to design tokens

### Long-Term Goals
- **CLI version** — terminal-based descent (demonstrates engine portability)
- **LUA/LÖVE arcade version** — demonstrates SNES Cartridge Model in different runtime
- **Multiplayer/async co-op** — Session/run coordination via Supabase
- **AI-assisted debugging** — ledger inspection tools for run replay

---

## Related Documentation

- **DudaelLoreBible.md** — World, theology, Bound, locations, glossary
- **DudaelBoundSpec.md** — Vessel stats, Guides, Descent Modes
- **DudaelSystemsSpec.md** — Loop, economy, Draft, Door, Drop mechanics
- **SinerineBrandGuide.md** — Palette, typography, tokens, voice
- **DudaelContentPipeline.md** — Lifecycle, templates, QA
- **DudaelRefactorLog.md** — Dev history, in-progress, backlog

---

**End of DudaelArchitecture.md**

*Version V-00 | Last Updated: March 7, 2026*  
*Repository: [github.com/rajahwu/DU-workbench](https://github.com/rajahwu/DU-workbench)*
