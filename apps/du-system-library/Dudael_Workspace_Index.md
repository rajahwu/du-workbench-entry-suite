# DUDAEL SYSTEM LIBRARY ARCHIVE
## Workspace Index & Navigation

**Last Updated:** March 5, 2026  
**Version:** 1.0.0  
**Status:** Archive Complete — All Tiers Generated

---

## 📚 Core Documentation (Read First)

### 1. [Dudael_Architecture.md](./docs/Dudael_Architecture.md)
**Domain:** Engine & Workbench  
**Purpose:** Technical foundation, PhaseWall contracts, Redux patterns, refactor roadmap  
**Key Topics:**
- Tech stack (TypeScript, React, Redux, Supabase)
- Seven-phase loop architecture
- Three-layer system (Meta Guides / Bound / Descent Mode)
- PhaseWall vs Run Repo separation
- State management patterns

**When to read:** Understanding engine structure, planning refactors, onboarding developers

---

### 2. [Dudael_Lore_Bible.md](./docs/Dudael_Lore_Bible.md)
**Domain:** World & Lore  
**Purpose:** Complete narrative foundation, theology, world-building  
**Key Topics:**
- Echo & Voids sector, Quarantine Zones
- Oiketrion theology (Jude 1:6, proper habitation)
- The Five Bound (Seraph, Shadow, Exile, Penitent, Rebel)
- Locations (Threshold, Crossroads, Sanctum, Abyss of Dudael)
- Watchers, Nephilim, fallen angels

**When to read:** Writing narrative content, designing characters, world consistency checks

---

### 3. [Dudael_Bound_Spec.md](./docs/Dudael_Bound_Spec.md)
**Domain:** Entities & Classes  
**Purpose:** Vessel specifications, stats, theology-to-mechanics translation  
**Key Topics:**
- Design philosophy (theology → gameplay)
- Five Bound profiles (stats, playstyle, unlock conditions)
- Guides (Surveyor, Smuggler roles and barks)
- Descent Modes (Steward vs Solo effects)
- Balance notes and tuning

**When to read:** Character balancing, adding new Vessels, understanding class identity

---

### 4. [Dudael_Systems_Spec.md](./docs/Dudael_Systems_Spec.md)
**Domain:** Game Loop & Systems  
**Purpose:** Core mechanics, economy, progression  
**Key Topics:**
- Seven-phase loop (Title → Select → Staging → Draft → Level → Door → Drop)
- Light/Dark/Secret parity economy
- Door requirements by depth
- Draft system (Keeper offers, card pools)
- Drop rewards and meta-progression
- Hourglass architecture (cartridge model)

**When to read:** Implementing game systems, balancing economy, designing levels

---

### 5. [Sinerine_Brand_Guide.md](./docs/Sinerine_Brand_Guide.md)
**Domain:** Brand & Aesthetic  
**Purpose:** Visual identity, design system, voice & tone  
**Key Topics:**
- Brand essence (forensic theophany, Light/Dark duality)
- Color palette (43 tokens: Light, Dark, Threshold scales)
- Typography (Cinzel, Inter, JetBrains Mono)
- Design tokens (spacing, shadows, borders)
- Voice & tone guidelines
- Usage dos/don'ts

**When to read:** UI design, marketing materials, maintaining visual consistency

---

### 6. [Dudael_Content_Pipeline.md](./docs/Dudael_Content_Pipeline.md)
**Domain:** Content & Production  
**Purpose:** Workflow, templates, quality gates  
**Key Topics:**
- Content lifecycle (idea → lore → data → implementation → test)
- Role responsibilities (designer, writer, coder, QA)
- Templates (New Bound, New Level, New Card Batch)
- Quality gates and review process
- Tools (Supabase views, seed scripts, dashboards)

**When to read:** Planning sprints, adding content, QA processes

---

### 7. [Dudael_Refactor_Log.md](./docs/Dudael_Refactor_Log.md)
**Domain:** Engine (Living Document)  
**Purpose:** Development history, in-progress work, backlog  
**Key Topics:**
- Completed refactors (with dates and outcomes)
- In-progress work (current focus areas)
- Backlog (planned improvements)
- Technical debt tracking

**When to read:** Planning dev sessions, understanding codebase evolution, avoiding regressions

---

## 🎨 Visual Assets Library

### Identity & Branding
```
assets/identity/
├── hero_banner.png          # 1920×600 archive hero header
├── logo_icon.png            # 256×256 hourglass/sacred geometry logo
└── domain_icons.png         # 6-pack: Lore, Bound, Systems, Brand, Engine, Pipeline
```

### Navigation Banners
```
assets/navigation/
├── banner_architecture.png  # Layered stack + gear
├── banner_lore.png         # Spiral galaxy + wing + Jude 1:6
├── banner_bound.png        # Five Bound sigils in row
├── banner_systems.png      # Hourglass + balance scales
├── banner_brand.png        # Tri-polar palette (Light/Dark/Threshold)
├── banner_pipeline.png     # Conveyor belt workflow
└── banner_refactor.png     # Git commit graph
```

### Character Sigils
```
assets/characters/
├── sigil_seraph.png        # Six-winged radiant (Light-aligned)
├── sigil_shadow.png        # Cloaked mystery (Dark-aligned)
├── sigil_exile.png         # Broken chain/halo (Threshold)
├── sigil_penitent.png      # Kneeling prayer (Light-seeking)
└── sigil_rebel.png         # Raised fist/inverted wing (Dark-defiant)
```

### Technical Diagrams
```
assets/diagrams/
├── phase_flow.png                  # Seven-phase loop with PhaseWall boundaries
├── arch_three_layer.png            # Meta Guides → Bound → Descent Mode
├── arch_phasewall_runrepo.png      # Ephemeral vs persistent data comparison
├── arch_redux_tree.png             # Complete state tree (game/meta/ui)
└── brand_tokens_showcase.png       # 43 tokens: color/type/spacing/shadow
```

### World Locations
```
assets/locations/
├── location_threshold.png   # Liminal boundary zone
├── location_crossroads.png  # Three diverging doors (Light/Dark/Secret)
├── location_sanctum.png     # Clinical sacred space, intense Light
└── location_abyss.png       # Deep containment prison, chains, Dark depths
```

### Social Sharing
```
assets/social/
├── og_home.png             # Archive homepage card (1200×630)
├── og_lore.png            # Lore Bible card with angel silhouette
└── og_architecture.png     # Architecture card with diagram snippet
```

### UI Elements
```
assets/ui/
├── status_badges.png       # Complete / In Progress / Backlog
├── phase_icons_mini.png    # 7 icons (32×32): crown, cursor, table, card, room, doors, hourglass
└── alignment_indicators.png # 3 icons (48×48): Light amber, Secret gradient, Dark violet
```

### Reference Mockups
```
assets/mockups/
└── site_layout_mockup.png  # Full webpage wireframe (1920×1080)
```

---

## 🗂️ File Structure

```
dudael-system-library/
│
├── README.md                           # Project overview & quick start
├── Dudael_Workspace_Index.md          # This file — master navigation
│
├── docs/                               # Core documentation files
│   ├── Dudael_Architecture.md
│   ├── Dudael_Lore_Bible.md
│   ├── Dudael_Bound_Spec.md
│   ├── Dudael_Systems_Spec.md
│   ├── Sinerine_Brand_Guide.md
│   ├── Dudael_Content_Pipeline.md
│   └── Dudael_Refactor_Log.md
│
├── assets/                             # All visual assets (31 files)
│   ├── identity/
│   ├── navigation/
│   ├── characters/
│   ├── diagrams/
│   ├── locations/
│   ├── social/
│   ├── ui/
│   └── mockups/
│
├── archive/                            # Original source materials
│   ├── pasted-text-game-dev.txt
│   ├── pasted-text-refactor.txt
│   ├── DUDAEL_Gate_Refactor_Brief.docx
│   ├── FALLEN_ANGELS_Sprint_Plan.md
│   ├── Oiketrion.md
│   ├── FALLEN_ANGELS_Proto_Index.md
│   ├── Core_Vessel_shape.md
│   └── Dudael_Lore_Compilation.docx
│
├── seeds/                              # Database initialization scripts
│   ├── seed_brand_identity.sql
│   ├── seed_litegame_content.sql
│   └── seed_bound_configs.sql
│
└── tools/                              # Utility scripts & dashboards
    ├── schema_drift_check.js
    └── content_dashboard_views.sql
```

---

## 🧭 Quick Navigation by Need

### "I want to understand..."
| What | Read This | See Also |
|------|-----------|----------|
| **How the engine works** | Architecture.md | Refactor_Log.md, phase_flow diagram |
| **The world and story** | Lore_Bible.md | location concept boards |
| **Character classes** | Bound_Spec.md | character sigils |
| **Game mechanics** | Systems_Spec.md | phase_flow diagram |
| **Visual identity** | Brand_Guide.md | brand_tokens_showcase.png |
| **How to add content** | Content_Pipeline.md | Systems_Spec.md |
| **Current dev status** | Refactor_Log.md | Architecture.md |

### "I want to create..."
| What | Start Here | Tools Needed |
|------|------------|--------------|
| **New Vessel** | Bound_Spec.md → Content_Pipeline.md | Bound template, sigil design |
| **New Level** | Systems_Spec.md → Content_Pipeline.md | Level template, seed scripts |
| **New Card** | Systems_Spec.md → Content_Pipeline.md | Card template, parity rules |
| **UI Component** | Brand_Guide.md | Design tokens, UI element library |
| **Lore Entry** | Lore_Bible.md | Glossary, theology framework |
| **Architecture Change** | Architecture.md → Refactor_Log.md | PhaseWall contracts, Redux patterns |

### "I need to find..."
| What | Location |
|------|----------|
| **Color hex codes** | Brand_Guide.md + brand_tokens_showcase.png |
| **Phase data contracts** | Architecture.md + phase_flow.png |
| **Vessel stats** | Bound_Spec.md |
| **Door requirements** | Systems_Spec.md |
| **Lore glossary** | Lore_Bible.md |
| **Refactor status** | Refactor_Log.md |

---

## 🎯 Domain Ownership

| Domain | Primary Doc | Owner Role | Update Frequency |
|--------|-------------|------------|------------------|
| **World & Lore** | Lore_Bible.md | Narrative Designer | As lore expands |
| **Entities & Classes** | Bound_Spec.md | Game Designer | Per balance pass |
| **Game Loop & Systems** | Systems_Spec.md | Systems Designer | Per system change |
| **Brand & Aesthetic** | Brand_Guide.md | Creative Director | Rare (stable) |
| **Engine & Architecture** | Architecture.md | Lead Developer | After major refactors |
| **Content & Production** | Content_Pipeline.md | Producer | Per sprint retrospective |
| **Refactor Log** | Refactor_Log.md | Lead Developer | After each dev session |

---

## 📋 Version History

### v1.0.0 (March 5, 2026)
- ✅ Complete visual asset library generated (31 assets across 3 tiers)
- ✅ Workspace structure defined
- ✅ Navigation index created
- ✅ Documentation framework established
- 🔄 Core docs consolidation in progress (from 8 source files → 7 clean docs)

### Planned v1.1.0
- [ ] Write complete Architecture.md (extracted from Gate Refactor Brief + chat logs)
- [ ] Write complete Lore_Bible.md (consolidated from Oiketrion + Lore Compilation)
- [ ] Write complete Bound_Spec.md (from Core Vessel + Proto Index stats)
- [ ] Write remaining 4 core docs
- [ ] Build web archive site using assets

---

## 🚀 Getting Started

### For New Collaborators
1. **Read this index** to understand the structure
2. **Start with Architecture.md** for technical overview
3. **Read Lore_Bible.md** for narrative context
4. **Check Refactor_Log.md** for current dev state
5. **Review Brand_Guide.md** before creating visual content

### For Returning Contributors
1. **Check Refactor_Log.md** for latest changes
2. **Review relevant domain doc** for your work area
3. **Update docs** as you make changes
4. **Log refactors** in Refactor_Log.md

### For Portfolio Reviewers
1. **Start with README.md** (project overview)
2. **View assets/** folder for visual showcase
3. **Read Architecture.md** for technical depth
4. **Browse Lore_Bible.md** for creative depth
5. **Check Brand_Guide.md** for design systems work

---

## 🔗 External Resources

**Project Repository:** [GitHub link placeholder]  
**Live Demo:** [Demo link placeholder]  
**Design System:** [Storybook/Figma link placeholder]  
**Database:** [Supabase project link placeholder]

---

## 📞 Contact & Contribution

**Maintainer:** Vincent Radford  
**Location:** Philadelphia, PA  
**Last Archive Update:** March 5, 2026, 2:15 AM EST

**Contributing:**
- Follow domain ownership guidelines
- Update relevant docs when making changes
- Log all refactors in Refactor_Log.md
- Maintain visual consistency per Brand_Guide.md

---

**End of Index** • [Back to Top](#dudael-system-library-archive)
