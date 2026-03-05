// =============================================================================
// BELL PHASE ENGINE
// engine/index.ts
//
// The portable state machine protocol.
// Zero framework dependencies. Zero domain knowledge.
//
// Action → Bell → Wall → Seal → Transfer | Stay
// =============================================================================

// Core engine
export { createEngine } from './manager';
export type { BellEngine } from './manager';

// Types
export type {
    PhaseKind,
    PhaseDefinition,
    Bell,
    BellSource,
    WallPacket,
    WallEdge,
    SealResult,
    SealFn,
    Seal,
    TransitionResult,
    TransferResult,
    StayResult,
    EdgeKind,
    EdgeDefinition,
    EdgeEffect,
    EngineConfig,
} from './types';

// Seal factory
export {
    stateSeal,
    payloadSeal,
    oneWayGate,
    thresholdSeal,
    edgeLimitSeal,
    sourceSeal,
    composeSeal,
} from './seals';

// Wall helpers
export { buildWall, emptyWall, isWallPayload, readEdge, isEdge } from './walls';
