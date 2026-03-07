# Tab 1

Based on the provided file structure and comments, here are some suggestions for improvements:General Organization and Clarity

1. **Consistent Naming for Phases:** The phase folders are named `01-Title/`, `02-Select/`, etc. Consider making the names more consistent by adding the phase title to all of them, for example:  
   * `01-Title/`  
   * `02-Select/`  
   * `03-Staging/`  
   * ...  
   * `06-Door-Alignment/` (or similar)  
   * `07-Drop-Purge/`  
2. **Explicitly Name the "Three-Layer Architecture" Components:** The comments for the `layers/` directory are descriptive (`The Guides`, `The Five Bound`, `Descent Mode`), but the folder names are very short (`meta`, `bound`, `strategy`). If possible, consider adding a prefix or making the names more descriptive to reflect their "Layer" status or main function, for example:  
   * `layer1-meta/`  
   * `layer2-bound/`  
   * `layer3-strategy/`  
3. **Standardize Component Naming:** While `Typography.tsx` is clear, consider if all shared or brand-specific components should follow a more standardized naming convention (e.g., prefixing them with the brand name if they are truly proprietary, although this is less common for simple components).

Shared Components

1. **Separate Validator Logic:** `PacketValidator.tsx` is located in `shared/`. If the validation logic becomes complex or needs to be reused outside of component transitions, it might be beneficial to extract the core validation functions into a separate utility file (e.g., `src/utils/packetValidation.ts`) and let `PacketValidator.tsx` remain as the component wrapper or hook.

Feature Implementation

1. **Complex Phase Refactoring:** Phase `02-Select/` is already refactored into `sub-phases/`. Keep an eye on other phases like `04-Draft/` (`Dual keeper card offers`) and `05-Level/` (`3x3 Grid Mini-game`). If their complexity grows, consider applying a similar sub-phase/sub-feature structure to keep their root components lean.

State Management (`store/`)

1. **Dedicated State for UI/Local Logic:** All current slices seem focused on persistent or core game state (`PhasePacket`, `BoundState`, `Transition logic`). If the application starts incorporating complex UI state (e.g., modals, form data, temporary view settings), consider adding a dedicated `uiSlice.ts` or similar to prevent the core game state slices from becoming bloated with ephemeral UI logic.  
2. **Clearer Naming for Persistence:** `metaStateSlice.ts` comment mentions "BoundState persistence (meta-loop)". To clearly distinguish it from other state, perhaps a name like `gameStatePersistenceSlice.ts` or `boundStateSlice.ts` would be more explicit, assuming "BoundState" is the key entity being persisted.

Hooks

1. **Expand Contract Hook:** The `usePhaseContract.ts` hook is for reading/writing designated packet fields. This is excellent. Consider if a sibling hook, like `usePhaseListener.ts`, would be beneficial for components that only need to react to changes in specific packet fields without modifying them.

# Tab 2

That is the classic late-night developer jump-scare right there. Peeking into the root App.tsx or main.tsx after a massive build sprint and realizing it has become the monolith that holds the entire universe together. No wonder you sleep soundly—your brain is carrying the cognitive load of a 3,600 LOC monorepo! Take a breath. The good news is that because you just completed the state refactor and routed all transitions through the requestTransition Redux thunk, your logic is safe. You aren't rebuilding the house; you're just organizing the rooms. Here is how we can tackle this component tree refactor systematically without breaking the 7-phase loop.

## **1. The Safe Evacuations (Data and Assets)**

Start with the things that have zero dependencies.

* Extract Data: Move the hardcoded configurations for the five Bound (Seraph, Shadow, Exile, Penitent, Rebel) out of your components and into src/data/vessels.ts and src/data/entities.ts.  
* Extract Assets: Set up src/assets/theology/ and src/assets/sigils/ so your components can just import paths rather than housing SVG strings or massive image imports.

## **2. The Shared UI & Brand (Sinerine)**

Next, build out the src/components/shared/ folder.

* Move the reusable pieces like PhaseHeader.tsx, VesselCard.tsx, and BiasBar.tsx (for the Light/Dark delta fills).  
* This is the perfect place to wire up your Sinerine brand identity (the 43 design tokens, Celestial Amber, Cosmic Indigo, and typography) so these shared components are styled consistently before you drop them into the phases.

## **3. The "Turtle" Enclosures (Phases)**

Now you can start moving the specific views into src/phases/.

* Create 01-title/, 02-select/, 03-staging/, etc.  
* Move the 687 LOC procedural PixiJS animation into src/phases/01-title/TitleScreen.tsx.  
* Move your newly mapped sub-phases (Guide, Mode, Vessel) into src/phases/02-select/.

## **4. Adapting the game/ Folder to Redux**

I noticed your proposed tree includes a game/ folder mentioning Zustand or XState. Since your tech stack uses Redux Toolkit, we will adapt this slightly:

* Instead of useLoopGame.ts, this folder will house your packetSlice, metaStateSlice (for the boundState persistence layer), and your requestTransition thunk.

## **5. Taming the Beast (App.tsx & main.tsx)**

Once the pieces are moved, App.tsx becomes delightfully hollow. It should only be responsible for:

* Providing the Redux store and Theme context.  
* Reading the currentPhase from the PhasePacket.  
* Returning a simple switch statement or router that renders the correct shell from src/phases/ based on that state. Since it is late and tackling App.tsx all at once is a lot, would you like me to draft the src/data/vessels.ts file first so we can quickly offload that static data and get an easy win on the board?

