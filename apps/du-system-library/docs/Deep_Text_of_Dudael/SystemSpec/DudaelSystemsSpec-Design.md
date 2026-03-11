# Dudael Systems Spec (Design View)

## 1. What This Document Is

This is the **design-facing** view of Dudael's systems. It explains what each part of the loop is trying to *feel* like for the player and how the big systems (parity, draft, doors, death, meta-progression) behave at a conceptual level.

The tech view (`DudaelSystemsSpec.md` main body) has exact types and function shapes. This view is for designers, narrative, and anyone sanity-checking whether the game that exists on paper is the game they want to ship.

---

## 2. The Loop: What a Run Feels Like

A run in Dudael is a **7-phase descent**:

1. **Title — The Void**  
   The player lands in a quiet title screen with the grayscale spiral. Emotionally, this is the "breath in" before anything starts. The system has already spun up; the house lights are on.

2. **Select — Forging**  
   The player chooses three things, in order: Guide (Light or Dark child), Mode (Steward or Solo), and one of the Bound to descend with. Design-wise, this is where the *tone* of the run is decided. Tech-wise, this locks the run's starting stats and bias.

3. **Staging — Locker Room**  
   A breathing room between choice and action. On day one it's mostly empty. Over time, Staging fills with previous runs, unlocked lore, and vessel changes. This is where the player can study what they just chose and what the world says about it.

4. **Draft — The Children's Table**  
   Two child guides (Light and Dark) offer cards. What looks like simple card picks is actually the main way the player shapes their alignment and the exact level they'll see next.

5. **Level — The Cartridge**  
   This room is the playable game. It loads a specific mini-game or puzzle, driven by the Draft choices and current depth. It is intentionally swappable; the loop survives even if the content here changes.

6. **Door — Divergence**  
   At the end of the level, the player hits a branching Door moment. They can choose a Light, Dark, or Secret door—if they can afford it. This is where the math of parity and depth shows up as a simple, legible choice.

7. **Drop — The Fall Event**  
   The run ends here. The system tells the story of what happened, mints Memory Fragments from the failure, and quietly prepares the next loop. Death is not a reset; it is a deposit into the next run.

Design intent: **A run should feel like a tight, replayable story where each room pushes on the same Light / Dark / Secret axis in different ways**, and the Drop makes the whole thing feel cumulative, not disposable.

---

## 3. Light, Dark, and Secret (How Choices Accumulate)

### 3.1 Mental Model

- **Light** is clarity, revelation, structure.  
- **Dark** is concealment, depth, transformation.  
- **Secret** (Threshold) is the synthesis state—the rare space where both are high or delicately balanced.

Mechanically, every meaningful choice in a run pushes Light and/or Dark up or down. The system doesn’t just track raw totals; it cares about **parity**—how far the run has tilted.

### 3.2 Where the Player Feels It

- In **Draft**, every card has an invisible or visible Light/Dark impact. Early on this is hidden behind lore text; deeper into the descent, the player starts seeing the numbers.
- In **Level**, certain actions or hits quietly nudge Light and Dark, especially through Relic effects.
- At **Door**, the player is shown the consequences: which doors are available, which are too expensive, and whether a Secret door appears at all.

Design intent: **Players should eventually realize that every small decision they made is being cashed out at the Door.** Door availability is the visible receipt for their run.

---

## 4. Draft as an Information Game (Not Just Card Picks)

### 4.1 Player Experience

Draft is where the player "sits with the children"—Light and Dark—and chooses between offers. On the surface, they see card names, art, and a little text. Underneath, the system is:

- Weighing what they did in Staging.  
- Biasing card pools based on vessel and guide.  
- Shaping the next Level cartridge.

The key design idea: **The player thinks they are choosing cards. The system knows they are choosing which version of the next room they will walk into.**

### 4.2 Visibility Ramp

- **Early runs**: Cards mostly show lore. The player is guessing and feeling their way through the system.
- **Mid-depth runs**: Some indicators appear—icons or color hints for Light/Dark, maybe 1–2 keywords.
- **Deep runs / Penitent**: Almost everything is visible—the exact Light/Dark value, synergy tags, and how a card fits the current vessel.

The visibility ramp is the main way the game teaches itself. **The deeper you go, the more you see—just in time for the stakes to be higher.**

### 4.3 Role of Vessel in Draft

Each Bound class shapes Draft differently:

- Some start with more Light or Dark in their pool.
- Some have bigger or smaller hand sizes.
- Some (like Penitent) see more information earlier.

Design note: Vessel differences should be felt first in Draft and Door, not only in raw stats.

---

## 5. Level as a Cartridge (Content-Agnostic Room)

Level is intentionally designed as a **container**, not a specific game.

- The first version is a simple 3×3 tap grid with a timer and HP.  
- Future versions might be boss rooms, puzzles, or other mini-games.

What stays constant:

- Level always **reads**: which cards were drafted, what the current depth is, and where parity sits.
- Level always **writes**: how much HP was lost, and how Light/Dark should change based on what happened.

Design intent: **You can swap or add new Level content without rewriting the meta-loop.** The run still feels like Dudael because Draft, Door, and Drop keep behaving the same way.

---

## 6. Doors: Showing the Math Without Showing the Math

Door is where the system says: "Here is what your run has done to you." The player sees:

- A Light door, with a cost in Light.  
- A Dark door, with a cost in Dark.  
- Sometimes, a Secret door that demands both.

### 6.1 Design Goals

- **Legible stakes:** The player should understand that they are spending Light or Dark to go further.
- **Delayed consequence:** Door requirements are based on everything done up to this point, not just the last room.
- **Special cases:** Secret should feel rare and earned—appearing when parity is in a specific band or when certain flags are set.

### 6.2 How the System Thinks About It

- Depth makes door costs grow. Going deeper always asks more of you.
- If the player has leaned hard into one side (e.g., very Dark), the opposite door should become unreachable or painful.
- Secret is unlocked when the run sits in a designed sweet spot of balance or extremity.

You don’t have to expose the exact formula to the player; a few clear tooltips and consistent behavior will teach it.

---

## 7. Drop and Meta-Progression: Death as Deposit

Every run is expected to end in the Drop. The question is **how** it ends and what that means for the next run.

### 7.1 Drop Reasons (Player View)

- **Death:** The vessel’s HP was exhausted.  
- **Math-Fail:** They reached a Door where none of the options were affordable.  
- **Exit:** They chose a designed exit.

Each reason feels different and can be narrated differently, but they all lead to the same outcome: **Memory Fragments.**

### 7.2 Memory Fragments

Memory Fragments are the main meta-currency. From a design standpoint, they:

- Soften the sting of death.  
- Give players a reason to push a little deeper even in doomed runs.  
- Fuel the Staging Area—new lore entries, upgrades, vessel unlocks.

The exact fragment formula can be tuned, but the principle is simple: **deeper runs pay more**, and some endings (like honest death) might pay a bit extra.

### 7.3 Staging as the Long-Term Memory

Over time the locker room should:

- Fill with records of past runs.  
- Show which Bound have been freed, claimed, or changed.  
- Unlock new codex entries and affordances based on Memory Fragments.

Design intent: **On day one, Staging is almost empty. On day twenty, it’s the most interesting room in the game.**

---

## 8. How Systems Map to Data (Designer-Readable)

You do not need to memorize the TypeScript, but it helps to know where your decisions land:

- **RunLedger:** Think of this as the run’s diary. It remembers depth, Light/Dark totals, which cards were picked, which doors were taken, and why the run ended.
- **PhaseWall:** Think of this as notes scribbled on the door between rooms. It only ever holds what the *next* room needs to orient itself.
- **Draft:** Writes card choices and alignment into the diary.  
- **Level:** Writes damage and alignment into the diary.  
- **Door:** Reads the diary (parity + depth) and then writes which door was chosen and how deep you went.  
- **Drop:** Writes how the run ended and how many fragments you earned, then hands everything back to Staging.

If a design change needs something to persist across phases or runs, it belongs in the diary (RunLedger), not on the door scribble (PhaseWall).

---

## 9. Open Design Questions

These are the main knobs still open for tuning and discussion:

1. **Door curve:** Exactly how quickly should Light/Dark door costs scale with depth? How rare should Secret be?  
2. **Draft transparency:** At what depth and for which vessels should we show exact Light/Dark values vs just vibes?  
3. **Level variety:** What are the next 1–2 cartridges after the 3×3 grid, and how do they express parity differently?  
4. **Fragment sinks:** Beyond lore unlocks, what permanent or semi-permanent things can players buy that feel meaningful but not mandatory?  
5. **Bound-specific twists:** How strongly should each Bound bend the systems (e.g., Penitent and lore, Rebel and rule-breaking, Exile and math-fail behavior)?

This design view should be read alongside the tech view. Together they answer two questions:
- **Design:** Does this game feel like Dudael?  
- **Tech:** Can we implement and maintain this without the systems bleeding into each other?
