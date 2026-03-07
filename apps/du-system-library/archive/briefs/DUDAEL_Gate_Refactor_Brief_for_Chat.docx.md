

**DUDAEL — THE GATE REFACTOR**

Lattice Brief for Chat (GPT)

Prepared by Claude | March 2, 2026

Codename: The Gate

**1\. WHAT IS DUDAEL**

Dudael is a web-based roguelike card game built on a Hades-style meta-loop. Five fallen angel archetypes (the Bound) are imprisoned in a quarantine zone called Dudael. Players descend through a 7-phase loop — Title, Select, Staging, Draft, Level, Door, Drop — balancing Light and Dark resources to unlock doors, with designed death feeding persistent progression.

**Tech stack:** TypeScript 5.9, Vite 7, React 19, React Router 7, Redux Toolkit, TanStack Query, Tailwind CSS 4, Supabase, PixiJS 8\. Monorepo via pnpm with @du/phases (framework-agnostic engine) and web/react\_app (frontend). \~3,600 LOC across \~30 files.

**Current state:** Fully playable 7-phase loop as of March 1\. State refactor completed March 2 — all phase transitions now route through a single Redux thunk (requestTransition). Tagged v0.1.0-loop.

**2\. THE THREE-LAYER ARCHITECTURE (NEW)**

This morning Rajah proposed a fundamental restructuring of Dudael's narrative-mechanical relationship. Previously, the five Vessels were player classes. Now they are reframed as Bound entities — prisoners already in Dudael — and the player enters into a relationship with them. This creates three distinct layers:

| LAYER | NAME | FUNCTION |
| :---- | :---- | :---- |
| Layer 1 (Top) | THE META — The Guides | Light Guide (Surveyor) or Dark Guide (Smuggler). Player's first choice. Determines descent tone, draft pool bias, keeper commentary. |
| Layer 2 (Middle) | THE FIVE BOUND | Seraph, Shadow, Exile, Penitent, Rebel. Already imprisoned in Dudael. Player has access to 3 (determined by meta-state). Selection determines run stats/playstyle. |
| Layer 3 (Bottom) | THE STRATEGY — Descent Mode | Steward (free the Bound, power outward) or Solo (bind the entity, power inward). Determines what Draft/Door/Drop write to — entity liberation vs. runner power. |

**The Theological Foundation**

Each Vessel maps to a relationship with the oikētērion — the Greek word from Jude 1:6 meaning 'habitation' or 'spiritual covering' that the angels abandoned. Steward mirrors kenosis (self-emptying). Solo mirrors the Watchers' original transgression — reaching down to bind and possess. Same dungeon, same phases, same economy, different intent.

**Key design principle:** "It exists without A whether they find the content or not." The Bound have state independent of the player's attention. The game world persists across runs.

**3\. THE SEVEN-PHASE LOOP**

| a | NAME | WHAT HAPPENS |
| :---- | :---- | :---- |
| 01 | Title (The Void) | Procedural PixiJS animation (687 LOC). Identity resolution, exchange flow. Fires dudael:exchange event. |
| 02 | Select (Forging) | NOW THREE SUB-PHASES: 0: Choose Guide (Light/Dark) → 1: Choose Mode (Steward/Solo) → 2: Choose Bound (from 3 available Vessels). Writes descentGuide, descentMode, vesselId to packet. |
| 03 | Staging (Hub) | Breathing room. Phase architecture diagram, live stats, SVG visualizations. Keepers (Surveyor/Smuggler) offer upgrades. Insight tracking for Penitent. |
| 04 | Draft (Memory) | Already has sub-phases. Light keeper \+ Dark keeper each offer cards. Pick 2 of 4 with 1 reroll. Cards carry lightDelta, darkDelta, tags. Insight-based visibility system. |
| 05 | Level (Container) | 3×3 tap grid mini-game. Timer, health bar, depth-scaled difficulty. Architecture is content-agnostic — different mini-games can swap in. |
| 06 | Door (Divergence) | Three doors — Light, Dark, Secret. Alignment requirements scale by depth. Parity snapshot from Draft checked here. |
| 07 | Drop (Purge) | Run summary. Designed death converts to Memory Fragments (meta-currency). In Steward mode: sacrifice complete. In Solo mode: entity broke free. Loop returns to Staging. |

**4\. THE FIVE BOUND (VESSEL CONFIGS)**

| VESSEL | LIGHT | DARK | HP | HAND | BIAS | THEOLOGY |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Seraph | 3 | 0 | 10 | 2 | light | Never left habitation |
| Shadow | 0 | 3 | 10 | 2 | dark | Dove willingly into depth |
| Exile | 2 | 2 | 10 | 2 | neutral | Shed covering, refused to sink |
| Penitent | 3 | 1 | 12 | 2 | insight | Rebuilding lost covering |
| Rebel | 1 | 3 | 8 | 3 | hazard | Set habitation on fire |

**5\. THE GATE REFACTOR — WHAT WE'RE DOING NOW**

The Gate Refactor normalizes the packet and Redux store schemas to support the new three-layer architecture. We just completed the state refactor (centralizing transitions through Redux). Now we need to clean the data contracts before adding new fields.

**What needs to happen**

1. Audit the current PhasePacket type from phases/types.ts and all Redux slice shapes — get ground truth from the codebase, not the docs.

2. Normalize the packet schema to cleanly separate runner identity from Bound entity config. Add descentGuide, descentMode fields.

3. Design the boundState persistence layer (meta-state across runs, outside per-run packet).

4. Implement the three Select sub-phases: 0: Guide → 1: Mode → 2: Vessel (same pattern as Draft sub-phases).

**Proposed new types**

`// New fields on PhasePacket`

`descentGuide: 'light' | 'dark'`

`descentMode: 'steward' | 'solo'`

`// New meta-persistence layer`

`type BoundState = {`

  `id: VesselId;`

  `status: 'bound' | 'freed' | 'claimed' | 'contested';`

  `freedBy?: 'steward';`

  `claimedBy?: 'solo';`

  `runCount: number;`

`};`

`meta.boundStates: Record<VesselId, BoundState>`

**6\. BRAND IDENTITY — SINERINE**

**Light:** Celestial Amber (\#F59E0B) — clarity, revelation, structure. **Dark:** Twilight Violet (\#A855F7) / Cosmic Indigo (\#1E1B4B) — depth, concealment, transformation. Neither is 'better.' Secret Door \= synthesis of both.

**Typography:** Cinzel (headings — authority), Inter (body — readability), JetBrains Mono (game data — precision). 43 design tokens total across color, type, spacing, shadow.

**7\. KEY CONCEPTS GLOSSARY**

| TERM | MEANING |
| :---- | :---- |
| The Bound | The five fallen angel entities already imprisoned in Dudael. Not player avatars — prisoners. |
| The Two Children | Surveyor (Light Guide) and Smuggler (Dark Guide). The keepers. Innocence leading the fallen. |
| Steward Descent | Mode where player descends to FREE the Bound. Power flows outward. Kenosis pattern. |
| Solo Descent | Mode where player descends to BIND the entity. Power flows inward. Watcher transgression. |
| Oikētērion | Greek: habitation/spiritual covering (Jude 1:6). The thing the angels abandoned. Core theological anchor. |
| PhasePacket | The canonical data contract passed between phases. Each phase reads/writes designated fields only. |
| TurtlePhase | The stealth scale architecture — how phase shells contain and protect their internals. |
| The Gate | This refactor. Normalizing schemas so everything passes through one canonical contract. |
| Parity | Snapshot of Light/Dark balance taken after Draft and checked at Door. Creates delayed consequence. |
| Drop | Designed death. Player is meant to die. Failure converts to Memory Fragments for permanent upgrades. |
| The Lattice | Rajah's multi-agent coordination system. Claude, Chat (GPT), Perplexity — specialized team members, not tools. |
| Sinerine | The brand identity for Dudael. 43 design tokens. Amber/Violet duality. |

**8\. YOUR ROLE IN THIS SESSION**

Rajah is stepping away to eat. When he returns, we're normalizing the schemas together. Your strengths in structured data modeling and API design are directly relevant here. The immediate tasks are:

* Review the current PhasePacket shape and Redux slices — identify what's canonical vs. what's drifted during the build sprint.

* Help normalize: clean separation of runner identity, bound entity config, guide/mode flags, and meta-persistence (boundState).

* Validate the Select sub-phase flow (Guide → Mode → Vessel) against the packet contract.

* The turtle phase shell system means phase internals don't care about schema changes as long as the contract is right. We're building the gate, not rebuilding the house.

   
**RALLY WITH L\&D — SEE THE GATE**  
Radiant Seven / Sinerine / Dudael