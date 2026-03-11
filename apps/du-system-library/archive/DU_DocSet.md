<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Before that how can we go abou organizing and combine the docs in the workspace into a clean set

Based on your current workspace files, here's a practical method to organize and combine them into a clean, maintable set:[^1][^2][^3][^4][^5][^6][^7]

***

## Audit: What You Have Now

| Current File | Primary Domain(s) | Status | Action Needed |
| :-- | :-- | :-- | :-- |
| **pasted-text.txt (Game Dev Session)** | Loop, Architecture, Lore | Raw chat log, 12KB | Extract key decisions → merge into specs |
| **pasted-text.txt (Refactor Guide)** | Engine, PhaseWall, Redux | Raw chat log, 74KB | Extract architecture patterns → merge into arch doc |
| **DUDAEL_Gate_Refactor_Brief** | Engine, Architecture, Gate | Structured brief, 10KB | **Keep as canonical arch doc**, update status |
| **FALLEN ANGELS Sprint Plan** | Production, Systems | Task checklist, complete | Archive or evolve into "Content Pipeline" doc |
| **Oiketrion** | Lore, Theology, World | Dense lore dump, 94KB | **Keep as lore bible**, add TOC/index |
| **FALLEN ANGELS Proto Index** | Brand, Identity, Systems | Seed SQL + brand spec, 66KB | Split: Brand Guide + DB Seed Script |
| **Core Vessel shape** | Entities, Classes | Vessel theology notes, 3KB | Merge into "Bound Spec" doc |
| **Dudael_Lore_Compilation** | Lore, World | Lore summary, 11KB | Merge with Oiketrion or keep as "Lore Quick Ref" |


***

## Proposed Clean Set (7 Core Docs + Supporting Files)

### 1. **Dudael_Architecture.md** (Engine \& Workbench domain)

**Combines:**

- DUDAEL_Gate_Refactor_Brief[^2] (keep as base)
- Architecture sections from Refactor Guide[^7] (PhaseWall, Run Repo, Redux patterns)
- Tech stack summary from Proto Index[^5]

**Structure:**

```markdown
# Dudael Architecture

## Tech Stack
## Seven-Phase Loop
## Three-Layer Architecture (Meta Guides / Bound / Mode)
## PhaseWall Contract System
## Run Repo vs PhasePacket
## Redux State Management
## Refactor Status & Roadmap
```

**Size target:** 8–12 pages
**Owner:** You (engine decisions)
**Update cadence:** After major refactors

***

### 2. **Dudael_Lore_Bible.md** (World \& Lore domain)

**Combines:**

- Oiketrion[^4] (theology, fallen angels, Watchers)
- Dudael_Lore_Compilation[^6] (zones, Drop, containment)
- Game Dev Session lore notes[^1] (tarot-guided room design, hourglass symbolism)

**Structure:**

```markdown
# Dudael Lore Bible

## World Overview (Echo & Voids, Quarantine Zone)
## Theology (Oiketrion, Habitation, Jude 1:6)
## The Bound (Seraph, Shadow, Exile, Penitent, Rebel)
## Locations (Threshold, Crossroads, Sanctum, Abyss)
## Guides & Keepers (Surveyor, Smuggler)
## Key Terms Glossary
```

**Size target:** 20–30 pages (it's dense, that's fine)
**Owner:** You + collaborators (narrative)
**Update cadence:** As lore expands

***

### 3. **Dudael_Bound_Spec.md** (Entities \& Classes domain)

**Combines:**

- Core Vessel shape[^8] (theology per Bound)
- Bound stats from Gate Refactor[^2] (HP, Light/Dark, hand size)
- Descent Mode notes from Proto Index[^5] (Steward vs Solo)

**Structure:**

```markdown
# The Bound: Vessel Specifications

## Design Philosophy (theology → mechanics)
## The Five Bound
  ### Seraph (stats, theology, playstyle, unlock)
  ### Shadow
  ### Exile
  ### Penitent
  ### Rebel
## Guides (Surveyor, Smuggler)
## Descent Modes (Steward, Solo)
## Balance Notes
```

**Size target:** 8–10 pages
**Owner:** You (design/balance)
**Update cadence:** Per balance pass

***

### 4. **Dudael_Systems_Spec.md** (Game Loop \& Systems domain)

**Combines:**

- Seven-phase flow from Gate Refactor[^2]
- Light/Dark/Secret mechanics from Sprint Plan[^3]
- Parity/Door/Draft details from Proto Index[^5]
- Hourglass architecture from Game Dev Session[^1]

**Structure:**

```markdown
# Dudael Systems Specification

## Core Loop (Title → Select → Staging → Draft → Level → Door → Drop)
## Light/Dark/Secret Economy
  - Parity Snapshots
  - Door Requirements by Depth
  - Alignment Tracking
## Draft System (Keeper offers, card pools, insight)
## Level Container (mini-game abstraction)
## Drop & Meta-Progression (Memory Fragments, loop counter)
## Hourglass Architecture (cartridge model)
```

**Size target:** 10–15 pages
**Owner:** You (systems design)
**Update cadence:** Per system change

***

### 5. **Sinerine_Brand_Guide.md** (Brand \& Aesthetic domain)

**Extracts from:**

- Proto Index brand section[^5] (color tokens, typography, Sinerine duality)
- Gate Refactor brand identity section[^2]

**Structure:**

```markdown
# Sinerine: Dudael Brand Identity

## Brand Essence (forensic theophany, Light/Dark duality)
## Color Palette
  - Light Theme (Amber scales)
  - Dark Theme (Violet/Indigo scales)
  - Threshold/Secret (gradient blends)
## Typography (Cinzel, Inter, JetBrains Mono)
## Design Tokens (43 tokens: color, type, spacing, shadow)
## Voice & Tone
## Usage Guidelines (dos/don'ts)
```

**Size target:** 5–8 pages
**Owner:** You + collaborators (brand/UX)
**Update cadence:** Stable (rare updates)

***

### 6. **Dudael_Content_Pipeline.md** (Content \& Production domain)

**Evolves from:**

- Sprint Plan checklist structure[^3]
- DB seed patterns from Proto Index[^5]

**Structure:**

```markdown
# Dudael Content Pipeline

## Content Lifecycle (idea → lore → data → implementation → test)
## Roles (designer, writer, coder, QA)
## Templates
  - New Bound Checklist
  - New Level Checklist
  - New Card Batch Checklist
## Quality Gates (lore review, balance pass, playtest)
## Tools (Supabase views, seed scripts, dashboards)
```

**Size target:** 6–10 pages
**Owner:** You (production/ops)
**Update cadence:** Per sprint retrospective

***

### 7. **Dudael_Refactor_Log.md** (Engine domain – living doc)

**Extracts from:**

- Refactor Guide chat log[^7] (PhasePacket fixes, Redux centralization)
- Gate Refactor Brief status section[^2]

**Structure:**

```markdown
# Dudael Refactor Log

## Completed
  - [2026-03-02] State refactor: centralized requestTransition
  - [2026-03-01] Seven-phase loop tagged v0.1.0-loop
  
## In Progress
  - [ ] PhasePacket normalization (no spread, minimal handoff)
  - [ ] Run Repo/Redux split

## Backlog
  - [ ] Component breakup (TitleShell, SelectShell)
  - [ ] CSS conversion (inline → Tailwind)
  - [ ] React Router integration
```

**Size target:** Grows over time (append-only log)
**Owner:** You (dev/refactor tracking)
**Update cadence:** After each refactor session

***

## Supporting Files (Keep Separate)

**DB Seeds \& Scripts:**

- `seed_brand_identity.sql` – from Proto Index[^5]
- `seed_litegame_content.sql` – levels, cards, skills[^5]
- `seed_bound_configs.sql` – Vessel stats, Guide data

**Diagrams \& Assets:**

- `architecture_diagram.png` – PhaseWall vs Run Repo visual[^2]
- `lore_map.png` – Dudael zones, sectors
- `phase_flow.png` – Seven-phase loop with data contracts

**Archive (Low-Frequency Access):**

- Original chat logs (Game Dev Session, Refactor Guide) – move to `archive/` folder for reference but not active use

***

## Step-by-Step Consolidation Process

### Phase 1: Extract \& Merge (2–3 hours)

1. **Create new blank docs** for the 7 core files above
2. **Copy relevant sections** from existing files into appropriate new docs
3. **Write transitional headers** where content from multiple sources merges
4. **Add TOCs** to each doc for navigability

### Phase 2: Cross-Reference \& Dedup (1–2 hours)

5. **Search for duplicate content** (e.g., Bound stats appear in 3 places → keep one canonical version in Bound_Spec, reference elsewhere)
6. **Add internal links** between docs (e.g., "See Systems_Spec for Door requirements")
7. **Flag contradictions** for resolution (e.g., different HP values for Seraph)

### Phase 3: Validate \& Publish (1 hour)

8. **Quick read-through** of each doc for coherence
9. **Move originals to archive/** folder (don't delete – keep for reference)
10. **Update workspace index** (create a `README.md` that lists the 7 core docs + what they cover)

***

## Workspace Index (New Root File)

Create `Dudael_Workspace_Index.md`:

```markdown
# Dudael Workspace Index

**Last updated:** 2026-03-05

## Core Documentation (Read First)
1. **[Dudael_Architecture.md](./Dudael_Architecture.md)** – Tech stack, PhaseWall, Redux, refactor roadmap
2. **[Dudael_Lore_Bible.md](./Dudael_Lore_Bible.md)** – World, theology, Bound, locations, glossary
3. **[Dudael_Bound_Spec.md](./Dudael_Bound_Spec.md)** – Vessel stats, Guides, Descent Modes
4. **[Dudael_Systems_Spec.md](./Dudael_Systems_Spec.md)** – Loop, economy, Draft, Door, Drop
5. **[Sinerine_Brand_Guide.md](./Sinerine_Brand_Guide.md)** – Palette, typography, tokens, voice
6. **[Dudael_Content_Pipeline.md](./Dudael_Content_Pipeline.md)** – Lifecycle, templates, QA
7. **[Dudael_Refactor_Log.md](./Dudael_Refactor_Log.md)** – Dev history, in-progress, backlog

## Supporting Files
- `seeds/` – SQL scripts for DB initialization
- `diagrams/` – Architecture & lore visuals
- `archive/` – Original chat logs & deprecated docs

## Quick Links by Domain
- **Want to understand the engine?** → Architecture.md
- **Want to write lore?** → Lore_Bible.md + Bound_Spec.md
- **Want to add content?** → Content_Pipeline.md + Systems_Spec.md
- **Want brand/UI guidelines?** → Sinerine_Brand_Guide.md
- **Want to see what's being refactored?** → Refactor_Log.md
```


***

## Decision Points

Before starting, confirm:

1. **Do you want to preserve the raw chat logs?**
    - Yes → move to `archive/`, keep for "how we got here" context
    - No → delete after extracting all useful content
2. **Single mega-doc vs modular docs?**
    - Proposal above uses 7 modular docs (easier to navigate, clearer ownership)
    - Alternative: One giant "Dudael_Master_Doc.md" with all domains (harder to maintain, but single source)
3. **Where do diagrams live?**
    - Separate `diagrams/` folder + embed images in markdown (`![PhaseWall](diagrams/phasewall.png)`)
    - OR inline in docs as ASCII art / Mermaid diagrams
4. **Update cadence for merged docs?**
    - After every refactor? (high effort)
    - Weekly review? (balanced)
    - Only when onboarding someone new? (low effort, risk of drift)

**My recommendation:** Start with the 7-doc modular approach, move originals to archive, create the workspace index, and commit to updating Architecture + Refactor_Log after each dev session (those change most). The others (Lore, Brand, Systems) can be stable for weeks.

Want me to draft the actual markdown for one of these consolidated docs (say, Architecture or Bound_Spec) as a template you can follow for the rest?

<div align="center">⁂</div>

[^1]: pasted-text.txt

[^2]: DUDAEL_Gate_Refactor_Brief_for_Chat.docx

[^3]: FALLEN-ANGELS-GAME-SPRINT-PLAN-TASK-CHECKLIST.md

[^4]: Oiketrion

[^5]: FALLEN-ANGELS-LITE-GAME-Proto-Index.md

[^6]: Dudael_Lore_Compilation.docx

[^7]: pasted-text.txt

[^8]: Core Vessel shape

