# Dudael Onboarding Index (Lattice View)

## 1. If You Only Read Three Docs

Start here if you are new to Dudael and need a fast mental model.

1. **State of Descent – Engine & Architecture Brief**  
   File: `state-of-descent.md`  
   Read this to understand *what Dudael is*, the 7-phase loop, PhaseWalls, RunLedger, and the hourglass structure.

2. **Dudael Systems Spec (Design View)**  
   File: `DudaelSystemsSpec-Design.md`  
   Read this to understand *how a run feels* and how Light/Dark/Secret, Draft, Level, Door, and Drop behave from a player/design perspective.

3. **Bound & Vessels Spec (Design View)**  
   File: `DudaelBoundSpec-Design.md`  
   Read this to understand *who you are descending with*—the five Bound, their theology, run feel, and long-term stakes.

After these three, you can sit in most design and systems conversations without looking at code.

---

## 2. When You Need Technical Detail

Use these when you’re ready to wire or refactor.

- **Dudael Systems Spec (Tech View)**  
  File: `DudaelSystemsSpec.md`  
  Contains TypeScript-style shapes for phases, RunLedger, PhaseWallPacket, alignment deltas, DraftSeed, LevelConfig, DoorOption, and Drop/meta functions.

- **Dudael Architecture Spec (Design View)**  
  File: `DudaelArchitecture-Design.md`  
  Explains Engine vs React vs RDX, Shell vs Screen, the transition pipeline, and wall discipline using design language.

- **Bound & Vessels Spec (Tech View)**  
  File: `DudaelBoundSpec.md`  
  Defines `VesselId`, `VESSEL_CONFIGS`, per-run derived stats, and long-term `BoundState` (bound/freed/claimed/contested).

These are your reference when deciding *where* a new mechanic lives (wall vs ledger vs meta layer) and how to name it.

---

## 3. Quick Questions and Which Doc to Open

- **“How does the loop itself work?”**  
  → `state-of-descent.md` and `DudaelSystemsSpec-Design.md`.

- **“What is a WallPacket / PhaseWall?”**  
  → `state-of-descent.md` and `DudaelArchitecture-Design.md`.

- **“Where should this new flag or counter live?”**  
  → `DudaelSystemsSpec.md` (RunLedger vs wall) and `DudaelArchitecture-Design.md`.

- **“What happens at Door, and why do some doors lock?”**  
  → `DudaelSystemsSpec-Design.md` (Doors section), `DudaelSystemsSpec.md` (DoorOption / computeDoorOptions).

- **“What does picking Rebel vs Penitent really change?”**  
  → `DudaelBoundSpec-Design.md` first, `DudaelBoundSpec.md` if you need exact numbers.

- **“How does meta-progression (Memory Fragments, Staging) work?”**  
  → `DudaelSystemsSpec-Design.md` (Drop & Staging), `DudaelSystemsSpec.md` (Drop & RunLedger fields).

---

## 4. Suggested Reading Order by Role

### Designers / Narrative

1. `state-of-descent.md`  
2. `DudaelSystemsSpec-Design.md`  
3. `DudaelBoundSpec-Design.md`  
4. `DudaelArchitecture-Design.md` (for structure language)

### Systems / Gameplay Engineering

1. `state-of-descent.md`  
2. `DudaelSystemsSpec.md`  
3. `DudaelBoundSpec.md`  
4. `DudaelArchitecture-Design.md`

### Engine / Architecture

1. `state-of-descent.md`  
2. `DudaelArchitecture-Design.md`  
3. `DudaelSystemsSpec.md`  
4. `DudaelBoundSpec.md`

---

## 5. Where to Put New Ideas

When you propose or add something new, use this routing:

- **New run-long mechanic (affects a whole descent):**  
  Add to `RunLedger` in `DudaelSystemsSpec.md` and reference it from `DudaelSystemsSpec-Design.md`.

- **New phase-local behavior (only one room cares):**  
  Add to that phase’s Shell/Screen and, if it must cross a boundary, define a new field on the relevant PhaseWallPayload in `DudaelSystemsSpec.md`.

- **New vessel behavior or meta arc:**  
  Add to `DudaelBoundSpec.md` (tech) and `DudaelBoundSpec-Design.md` (intent).

- **New structural rule about transitions or layers:**  
  Add to `DudaelArchitecture-Design.md` and, if needed, to the engine code comments keyed off `state-of-descent.md` sections.

This keeps the lattice synchronized: design intent in design docs, data shapes in tech specs, and behavior in code.
