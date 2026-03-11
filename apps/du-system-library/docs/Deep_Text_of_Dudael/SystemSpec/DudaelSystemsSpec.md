# Dudael Systems Spec (Tech View)

## 1. Purpose

This document specifies the gameplay systems of Dudael in terms of inputs, outputs, and data contracts so the lattice can review, implement, and refactor against a stable technical surface.

Scope:
- The 7-phase loop as a state machine.
- Light / Dark / Secret economy.
- Draft information game and card data.
- Level container model.
- Door math and parity checks.
- Drop and meta-progression (Memory Fragments, Staging accretion).
- How these systems bind to `RunLedger` and `PhaseWallPacket`.

---

## 2. Phase Loop as System

### 2.1 Phase Enumeration

```ts
export type PhaseId =
  | '01title'
  | '02select'
  | '03staging'
  | '04draft'
  | '05level'
  | '06door'
  | '07drop';
```

### 2.2 Legal Transitions (Engine View)

```ts
const LEGAL: Record<PhaseId, PhaseId[]> = {
  '01title': ['02select'],
  '02select': ['03staging'],
  '03staging': ['04draft', '02select'],
  '04draft': ['05level', '03staging'],
  '05level': ['06door'],
  '06door': ['04draft', '03staging', '07drop'],
  '07drop': ['04draft', '01title', '03staging']
};
```

This map is enforced by `engineTransition(from, to, wall)` and is the single source of truth for legal phase movement.

### 2.3 Phase Responsibilities (System Summary)

| Phase      | Player-facing role                         | System responsibilities                                               |
|-----------|---------------------------------------------|------------------------------------------------------------------------|
| `01title` | Entry / mood / start                        | Generate `runId`, init `RunLedger`, emit `TitleToSelectWall`.         |
| `02select`| Choose Guide / Mode / Bound                 | Lock `gateLock` in `RunLedger`, set `runner.vesselId`, emit Select→Staging wall. |
| `03staging`| Locker room / codex / meta                  | Read `RunLedger` history, surface unlocks, prepare Draft seed.        |
| `04draft` | Card pick / alignment shaping               | Consume Draft seed, compute alignment deltas, write `draftCardIds`, emit Draft→Level wall. |
| `05level` | Actual play container                       | Load mini-game by cartridge id, apply HP and alignment changes.       |
| `06door`  | Branch choice (Light / Dark / Secret)       | Check parity vs depth, compute legal doors, write `lastDoorChoice`, emit Door→(next) wall. |
| `07drop`  | Run summary / designed death                | Compute Memory Fragments, update meta flags, pack `RunLedger`, emit Drop→Staging wall. |

---

## 3. Core State Structures

### 3.1 RunLedger (Persistent Run State)

```ts
export interface Alignment {
  light: number; // accumulated Light this run
  dark: number;  // accumulated Dark this run
}

export interface RunnerProfile {
  runnerId: string;     // stable per run
  userId?: string;      // Supabase id or 'guest'
  displayName?: string; // UI only
  vesselId?: VesselId;  // set after Select
  sigilKey?: string;    // lore/codex key, not brand identity
}

export type DescentGuide = 'light' | 'dark';
export type DescentMode = 'steward' | 'solo';
export type VesselId = 'seraph' | 'shadow' | 'exile' | 'penitent' | 'rebel';

export interface GateLock {
  guide: DescentGuide;
  mode: DescentMode;
  vesselId: VesselId;
  lockedAt: PhaseId; // usually '03staging'
}

export interface RunLedger {
  runId: string;
  runner: RunnerProfile;
  gateLock?: GateLock;
  progress: {
    depth: number;     // how far down this run has gone
    loopCount: number; // how many completed loops
  };
  alignment: {
    current: Alignment; // Light/Dark totals for this run
  };
  inventory: {
    memoryFragments: number; // meta-currency
    relicIds: string[];      // long-term items
    draftCardIds: string[];  // cards selected this run
  };
  history: {
    phaseTrail: PhaseId[];
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

`RunLedger` is stored in Redux (`runSlice`) and mirrored in the engine (`RunMetaSnapshot`). It is the canonical record of what happened this run.

### 3.2 PhaseWallPacket (Per-Hop Transfer)

```ts
export type PhaseWallPayload =
  | TitleToSelectWall
  | SelectToStagingWall
  | StagingToDraftWall
  | DraftToLevelWall
  | LevelToDoorWall
  | DoorToDropWall
  | DropToStagingWall;

export interface PhaseWallPacket<P = PhaseWallPayload> {
  from: PhaseId;
  to: PhaseId;
  at: number;   // timestamp
  payload: P;
}

export interface TitleToSelectWall {
  kind: 'title-select';
  userRef: { userId: string | 'guest' };
  pathHint: 'lite' | 'full';
}

export interface SelectToStagingWall {
  kind: 'select-staging';
  runId: string;
  runnerRef: { runnerId: string };
  gateChoice: {
    guide: DescentGuide;
    mode: DescentMode;
    vesselId: VesselId;
  };
  alignmentSnapshot?: Alignment; // optional one-hop parity if Staging needs it
}

export interface StagingToDraftWall {
  kind: 'staging-draft';
  runId: string;
}

export interface DraftToLevelWall {
  kind: 'draft-level';
  runId: string;
  draftResultId?: string; // references chosen loadout
}

export interface LevelToDoorWall {
  kind: 'level-door';
  runId: string;
}

export interface DoorToDropWall {
  kind: 'door-drop';
  runId: string;
  doorChoice?: 'light' | 'dark' | 'secret';
}

export interface DropToStagingWall {
  kind: 'drop-staging';
  runId: string;
  dropReason?: 'death' | 'math-fail' | 'exit';
}
```

**Rules:**
- Wall packets are hop-only and non-persistent.
- No runner, inventory, or long-lived alignment lives on the wall.
- All persistent truth lives in `RunLedger`.

---

## 4. Light / Dark / Secret Economy

### 4.1 Alignment Representation

```ts
export interface AlignmentDelta {
  light: number; // may be negative
  dark: number;  // may be negative
}
```

Alignment is updated only via `updateAlignment(delta)` on the `runSlice`. Card effects, level events, and door costs all resolve to `AlignmentDelta` values.

### 4.2 Sources of Alignment Change

| System      | Input                                   | Output into RunLedger                         |
|------------|-----------------------------------------|-----------------------------------------------|
| Draft      | Card picks (each card has lightΔ/darkΔ) | Sum of selected card deltas → `alignment.current`. |
| Level      | Hits, choices, relic triggers           | Deltas applied immediately as they occur.     |
| Door       | Door costs and rewards                  | Cost: negative delta; reward: positive delta. |

Card schema (simplified):

```ts
export interface Card {
  id: string;
  name: string;
  lightDelta: number; // -3..+3 typical
  darkDelta: number;  // -3..+3 typical
  tags: string[];     // e.g. ['radiant', 'bleed', 'anchor']
}
```

### 4.3 Parity Snapshot

Parity is the ratio / relationship between Light and Dark at key checkpoints.

- At the end of Draft, the system may take a **parity snapshot**:

```ts
export interface ParitySnapshot {
  light: number;
  dark: number;
  depth: number;
}
```

- Snapshot is stored in `RunLedger.alignment.current` (no separate long-term field required), but Door logic reads that value along with `progress.depth` to compute requirements.

### 4.4 Secret / Threshold Behavior (Stub)

`Secret` doors are unlocked under specific parity patterns (e.g., near-balance, or high-magnitude difference). Tuning is open, but the contract is:

```ts
export type DoorType = 'light' | 'dark' | 'secret';

export interface DoorRequirement {
  door: DoorType;
  minLight?: number;
  minDark?: number;
  maxSpread?: number; // |light - dark| <= maxSpread for Secret
  depthMin?: number;
}
```

---

## 5. Draft System (Information Game)

### 5.1 Draft Flow

1. Staging computes a **DraftSeed** based on `RunLedger` (vessel, depth, history, meta flags).  
2. Draft uses the seed to query a card pool and present 2×(2 of 4) offers (Light side, Dark side) with 1 reroll.  
3. Each selection applies an `AlignmentDelta` and adds card ids to `RunLedger.inventory.draftCardIds`.  
4. On completion, Draft emits `DraftToLevelWall` with `runId` and `draftResultId` (optional grouping id).

### 5.2 DraftSeed (Engine-Facing)

```ts
export interface DraftSeed {
  runId: string;
  vesselId: VesselId;
  depth: number;
  guide: DescentGuide;
  mode: DescentMode;
  insight: number; // derived from metaFlags.penitentInsight and history
}
```

Implementation detail: DraftSeed is derived from `RunLedger` in Staging; it does not cross phases on the wall.

### 5.3 Visibility Tiers

Visibility is a function of depth and vessel insight.

```ts
export type VisibilityTier = 'lore-only' | 'hinted' | 'explicit';

export interface CardVisibility {
  tier: VisibilityTier;
  showParityValue: boolean;
  showKeywords: boolean;
  showSynergyTags: boolean;
}
```

Example mapping (v0):

- Depth 1–2: `tier = 'lore-only'` (no numeric parity, just text).  
- Depth 3–4: `tier = 'hinted'` (keywords + rough icons).  
- Depth 5+: `tier = 'explicit'` (exact Light/Dark values shown) — especially if Penitent.

The exact function is tunable, but the data shape above is what UIs rely on.

---

## 6. Level System (Cartridge Model)

### 6.1 Level Container Contract

`05level` is a container that mounts a particular **cartridge** implementation.

```ts
export type CartridgeId = 'grid3x3_v1' | 'future_boss_v1' | string;

export interface LevelConfig {
  cartridgeId: CartridgeId;
  depth: number;
  difficultyScale: number; // derived from depth and mode
  draftCards: string[];    // from RunLedger.inventory.draftCardIds
}

export interface LevelResult {
  alignmentDelta: AlignmentDelta; // net from this level
  hpDelta: number;                // negative when damaged
  succeeded: boolean;
}
```

Flow:
- Level Shell reads `RunLedger` to build `LevelConfig`.  
- Cartridge runs and returns `LevelResult`.  
- Shell applies `updateAlignment(levelResult.alignmentDelta)` and HP changes, then emits `LevelToDoorWall`.

### 6.2 HP Model (Stub)

HP is tracked locally per cartridge and written back as a scalar delta; global HP field can be added to `RunLedger` if needed:

```ts
export interface HealthState {
  current: number;
  max: number;
}
```

---

## 7. Door System (Parity & Depth)

### 7.1 Input Data

Door logic reads only from `RunLedger`:

- `alignment.current.light`
- `alignment.current.dark`
- `progress.depth`
- Optional: `metaFlags` for special cases.

### 7.2 Door Cost & Availability Function (v0 Sketch)

```ts
export interface DoorOption {
  door: DoorType;           // 'light' | 'dark' | 'secret'
  available: boolean;
  cost: AlignmentDelta;     // what will be subtracted if chosen
  reasonLocked?: string;    // for UI messaging
}

export function computeDoorOptions(
  alignment: Alignment,
  depth: number
): DoorOption[] {
  const baseCost = Math.max(1, depth); // simple scaling

  const lightDoor: DoorOption = {
    door: 'light',
    available: alignment.light >= baseCost,
    cost: { light: -baseCost, dark: 0 },
    reasonLocked: alignment.light >= baseCost ? undefined : 'Not enough Light.'
  };

  const darkDoor: DoorOption = {
    door: 'dark',
    available: alignment.dark >= baseCost,
    cost: { light: 0, dark: -baseCost },
    reasonLocked: alignment.dark >= baseCost ? undefined : 'Not enough Dark.'
  };

  const spread = Math.abs(alignment.light - alignment.dark);
  const secretAvailable = spread <= 2 && depth >= 2; // stub rule

  const secretDoor: DoorOption = {
    door: 'secret',
    available: secretAvailable,
    cost: { light: -baseCost, dark: -baseCost },
    reasonLocked: secretAvailable ? undefined : 'Parity or depth conditions not met.'
  };

  return [lightDoor, darkDoor, secretDoor];
}
```

Door Shell:
- Calls `computeDoorOptions` with current alignment and depth.  
- Lets player select an available door.  
- Applies the chosen `cost` via `updateAlignment`.  
- Dispatches `recordDoorChoice(door)` and `advanceDepth()` to `RunLedger`.  
- Emits `DoorToDropWall` with `doorChoice`.

---

## 8. Drop & Meta-Progression

### 8.1 Drop Reasons

```ts
export type DropReason = 'death' | 'math-fail' | 'exit';
```

- `death`: HP reached 0 in Level.  
- `math-fail`: No legal doors in Door.  
- `exit`: Explicit player choice to leave early or via a designed exit.

### 8.2 Memory Fragment Award (v0)

```ts
export function computeMemoryFragments(
  depth: number,
  dropReason: DropReason
): number {
  const base = depth; // 1 fragment per depth for v0
  switch (dropReason) {
    case 'death':
      return base + 1; // slight bonus for dying in combat
    case 'math-fail':
      return base;     // neutral
    case 'exit':
      return Math.max(1, base - 1); // slightly lower payout
  }
}
```

Drop Shell:
- Reads `RunLedger.progress.depth`.  
- Computes fragments and dispatches `addMemoryFragments`.  
- Dispatches `recordDrop(dropReason)` and increments `loopCount`.  
- Emits `DropToStagingWall` with `dropReason`.

### 8.3 Staging Accretion

Staging reads from:
- `RunLedger.inventory.memoryFragments`  
- `RunLedger.metaFlags.unlockedCodexKeys`  
- `RunLedger.history.phaseTrail`  

Staging then decides what new lore, upgrades, and vessels to surface. This is a pure read of `RunLedger` plus writes to long-term meta stores (Supabase, localStorage) as needed.

---

## 9. System ↔ Engine Binding

### 9.1 Where Systems Live

- **Engine (`du/phases`)**
  - Owns legality map and `engineTransition(from, to, wall)`.
  - Owns `RunMetaSnapshot` (mirror of `RunLedger`).
  - Knows phase graph, not UI.

- **React App (`web/react/app`)**
  - Owns `runSlice` (`RunLedger`) and `phaseSlice` (current phase + wall).
  - Implements Draft, Level, Door, Drop shells that call reducers and `requestTransition(wall)`.

### 9.2 Invariants

1. `RunLedger` is updated **before** `requestTransition` is called for a hop.  
2. `PhaseWallPacket` is always minimal and hop-specific.  
3. Only `requestTransition` may call `engineTransition`.  
4. Door math, Draft behavior, and Drop rewards read from `RunLedger`, not from the wall.  
5. Meta-progression writes (Memory Fragments, unlocked codex) occur in Drop or Staging shells only.

---

## 10. Open Design / Tuning Questions (For Lattice)

1. **Door Curve:** Final formula for cost scaling and Secret availability by depth and parity.
2. **Draft Visibility:** Exact mapping from depth + vessel to `VisibilityTier` configuration.
3. **Level HP Model:** Whether HP should move into `RunLedger` for cross-level continuity or remain cartridge-local.
4. **Meta Rewards:** Final balance for `computeMemoryFragments` and how Memory Fragments are spent in Staging.
5. **Vessel-specific Hooks:** Additional mechanics keyed off `metaFlags` (e.g., Penitent reading lore, Rebel breaking rules) that affect Draft/Level/Door.

This spec is intentionally v0: the contracts and shapes are designed to be safe to implement now and refine later without breaking the engine boundary.
