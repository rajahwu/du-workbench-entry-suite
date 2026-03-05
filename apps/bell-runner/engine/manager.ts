// =============================================================================
// BELL PHASE ENGINE — MANAGER
// engine/manager.ts
//
// The engine. Owns phases, edges, seals, and the transition function.
// Has no opinion about UI, state management, or domain logic.
// Consumers wire it into their world.
//
// The five-node invariant:
//   Action → Bell fires → Wall evaluates the Seal → Transfer | Stay
// =============================================================================

import type {
    PhaseDefinition,
    Bell,
    BellSource,
    WallPacket,
    Seal,
    SealResult,
    TransitionResult,
    EdgeDefinition,
    EdgeEffect,
    EngineConfig,
} from './types';


// -----------------------------------------------------------------------------
// ENGINE STATE
// -----------------------------------------------------------------------------

interface EngineState<TState = unknown> {
    currentPhase: string;
    phases: Map<string, PhaseDefinition>;
    edges: Map<string, EdgeDefinition<TState>[]>;
    globalSeals: Seal<TState>[];
    getState: () => Readonly<TState>;
    history: string[];
    transitionCount: number;
}


// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function edgeKey(from: string, to: string): string {
    return `${from}->${to}`;
}

function findEdge<TState>(
    edges: Map<string, EdgeDefinition<TState>[]>,
    from: string,
    to: string,
): EdgeDefinition<TState> | null {
    const fromEdges = edges.get(from);
    if (!fromEdges) return null;
    return fromEdges.find(e => e.to === to) ?? null;
}


// -----------------------------------------------------------------------------
// STRUCTURAL SEALS (provided by engine, not consumer)
// -----------------------------------------------------------------------------

function createLegalitySeal<TState>(
    edges: Map<string, EdgeDefinition<TState>[]>,
): Seal<TState> {
    return {
        id: 'bell:legality',
        description: 'Verifies the edge exists in the registry',
        structural: true,
        priority: 0,
        evaluate: (bell) => {
            const edge = findEdge(edges, bell.from, bell.to);
            if (!edge) {
                return {
                    pass: false,
                    reason: `No registered edge: ${bell.from} → ${bell.to}`,
                    sealId: 'bell:legality',
                };
            }
            return { pass: true, sealId: 'bell:legality' };
        },
    };
}

function createCurrentPhaseSeal<TState>(
    getPhase: () => string,
): Seal<TState> {
    return {
        id: 'bell:current_phase',
        description: 'Verifies the bell was rung from the current phase',
        structural: true,
        priority: 1,
        evaluate: (bell) => {
            const current = getPhase();
            if (bell.from !== current) {
                return {
                    pass: false,
                    reason: `Bell.from (${bell.from}) does not match current phase (${current})`,
                    sealId: 'bell:current_phase',
                };
            }
            return { pass: true, sealId: 'bell:current_phase' };
        },
    };
}


// -----------------------------------------------------------------------------
// SEAL EVALUATOR
// -----------------------------------------------------------------------------

function evaluateSeals<TState, TPayload>(
    seals: Seal<TState, TPayload>[],
    bell: Bell,
    wall: WallPacket<TPayload>,
    state: Readonly<TState>,
): SealResult[] {
    const sorted = [...seals].sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
    const failures: SealResult[] = [];

    for (const seal of sorted) {
        const result = seal.evaluate(bell, wall as WallPacket<unknown>, state);
        if (!result.pass) {
            failures.push({
                ...result,
                sealId: result.sealId ?? seal.id,
            });
        }
    }

    return failures;
}


// -----------------------------------------------------------------------------
// ENGINE FACTORY
// -----------------------------------------------------------------------------

export interface BellEngine<TState = unknown> {
    /** Ring the bell — attempt a transition */
    ring: <TPayload = unknown>(
        to: string,
        payload: TPayload,
        source?: BellSource,
    ) => TransitionResult;

    /** Get the current phase ID */
    getCurrentPhase: () => string;

    /** Get the current phase definition */
    getCurrentPhaseDefinition: () => PhaseDefinition | null;

    /** Get a phase definition by ID */
    getPhase: (id: string) => PhaseDefinition | null;

    /** Get all registered phases */
    getPhases: () => PhaseDefinition[];

    /** Get all legal edges from the current phase */
    getLegalEdges: () => EdgeDefinition<TState>[];

    /** Get all legal edges from a specific phase */
    getLegalEdgesFrom: (phaseId: string) => EdgeDefinition<TState>[];

    /** Check if a specific transition is structurally legal (edge exists) */
    isLegal: (from: string, to: string) => boolean;

    /** Get the full phase trail history */
    getHistory: () => string[];

    /** Get total transition count */
    getTransitionCount: () => number;

    /** Force-set phase (dev/recovery only — bypasses seals) */
    __forcePhase: (phaseId: string) => void;
}

export function createEngine<TState = unknown>(
    config: EngineConfig<TState>,
): BellEngine<TState> {

    // ── Validate config ──
    if (config.phases.length === 0) {
        throw new Error('Bell Engine: at least one phase is required');
    }

    const phaseIds = new Set(config.phases.map(p => p.id));
    if (!phaseIds.has(config.initialPhase)) {
        throw new Error(`Bell Engine: initial phase "${config.initialPhase}" not found in phase registry`);
    }

    // ── Build internal state ──
    const phases = new Map<string, PhaseDefinition>();
    for (const phase of config.phases) {
        if (phases.has(phase.id)) {
            throw new Error(`Bell Engine: duplicate phase ID "${phase.id}"`);
        }
        phases.set(phase.id, phase);
    }

    const edges = new Map<string, EdgeDefinition<TState>[]>();
    for (const edge of config.edges) {
        if (!phaseIds.has(edge.from)) {
            throw new Error(`Bell Engine: edge references unknown phase "${edge.from}"`);
        }
        if (!phaseIds.has(edge.to)) {
            throw new Error(`Bell Engine: edge references unknown phase "${edge.to}"`);
        }
        const existing = edges.get(edge.from) ?? [];
        existing.push(edge);
        edges.set(edge.from, existing);
    }

    const state: EngineState<TState> = {
        currentPhase: config.initialPhase,
        phases,
        edges,
        globalSeals: config.globalSeals ?? [],
        getState: config.getState,
        history: [config.initialPhase],
        transitionCount: 0,
    };

    // ── Structural seals ──
    const legalitySeal = createLegalitySeal(edges);
    const currentPhaseSeal = createCurrentPhaseSeal(() => state.currentPhase);

    // ── The Ring function — the entire engine in one call ──
    function ring<TPayload = unknown>(
        to: string,
        payload: TPayload,
        source?: BellSource,
    ): TransitionResult {
        const now = Date.now();
        const from = state.currentPhase;

        // 1. Construct the Bell
        const bell: Bell = {
            from,
            to,
            rungAt: now,
            rungBy: source,
        };

        // 2. Construct the WallPacket
        const wall: WallPacket<TPayload> = {
            edge: { from, to },
            stampedAt: now,
            payload,
        };

        // 3. Gather all seals for this transition
        const allSeals: Seal<TState>[] = [
            legalitySeal,
            currentPhaseSeal,
            ...state.globalSeals,
        ];

        // Add edge-specific seals
        const edge = findEdge(edges, from, to);
        if (edge?.seals) {
            allSeals.push(...(edge.seals as Seal<TState>[]));
        }

        // 4. Evaluate seals
        const failures = evaluateSeals(allSeals, bell, wall as WallPacket<unknown>, state.getState());

        // 5. Stay or Transfer
        if (failures.length > 0) {
            return {
                outcome: 'stay',
                from,
                attemptedTo: to,
                stayedAt: now,
                failedSeals: failures,
            };
        }

        // 6. Transfer — commit the phase change
        state.currentPhase = to;
        state.history.push(to);
        state.transitionCount += 1;

        // 7. Fire edge effects (non-blocking, non-gating)
        if (edge?.effects) {
            for (const effect of edge.effects) {
                try {
                    effect(from, to, state.getState() as TState);
                } catch (err) {
                    // Effects must not crash the engine
                    console.error(`Bell Engine: edge effect error on ${from} → ${to}:`, err);
                }
            }
        }

        return {
            outcome: 'transfer',
            from,
            to,
            phase: to,
            transferredAt: now,
        };
    }

    // ── Public API ──
    return {
        ring,

        getCurrentPhase: () => state.currentPhase,

        getCurrentPhaseDefinition: () => phases.get(state.currentPhase) ?? null,

        getPhase: (id: string) => phases.get(id) ?? null,

        getPhases: () => [...phases.values()],

        getLegalEdges: () => edges.get(state.currentPhase) ?? [],

        getLegalEdgesFrom: (phaseId: string) => edges.get(phaseId) ?? [],

        isLegal: (from: string, to: string) => findEdge(edges, from, to) !== null,

        getHistory: () => [...state.history],

        getTransitionCount: () => state.transitionCount,

        __forcePhase: (phaseId: string) => {
            if (!phases.has(phaseId)) {
                throw new Error(`Bell Engine: cannot force to unknown phase "${phaseId}"`);
            }
            state.currentPhase = phaseId;
            state.history.push(phaseId);
        },
    };
}
