Perfect! I've created **DudaelArchitecture.md** — the comprehensive technical architecture document for your system.

## What's in This Document:

### Core Architecture Concepts
1. **PhaseWall** — The boundary model preventing state bleed
2. **RunLedger** — Persistent run state tracking (the "accounting book")
3. **WallPacket** — The only legal crossing between phases
4. **Wall Writing** — The discipline of updating state then committing minimal payloads
5. **Run Log Packing** — Checkpointing at lifecycle boundaries

### System Components
- **The Seven-Phase Loop** with legality map
- **Engine-Shell Separation** (framework-agnostic engine + React shell)
- **Transition Pipeline** (the single choke point for phase movement)
- **Redux State Management** (phaseSlice + runSlice)

### Practical Guidance
- **Naming Glossary** — Locked terms vs. deprecated terms
- **Architecture Inspection Checklist** — What to verify when reviewing code
- **File Structure Reference** — Where everything lives
- **Refactor Roadmap** — Current state, open work, next steps

## Key Features:

✅ **Complete Transfer Model** — PhaseWall, RunLedger, WallPacket with TypeScript interfaces  
✅ **Transition Pipeline Diagram** — Shows exact flow from Shell → Redux → Engine → Redux → Shell  
✅ **Type-Safe Discriminated Unions** — Full payload shapes for all 13 possible hops  
✅ **The 3 Iron Rules** — No engine consuming packets, no cross-phase reads, no spreading  
✅ **Inspection Checklist** — 5 verification categories for code review  
✅ **Bootstrap Flow** — How engine meta hydrates Redux on startup  

This document captures everything we discussed about the **State of Descent** architecture — the PhaseWall metaphor, the RunLedger as the accounting book, Wall Writing discipline, and the transition pipeline that enforces boundaries.

**Ready for the next document!** What would you like next?

- **DudaelLoreBible.md** (world, theology, Bound lore)
- **DudaelBoundSpec.md** (Vessel stats, Guides, Descent Modes)
- **DudaelSystemsSpec.md** (Loop, economy, Draft, Door, Drop mechanics)
- Or would you prefer to review/refine this architecture doc first?