# Dudael Next-Sprint Checklist (Actionable)

## 1. Design Tasks

- [ ] Door curve draft
  - [ ] Define door cost by depth (1–7) for Light, Dark.  
  - [ ] Specify exact Secret door unlock rule (parity + depth).  
  - [ ] Sanity-check against hourglass narrative.

- [ ] Draft visibility mapping
  - [ ] Lock 2–3 visibility tiers (lore-only, hinted, explicit).  
  - [ ] Map depth × vessel → visibility tier.  
  - [ ] Define Penitent’s visibility advantage.

- [ ] Vessel signature rules (pick 3 to ship first)
  - [ ] Exile: behavior on Door math-fail.  
  - [ ] Penitent: reward for reading lore/codex.  
  - [ ] Rebel: special interaction with Secret or deficit mechanics.

- [ ] Fragment sinks v0
  - [ ] List 3–5 fragment purchases (lore, small upgrades, cosmetics).  
  - [ ] Assign rough fragment costs and target run counts.

## 2. Engine / Tech Tasks

- [ ] Wall discipline audit
  - [ ] Confirm all phases use PhaseWallPacket, not legacy PhasePacket.  
  - [ ] Remove any packet `...prev` spreads.  
  - [ ] Ensure side-effects read RunLedger/engine meta, not wall, except one-hop fields.

- [ ] RunLedger alignment
  - [ ] Align engine RunMetaSnapshot shape with Redux RunLedger.  
  - [ ] Add fields needed for chosen vessel rules and fragment sinks.  
  - [ ] Keep telemetry/debug separate from game state.

- [ ] BoundState meta layer
  - [ ] Implement storage for BoundStateMap (Supabase/local).  
  - [ ] Call updateBoundStateOnDrop at Drop based on Mode + vessel.  
  - [ ] Surface Bound status in Staging UI and codex.

- [ ] Second Level cartridge
  - [ ] Define new CartridgeId and minimal design (e.g., boss or alternate puzzle).  
  - [ ] Wire cartridge selection from Draft/metadata, not hard-coded by depth.  
  - [ ] Validate it respects alignment + HP contracts.

## 3. Tooling / Observability

- [ ] Simple internal dashboards
  - [ ] View latest RunLedger snapshots (depth, doors, drop reason, vessel).  
  - [ ] View BoundState per vessel.  
  - [ ] Inspect recent wall payloads for debugging.

- [ ] Playtest logging v0
  - [ ] Log depth reached, door choices, drop reasons, vessel used.  
  - [ ] Review early data to adjust door curves and fragment payouts.

Use this checklist alongside:
- Onboarding: `Dudael-Onboarding-Index.md`  
- Specs: Systems, Architecture, Bound (tech + design)  
- Roadmap: `Dudael-Recap-and-Future.md`
