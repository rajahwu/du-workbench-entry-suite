# Doman Docs Assets, and Tool

Here’s a domain‑by‑domain checklist of the docs, assets, and tools Dudael should have, grounded in what’s already in your space and briefs.DUDAEL\_Gate\_Refactor\_Brief\_for\_Chat.docx+2

---

## **1\. World and lore**

Recommended items:\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​

* Docs  
  * World bible (zones, factions, theology, timeline).  
  * Bound profiles (1–2 pages each: Seraph, Shadow, Exile, Penitent, Rebel).  
  * Level/realm briefs (Threshold, Crossroads, Sanctum, Dudael core).  
  * Lore glossary (oiketrion, Watchers, Drop, Staging, Guides).  
* Assets  
  * Lore map / diagram of Dudael and sectors.  
  * Character art moodboard per Bound.  
  * Location concept boards per key phase/level.  
* Tools  
  * “Lore index” doc or Notion-style index page.  
  * Simple search view over lore tables if in Supabase (e.g., vfaguidelines, vfapalette style views).\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​

---

## **2\. Entities, classes, and builds**

Recommended items:DUDAEL\_Gate\_Refactor\_Brief\_for\_Chat.docx+1

* Docs  
  * Bound/Vessel design spec (stats, theology, playstyle, unlock rules).  
  * Guide and Keeper spec (Surveyor, Smuggler, their barks, draft bias).  
  * Descent Mode spec (Steward vs Solo effects on Drop, meta-write targets).  
* Assets  
  * Stat tables for each Bound (HP, Light/Dark, hand size, biases).\[[docs.google](https://docs.google.com/document/d/1GzvJ1JZKR8YZSG11NU-OVdhCYh5K0WWS/edit?usp=drivesdk&ouid=100937465801829159993&rtpof=true&sd=true)\]​  
  * Icon set for Vessels, Guides, Modes, and alignment states.  
* Tools  
  * Balance sheet (spreadsheet or dashboard) for vessel stats and parity breakpoints.  
  * CLI or script to seed/update Bound/Guide tables in Supabase (similar to litegame seed).\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​

---

## **3\. Game loop and systems**

Recommended items:FALLEN-ANGELS-GAME-SPRINT-PLAN-TASK-CHECKLIST.md+2

* Docs  
  * Loop overview (7 phases, responsibilities, inputs/outputs).  
  * System specs: Light/Dark/Secret parity, Door requirements, Draft flow, Level mini‑games, Drop rewards.  
  * Difficulty and progression curve notes (depth vs cost vs reward).  
* Assets  
  * Phase diagrams (Title→Select→Staging→Draft→Level→Door→Drop).  
  * Door cost tables per depth.  
  * Card taxonomy table (tags, rarity, lightDelta/darkDelta).\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​  
* Tools  
  * System test plan (like the sprint checklist, but per system rather than per week).\[[docs.google](https://docs.google.com/document/d/1qc17KfE5ReUYlBOg7HX07qOLzh8ewvGe-7g73McctgA/edit?usp=drivesdk)\]​  
  * “Run log” view over gameruns and choices (Supabase query/dashboard).\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​

---

## **4\. Brand, aesthetic, and identity**

Recommended items:DUDAEL\_Gate\_Refactor\_Brief\_for\_Chat.docx+1

* Docs  
  * Brand style guide (Sinerine palette, tokens, dos/don’ts) – you already have this seeded; keep a human‑readable PDF/MD.\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​  
  * UI motion and FX spec (glows, transitions, CRT/forensic feel).  
  * Audio direction brief (Light vs Dark vs Secret sound palettes).  
* Assets  
  * Design tokens in DB (colors, typography, icons) – already present via seed SQL.\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​  
  * Icon set (Light/Dark/Hybrid, rarity badges) with actual storage paths filled in.\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​  
  * Screenshot pack (doors, cards, Staging, Drop) for marketing/portfolio.\[[docs.google](https://docs.google.com/document/d/1qc17KfE5ReUYlBOg7HX07qOLzh8ewvGe-7g73McctgA/edit?usp=drivesdk)\]​  
* Tools  
  * Supabase dashboard views: vfapalette, vfatypography, icon registry views (already sketched in the seed).\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​  
  * Small “brand console” web view that reads those views and shows brand at a glance.

---

## **5\. Engine, architecture, and workbench**

Recommended items:DUDAEL\_Gate\_Refactor\_Brief\_for\_Chat.docx+1

* Docs  
  * Engine architecture doc (dup­hases core, web app shells, tech stack overview).\[[docs.google](https://docs.google.com/document/d/1GzvJ1JZKR8YZSG11NU-OVdhCYh5K0WWS/edit?usp=drivesdk&ouid=100937465801829159993&rtpof=true&sd=true)\]​  
  * PhasePacket/PhaseWall contract doc (fields by phase, allowed reads/writes).  
  * Run Repo / meta-store doc (what lives in meta vs packet vs external profile).  
  * Refactor roadmap (The Gate checklist, done/next).\[[docs.google](https://docs.google.com/document/d/1GzvJ1JZKR8YZSG11NU-OVdhCYh5K0WWS/edit?usp=drivesdk&ouid=100937465801829159993&rtpof=true&sd=true)\]​  
* Assets  
  * Architecture diagrams (three-layer Gate architecture; PhaseWall vs Run Repo).\[[docs.google](https://docs.google.com/document/d/1GzvJ1JZKR8YZSG11NU-OVdhCYh5K0WWS/edit?usp=drivesdk&ouid=100937465801829159993&rtpof=true&sd=true)\]​  
  * File tree map of the mono­repo with domains (phases, lore, admin, etc.).  
* Tools  
  * Web app:  
    * Dudael workbench UI (packet inspector, meta inspector, phase router test panel).  
  * CLI / scripts:  
    * Seed scripts for lite game data and brand identity (you already have SQL seeds).\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​  
    * “Schema drift check” script comparing TS types to DB schemas.

---

## **6\. Content and production pipeline**

Recommended items (pulled from sprint/checklist \+ brand deliverables).FALLEN-ANGELS-GAME-SPRINT-PLAN-TASK-CHECKLIST.md+1

* Docs  
  * Content pipeline doc (how a card/level/Bound goes from idea → lore → DB → game).\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​  
  * Sprint templates (Week 1/2/3 structure reused for future content batches).\[[docs.google](https://docs.google.com/document/d/1qc17KfE5ReUYlBOg7HX07qOLzh8ewvGe-7g73McctgA/edit?usp=drivesdk)\]​  
  * QA checklist (run types, parity edge cases, reload, Supabase failure).  
* Assets  
  * Asset manifest (angels, doors, cards, sounds, fonts) with status per item.\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​  
  * Test datasets (levels, cards, skills seeds).\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​  
* Tools  
  * Content dashboard views: levels, cards, skills, brand guidelines, with filters for “missing art/text”.\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​  
  * Simple editor (even a spreadsheet \+ CSV loader or a minimal CMS view in the admin app).

---

## **Compact table**

| Domain | Docs (at minimum) | Assets (at minimum) | Tools (at minimum) |
| :---: | :---: | :---: | :---: |

| Domain | Docs (at minimum) | Assets (at minimum) | Tools (at minimum) |
| ----- | ----- | ----- | ----- |
| World & lore | World bible, Bound/realm lore, glossaryDUDAEL\_Gate\_Refactor\_Brief\_for\_Chat.docx+1 | Lore map, character/location boards\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​ | Lore index \+ search or DB view\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​ |
| Entities & classes | Bound/Guide/Mode specs, build rulesDUDAEL\_Gate\_Refactor\_Brief\_for\_Chat.docx+1 | Stat tables, icons per Bound/Guide\[[docs.google](https://docs.google.com/document/d/1GzvJ1JZKR8YZSG11NU-OVdhCYh5K0WWS/edit?usp=drivesdk&ouid=100937465801829159993&rtpof=true&sd=true)\]​ | Balance sheet, seed/maint scripts\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​ |
| Game loop & systems | Loop \+ systems specs, progression curvesDUDAEL\_Gate\_Refactor\_Brief\_for\_Chat.docx+1 | Phase diagrams, door/card tables\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​ | System test plan, run log dashboardFALLEN-ANGELS-GAME-SPRINT-PLAN-TASK-CHECKLIST.md+1 |
| Brand & aesthetic | Style guide, motion/audio briefsDUDAEL\_Gate\_Refactor\_Brief\_for\_Chat.docx+1 | Tokens, icons, screenshotsFALLEN-ANGELS-GAME-SPRINT-PLAN-TASK-CHECKLIST.md+1 | Brand views (palette, type, icons)\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​ |
| Engine & workbench | Architecture \+ contracts \+ refactor roadmapDUDAEL\_Gate\_Refactor\_Brief\_for\_Chat.docx+1 | Diagrams, repo map\[[docs.google](https://docs.google.com/document/d/1GzvJ1JZKR8YZSG11NU-OVdhCYh5K0WWS/edit?usp=drivesdk&ouid=100937465801829159993&rtpof=true&sd=true)\]​ | Workbench UI, seeds, drift checks\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​ |
| Content & production | Pipeline guide, sprint/QA templatesFALLEN-ANGELS-GAME-SPRINT-PLAN-TASK-CHECKLIST.md+1 | Asset manifest, test data\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​ | Content dashboards, lightweight editor\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​ |

If you’d like, I can turn one of these domains (for example “Engine & workbench”) into a concrete folder \+ file naming scheme you can drop into the repo today. Which domain do you want to formalize first?

# Audit: What You Have Now

Based on your current workspace files, here's a practical method to organize and combine them into a clean, maintable set:pasted-text.txt+6

---

## **Audit: What You Have Now**

| Current File | Primary Domain(s) | Status | Action Needed |
| ----- | ----- | ----- | ----- |
| **pasted-text.txt (Game Dev Session)** | Loop, Architecture, Lore | Raw chat log, 12KB | Extract key decisions → merge into specs |
| **pasted-text.txt (Refactor Guide)** | Engine, PhaseWall, Redux | Raw chat log, 74KB | Extract architecture patterns → merge into arch doc |
| **DUDAEL\_Gate\_Refactor\_Brief** | Engine, Architecture, Gate | Structured brief, 10KB | **Keep as canonical arch doc**, update status |
| **FALLEN ANGELS Sprint Plan** | Production, Systems | Task checklist, complete | Archive or evolve into "Content Pipeline" doc |
| **Oiketrion** | Lore, Theology, World | Dense lore dump, 94KB | **Keep as lore bible**, add TOC/index |
| **FALLEN ANGELS Proto Index** | Brand, Identity, Systems | Seed SQL \+ brand spec, 66KB | Split: Brand Guide \+ DB Seed Script |
| **Core Vessel shape** | Entities, Classes | Vessel theology notes, 3KB | Merge into "Bound Spec" doc |
| **Dudael\_Lore\_Compilation** | Lore, World | Lore summary, 11KB | Merge with Oiketrion or keep as "Lore Quick Ref" |

---

## **Proposed Clean Set (7 Core Docs \+ Supporting Files)**

## **1\. Dudael\_Architecture.md (Engine & Workbench domain)**

**Combines:**

* DUDAEL\_Gate\_Refactor\_Brief (keep as base)\[[docs.google](https://docs.google.com/document/d/1GzvJ1JZKR8YZSG11NU-OVdhCYh5K0WWS/edit?usp=drivesdk&ouid=100937465801829159993&rtpof=true&sd=true)\]​  
* Architecture sections from Refactor Guide (PhaseWall, Run Repo, Redux patterns)\[[ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/dd1d1b6e-4096-4d1a-bd17-035badbb9c43/pasted-text.txt)\]​  
* Tech stack summary from Proto Index\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​

**Structure:**

text  
`# Dudael Architecture`

`## Tech Stack`  
`## Seven-Phase Loop`  
`## Three-Layer Architecture (Meta Guides / Bound / Mode)`  
`## PhaseWall Contract System`  
`## Run Repo vs PhasePacket`  
`## Redux State Management`  
`## Refactor Status & Roadmap`

**Size target:** 8–12 pages  
**Owner:** You (engine decisions)  
**Update cadence:** After major refactors

---

## **2\. Dudael\_Lore\_Bible.md (World & Lore domain)**

**Combines:**

* Oiketrion (theology, fallen angels, Watchers)\[[ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/connectors/google_drive/1-_SXfKruNDhIDQIfWGq5ps2B21ylL-ztTELn4KU4LdI/5d25b1e4-0b36-446d-91af-d346e956f4f4/Oiketrion.md)\]​  
* Dudael\_Lore\_Compilation (zones, Drop, containment)\[[ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/connectors/google_drive/1FkYahqatq4WNyj4VPsbLLVNEXc_2EGnc/eb989b3d-a3c0-4b24-b7ed-98f42f0122fe/Dudael_Lore_Compilation.docx)\]​  
* Game Dev Session lore notes (tarot-guided room design, hourglass symbolism)\[[ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/62757fe3-a07e-438d-a5aa-d0434a30de8b/pasted-text.txt)\]​

**Structure:**

text  
`# Dudael Lore Bible`

`## World Overview (Echo & Voids, Quarantine Zone)`  
`## Theology (Oiketrion, Habitation, Jude 1:6)`  
`## The Bound (Seraph, Shadow, Exile, Penitent, Rebel)`  
`## Locations (Threshold, Crossroads, Sanctum, Abyss)`  
`## Guides & Keepers (Surveyor, Smuggler)`  
`## Key Terms Glossary`

**Size target:** 20–30 pages (it's dense, that's fine)  
**Owner:** You \+ collaborators (narrative)  
**Update cadence:** As lore expands

---

## **3\. Dudael\_Bound\_Spec.md (Entities & Classes domain)**

**Combines:**

* Core Vessel shape (theology per Bound)\[[ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/connectors/google_drive/1WA5xAe7twQhsQubhLuvUQQjMUITVaW_n20bhUlXav1M/585627bc-b29a-4d71-92eb-72479af7f4cf/Core-Vessel-shape.md)\]​  
* Bound stats from Gate Refactor (HP, Light/Dark, hand size)\[[docs.google](https://docs.google.com/document/d/1GzvJ1JZKR8YZSG11NU-OVdhCYh5K0WWS/edit?usp=drivesdk&ouid=100937465801829159993&rtpof=true&sd=true)\]​  
* Descent Mode notes from Proto Index (Steward vs Solo)\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​

**Structure:**

text  
`# The Bound: Vessel Specifications`

`## Design Philosophy (theology → mechanics)`  
`## The Five Bound`  
  `### Seraph (stats, theology, playstyle, unlock)`  
  `### Shadow`  
  `### Exile`  
  `### Penitent`  
  `### Rebel`  
`## Guides (Surveyor, Smuggler)`  
`## Descent Modes (Steward, Solo)`  
`## Balance Notes`

**Size target:** 8–10 pages  
**Owner:** You (design/balance)  
**Update cadence:** Per balance pass

---

## **4\. Dudael\_Systems\_Spec.md (Game Loop & Systems domain)**

**Combines:**

* Seven-phase flow from Gate Refactor\[[docs.google](https://docs.google.com/document/d/1GzvJ1JZKR8YZSG11NU-OVdhCYh5K0WWS/edit?usp=drivesdk&ouid=100937465801829159993&rtpof=true&sd=true)\]​  
* Light/Dark/Secret mechanics from Sprint Plan\[[docs.google](https://docs.google.com/document/d/1qc17KfE5ReUYlBOg7HX07qOLzh8ewvGe-7g73McctgA/edit?usp=drivesdk)\]​  
* Parity/Door/Draft details from Proto Index\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​  
* Hourglass architecture from Game Dev Session\[[ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/62757fe3-a07e-438d-a5aa-d0434a30de8b/pasted-text.txt)\]​

**Structure:**

text  
`# Dudael Systems Specification`

`## Core Loop (Title → Select → Staging → Draft → Level → Door → Drop)`  
`## Light/Dark/Secret Economy`  
  `- Parity Snapshots`  
  `- Door Requirements by Depth`  
  `- Alignment Tracking`  
`## Draft System (Keeper offers, card pools, insight)`  
`## Level Container (mini-game abstraction)`  
`## Drop & Meta-Progression (Memory Fragments, loop counter)`  
`## Hourglass Architecture (cartridge model)`

**Size target:** 10–15 pages  
**Owner:** You (systems design)  
**Update cadence:** Per system change

---

## **5\. Sinerine\_Brand\_Guide.md (Brand & Aesthetic domain)**

**Extracts from:**

* Proto Index brand section (color tokens, typography, Sinerine duality)\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​  
* Gate Refactor brand identity section\[[docs.google](https://docs.google.com/document/d/1GzvJ1JZKR8YZSG11NU-OVdhCYh5K0WWS/edit?usp=drivesdk&ouid=100937465801829159993&rtpof=true&sd=true)\]​

**Structure:**

text  
`# Sinerine: Dudael Brand Identity`

`## Brand Essence (forensic theophany, Light/Dark duality)`  
`## Color Palette`  
  `- Light Theme (Amber scales)`  
  `- Dark Theme (Violet/Indigo scales)`  
  `- Threshold/Secret (gradient blends)`  
`## Typography (Cinzel, Inter, JetBrains Mono)`  
`## Design Tokens (43 tokens: color, type, spacing, shadow)`  
`## Voice & Tone`  
`## Usage Guidelines (dos/don'ts)`

**Size target:** 5–8 pages  
**Owner:** You \+ collaborators (brand/UX)  
**Update cadence:** Stable (rare updates)

---

## **6\. Dudael\_Content\_Pipeline.md (Content & Production domain)**

**Evolves from:**

* Sprint Plan checklist structure\[[docs.google](https://docs.google.com/document/d/1qc17KfE5ReUYlBOg7HX07qOLzh8ewvGe-7g73McctgA/edit?usp=drivesdk)\]​  
* DB seed patterns from Proto Index\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​

**Structure:**

text  
`# Dudael Content Pipeline`

`## Content Lifecycle (idea → lore → data → implementation → test)`  
`## Roles (designer, writer, coder, QA)`  
`## Templates`  
  `- New Bound Checklist`  
  `- New Level Checklist`  
  `- New Card Batch Checklist`  
`## Quality Gates (lore review, balance pass, playtest)`  
`## Tools (Supabase views, seed scripts, dashboards)`

**Size target:** 6–10 pages  
**Owner:** You (production/ops)  
**Update cadence:** Per sprint retrospective

---

## **7\. Dudael\_Refactor\_Log.md (Engine domain – living doc)**

**Extracts from:**

* Refactor Guide chat log (PhasePacket fixes, Redux centralization)\[[ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/dd1d1b6e-4096-4d1a-bd17-035badbb9c43/pasted-text.txt)\]​  
* Gate Refactor Brief status section\[[docs.google](https://docs.google.com/document/d/1GzvJ1JZKR8YZSG11NU-OVdhCYh5K0WWS/edit?usp=drivesdk&ouid=100937465801829159993&rtpof=true&sd=true)\]​

**Structure:**

text  
`# Dudael Refactor Log`

`## Completed`  
  `- [2026-03-02] State refactor: centralized requestTransition`  
  `- [2026-03-01] Seven-phase loop tagged v0.1.0-loop`  
    
`## In Progress`  
  `- [ ] PhasePacket normalization (no spread, minimal handoff)`  
  `- [ ] Run Repo/Redux split`

`## Backlog`  
  `- [ ] Component breakup (TitleShell, SelectShell)`  
  `- [ ] CSS conversion (inline → Tailwind)`  
  `- [ ] React Router integration`

**Size target:** Grows over time (append-only log)  
**Owner:** You (dev/refactor tracking)  
**Update cadence:** After each refactor session

---

## **Supporting Files (Keep Separate)**

**DB Seeds & Scripts:**

* `seed_brand_identity.sql` – from Proto Index\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​  
* `seed_litegame_content.sql` – levels, cards, skills\[[docs.google](https://docs.google.com/document/d/1b7qwl2GvELBKhxgTkIwxuQdckWWoELU3PziGxMmNrSs/edit?usp=drivesdk)\]​  
* `seed_bound_configs.sql` – Vessel stats, Guide data

**Diagrams & Assets:**

* `architecture_diagram.png` – PhaseWall vs Run Repo visual\[[docs.google](https://docs.google.com/document/d/1GzvJ1JZKR8YZSG11NU-OVdhCYh5K0WWS/edit?usp=drivesdk&ouid=100937465801829159993&rtpof=true&sd=true)\]​  
* `lore_map.png` – Dudael zones, sectors  
* `phase_flow.png` – Seven-phase loop with data contracts

**Archive (Low-Frequency Access):**

* Original chat logs (Game Dev Session, Refactor Guide) – move to `archive/` folder for reference but not active use

---

## **Step-by-Step Consolidation Process**

## **Phase 1: Extract & Merge (2–3 hours)**

1. **Create new blank docs** for the 7 core files above  
2. **Copy relevant sections** from existing files into appropriate new docs  
3. **Write transitional headers** where content from multiple sources merges  
4. **Add TOCs** to each doc for navigability

## **Phase 2: Cross-Reference & Dedup (1–2 hours)**

5. **Search for duplicate content** (e.g., Bound stats appear in 3 places → keep one canonical version in Bound\_Spec, reference elsewhere)  
6. **Add internal links** between docs (e.g., "See Systems\_Spec for Door requirements")  
7. **Flag contradictions** for resolution (e.g., different HP values for Seraph)

## **Phase 3: Validate & Publish (1 hour)**

8. **Quick read-through** of each doc for coherence  
9. **Move originals to archive/** folder (don't delete – keep for reference)  
10. **Update workspace index** (create a `README.md` that lists the 7 core docs \+ what they cover)

---

## **Workspace Index (New Root File)**

Create `Dudael_Workspace_Index.md`:

text  
`# Dudael Workspace Index`

`**Last updated:** 2026-03-05`

`## Core Documentation (Read First)`  
`1. **[Dudael_Architecture.md](./Dudael_Architecture.md)** – Tech stack, PhaseWall, Redux, refactor roadmap`  
`2. **[Dudael_Lore_Bible.md](./Dudael_Lore_Bible.md)** – World, theology, Bound, locations, glossary`  
`3. **[Dudael_Bound_Spec.md](./Dudael_Bound_Spec.md)** – Vessel stats, Guides, Descent Modes`  
`4. **[Dudael_Systems_Spec.md](./Dudael_Systems_Spec.md)** – Loop, economy, Draft, Door, Drop`  
`5. **[Sinerine_Brand_Guide.md](./Sinerine_Brand_Guide.md)** – Palette, typography, tokens, voice`  
`6. **[Dudael_Content_Pipeline.md](./Dudael_Content_Pipeline.md)** – Lifecycle, templates, QA`  
`7. **[Dudael_Refactor_Log.md](./Dudael_Refactor_Log.md)** – Dev history, in-progress, backlog`

`## Supporting Files`  
``- `seeds/` – SQL scripts for DB initialization``  
``- `diagrams/` – Architecture & lore visuals``  
``- `archive/` – Original chat logs & deprecated docs``

`## Quick Links by Domain`  
`- **Want to understand the engine?** → Architecture.md`  
`- **Want to write lore?** → Lore_Bible.md + Bound_Spec.md`  
`- **Want to add content?** → Content_Pipeline.md + Systems_Spec.md`  
`- **Want brand/UI guidelines?** → Sinerine_Brand_Guide.md`  
`- **Want to see what's being refactored?** → Refactor_Log.md`

---

## **Decision Points**

Before starting, confirm:

1. **Do you want to preserve the raw chat logs?**  
   * Yes → move to `archive/`, keep for "how we got here" context  
   * No → delete after extracting all useful content  
2. **Single mega-doc vs modular docs?**  
   * Proposal above uses 7 modular docs (easier to navigate, clearer ownership)  
   * Alternative: One giant "Dudael\_Master\_Doc.md" with all domains (harder to maintain, but single source)  
3. **Where do diagrams live?**  
   * Separate `diagrams/` folder \+ embed images in markdown (`![PhaseWall](diagrams/phasewall.png)`)  
   * OR inline in docs as ASCII art / Mermaid diagrams  
4. **Update cadence for merged docs?**  
   * After every refactor? (high effort)  
   * Weekly review? (balanced)  
   * Only when onboarding someone new? (low effort, risk of drift)

**My recommendation:** Start with the 7-doc modular approach, move originals to archive, create the workspace index, and commit to updating Architecture \+ Refactor\_Log after each dev session (those change most). The others (Lore, Brand, Systems) can be stable for weeks.

Want me to draft the actual markdown for one of these consolidated docs (say, Architecture or Bound\_Spec) as a template you can follow for the rest?

