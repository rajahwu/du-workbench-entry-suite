// =============================================================================
// BELL PHASE ENGINE — CORE TYPES
// engine/types/core.ts
//
// The five-node invariant:
//   Action → Bell → Wall → Seal → Transfer | Stay
//
// This file defines the protocol. It has no implementation, no framework
// imports, no opinion about what a "phase" contains. It defines how
// phases relate to each other through transitions.
//
// Consumers (DUDAEL, or anything else) implement these contracts.
// The engine enforces them.
// =============================================================================


// -----------------------------------------------------------------------------
// PHASE IDENTITY
// -----------------------------------------------------------------------------

/**
 * A phase is a numbered slot with a kind.
 * The engine doesn't know what happens inside a phase.
 * It only knows what kind of phase it is and where it sits in the sequence.
 */
export type PhaseKind =
    | 'entry'      // system initialization, identity resolution
    | 'select'     // commitment — choices that narrow future options
    | 'prep'       // staging, loadout, calm before descent
    | 'encounter'  // active gameplay, the cartridge slot
    | 'branch'     // divergence — player chooses a path
    | 'terminal'   // run ends, meta-progression writes back
    | 'custom';    // consumer-defined phase kind

export interface PhaseDefinition {
    /** Unique phase identifier — e.g. '01_title', 'phase_3', 'lobby' */
    id: string;

    /** Slot number — determines display/sequence order, not transition legality */
    slot: number;

    /** What kind of phase this is — informs engine behavior hints */
    kind: PhaseKind;

    /** Human-readable label */
    label: string;

    /** Optional metadata the consumer can attach */
    meta?: Record<string, unknown>;
}


// -----------------------------------------------------------------------------
// THE BELL
// -----------------------------------------------------------------------------

/**
 * The Bell is the event that initiates a transition attempt.
 * Something happened. The system wants to move.
 *
 * The Bell carries:
 *   - where we are (from)
 *   - where we want to go (to)
 *   - when it was rung
 *   - who rang it (optional — could be player action, system event, or timer)
 *
 * The Bell does NOT carry payload data. That's the Wall's job.
 */
export interface Bell {
    from: string;
    to: string;
    rungAt: number;
    rungBy?: BellSource;
}

export type BellSource =
    | { kind: 'player'; action: string }
    | { kind: 'system'; reason: string }
    | { kind: 'timer'; elapsed: number }
    | { kind: 'dev'; command: string };


// -----------------------------------------------------------------------------
// THE WALL
// -----------------------------------------------------------------------------

/**
 * The Wall is the boundary between two phases.
 * It carries a WallPacket — the minimal data contract for this specific hop.
 *
 * The Wall is NOT a store. It does not accumulate.
 * Each wall is fresh. No ...prev spreading. No inheritance.
 *
 * Rule of Discipline: the WallPacket is erased and rewritten at every transition.
 */
export interface WallPacket<TPayload = unknown> {
    /** Which specific hop this packet describes */
    edge: WallEdge;

    /** Timestamp of packet creation */
    stampedAt: number;

    /** The typed payload for this specific transition */
    payload: TPayload;

    /** Optional extension for debug/experiment tagging */
    extension?: {
        debug?: unknown;
        experimentTag?: string;
        schemaVersion?: number;
    };
}

export interface WallEdge {
    from: string;
    to: string;
}


// -----------------------------------------------------------------------------
// THE SEAL
// -----------------------------------------------------------------------------

/**
 * The Seal is the gate. It evaluates whether a transition is allowed.
 *
 * The Seal receives:
 *   - the Bell (what triggered the transition)
 *   - the WallPacket (what data is being transferred)
 *   - a read-only view of current state (provided by the consumer)
 *
 * The Seal returns:
 *   - pass: true  → Transfer proceeds
 *   - pass: false → Stay, with a reason
 *
 * Seals are composable. A transition can have multiple seals.
 * ALL seals must pass for the transition to proceed.
 *
 * The engine provides structural seals (is this edge legal?).
 * The consumer provides domain seals (is this edge allowed given game state?).
 */
export interface SealResult {
    pass: boolean;
    reason?: string;
    sealId?: string;
}

export type SealFn<TState = unknown, TPayload = unknown> = (
    bell: Bell,
    wall: WallPacket<TPayload>,
    state: Readonly<TState>,
) => SealResult;

/**
 * A named seal with metadata.
 * The engine registers these and evaluates them in order.
 */
export interface Seal<TState = unknown, TPayload = unknown> {
    /** Unique identifier for this seal */
    id: string;

    /** Human-readable description */
    description: string;

    /** The evaluation function */
    evaluate: SealFn<TState, TPayload>;

    /** Priority — lower numbers evaluate first. Default: 100 */
    priority?: number;

    /** If true, this seal is structural (provided by engine). If false, domain (provided by consumer). */
    structural?: boolean;
}


// -----------------------------------------------------------------------------
// TRANSFER RESULT
// -----------------------------------------------------------------------------

/**
 * The outcome of a transition attempt.
 *
 * Transfer: the Bell was rung, the Seal passed, state has moved.
 * Stay: the Bell was rung, the Seal failed, state has not moved.
 */
export type TransitionResult<TMeta = unknown> =
    | TransferResult<TMeta>
    | StayResult;

export interface TransferResult<TMeta = unknown> {
    outcome: 'transfer';
    from: string;
    to: string;
    phase: string;
    transferredAt: number;
    meta?: TMeta;
}

export interface StayResult {
    outcome: 'stay';
    from: string;
    attemptedTo: string;
    stayedAt: number;
    failedSeals: SealResult[];
}


// -----------------------------------------------------------------------------
// EDGE REGISTRY
// -----------------------------------------------------------------------------

/**
 * An edge defines a legal transition between two phases.
 * The engine maintains a registry of all legal edges.
 *
 * Each edge can carry:
 *   - seals specific to this edge (in addition to global seals)
 *   - side effects that fire on successful transfer
 *   - metadata about the edge type
 */
export type EdgeKind =
    | 'forward'    // normal progression
    | 'loop'       // returns to an earlier phase (e.g. door → draft)
    | 'reset'      // returns to a much earlier phase (e.g. drop → staging)
    | 'escape'     // exits the loop entirely (e.g. drop → title)
    | 'skip'       // jumps over phases (dev/special)
    | 'custom';

export interface EdgeDefinition<TState = unknown, TPayload = unknown> {
    from: string;
    to: string;
    kind: EdgeKind;

    /** Seals specific to this edge — evaluated in addition to global seals */
    seals?: Seal<TState, TPayload>[];

    /** Side effects that fire AFTER a successful transfer on this edge */
    effects?: EdgeEffect<TState>[];

    /** Human-readable description of this edge */
    description?: string;
}

/**
 * A side effect that fires after a successful transfer.
 * Effects are NOT gates — they cannot prevent the transition.
 * They observe it and react.
 */
export type EdgeEffect<TState = unknown> = (
    from: string,
    to: string,
    state: TState,
) => void;


// -----------------------------------------------------------------------------
// ENGINE CONFIGURATION
// -----------------------------------------------------------------------------

/**
 * Everything the engine needs to operate.
 * Provided by the consumer at initialization.
 */
export interface EngineConfig<TState = unknown> {
    /** All phases registered in this engine instance */
    phases: PhaseDefinition[];

    /** All legal edges between phases */
    edges: EdgeDefinition<TState>[];

    /** Global seals applied to every transition */
    globalSeals?: Seal<TState>[];

    /** Initial phase ID */
    initialPhase: string;

    /** Function that returns current state for seal evaluation */
    getState: () => Readonly<TState>;
}
