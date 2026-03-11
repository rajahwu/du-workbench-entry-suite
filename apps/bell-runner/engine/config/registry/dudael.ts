// =============================================================================
// DUDAEL — BELL ENGINE CONFIGURATION
// engine/phases/dudael.ts
//
// This is where DUDAEL meets the Bell Engine.
// Defines the 7 phases, all legal edges, and domain-specific seals.
//
// The engine doesn't know about vessels, parity, or keepers.
// This file teaches it DUDAEL's rules.
// =============================================================================

import type {
    PhaseDefinition,
    EdgeDefinition,
    EngineConfig,
} from '../types';

import { stateSeal, oneWayGate, payloadSeal } from '../seals';


// -----------------------------------------------------------------------------
// DUDAEL GAME STATE (what the engine sees through getState)
// -----------------------------------------------------------------------------

export interface DudaelState {
    identityLocked: boolean;
    vesselId: string | null;
    guide: 'light' | 'dark' | null;
    mode: 'steward' | 'solo' | null;
    depth: number;
    loopCount: number;
    currentLight: number;
    currentDark: number;
    insight: number;
    runActive: boolean;
}


// -----------------------------------------------------------------------------
// PHASES — the 7-phase descent
// -----------------------------------------------------------------------------

export const DUDAEL_PHASES: PhaseDefinition[] = [
    { id: '01_title', slot: 1, kind: 'entry', label: 'Title' },
    { id: '02_select', slot: 2, kind: 'select', label: 'Select' },
    { id: '03_staging', slot: 3, kind: 'prep', label: 'Staging' },
    { id: '04_draft', slot: 4, kind: 'encounter', label: 'Draft' },
    { id: '05_level', slot: 5, kind: 'encounter', label: 'Level' },
    { id: '06_door', slot: 6, kind: 'branch', label: 'Door' },
    { id: '07_drop', slot: 7, kind: 'terminal', label: 'Drop' },
];


// -----------------------------------------------------------------------------
// DOMAIN SEALS — DUDAEL's rules
// -----------------------------------------------------------------------------

const hasVessel = stateSeal<DudaelState>(
    'du:has-vessel',
    'A vessel must be selected before staging',
    state => state.vesselId !== null,
);

const hasGuide = stateSeal<DudaelState>(
    'du:has-guide',
    'A guide must be chosen before staging',
    state => state.guide !== null,
);

const hasMode = stateSeal<DudaelState>(
    'du:has-mode',
    'A descent mode must be chosen before staging',
    state => state.mode !== null,
);

const identityNotLocked = oneWayGate<DudaelState>(
    'du:identity-gate',
    'Cannot return to select after identity is locked',
    state => state.identityLocked,
);

const runIsActive = stateSeal<DudaelState>(
    'du:run-active',
    'A run must be active',
    state => state.runActive,
);


// -----------------------------------------------------------------------------
// EDGES — the legal transition map
// -----------------------------------------------------------------------------

export const DUDAEL_EDGES: EdgeDefinition<DudaelState>[] = [
    // ── Linear progression ──
    {
        from: '01_title', to: '02_select',
        kind: 'forward',
        description: 'Enter the archive. Begin vessel selection.',
    },
    {
        from: '02_select', to: '03_staging',
        kind: 'forward',
        description: 'Lock identity. Enter the staging area.',
        seals: [hasVessel, hasGuide, hasMode],
        effects: [
            (_from, _to, _state) => {
                // Consumer fires identity lock side effect here
            },
        ],
    },
    {
        from: '03_staging', to: '04_draft',
        kind: 'forward',
        description: 'Initiate the draft. Keepers present their offerings.',
        seals: [runIsActive],
    },
    {
        from: '04_draft', to: '05_level',
        kind: 'forward',
        description: 'Enter the depth. Cards in hand.',
        seals: [runIsActive],
        effects: [
            (_from, _to, _state) => {
                // Consumer increments depth here
            },
        ],
    },
    {
        from: '05_level', to: '06_door',
        kind: 'forward',
        description: 'Level survived. Choose your door.',
        seals: [runIsActive],
    },

    // ── Inner loop (door → draft) ──
    {
        from: '06_door', to: '04_draft',
        kind: 'loop',
        description: 'Door chosen. Descend deeper. New draft begins.',
        seals: [runIsActive],
        effects: [
            (_from, _to, _state) => {
                // Consumer increments loop count here
            },
        ],
    },

    // ── Drop edges ──
    {
        from: '06_door', to: '07_drop',
        kind: 'forward',
        description: 'No doors available or max depth reached. Drop.',
        seals: [runIsActive],
    },
    {
        from: '05_level', to: '07_drop',
        kind: 'forward',
        description: 'Vessel destroyed in level. Forced drop.',
        seals: [runIsActive],
    },

    // ── Reset edges ──
    {
        from: '07_drop', to: '03_staging',
        kind: 'reset',
        description: 'Run ended. Return to staging with meta-progression.',
    },
    {
        from: '07_drop', to: '01_title',
        kind: 'escape',
        description: 'Exit to title. Run abandoned.',
    },

    // ── Back edges ──
    {
        from: '03_staging', to: '02_select',
        kind: 'forward',
        description: 'Return to vessel selection (only if identity not locked).',
        seals: [identityNotLocked],
    },
    {
        from: '04_draft', to: '03_staging',
        kind: 'loop',
        description: 'Abort draft. Return to staging.',
        seals: [runIsActive],
    },

    // ── Door to staging (mid-run retreat) ──
    {
        from: '06_door', to: '03_staging',
        kind: 'reset',
        description: 'Retreat from doors. Return to staging.',
        seals: [runIsActive],
    },
];


// -----------------------------------------------------------------------------
// FACTORY — create a DUDAEL-configured engine
// -----------------------------------------------------------------------------

export function createDudaelConfig(
    getState: () => Readonly<DudaelState>,
): EngineConfig<DudaelState> {
    return {
        phases: DUDAEL_PHASES,
        edges: DUDAEL_EDGES,
        globalSeals: [],
        initialPhase: '01_title',
        getState,
    };
}
