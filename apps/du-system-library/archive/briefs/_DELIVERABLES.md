# DELIVERABLES (What You're Building)

##  **DELIVERABLES (What You're Building)**

**For Lore/Identity Work:**

1. **Brand Style Guide PDF** (1-2 pages: colors, fonts, tone)  
2. **Character Lore Doc** (expanded backstories, 200-300 words each)  
3. **Level Narrative Beats** (1-2 paragraphs per level, tighten story arc)  
4. **Card Flavor Text** (revise existing 12 cards, write 12 new ones)

**For Asset Shopping:**

1. **Asset Pack** (organized folder: `/assets/angels`, `/assets/doors`, `/assets/cards`)  
2. **Sound Pack** (if pursuing audio: `/assets/sounds`)  
3. **Font Files** (local copies of Cinzel, Inter, JetBrains Mono)

**Visual Assets:**

* [ ] **Angel character portraits** (3 total: Seraph, Shadow, Exile)

  * Style: Ethereal, semi-realistic or stylized illustration  
  * Format: PNG with transparency, 512x512px minimum  
  * Sources: Midjourney, DALL-E, or commission on Fiverr ($20-50)  
* [ ] **Door illustrations** (3 total: Light, Dark, Secret)

  * Style: Ornate, mystical, slightly abstract  
  * Format: PNG or SVG, square aspect ratio  
  * Sources: Unsplash (search "glowing portal"), custom generation, or icon packs  
* [ ] **Card background textures** (3 variants: Light, Dark, Hybrid)

  * Style: Subtle gradients, ethereal glow effects  
  * Format: PNG or CSS gradient data  
  * Sources: Free texture sites (Subtle Patterns, CSS Gradient generators)  
* [ ] **Level background images** (3 total: Threshold, Crossroads, Sanctum)

  * Style: Atmospheric, not too busy (must allow text overlay)  
  * Format: JPG or WEBP, 1920x1080px  
  * Sources: Unsplash (search "cosmic", "twilight", "temple"), AI generation

**UI Icons:**

* [ ] Light magic icon (☀️ replacement — custom glyph or illustrated sun)  
* [ ] Dark magic icon (🌙 replacement — custom glyph or illustrated moon)  
* [ ] Secret door icon (✨ replacement — custom symbol)  
* [ ] Card rarity badges (common, uncommon, rare — shield/gem shapes)

**Typography:**

* [ ] Install Google Fonts: `Cinzel` (headings), `Inter` (body), `JetBrains Mono` (stats)  
* [ ] Verify web-safe loading (preload font files for performance)

### **Sound/Audio (Week 3 Optional)**

**Sound Effects:**

* [ ] Card draw (soft chime, ~0.5s)  
* [ ] Card claim (satisfying "whoosh" + light/dark tone)  
* [ ] Door open (ethereal whoosh — Light = bright harp, Dark = deep bass)  
* [ ] Level complete (short triumphant fanfare)  
* [ ] Game over (gentle, reflective melody)

**Background Music (Ambient Loops):**

* [ ] Light theme BGM (ambient harp, strings, celestial pads)  
* [ ] Dark theme BGM (deep drones, minor keys, mysterious)  
* [ ] Menu BGM (neutral, inviting, slightly mystical)

**Sources:** Freesound.org, Incompetech (royalty-free), or commission G-01 music generation test

# Deep Blue Deck

### **On Deck: The V-00 Deep Dive Blueprint**

When you get back, we will lay out every single piece of this machine on the table to make sure the mechanics, narrative, and components are perfectly aligned. We will walk through:

* **The Entities (The Actors):**  
  * *The Vessel Designations:* Deep dive into the 5 classes, their specific starting stats, and how their playstyles differ.  
  * *The Keepers:* The Surveyor (Light) and The Smuggler (Dark), their exact roles in the Staging Area, and how they handle meta-currency.  
* **The Game Stages (The State Machine):**  
  * A phase-by-phase breakdown (Title ➔ Select ➔ Staging ➔ Draft ➔ Door ➔ Drop/Loop).  
  * Which React components belong to which phase, and what data they need from the Redux store.  
* **The Concepts (The Rulebook):**  
  * *Identity & Tone:* The Sinerine brand, the forensic UI aesthetic, and the rock opera audio cues.  
  * *Mechanics:* How the Light/Dark parity actually scales as the player reaches lower depths.  
  * *The Meta-Loop:* How dying in the Dudael Drop feeds into persistent progression.

# World Overview

### **World Overview**

**The Threshold Realms** — A liminal space between the mortal world and the celestial planes, where fallen angels navigate three trials to determine their fate: redemption, exile, or transformation.

**The Fall** was not punishment, but *choice*. Angels who questioned absolute light or absolute dark were cast into the Threshold, forced to walk a path where both forces exist in tension. Only by understanding duality can they ascend (or descend) with purpose.

### **The Three Levels (Expanded Lore)**

**Level 1: The Threshold**  
 *"Where fallen angels first awaken"*

* **Location:** A vast, mist-shrouded plaza suspended between sky and void  
* **Atmosphere:** Disorienting, neither day nor night — perpetual twilight  
* **Challenge:** Awareness. Fallen angels must recognize they are *between* states, not expelled from grace  
* **Doors:**  
  * **Light Door (0 Light):** A gateway of soft dawn — safe, familiar, but not transformative  
  * **Dark Door (0 Dark):** A passage of dusk shadows — uncertain, but honest  
  * **Secret Door (2L + 2D):** A shimmer in the air — only visible to those who embrace both  
* **Narrative Beat:** "You awaken. The fall was not an end. It was a beginning."

**Level 2: The Crossroads**  
 *"A junction of luminous paths and shadowed alleys"*

* **Location:** A labyrinth of glowing roads (light) and winding corridors (dark) that intersect chaotically  
* **Atmosphere:** Choices matter here — each turn reflects a past decision  
* **Challenge:** Commitment. Angels must choose a direction, knowing no path is purely right or wrong  
* **Doors:**  
  * **Light Door (3 Light):** A radiant archway — requires investment in clarity  
  * **Dark Door (2 Dark):** A hooded passage — requires acceptance of mystery  
  * **Secret Door (5L + 3D):** A bridge between diverging paths — costly, but unifying  
* **Narrative Beat:** "Every road leads somewhere. Not all destinations are visible from the start."

**Level 3: The Sanctum**  
 *"Final chamber where light and dark converge"*

* **Location:** A circular temple with a dome of stars above and an abyss below  
* **Atmosphere:** Finality. This is where angels confront what they've become  
* **Challenge:** Integration. To pass through, one must carry both light and shadow without conflict  
* **Doors:**  
  * **Light Door (6 Light):** Ascension through the celestial dome — return to the heavens, transformed  
  * **Dark Door (5 Dark):** Descent into the abyss — embrace the void, become something new  
  * **Secret Door (8L + 8D):** A fracture in reality — transcend both, become *neither and both*  
* **Narrative Beat:** "This is the moment of truth. What you carry defines what you become."

### **The Three Angels (Character Lore)**

**The Seraph**  
 *Class:* Light-focused  
 *Backstory:* Once a guardian of the celestial gates, the Seraph questioned why light required such rigid enforcement. Fell not from corruption, but from compassion — believing grace should be offered, not earned.  
 *Motivation:* Seeks redemption, but on their own terms. Wants to return to the heavens without abandoning the lessons of the fall.  
 *Gameplay Identity:* Starts with +1 Light per level. Thrives when pursuing Light doors, but must manage Dark accumulation to unlock Secret paths.

**The Shadow**  
 *Class:* Dark-focused  
 *Backstory:* A scholar of forbidden knowledge, the Shadow delved into mysteries meant to remain hidden. Fell not from malice, but from curiosity — believing darkness held truths light refused to illuminate.  
 *Motivation:* Seeks transformation. Has no desire to return to what was — wants to discover what lies beyond both light and dark.  
 *Gameplay Identity:* Starts with +1 Dark per level. Excels at accumulating Dark magic, but must intentionally gather Light to access Secret doors.

**The Exile**  
 *Class:* Balanced  
 *Backstory:* Refused to choose a side during the celestial wars. Fell not from defiance, but from neutrality — believing neither light nor dark held absolute truth, only perspective.  
 *Motivation:* Seeks understanding. Views the Threshold not as punishment, but as opportunity to walk a path unavailable in the rigid hierarchies above or below.  
 *Gameplay Identity:* Chooses +1 Light OR +1 Dark at the start of each level. Most flexible, can adapt to any door strategy, but requires careful planning.

### **Card Lore (Narrative Flavor)**

Each card represents a **moment of revelation** in the Threshold. They're not just resources — they're *experiences*.

**Example Card Narratives:**

**Divine Vision** (+3 Light)  
 *"A glimpse of celestial clarity"*  
 → *Lore:* You see your reflection in a pool of starlight. For a moment, you remember what you were. The memory is painful, but it illuminates the path forward.

**Shadow Bargain** (+3 Dark)  
 *"Power at a price"*  
 → *Lore:* A voice whispers from the void: "I will give you what you need, but you must carry the weight of knowing." You accept. Some truths are heavier than lies.

**Twilight Choice** (+2 Light, +2 Dark)  
 *"Choose illumination or shadow"*  
 → *Lore:* Two paths appear before you. One glows with dawn, the other fades into dusk. You realize: walking both is not betrayal. It is wisdom.

**Cosmic Equilibrium** (+3 Light, +3 Dark — Rare)  
 *"Perfect harmony achieved"*  
 → *Lore:* For an instant, light and dark cease to oppose. They orbit one another like twin stars. You stand at the center, neither blinded nor lost.

# THE NARRATIVE/THEMATIC LAYER

## **THE NARRATIVE/THEMATIC LAYER**

### **Fallen Angels as Player Characters**

**Possible character archetypes:**

* **The Seraph** (Light-focused, healing, protection)  
* **The Shadow** (Dark-focused, stealth, manipulation)  
* **The Exile** (Balanced, adaptive, hybrid skills)  
* **The Penitent** (Redemption arc, Light skills cost Dark magic too)  
* **The Rebel** (Chaos mechanics, random Light/Dark swings)

Each character could have:

* **Starting skill** (unique ability)  
* **Passive trait** (e.g., "+1 Light per level cleared")  
* **Ultimate unlock** (requires specific Light+Dark threshold)

### **Light vs Dark as Mechanics, Not Morality**

This is key to avoid cliché "good vs evil" framing:

* **Light magic** = clarity, revelation, opening, expansion  
* **Dark magic** = mystery, concealment, depth, transformation

Neither is "better" — they're **complementary forces**. Some doors require both. Some skills need hybrid investment.

**Example Skills:**

* **Radiant Insight** (Light) — Reveal all cards in next draw before choosing  
* **Veil of Shadows** (Dark) — Reroll dice once per level  
* **Twilight Synthesis** (Hybrid, 3L + 3D) — Convert 1 Light to 1 Dark or vice versa  
* branching outcomes  
* **No dead ends** — there's always a Light door and a Dark door (player choice preserved even when resources are unbalanced)

### **Core Mechanics (from sketches + your description):**

**1. Resource System (Light/Dark Magic)**

* Dual currency (not opposed, but balanced)  
* Collected through: events, puzzle solutions, card draws, dice outcomes  
* Required for: door access, skill unlocks, special actions

**2. Door/Gate System**

* **Light Doors:** Require X Light magic  
* **Dark Doors:** Require X Dark magic  
* **Secret Doors:** Require specific Light+Dark combinations (e.g., 3L + 3D, or 7L + 1D)  
* **Always two visible doors minimum** (preserves player agency)

**3. Choice Mechanics**

* **Card draws** (events, encounters, loot)  
* **Dice rolls** (randomness, skill checks, combat?)  
* **Path selection** (which door to take)  
* **Puzzle solutions** (logic gates, pattern matching, resource optimization)

**4. Progression**

* **Level-based** (discrete stages, not open world)  
* **Skill unlocks** (Light magic skills vs Dark magic skills vs hybrid?)  
* **Score/performance tracking** (replay value, leaderboards?)  
* **Persistent progression?** (unlocks carry between runs? or pure roguelike?)

# Sinerine Character Archetgypes

This structured approach is a perfect way to integrate the Fallen Angels lite game into the broader RDSYS architecture.

 By treating **Sinerine** as the identity marker, we create a clean, isolated environment for this specific aesthetic,

 allowing the game's components to share the infrastructure without bleeding into your other active projects.

Let’s lock in those core tokens and flesh out the five character classes, pulling in the *oikētērion* (covering/habitation) lore we discussed previously to give them mechanical and narrative weight.

---

### **1. The Core Sinerein Tokens (The Base Palette)**

Before we assign colors to the classes, we need to finalize the three foundational tokens that dictate the visual logic of the game.

* **sinerine.light.core (The First Estate):** A desaturated, warm alabaster or bone-white. It represents the memory of the celestial habitation—clear, structural, and unyielding. It should feel like ancient stone illuminated by a harsh, distant star.  
* **sinerine.dark.core (The Descent):** A crushing, abyssal blue-black (obsidian). It is not the color of "evil," but the color of the deep void and forbidden knowledge (like Kokabiel's domain of the stars). It absorbs light.  
* **sinerine.threshold (The Jagged Edge):** A smoky teal or desaturated mauve. This is the color of the transition state—the friction generated when an entity is caught between their celestial origin and their bound state in Tartarus.

---

### **2. Character Archetypes: Tone, Color, and Voice**

We can map these five classes directly to the lore of the Watchers. Their relationship with their *oikētērion* (did they keep it, lose it, regret losing it, or weaponize the loss?) will drive their mechanics and their dialogue.

#### **The Seraph (The System Enforcer)**

*They never left their habitation. They are the Wardens.*

* **Color Tilt:** Heavy sinerine.light.core with sinerine.light.accent (Gold). Pristine, high-contrast, zero shadow.  
* **Narrative Anchor:** Think of the Archangel Michael. They are here to maintain the system parameters and bind the anomalies.  
* **Voice Notes:** Absolute, declarative, and devoid of doubt or sarcasm. They speak in system absolutes.  
  * *Example Bark:* "The threshold is sealed. Do not attempt traversal."

#### **The Shadow (The Deep Dweller)**

*They sank entirely into the dark, embracing the hidden depths.*

* **Color Tilt:** Dominant sinerine.dark.core with sinerine.dark.accent (Indigo). Their UI should feel like peering into deep water.  
* **Narrative Anchor:** The Keepers of Forbidden Arts (like Armaros or Penemue). They deal in secrets, illusions, and bypassing locks.  
* **Voice Notes:** Quiet, elliptical, and suggestive. They use fewer words, relying on implications.  
  * *Example Bark:* "The lock is a suggestion... if you know where the mechanism sleeps."

#### **The Exile (The Wandering Anomaly)**

*They shed their celestial covering, but refuse to fully sink into the dark.*

* **Color Tilt:** Primarily sinerine.threshold (Smoky Teal/Mauve). A visual glitch caught between two states.  
* **Narrative Anchor:** A Watcher who regrets the descent but cannot return. They are tired, highly observant, and understand both the Light and Dark systems perfectly.  
* **Voice Notes:** Weary, clinical, and self-aware. They sound like a veteran engineer looking at a failing system.  
  * *Example Bark:* "Both paths cost something. I've paid for both. Just pick one."

#### **The Penitent (The Seeker of the Covering)**

*They are actively trying to rebuild or reclaim their lost habitation.*

* **Color Tilt:** sinerine.light.core base, but heavily scarred or streaked with sinerine.dark.accent. Think of cracked marble bleeding dark light.  
* **Narrative Anchor:** Driven by the need to balance the scales. They use Dark tools only to achieve Light ends, heavily focused on resource management and sacrifice mechanics.  
* **Voice Notes:** Formal, ritualistic, heavily focused on cause-and-effect and the weight of actions.  
  * *Example Bark:* "A fraction of light spent here prevents total eclipse later. Proceed."

#### **The Rebel (The Architect of Ruin)**

*They weaponized the shedding of their covering to gain raw power.*

* **Color Tilt:** High contrast. Pure Dark core clashing violently with sinerine.alert (Crimson) and jagged Light accents.  
* **Narrative Anchor:** The Azazel archetype. They thrive on destroying barriers, brute-forcing mechanics, and high-risk/high-reward plays.  
* **Voice Notes:** Fractured, taunting, arrogant. They frequently break the fourth wall to mock the game's rules or the doors themselves.  
  * *Example Bark:* "They built a door because they're afraid of what's behind it. Kick it in."

---

# Vessel Designations

Here is the Character Lore Doc (Chiefs of Tens).

I’ve written these to perfectly bridge the **ancient theology of the *oikētērion*** with the **forensic, system-driven aesthetic** of the **V-00 architecture**. 

The **archetypes** are framed almost like **combat-tested engineers** or **rogue operators** navigating a massive, failing infrastructure.

You can drop this directly into a new file at src/web/lite-game/types/character-lore.md or keep it in your admin dashboard notes.

---

# **V-00: Vessel Designations (The Chiefs of Tens)**

### **1. The Seraph**

Alignment: Light Core (sinerine.light.core) Domain: System Architecture & Enforcement Lore: They never left their habitation. The Seraphim operate as the unyielding wardens of the First Estate, treating the celestial firmament not as a holy kingdom, but as a flawless operational matrix. As a veteran of the primordial deployments, the Seraph views the descent of the two hundred Watchers as a catastrophic system failure—a breach of protocol that must be isolated and purged. They are draped in the amber-white glow of original authority, carrying the heavy burden of maintaining order. Their methodology is absolute precision; they do not negotiate with anomalies or tolerate corrupted APIs. In the staging area, they speak in terminal absolutes, commanding the field with the cold, tactical efficiency of a commander who has never known defeat, only the rigid geometry of the Law.

### **2. The Shadow**

Alignment: Dark Core (sinerine.dark.core) Domain: Deep Protocol & Forbidden Arts Lore: When the oath was sworn on Mount Hermon, the Shadow didn't just fall—they dove. They are the architects of the abyssal backend, thriving in the crushing depths of the obsidian void. They recognized the First Estate as a restrictive sandbox and chose to decompile the celestial laws to understand the true weight of the universe. Holding domains over hidden knowledge, root-cutting, and illusion, the Shadow treats the physical laws of reality as mere suggestions, bypassing locks by exploiting the system's own forgotten vulnerabilities. They are the ultimate rogue operators. Where others see the Dudael Drop as a prison, the Shadow sees an unregulated workspace. Their voice is a quiet, shifting murmur, offering profound, terrible truths wrapped in the innocence of a child sharing a secret.

### **3. The Exile**

Alignment: Threshold (sinerine.threshold) Domain: State-Shifting & Observation Lore: Caught permanently in the gray space between deployments, the Exile is an anomaly. They shed their *oikētērion* alongside the others, descending to the terrestrial plane, but the sheer gravity of the dark repelled them. Now, they wander the smoky mauve of the threshold. They are the weary, combat-tested engineers who have seen the inherent flaws in both the blinding light of the Seraph and the consuming dark of the Rebel. They understand that every action is a transaction, and every door has a structural cost. The Exile fights with a cynical efficiency, blending celestial muscle memory with dirty, terrestrial survival tactics. They do not fight to win a war; they fight simply to navigate the broken framework they helped create.

### **4. The Penitent**

Alignment: Light + Dark (Hybrid) Domain: Reconstruction & Penance Lore: The Penitent is driven by a singular, obsessive directive: reconstruct the lost covering. Their original code is shattered, resulting in a fractured vessel that bleeds forbidden indigo through cracks of alabaster light. They are a combatant desperately trying to reverse-engineer their own salvation. The Penitent weaponizes the dark only to purchase the light, treating every skirmish as a complex equation of cause and effect. They understand the heavy, ritualistic weight of consequence better than any other class. To them, the lite-game's resource management is a literal balancing of the cosmic scales. Their dialogue is formal, laced with the terminology of sacrifice and structural integrity, always calculating whether the tactical advantage of a forbidden art is worth the spiritual latency it incurs.

### **5. The Rebel**

Alignment: Hazard / Glitch (sinerine.hazard.glitch) Domain: Ruin & Unregulated Output Lore: The Rebel did not just abandon their habitation; they actively set it on fire on the way down. Embracing the sulfur glow of total corruption, they are the Azazel archetype—the chaotic innovator who shattered the celestial glass ceiling to distribute heavy metallurgy and war to the unready. They are high-risk, high-yield engines of destruction, purposefully overclocking their own spiritual parameters to achieve devastating kinetic output. The Rebel mocks the structural integrity of the doors, preferring to brute-force the threshold rather than solve the equation. Arrogant, fractured, and constantly glitching with excess energy, they view the system’s constraints not as laws, but as targets. They exist to break the build and revel in the resulting crash.

---

Task 3 is officially crossed off the Sprint Board! Since we have the mechanics and the lore aligned perfectly here, do you want to move on to Task 4: Card Flavor Text to rewrite the 12 core gameplay cards using this new terminology, or would you prefer to build out the lite_game___cards SQL seed next?

# Keep the Impossible Loop

I want to talk about the game loop That refactor looks incredibly clean. Moving away from a flat features/ directory into a dedicated web/ domain architecture (admin, index, lite-game) is a massive level-up for the project's scalability. Using the admin and index sections as internal tooling to track your sprints, songs, and assets directly within the app is a brilliant move. It means the proto-web-index isn't just the game itself—it's the actual operating system you're using to *build* the game. Keeping your workflow and your product in the same ecosystem reduces friction tremendously. 

*Hades* is the absolute gold standard for this exact kind of loop, so leaning into that structure is a brilliant move! In *Hades*, dying isn't a failure state; it's a narrative vehicle and the core of the progression system. If we apply your collaborator's ideas and this *Hades*-style rogue-lite structure to the Sinerine / V-00 framework, it perfectly solves the "what happens when the player gets stuck" problem. Here is how we can integrate these concepts cleanly into the loop:

### **1. The Innocent Keepers (The Guides)T**e player's safe zone.

Mechanic: Equip items and upgrade health/stats.

Narrative: The upgrades are framed as reinforcing the player's "Covering" (health/defense) or unlocking "Forbidden Arts" (attack/utility). 

4. CARD SELECTION (The Memory Draft)

Mechanic: The player selects from a hand of cards. This is the genius friction point of your loop. Because cards grant Light or Dark points, the player isn't just picking a power-up; they are manipulating their alignment for the end of the level.

Narrative: The cards are fragments of the *oikētērion* (celestial memory) or forbidden Watcher knowledge. 

5. PLAY LEVEL (The Descent)

Mechanic: The core puzzle/platforming gameplay.

Narrative: Keep it purely mechanical. The environment colors dictate the mood (Mount Hermon blues vs. Tartarus ambers), but the focus is 100% on the player executing the gameplay. 

6. LEVEL SCORE (The Reckoning)

Mechanic: A rapid tally of the level's success and the total Light/Dark points accumulated from gameplay and the Card Selection phase.

Narrative: Displayed like a forensic system audit. *“Light Retained: 14. Depth Reached: 22.”* 

7. CHOOSE DOOR (The Divergence)

Mechanic: The player faces physical doors that cost resources to enter, leading back to Step 3 (The Staging Area) for the next loop.

Light Door: Costs Light points. Leads to safer staging/healing.

Dark Door: Costs Dark points. Leads to dangerous staging but higher tier upgrades.

Secret Door: Requires a precise hybrid balance (e.g., exactly 10 Light and 10 Dark).

Narrative: This is where the archetype voices shine. A Rebel might scoff at a Light door, while a Seraph warns against the Dark door.

---

### **Why this loop works perfectly:**

It creates immediate, short-term strategy. While in the Staging Area (Step 3), the player looks at their health and thinks, *"I need to go through a Light Door next to heal. Therefore, in Step 4, I MUST draft Light cards, even if the Dark card does more damage."* It turns the narrative concept of "falling from grace" into a tangible gameplay mechanic that the player actively manages every few minutes. Would you like to draft the UI layout/text for the Staging Area next, or should we brainstorm the first 3 Cards the player pulls in Step 4 to see how the Light/Dark math feels? Since you're about to take a well-deserved break, here is a quick recap of everything we've locked in so far:

### **The V-00 Recap**

* The Identity (Sinerine): We established the visual and narrative core around the *oikētērion* (the celestial covering). The aesthetic is forensic, lithic, and haunting, driven by a Tri-Polar color palette (Light Core, Dark Core, Threshold/Hazard).  
    
* The Archetypes: We mapped out the 5 player classes (Seraph, Shadow, Exile, Penitent, Rebel), giving them distinct alignments and narrative voices based on how they relate to the "Left Habitation."  
    
* The Game Loop: We locked in a tight, *Hades*-inspired rogue-lite loop. Players draft Light/Dark memory cards to survive the level, manipulate their alignment to unlock specific doors, and interact with the "Innocent Keepers" (The Surveyor and The Smuggler) in the staging area.  
    
* The Fallback Mechanic: If a player botches their Light/Dark math and can't open a door, they fall into the "Dudael Drop"—an impossible survival room that resets their loop but grants meta-currency for permanent upgrades.  
    
* The Architecture: You successfully refactored the frontend, splitting the routers and state management to support the new admin, index, and lite-game workspaces.

