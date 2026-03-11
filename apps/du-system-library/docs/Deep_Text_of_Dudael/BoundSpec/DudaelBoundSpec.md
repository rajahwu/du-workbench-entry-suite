# Bound & Vessels Spec (Tech View)

## 1. Purpose

Define the five Bound vessel configurations as data, plus the meta-layer that tracks their long-term state across runs. This spec focuses on:
- Per-run vessel config (what a run starts with).
- Bound meta-state (bound/freed/claimed/contested) across many runs.
- How Guides and Modes interact with vessel data.

---

## 2. Core Types

```ts
export type VesselId = 'seraph' | 'shadow' | 'exile' | 'penitent' | 'rebel';

export interface VesselConfig {
  id: VesselId;
  name: string;
  baseLight: number;   // starting Light bias
  baseDark: number;    // starting Dark bias
  baseHp: number;      // starting HP
  handSize: number;    // cards per Draft pick or per hand
  stability: 'low' | 'medium' | 'high' | 'very-low' | 'medium-low';
  bias: 'light' | 'dark' | 'neutral' | 'insight' | 'hazard';
  keywords: string[];  // mechanical flavor hooks
}

export const VESSEL_CONFIGS: Record<VesselId, VesselConfig> = {
  seraph: {
    id: 'seraph',
    name: 'Seraph',
    baseLight: 3,
    baseDark: 0,
    baseHp: 10,
    handSize: 2,
    stability: 'medium',
    bias: 'light',
    keywords: ['radiant', 'ward', 'shield', 'overcharge']
  },
  shadow: {
    id: 'shadow',
    name: 'Shadow',
    baseLight: 0,
    baseDark: 3,
    baseHp: 10,
    handSize: 2,
    stability: 'low',
    bias: 'dark',
    keywords: ['ambush', 'bleed', 'stealth', 'echo']
  },
  exile: {
    id: 'exile',
    name: 'Exile',
    baseLight: 2,
    baseDark: 2,
    baseHp: 10,
    handSize: 2,
    stability: 'very-low',
    bias: 'neutral',
    keywords: ['glitch', 'swap', 'anomaly', 'wildcard']
  },
  penitent: {
    id: 'penitent',
    name: 'Penitent',
    baseLight: 3,
    baseDark: 1,
    baseHp: 12,
    handSize: 2,
    stability: 'high',
    bias: 'insight',
    keywords: ['convert', 'forgive', 'anchor', 'vow']
  },
  rebel: {
    id: 'rebel',
    name: 'Rebel',
    baseLight: 1,
    baseDark: 3,
    baseHp: 8,
    handSize: 3,
    stability: 'medium-low',
    bias: 'hazard',
    keywords: ['riot', 'break', 'rush', 'deficit']
  }
};
```

This mirrors the vessel config table from the Gate brief while giving a clean TypeScript surface.

---

## 3. Per-Run Vessel View

### 3.1 RunnerProfile Extensions

```ts
export interface RunnerProfile {
  runnerId: string;
  userId?: string;
  displayName?: string;
  vesselId?: VesselId;
  sigilKey?: string;
}
```

Once the player completes Select, the run has:
- `runner.vesselId` set to one of the five Bound.  
- `RunLedger.alignment.current.light`/`dark` seeded from the chosen vessel’s `baseLight`/`baseDark`.  
- A Level HP state seeded from `baseHp` (local to Level or mirrored into RunLedger if needed).

### 3.2 Derived Run Stats

```ts
export interface RunDerivedStats {
  maxHp: number;
  startingAlignment: Alignment;
  handSize: number;
}

export function deriveRunStats(vesselId: VesselId): RunDerivedStats {
  const v = VESSEL_CONFIGS[vesselId];
  return {
    maxHp: v.baseHp,
    startingAlignment: { light: v.baseLight, dark: v.baseDark },
    handSize: v.handSize
  };
}
```

Select Shell can use `deriveRunStats` when locking Gate to initialize HP and starting alignment.

---

## 4. Bound Meta-State (Across Runs)

### 4.1 BoundState

```ts
export type BoundStatus = 'bound' | 'freed' | 'claimed' | 'contested';

export interface BoundState {
  id: VesselId;
  status: BoundStatus;
  freedBy?: 'steward'; // who freed this entity
  claimedBy?: 'solo';  // who claimed this entity
  runCount: number;    // how many runs have involved this vessel
}

export type BoundStateMap = Record<VesselId, BoundState>;
```

This lives in a **meta** layer (e.g., `meta.boundStates` in Supabase or long-term storage), not in per-run RunLedger. It tracks the story of each Bound over the life of the profile.

### 4.2 Updating BoundState at Drop

Conceptual behavior:

- In **Steward** mode, a successful liberation arc might mark a Bound as `freed` and set `freedBy = 'steward'`.  
- In **Solo** mode, repeated success might mark a Bound as `claimed` with `claimedBy = 'solo'`.  
- `contested` can represent states where both patterns occurred in different runs.

Stub update function:

```ts
export function updateBoundStateOnDrop(
  boundStates: BoundStateMap,
  vesselId: VesselId,
  mode: DescentMode
): BoundStateMap {
  const current = boundStates[vesselId] ?? {
    id: vesselId,
    status: 'bound',
    runCount: 0
  };

  const next: BoundState = { ...current, runCount: current.runCount + 1 };

  if (mode === 'steward') {
    next.status = next.status === 'claimed' ? 'contested' : 'freed';
    next.freedBy = 'steward';
  } else if (mode === 'solo') {
    next.status = next.status === 'freed' ? 'contested' : 'claimed';
    next.claimedBy = 'solo';
  }

  return { ...boundStates, [vesselId]: next };
}
```

This can be called from a meta-progression service when a run completes.

---

## 5. Guide/Mode Interaction with Vessels

### 5.1 GateChoice and GateLock

```ts
export type DescentGuide = 'light' | 'dark';
export type DescentMode = 'steward' | 'solo';

export interface GateChoice {
  guide: DescentGuide;
  mode: DescentMode;
  vesselId: VesselId;
}

export interface GateLock extends GateChoice {
  lockedAt: PhaseId; // usually '03staging'
}
```

`GateChoice` is written to the wall (Select → Staging). `GateLock` is the same data once committed into RunLedger.

### 5.2 Bias Hooks (Draft & Door)

Design hooks encoded in data:

- **Draft bias:** Card pools can be filtered/weighted by `vesselId` and `bias` (light/dark/neutral/insight/hazard).  
- **Door behavior:** Special cases (e.g., Exile and math-fail, Rebel and risky doors) can be keyed from `vesselId` and `BoundState`.

Example interface for Draft bias:

```ts
export interface DraftBias {
  vesselId: VesselId;
  extraLightWeight: number;
  extraDarkWeight: number;
  extraRelicWeight: number;
}
```

Actual tuning lives in the systems layer, but the vessel spec provides the stable ids and config.

---

## 6. Data Locations Summary

- `VESSEL_CONFIGS` — static, engine-readable registry of the five Bound.  
- `RunnerProfile.vesselId` — which Bound this run is using.  
- `RunLedger.alignment.current` — seeded from vessel base bias, then mutated by cards/levels/doors.  
- `RunLedger.metaFlags` — can track vessel-specific counters (e.g., Penitent insight).  
- `BoundStateMap` — long-lived meta store describing each Bound's story over many runs.

These shapes are stable enough to implement now and refine tuning later without schema churn.
