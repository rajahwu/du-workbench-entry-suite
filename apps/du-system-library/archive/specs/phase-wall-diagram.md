# Phase Wall Transfer Diagram — WallPacket Locked

**System:** Dudael Phase Engine  
**Enforcement Point:** `requestTransition` thunk (phaseSlice.ts)  
**Date:** March 3, 2026

---

## The Corridor \+ Walls

Each phase is a room. Between rooms is a **Wall**. You can only write/read the wall you are touching.

┌────────┐    ┌────────┐    ┌──────────┐    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐

│ Title  │    │ Select │    │ Staging  │    │ Draft  │    │ Level  │    │ Door   │    │ Drop   │

└───┬────┘    └───┬────┘    └────┬─────┘    └───┬────┘    └───┬────┘    └───┬────┘    └───┬────┘

    │             │              │               │              │              │              │

    ▼             ▼              ▼               ▼              ▼              ▼              ▼

  WALL(T)       WALL(S)        WALL(ST)        WALL(DR)       WALL(LV)       WALL(DO)       WALL(DP)

**Rule:** Phase code can only read/write its own wall payload. Everything else must cross via **WallPacket**.

---

## The Only Legal Crossing: WallPacket

All transfer happens through one narrow "mail slot":

Current Phase (touching this wall)

    │

    │ 1\) Read: RunLedger \+ Wall\[from\]

    │ 2\) Derive: payload for next wall

    │ 3\) Transfer: WallPacket(from → to, payload)

    ▼

Next Phase (touching next wall)

---

## The Transition Pipeline (Enforcement Point)

This shows where you enforce "no bleed."

\[ Shell \]

   │   (reads only: RunLedger \+ Wall\[current\])

   │

   │ dispatch requestTransition(to, payload)

   ▼

\[ phaseSlice thunk / action \]  ← CHOKE POINT (only legal doorway)

   │

   │ calls engine.transition(from, to, WallPacket)

   ▼

\[ Engine transition \]

   │  \- legality check: LEGAL\[from\]?.includes(to)

   │  \- apply meta side-effects (depth, loop, locks)

   │  \- returns: nextPhase \+ nextWallPayload \+ metaSnapshot

   ▼

\[ Redux updates \]

   │  \- phase \= to

   │  \- wall\[to\] \= nextWallPayload

   │  \- runLedger updated (logs/snapshot)

   ▼

\[ Next Shell renders \]

---

## Locked Terms (Repo Consistency)

### WallPacket (locked name)

**Definition:** The only object allowed to carry data across a phase boundary.

**Must be:**

- Small  
- Hop-only  
- Non-persistent  
- Never spread/merged with previous packets

**Recommended shape (minimal \+ durable):**

type WallPacket\<P \= unknown\> \= {

  from: PhaseId

  to: PhaseId

  at: number        // timestamp or monotonic tick

  payload: P

}

If you later add `runId`, that's fine — but keep it "routing metadata," not a bag.

---

## The 3 Rules That Prevent Bleed Forever

### 1\. Only the engine consumes WallPacket

UI doesn't interpret other phase payloads.

### 2\. A phase may only read Wall\[current\]

No reaching into other walls.

### 3\. No packet spreading. Ever.

No `{...prevPacket, ...newStuff}` patterns.

---

## Named Steps (Clean Vocabulary)

If you want to make your metaphor explicit in code/docs, use these terms:

- **WallWrite**: derive next wall payload  
- **WallTransfer**: commit via WallPacket \+ transition  
- **WallTouch**: current phase is allowed to read/write this wall

---

## The Full Seven-Phase Sequence with Wall Payloads

┌────────────────────────────────────────────────────────────────────────────┐

│                           DUDAEL PHASE CORRIDOR                            │

└────────────────────────────────────────────────────────────────────────────┘

Phase 01: TITLE

   │  Wall payload: { userRef, pathHint? }

   │  What crosses: minimal user identity, lite/full path signal

   ▼

   WALL(T→S)

Phase 02: SELECT

   │  Wall payload: { runId, runnerRef, gateChoice }

   │  What crosses: run identifier, runner profile, locked gate (Guide/Mode/Vessel)

   ▼

   WALL(S→ST)

Phase 03: STAGING

   │  Wall payload: { runId }

   │  What crosses: run identifier only (RunLedger has everything else)

   ▼

   WALL(ST→DR)

Phase 04: DRAFT

   │  Wall payload: { runId, draftResultId? }

   │  What crosses: run identifier, optional draft result reference

   ▼

   WALL(DR→LV)

Phase 05: LEVEL

   │  Wall payload: { runId }

   │  What crosses: run identifier only

   ▼

   WALL(LV→DO)

Phase 06: DOOR

   │  Wall payload: { runId, doorChoice? }

   │  What crosses: run identifier, door selection (light/dark/secret)

   ▼

   WALL(DO→DP) or WALL(DO→DR) or WALL(DO→ST)

   

Phase 07: DROP

   │  Wall payload: { runId, dropReason? }

   │  What crosses: run identifier, drop reason (death/quit/complete)

   ▼

   WALL(DP→ST) or WALL(DP→DR) or WALL(DP→T)

   Loop returns to Staging (continue) or Title (new run)

---

## Legality Map with Wall Boundaries

Phase          → Legal Next Phases              Wall Payload Type

─────────────────────────────────────────────────────────────────────

01\_title       → \[02\_select\]                    TitleToSelect

02\_select      → \[03\_staging\]                   SelectToStaging

03\_staging     → \[04\_draft, 02\_select\]          StagingToDraft | StagingToSelect

04\_draft       → \[05\_level, 03\_staging\]         DraftToLevel | DraftToStaging

05\_level       → \[06\_door\]                      LevelToDoor

06\_door        → \[04\_draft, 03\_staging, 07\_drop\] DoorToDraft | DoorToStaging | DoorToDrop

07\_drop        → \[04\_draft, 01\_title, 03\_staging\] DropToDraft | DropToTitle | DropToStaging

---

## Type-Safe Wall Payload Union (TypeScript)

type TitleToSelect \= { userRef: string, pathHint?: 'lite' | 'full' }

type SelectToStaging \= { runId: string, runnerRef: RunnerProfile, gateChoice: GateChoice }

type StagingToDraft \= { runId: string }

type DraftToLevel \= { runId: string, draftResultId?: string }

type LevelToDoor \= { runId: string }

type DoorToDraft \= { runId: string, doorChoice?: 'light' | 'dark' | 'secret' }

type DoorToStaging \= { runId: string }

type DoorToDrop \= { runId: string, doorChoice?: 'light' | 'dark' | 'secret' }

type DropToDraft \= { runId: string, dropReason?: string }

type DropToTitle \= { runId: string, dropReason?: string }

type DropToStaging \= { runId: string, dropReason?: string }

type StagingToSelect \= { runId: string }

type PhaseWallPayload \=

  | TitleToSelect

  | SelectToStaging

  | StagingToDraft

  | StagingToSelect

  | DraftToLevel

  | DraftToStaging

  | LevelToDoor

  | DoorToDraft

  | DoorToStaging

  | DoorToDrop

  | DropToDraft

  | DropToTitle

  | DropToStaging

type WallPacket\<P extends PhaseWallPayload \= PhaseWallPayload\> \= {

  from: PhaseId

  to: PhaseId

  at: number

  payload: P

}

---

## Enforcement Checklist

When reviewing code for wall discipline:

- [ ] Every transition goes through `requestTransition` thunk  
- [ ] No direct `dispatch(setPhase(...))` calls from shells  
- [ ] No `{...prevWall, ...newStuff}` patterns  
- [ ] Wall payloads match the discriminated union shape  
- [ ] Engine `transition()` checks `LEGAL[from]?.includes(to)`  
- [ ] Side effects (`lockIdentity`, `incDepth`, `incLoop`) read from RunLedger, not wall  
- [ ] RunLedger is the source of truth for all persistent run state  
- [ ] Wall payloads are minimal (no duplicating data already in RunLedger)

---

*Radiant Seven · Sinerine · Dudael*  
*WallPacket locked — no bleed, no spread, no reach*  
