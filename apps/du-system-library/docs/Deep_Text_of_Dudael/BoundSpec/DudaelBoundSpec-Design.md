# Bound & Vessels Spec (Design View)

## 1. What the Bound Are

The **Bound** are the five fallen angel entities already imprisoned in Dudael. They are not player avatars in the usual sense; they are prisoners the player temporarily aligns with for a run.

Each Bound has two lives in the design:
- **In-run vessel:** How they play in a single descent (stats, bias, feel).  
- **Meta-state:** Their long story across many runs (still bound, freed, claimed, or contested).

The player feels this in the three-layer character pick:
- Layer 1: Guide (Light or Dark child).  
- Layer 2: Bound (which entity you descend with).  
- Layer 3: Mode (Steward to free, Solo to bind).

The same entity can be freed in some timelines and claimed in others.

---

## 2. The Five Bound at a Glance

### 2.1 Table (Run Feel)

| Vessel    | Light | Dark | HP  | Hand | Bias     | Stability    | Core feel                              |
|----------|-------|------|-----|------|----------|--------------|----------------------------------------|
| Seraph   | 3     | 0    | 10  | 2    | Light    | Medium       | Clear, defensive, overcharged light.   |
| Shadow   | 0     | 3    | 10  | 2    | Dark     | Low          | Spiky, ambush, vanishing & bleeding.   |
| Exile    | 2     | 2    | 10  | 2    | Neutral  | Very low     | Glitchy, unstable, wildcard math.      |
| Penitent | 3     | 1    | 12  | 2    | Insight  | High         | Tanky, sees more, converts outcomes.   |
| Rebel    | 1     | 3    | 8   | 3    | Hazard   | Medium-low   | Fast, reckless, trades safety for push.|

These numbers are starting **biases**, not final tuning, but they capture the intended personality of each vessel.

---

## 3. Individual Vessel Intent

### 3.1 Seraph — "Never left habitation"

- **Theology:** Once fully aligned with Light; remembers clarity and order.  
- **Run feel:** Mid-HP, small hand, strong Light bias. Feels like a disciplined, defensive caster.  
- **System hooks:** More cards tagged `radiant`, `ward`, `shield`, `overcharge`. Likely to earn efficient Light doors and stabilizing relics.

### 3.2 Shadow — "Dove willingly into depth"

- **Theology:** Chose depth over covering; fall is disappearance rather than impact.  
- **Run feel:** Same HP and hand size as Seraph, but Dark-biased with low stability. Feels like high-risk, high-reward ambusher.  
- **System hooks:** Cards tagged `ambush`, `bleed`, `stealth`, `echo`. Likely to see more Dark doors, bleed mechanics, and stealth-like relics.

### 3.3 Exile — "Shed covering, refused to sink"

- **Theology:** Was cast out rather than choosing to fall; removal, not collapse.  
- **Run feel:** Balanced Light/Dark, but lowest stability. Feels like playing with glitches in the system.  
- **System hooks:** `glitch`, `swap`, `anomaly`, `wildcard` tags. Design latitude for weird Draft and Door interactions (e.g., unusual behavior on math-fail).

### 3.4 Penitent — "Rebuilding lost covering"

- **Theology:** Actively seeks restoration or understanding; engages most with lore.  
- **Run feel:** Highest HP, Light-leaning, steady. Feels like the "student" or "reader" class who sees more of the system.  
- **System hooks:** `convert`, `forgive`, `anchor`, `vow` tags. Draft visibility ramps faster; reading codex or Staging content feeds insight counters.

### 3.5 Rebel — "Set habitation on fire"

- **Theology:** Chose the fall eyes open; most agency and instability.  
- **Run feel:** Lowest HP, biggest hand, Dark-leaning hazard bias. Feels like pushing your luck, always one mistake away from collapse.  
- **System hooks:** `riot`, `break`, `rush`, `deficit` tags. More synergy with risky doors, deficit mechanics, and high-variance relics.

---

## 4. How Bound Choices Shape a Run

### 4.1 At Select (Before You Play)

The player’s choice of Bound does three main things immediately:

1. **Sets starting alignment:** A Light-leaning vessel starts closer to Light doors; a Dark-leaning vessel tilts toward Dark.  
2. **Sets starting durability:** HP defines how many mistakes you can make before death.  
3. **Sets hand size:** How many options you see at a time in Draft or in your loadout.

The game doesn’t tell you this with big numbers; it lets you **feel** that Seraph runs are slower and safer, Rebel runs are faster and sharper, etc.

### 4.2 In Draft

Vessel id and bias feed into the **card pool** and **visibility**:

- Some vessels see more cards from their keyword families.  
- Penitent sees Light/Dark information earlier than others.  
- Rebel may see more high-risk options (big deltas, powerful but costly effects).

Design intent: **When you switch vessels, Draft should feel like a different game even if the UI is identical.**

### 4.3 At Door and Drop

- Door odds and special cases can depend on vessel. For example, Exile might have unique math-fail behavior; Rebel might unlock riskier Secret paths.  
- Drop narration and Memory Fragment awards can reference the vessel’s story arc (e.g., Penitent’s insight or Rebel’s breaches).

---

## 5. Bound Meta-State Across Runs

The Bound also have an existence outside any single run.

Conceptually:
- **Bound:** Default state—entity is still fully imprisoned.  
- **Freed:** Steward-mode runs have, over time, successfully released this entity.  
- **Claimed:** Solo-mode runs have, over time, successfully bound this entity more tightly to the player.  
- **Contested:** Both patterns have happened; the world is arguing over who this entity truly belongs to.

This state is tracked per vessel (Seraph, Shadow, Exile, Penitent, Rebel) in long-term meta data, not in the per-run ledger.

Design intent: **The world moves whether or not the player reads every codex entry.** Even if they ignore lore, their choices in Steward vs Solo slowly rewrite the status of each Bound.

---

## 6. Guides, Modes, and the Bound

Selection is a **three-step Gate**:

1. **Guide:** Light Guide (Surveyor) or Dark Guide (Smuggler).  
2. **Mode:** Steward (free the Bound) or Solo (bind the entity).  
3. **Bound:** One of the five vessels.

Together these define the run’s **GateLock**:
- Which child is leading.  
- Which direction power flows (outward in Steward, inward in Solo).  
- Which entity is at stake.

For design:
- **Guide** influences tone and voice lines, as well as Draft flavor.  
- **Mode** determines where the gains from Draft/Door/Drop are written over time (toward freeing vs claiming).  
- **Bound** determines how the run actually feels to play.

Same dungeon, same phases, same economy—but a Seraph/Steward run has a very different narrative and mechanical trajectory than a Rebel/Solo run.

---

## 7. Where Designers Can Push Next

Open knobs for the Bound system:

1. **Unique run rules per vessel:** e.g., Exile penalized or rewarded differently on math-fail; Penitent gaining fragments from reading lore; Rebel having special interactions with Secret doors.  
2. **Meta thresholds:** How many successful runs does it take to mark a vessel as Freed or Claimed? What does Contested unlock in Staging or Draft?  
3. **Codex integration:** How Bound status across runs unlocks new lore pages, visual changes, or Draft/Level variants.  
4. **Visual/audio identity:** Animations, VO motifs, and UI treatments that make each Bound instantly recognizable in Title, Select, and Drop.

This design view pairs with `DudaelBoundSpec.md` (tech view). Together they ensure that vessel flavor, theology, and long-term stakes remain aligned with the actual data model.
