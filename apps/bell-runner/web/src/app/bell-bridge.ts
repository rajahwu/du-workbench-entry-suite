// =============================================================================
// WEB CLIENT — BELL ENGINE BRIDGE
// web/client/src/app/bell-bridge.ts
//
// The bridge between the Bell Engine and Redux.
// This is the ONLY file that knows about both systems.
//
// Redux owns UI state. The engine owns transition legality.
// This bridge coordinates them.
// =============================================================================

import { createEngine, type BellEngine, type TransitionResult, type BellSource } from '../../../engine';
import { createDudaelConfig, type DudaelState } from '../../../engine/phases/dudael';

// These would be your actual Redux imports
// import type { AppDispatch, RootState } from './store';
// import { selectRun } from './runSlice';
// import { setPhaseAndWall } from './phaseSlice';


/**
 * Maps Redux state → DudaelState for the engine.
 * The engine never sees Redux directly.
 */
function mapReduxToDudael(/* getState: () => RootState */): DudaelState {
    // const state = getState();
    // const run = selectRun(state);

    // Placeholder — replace with real Redux selectors
    return {
        identityLocked: false,
        vesselId: null,
        guide: null,
        mode: null,
        depth: 0,
        loopCount: 0,
        currentLight: 0,
        currentDark: 0,
        insight: 0,
        runActive: false,
    };
}


/**
 * Create the Bell Engine instance with DUDAEL configuration.
 * Call once at app startup.
 */
export function initBellEngine(/* getState: () => RootState */): BellEngine<DudaelState> {
    const config = createDudaelConfig(() => mapReduxToDudael());
    return createEngine(config);
}


/**
 * The transition thunk — replaces requestTransition.
 *
 * Usage in a shell:
 *   dispatch(bellTransition('03_staging', { kind: 'select->staging', ... }))
 */
export function bellTransition<TPayload>(
    to: string,
    payload: TPayload,
    source?: BellSource,
) {
    return (/* dispatch: AppDispatch, getState: () => RootState */) => {
        // const engine = getEngine(); // singleton or from context
        // const result = engine.ring(to, payload, source);

        // if (result.outcome === 'transfer') {
        //   dispatch(setPhaseAndWall({ phase: result.to, wall: ... }));
        //   // apply run side effects based on payload.kind
        // } else {
        //   dispatch(transitionFailed(result.failedSeals.map(s => s.reason).join('; ')));
        // }

        // return result;
    };
}
