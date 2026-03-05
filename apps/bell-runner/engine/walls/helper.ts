// =============================================================================
// BELL PHASE ENGINE — WALL HELPERS
// engine/walls/helpers.ts
//
// Utilities for constructing WallPackets. The Wall is the boundary,
// the packet is what crosses it.
// =============================================================================

import type { WallPacket, WallEdge } from '../types';


/**
 * Build a WallPacket for a specific hop.
 * Fills required fields, consumer provides the payload.
 */
export function buildWall<TPayload>(
    from: string,
    to: string,
    payload: TPayload,
    extension?: WallPacket['extension'],
): WallPacket<TPayload> {
    return {
        edge: { from, to },
        stampedAt: Date.now(),
        payload,
        ...(extension ? { extension } : {}),
    };
}


/**
 * Create an empty wall — useful for transitions that carry no data.
 */
export function emptyWall(from: string, to: string): WallPacket<null> {
    return buildWall(from, to, null);
}


/**
 * Type guard: check if a wall packet has a specific payload shape.
 */
export function isWallPayload<TPayload>(
    wall: WallPacket<unknown>,
    guard: (payload: unknown) => payload is TPayload,
): wall is WallPacket<TPayload> {
    return guard(wall.payload);
}


/**
 * Read the edge from a wall packet.
 */
export function readEdge(wall: WallPacket): WallEdge {
    return wall.edge;
}


/**
 * Check if a wall packet is for a specific edge.
 */
export function isEdge(wall: WallPacket, from: string, to: string): boolean {
    return wall.edge.from === from && wall.edge.to === to;
}
