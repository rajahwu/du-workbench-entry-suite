# DUDAEL SYSTEM LIBRARY ARCHIVE
## Complete Folder Structure & File Organization

**Version:** 1.0.0  
**Date:** March 5, 2026

---

## 📁 Root Directory Structure

```
dudael-system-library/
│
├── README.md                           # Project overview & quick start
├── Dudael_Workspace_Index.md          # Master index with deep navigation
├── FOLDER_STRUCTURE.md                 # This file — complete organization guide
│
├── docs/                               # Core documentation files (7 files)
├── assets/                             # Complete visual asset library (31 files)
├── archive/                            # Original source materials (preserved for reference)
├── seeds/                              # Database initialization SQL scripts
└── tools/                              # Utility scripts & dashboard queries
```

---

## 📚 `/docs` — Core Documentation

**Purpose:** Clean, consolidated documentation organized by domain

```
docs/
│
├── Dudael_Architecture.md              # Engine & Workbench domain
│   ├── Tech stack (TypeScript, React, Redux, Supabase)
│   ├── Seven-phase loop architecture
│   ├── Three-layer system (Meta Guides / Bound / Mode)
│   ├── PhaseWall vs Run Repo contracts
│   ├── Redux state management patterns
│   └── Refactor roadmap
│
├── Dudael_Lore_Bible.md                # World & Lore domain
│   ├── Echo & Voids sector, Quarantine Zones
│   ├── Oiketrion theology (Jude 1:6)
│   ├── The Five Bound (Seraph, Shadow, Exile, Penitent, Rebel)
│   ├── Locations (Threshold, Crossroads, Sanctum, Abyss)
│   ├── Watchers, Nephilim, fallen angels
│   └── Lore glossary
│
├── Dudael_Bound_Spec.md                # Entities & Classes domain
│   ├── Design philosophy (theology → mechanics)
│   ├── Five Bound profiles (stats, playstyle, unlock)
│   ├── Guides (Surveyor, Smuggler)
│   ├── Descent Modes (Steward vs Solo)
│   └── Balance notes
│
├── Dudael_Systems_Spec.md              # Game Loop & Systems domain
│   ├── Seven-phase loop flow
│   ├── Light/Dark/Secret parity economy
│   ├── Door requirements by depth
│   ├── Draft system (Keeper offers, card pools)
│   ├── Level container (hourglass architecture)
│   └── Drop & meta-progression
│
├── Sinerine_Brand_Guide.md             # Brand & Aesthetic domain
│   ├── Brand essence (forensic theophany)
│   ├── Color palette (43 tokens: Light/Dark/Threshold)
│   ├── Typography (Cinzel, Inter, JetBrains Mono)
│   ├── Design tokens (spacing, shadows, borders)
│   ├── Voice & tone guidelines
│   └── Usage dos/don'ts
│
├── Dudael_Content_Pipeline.md          # Content & Production domain
│   ├── Content lifecycle (idea → implementation)
│   ├── Role responsibilities
│   ├── Templates (Bound, Level, Card batch)
│   ├── Quality gates
│   └── Tools (Supabase views, seed scripts)
│
└── Dudael_Refactor_Log.md              # Development tracking (living doc)
    ├── Completed refactors (with dates)
    ├── In-progress work
    ├── Backlog
    └── Technical debt tracking
```

**File Count:** 7 documentation files  
**Estimated Total:** ~150 pages of content  
**Update Frequency:** Per domain (Architecture & Refactor Log most frequent)

---

## 🎨 `/assets` — Visual Asset Library

**Purpose:** All generated visual content organized by category

```
assets/
│
├── identity/                           # Core brand identity (3 files)
│   ├── hero_banner.png                 # 1920×600 — Archive homepage header
│   ├── logo_icon.png                   # 256×256 — Hourglass/sacred geometry
│   └── domain_icons.png                # 6-pack — Lore/Bound/Systems/Brand/Engine/Pipeline
│
├── navigation/                         # Documentation section banners (7 files)
│   ├── banner_architecture.png         # 1200×300 — Layered stack + gear
│   ├── banner_lore.png                 # 1200×300 — Spiral galaxy + wing
│   ├── banner_bound.png                # 1200×300 — Five Bound sigils
│   ├── banner_systems.png              # 1200×300 — Hourglass + balance scales
│   ├── banner_brand.png                # 1200×300 — Tri-polar palette
│   ├── banner_pipeline.png             # 1200×300 — Conveyor belt workflow
│   └── banner_refactor.png             # 1200×300 — Git commit graph
│
├── characters/                         # The Five Bound sigils (5 files)
│   ├── sigil_seraph.png                # 256×256 — Radiant six-winged (Light)
│   ├── sigil_shadow.png                # 256×256 — Cloaked mystery (Dark)
│   ├── sigil_exile.png                 # 256×256 — Broken chain/halo (Threshold)
│   ├── sigil_penitent.png              # 256×256 — Kneeling prayer (Light-seeking)
│   └── sigil_rebel.png                 # 256×256 — Raised fist/inverted wing (Dark)
│
├── diagrams/                           # Technical & system diagrams (5 files)
│   ├── phase_flow.png                  # 1600×900 — Seven-phase loop + PhaseWall
│   ├── arch_three_layer.png            # 1200×800 — Meta/Bound/Mode layers
│   ├── arch_phasewall_runrepo.png      # 1200×800 — Ephemeral vs persistent
│   ├── arch_redux_tree.png             # 1000×1200 — State tree (game/meta/ui)
│   └── brand_tokens_showcase.png       # 1600×1200 — 43 tokens display
│
├── locations/                          # World location concept boards (4 files)
│   ├── location_threshold.png          # 1200×675 — Liminal boundary zone
│   ├── location_crossroads.png         # 1200×675 — Three diverging doors
│   ├── location_sanctum.png            # 1200×675 — Clinical sacred space
│   └── location_abyss.png              # 1200×675 — Deep containment prison
│
├── social/                             # Social sharing Open Graph images (3 files)
│   ├── og_home.png                     # 1200×630 — Archive homepage card
│   ├── og_lore.png                     # 1200×630 — Lore Bible card
│   └── og_architecture.png             # 1200×630 — Architecture card
│
├── ui/                                 # UI elements & components (3 files)
│   ├── status_badges.png               # Badge set — Complete/In Progress/Backlog
│   ├── phase_icons_mini.png            # 7 icons (32×32) — Phase indicators
│   └── alignment_indicators.png        # 3 icons (48×48) — Light/Secret/Dark
│
└── mockups/                            # Reference & planning (1 file)
    └── site_layout_mockup.png          # 1920×1080 — Full webpage wireframe
```

**File Count:** 31 visual assets  
**Total Size:** ~50-75MB (PNG format)  
**Usage:** Documentation headers, website build, portfolio showcase

---

## 📦 `/archive` — Original Source Materials

**Purpose:** Preserve original documents for reference and historical context

```
archive/
│
├── chat-logs/                          # Raw conversation transcripts
│   ├── pasted-text-game-dev.txt        # 12KB — Game dev session (loop, lore)
│   └── pasted-text-refactor.txt        # 74KB — Refactor guide (PhaseWall, Redux)
│
├── briefs/                             # Structured design documents
│   ├── DUDAEL_Gate_Refactor_Brief.docx # 10KB — Architecture decisions
│   └── FALLEN_ANGELS_Sprint_Plan.md   # Task checklist (archived post-completion)
│
├── lore/                               # Narrative source materials
│   ├── Oiketrion.md                    # 94KB — Dense theology dump
│   ├── Dudael_Lore_Compilation.docx    # 11KB — Lore summary
│   └── Core_Vessel_shape.md            # 3KB — Vessel theology notes
│
└── specs/                              # Technical & content specifications
    └── FALLEN_ANGELS_Proto_Index.md   # 66KB — Brand + DB seed spec
```

**Purpose:** Reference only — do NOT edit archived files  
**Action:** Extract useful content → merge into `/docs` clean versions  
**Preservation:** Keep for "how we got here" context

---

## 🌱 `/seeds` — Database Initialization Scripts

**Purpose:** SQL scripts to populate Supabase with initial data

```
seeds/
│
├── seed_brand_identity.sql             # Sinerine design tokens
│   ├── vfapalette table (43 color tokens)
│   ├── vfatypography table (Cinzel, Inter, JetBrains)
│   ├── vfaguidelines table (usage rules)
│   └── Icon registry (storage paths)
│
├── seed_litegame_content.sql           # Game content (levels, cards, skills)
│   ├── levels table (5 starter levels)
│   ├── cards table (30+ draft cards with parity)
│   └── skills table (Bound-specific abilities)
│
└── seed_bound_configs.sql              # Vessel & Guide data
    ├── bounds table (5 Vessels with stats)
    ├── guides table (Surveyor, Smuggler)
    └── descent_modes table (Steward, Solo)
```

**Usage:**
```bash
# Run seeds in order (dependencies matter)
psql -d dudael < seeds/seed_brand_identity.sql
psql -d dudael < seeds/seed_bound_configs.sql
psql -d dudael < seeds/seed_litegame_content.sql
```

---

## 🛠️ `/tools` — Utility Scripts & Dashboards

**Purpose:** Maintenance, drift checking, content management

```
tools/
│
├── schema_drift_check.js               # Compare TS types to DB schemas
│   ├── Reads TypeScript interfaces
│   ├── Queries Supabase schema
│   ├── Reports mismatches
│   └── Suggests fixes
│
├── content_dashboard_views.sql         # Supabase dashboard queries
│   ├── View: incomplete_content (missing art/text)
│   ├── View: parity_violations (broken Light/Dark balance)
│   └── View: orphaned_references (dangling foreign keys)
│
└── seed_validator.js                   # Validate seed SQL before running
    ├── Syntax check
    ├── Foreign key validation
    └── Required field check
```

**Run frequency:**
- `schema_drift_check.js` — After any DB migration or TS type change
- Dashboard views — Refresh before content sprints
- `seed_validator.js` — Before running new seed scripts

---

## 📋 File Naming Conventions

### Documentation Files
**Pattern:** `Dudael_[DomainName].md`  
**Examples:**
- `Dudael_Architecture.md` ✅
- `Dudael_Lore_Bible.md` ✅
- `architecture.md` ❌ (missing prefix)
- `ARCHITECTURE.MD` ❌ (wrong case)

### Visual Assets
**Pattern:** `[category]_[descriptor].png`  
**Examples:**
- `banner_architecture.png` ✅
- `sigil_seraph.png` ✅
- `ArchitectureBanner.png` ❌ (wrong case)
- `banner-architecture.png` ❌ (use underscore, not dash)

### SQL Seeds
**Pattern:** `seed_[content_type].sql`  
**Examples:**
- `seed_brand_identity.sql` ✅
- `seed_litegame_content.sql` ✅
- `brand-seed.sql` ❌ (wrong pattern)

---

## 🔄 Maintenance & Updates

### Weekly Tasks
- [ ] Update `Refactor_Log.md` after dev sessions
- [ ] Review `Content_Pipeline.md` for sprint alignment
- [ ] Run `schema_drift_check.js` if any DB changes

### Monthly Tasks
- [ ] Review all `/docs` for accuracy
- [ ] Update version numbers in `README.md` and workspace index
- [ ] Archive old versions of significantly changed docs
- [ ] Validate all asset links still work

### Quarterly Tasks
- [ ] Complete audit of all 7 domain docs
- [ ] Regenerate any outdated visual assets
- [ ] Review folder structure for needed additions
- [ ] Update external links (GitHub, Supabase, etc.)

---

## 📊 File Statistics

| Category | File Count | Estimated Size |
|----------|------------|----------------|
| **Documentation** | 7 files | ~2MB (markdown) |
| **Visual Assets** | 31 files | ~50-75MB (PNG) |
| **Archive Materials** | 8 files | ~200KB (mixed) |
| **Database Seeds** | 3 files | ~50KB (SQL) |
| **Tools & Scripts** | 3 files | ~20KB (JS/SQL) |
| **Root Files** | 3 files | ~50KB (README, Index, this) |
| **TOTAL** | **55 files** | **~52-77MB** |

---

## 🎯 Quick Access by Role

### Developer
```
Primary: docs/Dudael_Architecture.md
Secondary: docs/Dudael_Refactor_Log.md
Tools: tools/schema_drift_check.js
Assets: assets/diagrams/
```

### Narrative Designer
```
Primary: docs/Dudael_Lore_Bible.md
Secondary: docs/Dudael_Bound_Spec.md
Assets: assets/characters/, assets/locations/
```

### Game Designer
```
Primary: docs/Dudael_Systems_Spec.md
Secondary: docs/Dudael_Bound_Spec.md
Assets: assets/diagrams/phase_flow.png
```

### Artist / UI Designer
```
Primary: docs/Sinerine_Brand_Guide.md
Assets: assets/identity/, assets/ui/
Reference: assets/diagrams/brand_tokens_showcase.png
```

### Producer / PM
```
Primary: docs/Dudael_Content_Pipeline.md
Secondary: docs/Dudael_Refactor_Log.md
Tools: tools/content_dashboard_views.sql
```

---

## 🚀 Next Steps

### Immediate (v1.0 → v1.1)
1. **Write complete content** for all 7 `/docs` files (currently frameworks)
2. **Extract and consolidate** content from `/archive` sources
3. **Test all asset links** in documentation
4. **Validate folder structure** matches this guide exactly

### Short Term (v1.1 → v1.5)
5. **Build web archive site** using `/assets` and `/docs`
6. **Implement dashboard views** from `/tools`
7. **Create seed script runners** (bash/npm scripts)
8. **Add CI/CD** for schema drift checking

### Long Term (v2.0+)
9. **Interactive documentation** (searchable, cross-linked)
10. **Automated asset generation** pipeline
11. **Version-controlled docs** with changelog automation
12. **Public-facing documentation site**

---

**End of Folder Structure Guide**

For navigation and deep links, see: [Dudael_Workspace_Index.md](./Dudael_Workspace_Index.md)  
For project overview, see: [README.md](./README.md)
