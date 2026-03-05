// =============================================================================
// BELL PHASE ENGINE — SEAL FACTORY
// engine/seals/factory.ts
//
// Pre-built seal patterns. Consumers compose these instead of writing
// raw SealFn implementations for common cases.
//
// All seals are pure functions. No side effects. No mutations.
// =============================================================================

import type { Seal, SealFn, Bell, WallPacket } from '../types';


/**
 * Creates a seal that checks a boolean condition against current state.
 *
 * Usage:
 *   stateSeal('has-identity', 'Player must have a locked identity', state => !!state.identity)
 */
export function stateSeal<TState>(
    id: string,
    description: string,
    predicate: (state: Readonly<TState>) => boolean,
    priority?: number,
): Seal<TState> {
    return {
        id,
        description,
        priority: priority ?? 100,
        evaluate: (_bell, _wall, state) => {
            const pass = predicate(state);
            return pass
                ? { pass: true, sealId: id }
                : { pass: false, reason: description, sealId: id };
        },
    };
}


/**
 * Creates a seal that checks a condition on the wall payload.
 *
 * Usage:
 *   payloadSeal('has-vessel', 'Payload must include vesselId', p => !!p.vesselId)
 */
export function payloadSeal<TPayload>(
    id: string,
    description: string,
    predicate: (payload: TPayload) => boolean,
    priority?: number,
): Seal<unknown, TPayload> {
    return {
        id,
        description,
        priority: priority ?? 100,
        evaluate: (_bell, wall, _state) => {
            const pass = predicate(wall.payload as TPayload);
            return pass
                ? { pass: true, sealId: id }
                : { pass: false, reason: description, sealId: id };
        },
    };
}


/**
 * Creates a seal that prevents a transition after a one-way gate has been passed.
 * Once the gate condition is true, the seal blocks.
 *
 * Usage:
 *   oneWayGate('identity-locked', 'Cannot return to select after identity lock', state => state.identityLocked)
 */
export function oneWayGate<TState>(
    id: string,
    description: string,
    isLocked: (state: Readonly<TState>) => boolean,
    priority?: number,
): Seal<TState> {
    return {
        id,
        description,
        priority: priority ?? 50,
        evaluate: (_bell, _wall, state) => {
            if (isLocked(state)) {
                return { pass: false, reason: description, sealId: id };
            }
            return { pass: true, sealId: id };
        },
    };
}


/**
 * Creates a seal that requires a minimum numeric value in state.
 *
 * Usage:
 *   thresholdSeal('min-light', 'Requires 3+ Light', state => state.light, 3)
 */
export function thresholdSeal<TState>(
    id: string,
    description: string,
    getValue: (state: Readonly<TState>) => number,
    minimum: number,
    priority?: number,
): Seal<TState> {
    return {
        id,
        description,
        priority: priority ?? 100,
        evaluate: (_bell, _wall, state) => {
            const value = getValue(state);
            const pass = value >= minimum;
            return pass
                ? { pass: true, sealId: id }
                : { pass: false, reason: `${description} (have: ${value}, need: ${minimum})`, sealId: id };
        },
    };
}


/**
 * Creates a seal that limits how many times a specific edge can be traversed.
 *
 * Uses a closure to track count — scoped to the seal instance.
 *
 * Usage:
 *   edgeLimitSeal('max-rerolls', 'Only 3 rerolls allowed', 3)
 */
export function edgeLimitSeal(
    id: string,
    description: string,
    maxTraversals: number,
    priority?: number,
): Seal {
    let count = 0;

    return {
        id,
        description,
        priority: priority ?? 80,
        evaluate: () => {
            if (count >= maxTraversals) {
                return { pass: false, reason: `${description} (${count}/${maxTraversals})`, sealId: id };
            }
            count += 1;
            return { pass: true, sealId: id };
        },
    };
}


/**
 * Creates a seal that checks the bell source.
 * Useful for restricting certain transitions to player actions only,
 * or allowing system-only transitions.
 *
 * Usage:
 *   sourceSeal('player-only', 'This transition requires player action', ['player'])
 */
export function sourceSeal(
    id: string,
    description: string,
    allowedSources: Array<'player' | 'system' | 'timer' | 'dev'>,
    priority?: number,
): Seal {
    return {
        id,
        description,
        priority: priority ?? 90,
        evaluate: (bell) => {
            if (!bell.rungBy) {
                return { pass: false, reason: `${description} (no source provided)`, sealId: id };
            }
            const pass = allowedSources.includes(bell.rungBy.kind);
            return pass
                ? { pass: true, sealId: id }
                : { pass: false, reason: `${description} (source: ${bell.rungBy.kind})`, sealId: id };
        },
    };
}


/**
 * Composes multiple seals into a single seal.
 * All inner seals must pass for the composed seal to pass.
 *
 * Usage:
 *   composeSeal('gate-ready', 'All gate conditions met', [hasIdentity, hasVessel, hasMode])
 */
export function composeSeal<TState>(
    id: string,
    description: string,
    seals: Seal<TState>[],
    priority?: number,
): Seal<TState> {
    return {
        id,
        description,
        priority: priority ?? 100,
        evaluate: (bell, wall, state) => {
            for (const seal of seals) {
                const result = seal.evaluate(bell, wall, state);
                if (!result.pass) {
                    return { ...result, sealId: `${id}:${result.sealId ?? seal.id}` };
                }
            }
            return { pass: true, sealId: id };
        },
    };
}
