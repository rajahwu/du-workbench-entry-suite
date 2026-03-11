# Dudael Recap & Future Improvements

## 1. Where the Project Stands

Dudael currently has:
- A fully playable **7-phase loop** (Title, Select, Staging, Draft, Level, Door, Drop) wired through a single Redux thunk `requestTransition`, with legality enforced in the engine. [state-of-descent.md]
- A stable **transfer model** with PhaseWalls and WallPackets as tiny, hop-only contracts, and RunLedger as the persistent run diary. [state-of-descent.md, DudaelSystemsSpec.md, DudaelArchitecture-Design.md]
- A clear **systems spec** (tech + design) for parity, Draft as information game, Level as cartridge, Door math, and Drop/meta-progression. [DudaelSystemsSpec.md, DudaelSystemsSpec-Design.md]
- A defined **Bound layer** (tech + design) with five vessels, per-run stats, and long-term BoundState hooks (bound/freed/claimed/contested). [DudaelBoundSpec.md, DudaelBoundSpec-Design.md]
- A documented **engine/architecture model** (engine vs React vs RDX, Shell vs Screen, wall discipline, Run Log Packing, hourglass structure). [state-of-descent.md, DudaelArchitecture-Design.md]

The core architecture is strong; the remaining work is mostly tuning, feature deepening, and discipline around where new behavior lives.

---

## 2. Locked-In Decisions

These decisions should be treated as **stable constraints** going forward:

1. **Wall/ledger split**  
   - WallPackets are minimal, hop-only, and non-persistent.  
   - RunLedger (and its engine mirror) is the only source of truth for run-long state.

2. **Single transition choke point**  
   - All phase changes must go through `requestTransition` → engine `transition(from, to, wall)`.

3. **Shell vs Screen separation**  
   - Shells talk to Redux and the engine; Screens render UI and receive props.

4. **Three-layer character architecture**  
   - Guide (Light/Dark), Bound (five vessels), Mode (Steward/Solo) is the canonical selection model.

5. **Cartridge Level model**  
   - Level is a content-agnostic container; new mini-games plug in via cartridge ids without changing the loop.

---

## 3. High-Value Next Steps (Design)

### 3.1 Door Curve & Secret Behavior

Questions to answer:
- How quickly should Light/Dark door costs scale with depth? Linear, stepped, or curve-based?  
- How rare should Secret doors be, and what exact parity patterns unlock them (near-balance vs extreme spread)?

Suggested work:
- Draft a small tuning table for depth 1–7 (min Light/Dark per door, Secret rules).  
- Verify that the design matches the hourglass narrative (narrowing then widening).

### 3.2 Draft Visibility & Vessel Differentiation

Questions to answer:
- At what depths do we move from lore-only to hinted to explicit card information?  
- How much earlier should Penitent see explicit values vs others?  
- How strongly should Rebel see high-risk options?

Suggested work:
- Define 2–3 visibility tiers and a rules table mapping depth × vessel → tier.  
- Ensure each vessel has at least one clear Draft behavior difference.

### 3.3 Vessel-Specific Rules

Opportunities:
- **Exile:** Special handling on Door math-fail (e.g., unique fallback or penalty).  
- **Penitent:** Gain Memory Fragments or insight by reading lore / codex in Staging.  
- **Rebel:** Unique interactions with Secret doors or deficit mechanics.

Suggested work:
- Pick one signature rule per vessel that is cheap to implement but strongly communicates their theology and bias.

### 3.4 Meta-Progression & Fragment Sinks

Questions to answer:
- Beyond lore unlocks, what can Memory Fragments buy that feels meaningful but not mandatory?  
- How many runs should it take to reach a first meaningful unlock?

Suggested work:
- Define 3–5 fragment sinks (e.g., small starting bonuses, new lore tracks, cosmetic changes).  
- Sketch rough fragment costs and target run counts for each.

---

## 4. High-Value Next Steps (Engine / Tech)

### 4.1 Enforce Wall Discipline Everywhere

Tasks:
- Confirm all phases have migrated off legacy PhasePacket shapes to PhaseWallPacket.  
- Remove any `...prev` spreads on packets.  
- Ensure Side-effect logic reads from RunLedger (or engine meta snapshot), not from wall payload except where explicitly one-hop.

### 4.2 Tighten RunLedger & Meta Shapes

Tasks:
- Align engine `RunMetaSnapshot` with Redux `RunLedger` fields and nesting.  
- Add any missing fields required by new design decisions (e.g., vessel-specific counters, parity snapshots if needed).  
- Keep telemetry/debug clearly separated from game-facing fields.

### 4.3 Implement BoundState Meta Layer

Tasks:
- Create a small persistence layer for `BoundStateMap` (Supabase or local storage).  
- Wire `updateBoundStateOnDrop` into the Drop → Staging path for Steward/Solo outcomes.  
- Expose BoundState to Staging for codex and UI changes.

### 4.4 Introduce Additional Level Cartridges

Tasks:
- Define a `CartridgeId` registry and a second Level implementation (e.g., boss room or different puzzle).  
- Ensure cartridge selection is driven by draft/metadata, not hard-coded per depth.

---

## 5. Medium-Term Improvements

1. **Maps & diagrams**  
   - Phase Wall architecture diagram (engine view).  
   - RunLedger lifecycle diagram (how state evolves across phases and Drop).  
   - Hourglass map showing depth, door costs, and cartridge placements.

2. **Admin / Workbench tooling**  
   - Simple internal views for RunLedger snapshots, BoundState, and wall payloads for debugging.  
   - Basic card pool editor respecting vessel bias and Sinerine tokens.

3. **Sinerine integration pass**  
   - Ensure Light/Dark/Secret states are visually and sonically mapped consistently (colors, typography, audio cues) across Title, Draft, Level, Door, Drop.

4. **Playtest instrumentation**  
   - Log depth reached, door choices, drop reasons, and vessel usage to validate door curves, fragment payouts, and vessel balance.

---

## 6. How to Propose Changes (Lattice Guidance)

When proposing changes:
- **Start from design docs** (Systems-Design, Bound-Design, Architecture-Design) to articulate intent.  
- **Check routing** in the Onboarding Index to decide whether the change hits RunLedger, WallPacket, BoundState, or only phase-local UI.  
- **Update the relevant spec** (tech + design) before or alongside code changes, so future agents inherit a consistent picture.

This keeps Dudael’s architecture and theology aligned: every new mechanic knows which layer it belongs to, which entity it touches, and how it will be remembered across the descent.
