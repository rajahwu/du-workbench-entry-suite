# DUDAEL: System Library Archive

> **A complete documentation archive for a narrative roguelike about fallen angels, forensic theology, and the cost of abandoning your proper habitation.**

---

## 🎮 Project Overview

**Dudael** is a seven-phase roguelike where death is designed, Light and Dark parity gates progression, and every run deepens the lore. Set in a Quarantine Zone that preserves fallen angels as forensic evidence rather than punishment, players navigate theological choices through card drafting, door selection, and meta-progression.

This archive represents the complete design, technical, and narrative documentation for the project, organized into six core domains and supported by 31 custom visual assets.

---

## 📚 What's Inside

### **7 Core Documentation Files**
Comprehensive specifications covering every aspect of the game:

1. **Architecture** — Engine design, PhaseWall contracts, Redux patterns
2. **Lore Bible** — World theology, fallen angels, oiketrion framework
3. **Bound Specification** — The Five Vessels (Seraph, Shadow, Exile, Penitent, Rebel)
4. **Systems Specification** — Game loop, Light/Dark economy, progression
5. **Brand Guide** — Sinerine design system (43 tokens, forensic theophany aesthetic)
6. **Content Pipeline** — Production workflow, templates, quality gates
7. **Refactor Log** — Development history, technical debt tracking

### **31 Visual Assets**
Custom-generated artwork organized into:
- **Identity & Branding** (hero banner, logo, domain icons)
- **Navigation** (7 documentation banners)
- **Characters** (5 Bound sigils with sacred geometry)
- **Technical Diagrams** (phase flow, architecture, Redux state tree)
- **World Locations** (Threshold, Crossroads, Sanctum, Abyss)
- **Social Sharing** (Open Graph cards)
- **UI Elements** (badges, phase icons, alignment indicators)

### **Organized Workspace**
Clean file structure with:
- `/docs` — All core documentation
- `/assets` — Complete visual library
- `/archive` — Original source materials
- `/seeds` — Database initialization scripts
- `/tools` — Utility scripts and dashboards

---

## 🚀 Quick Start

### For Developers
```bash
# Navigate to documentation
cd docs/

# Start with technical foundation
open Dudael_Architecture.md

# Check current development status
open Dudael_Refactor_Log.md
```

**Key concepts:**
- **PhaseWall** — Minimal data handoff between phases (no spreads, no drift)
- **Run Repo** — Persistent meta-progression store separate from ephemeral packets
- **Three Layers** — Meta Guides → Bound → Descent Mode (Steward vs Solo)

### For Narrative Designers
```bash
# World and theology
open docs/Dudael_Lore_Bible.md

# Character classes and theology-to-mechanics
open docs/Dudael_Bound_Spec.md
```

**Key concepts:**
- **Oiketrion** — Angels abandoned their proper habitation (Jude 1:6)
- **The Bound** — Five archetypes processing that theological weight
- **Forensic Theophany** — Clinical documentation of the sacred

### For Artists & Designers
```bash
# Visual identity
open docs/Sinerine_Brand_Guide.md

# View complete asset library
open assets/
```

**Key concepts:**
- **Sinerine Palette** — Light (amber), Dark (violet), Threshold (gray blend)
- **43 Design Tokens** — Color, typography, spacing, shadows
- **Forensic Aesthetic** — Sacred mystery meets clinical precision

### For Portfolio Reviewers
1. Browse `/assets` for visual showcase
2. Read `Dudael_Architecture.md` for technical depth
3. Read `Dudael_Lore_Bible.md` for creative depth
4. View `Sinerine_Brand_Guide.md` for design systems work

---

## 🎯 Core Domains

| Domain | Focus | Primary Doc |
|--------|-------|-------------|
| **World & Lore** | Theology, narrative, locations | Lore_Bible.md |
| **Entities & Classes** | Vessels, Guides, balance | Bound_Spec.md |
| **Game Loop & Systems** | Mechanics, economy, progression | Systems_Spec.md |
| **Brand & Aesthetic** | Visual identity, design tokens | Brand_Guide.md |
| **Engine & Architecture** | Tech stack, state management | Architecture.md |
| **Content & Production** | Workflow, templates, QA | Content_Pipeline.md |

---

## 🎨 Visual Identity

### Sinerine Design System
**Tri-polar palette** representing Light, Dark, and Threshold states:

- **Light Theme** — Amber scales (#FFA500 to #FFD700)
- **Dark Theme** — Violet/Indigo scales (#4B0082 to #8A2BE2)
- **Threshold** — Gray blends (#808080) with gradients

**Typography:**
- **Cinzel** (serif) — Headings, lore, sacred text
- **Inter** (sans-serif) — Body text, UI
- **JetBrains Mono** (monospace) — Code, stats

**Aesthetic:** Forensic theophany — clinical precision meets sacred mystery

---

## 🔄 Seven-Phase Loop

```
Title → Select → Staging → Draft → Level → Door → Drop
  ↑                                                  ↓
  └──────────────── Meta-Progression ───────────────┘
```

**Phase responsibilities:**
1. **Title** — Identity selection (vessel, sigil)
2. **Select** — Gate configuration (guide, mode)
3. **Staging** — Meta-progression hub (previous runs, unlocks)
4. **Draft** — Card acquisition via Keeper offers
5. **Level** — Gameplay cartridge (hourglass architecture)
6. **Door** — Parity-gated choice (Light/Dark/Secret)
7. **Drop** — Designed death, Memory Fragments, loop counter increment

---

## 🏛️ The Five Bound

| Vessel | Alignment | Theology | Playstyle |
|--------|-----------|----------|-----------|
| **Seraph** | Light | Radiant obedience | High Light bias, defensive |
| **Shadow** | Dark | Concealment and mystery | High Dark bias, evasive |
| **Exile** | Threshold | Broken habitation | Balanced, adaptive |
| **Penitent** | Light | Seeking redemption | Light-seeking, contrition |
| **Rebel** | Dark | Active defiance | Dark-aggressive, rebellion |

Each Bound processes the theological weight of abandoning their proper habitation differently, translating into distinct mechanical identity.

---

## 🛠️ Tech Stack

**Frontend:**
- React (functional components, hooks)
- Redux (centralized state management)
- TypeScript (strict typing)

**Backend:**
- Supabase (PostgreSQL, auth, real-time)

**Architecture Patterns:**
- PhaseWall (minimal packet handoff)
- Run Repo (persistent meta store)
- Three-layer system (Meta Guides / Bound / Mode)
- Hourglass cartridge model (Level phase)

---

## 📂 Repository Structure

```
dudael-system-library/
├── README.md                    # This file
├── Dudael_Workspace_Index.md    # Master navigation & deep links
│
├── docs/                        # Core documentation (7 files)
├── assets/                      # Visual library (31 assets)
├── archive/                     # Original source materials
├── seeds/                       # Database initialization
└── tools/                       # Utility scripts
```

**Total documentation:** ~150 pages across 7 domains  
**Total assets:** 31 custom-generated visuals  
**Asset types:** Logos, banners, sigils, diagrams, locations, UI elements

---

## 🎓 Key Concepts

### PhaseWall Contract System
Data boundaries between phases with strict input/output rules:
- No object spreads (`...prev` banned)
- Minimal handoff (only what next phase needs)
- Normalization at boundaries
- One source of truth (Run Repo for persistence)

### Light/Dark/Secret Economy
Core progression system based on alignment tracking:
- Cards shift parity (lightDelta, darkDelta)
- Parity snapshots at key moments
- Door requirements scale with depth
- Secret doors require balanced parity

### Forensic Theophany
Brand aesthetic philosophy:
- **Forensic** — Clinical, documented, measured
- **Theophany** — Sacred, cosmic, theological
- **Result** — Scientific examination of divine phenomena

---

## 📊 Project Status

**Current Version:** 1.0.0 (Documentation Archive Complete)  
**Last Updated:** March 5, 2026

### Completed ✅
- Complete visual asset library (31 files, 3 tiers)
- Workspace organization structure
- Master index with navigation
- Domain framework established

### In Progress 🔄
- Core docs consolidation (8 source files → 7 clean specs)
- Web archive site build
- Database schema finalization

### Planned 📋
- Interactive documentation website
- Content dashboard views (Supabase)
- Automated schema drift checking
- Playtesting and balance iteration

---

## 🤝 Contributing

### Domain Ownership
Each domain has a designated owner role:
- **World & Lore** → Narrative Designer
- **Entities & Classes** → Game Designer
- **Systems** → Systems Designer
- **Brand** → Creative Director
- **Engine** → Lead Developer
- **Pipeline** → Producer

### Contribution Guidelines
1. Follow domain ownership structure
2. Update relevant docs when making changes
3. Log all refactors in `Refactor_Log.md`
4. Maintain visual consistency per `Brand_Guide.md`
5. Test changes against PhaseWall contracts

---

## 📖 Documentation Philosophy

**One Concept, One Owner**
- Each domain owns specific data/concepts
- No duplication across boundaries
- Clear read/write permissions
- Normalization at edges

**Living Documentation**
- `Refactor_Log.md` updates after each dev session
- Other docs update per domain cadence
- Version control for all changes
- Archive old versions before major rewrites

**Portfolio-Ready**
- Complete, not placeholder content
- Professional formatting and assets
- Clear structure for external reviewers
- Standalone context (no assumed knowledge)

---

## 🔗 Related Links

**Project Repository:** [GitHub link]  
**Live Demo:** [Demo link]  
**Design System:** [Storybook link]  
**Database:** [Supabase project]

---

## 📞 Contact

**Maintainer:** Vincent Radford  
**Location:** Philadelphia, Pennsylvania, US  
**Last Updated:** March 5, 2026, 2:15 AM EST

---

## 📜 License

[License type placeholder]

---

**Dudael** — *Where the fallen are kept as evidence, not prisoners.*
