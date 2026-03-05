Ah, yeahâ€”the loop holding together via Redux's `requestTransition` thunk is a win, especially after centralizing those phase changes and ditching the scattered event wiring. That single authority for transitions (engine â†’ Redux â†’ Router/URL sync) is probably why it feels "expected" on the surface. But data shapes being off is a sneaky killer; it can make everything downstream feel wrong without obvious crashes. From what you're describing (and cross-referencing the project map doc), the Title phase is the entry point bottleneckâ€”it's meant to ingest a basic User (maybe from Supabase auth) and output a fresh Player for the run, but lingering legacy cruft like `isLegacy` (old save migration flag?) and `kind` (maybe an outdated player archetype enum?) is gunking up the PhasePacket. Plus that lite player feature (guest/quickstart mode?) returning a stripped-down version, which might not align with full vessel/stats setup.

This ties directly into the core refactor you're outlining: modularizing those bloated phase components (e.g., TitleShell at ~200 LOC + styles), shifting from inline styles to proper CSS/Tailwind, layering in React Router for cleaner nav (beyond just phase bridges), React Query for async state (user fetches, meta persistence), and hooking up Supabase basics for real data flow. Solid planâ€”it's evolutionary, not a full rewrite, which is smart for portfolio week crunch. Let's break it down into actionable steps, focusing first on fixing the data shapes (since that's the "off" root), then the refactor pieces. I'll suggest code sketches based on the doc's architecture (canonical `types.ts`, PhasePacket evolution, Redux mutations), assuming standard TS interfacesâ€”adapt as needed.

### 1. **Fix Data Shapes: Clean User â†’ Player Handover in Title**

- **Current Mismatch Breakdown:** Title initializes the packet with `{ ts, user, from, to }`, but if `user` carries bloat like `isLegacy: boolean` or `kind: 'lite' | 'full' | whatever`, it pollutes the downstream (e.g., Select expects clean `player.vessel`, Draft appends `meta.draftedCards`). The lite player sounds like a variantâ€”maybe for non-auth'd users or quick testsâ€”but if it's half-baked, it skips stats like starting Light/Dark/Health/handSize, breaking parity calcs later.
- **Goal:** Title "sees" user (auth check), strips legacy, returns a typed Player. Use the lite feature explicitly (e.g., as a fallback).

**Suggested Updates:**

- In `phases/types.ts` (or wherever types live), refine interfaces to enforce separation:
    
    ```tsx
    // User: Auth/sessions only, no game state. Drop legacy fields.
    export interface User {
      id: string;  // From Supabase auth
      name?: string;
      // Remove: isLegacy, kind â€“ if needed for migration, handle in a one-time util, not core types
    }
    
    // Player: Run-specific entity, built from User + choices.
    export interface Player {
      id: User['id'];  // Link back
      vessel: VesselType;  // Filled in Select, but init empty here
      stats: {
        light: number;  // Starting based on vessel
        dark: number;
        health: number;
        handSize: number;
      };
      // Add more as needed, e.g., mode: 'lite' | 'full' if keeping the feature
    }
    
    // PhasePacket: Ensure Title only writes user-derived basics, no cruft.
    export interface PhasePacket {
      ts: number;
      user: User;  // Input to Title
      player: Player;  // Output from Title (or built progressively)
      from: PhaseId;
      to: PhaseId;
      // ... rest as per doc: meta, etc.
    }
    ```
    
- In Title phase (e.g., `TitleShell.tsx` or manager hook):
    
    ```tsx
    // Function to build player from user, with lite fallback
    function getPlayerFromUser(user: User | null, isLite: boolean = false): Player {
      if (!user) {
        // Lite mode: Guest/quickstart
        return {
          id: 'guest-' + Date.now(),  // Temp ID
          vessel: null,  // Prompt Select
          stats: { light: 0, dark: 0, health: 10, handSize: 3 },  // Minimal defaults
        };
      }
      return {
        id: user.id,
        vessel: null,  // Init empty
        stats: { light: 1, dark: 1, health: 15, handSize: 4 },  // Full defaults, or from user prefs
      };
    }
    
    // In component or transition handler:
    const handleStart = () => {
      const user = getCurrentUser();  // From Supabase or context
      const player = getPlayerFromUser(user, shouldUseLite(user));  // Logic for lite, e.g., !user.isAuthenticated
      const packet: PhasePacket = {
        ts: Date.now(),
        user,  // Clean user only
        player,  // Fresh player
        from: 'title',
        to: 'select',
      };
      writePacket(packet);  // To localStorage/Redux
      requestTransition('select');  // Redux thunk
    };
    ```
    
    - Drop `isLegacy` handling: If it's for old data, migrate once on load (e.g., in app init) and remove the field.
    - Test: Run Title â†’ Select, inspect packet in devtoolsâ€”should have clean `player` without extras.

### 2. **Break Up Phase Components**

- Those shells are chunky (doc flags Title at 196 LOC, Draft bigger)â€”split into sub-components for readability/portfolio shine.
- **Approach:** For each phase (start with Title), extract UI/logic:
    - `TitleShell.tsx` â†’ `TitleHeader.tsx` (branding/anim), `TitleActions.tsx` (start/exchange buttons), `TitleUserPanel.tsx` (user display, lite toggle).
    - Use composition: `<TitleShell><TitleHeader /><TitleUserPanel /><TitleActions /></TitleShell>`.
    - Benefits: Easier testing (Vitest), reuse (e.g., user panel in Staging).

### 3. **Convert to CSS (Leverage Tailwind)**

- Doc says Tailwind 4 installed but not used in shellsâ€”inline styles (346 CSS in Title?) are messy for themes (Light/Dark shifts).
- **Approach:**
    - Move to `index.css` or phase-specific CSS: `@apply` Tailwind classes, or raw if needed.
    - Example for Title:
    Import in component: `import './title.css';` then `<div className="title-container">...`
        
        ```css
        /* phases/Title/title.css */
        .title-container { @apply bg-black text-amber-500 flex flex-col items-center; }
        .title-button { @apply px-4 py-2 rounded bg-violet-700 hover:bg-violet-500; }
        ```
        
    - For dynamic: Use Tailwind variants (e.g., `dark:bg-gray-900`) tied to Redux theme state.
    - Clean up: Global search for `style={{}}` and replace.

### 4. **Add/Enhance React Router & React Query for State**

- Router 7 is in stack, but if not fully utilized, add nested routes for phases (e.g., `/dudael/title`, `/select`).
    - In `App.tsx`:
        
        ```tsx
        <Router>
          <Routes>
            <Route path="/title" element={<TitleShell />} />
            <Route path="/select" element={<SelectShell />} />
            // ... auto-gen from phases array?
          </Routes>
        </Router>
        ```
        
    - Bridge strengthens: `PhaseRouterBridge` already translates, but add guards (e.g., redirect if no packet).
- React Query (TanStack Query in stack): For async, like user fetch or meta from Supabase.
    - Example query in Title:
        
        ```tsx
        import { useQuery } from '@tanstack/react-query';
        const { data: user } = useQuery({
          queryKey: ['user'],
          queryFn: async () => supabase.auth.getUser(),  // Or db fetch for saves
        });
        ```
        
    - Cache phase data: Query for vessel configs/cards instead of inlineâ€”key for modularity.

### 5. **Connect to Data Basics (Supabase Integration)**

- Doc has Supabase for auth/dbâ€”hook it for persistent meta (beyond localStorage), user saves.
- **Basics:** Init client in `App.tsx`, auth listener for user.
- Replace localStorage for meta: Use Supabase realtime for loopCount/confessions (e.g., `supabase.from('runs').insert(meta)` at Drop).
- Lite player: Tie to anon auth if no session.

**Priority for Portfolio Week:**

- Day 1: Data fixes (types, Title handover)â€”quick win, makes loop "right."
- Day 2-3: Component breakup + CSS conversion (visual polish).
- Day 4: Router/Query/Supabase (future-proof, demo persistent runs).
- Test full loop post-each: Title (user â†’ player) â†’ Select (vessel) â†’ Draft (cards/parity) â†’ ... â†’ Drop (meta persist).

If the legacy fields are from an old branch/commit, git blame them for context. Share a code snippet of the current types or Title handler if you want a more tailored fixâ€” or what's the exact mismatch symptom (e.g., "player undefined in Select")? We've got this; it'll snap into place. What's next on your list while up? ðŸ˜´

The separation you've got here is clean and intentionalâ€”**TitleScreen** as pure presentational (props-only, no hooks, no dispatch, nice CRT/vignette/boot flair with that amber #D4A843 accent) and **TitleShell** as the smart container (handles async profile load, exchange/commit, Redux transition dispatch, booting state). That's textbook good React architecture, especially for a phase-based system where you want to keep the engine logic framework-agnostic and testable.

The root issue is still the **data shape mismatch** flowing out of `titleExchange` â†’ `commitExchange` â†’ packet â†’ downstream phases (Select/Staging/etc.). From the code and types you shared:

- `titleExchange(profile, DEFAULT_POOL)` takes a profile (from `loadUserProfile()`) and a pool, produces a `result` (presumably `{ packet: PhasePacket, ... }`).
- It then `commitExchange(result)` â€” this likely serializes/writes the packet somewhere (localStorage? Redux prep? Supabase?).
- `dispatch(requestTransition(result.packet.to, result.packet))` pushes it forward.
- But the `PhasePacket` type has legacy/deprecated baggage: `user?: { id?: string }`, `identity?: { vessel?: string; sigil?: string }`, `selection?: Selection` (deprecated Choice<PlayerIdentity>), `player?: PlayerIdentity`, and `kind` commented out in PlayerIdentity.

This creates ambiguity: after Title, what actually represents "the player" for Select? Is it `player`, `identity`, or the deprecated `selection.chosen`? If `titleExchange` is still writing to the deprecated fields (or mixing them), Select/Staging will see inconsistent or missing data â€” e.g., no clean `player.id` + `vessel` init, or `gate` not populated yet (since gate is Select's job).

### Quick Diagnosis & Fix Path

1. **What `titleExchange` should do (design intent from your earlier descriptions):**
    - Input: minimal User/Profile (maybe just `{ id: string }` or null for guest).
    - Output: a PhasePacket with a fresh `player: PlayerIdentity` (id linked to user, vessel/sigil null/undefined until Select).
    - No legacy `kind`, no `selection` (unless you're grandfathering old packets), minimal `user` if needed for auth linking.
    - Possibly set a default `alignment: { light: 0, dark: 0 }` or vessel-specific starters later.
2. **Make Title the clean "player factory" phase:**
Update types to prefer `player` as the canonical run identity. Deprecations are fine for compat, but don't write to them anymore.
    
    **Suggested tightened types (in phases/types.ts):**
    
    ```tsx
    export type PlayerIdentity = {
      id: string;                     // required, from user or generated
      displayName?: string;
      vessel?: VesselId;              // null/undefined until Select
      sigil?: string;                 // optional flair/unlock
      // Remove or fully deprecate: kind, tags if not used
    };
    
    export type PhasePacket = {
      from: PhaseId;
      to: PhaseId;
      ts: number;
    
      user?: { id: string };          // minimal auth link only
      player: PlayerIdentity;         // <-- make this required after Title
    
      // Keep for Select phase only
      gate?: GateSelection;
    
      // Later phases
      alignment?: Alignment;
      depth?: number;
      inventory?: string[];
      meta?: Record<string, unknown>;
    
      // Deprecations â€” read if present, but never write
      /** @deprecated Use player instead */
      identity?: { vessel?: string; sigil?: string };
      /** @deprecated Use Choice<...> or gate */
      selection?: Selection;
    };
    ```
    
3. **Fix in TitleShell + title-exchange.ts**
Assuming `loadUserProfile` returns something like `{ id: string; name?: string; isLegacy?: boolean }` or null/guest.
    
    In `@du/phases/01_title/title-exchange.ts` (or wherever it lives), refactor to:
    
    ```tsx
    // Example signature â€” adjust to match your actual impl
    export function titleExchange(
      profile: { id: string; name?: string } | null,
      pool: SelectionPool  // probably unused now if no title-time choice
    ) {
      const playerId = profile?.id ?? `guest-${Date.now()}`;
      const player: PlayerIdentity = {
        id: playerId,
        displayName: profile?.name,
        // vessel/sigil stay undefined â€” Select fills them
      };
    
      const packet = buildPacket("01_title", "02_select", {
        user: profile ? { id: profile.id } : undefined,
        player,  // <-- this is the key output
        // Do NOT set identity/selection unless migrating old data
      });
    
      return { packet /* , other result fields if any */ };
    }
    
    export async function loadUserProfile(): Promise<{ id: string; name?: string } | null> {
      // Supabase auth or local fallback â€” keep minimal
      // Avoid legacy flags here
      const { data: { user } } = await supabase.auth.getUser();
      return user ? { id: user.id, name: user.user_metadata?.name } : null;
    }
    
    export function commitExchange(result: { packet: PhasePacket }) {
      // Probably: localStorage.setItem("dudael:active_packet", JSON.stringify(result.packet));
      // Or prep for Redux â€” but since dispatch gets the packet directly, maybe just return it
    }
    ```
    
    Then in **TitleShell**:
    
    ```tsx
    const handleEnterDrop = async () => {
      setIsBooting(true);
      try {
        const profile = await loadUserProfile();
        const result = titleExchange(profile, DEFAULT_POOL); // pool might be removable now
        commitExchange(result);
        dispatch(requestTransition(result.packet.to, result.packet));
      } catch (err) {
        console.error("Title exchange failed", err);
        // Optional: show error UI in TitleScreen
      } finally {
        setTimeout(() => setIsBooting(false), 800); // or remove if transition unmounts
      }
    };
    ```
    
4. **Downstream (Select phase):**
    - In SelectShell, read `packet.player` as the base identity.
    - Update it with `gate` choices â†’ eventually set `player.vessel`.
    - If old packets come in with `selection` or `identity`, add a migration util in a central packet reader:
    Call this before dispatching or in phase init.
        
        ```tsx
        function normalizePacket(packet: PhasePacket): PhasePacket {
          if (!packet.player && packet.selection?.chosen) {
            return { ...packet, player: packet.selection.chosen };
          }
          if (!packet.player && packet.identity) {
            return {
              ...packet,
              player: { id: packet.user?.id ?? "unknown", ...packet.identity },
            };
          }
          return packet;
        }
        ```
        

### Next Refactor Wins (Aligning with your plan)

- **CSS conversion:** TitleScreen already uses Tailwind-ish classes (e.g., `flex h-screen`, `bg-[#0D0E12]`). Extract to a `title.css` or lean harder on `@apply` for reusability. Add dark/light variants if parity affects theme.
- **React Router integration:** Ensure `requestTransition` also pushes to `/02_select` (or `/dudael/select`). Use `useNavigate` in Shell if needed.
- **React Query:** Wrap `loadUserProfile` in `useQuery(['user-profile'])` for caching + loading states (show spinner instead of just booting flash).
- **Test the flow:** Console.log the packet right after dispatch â€” confirm `player` exists cleanly, no `kind`/`selection` pollution.

This should make the Title â†’ Select handoff feel "right" without breaking the loop. If `titleExchange` is doing something more complex (e.g., actually picking a default vessel/sigil from pool), share a snippet of that function and we can refine. What's the first symptom you're seeing downstream (e.g., Select complains about missing vessel, or [player.id](http://player.id/) undefined)? Hang in there â€” you're super close. â˜•

Good morning again, Vincent! Glad the coffee (or sheer willpower) kicked in and you're feeling more awake ðŸ˜„ â€” that "aha" moment about separating the packets is spot on and a really smart refinement at this stage.

You're absolutely right: the **PhasePacket** is meant to be the minimal, phase-to-phase handoff contract â€” each phase should only receive (and only need to read/write) the fields required for its own decisions and the immediate next one. Dumping everything (user details, full meta, run-long entity state, vessel choices, alignment history, etc.) into a single growing blob creates exactly the "off" feeling you're describing: downstream phases see noise, legacy cruft leaks forward, serialization gets brittle, and debugging becomes "where did this field come from?" hell.

The clean architectural intent from your project map (clean core isolation, framework-agnostic engine, single `requestTransition` authority, canonical types.ts) supports splitting concerns:

- **PhasePacket** â†’ ephemeral, phase-transition-only data (what the next phase needs right now)
- **RunData** (or PersistentRunState / RunEntityPacket / MemoryFragmentCarrier â€” name it what feels right) â†’ the accumulating run identity + vessel + meta progression that lives across the full loop (persisted via localStorage or Supabase at key points like Drop / Staging reset)

### Proposed Split (Minimal Changes, High Clarity)

### 1. PhasePacket (tight, forward-only)

Keep it lean â€” basically what the diagrams show for each transition (e.g., Title â†’ Select only needs user context + initial player stub).

Updated `phases/types.ts` sketch:

```tsx
export type PhasePacket = {
  from: PhaseId;
  to: PhaseId;
  ts: number;

  // Title â†’ Select: minimal entry
  user?: { id: string };               // auth link only, no preferences/consent here

  // After Select: vessel chosen
  player?: PlayerIdentity;             // { id, vesselId?, sigil?, displayName? }

  // Select â†’ Staging/Draft: gate choices locked in
  gate?: GateSelection;                // guide, mode, vesselId (finalized)

  // Later phases append only what they need next
  alignmentSnapshot?: Alignment;       // parity check at Door, etc.
  depth?: number;                      // current descent level
  // No full meta, no inventory history, no telemetry â€” those live in RunData
};
```

- No `selection`, no `identity` duplication, no `meta` blob unless phase-specific.
- Each phase reads only the fields it cares about and writes only its additions.

### 2. Introduce RunData (the persistent carrier)

This is the "entity and vessel data" you mentioned â€” carried across the entire descent and meta-loop.

```tsx
export type RunData = {
  runId: string;                       // unique per descent attempt (e.g. uuid or ts-based)
  player: PlayerIdentity;              // locked after Select
  gate: GateSelection;                 // locked after Select
  startingAlignment: Alignment;        // vessel defaults
  currentAlignment: Alignment;         // mutates during run
  depth: number;
  loopCount: number;                   // meta progression
  meta: {
    confessions?: number;              // Penitent path
    breaches?: number;                 // Rebel path
    // ... other Hades-style persistent counters
    path: "full" | "lite";
    // telemetryConsent?: boolean;     // if needed for analytics, but maybe separate
  };
  // Optional: inventory history, draft picks snapshot, etc.
};
```

- Lives in Redux (new `runSlice`) + synced to localStorage/Supabase at phase boundaries (especially Drop â†’ Staging reset).
- PhasePacket can reference it indirectly (e.g., via runId) or carry lightweight pointers, but most phases read directly from Redux/selectors.

### 3. Refactor titleExchange to produce both

```tsx
export function titleExchange(
  profile: UserProfile | null,
  pool: SelectionPool<PlayerIdentity>
): { phasePacket: PhasePacket; runData?: RunData } {   // runData optional for lite
  const ts = Date.now();
  const userId = profile?.id ?? `guest:${crypto.randomUUID()}`;

  const phasePacket: PhasePacket = {
    from: "01_title",
    to: "02_select",
    ts,
    user: { id: userId },
    // Nothing else â€” Select will fill player & gate
  };

  // Only full path gets a pre-init RunData stub
  let runData: RunData | undefined;

  const hasFullConsent = !!profile && !!profile.telemetryConsent && !!profile.preferences;

  if (hasFullConsent) {
    runData = {
      runId: `run-${ts}-${userId.slice(0,8)}`,
      player: {
        id: userId,
        displayName: profile.displayName ?? "Wanderer",
      },
      gate: {},                        // empty â€” Select fills
      startingAlignment: { light: 0, dark: 0 }, // or vessel defaults later
      currentAlignment: { light: 0, dark: 0 },
      depth: 0,
      loopCount: 0,                    // or load from meta if continuing
      meta: { path: "full" },
    };
    phasePacket.meta = { path: "full" }; // minimal hint only
  } else {
    // Lite: no runData yet, or minimal stub
    phasePacket.meta = { path: "lite" };
  }

  return { phasePacket, runData };
}
```

- In **TitleShell**:
    - After `titleExchange`, dispatch both to Redux:
        
        ```tsx
        dispatch(initRun(runData));           // new action, sets runSlice
        dispatch(requestTransition("02_select", result.phasePacket));
        commitExchange(result.phasePacket);   // only phasePacket to localStorage
        ```
        
    - Later phases read `runData` from Redux selector (`useAppSelector(selectRunData)`), mutate via actions, and only patch PhasePacket with deltas.

### 4. Migration / Compat Notes

- For existing localStorage packets: add a `normalizePacket(packet)` util that migrates old `selection`/`identity` â†’ new `player`/`gate`, then discard cruft.
- Once stable, remove deprecated fields entirely.
- In Staging (loop hub), that's where you pull full RunData for stats display, meta counters, keeper upgrades, etc.

This keeps the engine pure, reduces packet bloat, makes debugging trivial ("what does Select actually receive?"), and aligns perfectly with your "each phase only writes its designated fields" goal from the project map.

If you want, paste the current SelectShell (or its packet read logic) and we can see how it would consume this cleaner handoff. Or if you're ready to prototype the `runSlice`, I can sketch a quick Redux Toolkit slice for it.

How does this direction feel now that you're more awake? Ready to nuke the legacy fields and split the packets? ðŸš€

The direction you're heading with the **PhaseWallPacket** concept is excellent â€” it's a crisp way to think about the handoff: each phase gets a "wall inscription" that's **explicitly limited to what it needs to know right now** (where it came from, where it's going, and the minimal context to make its decisions and write its own additions). This enforces discipline, makes debugging trivial ("what did Title actually pass me?"), and keeps the engine clean and testable. The fact that it's **repurposable/expandable later** is a bonus â€” you can always widen the packet for debug modes, analytics, or future multiplayer/co-op variants without breaking the core loop.

Looking at **SelectShell** + **SelectScreen** + the DEFAULT_POOL, here's how the current implementation interacts with the incoming packet and what we can do to align it perfectly with the PhaseWallPacket philosophy.

### Current Flow in SelectShell (Quick Summary)

- Starts at `step = 0` (Guide), no gate init.
- User picks Guide â†’ Mode â†’ Vessel (local state only).
- On lock: reads `dudael:active_packet` from localStorage (fallback to minimal guest stub).
- Merges in `gate` and `player.vessel + stats` (from `buildVesselPacketStats`).
- Builds new packet via `buildPacket("02_select", "03_staging", { ...prev, gate, player: {...} })`.
- Dispatches transition with that packet.

**Strengths:**

- Clean separation: Screen is pure UI + callbacks; Shell owns step machine + packet mutation.
- Nice visual feedback (SVG sigils change on hover/selection, stat bars, theology notes).
- Vessel data centralized in `@data/vessels/data` and `vessels.ts`.

**Mismatch with PhaseWallPacket ideal:**

- It **reads the entire previous packet from localStorage** and spreads it (`...prev`), which risks carrying forward noise/cruft from Title (user preferences, telemetryConsent, selection pool, deprecated fields).
- It **assumes** the incoming packet has a usable `player` stub (or creates one implicitly via fallback).
- It **writes back** a potentially bloated packet to the next phase.
- DEFAULT_POOL is defined but **never used** in SelectShell â€” TitleExchange offers it in full path but Select ignores it completely (it hardcodes vessel choices via `vesselData`).

### Recommended Adjustments (Minimal Changes, Big Clarity Win)

1. **Make incoming packet the single source of truth** (no blind `...prev` spread)
    
    Replace the localStorage read + spread with a typed, normalized incoming packet from Redux (since `requestTransition` already carries it).
    
    In SelectShell:
    
    ```tsx
    // Assume you add a selector or pass via props/context â€” for now, read from Redux
    import { useAppSelector } from "@/app/hooks";
    import { selectCurrentPacket } from "@/app/phaseSlice";  // add this selector
    
    export default function SelectShell() {
        const incomingPacket = useAppSelector(selectCurrentPacket); // typed PhasePacket
        const dispatch = useAppDispatch();
    
        // ... rest of state
    
        const handleLockVessel = () => {
            if (!incomingPacket) {
                console.error("No incoming packet â€” cannot lock vessel");
                return;
            }
    
            const engineId = activeVesselId.toUpperCase() as VesselId;
            const vesselKey = activeVesselId as EngineVesselId;
            const stats = buildVesselPacketStats(engineId);
    
            const finalGate: GateSelection = { ...gate, vesselId: vesselKey };
    
            // Build **only** what we add â€” no blind spread
            const outgoingPacket = buildPacket("02_select", "03_staging", {
                // Preserve only what we need downstream (minimal PhaseWallPacket)
                user: incomingPacket.user,                // keep auth link if present
                player: {
                    ...(incomingPacket.player || { id: incomingPacket.user?.id || "guest" }),
                    vessel: engineId,
                    // sigil / displayName can come from incoming if set
                },
                gate: finalGate,
                // Add vessel-specific starters only if not already set
                alignmentSnapshot: {  // example â€” adjust to your needs
                    light: stats?.startingLight ?? 0,
                    dark: stats?.startingDark ?? 0,
                },
            });
    
            // Optional: update RunData in Redux here too (if you adopt the split)
            // dispatch(updateRun({ player: outgoingPacket.player, gate: finalGate }));
    
            dispatch(requestTransition("03_staging", outgoingPacket));
        };
    ```
    
    â†’ This ensures **each phase only sees/writes its designated slice**, matching your notes.
    
2. **Deprecate / Remove DEFAULT_POOL from Title â†’ Select handoff**
    - Since Select uses `vesselData` directly (not the pool), remove `pool` from ExchangeResult and TitleExchange entirely.
    - If you later want a "pre-selected" or "unlocked vessels only" mode, make it a filter on `vesselData` keys instead of a separate pool.
3. **Add incoming packet safety / normalization**
Small util (in types or a utils file):
    
    ```tsx
    export function getSafeIncomingPlayer(packet: PhasePacket | null): PlayerIdentity {
        if (!packet) return { id: `guest-${Date.now()}` };
        return packet.player || { id: packet.user?.id || "anonymous" };
    }
    ```
    
    Use it in Shell init if needed (e.g., set initial display name).
    
4. **CSS / Polish Quick Wins (since you're refactoring to Tailwind)**
    - The inline `style={{}}` blocks (e.g., `borderColor`, `background` gradients) are begging to move to classes.
    - Example refactor for footer:
        
        ```css
        /* SelectScreen.module.css or global */
        .spectral-footer {
            height: 4px;
            background: linear-gradient(90deg, transparent, var(--accent-60), var(--accent), var(--accent-60), transparent);
        }
        ```
        
        Then in JSX: `<div className="spectral-footer" style={{ '--accent': activeData.primaryHue } as React.CSSProperties} />`
        
    - Same for stat bars, buttons â€” define `-light`, `-dark`, `-resilience` vars per vessel.
5. **Next Phase (Staging) Expectation**
Staging should receive a packet with:
    - `player.vessel` locked
    - `gate` complete
    - Optional `alignmentSnapshot` as starting point
    
    If Staging reads the full bloated packet today, it will feel "off" â€” this refactor fixes that preemptively.
    

### Summary â€” What This Gives You

- **PhaseWallPacket realized**: Title writes minimal entry â†’ Select adds only `gate` + `player.vessel` + starters â†’ Staging gets clean context.
- No more legacy leak (selection, kind, pool, consent).
- Easy to expand later (add debug fields conditionally, or widen for meta-view modes).
- Redux carries the truth; localStorage only checkpoints at safe points (e.g., Drop).

If you paste the current `phaseSlice` (especially how `requestTransition` handles the packet) or StagingShell snippet, we can confirm the handoff chain. Otherwise â€” implement the safe outgoingPacket build in `handleLockVessel`, test a full Title â†’ Select â†’ Staging loop, and watch the console: the packet should be **noticeably smaller and clearer**.

How's it feeling now? Ready to try the non-spread version, or want to tackle RunData slice first?

Thanks for sharing the `phaseSlice.ts` â€” this gives a much clearer view of how transitions are orchestrated and how the packet flows through the system.

Your current setup is already quite strong in several ways:

- `requestTransition` is the single entry point (good single source of truth).
- It calls the framework-agnostic `engineTransition(from, to, fullPacket)` â€” preserving clean core isolation.
- Redux owns the current phase + meta snapshot (via `getRunMeta()`, `restoreSnapshot()`, etc.).
- `buildPacket` is used to create/override the packet safely.

But the **"off" feeling** you're chasing likely stems from this line in `requestTransition`:

```tsx
const fullPacket: PhasePacket | undefined = packet
  ? buildPacket(from, to, packet)
  : undefined;
```

When a phase (like Select) calls `dispatch(requestTransition("03_staging", updatedPacket))`, it passes its own `updatedPacket` which is built by spreading the previous one (`...prev`) + additions. This creates cumulative growth / cruft carry-over, exactly what you want to avoid with the PhaseWallPacket idea.

### Refined Recommendation: Make PhasePacket Truly "Wall-Only"

**Core Principle**

Each phase should:

- Read the incoming PhasePacket from Redux (via selector).
- Decide what **minimal new data** it needs to add for the **next phase only**.
- Build a **new, small PhasePacket** (not spreading the old one).
- Let persistent / run-long data (player identity, meta counters, loop history, vessel config) live exclusively in Redux's `runSlice` / meta snapshot.

### Step 1: Add a proper packet selector

In `phaseSlice.ts` (or a new `phaseSelectors.ts`):

```tsx
export const selectCurrentPacket = (state: RootState): PhasePacket | null => {
  // For now, we don't store the full packet in Redux â€” only phase + meta
  // So either:
  // A) Read from localStorage (temporary bridge)
  const raw = localStorage.getItem("dudael:active_packet");
  return raw ? JSON.parse(raw) as PhasePacket : null;

  // B) Better long-term: store the active packet slice in Redux too (see below)
};
```

### Step 2: Stop spreading previous packet in SelectShell

Update `handleLockVessel`:

```tsx
const handleLockVessel = () => {
  const incoming = useAppSelector(selectCurrentPacket);
  if (!incoming) {
    console.warn("No incoming packet in Select â€” using fallback");
    // minimal fallback
  }

  const engineId = activeVesselId.toUpperCase() as VesselId;
  const vesselKey = activeVesselId as EngineVesselId;
  const stats = buildVesselPacketStats(engineId);

  const finalGate: GateSelection = { ...gate, vesselId: vesselKey };

  // NEW: build **only** what Staging actually needs â€” no old cruft
  const outgoingPacket: PhasePacket = buildPacket("02_select", "03_staging", {
    // Only fields Staging should read
    user: incoming?.user,                       // keep auth link if needed
    player: {
      // Prefer incoming if exists, else minimal
      ...(incoming?.player || { id: incoming?.user?.id || `guest-${Date.now()}` }),
      vessel: engineId,
      // Do **not** put stats here unless Staging specifically needs snapshot
    },
    gate: finalGate,
    // Optional: small snapshot only if Staging needs immediate parity/depth start
    // alignmentSnapshot: { light: stats.startingLight ?? 0, dark: stats.startingDark ?? 0 },
  });

  // Side-effect: update persistent run data in meta / run slice
  // dispatch(updateVesselLock({ vesselId: engineId, gate: finalGate }));

  dispatch(requestTransition("03_staging", outgoingPacket));
};
```

### Step 3: Evolve Redux to Own More Persistent State

Currently `meta: RunMetaSnapshot` is in phase slice, but it's generic.

**Better long-term (add runSlice.ts)**:

```tsx
// src/app/runSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RunState = {
  runId: string | null;
  player: PlayerIdentity | null;
  gate: GateSelection | null;
  startingStats: VesselStats | null;   // from buildVesselPacketStats
  meta: RunMetaSnapshot;
  // future: inventory, confessions, breaches, loopCount, etc.
};

const initialState: RunState = {
  runId: null,
  player: null,
  gate: null,
  startingStats: null,
  meta: getRunMeta(),
};

const runSlice = createSlice({
  name: "run",
  initialState,
  reducers: {
    initRun(state, action: PayloadAction<Partial<RunState>>) {
      Object.assign(state, action.payload);
    },
    updateVesselLock(state, action: PayloadAction<{ vesselId: VesselId; gate: GateSelection }>) {
      if (state.player) {
        state.player.vessel = action.payload.vesselId;
      }
      state.gate = action.payload.gate;
    },
    // more actions: updateAlignment, incrementLoop, etc.
  },
});

export const { initRun, updateVesselLock } = runSlice.actions;
export const runReducer = runSlice.reducer;

// selectors
export const selectRunPlayer = (s: RootState) => s.run.player;
export const selectRunGate = (s: RootState) => s.run.gate;
```

Then in `TitleShell` (after `titleExchange`):

```tsx
dispatch(initRun({
  runId: `run-${Date.now()}`,
  player: result.runData?.player,   // if you adopt earlier suggestion
  meta: { path: result.path },
}));
```

And in SelectShell `handleLockVessel`:

```tsx
dispatch(updateVesselLock({ vesselId: engineId, gate: finalGate }));
// Then dispatch transition with very minimal packet
const outgoingPacket = buildPacket("02_select", "03_staging", {
  // almost empty â€” Staging reads player/gate from Redux
});
```

### Step 4: Make PhasePacket Optional / Minimal in requestTransition

Update the thunk:

```tsx
export function requestTransition(to: PhaseId, minimalPacket?: Partial<PhasePacket>) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const from = getState().phase.current;

    // Only build if something meaningful is passed
    const packetToSend = minimalPacket && Object.keys(minimalPacket).length > 0
      ? buildPacket(from, to, minimalPacket)
      : undefined;

    const result = engineTransition(from, to, packetToSend);

    if (!result.ok) {
      dispatch(transitionFailed(result.detail));
      return;
    }

    dispatch(setPhase(result.phase));
    dispatch(syncMeta()); // refresh UI-readable meta
  };
}
```

### Bottom Line for Portfolio Week

- Short-term fix (today): Stop spreading `...prev` in SelectShell â†’ build targeted outgoingPacket with only user/player/gate.
- Medium-term win (next 1â€“2 days): Introduce `runSlice` so persistent identity + meta live in Redux, PhasePacket becomes truly "wall-only" (often empty or just 2â€“3 fields).
- Result: Cleaner debugging, less serialization bloat, easier to reason about "what does Staging know?".

Test this: Add `console.log("Outgoing packet from Select:", outgoingPacket)` before dispatch â€” it should be small and focused.

Does this match the "PhaseWallPacket" vision in your notes? Want to focus on implementing runSlice next, or debug something specific in Staging?

Thanks for sharing the full set of core engine files â€” `meta.ts`, `manager.ts`, and `boot.ts`. This completes the picture of how the system bootstraps, persists run state, enforces transitions, and handles side effects.

The current design is thoughtful and consistent with clean core isolation:

- `manager.ts` is pure and side-effect-aware only for meta counters/history/identity lock.
- `meta.ts` acts as a centralized, mutable run accumulator (sessionStorage-backed snapshot).
- `boot.ts` handles recovery + packet commit, then defers actual transition to the surface (Redux via events).
- Redux (`phaseSlice`) owns the current phase + a readable meta copy.

But the "state not right" / "off" feeling after all-nighter tweaks likely comes from a few subtle mismatches between intent (PhaseWallPacket = minimal handoff) and implementation (cumulative packet growth + heavy reliance on localStorage for active packet + some field duplication between packet/meta).

### Key Observations from the Code

1. **Packet vs Meta Overlap / Duplication**
    - `PhasePacket` carries transient handoff data (user, player, gate, alignmentSnapshot?).
    - `RunMetaSnapshot` carries persistent run state (depth, loopCount, alignment, insight, parity, inventory, phaseHistory, identity).
    - But look at overlaps: `identity` in meta vs `player`/`identity` in packet; `alignment` in both; `phaseHistory` only in meta.
    - Side effects in `manager.ts` read from packet (`packet?.gate?.vesselId ?? packet?.identity?.vessel ?? packet?.player?.vessel`) â€” fallback chain shows legacy fields still in play.
2. **LocalStorage as Primary Packet Carrier**
    - `boot.ts` commits/reads `dudael:active_packet`.
    - SelectShell reads it directly and spreads `...prev`.
    - This creates the bloat/leak problem: every transition potentially carries all prior fields forward unless explicitly stripped.
3. **Good Parts Already in Place**
    - `applySideEffects` centralizes meta mutations (great!).
    - `engineTransition` validates legality (prevents bad jumps).
    - Recovery via snapshot is robust for reloads.
    - Redux defers to engine for validation but owns UI phase.

### Actionable Fixes to Make It Feel "Right"

### Fix 1: Make PhasePacket Truly Minimal (No Spreads, No Legacy Fallbacks)

- Define **exactly** what each transition should carry (your PhaseWallPacket vision).
- Update `SelectShell` (and others) to **not read localStorage** anymore â€” read incoming from Redux selector.
- Build outgoing with **only** the additions for the next phase.

Example tightened `PhasePacket` intent per transition:

| From â†’ To | Required Fields in Outgoing Packet | Why / What Next Needs |
| --- | --- | --- |
| 01_title â†’ 02_select | `{ user: { id } }` | Auth link only |
| 02_select â†’ 03_staging | `{ player: { id, vessel }, gate: full }` | Identity + choices locked |
| 03_staging â†’ 04_draft | `{ }` (empty) | All in meta/Redux |
| ... | Usually empty or tiny snapshot |  |

In `SelectShell` â†’ `handleLockVessel`:

```tsx
// Add selector
const incomingPacket = useAppSelector(selectCurrentPacket); // implement as read from Redux or bridge

// ...

const outgoingPacket = buildPacket("02_select", "03_staging", {
  player: {
    id: incomingPacket?.player?.id || incomingPacket?.user?.id || `guest-${Date.now()}`,
    vessel: engineId,
    // sigil if you have it
  },
  gate: finalGate,
  // NO spread, NO old identity/selection
});

dispatch(requestTransition("03_staging", outgoingPacket));
```

### Fix 2: Move Packet to Redux (Reduce localStorage Reliance)

Currently `phaseSlice` doesn't store the packet itself â€” only phase + meta copy.

Quick evolution:

```tsx
// phaseSlice.ts â€” add packet to state
type PhaseState = {
  current: PhaseId;
  packet: PhasePacket | null;  // active handoff packet
  lastError?: string;
  meta: Readonly<RunMetaSnapshot>;
};

const initialState: PhaseState = {
  current: ...,
  packet: readActivePacket(), // on init
  meta: ...
};

// In requestTransition thunk
const result = engineTransition(from, to, packetToSend);

if (result.ok) {
  dispatch(setPhaseAndPacket({ phase: result.phase, packet: packetToSend || null }));
  dispatch(syncMeta());
}

// New action
setPhaseAndPacket(state, action: PayloadAction<{ phase: PhaseId; packet: PhasePacket | null }>) {
  state.current = action.payload.phase;
  state.packet = action.payload.packet;
  state.meta = getRunMeta();
  // Also commit to localStorage if desired
  if (action.payload.packet) commitActivePacket(action.payload.packet);
}
```

Then selectors:

```tsx
export const selectCurrentPacket = (s: RootState) => s.phase.packet;
```

This makes Redux the **single authority** for the active packet â€” no more direct localStorage reads in components.

### Fix 3: Clean Up Legacy Fallbacks in manager.ts

Update `applySideEffects`:

```tsx
if (from === "02_select" && to === "03_staging") {
  const vesselSource = packet?.player?.vessel ?? packet?.gate?.vesselId;
  if (!vesselSource) {
    console.warn("No vessel found in packet during lock");
    return;
  }
  lockIdentity({
    userId: packet?.user?.id,
    vessel: vesselSource,
    sigil: packet?.player?.sigil,
  });
}
```

Drop the `packet?.identity?.vessel` fallback â€” it's legacy.

### Fix 4: Boot & Recovery Alignment

In `boot.ts`, when recovering:

- Hydrate meta (already does).
- Set initial packet in Redux via event or direct dispatch (if you move packet to Redux state).
- The `dudael:boot_packet` event can carry the recovered packet to TitleShell/SelectShell if needed.

### Quick Test Plan (While Still Up)

1. Console.log the outgoing packet in `SelectShell` after changes â€” confirm it's small (user + player + gate only).
2. After locking vessel â†’ check `sessionStorage.dudael:run_meta` â€” identity should be locked, phaseHistory updated.
3. Reload page mid-run â†’ recovery should restore meta, Redux should start at correct phase.
4. If still off, log `getRunMeta()` after each transition â€” see if alignment/parity/depth update as expected.

This gets you to a state where the system feels **tight and intentional** â€” no mystery data flowing around, clear separation between transient handoff (PhaseWallPacket) and persistent run truth (meta + future runSlice).

What's the most annoying symptom right now after these pieces? (e.g., identity not locking, parity wrong in Staging, loop not counting, or packet still bloated downstream?) Let's zero in. You've built something really coherent here â€” just a few cleanups away from "yes, this is right." ðŸ’ª

Got it, Vincent â€” thanks for uploading the fresh hand-drawn map. I can see it clearly now, and it aligns beautifully with the "PhaseWallPacket" concept we've been refining.

### Quick Interpretation of Your Drawing

- The **vertical "wall"** structure down the center represents the **PhaseWall** â€” the strict boundary/interface that each phase sees and writes to.
- Left side: **"Run Repo" / Run Data** (persistent, accumulated state: identity, vessel, meta counters, loop history, confessions/breaches, etc.).
- Right side: **"Outside" / Radiant Systems / Sinerine sovereign layer** (external world: user profile from Supabase, preferences, telemetry consent, unlocks, codex progress, etc.).
- **Phases** are horizontal boxes connected via the wall.
- Arrows show **access control**:
    - Phases can **read from Run Repo** (via Redux/meta).
    - Phases **write only to the wall** (PhaseWallPacket) for the next phase.
    - **Outside world** can **only touch Run Repo in Staging** (the reset/hub point after Drop or loop completion).
    - During an active descent (inside a run), **no external updates** â€” player is isolated/protected ("can't be updated by the outside while in the run").
- Button press â†’ **wall transfer** (commit packet + transition) â†’ phase leaves, next phase enters with clean wall inscription.

This is a **very strong mental model** â€” it's basically a clean **read-only/run-isolated** pattern with Staging as the sole **reconciliation point**. It protects the integrity of the descent while allowing meta-progression.

### How This Maps to Your Current Code (and Where to Tighten)

Your existing pieces already support this vision pretty well â€” we just need to enforce the boundaries more strictly.

| Concept from Drawing | Current Code Location | Adjustment Needed |
| --- | --- | --- |
| **PhaseWall** (what phase sees/writes) | PhasePacket + requestTransition | Make packet **always minimal** (no spreads). Add selector for current packet in Redux. |
| **Run Repo** (persistent run state) | RunMetaSnapshot (meta.ts) + sessionStorage | Already good. Consider moving more fields (player/vessel/gate) here instead of duplicating in packet. |
| **Outside world access** | Supabase / localStorage profile load (TitleExchange) | Restrict writes/updates to **Staging only** (Drop â†’ Staging transition triggers sync). |
| **Isolation during run** | No direct external writes mid-run | Enforce by **not reading Supabase/profile mid-descent** â€” only at boot/recovery or Staging. |
| **Button = wall transfer** | onLockVessel / dispatch(requestTransition) | Perfect â€” just make the packet built in the button handler **tiny** (only additions). |
| **Staging as reconciliation** | 03_staging phase | This is where you should pull latest meta, sync any outside changes (unlocks, codex), and decide next loop/drop. |

### Concrete Next Steps (to Make It "Feel Right")

1. **Stop using localStorage as active packet source in phases**
    - Implement `selectCurrentPacket` in Redux (as sketched earlier).
    - In SelectShell (and future phases): read incoming packet from Redux selector, **not** `localStorage.getItem("dudael:active_packet")`.
    - In `requestTransition` success: store the outgoing packet in Redux state (add `packet` field to PhaseState).
2. **Enforce minimal wall writes**
Example for Select â†’ Staging (in `handleLockVessel`):
    
    ```tsx
    const outgoingWallPacket = buildPacket("02_select", "03_staging", {
      // Only 3 fields â€” clean wall inscription
      player: {
        id: incoming?.player?.id || "fallback-guest",
        vessel: engineId,
      },
      gate: finalGate,
      // Nothing else â€” no user prefs, no meta, no inventory
    });
    ```
    
3. **Move vessel lock to meta / run repo**
In `manager.ts` `applySideEffects` (already almost there):
    
    ```tsx
    if (from === "02_select" && to === "03_staging") {
      const vessel = packet?.player?.vessel ?? packet?.gate?.vesselId;
      if (vessel) {
        lockIdentity({ vessel });
        // Optionally store full gate too if needed
      }
    }
    ```
    
4. **Staging becomes the "sovereign checkpoint"**
When entering Staging (from Drop or Door):
    - Read latest meta (via `getRunMeta()`).
    - If outside changes pending (e.g., new codex unlock via Supabase), apply them here.
    - Decide next action (re-enter descent, drop to title, etc.).
    - This matches your drawing: only Staging has arrow from "Outside" â†’ Run Repo.
5. **Quick validation test**
    - Start run â†’ go through Title â†’ Select â†’ lock vessel.
    - Console.log `getRunMeta()` after transition â†’ check `identity.vessel` is set, `phaseHistory` updated.
    - Reload â†’ recovery should restore meta, packet should be re-hydrated minimally.

### Overall Impression

Your map is **gold** â€” it captures the sovereignty/isolation/protection intent perfectly. Sinerine (Radiant Systems sovereign) controls the outside, phases are sacred/isolated during descent, Staging is the temple gate where reconciliation happens.

Once you eliminate the spreads and make packet = wall-only, the "off" feeling should vanish â€” everything will feel locked down, predictable, and intentional.

Want to focus on:

- Adding `packet` to Redux phase state?
- Sketching StagingShell logic with this model?
- Or debugging a specific symptom (e.g., identity not persisting after reload)?

You're really close â€” this is portfolio-level systems thinking. What's the next pain point screaming at you? ðŸ˜„

Yes, let's do exactly that â€” a clean, step-by-step recap + walkthrough of the full run loop as it exists today in your DUDAEL Workbench (v0.1.0-loop-ish state). We'll trace it from boot â†’ Title â†’ Select â†’ Staging â†’ Draft â†’ Level â†’ Door â†’ Drop â†’ back to Staging (or Title), highlighting what data lives where, how the **PhaseWallPacket** handoff works in practice, where meta gets mutated, and where the "off" feeling might still linger.

This is based on everything you've shared: your diagrams, code snippets (Title/Select shells + exchange, phaseSlice, meta.ts, manager.ts, boot.ts), the project map doc, and the hand-drawn PhaseWall / Run Repo / Outside map.

### High-Level Run Structure (Hades-style meta-loop)

1. **Boot / Recovery** â†’ recover snapshot if mid-run, or start fresh
2. **01_title** â†’ user â†’ player stub (lite or full path)
3. **02_select** â†’ Guide + Mode + Vessel lock â†’ identity locked
4. **03_staging** â†’ hub: see meta, keepers, decide next descent or drop
5. **04_draft** â†’ card picks, parity shaping
6. **05_level** â†’ gameplay (3x3 taps? mini-game), hits/misses, alignment shifts
7. **06_door** â†’ parity check, costs scale by depth, choose Light/Dark/Secret
8. **07_drop** â†’ death/timeout/Big Turner â†’ feed meta (confessions, breaches, loop+), reset depth
9. **â†’ back to Staging** (or Title on full reset)

Persistent truth = **RunMetaSnapshot** (meta.ts + sessionStorage)

Transient handoff = **PhaseWallPacket** (minimal, phase-to-phase only)

Outside sync = **only in Staging** (or Title for fresh starts)

### Walkthrough: One Full Descent Loop

**0. Boot (phases/boot.ts + Redux init)**

- `recoverRun()` â†’ restoreSnapshot() from sessionStorage
- If snapshot exists â†’ hydrateFromSnapshot(), set initial phase from phaseHistory.last
- If not â†’ clearSnapshot(), start at "01_title"
- `boot()` listens for "dudael:exchange" event (from Title button)
- Current packet in localStorage ("dudael:active_packet") is read only for recovery/compat â€” **should move to Redux soon**

**Redux state after boot**

- phase.current = "01_title" (or recovered)
- phase.meta = hydrated RunMetaSnapshot (or defaults: depth=0, loop=0, alignment=0/0, etc.)

**1. 01_title â†’ ENTER DROP**

- TitleShell â†’ handleEnterDrop â†’ loadUserProfile() (localStorage or Supabase)
- titleExchange(profile, pool) â†’ decides full/lite path
    - full: offers selection pool (but ignored today)
    - lite: creates guest player
- commitExchange() â†’ writes PhaseWallPacket to localStorage
- dispatch(requestTransition("02_select", packet))
- engineTransition() validates â†’ pushPhase("02_select"), no side effects yet
- Redux: phase.current = "02_select", meta unchanged

**Packet at this point** (minimal wall)

```json
{
  "from": "01_title",
  "to": "02_select",
  "ts": 1741023456789,
  "user": { "id": "guest:uuid-or-supabase-id" },
  "meta": { "path": "lite" }  // or "full"
}
```

**2. 02_select â†’ Lock Vessel**

- SelectShell local state: step 0â†’1â†’2, gate builds up
- On lock â†’ reads incoming packet from localStorage (problem spot â€” should be Redux)
- Builds outgoing packet with spread (...prev) + gate + player.vessel + stats
- dispatch(requestTransition("03_staging", outgoingPacket))
- engineTransition() â†’ validates, pushPhase("03_staging")
- applySideEffects() â†’ lockIdentity({ userId, vessel }) from packet
- meta.identityLocked = true, meta.identity.vessel set

**Ideal wall packet here (after fix)**

```json
{
  "from": "02_select",
  "to": "03_staging",
  "ts": ...,
  "player": { "id": "...", "vessel": "SERAPH" },
  "gate": { "guide": "light", "mode": "steward", "vesselId": "seraph" }
}
```

â†’ No old cruft, no pool, no consent.

**3. 03_staging (hub)**

- Reads meta from Redux (getRunMeta()) â€” shows depth, loopCount, alignment/parity, inventory, identity
- Surveyor/Smuggler offerings based on parity
- Player can:
    - Start new descent â†’ Draft
    - Drop to Title (full reset)
    - **Sync outside world** (new unlocks, codex entries from Supabase) â€” this is the only safe point

**4â€“7. Draft â†’ Level â†’ Door â†’ Drop**

- Each transition: minimal wall packet (often empty after Select)
- Side effects mutate meta:
    - Draft â†’ card picks â†’ alignment shifts (shiftAlignment)
    - Level â†’ hits/misses â†’ more shifts
    - Door â†’ parity check, cost payment
    - Drop â†’ loop+ (incLoop if failed door), confessions/breaches, depth reset
- Packet stays tiny; all progression in meta

**8. Back to Staging**

- From Drop â†’ Staging allowed in LEGAL map
- meta.loopCount increased, new keepers/unlocks visible
- Player decides: descend again or exit

### Where the "Off" Feeling Likely Lives Today

- **Packet bloat** from spreads in SelectShell â†’ downstream phases see unnecessary fields
- **localStorage reads** in shells â†’ desync risk if Redux/meta diverges
- **Identity fallback chain** in manager.ts â†’ legacy fields polluting logic
- **No clear Run Repo separation** â†’ meta holds everything, packet duplicates some

### Quick "Make It Feel Right" Checklist (Do These 3 Today)

1. **Kill spreads** â€” in SelectShell (and future phases) build packet from incoming selector + only new fields
2. **Move active packet to Redux** â€” add `packet: PhasePacket | null` to phaseSlice, update in requestTransition success
3. **Remove direct localStorage reads** in components â€” use selectCurrentPacket

After that the loop should feel **locked down** like your drawing: phases write only to the wall, Run Repo (meta) accumulates safely, outside touches only Staging.

Want to simulate one full loop in words (Title â†’ Select â†’ ... â†’ Drop â†’ Staging) with example values for meta/packet at each step? Or focus on implementing one of the 3 fixes above (I can paste exact code diffs)? ðŸ˜Š

You're so close â€” this system has real elegance once the packet is truly wall-only. What's the next piece you want to nail?

- **Core insight (root cause): â€œdata shape driftâ€ is the real bug**
    - Your loop feels stable because transitions are centralized (engine â†’ Redux â†’ router), but the *packet contents* are not disciplined.
    - Legacy/duplicated fields (`identity`, `selection`, `kind`, `isLegacy`) and â€œliteâ€ variants create ambiguous sources of truth, so downstream phases behave â€œoffâ€ without crashing.
- **Architecture insight: you are converging on a strong boundary model**
    - The emerging pattern is clear: **PhaseWallPacket** should be a minimal, phase-to-phase handoff, while **Run Repo / meta** should own persistent run state.
    - The biggest mismatch called out repeatedly: phases reading from localStorage and spreading `...prev` reintroduces bloat and defeats the â€œwall-onlyâ€ contract.
- **Execution insight: three leverage points fix most of the â€œoffâ€ feeling**
    - Stop packet spreading and build **targeted outgoing packets** per transition (Title â†’ Select, Select â†’ Staging, etc.).
    - Make Redux the **single authority for the active packet** so phases do not read localStorage directly.
    - Remove legacy fallback chains in side effects (manager/meta) so only canonical fields drive identity lock and progression.

- **Core insight (root cause): â€œdata shape driftâ€ is the real bug**
    - Your loop feels stable because transitions are centralized (engine â†’ Redux â†’ router), but the *packet contents* are not disciplined.
    - Legacy/duplicated fields (`identity`, `selection`, `kind`, `isLegacy`) and â€œliteâ€ variants create ambiguous sources of truth, so downstream phases behave â€œoffâ€ without crashing.
- **Architecture insight: you are converging on a strong boundary model**
    - The emerging pattern is clear: **PhaseWallPacket** should be a minimal, phase-to-phase handoff, while **Run Repo / meta** should own persistent run state.
    - The biggest mismatch called out repeatedly: phases reading from localStorage and spreading `...prev` reintroduces bloat and defeats the â€œwall-onlyâ€ contract.
- **Execution insight: three leverage points fix most of the â€œoffâ€ feeling**
    - Stop packet spreading and build **targeted outgoing packets** per transition (Title â†’ Select, Select â†’ Staging, etc.).
    - Make Redux the **single authority for the active packet** so phases do not read localStorage directly.
    - Remove legacy fallback chains in side effects (manager/meta) so only canonical fields drive identity lock and progression.

If you want, I can focus on one angle next: **(1) the â€œdata shape driftâ€ diagnosis**, **(2) the PhaseWall vs Run Repo boundary**, or **(3) the â€œthree leverage pointsâ€ implementation plan**.

- **What the boundary *is***
    - **PhaseWall (PhaseWallPacket)** is the *handoff contract* between phases. It should be small, explicit, and only contain what the *next* phase needs to make its immediate decisions.
    - **Run Repo (RunData / meta snapshot)** is the *persistent source of truth* for the entire run. It holds identity, vessel lock, counters, progression, and anything you expect to still exist after multiple phase hops or a reload.
- **What belongs on the PhaseWall (rules of thumb)**
    - **Only â€œjust-in-timeâ€ transition context**, not history.
    - **Only data the next phase cannot derive** from the Run Repo.
    - **Only fields that are meaningful for exactly one hop** (or a very short chain), like:
        - Title â†’ Select: `{ user: { id }, pathHint }`
        - Select â†’ Staging: `{ player: { id, vessel }, gate }`
        - Staging â†’ Draft: often `{}` (empty) if Draft reads everything from Run Repo
    - **No legacy compatibility fields**. If you must support them, normalize at the boundary once, then drop them.
- **What belongs in Run Repo (rules of thumb)**
    - **Anything that accumulates**, mutates over time, or is used by multiple phases:
        - Locked identity (canonical `player`, vessel, sigil)
        - Gate selection once finalized
        - Alignment, parity, depth, inventory, draft picks, loopCount, confessions/breaches
        - Phase history, runId, death/drop reasons
    - **Anything needed for recovery** (reload mid-run should reconstruct state from Run Repo alone, without needing a â€œfat packetâ€).
- **The key invariant that makes the model â€œfeel rightâ€**
    - A phase may **read** from Run Repo as much as it wants.
    - A phase may **write** to Run Repo only via *explicit reducers/side effects* tied to transitions (for example â€œSelect â†’ Staging locks identityâ€).
    - A phase may **write** to PhaseWall only what the next phase needs, and it should *not* forward unknown fields (`...prev` is the main boundary violation).
- **Practical way to draw the line (quick test)**
    - If a field answers â€œwhat is true about this run?â€ â†’ **Run Repo**.
    - If a field answers â€œwhat must the next phase know right now?â€ â†’ **PhaseWall**.
    - If youâ€™re tempted to include it â€œjust in caseâ€ â†’ it probably belongs in **Run Repo** (or nowhere).
- **Where your current â€œoffâ€ feeling comes from (boundary violations)**
    - Reading localStorage packets inside phases and spreading them forward makes PhaseWall behave like a second Run Repo.
    - Fallback chains like `packet.gate ?? packet.identity ?? packet.player ?? packet.selection` blur the contract and keep legacy alive past normalization.

If you tell me **one specific transition** you want to harden first (Titleâ†’Select or Selectâ†’Staging is usually best), I can outline the exact â€œWall fieldsâ€ vs â€œRepo fieldsâ€ for that hop in bullet points.

- **What â€œdata shape driftâ€ means in your loop**
    - The object that crosses phase boundaries (your packet) slowly turns into a â€œjunk drawer.â€
    - Fields get added for one moment in time, then later phases start relying on them, and eventually you have multiple ways to represent the same concept.
    - Result: nothing hard-crashes, but behavior feels â€œoffâ€ because different phases read different â€œtruthsâ€ from different fields.
- **The clearest symptom you already described: multiple competing â€œplayer identityâ€ shapes**
    - You have overlapping representations like:
        - `packet.player`
        - `packet.identity`
        - `packet.selection` (deprecated Choice shape)
        - plus legacy flags like `kind` or `isLegacy`
    - When Title or Select writes *some* of these and downstream phases read *a different one*, you get silent mismatch (for example Select expects `player.vessel`, but Title only populated `identity.vessel`, or a â€œliteâ€ player omits stats that later logic assumes exist).
- **How drift happens mechanically (the two most common causes in what you wrote)**
    - **Blind forwarding (`...prev`)**
        - Any phase that builds an outgoing packet by spreading the previous packet is *guaranteeing* drift, because old fields that should have died remain alive forever.
    - **Fallback chains as â€œcompat foreverâ€**
        - Logic like â€œuse `gate.vesselId` else `identity.vessel` else `player.vessel`â€¦â€ keeps legacy fields effectively canonical, because they never stop influencing behavior.
- **Why this creates the â€œoffâ€ feeling instead of obvious bugs**
    - The loop orchestration is correct (central transition authority), so navigation works.
    - The engine/meta layer still progresses.
    - But downstream phases might receive *valid-looking* objects with subtly wrong or missing sub-fields, which causes:
        - incorrect defaulting (guest stats, parity baselines)
        - inconsistent UI (showing a vessel in one place, missing in another)
        - state that seems to â€œchange its mindâ€ across reloads or transitions
- **Diagnosis checklist (fast way to pinpoint the drift)**
    - **List the canonical fields** for each concept (player identity, vessel choice, alignment, meta counters).
    - For each phase transition, answer:
        - â€œWhich exact fields does this phase WRITE?â€
        - â€œWhich exact fields does the next phase READ?â€
    - Any concept with **more than one write location** or **more than one read key** is a drift hotspot.
- **The most actionable framing**
    - Drift is not primarily â€œwrong values.â€
    - Drift is **too many representations of the same value**, and phases disagreeing about which one is real.

If you name the *first concrete mismatch you see* (for example â€œSelect complains vessel is missing,â€ or â€œidentity locks but UI still shows guestâ€), I can map it to the exact duplicate fields that are causing that drift in your current shapes.

- **Leverage point 1: Kill packet spreading (â€œno `...prev`â€)**
    - **Goal:** Stop PhaseWall packets from turning into a second Run Repo.
    - **Change:** In every phase that emits a packet, build the outgoing packet from *only*:
        - the fields the *next* phase needs, and
        - any brand-new fields the current phase is responsible for adding.
    - **Rule:** Outgoing packet should look like a â€œdiff,â€ not a â€œcopy.â€
    - **Example target (Select â†’ Staging):**
        - Keep: `player: { id, vessel }`, `gate`
        - Drop: `identity`, `selection`, legacy flags, any unrelated meta blobs
- **Leverage point 2: Make Redux the single authority for the active packet (no localStorage reads in phases)**
    - **Goal:** Remove desync and ambiguity caused by components reading/writing â€œactive_packetâ€ directly.
    - **Change:** Store `packet: PhasePacket | null` in Redux state (alongside `current` phase).
    - **Flow:**
        - `requestTransition(to, partialPacket)` builds the outgoing packet.
        - On success, Redux sets:
            - `phase.current = result.phase`
            - `phase.packet = outgoingPacket || null`
        - LocalStorage becomes optional and only for recovery/checkpointing, not the runtime source of truth.
- **Leverage point 3: Remove legacy fallback chains in side effects (canonical fields only)**
    - **Goal:** Prevent â€œcompat foreverâ€ from keeping drift alive.
    - **Change:** In manager/meta side effects, stop doing:
        - `gate.vesselId ?? identity.vessel ?? player.vessel ?? selection...`
    - **Replace with:** one canonical read path (for example):
        - `packet.player.vessel` (or `packet.gate.vesselId`, but pick one as canonical per transition)
    - **Migration strategy:** If you still need to support old packets, normalize *once at the boundary* (boot/recovery or packet ingestion), then never write or read deprecated fields again.

Want this written as a strict â€œcontract tableâ€ per transition (Titleâ†’Select, Selectâ†’Staging, Stagingâ†’Draft, etc.), listing exactly what the PhaseWall may contain for each hop?

- **PhaseWall contract table (strict â€œwhat may be on the wallâ€ per hop)**
    - **01_title â†’ 02_select**
        - **Must:** `user: { id }` (or a generated guest id)
        - **May:** `pathHint: "lite" | "full"` (or equivalent)
        - **Must not:** `player`, `gate`, `identity`, `selection`, any run-long meta
    - **02_select â†’ 03_staging**
        - **Must:** `player: { id, vessel }`
        - **Must:** `gate: { guide, mode, vesselId }` (whatever constitutes â€œlockedâ€)
        - **May:** `alignmentSnapshot` *only if* Staging needs an immediate starting baseline and cannot derive it from Run Repo
        - **Must not:** any legacy identity fields (`identity`, `selection`) or â€œfull packet spreadâ€
    - **03_staging â†’ 04_draft**
        - **Must:** *(usually nothing)*
        - **May:** a tiny `draftSeed` or `offerSetId` if Draft needs a deterministic seed for a single descent
        - **Must not:** inventory, alignment history, or card lists (those live in Run Repo)
    - **04_draft â†’ 05_level**
        - **Must:** *(usually nothing)*
        - **May:** `draftResultId` / `loadoutId` if Level needs a single pointer to what was drafted
        - **Must not:** the entire drafted set, unless Level literally cannot read Run Repo
    - **05_level â†’ 06_door**
        - **Must:** *(usually nothing)*
        - **May:** `doorPreview` (small) if Door needs one computed summary that you intentionally donâ€™t persist
        - **Must not:** full combat log / full state dump
    - **06_door â†’ 07_drop**
        - **Must:** *(usually nothing)*
        - **May:** `doorChoice: "light" | "dark" | "secret"` and/or `paidCostSummary` if Drop needs to render a recap and you donâ€™t want to recompute
        - **Must not:** alignment/current stats (those should already have been committed to Run Repo by side effects)
    - **07_drop â†’ 03_staging**
        - **Must:** *(usually nothing)*
        - **May:** `dropReason` (small enum) if Staging needs to show â€œwhy you droppedâ€ without looking up logs
        - **Must not:** loopCount/depth resets in the packet (those are Run Repo mutations)
- **Run Repo contract table (what must be persistent and *never* required from the wall)**
    - **Canonical identity:** `player` (id, vessel once locked, sigil/displayName if you keep them)
    - **Locked choices:** `gate` once Select completes
    - **Progression:** `depth`, `loopCount`, confessions/breaches, unlock flags
    - **Mutable run state:** alignment/parity, inventory/loadout, draft picks, etc.
    - **Recovery:** enough to reload mid-run without needing a fat PhaseWall packet
- **One â€œenforcementâ€ rule that makes the table real**
    - Every transition handler should follow: **OutgoingWall = { onlyNextPhaseNeeds }**, and everything else must already be in Run Repo (or computed by next phase from Run Repo).
    - If you catch yourself adding a field â€œjust in case,â€ that field belongs in Run Repo (or shouldnâ€™t exist).

If you tell me your actual phase ids (for example `01_title`, `02_select`, `03_staging`, `04_draft`, etc.) and any *non-standard* phases, I can reprint this same table using your exact names and your canonical field names (`gate`, `identityLocked`, `phaseHistory`, and so on).

- **Phase ID scheme (names are fine)**
    - Use stable *top-level* phase ids for the â€œwall-to-wallâ€ handoff, for example:
        - `title` â†’ `select` â†’ `staging` â†’ `draft` â†’ `level` â†’ `door` â†’ `drop` â†’ `staging`
    - Treat sub-phases as *internal UI state*, not true PhaseWall transitions:
        - `select.guide`, `select.mode`, `select.vessel`
        - `draft.pick1`, `draft.pick2`, `draft.pick3`
    - Only the parent phase participates in the engine legality map and in the wall contract.
- **Contract table (wall-to-wall only, ignoring sub-phases)**
    - **`title` â†’ `select`**
        - **Must:** `user: { id }` (guest ok)
        - **May:** `pathHint: "lite" | "full"`
        - **Must not:** `player`, `gate`, `identity`, `selection`, run counters
    - **`select` â†’ `staging`** *(this is the â€œidentity lockâ€ wall)*
        - **Must:** `player: { id, vessel }` *(canonical identity output)*
        - **Must:** `gate: { guide, mode, vesselId }` *(finalized)*
        - **May:** `alignmentSnapshot` *(only if staging truly canâ€™t derive starting alignment from Run Repo)*
        - **Must not:** legacy `identity`, `selection`, or any `...prev` carry-forward fields
    - **`staging` â†’ `draft`**
        - **Must:** *(usually nothing)*
        - **May:** `draftSeed` or `offerSetId` *(a single pointer for determinism)*
        - **Must not:** inventory, alignment history, full card pools
    - **`draft` â†’ `level`**
        - **Must:** *(usually nothing)*
        - **May:** `loadoutId` / `draftResultId` *(pointer only)*
        - **Must not:** full drafted list if it already lives in Run Repo
    - **`level` â†’ `door`**
        - **Must:** *(usually nothing)*
        - **May:** `doorPreview` *(tiny summary, optional)*
        - **Must not:** full logs / full state dumps
    - **`door` â†’ `drop`**
        - **Must:** *(usually nothing)*
        - **May:** `doorChoice` *(enum)*, `paidCostSummary` *(tiny recap)*
        - **Must not:** depth/loop/alignment mutations in the packet (those are Run Repo side effects)
    - **`drop` â†’ `staging`**
        - **Must:** *(usually nothing)*
        - **May:** `dropReason` *(enum)*
        - **Must not:** loopCount/depth resets in the packet
- **How sub-phases fit (important)**
    - Sub-phases *can* write to local component state freely.
    - Only at the â€œcommitâ€ moment (for example Selectâ€™s â€œLock Vesselâ€, Draftâ€™s â€œConfirm Picksâ€) do you emit the **single** wall packet for the parent phase transition.

If you tell me what you want the **canonical `gate` shape** to be (just `guide/mode/vesselId`, or more), I can tighten the â€œMustâ€ fields for `select â†’ staging` so itâ€™s unambiguous and drift-proof.

- **Phase ID scheme (names are fine)**
    - Use stable *top-level* phase ids for the â€œwall-to-wallâ€ handoff, for example:
        - `title` â†’ `select` â†’ `staging` â†’ `draft` â†’ `level` â†’ `door` â†’ `drop` â†’ `staging`
    - Treat sub-phases as *internal UI state*, not true PhaseWall transitions:
        - `select.guide`, `select.mode`, `select.vessel`
        - `draft.pick1`, `draft.pick2`, `draft.pick3`
    - Only the parent phase participates in the engine legality map and in the wall contract.
- **Contract table (wall-to-wall only, ignoring sub-phases)**
    - **`title` â†’ `select`**
        - **Must:** `user: { id }` (guest ok)
        - **May:** `pathHint: "lite" | "full"`
        - **Must not:** `player`, `gate`, `identity`, `selection`, run counters
    - **`select` â†’ `staging`** *(this is the â€œidentity lockâ€ wall)*
        - **Must:** `player: { id, vessel }` *(canonical identity output)*
        - **Must:** `gate: { guide, mode, vesselId }` *(finalized)*
        - **May:** `alignmentSnapshot` *(only if staging truly canâ€™t derive starting alignment from Run Repo)*
        - **Must not:** legacy `identity`, `selection`, or any `...prev` carry-forward fields
    - **`staging` â†’ `draft`**
        - **Must:** *(usually nothing)*
        - **May:** `draftSeed` or `offerSetId` *(a single pointer for determinism)*
        - **Must not:** inventory, alignment history, full card pools
    - **`draft` â†’ `level`**
        - **Must:** *(usually nothing)*
        - **May:** `loadoutId` / `draftResultId` *(pointer only)*
        - **Must not:** full drafted list if it already lives in Run Repo
    - **`level` â†’ `door`**
        - **Must:** *(usually nothing)*
        - **May:** `doorPreview` *(tiny summary, optional)*
        - **Must not:** full logs / full state dumps
    - **`door` â†’ `drop`**
        - **Must:** *(usually nothing)*
        - **May:** `doorChoice` *(enum)*, `paidCostSummary` *(tiny recap)*
        - **Must not:** depth/loop/alignment mutations in the packet (those are Run Repo side effects)
    - **`drop` â†’ `staging`**
        - **Must:** *(usually nothing)*
        - **May:** `dropReason` *(enum)*
        - **Must not:** loopCount/depth resets in the packet
- **How sub-phases fit (important)**
    - Sub-phases *can* write to local component state freely.
    - Only at the â€œcommitâ€ moment (for example Selectâ€™s â€œLock Vesselâ€, Draftâ€™s â€œConfirm Picksâ€) do you emit the **single** wall packet for the parent phase transition.

If you tell me what you want the **canonical `gate` shape** to be (just `guide/mode/vesselId`, or more), I can tighten the â€œMustâ€ fields for `select â†’ staging` so itâ€™s unambiguous and drift-proof.