<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# From the files provides give a overview of Dudael by the domains or categories

Dudael is organized as a set of tightly linked domains that cover lore, game design, brand identity, engine architecture, and refactor strategy.[^1_1][^1_2][^1_3][^1_4][^1_5]

## World and lore

- Dudael is a **Quarantine** Zone in the Echo and Voids sector, built to contain fallen angels as forensic evidence rather than as a simple prison.[^1_4]
- The world is anchored in oiketrion theology: angels abandoned their proper habitation, and the Drop is where they process that choice.[^1_3][^1_4]
- The lore incorporates Watchers, Nephilim, and specific fallen/archangel figures as a deep background layer for entities, bosses, and locations like the Abyss of Dudael.[^1_3]


## Entities and character classes

- Five Bound/Vessel archetypes structure the cast: Seraph, Shadow, Exile, Penitent, Rebel, each defined by their relationship to Light/Dark and to the lost habitation.[^1_4][^1_3]
- A two‑layer character model separates inherited Sigil (entity identity) from chosen Vessel (player configuration), later reframed into a three‑layer stack: Meta Guides, the Bound, and Descent Mode (Steward vs Solo).[^1_2][^1_3][^1_4]
- Guides (Surveyor, Smuggler) and Keepers manage staging, meta‑economy, and card draft tone through innocent child avatars.[^1_3][^1_4]


## Game loop and systems

- Core structure is a 7‑phase roguelike loop: Title → Select → Staging → Draft → Level → Door → Drop, with designed death feeding persistent progression.[^1_1][^1_2][^1_4]
- Light/Dark parity is the main economy: each card and level shifts a scale, which gates Door options (Light, Dark, Secret) and is snapshot at key points.[^1_4][^1_3]
- Meta‑progression lives in the Staging Area: previous runs, unlocked lore, Vessel growth, and Memory Fragments from the Drop accumulate there over time.[^1_1][^1_3][^1_4]


## Brand, aesthetic, and identity

- Sinerine is the brand identity: a tri‑polar palette (Light, Dark, Threshold) with 43 tokens for color, typography, spacing, and shadows seeded into Supabase.[^1_3][^1_4]
- Visual tone is “forensic theophany”: grayscale spirals, clinical UI, rock‑opera audio cues, and door/card glows mapped directly to Light/Dark/Secret states.[^1_1][^1_4][^1_3]
- Typography is codified: Cinzel for headings, Inter for body, JetBrains Mono for stats, with strict usage rules so lore and numeric data remain visually separated.[^1_3]


## Engine, architecture, and workbench

- The implementation is a TypeScript/React monorepo with a lite‑game domain for mechanics, game‑lore for narrative, and admin/index spaces for tools and project ops.[^1_2][^1_1][^1_3]
- A Redux‑driven state machine runs the phases, with a canonical PhasePacket (PhaseWallPacket) handoff and a separate run/meta store to avoid data‑shape drift.[^1_5][^1_2]
- Recent work focuses on “The Gate” refactor: three‑layer narrative architecture, packet normalization, Run Repo vs PhaseWall separation, and portfolio‑ready modular phase shells.[^1_5][^1_2]
<span style="display:none">[^1_6][^1_7][^1_8]</span>

<div align="center">⁂</div>

[^1_1]: pasted-text.txt

[^1_2]: DUDAEL_Gate_Refactor_Brief_for_Chat.docx

[^1_3]: Oiketrion.md

[^1_4]: Dudael_Lore_Compilation.docx

[^1_5]: pasted-text.txt

[^1_6]: 
# FALLEN ANGELS GAME — SPRINT PLAN \& TASK CHECKLIST

[^1_7]: FALLEN ANGELS: LITE GAME Proto Index

[^1_8]: Core Vessel shape


---

# You evaluation from the linked docs

You already have the core architecture and narrative frame in a very strong place; what’s left is mostly consolidation and discipline around data shapes and boundaries.[^2_1][^2_2]

## What’s working especially well

- The 7‑phase loop plus Hades‑style meta‑progression is coherent, testable, and already implemented end‑to‑end; transitions are centralized through a single Redux thunk, which is exactly right for long‑term maintainability.[^2_2][^2_3][^2_1]
- The PhaseWall/Run Repo mental model is excellent systems thinking: phases get a minimal handoff contract, while a separate run/meta store accumulates identity, depth, parity, and history.[^2_2]
- Narrative, theology (oiketrion, Watchers), and Sinerine brand tokens are unusually integrated with mechanics, so almost every visual and system choice carries thematic weight.[^2_4][^2_5]


## Where it’s fragile right now

- Data‑shape drift is the main structural risk: PhasePacket currently carries legacy fields (identity, selection, kind, isLegacy, lite variants) and some phases still spread `...prev`, so multiple “truths” for identity and gate can coexist silently.[^2_2]
- Phases reading and writing packets via localStorage (instead of only through Redux + engine) undermines the PhaseWall idea and introduces desync potential on reloads or late refactors.[^2_2]
- Side‑effect logic still falls back through several representations (`gate.vesselId ?? identity.vessel ?? player.vessel`), which keeps deprecated shapes alive and makes behavior feel “off” rather than obviously broken.[^2_2]


## Highest‑leverage improvements

- Make PhasePacket truly wall‑only: for each hop (Title→Select, Select→Staging, etc.), explicitly define the minimal fields allowed on the packet and stop forwarding anything else; no `...prev` spreads.[^2_2]
- Let Redux own the active packet: store the current wall packet alongside the current phase, and stop reading packets directly from localStorage in UI shells.[^2_2]
- Normalize once, then delete legacy paths: on boot/recovery, migrate any old `identity/selection/kind/isLegacy` shapes into the new `player`/`gate` schema, and remove all multi‑field fallback chains from manager/meta logic.[^2_2]


## Design and product positioning

- As a portfolio piece, Dudael already shows senior‑level thinking: domain‑driven structure, clear separation of engine vs shell, and a story/brand system that is formalized as tokens and contracts.[^2_3][^2_5][^2_1][^2_4][^2_2]
- The remaining work (packet discipline, a small `runSlice`, Tailwind‑backed visual polish on Title/Select) is all high‑impact, low‑scope polish that will make the build feel as intentional as the docs and diagrams already are.[^2_1][^2_2]

<div align="center">⁂</div>

[^2_1]: pasted-text.txt

[^2_2]: pasted-text.txt

[^2_3]: DUDAEL_Gate_Refactor_Brief_for_Chat.docx

[^2_4]: Oiketrion.md

[^2_5]: Dudael_Lore_Compilation.docx


---

# Can you provide a packet discipline strategy with options for a sound data model mix to moderate to full, extendable. Suggest naming for field is more clarity. For instance the term identity ins the Sinerein system is closer to brand, the term is use as a marker of tokens with rational the support mission and function.  May PhaseWall Packets and run packets.

Here’s a concrete packet discipline strategy with naming that fits Sinerine’s language and is easy to scale from minimal to full.

***

## 1. Two canonical data shapes

### PhaseWall packet (transient handoff)

Rename to: **PhaseWallPacket**

Purpose: “What the next phase must know right now.”

Minimal core:

```ts
export interface PhaseWallPacket {
  fromPhase: GamePhaseId;     // e.g. "title"
  toPhase: GamePhaseId;       // e.g. "select"
  wallAt: number;             // timestamp
  runId?: string;             // optional pointer into run-state
  // plus a small per-hop payload (see profiles below)
}
```

Key naming shifts:

- Use **`runner`** for the current player-in-run, to avoid overloading *identity*.
- Use **`gateChoice`** for Guide/Mode/Vessel lock, not `identity` or `selection`.
- Use **`alignmentSnapshot`** only when you truly need a one-hop parity snapshot.

Example per-hop payload type:

```ts
export type PhaseWallPayload =
  | TitleToSelectWall
  | SelectToStagingWall
  | StagingToDraftWall
  | DraftToLevelWall
  | LevelToDoorWall
  | DoorToDropWall
  | DropToStagingWall;

export interface TitleToSelectWall {
  kind: "title->select";
  userRef: { userId: string | "guest" };
  pathHint: "lite" | "full";
}

export interface SelectToStagingWall {
  kind: "select->staging";
  runId: string;
  runnerRef: { runnerId: string };     // same as run’s runner.id
  gateChoice: {
    guide: "light" | "dark";
    descentMode: "steward" | "solo";
    vesselId: VesselId;
  };
}
```

The packet type then becomes:

```ts
export interface PhaseWallPacket {
  fromPhase: GamePhaseId;
  toPhase: GamePhaseId;
  wallAt: number;
  payload: PhaseWallPayload;
}
```

All other state lives outside the wall.

***

### Run packet (persistent run state)

Rename to: **RunStatePacket** or **RunLedger**

Purpose: “What is true about this descent across all phases and reloads.”

Moderate version:

```ts
export interface RunStatePacket {
  runId: string;
  runner: {
    runnerId: string;                 // stable per run
    userId: string | "guest";
    vesselId?: VesselId;              // set after Select
    sigilKey?: string;                // lore key, not brand identity
    displayName?: string;
  };
  gateLock?: {
    guide: "light" | "dark";
    descentMode: "steward" | "solo";
    vesselId: VesselId;
    lockedAtPhase: GamePhaseId;       // usually "staging"
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
    draftCardIds: string[];           // last selected cards
  };
  history: {
    phaseTrail: GamePhaseId[];
    lastDoorChoice?: "light" | "dark" | "secret";
    lastDropReason?: "death" | "math-fail" | "exit";
  };
}
```

Full/extensible version simply adds clearly named extension buckets:

```ts
export interface RunStatePacket {
  // ...core as above...
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


***

## 2. Three discipline levels (minimal → full)

### Level 1 – Minimal (what you can ship this week)

Rule: “Wall is tiny; run state holds truth; no spreads.”

- **PhaseWallPacket**
    - Only ever contains:
        - `fromPhase`, `toPhase`, `wallAt`
        - A *single* payload object for that hop (e.g. `SelectToStagingWall`).
    - No `runner`, no `alignment`, no `inventory` on the wall.
- **RunStatePacket**
    - Lives in Redux (e.g. `runSlice`) and session/local storage for recovery.
    - Side‑effects mutate `RunStatePacket` on transitions (via `applySideEffects`).

Implementation discipline:

- Every phase builds outgoing wall packets **without** `...prev`.
- Side‑effects (manager/meta) only read **canonical** fields from `RunStatePacket` plus the current wall payload.

This already kills drift.[^3_1]

***

### Level 2 – Moderate (light pointers, richer run)

Rule: “Wall can carry a pointer and a micro-snapshot; run state still primary.”

- Keep Level 1 rules, plus:
    - Allow **one small snapshot** when needed:
        - `alignmentSnapshot` on `select->staging` *only* if Staging UI needs it.
        - `doorChoiceSummary` on `door->drop` if Drop needs to render a recap without recompute.

Example:

```ts
export interface SelectToStagingWall {
  kind: "select->staging";
  runId: string;
  runnerRef: { runnerId: string };
  gateChoice: { guide: GuideId; descentMode: DescentMode; vesselId: VesselId };
  alignmentSnapshot?: { light: number; dark: number };
}
```

Everything else still comes from `RunStatePacket`.

***

### Level 3 – Full / extensible

Rule: “Wall remains declarative; extensions must be namespaced and one-hop.”

- Add a generic extension field on the wall, but keep it constrained:

```ts
export interface PhaseWallPacket {
  fromPhase: GamePhaseId;
  toPhase: GamePhaseId;
  wallAt: number;
  payload: PhaseWallPayload;
  extension?: {
    debug?: unknown;
    experimentTag?: string;
  };
}
```

Constraints:

- Anything under `extension` must be **optional** and **one-hop**; no phase may rely on it for core progression logic.
- If an extension becomes important, promote it into either:
    - The explicit payload for that hop, or
    - The `RunStatePacket`.

***

## 3. Naming guidelines for clarity

Given “identity” in Sinerine is brand/marker, avoid it for player state.

Use this vocabulary:

- **Brand / tokens**
    - `sinerineIdentity` (if you need a brand object): describes palette, typography, mission; never on the PhaseWall.
    - `sigilKey`: a lore symbol pointing into the codex, not a run identity.
- **Player / run**
    - `runner`: the active entity in the descent.
    - `runnerId`: unique per run (could be derived from runId).
    - `userRef` or `userAccount`: external Supabase user.
- **Choice lock**
    - `gateChoice` (on the wall).
    - `gateLock` (in the RunStatePacket, once fixed).
- **Alignment**
    - `alignmentSnapshot` for wall;
    - `alignment.currentLight/currentDark` for the persistent state.
- **Packets**
    - `PhaseWallPacket` – transient, hop‑only.
    - `RunStatePacket` or `RunLedger` – persistent, across the whole Drop loop.

***

## 4. Suggested per-hop wall contracts

You can encode these as TypeScript unions, but conceptually:

- **title → select**
    - Must: `userRef`, `pathHint`.
    - No runner, no gate, no alignment.
- **select → staging**
    - Must: `runId`, `runnerRef`, `gateChoice`.
    - May: `alignmentSnapshot`.
- **staging → draft**
    - Usually: nothing, or a single `draftSeed`.
- **draft → level**
    - Optional: `loadoutId` or `draftResultId`.
- **level → door**
    - Usually: nothing (Door reads `RunStatePacket.alignment`).
- **door → drop**
    - Optional: `doorChoice`, `paidCostSummary`.
- **drop → staging**
    - Optional: `dropReason`.

Everything else is RunLedger.

***

If you tell me your exact `GamePhaseId` enum and desired canonical `gateLock` shape, I can rewrite the TS interfaces directly against those names.

<div align="center">⁂</div>

[^3_1]: pasted-text.txt


---

# here is phase/types  you many consider this the zero build, and  all suggestions and recommendations are welcome  // phases/types.ts

export type PhaseId =
  | "01_title"
  | "02_select"
  | "03_staging"
  | "04_draft"
  | "05_level"
  | "06_door"
  | "07_drop";

export type Alignment = { light: number; dark: number };

export type PlayerIdentity = {
  id: string;
  // kind?: "player";                // player:...
  displayName?: string;
  vessel?: string;            // vessel:...
  sigil?: string;             // sigil:...
  // tags?: string[];            // e.g. ["early_supporter", "beta_tester", ...]
};

// ── Generic picker (retained for Draft and future pool-based UIs) ──────────
export type Choice<T> = {
  pool: SelectionPool<T>;
  chosen: T | null;
};

/**
 * @deprecated Use `Choice<PlayerIdentity>` instead.
 * Kept temporarily so existing serialized packets don't break at runtime.
 */
export type Selection = Choice<PlayerIdentity>;

// ── Gate selection: the 3-step Select flow (Guide → Mode → Vessel) ─────────
export type DescentGuide = "light" | "dark";
export type DescentMode  = "steward" | "solo";
export type VesselId     = "seraph" | "shadow" | "exile" | "penitent" | "rebel";

export type GateSelection = {
  guide?:    DescentGuide;
  mode?:     DescentMode;
  vesselId?: VesselId;
};

// ── Phase packet: the contract that carries state between phases ───────────
export type PhasePacket = {
  from: PhaseId;
  to: PhaseId;
  ts: number;

user?: { id?: string };
  identity?: { vessel?: string; sigil?: string };

player?: PlayerIdentity;

/** @deprecated Prefer `gate` for the Select phase. Retained for title-exchange compat. */
  selection?: Selection;

/** New canonical field — written by the 3-step Gate (02_select) */
  gate?: GateSelection;

alignment?: Alignment;
  depth?: number;
  inventory?: string[];

meta?: Record<string, unknown>;
};

// ── Packet builder: eliminates partial-cast-to-full issues ─────────────────
export function buildPacket(
  from: PhaseId,
  to: PhaseId,
  patch?: Partial<PhasePacket>,
): PhasePacket {
  return {
    from,
    to,
    ts: Date.now(),
    ...patch,
  };
}

export type SelectionPool<T = PlayerIdentity> = {
  id: string;
  items: T[];
  rules?: {
    maxPick?: number;
    filterTags?: string[];
  };
};

Here’s a disciplined redesign starting from this “zero build,” with naming and structure aligned to how you’re actually using the system.[^4_1]

***

## 1. Rename and narrow the wall packet

Treat this as the **PhaseWallPacket**: a minimal, hop‑only contract.

```ts
// phases/types.ts

export type PhaseId =
  | "01_title"
  | "02_select"
  | "03_staging"
  | "04_draft"
  | "05_level"
  | "06_door"
  | "07_drop";

export type Alignment = { light: number; dark: number };

// Runner = player-in-this-run, not brand identity
export type RunnerProfile = {
  runnerId: string;          // stable per run
  userId?: string;           // Supabase id, optional for guests
  displayName?: string;
  vesselId?: VesselId;       // set after Gate lock
  sigilKey?: string;         // lore key, not Sinerine brand identity
};

// Generic picker (kept for Draft and any pool UIs)
export type Choice<T> = {
  pool: SelectionPool<T>;
  chosen: T | null;
};

export type DescentGuide = "light" | "dark";
export type DescentMode  = "steward" | "solo";
export type VesselId     = "seraph" | "shadow" | "exile" | "penitent" | "rebel";

export type GateChoice = {
  guide?: DescentGuide;
  mode?: DescentMode;
  vesselId?: VesselId;
};
```


### New: per-hop payload union

This replaces the “everything on one shape” pattern and forces discipline.

```ts
// What the wall actually carries between specific phases
export type PhaseWallPayload =
  | TitleToSelectWall
  | SelectToStagingWall
  | StagingToDraftWall
  | DraftToLevelWall
  | LevelToDoorWall
  | DoorToDropWall
  | DropToStagingWall;

export type TitleToSelectWall = {
  kind: "title->select";
  userRef: { userId: string | "guest" };
  pathHint: "lite" | "full";
};

export type SelectToStagingWall = {
  kind: "select->staging";
  runId: string;
  runnerRef: { runnerId: string };
  gateChoice: GateChoice;
  alignmentSnapshot?: Alignment; // only if Staging needs it
};

export type StagingToDraftWall = {
  kind: "staging->draft";
  runId: string;
};

export type DraftToLevelWall = {
  kind: "draft->level";
  runId: string;
  draftResultId?: string;
};

export type LevelToDoorWall = {
  kind: "level->door";
  runId: string;
};

export type DoorToDropWall = {
  kind: "door->drop";
  runId: string;
  doorChoice?: "light" | "dark" | "secret";
};

export type DropToStagingWall = {
  kind: "drop->staging";
  runId: string;
  dropReason?: "death" | "math_fail" | "exit";
};
```


### Canonical wall type + builder

```ts
export type PhaseWallPacket = {
  from: PhaseId;
  to: PhaseId;
  ts: number;
  payload: PhaseWallPayload;
};

export function buildWallPacket(
  from: PhaseId,
  to: PhaseId,
  payload: PhaseWallPayload,
): PhaseWallPacket {
  return {
    from,
    to,
    ts: Date.now(),
    payload,
  };
}
```

**Key changes vs your current PhasePacket:**

- `user`, `identity`, `player`, `gate`, `alignment`, `depth`, `inventory`, `meta` all move out of the wall into run/meta state.
- No `Partial<PhasePacket>` patching, no `...prev` spreading.[^4_1]

***

## 2. Introduce a separate RunState packet

This is the **RunLedger**: what’s true for the whole descent.

```ts
export type RunLedger = {
  runId: string;

  runner: RunnerProfile;

  gateLock?: {
    guide: DescentGuide;
    mode: DescentMode;
    vesselId: VesselId;
    lockedAt: PhaseId;          // usually "03_staging"
  };

  progress: {
    depth: number;
    loopCount: number;
  };

  alignment: {
    current: Alignment;
  };

  inventory: {
    memoryFragments: number;
    relicIds: string[];
    draftCardIds: string[];
  };

  history: {
    phaseTrail: PhaseId[];
    lastDoorChoice?: "light" | "dark" | "secret";
    lastDropReason?: "death" | "math_fail" | "exit";
  };

  // Optional extension buckets
  metaFlags?: {
    penitentInsight: number;
    rebelBreaches: number;
    unlockedCodexKeys: string[];
  };

  // Never required for progression
  telemetry?: {
    totalClicks: number;
    totalRuns: number;
  };

  debugTrace?: Record<string, unknown>;
};
```

You’d keep `RunLedger` in:

- Redux (`runSlice`) as the primary source of truth,
- plus session/local storage or Supabase for recovery.

Side‑effect code (`applySideEffects`) mutates `RunLedger`, not the wall.

***

## 3. Migration from your current PhasePacket

Starting from your zero build:

```ts
export type PhasePacket = {
  from: PhaseId;
  to: PhaseId;
  ts: number;

  user?: { id?: string };
  identity?: { vessel?: string; sigil?: string };

  player?: PlayerIdentity;

  selection?: Selection; // deprecated

  gate?: GateSelection;

  alignment?: Alignment;
  depth?: number;
  inventory?: string[];

  meta?: Record<string, unknown>;
};
```


### Step 1 – Freeze and alias

- Keep this as `LegacyPhasePacket` just for migration:

```ts
export type LegacyPhasePacket = PhasePacket; // rename file-local
```

- Stop adding new fields to it.
- Write a `normalizeLegacyPacket` helper that produces:
    - a `RunLedger` (or partial) and
    - a new `PhaseWallPacket`.

Example sketch:

```ts
export function normalizeLegacyPacket(
  legacy: LegacyPhasePacket,
): { run: Partial<RunLedger>; wall: PhaseWallPacket } {
  const runId = legacy.meta?.runId as string || `run-${legacy.ts}`;

  const runner: RunnerProfile = {
    runnerId: runId,
    userId: legacy.user?.id,
    displayName: legacy.player?.displayName,
    vesselId: (legacy.gate?.vesselId ??
               legacy.identity?.vessel) as VesselId | undefined,
    sigilKey: legacy.identity?.sigil,
  };

  const gateLock = legacy.gate?.vesselId
    ? {
        guide: legacy.gate.guide!,
        mode: legacy.gate.mode!,
        vesselId: legacy.gate.vesselId!,
        lockedAt: legacy.to,
      }
    : undefined;

  const run: Partial<RunLedger> = {
    runId,
    runner,
    gateLock,
    progress: { depth: legacy.depth ?? 0, loopCount: 0 },
    alignment: { current: legacy.alignment ?? { light: 0, dark: 0 } },
    inventory: {
      memoryFragments: 0,
      relicIds: [],
      draftCardIds: legacy.inventory ?? [],
    },
    history: { phaseTrail: [legacy.from, legacy.to] },
  };

  const wall = buildWallPacket(
    legacy.from,
    legacy.to,
    {
      kind: `${legacy.from.replace("01_", "title")
                  .replace("02_", "select")
                  .replace("03_", "staging")
                  .replace("04_", "draft")
                  .replace("05_", "level")
                  .replace("06_", "door")
                  .replace("07_", "drop")}->${legacy.to.replace("01_", "title")
                   .replace("02_", "select")
                   .replace("03_", "staging")
                   .replace("04_", "draft")
                   .replace("05_", "level")
                   .replace("06_", "door")
                   .replace("07_", "drop")}` as PhaseWallPayload["kind"],
      runId,
      runnerRef: { runnerId: runId },
    } as any,  // you can branch kind-specific logic here
  );

  return { run, wall };
}
```

You don’t have to keep this perfect; it just gets you off the old shape without breaking saves.

***

## 4. Updated SelectionPool and Draft usage

Your existing pool type works fine; just carry it forward:

```ts
export type SelectionPool<T = RunnerProfile> = {
  id: string;
  items: T[];
  rules?: {
    maxPick?: number;
    filterTags?: string[];
  };
};
```

For Draft, `Choice<T>` stays; it is purely local to that phase and never needs to sit on the wall or in the run ledger except as a “draftCardIds`snapshot if you want that in`RunLedger.inventory`.

***

## 5. Summary of recommended renames and roles

- **PhasePacket → PhaseWallPacket**
    - Only hop‑specific payload; no long‑lived state.
- **PlayerIdentity → RunnerProfile**
    - Clarifies this is “player in this run,” distinct from Sinerine identity markers.
- **GateSelection → GateChoice** on the wall; **gateLock** in `RunLedger`.
- **identity.vessel/sigil → runner.vesselId / runner.sigilKey**
    - Frees “identity” for Sinerine brand / token taxonomies elsewhere.
- **Alignment on wall → alignmentSnapshot (only where needed)**
    - Canonical alignment lives in `RunLedger.alignment.current`.

If you’d like, next step I can sketch a `runSlice` (Redux Toolkit) that uses `RunLedger` and shows exactly how Title and Select would write to it while only passing tiny wall packets between phases.[^4_1]

<div align="center">⁂</div>

[^4_1]: pasted-text.txt


---

# Yes please 😁

Here’s a lean `runSlice` plus how Title and Select would interact with it using the new PhaseWallPacket / RunLedger shapes.[^5_1]

***

## 1. Run slice: single source of truth

```ts
// app/runSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RunLedger, GateChoice, Alignment, PhaseId } from "../phases/types";

export type RunState = RunLedger | null;

const initialState: RunState = null;

const runSlice = createSlice({
  name: "run",
  initialState,
  reducers: {
    initRun(state, action: PayloadAction<{ runId: string; runner: RunLedger["runner"] }>) {
      return {
        runId: action.payload.runId,
        runner: action.payload.runner,
        gateLock: undefined,
        progress: { depth: 0, loopCount: 0 },
        alignment: { current: { light: 0, dark: 0 } },
        inventory: { memoryFragments: 0, relicIds: [], draftCardIds: [] },
        history: { phaseTrail: [] },
        metaFlags: { penitentInsight: 0, rebelBreaches: 0, unlockedCodexKeys: [] },
        telemetry: { totalClicks: 0, totalRuns: 0 },
        debugTrace: {},
      };
    },

    lockGate(state, action: PayloadAction<{ choice: Required<GateChoice>; lockedAt: PhaseId }>) {
      if (!state) return;
      state.gateLock = {
        guide: action.payload.choice.guide,
        mode: action.payload.choice.mode,
        vesselId: action.payload.choice.vesselId,
        lockedAt: action.payload.lockedAt,
      };
      state.runner.vesselId = action.payload.choice.vesselId;
    },

    updateAlignment(state, action: PayloadAction<{ delta: Alignment }>) {
      if (!state) return;
      state.alignment.current.light += action.payload.delta.light;
      state.alignment.current.dark += action.payload.delta.dark;
    },

    advanceDepth(state) {
      if (!state) return;
      state.progress.depth += 1;
    },

    recordPhase(state, action: PayloadAction<PhaseId>) {
      if (!state) return;
      state.history.phaseTrail.push(action.payload);
    },

    recordDoorChoice(
      state,
      action: PayloadAction<"light" | "dark" | "secret">
    ) {
      if (!state) return;
      state.history.lastDoorChoice = action.payload;
    },

    recordDrop(
      state,
      action: PayloadAction<"death" | "math_fail" | "exit">
    ) {
      if (!state) return;
      state.history.lastDropReason = action.payload;
      state.progress.loopCount += 1;
    },

    addMemoryFragments(state, action: PayloadAction<number>) {
      if (!state) return;
      state.inventory.memoryFragments += action.payload;
    },

    setDraftCards(state, action: PayloadAction<string[]>) {
      if (!state) return;
      state.inventory.draftCardIds = action.payload;
    },

    hydrateRun(_state, action: PayloadAction<RunLedger>) {
      return action.payload;
    },

    clearRun() {
      return null;
    },
  },
});

export const {
  initRun,
  lockGate,
  updateAlignment,
  advanceDepth,
  recordPhase,
  recordDoorChoice,
  recordDrop,
  addMemoryFragments,
  setDraftCards,
  hydrateRun,
  clearRun,
} = runSlice.actions;

export const runReducer = runSlice.reducer;

// Selectors
export const selectRun = (state: RootState) => state.run;
export const selectRunner = (state: RootState) => state.run?.runner ?? null;
export const selectGateLock = (state: RootState) => state.run?.gateLock ?? null;
export const selectAlignment = (state: RootState) => state.run?.alignment.current ?? null;
```


***

## 2. Title: create run + first wall packet

Title creates the `runId` and `runner`, seeds `RunLedger`, and emits a tiny wall packet.

```ts
// phases/01_title/title-shell.tsx
import { useAppDispatch } from "../../app/hooks";
import { initRun } from "../../app/runSlice";
import { buildWallPacket, PhaseWallPacket, TitleToSelectWall } from "../types";

function createRunId() {
  return `run-${Date.now()}`;
}

export async function handleEnterFromTitle(dispatch: AppDispatch, userId?: string) {
  const runId = createRunId();

  const runner = {
    runnerId: runId,
    userId,
    displayName: "Wanderer", // or from profile
    vesselId: undefined,
    sigilKey: undefined,
  };

  dispatch(initRun({ runId, runner }));

  const payload: TitleToSelectWall = {
    kind: "title->select",
    userRef: { userId: userId ?? "guest" },
    pathHint: userId ? "full" : "lite",
  };

  const wall: PhaseWallPacket = buildWallPacket("01_title", "02_select", payload);

  // dispatch your existing requestTransition thunk with this wall
  dispatch(requestTransition(wall));
}
```


***

## 3. Select: lock Gate, update run, send wall

Select reads the current `RunLedger`, locks Gate, and sends only `GateChoice` + refs on the wall.

```ts
// phases/02_select/select-shell.tsx
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectRun, lockGate } from "../../app/runSlice";
import {
  buildWallPacket,
  PhaseWallPacket,
  SelectToStagingWall,
  GateChoice,
  VesselId,
} from "../types";

export function useSelectHandlers() {
  const dispatch = useAppDispatch();
  const run = useAppSelector(selectRun);

  function handleLockGate(choice: Required<GateChoice>) {
    if (!run) {
      console.warn("No run initialized before Gate lock");
      return;
    }

    // 1) Update persistent run state
    dispatch(
      lockGate({
        choice,
        lockedAt: "03_staging",
      }),
    );

    // 2) Build minimal wall packet to Staging
    const payload: SelectToStagingWall = {
      kind: "select->staging",
      runId: run.runId,
      runnerRef: { runnerId: run.runner.runnerId },
      gateChoice: choice,
      // alignmentSnapshot optional: only if Staging needs immediate parity
    };

    const wall: PhaseWallPacket = buildWallPacket(
      "02_select",
      "03_staging",
      payload,
    );

    dispatch(requestTransition(wall));
  }

  return { handleLockGate };
}
```

Staging then:

- uses `runSlice` for everything (runner, gateLock, alignment),
- and only uses the wall payload if it wants to know “how did we get here” in a strictly one‑hop way.

***

## 4. Contract discipline recap

- **RunLedger (`runSlice`)**
    - Owns all long‑lived facts: runner, Gate lock, depth, alignment, inventory, history.
    - Only modified by reducer actions like `lockGate`, `advanceDepth`, etc.[^5_1]
- **PhaseWallPacket**
    - Tiny, hop‑only.
    - Title → Select carries `{ userRef, pathHint }`.
    - Select → Staging carries `{ runId, runnerRef, gateChoice }`.
    - No spreading from previous packets, no alignment/inventory duplication.

If you want, next we can do a short sketch of `requestTransition(wall)` showing how it calls the engine, applies side‑effects to `RunLedger`, and updates the current phase without ever letting the wall grow.

<div align="center">⁂</div>

[^5_1]: pasted-text.txt


---

# Yes please 😊

Here’s a lean `requestTransition` that treats the PhaseWall as a tiny hop contract and lets the run slice + engine own everything else.[^6_1]

***

## 1. Phase slice with wall packet

```ts
// app/phaseSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PhaseId, PhaseWallPacket } from "../phases/types";

export type PhaseState = {
  current: PhaseId;
  wall: PhaseWallPacket | null;
  lastError?: string;
};

const initialState: PhaseState = {
  current: "01_title",
  wall: null,
  lastError: undefined,
};

const phaseSlice = createSlice({
  name: "phase",
  initialState,
  reducers: {
    setPhaseAndWall(
      state,
      action: PayloadAction<{ phase: PhaseId; wall: PhaseWallPacket | null }>,
    ) {
      state.current = action.payload.phase;
      state.wall = action.payload.wall;
      state.lastError = undefined;
    },
    transitionFailed(state, action: PayloadAction<string>) {
      state.lastError = action.payload;
    },
  },
});

export const { setPhaseAndWall, transitionFailed } = phaseSlice.actions;
export const phaseReducer = phaseSlice.reducer;

export const selectCurrentPhase = (s: RootState) => s.phase.current;
export const selectCurrentWall  = (s: RootState) => s.phase.wall;
```


***

## 2. requestTransition thunk

This thunk:

1. Calls the pure engine transition with the wall packet.
2. Applies side‑effects to `RunLedger` via runSlice actions.
3. Updates current phase + wall packet in Redux.[^6_1]
```ts
// app/requestTransition.ts
import type { AppDispatch, RootState } from "./store";
import { setPhaseAndWall, transitionFailed } from "./phaseSlice";
import { selectRun, updateAlignment, advanceDepth, recordPhase,
         recordDoorChoice, recordDrop, addMemoryFragments } from "./runSlice";
import type { PhaseWallPacket, PhaseId } from "../phases/types";
import { engineTransition } from "../engine/manager"; // your existing pure engine fn

export function requestTransition(wall: PhaseWallPacket) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const from: PhaseId = state.phase.current;

    // 1) Guard: wall.from must match current phase
    if (from !== wall.from) {
      dispatch(
        transitionFailed(
          `Illegal transition: wall.from=${wall.from} but current=${from}`,
        ),
      );
      return;
    }

    // 2) Let engine validate legality and compute next phase
    const result = engineTransition(from, wall.to);
    if (!result.ok) {
      dispatch(transitionFailed(result.detail ?? "Transition blocked"));
      return;
    }

    const nextPhase = result.phase as PhaseId;

    // 3) Apply run side-effects based on this hop
    const run = selectRun(getState());
    if (run) {
      // record phase history
      dispatch(recordPhase(nextPhase));

      switch (wall.payload.kind) {
        case "select->staging": {
          // Example: you might set starting alignment here later
          break;
        }
        case "draft->level": {
          // maybe advance depth before entering level
          dispatch(advanceDepth());
          break;
        }
        case "level->door": {
          // alignment deltas from level already applied in Level via updateAlignment
          break;
        }
        case "door->drop": {
          if (wall.payload.doorChoice) {
            dispatch(recordDoorChoice(wall.payload.doorChoice));
          }
          break;
        }
        case "drop->staging": {
          if (wall.payload.dropReason) {
            dispatch(recordDrop(wall.payload.dropReason));
          }
          // Example: reward fragments on death
          if (wall.payload.dropReason === "death") {
            dispatch(addMemoryFragments(5));
          }
          break;
        }
        default:
          break;
      }
    }

    // 4) Commit new phase + wall into Redux
    dispatch(
      setPhaseAndWall({
        phase: nextPhase,
        wall,
      }),
    );

    // 5) Optional: checkpoint for recovery
    // persistRunAndPhase(getState().run, { phase: nextPhase, wall });
  };
}
```

Notes:

- `engineTransition(from, to)` stays pure: no data, just legality and maybe phase graph logic.[^6_1]
- All run mutations happen via `runSlice` actions; nothing mutates the wall.
- Wall packets never get spread or augmented inside the thunk.

***

## 3. How phases use it

- **Title**: builds `TitleToSelectWall`, calls `requestTransition(wall)` after `initRun`.
- **Select**: dispatches `lockGate` on `runSlice`, then builds `SelectToStagingWall` and calls `requestTransition(wall)`.
- Downstream phases (Staging, Draft, Level, Door, Drop) read everything they need from `runSlice`, and only send a tiny payload wall when they commit to the next phase.

If you share your current `engineTransition` signature, I can tighten the types so `requestTransition` matches it exactly.

<div align="center">⁂</div>

[^6_1]: pasted-text.txt


---

# right now it used in phaseSlice // web/react_app/src/app/phaseSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PhaseId, PhasePacket } from "@du/phases";
import { transition as engineTransition, buildPacket } from "@du/phases";
import { restoreSnapshot, hydrateFromSnapshot, getRunMeta, type RunMetaSnapshot } from "@du/phases/meta";

import type { AppDispatch, RootState } from "./store";

type PhaseState = {
  current: PhaseId;
  lastError?: string;
  // keep the meta snapshot here so UI can read it easily
  meta: Readonly<RunMetaSnapshot>;
};

const snap = restoreSnapshot();
if (snap) hydrateFromSnapshot(snap);

const initialState: PhaseState = {
  current: (snap?.phaseHistory?.[snap.phaseHistory.length - 1] as PhaseId) ?? "01_title",
  meta: getRunMeta(),
};

const slice = createSlice({
  name: "phase",
  initialState,
  reducers: {
    setPhase(state, action: PayloadAction<PhaseId>) {
      state.current = action.payload;
      state.meta = getRunMeta();
      state.lastError = undefined;
    },
    transitionFailed(state, action: PayloadAction<string>) {
      state.lastError = action.payload;
    },
    syncMeta(state) {
      state.meta = getRunMeta();
    },
  },
});

export const { setPhase, transitionFailed, syncMeta } = slice.actions;
export const phaseReducer = slice.reducer;

// selectors
export const selectPhase = (s: RootState) => s.phase.current;
export const selectMeta = (s: RootState) => s.phase.meta;
export const selectPhaseError = (s: RootState) => s.phase.lastError;

/**
 * The main thunk you will use everywhere instead of calling engineTransition directly.
 */
export function requestTransition(to: PhaseId, packet?: Partial<PhasePacket>) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const from = getState().phase.current;

const fullPacket: PhasePacket | undefined = packet
      ? buildPacket(from, to, packet)
      : undefined;

const result = engineTransition(from, to, fullPacket);

if (!result.ok) {
      dispatch(transitionFailed(result.detail));
      return result;
    }

dispatch(setPhase(result.phase));

return result;
  };
}  but it called the deprecated transition  which is in the phase manager // phases/manager.ts
import type { PhaseId, PhasePacket } from "./types";
import {
  getRunMeta,
  incDepth,
  incLoop,
  lockIdentity,
  pushPhase,
} from "./meta";

export type { PhasePacket } from "./types";

export type PhaseManagerResult =
  | {
    ok: true;
    from: PhaseId;
    to: PhaseId;
    phase: PhaseId;
    meta: ReturnType<typeof getRunMeta>;
    ts: number;
  }
  | {
    ok: false;
    from: PhaseId;
    to: PhaseId;
    reason: "illegal_move";
    detail: string;
    ts: number;
  };

const LEGAL: Record<PhaseId, PhaseId[]> = {
  "01_title": ["02_select"],
  "02_select": ["03_staging"],
  "03_staging": ["04_draft", "02_select"],
  "04_draft": ["05_level", "03_staging"],
  "05_level": ["06_door"], // Summary -> door only
  "06_door": ["04_draft", "03_staging", "07_drop"],
  "07_drop": ["04_draft", "01_title", "03_staging"], // Summary -> staging allowed
};

export function isLegalTransition(from: PhaseId, to: PhaseId): boolean {
  return (LEGAL[from] ?? []).includes(to);
}

/**
 * Side effects per transition.
 * NOTE: These are run-meta effects only (snapshotting, counters, locks).
 * The *authoritative current phase* should live in the caller (Redux/store).
 */
function applySideEffects(from: PhaseId, to: PhaseId, packet?: PhasePacket) {
  // Identity locks at 02_select → 03_staging
  if (from === "02_select" \&\& to === "03_staging") {
    lockIdentity({
      userId: packet?.user?.id,
      vessel: packet?.gate?.vesselId ?? packet?.identity?.vessel ?? packet?.player?.vessel,
      sigil: packet?.identity?.sigil ?? packet?.player?.sigil,
    });
  }

// Depth increments on entry to 05_level
  if (to === "05_level") {
    incDepth();
  }

// Loop count increments on 06_door → 04_draft
  if (from === "06_door" \&\& to === "04_draft") {
    incLoop();
  }
}

/**
 * Pure transition function:
 * - validates legality
 * - applies run-meta side effects (phase history, counters, identity lock)
 * - returns next phase + updated meta snapshot
 *
 * Does NOT store "current" internally.
 */
export function transition(
  from: PhaseId,
  to: PhaseId,
  packet?: PhasePacket
): PhaseManagerResult {
  const ts = Date.now();

if (!isLegalTransition(from, to)) {
    return {
      ok: false,
      from,
      to,
      reason: "illegal_move",
      detail: `illegal_move:${from}->${to}`,
      ts,
    };
  }

// Record transition in meta history first (authoritative timeline)
  pushPhase(to);

// Apply run-meta side effects
  applySideEffects(from, to, packet);

// Return updated snapshot
  return {
    ok: true,
    from,
    to,
    phase: to,
    meta: getRunMeta(),
    ts,
  };
}

/**
 * Optional: expose the legal map for UI/debug tooling.
 */
export function getLegalTransitions(): Readonly<Record<PhaseId, PhaseId[]>> {
  return LEGAL;
}

You’re very close; you mainly need to (1) swap `PhasePacket` for `PhaseWallPacket`, and (2) move the packet into Redux instead of building/spreading it ad‑hoc.[^7_1]

Below is a minimal, drop‑in style evolution of what you pasted.

***

## 1. New types import

Assume you’ve applied the earlier refactor so `@du/phases` exports:

- `PhaseId`
- `PhaseWallPacket`
- `buildWallPacket`
- `transition` (engineTransition) with `packet?: PhaseWallPacket`

***

## 2. Updated phaseSlice

Keep meta snapshot logic as‑is, but add the wall packet to Redux and use it in `requestTransition`.

```ts
// web/react_app/src/app/phaseSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PhaseId, PhaseWallPacket } from "@du/phases";
import { transition as engineTransition, buildWallPacket } from "@du/phases";
import {
  restoreSnapshot,
  hydrateFromSnapshot,
  getRunMeta,
  type RunMetaSnapshot,
} from "@du/phases/meta";

import type { AppDispatch, RootState } from "./store";

type PhaseState = {
  current: PhaseId;
  lastError?: string;
  meta: Readonly<RunMetaSnapshot>;
  wall: PhaseWallPacket | null;      // NEW: current PhaseWall inscription
};

const snap = restoreSnapshot();
if (snap) hydrateFromSnapshot(snap);

const initialState: PhaseState = {
  current:
    (snap?.phaseHistory?.[snap.phaseHistory.length - 1] as PhaseId) ??
    "01_title",
  meta: getRunMeta(),
  wall: null,
};

const slice = createSlice({
  name: "phase",
  initialState,
  reducers: {
    setPhaseAndWall(
      state,
      action: PayloadAction<{ phase: PhaseId; wall: PhaseWallPacket | null }>,
    ) {
      state.current = action.payload.phase;
      state.meta = getRunMeta();     // still sourced from engine/meta
      state.wall = action.payload.wall;
      state.lastError = undefined;
    },
    transitionFailed(state, action: PayloadAction<string>) {
      state.lastError = action.payload;
    },
    syncMeta(state) {
      state.meta = getRunMeta();
    },
  },
});

export const { setPhaseAndWall, transitionFailed, syncMeta } = slice.actions;
export const phaseReducer = slice.reducer;

// selectors
export const selectPhase      = (s: RootState) => s.phase.current;
export const selectMeta       = (s: RootState) => s.phase.meta;
export const selectPhaseError = (s: RootState) => s.phase.lastError;
export const selectWall       = (s: RootState) => s.phase.wall;
```


***

## 3. New requestTransition that uses PhaseWallPacket

Key differences vs your current version:

- Caller passes a **fully formed** `PhaseWallPayload` (or entire `PhaseWallPacket` if you prefer).
- The thunk builds a wall with `from` = current, `to` = requested, and hands it to the engine.
- No `Partial<PhasePacket>`, no `buildPacket(from, to, patch)` with spreads.[^7_1]


### Option A: caller passes just `payload`

```ts
// main thunk used by phases
import type { PhaseWallPayload, PhaseWallPacket } from "@du/phases";

export function requestTransition(to: PhaseId, payload: PhaseWallPayload) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const from = getState().phase.current;

    // Build a minimal wall packet for this hop
    const wall: PhaseWallPacket = buildWallPacket(from, to, payload);

    const result = engineTransition(from, to, wall);

    if (!result.ok) {
      dispatch(transitionFailed(result.detail));
      return result;
    }

    dispatch(
      setPhaseAndWall({
        phase: result.phase,
        wall,
      }),
    );

    return result;
  };
}
```

Example call from Select:

```ts
const payload: SelectToStagingWall = {
  kind: "select->staging",
  runId: run.runId,
  runnerRef: { runnerId: run.runner.runnerId },
  gateChoice: choice,
};

dispatch(requestTransition("03_staging", payload));
```


### Option B: caller passes a ready wall

If you want the phases to construct the full `PhaseWallPacket` themselves:

```ts
export function requestTransitionWithWall(wall: PhaseWallPacket) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const from = getState().phase.current;

    if (from !== wall.from) {
      dispatch(
        transitionFailed(
          `illegal_move: wall.from=${wall.from} current=${from}`,
        ),
      );
      return;
    }

    const result = engineTransition(wall.from, wall.to, wall);

    if (!result.ok) {
      dispatch(transitionFailed(result.detail));
      return result;
    }

    dispatch(
      setPhaseAndWall({
        phase: result.phase,
        wall,
      }),
    );

    return result;
  };
}
```

Then Title/Select keep using `buildWallPacket(from, to, payload)` and pass that into `requestTransitionWithWall`.

***

## 4. Manager side: PhaseWallPacket instead of PhasePacket

In `phases/manager.ts`, you just change the packet type and narrow `applySideEffects` to the fields you actually need from the wall (and/or from `RunLedger` if you go that route).[^7_1]

```ts
// phases/manager.ts
import type { PhaseId, PhaseWallPacket } from "./types";
import {
  getRunMeta,
  incDepth,
  incLoop,
  lockIdentity,
  pushPhase,
} from "./meta";

export type PhaseManagerResult =
  | {
      ok: true;
      from: PhaseId;
      to: PhaseId;
      phase: PhaseId;
      meta: ReturnType<typeof getRunMeta>;
      ts: number;
    }
  | {
      ok: false;
      from: PhaseId;
      to: PhaseId;
      reason: "illegal_move";
      detail: string;
      ts: number;
    };

const LEGAL: Record<PhaseId, PhaseId[]> = {
  "01_title": ["02_select"],
  "02_select": ["03_staging"],
  "03_staging": ["04_draft", "02_select"],
  "04_draft": ["05_level", "03_staging"],
  "05_level": ["06_door"],
  "06_door": ["04_draft", "03_staging", "07_drop"],
  "07_drop": ["04_draft", "01_title", "03_staging"],
};

export function isLegalTransition(from: PhaseId, to: PhaseId): boolean {
  return (LEGAL[from] ?? []).includes(to);
}

function applySideEffects(from: PhaseId, to: PhaseId, wall?: PhaseWallPacket) {
  // Identity lock: read from run/meta or from wall.payload if you still want
  if (from === "02_select" && to === "03_staging") {
    const payload = wall?.payload;
    if (payload && payload.kind === "select->staging") {
      // You can look up vesselId from payload.gateChoice or from RunLedger
      lockIdentity({
        userId: undefined,           // now comes from RunLedger instead
        vessel: payload.gateChoice.vesselId,
        sigil: undefined,
      });
    }
  }

  // Depth increments on entry to 05_level
  if (to === "05_level") {
    incDepth();
  }

  // Loop count increments on 06_door → 04_draft
  if (from === "06_door" && to === "04_draft") {
    incLoop();
  }
}

export function transition(
  from: PhaseId,
  to: PhaseId,
  wall?: PhaseWallPacket,
): PhaseManagerResult {
  const ts = Date.now();

  if (!isLegalTransition(from, to)) {
    return {
      ok: false,
      from,
      to,
      reason: "illegal_move",
      detail: `illegal_move:${from}->${to}`,
      ts,
    };
  }

  pushPhase(to);
  applySideEffects(from, to, wall);

  return {
    ok: true,
    from,
    to,
    phase: to,
    meta: getRunMeta(),
    ts,
  };
}
```

This keeps your existing meta pipeline intact, but:

- Packets are now **small, typed PhaseWallPackets**, not mutable blobs.
- Redux holds both the **current phase** and the **current wall**, and callers never spread/patch previous packets.

If you’d like, the next pass can be: eliminate `lockIdentity`’s dependence on packet data entirely and have it read from `RunLedger` instead, which will fully sever the old `PhasePacket` paths.

<div align="center">⁂</div>

[^7_1]: pasted-text.txt


---

# yes please

You can completely remove packet data from identity locking by making RunLedger the only source of truth for runner + gate, and having `lockIdentity` read from there instead of from the wall.[^8_1]

Below is a concrete refactor path.

***

## 1. Change lockIdentity to use RunLedger

Right now `lockIdentity` reads from `PhasePacket` fields.[^8_1]
Change it so meta only ever looks at run state (whatever shape you choose for that module).

Example (conceptual):

```ts
// phases/meta.ts
import { getRunLedger } from "./run-ledger"; // or from a central meta store

export function lockIdentity() {
  const run = getRunLedger();
  if (!run) return;

  const userId  = run.runner.userId;
  const vessel  = run.runner.vesselId;
  const sigil   = run.runner.sigilKey;

  // persist this into the meta snapshot however you currently do it
  _lockIdentityInternal({ userId, vessel, sigil });
}
```

Your existing `lockIdentity({ userId, vessel, sigil })` helper can stay; it just stops accepting data from the packet and instead gets called with values derived from run state.

If you don’t yet have an explicit RunLedger module on the engine side, you can:

- either expose what you need via your existing `RunMetaSnapshot`, or
- mirror the relevant fields there (userId, vesselId, sigilKey) and read from `getRunMeta()` instead.

***

## 2. Update applySideEffects to drop packet‑based identity

In `phases/manager.ts`, identity lock no longer needs `packet`/`wall`:

```ts
// phases/manager.ts
function applySideEffects(from: PhaseId, to: PhaseId) {
  // Identity locks at 02_select → 03_staging
  if (from === "02_select" && to === "03_staging") {
    lockIdentity(); // no args, reads from run/meta
  }

  if (to === "05_level") {
    incDepth();
  }

  if (from === "06_door" && to === "04_draft") {
    incLoop();
  }
}

export function transition(
  from: PhaseId,
  to: PhaseId,
  wall?: PhaseWallPacket, // still available for other future uses
): PhaseManagerResult {
  const ts = Date.now();

  if (!isLegalTransition(from, to)) {
    return {
      ok: false,
      from,
      to,
      reason: "illegal_move",
      detail: `illegal_move:${from}->${to}`,
      ts,
    };
  }

  pushPhase(to);
  applySideEffects(from, to);   // packet/wall no longer needed here

  return {
    ok: true,
    from,
    to,
    phase: to,
    meta: getRunMeta(),
    ts,
  };
}
```

Now there are **zero references to `gate`, `identity`, or `player`** inside the engine’s side‑effects.[^8_1]

***

## 3. Ensure run state is correct before the lock

To keep this safe, just enforce the order:

- Select phase:
    - dispatches `lockGate` in `runSlice` (or equivalent run/meta store)
    - then calls `requestTransition("03_staging", payload)`.

By the time the engine sees `02_select → 03_staging`, run state already has `runner.vesselId` and `runner.sigilKey` set, so `lockIdentity()` has everything it needs without packets.

***

## 4. Cleanup of old packet fields

Once the above is in place you can:

- Delete `identity` and `player` off the old `PhasePacket` type (or leave them as legacy only in migration code).
- Remove all references like `packet?.gate?.vesselId ?? packet?.identity?.vessel ?? packet?.player?.vessel` from the codebase.[^8_1]

At that point:

- Packets are PhaseWall only.
- Identity and gate live exclusively in run/meta state.
- The theology mapping (Guide/Mode/Vessel) stays in your run slice and is only *summarized* in the PhaseWall payload when a phase needs context, not used for any authority decisions.

If you’d like, I can sketch how `RunMetaSnapshot` could be extended to mirror the same fields as the Redux `RunLedger` so both engine and web shell are aligned 1:1 on naming.

<div align="center">⁂</div>

[^8_1]: pasted-text.txt


---

# yes please

You can treat `RunMetaSnapshot` as the engine‑side mirror of your Redux `RunLedger`, with aligned names so you don’t have to mentally translate between them.[^9_1]

***

## 1. Align the shapes conceptually

Target shape for the engine side:

```ts
// phases/meta.ts (engine-side snapshot)
export type RunMetaSnapshot = {
  runId: string;

  runner: {
    userId?: string;
    vesselId?: VesselId;
    sigilKey?: string;
  };

  gateLock?: {
    guide: DescentGuide;
    mode: DescentMode;
    vesselId: VesselId;
    lockedAt: PhaseId;
  };

  progress: {
    depth: number;
    loopCount: number;
  };

  alignment: {
    current: Alignment;
  };

  inventory: {
    memoryFragments: number;
    relicIds: string[];
    draftCardIds: string[];
  };

  history: {
    phaseTrail: PhaseId[];
    lastDoorChoice?: "light" | "dark" | "secret";
    lastDropReason?: "death" | "math_fail" | "exit";
  };

  metaFlags: {
    penitentInsight: number;
    rebelBreaches: number;
    unlockedCodexKeys: string[];
  };
};
```

This mirrors the Redux `RunLedger` minus purely UI/telemetry/debug fields.

***

## 2. Implement engine getters/setters with these names

In `meta.ts`, expose the snapshot in this shape:

```ts
let _meta: RunMetaSnapshot = {
  runId: "",
  runner: {},
  gateLock: undefined,
  progress: { depth: 0, loopCount: 0 },
  alignment: { current: { light: 0, dark: 0 } },
  inventory: { memoryFragments: 0, relicIds: [], draftCardIds: [] },
  history: { phaseTrail: [] },
  metaFlags: {
    penitentInsight: 0,
    rebelBreaches: 0,
    unlockedCodexKeys: [],
  },
};

export function getRunMeta(): RunMetaSnapshot {
  return _meta;
}

export function setRunId(runId: string) {
  _meta.runId = runId;
}

export function lockIdentity() {
  if (!_meta.runner.userId && !_meta.runner.vesselId) return;
  // persist to whatever long-term store you like (or leave as is)
}

export function incDepth() {
  _meta.progress.depth += 1;
}

export function incLoop() {
  _meta.progress.loopCount += 1;
}

export function pushPhase(phase: PhaseId) {
  _meta.history.phaseTrail.push(phase);
}
```

You can also add helpers like `setGateLock`, `setAlignmentDelta`, etc., but keep the fields and nesting consistent with Redux.

***

## 3. Hydrate Redux from engine snapshot

On web boot, you already do:

```ts
const snap = restoreSnapshot();
if (snap) hydrateFromSnapshot(snap);

const initialState: PhaseState = {
  current: lastPhaseOrTitle,
  meta: getRunMeta(),
};
```

Now add a tiny bridge that converts the engine snapshot to a `RunLedger` for Redux:

```ts
// app/runSlice.ts
import { getRunMeta, type RunMetaSnapshot } from "@du/phases/meta";

export function hydrateRunFromEngineMeta(): RunLedger | null {
  const meta: RunMetaSnapshot = getRunMeta();
  if (!meta.runId) return null;

  return {
    runId: meta.runId,
    runner: {
      runnerId: meta.runId,
      userId: meta.runner.userId,
      displayName: undefined,
      vesselId: meta.runner.vesselId,
      sigilKey: meta.runner.sigilKey,
    },
    gateLock: meta.gateLock,
    progress: meta.progress,
    alignment: meta.alignment,
    inventory: meta.inventory,
    history: meta.history,
    metaFlags: meta.metaFlags,
    telemetry: { totalClicks: 0, totalRuns: 0 },
    debugTrace: {},
  };
}
```

Then in your store bootstrap:

```ts
const engineSnapRun = hydrateRunFromEngineMeta();

const preloadedState = {
  phase: initialPhaseState,
  run: engineSnapRun,
};
```

Now engine and shell share the same words:

- `runner.userId`, `runner.vesselId`, `runner.sigilKey`
- `gateLock.guide/mode/vesselId`
- `progress.depth`, `alignment.current.light/dark`, etc.

***

## 4. Keep PhaseWall independent

PhaseWall stays tiny and separate:

- Engine uses `RunMetaSnapshot` for persistent run data.
- Redux uses `RunLedger` for UI‑side state.
- PhaseWall only carries the hop payload (Title→Select, Select→Staging, …) and never stores identity or alignment.

This gives you:

- One naming scheme.
- Engine/meta and Redux/run in sync.
- Packets that are minimal and easy to reason about.

<div align="center">⁂</div>

[^9_1]: pasted-text.txt


---

# Thank you, this was great, may I have an repo report for RDX dir so the next agent to visit will know how to inspect

Here’s a short “RDX directory report” you can hand to the next agent looking at this repo.[^10_1][^10_2]

***

## High-level structure

- Monorepo with multiple domains; relevant here is the **web/react_app** client that talks to a shared engine in **@du/phases**.[^10_2][^10_1]
- The engine is framework‑agnostic; React app is just one shell over it.[^10_1][^10_2]

***

## RDX‑related locations

- **web/react_app/src/app**
    - `store.ts`: Redux store wiring.
    - `phaseSlice.ts`: owns the current phase, last error, and a meta snapshot from the engine; exposes `requestTransition` thunk that wraps the engine’s `transition` and should become the only way phases move.[^10_1]
    - `runSlice.ts` (to be added/extended): holds the persistent run state (`RunLedger`): runner, gate lock, depth, alignment, inventory, loop count, etc.
- **phases/**
    - `types.ts`: defines `PhaseId`, packet types (moving to `PhaseWallPacket`), alignment, Gate types, etc.[^10_1]
    - `manager.ts`: engine’s `transition` function and legality map; applies run‑meta side effects (depth, loop, identity lock) via `meta.ts`. This is pure and does not own current phase.[^10_1]
    - `meta.ts`: holds the engine‑side run snapshot (`RunMetaSnapshot`), with helpers like `getRunMeta`, `incDepth`, `incLoop`, `lockIdentity`, `pushPhase`; also `restoreSnapshot`/`hydrateFromSnapshot` for recovery.[^10_1]
- **web/react_app/src/weblite_game/pages/phases/**
    - `01_title/*`: TitleShell and TitleScreen; entry handshake, user → run seed, then calls `requestTransition` (via a packet today, moving to PhaseWall).[^10_2][^10_1]
    - `02_select/*`: SelectShell and SelectScreen; handles Guide/Mode/Vessel sub‑steps, then locks Gate and advances to Staging.[^10_2][^10_1]
    - Other phases (`03_staging`, `04_draft`, `05_level`, `06_door`, `07_drop`) use the same pattern: Shell does wiring and calls `requestTransition`, Screen is mostly presentational.

***

## How to inspect behavior

1. **Follow the loop via phaseSlice → manager → meta**
    - Start in `phaseSlice.requestTransition(...)` to see how the UI asks to move from one phase to another.[^10_1]
    - Look at `manager.transition(from, to, packet)` to see legality and what meta side effects fire (depth, loop, identity).[^10_1]
    - Check `meta.getRunMeta()` and related helpers for what “truth” is being recorded about the run.
2. **Watch for packet vs run‑state boundaries**
    - Old code: `PhasePacket` is built with `buildPacket(from, to, patch)` and sometimes spread (`...prev`), mixing user, identity, gate, alignment, and inventory.[^10_1]
    - New direction: introduce `PhaseWallPacket` (tiny, hop‑only) and a `RunLedger`/`RunMetaSnapshot` for everything persistent; shells should update run slice first, then send a minimal wall packet.
3. **Where to hook new behavior**
    - To add new meta progression: extend `RunMetaSnapshot`/`RunLedger` and add a reducer or meta helper; then call it from `manager.applySideEffects` or from a shell via `runSlice` actions.[^10_1]
    - To add a new phase or sub‑phase: add an entry to `PhaseId`, update `LEGAL` map in `manager.ts`, and create corresponding Shell/Screen in `web/react_app/src/weblite_game/pages/phases`.

***

## Quick mental model

- **Engine (@du/phases)**: owns legality, run meta, and is the canonical record of “what happened this run.”
- **React app (web/react_app)**: owns UX, local UI state, and mirrors engine meta into Redux slices (`phaseSlice`, `runSlice`).
- **RDX discipline goal**: PhaseWall packets stay minimal and transient; Redux + engine meta hold all long‑lived identity, parity, and progression.

<div align="center">⁂</div>

[^10_1]: pasted-text.txt

[^10_2]: pasted-text.txt


---

# Absolutely — and yep, that session-end report is already really solid. I’ll rewrite it into a cleaner “hand-off / repo inspection brief” that another agent can follow without needing your context, and I’ll remove the dangling citations since we’re not actually linking to internal files here.


---

RDX Directory Report (Agent Handoff)

Purpose

The RDX directory contains “operational scaffolding” for the repo: scripts, generated assets, web glue, and/or conventions that support the engine + React client workflow. When inspecting, treat RDX as support infrastructure, not the canonical engine.

If you’re here to understand behavior, your north star is:

UI request → Redux slice → engine transition → meta snapshot → UI render

---

High-level structure

This repo behaves like a monorepo with:

a framework-agnostic engine (phase legality + progression truth)

a React app that presents shells/screens and calls the engine

an RDX layer that helps wire, scaffold, or standardize workflows

Key mental model

Engine is canonical for “what happened in the run.”

React is canonical for “what the user sees + interacts with.”

RDX is canonical for “how we operate the repo (scripts/tools/glue).”

---

Primary inspection entry points

1) Start at the UI transition request

Look for a thunk or action that is intended to be the only legal way phases advance:

web/react_app/src/app/phaseSlice.ts

typically exposes something like requestTransition(...)

wraps the engine’s transition(...)

should be the choke point for phase movement

2) Follow into the engine transition

phases/manager.ts

contains transition(from, to, packet) (or equivalent)

enforces legality map / phase graph

triggers meta side effects (depth, loop, locks, etc.)

3) Confirm where “run truth” is recorded

phases/meta.ts (or similar)

owns the engine-side snapshot of run progression

helpers like incDepth, incLoop, lockIdentity, pushPhase

may include hydration/restore helpers

4) Identify what persists across phases

This system distinguishes between:

Traveler: RunLoggerPacker (or RunLedger) — persists across the whole run

Walls: phase-local payloads — only valid while touching that phase wall

Transfer stamp: the minimal hop packet that moves one wall at a time

Bleed bugs happen when the traveler becomes “a bag of everything.”

---

RDX-related locations to check

Likely RDX surface area

RDX/ (scripts, scaffolds, generated outputs, conventions, tooling glue)

RDX/web/ (if present) often contains:

build scaffolds

wiring helpers

pattern enforcement for pages/shells/routes

How to read RDX

It should support the engine + UI architecture, not replace it.

If RDX contains business rules, confirm those rules aren’t duplicated in engine logic.

---

Phase UI layout pattern (Shell vs Screen)

The React phase pages typically follow a consistent split:

Shell

wires selectors

dispatches requestTransition

performs “touch wall” logic (only read local wall + traveler)

Screen

mostly presentational

receives props, renders UI

If you see screens dispatching transitions directly, that’s a smell.

---

Packet boundaries (critical design constraint)

Old behavior (bleeding risk)

A broad “packet” gets built and spread/merged across phases:

identity + gate + alignment + inventory + phase-local state all mixed

later phases can accidentally inherit state without explicit transfer

New behavior (phase wall transfer discipline)

PhaseWallPacket should be tiny and hop-only

traveler (RunLoggerPacker) persists, but stays lean (logs/refs)

walls hold phase-local payloads

transfer is explicit, gated by current phase (“touching wall” rule)

---

How to inspect behavior quickly

Commands / workflow (recommended)

1. Typecheck first (fastest truth source during refactor)

pnpm -r typecheck (or equivalent)

2. Trace the first compile error to its contract owner

if it’s phase typing: start in phases/types.ts

if it’s transitions: start in phases/manager.ts

if it’s UI calling convention: start in phaseSlice.ts

3. Run and follow one full loop

Title → Select → Staging → Draft → Level → Door → Drop/Loop

confirm each phase reads only its own wall + traveler

---

“Where to hook new behavior” guidance

Add meta progression (depth/loop/locks)

add to engine meta snapshot (meta.ts) OR run slice (runSlice.ts)

call from:

engine-side applySideEffects in manager.ts, or

shell-level actions (write run slice first, then transfer)

Add a new phase

extend PhaseId in phases/types.ts

update legality map in phases/manager.ts

add the Shell/Screen pair in React phase pages

ensure the phase has a wall payload shape

---

Quick checklist for the next agent

[ ] Find the one transition choke point (thunk/action)

[ ] Confirm engine transition enforces legality

[ ] Confirm run truth is recorded in meta snapshot

[ ] Confirm phase payloads are wall-local, not traveler-global

[ ] Confirm transfer is explicit (no “bleed by spread”)

[ ] Confirm shells own wiring; screens remain mostly presentational
Here the repo version. Can we get a full Engine, architecture, and workbench State of Descent brief detailing the core concepts we discussed such as phase wall transfer, run ledger, run log packing add wall writing (may update terms if need) Then we can talk about some maps and diagrams 😊

Here's your **State of Descent** brief — the full engine, architecture, and workbench document covering everything we discussed today.

The document is organized into ten sections:

**I–III** ground the next agent in what Dudael is, the three-layer character architecture (Guide → Bound → Descent Mode), and the seven-phase loop with its legality map.[^11_1][^11_2][^11_3]

**IV** is the core of what we built today — the **transfer model**:

- **PhaseWall** — the boundary between phases; tiny, hop-only payloads that never spread
- **RunLedger** — the persistent run record that lives in Redux and mirrors the engine's `RunMetaSnapshot`
- **Wall Writing** — the discipline of updating run state first, then committing a minimal wall payload
- **Run Log Packing** — checkpointing the ledger at lifecycle boundaries (especially Drop → Staging)

**V** maps the full **transition pipeline** from shell → Redux → engine → meta → back to Redux, showing exactly where `lockIdentity` reads from RunLedger instead of the wall.[^11_4]

**VI** covers the **engine/shell separation** (`@du/phases` vs `web/react_app`) with file locations and the "Shells own wiring, Screens render" principle.[^11_5][^11_4]

**VII–VIII** document the **Hourglass** structure and **Sinerine** brand identity system, clarifying that "identity" in this system means design tokens, not player state.[^11_5][^11_1]

**IX** is a **naming glossary** with all the terms we refined: Runner, GateChoice vs GateLock, Wall Writing, Run Log Packing, etc.

**X** is an **inspection checklist** the next agent can walk through to confirm the architecture is holding.

Ready to talk maps and diagrams whenever you are! 😊
<span style="display:none">[^11_6]</span>

<div align="center">⁂</div>

[^11_1]: Dudael_Lore_Compilation.docx

[^11_2]: DUDAEL_Gate_Refactor_Brief_for_Chat.docx

[^11_3]: Core-Vessel-shape.md

[^11_4]: pasted-text.txt

[^11_5]: pasted-text.txt

[^11_6]: FALLEN-ANGELS-GAME-SPRINT-PLAN-TASK-CHECKLIST.md


---

# Yes — Phase Wall diagram first is the right move. Once we lock WallPacket as the only legal crossing, everything else becomes easy to police.

(Quick note: I’m seeing a notice that some previously uploaded files have expired, so if you want me to quote or align with a specific older doc/file, you’ll need to re-upload it. For the diagram + terms, we’re good without it.)

---

Phase Wall Transfer Diagram (WallPacket locked)

Here’s the clean “touch-wall” model in diagram form.

1) The corridor + walls

Each phase is a room. Between rooms is a Wall.
You can only write/read the wall you are touching.

┌────────┐    ┌────────┐    ┌──────────┐    ┌────────┐    ┌────────┐
│ Title  │    │ Select │    │ Staging  │    │ Draft  │    │ Level  │   ...
└───┬────┘    └───┬────┘    └────┬─────┘    └───┬────┘    └───┬────┘
│             │              │               │              │
▼             ▼              ▼               ▼              ▼
WALL(T)       WALL(S)        WALL(ST)        WALL(DR)       WALL(LV)

Rule: Phase code can only read/write its own wall payload.
Everything else must cross via WallPacket.

---

2) The only legal crossing: WallPacket

All transfer happens through one narrow “mail slot”:

Current Phase (touching this wall)
│
│ 1) Read: RunLedger + Wall[from]
│ 2) Derive: payload for next wall
│ 3) Transfer: WallPacket(from → to, payload)
▼
Next Phase (touching next wall)

---

3) The transition pipeline (where enforcement lives)

This shows where you enforce “no bleed.”

[ Shell ]
│   (reads only: RunLedger + Wall[current])
│
│ dispatch requestTransition(to)
▼
[ phaseSlice thunk / action ]  ← choke point (only legal doorway)
│
│ calls engine.transition(from, to, WallPacket)
▼
[ Engine transition ]
│  - legality check
│  - apply meta side-effects
│  - returns nextPhase + nextWallPayload + metaSnapshot
▼
[ Redux updates ]
│  - phase = to
│  - wall[to] = nextWallPayload
│  - runLedger updated (logs/snapshot)
▼
[ Next Shell renders ]

---

Locked Terms (so the repo stays consistent)

WallPacket (locked name)

Definition: the only object allowed to carry data across a phase boundary.

It must be:

small

hop-only

non-persistent

never spread/merged with previous packets

Recommended shape (minimal + durable):

type WallPacket<P = unknown> = {
from: PhaseId
to: PhaseId
at: number // timestamp or monotonic tick
payload: P
}

> If you later add runId, that’s fine — but keep it “routing metadata,” not a bag.

---

The 3 rules that prevent bleed forever

1. Only the engine consumes WallPacket.
UI doesn’t interpret other phase payloads.
2. A phase may only read Wall[current].
No reaching into other walls.
3. No packet spreading. Ever.
No {...prevPacket, ...newStuff} patterns.

---

Tiny add-on: “WallWrite” step (names you can use)

If you want to make your metaphor explicit in code/docs, define this as a named step:

WallWrite: “derive next wall payload”

WallTransfer: “commit via WallPacket + transition”

WallTouch: “current phase is allowed to read/write this wall”

That gives you a clean vocabulary for commits and agent reports.

---

If you want, next I can draw the same diagram but annotated with your actual phase sequence:

Title → Select → Staging → Draft → Level → Door → Drop/Loop

…and we’ll place exactly what the wall payload is for each phase (even if it’s just unknown placeholders for now).  <-- from chat 😀,  it's use us three right now

Perfect! Here's your **Phase Wall Transfer Diagram** with WallPacket locked as the only legal crossing.

The document gives you:

**1. The visual model** — the corridor with seven rooms and walls between them, showing you can only touch your current wall.

**2. The enforcement pipeline** — where `requestTransition` acts as the single choke point, calling engine transition, which checks legality and applies side effects by reading RunLedger (not the wall).

**3. Locked terms** — WallPacket definition with the three iron rules: only engine consumes it, phases only read Wall[current], no spreading ever.

**4. The full seven-phase sequence** — what each wall payload actually carries, showing how minimal they are (mostly just `runId` after Select).

**5. Legality map with wall boundaries** — showing which transitions are legal and what payload type crosses each boundary.

**6. Type-safe discriminated union** — full TypeScript shape for `PhaseWallPayload` covering all 13 possible hops (some phases have multiple legal exits).

**7. Enforcement checklist** — what to look for when reviewing code for wall discipline.

The key insight locked in here: after Select writes `{ runId, runnerRef, gateChoice }` to the wall and commits it to RunLedger, every subsequent wall payload is basically just `{ runId }` (plus optional hop-specific metadata like `draftResultId` or `doorChoice`). The RunLedger holds everything else — alignment, inventory, depth, loop count, gate lock, history.

This makes walls **cheap to validate** (tiny payload, clear shape) and RunLedger the **single source of truth** for everything persistent.

Ready for maps and diagrams whenever you are! 😊 What's next — hourglass structure, vessel relationships, or something else?

---

# CANVAS_OUTPUT_TYPE

doc

# CANVAS_PROJECT_NAME

Phase Wall Full Loop

# CANVAS_OPERATION_TYPE

doc_update

---

# Got it. Let’s produce a clean, final recap for the record so the lattice stays synchronized before you open the next thread. I’ll keep it structured so another agent can pick it up instantly.

(Quick note: the system shows some previously uploaded files have expired. If we need to reference them again later, you’ll need to re-upload them. This recap stands on its own though.)

---

Dudael Engine – State of Descent Recap

Session Sync Record

This document summarizes the core architecture decisions established in this session.

The goal is to stabilize the phase engine, prevent state bleed, and define the WallPacket transfer discipline for the descent loop.

---

1. Core Architecture Layers

The system operates across three layers.

Engine Layer (@du/phases)

Responsible for:

Phase legality

Transition enforcement

Run meta side effects

Run history tracking

The engine is framework-agnostic.

Key responsibilities:

transition(from, to, packet)
applySideEffects()
recordRunMeta()

The engine does not own UI state.

---

React Application (web/react_app)

Responsible for:

Rendering shells/screens

Dispatching transition requests

Holding the persistent run ledger in Redux

Key principle:

Shells own wiring.
Screens render UI.

---

RDX Layer

Operational infrastructure.

Used for:

scaffolding

tooling

conventions

repo operations

RDX supports the engine, but never replaces it.

---

2. Phase Loop (Descent Engine)

The game loop is a seven-phase corridor.

Title
↓
Select
↓
Staging
↓
Draft
↓
Level
↓
Door
↓
Drop
↓
(loop back)
Staging

Each phase is separated by a Phase Wall.

---

3. Phase Wall Concept

A Phase Wall is a boundary between phases.

Phases cannot read each other's internal state.

They only interact through a WallPacket transfer.

Phase A
│
│ (WallPacket)
▼
Phase B

This prevents state bleed across phases.

---

4. WallPacket (Locked Term)

The WallPacket is the only object allowed to cross phase boundaries.

Characteristics:

small

hop-only

non-persistent

never merged or spread

Recommended structure:

WallPacket {
from: PhaseId
to: PhaseId
at: timestamp
payload: PhasePayload
}

WallPackets are consumed immediately by the engine transition.

They do not persist.

---

5. Wall Writing

Before a phase transition occurs:

1. The current phase reads its wall + RunLedger
2. It derives the next payload
3. It performs WallWrite
4. The result becomes the WallPacket payload

read → derive → write wall → transfer

This discipline ensures only the correct information crosses the boundary.

---

6. RunLedger (Persistent Run State)

The RunLedger holds data that must persist across the entire run.

Examples:

run identity

gate locks

loop count

descent depth

alignment

inventory references

run event history

RunLedger is stored in Redux (runSlice) and mirrored by the engine’s meta snapshot.

---

7. Run Log Packing

At key lifecycle boundaries (especially Drop → Staging):

The system performs Run Log Packing.

This step:

finalizes the run segment

appends log entries to the RunLedger

optionally checkpoints the run state

prepares the next descent loop

This ensures runs remain inspectable and recoverable.

---

8. Transition Pipeline

The transition pipeline enforces architectural boundaries.

Shell
│
│ dispatch requestTransition
▼
Redux phaseSlice
│
│ creates WallPacket
▼
Engine transition()
│
├ legality check
├ run meta side effects
└ snapshot update
▼
Redux updates
│
├ phase = next
├ wall payload updated
└ RunLedger updated
▼
Next shell renders

Only this pipeline may move phases.

---

9. Phase Payload Ownership

Each phase owns a local wall payload.

Example intent mapping:

Phase	Wall Purpose

Title	run initialization
Select	vessel / guide / mode choices
Staging	pre-descent preparation
Draft	player draft construction
Level	level generation
Door	branching decision
Drop	outcome + resolution

Wall payloads are ephemeral.

They exist only while touching the phase.

---

10. Hard Rules (Architecture Locks)

These rules prevent future state bleed.

Rule 1

Only requestTransition() may create a WallPacket.

Rule 2

Only engine.transition() consumes a WallPacket.

Rule 3

A phase may only read its own wall payload.

Rule 4

Wall payloads are replaced, never merged.

Rule 5

RunLedger never contains phase-local data.

---

11. Terminology (Locked Vocabulary)

Term	Meaning

Runner	the current player run
RunLedger	persistent run record
Wall	boundary between phases
WallWrite	deriving next wall payload
WallPacket	transfer object across phases
Run Log Packing	checkpointing the run
Phase Wall Transfer	crossing the boundary

---

12. System Identity

The architecture can be summarized in one rule:

“The wall is always fresh.”

Every phase begins with a clean wall.

Only explicit transfers carry forward information.

---

Final Summary

The Dudael engine is a phase-based descent system with strict memory boundaries.

Three structures stabilize the system:

1. Phase Walls – enforce clean boundaries
2. WallPackets – minimal transfer between phases
3. RunLedger – persistent run continuity

Together they create a predictable, inspectable phase machine.

---

When you open the next thread, the next natural step will be the maps and diagrams, specifically:

1️⃣ Phase Wall architecture diagram (engine view)
2️⃣ RunLedger lifecycle diagram
3️⃣ Hourglass descent map (game structure)

Those will make the architecture visually locked in.

Whenever you're ready, we’ll move to the next thread and build those. 😊   We will go to a new thread as well, this as be an incredible session, thank you so much for your help

Created comprehensive session recap documenting the Dudael phase engine architecture decisions, WallPacket transfer discipline, RunLedger persistence model, and locked terminology. This serves as a handoff document for the next lattice agent, capturing all core concepts, hard rules, and next steps for visual diagram creation.

