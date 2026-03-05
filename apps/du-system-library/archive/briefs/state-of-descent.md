# State of Descent — Engine, Architecture & Workbench Brief

**Project:** Dudael — The Drop (Sinerine V-00)  
**Repo:** github.com/rajahwu/DU-workbench  
**Date:** March 3, 2026  
**Prepared for:** Lattice agents and collaborators entering this codebase

---

## I. What Dudael Is

Dudael is a web-based roguelike card game built on a Hades-style meta-loop. Five fallen angel archetypes — the **Bound** — are imprisoned in a quarantine zone called Dudael. Players descend through a 7-phase loop, balancing Light and Dark resources to unlock doors, with designed death feeding persistent progression.

The theological anchor is **oiketrion** (Greek: habitation / spiritual covering, Jude 1:6). The Bound abandoned their proper dwelling. The Quarantine Zone is where they wait. The Drop is how they process what they chose — or what happened to them.

The aesthetic is **forensic theophany**: clinical, examining, evidence under glass. The game does not explain itself emotionally. It presents.

---

## II. The Three-Layer Character Architecture

Character selection is not a single pick. It is a progressive commitment across three layers:

### Layer 1 — The Meta: Guide

The player's first choice. **Light Guide** (Surveyor) or **Dark Guide** (Smuggler). Determines descent tone, draft pool bias, and keeper commentary. The Guides are children — innocence leading the fallen.

### Layer 2 — The Bound: Vessel

The five entities already imprisoned in Dudael. Player has access to 3 (determined by meta-state). Selection determines run stats and playstyle.

| Vessel   | Light | Dark | HP | Hand | Stability   | Bias    | Keywords                         |
|----------|-------|------|----|------|-------------|---------|----------------------------------|
| Seraph   | 3     | 0    | 10 | 2    | Medium      | light   | radiant, ward, shield, overcharge|
| Shadow   | 0     | 3    | 10 | 2    | Low (spiky) | dark    | ambush, bleed, stealth, echo     |
| Exile    | 2     | 2    | 10 | 2    | Very low    | neutral | glitch, swap, anomaly, wildcard  |
| Penitent | 3     | 1    | 12 | 2    | High        | insight | convert, forgive, anchor, vow    |
| Rebel    | 1     | 3    | 8  | 3    | Medium-low  | hazard  | riot, break, rush, deficit       |

Each Vessel maps to a relationship with the oiketrion: Seraph never left habitation; Shadow dove willingly; Exile shed covering but refused to sink; Penitent rebuilds lost covering; Rebel set habitation on fire.

### Layer 3 — The Strategy: Descent Mode

- **Steward** — descend to free the Bound; power flows outward (kenosis pattern)
- **Solo** — descend to bind the entity; power flows inward (Watcher transgression)

Same dungeon, same phases, same economy, different intent. Determines what Draft/Door/Drop write to: entity liberation vs. runner power.

---

## III. The Seven-Phase Loop

The game flows through seven rooms in sequence. The phase state machine moves:

**TITLE → SELECT → STAGING → DRAFT → LEVEL → DOOR → DROP → (loop)**

| Phase | Name      | What Happens |
|-------|-----------|--------------|
| 01    | Title     | Procedural PixiJS animation. Identity resolution, exchange flow. User becomes runner. |
| 02    | Select    | Three sub-phases: (0) Choose Guide, (1) Choose Mode, (2) Choose Bound from 3 available Vessels. |
| 03    | Staging   | Breathing room / locker room. Keepers offer upgrades. Sparse on first run, rich on return. The rest stop has teeth. |
| 04    | Draft     | Light keeper / Dark keeper each offer cards. Pick 2 of 4 with 1 reroll. Cards carry lightDelta, darkDelta, tags. Insight-based visibility system. |
| 05    | Level     | Content-agnostic container. First cartridge: 3×3 tap grid. Timer, health bar, depth-scaled difficulty. SNES Cartridge Model — stage is the console, game is the cartridge. |
| 06    | Door      | Three doors: Light, Dark, Secret. Alignment requirements scale by depth. Parity snapshot from Draft checked here. |
| 07    | Drop      | Run summary. Designed death converts to Memory Fragments (meta-currency). Loop returns to Staging. |

**Legality map** (which transitions are allowed):

```
01_title  → [02_select]
02_select → [03_staging]
03_staging → [04_draft, 02_select]
04_draft  → [05_level, 03_staging]
05_level  → [06_door]
06_door   → [04_draft, 03_staging, 07_drop]
07_drop   → [04_draft, 01_title, 03_staging]
```

---

## IV. Core Concepts: The Transfer Model

### The PhaseWall

The **PhaseWall** is the boundary between phases. Each phase can only see and write to its own wall inscription. Think of it as a chalkboard at the door: one phase writes a few words, the next phase reads them and erases the board.

**PhaseWallPacket** = the tiny, hop-only data contract that passes through the wall.

```
PhaseWallPacket {
  from: PhaseId
  to: PhaseId
  ts: number
  payload: PhaseWallPayload   // discriminated union, one shape per hop
}
```

Each hop has its own payload shape:

- **title → select**: `{ userRef, pathHint }`
- **select → staging**: `{ runId, runnerRef, gateChoice }`
- **staging → draft**: `{ runId }`
- **draft → level**: `{ runId, draftResultId? }`
- **level → door**: `{ runId }`
- **door → drop**: `{ runId, doorChoice? }`
- **drop → staging**: `{ runId, dropReason? }`

**Critical rule:** No spreading previous packets. No `...prev`. The wall is always fresh.

### The RunLedger

The **RunLedger** is the persistent record of the entire descent. It lives in Redux (`runSlice`) and is mirrored on the engine side as `RunMetaSnapshot`. It accumulates across the full loop and persists through Drop → Staging resets.

```
RunLedger {
  runId
  runner: { runnerId, userId?, vesselId?, sigilKey?, displayName? }
  gateLock?: { guide, mode, vesselId, lockedAt }
  progress: { depth, loopCount }
  alignment: { current: { light, dark } }
  inventory: { memoryFragments, relicIds[], draftCardIds[] }
  history: { phaseTrail[], lastDoorChoice?, lastDropReason? }
  metaFlags?: { penitentInsight, rebelBreaches, unlockedCodexKeys[] }
}
```

### Wall Writing

**Wall writing** is the act of a phase committing its outgoing wall payload. It follows this discipline:

1. The phase updates `RunLedger` first (via Redux actions like `lockGate`, `updateAlignment`, `advanceDepth`).
2. The phase builds a minimal `PhaseWallPayload` — only the fields the next phase needs to orient itself.
3. The phase calls `requestTransition(to, payload)` which:
   - Builds a `PhaseWallPacket` from the payload
   - Passes it to the engine's `transition(from, to, wall)` for legality check
   - Engine applies side-effects by reading from `RunLedger`/`RunMetaSnapshot` (not from the wall)
   - Redux stores the new phase + wall; old wall is discarded

### Run Log Packing

At key lifecycle moments (especially Drop → Staging), the RunLedger is **packed** — checkpointed to persistent storage (sessionStorage, localStorage, or Supabase). This is what allows:

- Recovery on page reload (boot.ts restores snapshot, hydrates Redux)
- Meta-progression across runs (Memory Fragments, unlocked codex, Vessel stats)
- The Staging room to fill up over time (empty on day one, rich on day twenty)

---

## V. The Transition Pipeline

The full flow when a phase advances:

```
[Phase Shell]
  │
  ├─ 1. dispatch(lockGate(...))        ← update RunLedger in Redux
  ├─ 2. build PhaseWallPayload         ← tiny, hop-specific
  └─ 3. dispatch(requestTransition(to, payload))
         │
         ├─ buildWallPacket(from, to, payload)
         ├─ engineTransition(from, to, wall)
         │     ├─ isLegalTransition(from, to)?
         │     ├─ pushPhase(to)         ← record in meta history
         │     └─ applySideEffects(from, to)
         │           ├─ lockIdentity()  ← reads from RunLedger, not wall
         │           ├─ incDepth()
         │           └─ incLoop()
         │
         └─ dispatch(setPhaseAndWall({ phase, wall }))
```

No phase shell ever reads localStorage directly. Redux is the single authority for both the current wall and the current run state.

---

## VI. Engine / Shell Separation

### Engine (`@du/phases`) — framework-agnostic

- `types.ts`: PhaseId, PhaseWallPacket, PhaseWallPayload (per-hop union), Alignment, VesselId, GateChoice, RunnerProfile, RunLedger
- `manager.ts`: `transition()`, `isLegalTransition()`, `applySideEffects()`, legality map
- `meta.ts`: `RunMetaSnapshot`, `getRunMeta()`, `lockIdentity()`, `incDepth()`, `incLoop()`, `pushPhase()`, snapshot restore/hydrate

### Shell (`web/react_app`) — React + Redux

- `app/phaseSlice.ts`: current phase, current wall, meta snapshot copy, `requestTransition` thunk
- `app/runSlice.ts`: RunLedger state, actions (`initRun`, `lockGate`, `updateAlignment`, `advanceDepth`, `recordPhase`, `recordDoorChoice`, `recordDrop`, `addMemoryFragments`, `setDraftCards`), selectors
- `app/store.ts`: combines phase + run reducers, preloaded from engine snapshot on boot
- Phase pages (`phases/01_title/` through `phases/07_drop/`): each has Shell (wiring, dispatch) and Screen (presentational, props-only)

### Key principle

> If a Screen is dispatching transitions directly, that's a smell.  
> Shells own wiring. Screens render.

---

## VII. The Hourglass

The descent structure mirrors itself:

```
House 9  — wide, open, warm
House 8
House 7
House 6
House 5
House 4
House 3
House 2
House 1  — narrow, compressed, dark (center: Dudael Drop)
House 1' — mirror begins
House 2'
...
House 9' — expanded, transformed
```

- Descent narrows, ascent widens
- Same houses, different rules (Light going down may be Dark coming up)
- Center = identity compression, economy inversion, vessel test
- Chromatic theology: Amber/Silver top → Purple mid → Indigo lower → Dark center → reversed on ascent
- Grayscale title screen on first run; color accumulates with each survive

The hourglass is simultaneously: level select, progress map, narrative arc, difficulty curve, and philosophical statement.

---

## VIII. Brand Identity: Sinerine

**Sinerine** is the brand identity system for Dudael. In this system, "identity" means brand markers and design tokens — not player/run state.

### Tri-Polar Color System

- **Light pole**: Celestial Amber (#F59E0B) — clarity, revelation, structure
- **Dark pole**: Twilight Violet (#A855F7) / Cosmic Indigo (#1E1B4B) — depth, concealment, transformation
- **Secret/Hybrid**: Amber → Purple gradient — synthesis, equilibrium

### Typography

- **Cinzel** (headings): authority, antiquity — level titles, card names, door inscriptions
- **Inter** (body): readability — lore text, descriptions, UI labels
- **JetBrains Mono** (stats): precision — Light/Dark counters, door costs, card stats

### Design Tokens

43 total across color (20), typography (6), spacing (11), shadows (6). All seeded in Supabase under the Sinerine database.

---

## IX. Naming Glossary

| Term | Meaning |
|------|---------|
| **The Bound** | The five fallen angel entities already imprisoned in Dudael. Not player avatars — prisoners. |
| **Runner** | The player-in-this-run. Replaces legacy "player" / "identity" in packet context. |
| **RunnerProfile** | `{ runnerId, userId?, vesselId?, sigilKey?, displayName? }` |
| **GateChoice** | The three-step selection (Guide/Mode/Vessel) as written to the wall. |
| **GateLock** | The same selection once committed to the RunLedger. |
| **PhaseWallPacket** | Tiny, hop-only data contract. Discarded after the next phase reads it. |
| **RunLedger** | Persistent run state across all phases and reloads. Lives in Redux + engine meta. |
| **Wall Writing** | The act of a phase committing its outgoing payload to the wall. |
| **Run Log Packing** | Checkpointing the RunLedger to persistent storage at lifecycle boundaries. |
| **Sinerine Identity** | Brand/design tokens. Not run state. |
| **Oiketrion** | Greek: habitation/spiritual covering (Jude 1:6). Core theological anchor. |
| **Steward** | Descent Mode: free the Bound, power outward. Kenosis pattern. |
| **Solo** | Descent Mode: bind the entity, power inward. Watcher transgression. |
| **The Hourglass** | Level/narrative structure: descent compresses, ascent expands. |
| **Cartridge Model** | Level container pattern: stage is the console, game is the cartridge. Content-agnostic. |
| **Forensic Theophany** | The aesthetic: clinical, examining, evidence under glass. |

---

## X. Inspection Checklist for Next Agent

- [ ] Find the one transition choke point (`requestTransition` in `phaseSlice.ts`)
- [ ] Confirm engine `transition()` enforces legality map in `manager.ts`
- [ ] Confirm run truth is recorded in `RunMetaSnapshot` (`meta.ts`) and mirrored in `runSlice`
- [ ] Confirm phase payloads are wall-local (per-hop union), not traveler-global
- [ ] Confirm wall writing is explicit (no `...prev` spreading)
- [ ] Confirm Shells own wiring; Screens remain presentational
- [ ] Confirm `lockIdentity()` reads from RunLedger/meta, not from the wall packet
- [ ] Confirm naming: "runner" for player-in-run, "Sinerine identity" for brand tokens only

---

*Radiant Seven · Sinerine · Dudael*  
*Rally with L/D — See the Gate*
