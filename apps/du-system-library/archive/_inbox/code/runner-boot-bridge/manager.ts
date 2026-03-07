/**
 * PHASES — MANAGER
 * The phase state machine.
 *
 * Receives PhasePackets from the router.
 * Validates transitions.
 * Updates run meta.
 * Emits events that the UI layer listens to.
 *
 * Runtime-agnostic. No DOM required.
 * The router wires it to the environment (React, CLI, etc).
 */

import type { PhaseId, PhasePacket, PlayerIdentity } from "./phases/01_title/title.types";
import {
  initRunMeta,
  recordPhase,
  incrementDepth,
  incrementLoop,
  setStatus,
  setPlayer,
  snapshotMeta,
  getRunMeta,
} from "./meta";

// ─────────────────────────────────────────────
// Legal transition map
// ─────────────────────────────────────────────
//
// The loop: 04_draft → 05_level → 06_door → (04_draft | 03_staging | 07_drop)
// 03_staging is a pressure valve — reachable from 06_door and 07_drop
//
// Read as: from → [allowed targets]

const TRANSITIONS: Record<PhaseId, PhaseId[]> = {
  "01_title":   ["02_select"],
  "02_select":  ["03_staging"],
  "03_staging": ["04_draft"],
  "04_draft":   ["05_level"],
  "05_level":   ["06_door", "07_drop"],          // 07_drop = defeat mid-level
  "06_door":    ["04_draft", "03_staging", "07_drop"],
  "07_drop":    ["01_title"],                    // run ends, back to title
};

// ─────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────

export type ManagerEvent =
  | { type: "phase:enter";      phase: PhaseId; packet: PhasePacket }
  | { type: "phase:illegal";    from: PhaseId;  to: PhaseId; reason: string }
  | { type: "loop:complete";    count: number }
  | { type: "run:drop";         packet: PhasePacket }
  | { type: "player:set";       player: PlayerIdentity };

type Listener = (event: ManagerEvent) => void;
const _listeners: Listener[] = [];

export function onPhaseEvent(fn: Listener): () => void {
  _listeners.push(fn);
  return () => {
    const i = _listeners.indexOf(fn);
    if (i !== -1) _listeners.splice(i, 1);
  };
}

function emit(event: ManagerEvent): void {
  for (const fn of _listeners) {
    try { fn(event); } catch { /* listener errors don't kill the manager */ }
  }
}

// ─────────────────────────────────────────────
// Manager state
// ─────────────────────────────────────────────

let _current: PhaseId | null = null;
let _initialized = false;

export function getCurrentPhase(): PhaseId | null {
  return _current;
}

// ─────────────────────────────────────────────
// Boot entry point
// ─────────────────────────────────────────────

/**
 * Called by boot.ts after exchange packet is validated.
 * Initializes run meta and sets up the first phase.
 */
export function initManager(packet: PhasePacket): void {
  if (_initialized) {
    console.warn("[manager] Already initialized. Call resetManager() before re-init.");
    return;
  }

  initRunMeta(packet);
  _current = packet.from;   // "01_title"
  _initialized = true;

  console.log(`[manager] Initialized. Current phase: ${_current}`);
}

// ─────────────────────────────────────────────
// Transition
// ─────────────────────────────────────────────

/**
 * Receive a PhasePacket and attempt transition.
 * If legal: updates meta, emits events, returns true.
 * If illegal: emits phase:illegal, returns false.
 */
export function transition(packet: PhasePacket): boolean {
  if (!_initialized) {
    console.error("[manager] Not initialized. Call initManager() first.");
    return false;
  }

  const { from, to } = packet;

  // Validate
  const legal = TRANSITIONS[from];
  if (!legal || !legal.includes(to)) {
    emit({
      type: "phase:illegal",
      from,
      to,
      reason: `${from} → ${to} is not a legal transition.`,
    });
    return false;
  }

  // Apply meta side-effects per transition
  _applyMetaEffects(from, to, packet);

  // Record
  _current = to;
  recordPhase(to);
  snapshotMeta();

  // Emit
  emit({ type: "phase:enter", phase: to, packet });

  // Special events
  if (to === "07_drop") {
    setStatus("drop");
    emit({ type: "run:drop", packet });
  }

  return true;
}

// ─────────────────────────────────────────────
// Per-transition meta effects
// ─────────────────────────────────────────────

function _applyMetaEffects(from: PhaseId, to: PhaseId, packet: PhasePacket): void {
  // Player identity confirmed at 02_select → 03_staging
  if (from === "02_select" && packet.player) {
    setPlayer(packet.player);
    emit({ type: "player:set", player: packet.player });
  }

  // Depth increments each time we enter a level
  if (to === "05_level") {
    incrementDepth();
  }

  // Loop complete: 06_door → 04_draft
  if (from === "06_door" && to === "04_draft") {
    incrementLoop();
    const meta = getRunMeta();
    emit({ type: "loop:complete", count: meta.loopCount });
  }
}

// ─────────────────────────────────────────────
// Reset (for title screen replay / new run)
// ─────────────────────────────────────────────

export function resetManager(): void {
  _current = null;
  _initialized = false;
  _listeners.length = 0;
}
