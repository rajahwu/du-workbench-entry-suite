To support lattice review and workspace alignment, I’ll frame **DudaelSystemsSpec.md** as a concise but complete systems brief that mirrors how you’ve already been talking about the project. It will be intentionally “good-enough v0” and designed to refine over time. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/b796089a-cc42-4bab-a682-2b91bf1500c5/From-the-files-provides-give-a-overview-of-Dudael.md)

## Proposed Systems Spec Outline

### 1. Purpose
- Why this doc exists (align lattice, de-risk design drift, anchor future refinements). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/b796089a-cc42-4bab-a682-2b91bf1500c5/From-the-files-provides-give-a-overview-of-Dudael.md)

### 2. The 7-Phase Loop (Gameplay View)
- Short description of each phase: Title, Select, Staging, Draft, Level, Door, Drop, with one-line “player experience” and one-line “system responsibility” each. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/4450477b-afb7-43a9-ad44-6d84c309be67/Dudael_Lore_Compilation.docx.md)

### 3. Core Economies
- **Light/Dark parity:** How every card and level shifts the scale; how parity is snapshot at Draft and checked at Door. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/4450477b-afb7-43a9-ad44-6d84c309be67/Dudael_Lore_Compilation.docx.md)
- **Secret/Threshold:** How the third axis appears in Doors and Sinerine design tokens. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/b796089a-cc42-4bab-a682-2b91bf1500c5/From-the-files-provides-give-a-overview-of-Dudael.md)
- **Meta-currency (Memory Fragments):** How death mints fragments and where they are spent (Staging, vessel growth, codex). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/4450477b-afb7-43a9-ad44-6d84c309be67/Dudael_Lore_Compilation.docx.md)

### 4. Draft as Information Game
- Early vs later run visibility (lore-only → keywords, parity value, synergy tags). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/4450477b-afb7-43a9-ad44-6d84c309be67/Dudael_Lore_Compilation.docx.md)
- How vessel class biases card pool and hand size. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/c50d0fd6-59b6-4ae8-8472-5ebce4aea0dd/DUDAEL_Gate_Refactor_Brief_for_Chat.docx.md)
- Explicit statement: “Draft builds the next Level, not just the deck.” [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/4450477b-afb7-43a9-ad44-6d84c309be67/Dudael_Lore_Compilation.docx.md)

### 5. Level as Cartridge
- Definition of LEVEL as a content-agnostic container; first implementation: 3×3 tap grid, timer, HP, depth scaling. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/c50d0fd6-59b6-4ae8-8472-5ebce4aea0dd/DUDAEL_Gate_Refactor_Brief_for_Chat.docx.md)
- How Level reads from RunLedger (loadout, parity, depth) and writes back (damage, rewards, adjustments). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/b796089a-cc42-4bab-a682-2b91bf1500c5/From-the-files-provides-give-a-overview-of-Dudael.md)

### 6. Door and Gate Math
- Door types: Light / Dark / Secret. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/c50d0fd6-59b6-4ae8-8472-5ebce4aea0dd/DUDAEL_Gate_Refactor_Brief_for_Chat.docx.md)
- How Door checks parity snapshot, depth, and maybe other flags to decide legal options and costs. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/b796089a-cc42-4bab-a682-2b91bf1500c5/From-the-files-provides-give-a-overview-of-Dudael.md)
- Simple example of door requirements by depth (v0 tuning stub).

### 7. Drop & Meta-Progression
- Designed death as default outcome; conversion of run into Memory Fragments. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/c50d0fd6-59b6-4ae8-8472-5ebce4aea0dd/DUDAEL_Gate_Refactor_Brief_for_Chat.docx.md)
- What persists: Staging accretion, vessel flags, unlocked lore. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/b796089a-cc42-4bab-a682-2b91bf1500c5/From-the-files-provides-give-a-overview-of-Dudael.md)
- Steward vs Solo: how the same systems write to different “who benefits” targets. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/c50d0fd6-59b6-4ae8-8472-5ebce4aea0dd/DUDAEL_Gate_Refactor_Brief_for_Chat.docx.md)

### 8. System ↔ Engine Contracts
- How each system plugs into existing architecture:  
  - Parity lives in RunLedger alignment, not on PhaseWall. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/b796089a-cc42-4bab-a682-2b91bf1500c5/From-the-files-provides-give-a-overview-of-Dudael.md)
  - Draft output summarized as `draftResultId` and `draftCardIds`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/b796089a-cc42-4bab-a682-2b91bf1500c5/From-the-files-provides-give-a-overview-of-Dudael.md)
  - Door decisions recorded as `lastDoorChoice`, depth increments. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/b796089a-cc42-4bab-a682-2b91bf1500c5/From-the-files-provides-give-a-overview-of-Dudael.md)
  - Drop reasons and fragment awards. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/b796089a-cc42-4bab-a682-2b91bf1500c5/From-the-files-provides-give-a-overview-of-Dudael.md)

### 9. Open Design Questions (for Lattice)
- Draft visibility tuning, Door math curve, Secret door behavior, Exile’s unique mechanic, etc. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_80eca0cd-d0a8-4d63-9059-e3363aa9eff0/4450477b-afb7-43a9-ad44-6d84c309be67/Dudael_Lore_Compilation.docx.md)

I’ve created an initial `DudaelSystemsSpec.md` file with a header and purpose section stub so we can now flesh it out section by section. 

Do you want this systems spec written in a **design-doc voice** (for designers and narrative) or in a **tech-systems voice** (explicit inputs/outputs, fields, enums) for this first pass?