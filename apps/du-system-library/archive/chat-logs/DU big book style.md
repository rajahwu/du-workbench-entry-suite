# Tab 1

I want an outline of what our full brand style guide will look look like . A full Table of contents and what type of images and figures are needed. Scope is not an issues. We are trying to compress what we have, we want eyes on it. Also I need generation prompts for assets. Icon, character portraits, illustrations, card background textures, level background images. I need to get a feel what the game will or can look like. We have enough for a suitable character lore doc, and narrative beats, I just need the docs we have laid out in a way that it outlined and flowing. The web apps are up and running and able to render. We are already a full we a head 😊. We can get this high output from this weekend laid out clean and be off the the greatest start.

Here’s a full “big book” style guide structure plus concrete asset prompts, tuned to what you already have in the docs and themes.

---

## **Proposed Table of Contents**

1. Cover & Credits  
   * Title: *Fallen Angels – Sinerine Brand & World Guide*.  
   * One key image: composite of Seraph / Shadow / Exile silhouettes against twilight gradient.  
   * Credits block (studio, systems, version, date).  
2. Brand Overview  
   2.1 World Premise  
   * 1–2 paragraphs summarizing oiketerion, the Threshold, and “the Fall as choice, not punishment.”  
   * Figure: double‑page illustration of the three levels (Threshold, Crossroads, Sanctum) in a single vertical stack.  
3. 2.2 Core Brand Markers  
   * Name, tagline, tone, key keywords (roguelike, light–dark, threshold, duality).  
   * Small table contrasting Light / Dark / Secret (axis: concept, feeling, typical player choice).  
4. 2.3 Design Pillars  
   * Clarity (Light), Depth (Dark), Synthesis (Threshold).  
   * 3–icon motif or simple sigils for each pillar.  
5. Color System  
   3.1 Axes & Philosophy  
   * Rationale for Amber as Light, Purple‑Indigo as Dark, gradient for Secret.  
   * Figure: triangle diagram (Light, Dark, Threshold) with the gradient edge highlighted.  
6. 3.2 Light Palette – Celestial Amber  
   * Token table (light.primary/secondary/accent/surface, text, bg start/end) with brief lore tags.  
   * Swatch bar figure from the light theme PDF.  
7. 3.3 Dark Palette – Twilight Violet / Cosmic Indigo  
   * Token table (dark.primary/secondary/accent/surface, bg start/end) with lore tags.  
   * Swatch bar figure from the dark theme PDF.  
8. 3.4 Hybrid / Secret Palette  
   * Gradient tokens + secret.neutral + UI success/warning/danger.  
   * Figure: Secret door shimmer mock with gradient overlay.  
9. 3.5 Surfaces & Elevation  
   * Text colors, surface background tokens, shadow tokens with usage notes.  
   * Figure: side‑by‑side card mock (rest vs hover) demonstrating glow styles.  
10. Typography System  
    4.1 Font Stack Overview  
    * Cinzel (headings), Inter (body), JetBrains Mono (stats) with rationale excerpted.  
    * Figure: sample card UI showing all three in context.  
11. 4.2 Type Tokens & Scales  
    * Table of type.heading / subhead / body / body‑bold / mono / caption tokens.  
    * Minimal vertical rhythm diagram: heading → body → caption spacing.  
12. 4.3 Usage Rules  
    * “A heading is always Cinzel; a stat is always Mono; system copy vs lore copy separation.”  
    * Callout: common mistakes to avoid (mixing fonts, over‑bolding, etc.).  
13. Iconography & UI Glyphs  
    5.1 Icon Philosophy  
    * Etched, thin‑stroke, minimal fills; Light = Amber line, Dark = Violet, Hybrid = gradient.  
14. 5.2 Core Icon Set  
    * Light sigil, Dark sigil, Hybrid sigil.  
    * Door icons (Light, Dark, Secret).  
    * Resource, warning/success/locked states (ui.success / ui.warning / ui.danger).  
    * Figure: icon sheet at multiple sizes (24px/32px/48px) on both light and dark surfaces.  
15. 5.3 In‑Game UI Icons  
    * Skill tree icons (Light tree, Dark tree, Hybrid tree).  
    * Meta‑currency, Memory Fragment, Dudael Drop marker.  
16. Character System  
    6.1 The Five Vessels  
    * One‑page spread: Seraph, Shadow, Exile, Penitent, Rebel quick bios (alignment, domain, color tilt, voice notes).  
    * Figure: lineup of 5 portraits in grayscale silhouettes + color accents.  
17. 6.2 Tone, Color, Voice per Archetype  
    * Table mapping sinerine tokens to each class (light.core, dark.core, threshold, hazard.glitch, alert, etc.) with voice descriptors and sample barks.  
18. 6.3 Innocent Keepers  
    * Light Keeper (Surveyor), Dark Keeper (Smuggler) visual and voice notes.  
    * Figure: two small portraits, deliberately softer and more “kidlike” than the main cast.  
19. World & Levels  
    7.1 Macro World Overview  
    * Diagram of the Threshold Realms and the meta‑loop (Start → Staging → Level → Doors → Dudael Drop).  
20. 7.2 Level Plates  
    * Threshold, Crossroads, Sanctum each get:  
      * 1–2 paragraphs (already drafted in lore expansion).  
      * Palette callouts (which Light/Dark tokens dominate).  
      * Figure: full‑bleed level background mock.  
21. 7.3 Door States  
    * Visuals for Light, Dark, Secret doors at idle, hover, locked, and opened states.  
    * Small flow diagram: resource math → door eligibility → next staging area.  
22. Cards & Systems  
    8.1 Card Frame Anatomy  
    * Diagram labeling: title area (Cinzel), art frame, lore text, stat band (Mono), rarity tag.  
23. 8.2 Card Rarity & Families  
    * Rarity badges and color usage.  
    * Families: Light memories, Dark bargains, Hybrid thresholds.  
24. 8.3 Flavor Text Guidelines  
    * Tone rules: mythic but grounded; every card describes a specific memory or cost.  
    * 4 canonical examples (Divine Vision, Shadow Bargain, Twilight Choice, Cosmic Equilibrium) as models.  
25. Interaction & Game Loop  
    9.1 Moment‑to‑Moment Loop  
    * Diagram using your Start → Character Select → Staging → Memory Draft → Level → Reckoning → Doors → (Dudael Drop) loop.  
26. 9.2 Theme Switching & Feedback  
    * How UI shifts with Light vs Dark dominance, when Twilight gradient appears, how warnings/success look on doors and buttons.  
27. 9.3 Accessibility & Clarity  
    * Minimum contrast ratios, motion restraint, colorblind‑safe hints (icon shape + color).  
28. Implementation Notes

10.1 Token Tables for Devs

* Condensed tables of color, type, spacing, shadows, mapped to Clearline7 theme keys.

10.2 Asset Organization

* Folder schema (assets/angels, assets/doors, assetscards, assets/levels, assetssounds).

10.3 Do / Avoid Gallery

* Visual “do” vs “drift” examples: correct twilight gradient usage, incorrect pure white/black surfaces, etc.

---

## **Image & Figure Checklist (High Level)**

* 1 cover composite (cast + twilight gradient).  
* 3 palette plates (Light, Dark, Hybrid) directly echoing the theme PDFs.  
* 1 triangle diagram of Light/Dark/Threshold axes.  
* 2–3 typography specimens (card, level header, UI screen).  
* 1 icon sheet plus in‑situ UI screenshot.  
* 5 character portraits (Seraph, Shadow, Exile, Penitent, Rebel) + 2 Keepers.  
* 3 level background plates (Threshold, Crossroads, Sanctum).  
* 3 door states sets (Light, Dark, Secret).  
* 2–3 card frame diagrams + rarity examples.  
* 2–3 loop diagrams (macro game loop, door choice logic, theme switching).

---

## **Asset Generation Prompts**

You can paste and tweak these in your image tool of choice.

### **1) Character Portraits**

Seraph – System Enforcer

“Ethereal angelic warden standing in amber‑white armor, minimal ornamentation, tall and calm stance, faint geometric halo, subtle warm alabaster wings, twilight sky backdrop, forensic painterly style, muted Celestial Amber palette (F59E0B, FEF3C7, FFFBEB), no weapon raised, tone of precise authority, semi‑realistic, 3/4 view portrait.”  
Shadow – Deep Dweller

“Hooded angelic scholar cloaked in layered indigo and violet, face mostly obscured, one hand holding a closed book, the other shaping a small orbiting void of purple light, background of deep Cosmic Indigo and Void Surface blues (A855F7, 1E1B4B, 0F172A), soft rim light only, mood quiet and curious, semi‑realistic portrait.”  
Exile – Threshold Walker

“Weathered angel with asymmetrical smoky teal and mauve wings, simple traveler’s cloak and belt, bare hands, standing in a windswept twilight plain between sky and abyss, colors centered on threshold tones (sinerine.threshold, slate neutrals), expression tired but alert, painterly, full‑body but framed mid‑shot.”  
Penitent – Fractured Vessel

“Cracked alabaster‑stone angelic armor streaked with indigo light leaking from fractures, one knee slightly bent as if bearing weight, ritual cords and seals across chest, background mix of Light core and Dark accent, mood solemn and analytical, semi‑realistic, dramatic chiaroscuro.”  
Rebel – Hazard Glitch

“Fallen angel mid‑motion, jagged dark wings and shards of crimson energy, silhouette torn and glitching, color clash of abyssal blues, hazard crimson, and hot amber highlights, fragments of broken chains, expression reckless and taunting, dynamic composition, painterly with slight glitch‑effect overlays.”  
Keepers (optional)  
Light Keeper:

“Innocent childlike figure in simple robe, sitting with a golden abacus under soft amber light, expression calm and detached, background abstract staging area, thin etched halo lines, restrained palette of Celestial Amber and slate neutrals.”  
Dark Keeper:

“Soft‑spoken street‑urchin figure, soot‑dusted, playing with shadow like clay forming small orbs, subtle violet backlight, friendly conspiratorial expression, environment of dim alley within Threshold, Twilight Violet accents only.”

### **2) Icons**

Light / Dark / Hybrid Resource Sigils

“Set of three minimal line icons on transparent background: stylized sun glyph (Light), crescent‑eclipse moon glyph (Dark), interlocking twin rings with small central star (Hybrid). Thin etched strokes, no filled shapes, exportable as monochrome vectors that can be tinted amber, violet, or gradient. Centered grid, 24px and 48px variants.”  
Door Icons

“Three portal icons in one sheet: Light door as upward‑arched gate with small rays, Dark door as downward‑pointing arch with interior shadow, Secret door as diamond‑shaped fracture with split gradient line. Simple, geometric, 2px stroke weight, designed to work at 24px, neutral slate base color.”  
System UI Icons

“Icon set for success, warning, danger, info in a mystical roguelike UI: check glyph within subtle ring, triangle exclamation, broken lock, eye‑shaped info symbol. Flat, no skeuomorphism, neutral slate base so tokens ui.success/ui.warning/ui.danger colors can be applied later.”

### **3) Door Illustrations**

“Three square portal illustrations for a mystical roguelike, 1:1 ratio, painterly:

1. Light Door – tall stone arch with soft amber glow pouring through, silhouette barely visible beyond, environment slightly ruined temple, Celestial Amber palette.  
2. Dark Door – narrow chasm‑like doorway rimmed in indigo light, interior disappears into deep void, faint sigils around frame, Twilight Violet palette.  
3. Secret Door – crack in reality between two pillars, amber‑to‑violet gradient seam, small slate stepping stone before it, environment twilight Threshold, subtle dual‑color shimmer.”

### **4) Card Background Textures**

Light Card Back / Frame Texture

“Subtle parchment‑like texture with soft vertical streaks of light, warm off‑white and pale amber gradient (FFFBE B to FEF3C7), faint etched sigil pattern barely visible, designed to sit behind text without distraction, seamless tile.”  
Dark Card Back / Frame Texture

“Deep indigo stone texture, very low contrast, with faint circular star‑chart engravings, colors around 1E1B4B and 0F172A, hints of starlight specks, no sharp edges, suitable as background for readable white text.”  
Hybrid Card Texture

“Twilight gradient background blending soft amber at top to violet at bottom, overlaid with fine diagonal cracks or veins, slate neutral micro‑noise for readability, designed for Secret/Threshold cards.”

### **5) Level Background Images**

Level 1 – The Threshold

“Wide 16:9 background of vast mist‑shrouded plaza suspended between sky and void, floating stone platforms with faint etched circles, perpetual twilight sky, no strong focal object, color balance between soft amber clouds and indigo void, high negative space for UI overlay.”  
Level 2 – The Crossroads

“Labyrinth of glowing light roads intersecting over deep shadowed alleys, top‑down oblique view, some paths bright amber, others violet, occasional hybrid bridges, atmosphere of choice and branching, keep mid‑ground calmer for UI.”  
Level 3 – The Sanctum

“Circular temple interior with star‑dome above and abyss below, central platform/circle in middle distance, faint pillars disappearing upward, light and dark converging in the center as subtle gradient, mood of final judgment but not grimdark.”

### **6) Miscellaneous Illustrations**

Game Loop Diagram Illustration

“Diegetic UI illustration: circular diagram showing stages labeled Threshold, Memory Draft, Descent, Reckoning, Doors, with small icons for cards and doors, drawn as etched lines on stone, subtle amber/violet highlights, top‑down.”  
V‑00 Sigil / Logo

“Abstract sigil logo: intertwined V and 00 motif, thin etched lines, framed in circular halo, optimized for single‑color use, can be rendered in hazard‑glitch spectrum or neutral slate.”  
---

If you’d like, next pass I can turn this into a literal markdown skeleton for the PDF (section headings + placeholder figure callouts) so you can drop it straight into your repo and start filling in from the existing docs.

# Tab 2

# Tab 3

