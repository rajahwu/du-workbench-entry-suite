/**
 * PHASES — META
 * Run-scoped state. Lives for the duration of one descent.
 * No framework. No imports. Pure data + logic.
 *
 * The manager reads this. The router writes to this.
 * The hourglass router queries this.
 */

import type { PhaseId, PhasePacket, PlayerIdentity } from "./phases/01_title/title.types";

// ─────────────────────────────────────────────
// Run meta shape
// ─────────────────────────────────────────────

export type RunMeta = {
  sessionId: string;
  startedAt: number;

  player: PlayerIdentity | null;

  // Hourglass position
  depth: number;          // 0 = surface, increases with each Level
  maxDepth: number;       // deepest point reached this run

  // Alignment — accumulates through play
  alignment: {
    light: number;        // 0–100
    dark: number;         // 0–100
  };

  // Parity — the live ratio (used by CSS variables)
  parity: {
    light: number;        // 0.0–1.0
    dark: number;
  };

  // Inventory — sticky mechanic
  inventory: string[];    // item IDs. candy doesn't leave.

  // Phase history — the record
  phaseHistory: { phase: PhaseId; ts: number }[];

  // Loop count — how many Draft→Level→Door cycles completed
  loopCount: number;

  // Status
  status: "active" | "drop" | "complete";
};

// ─────────────────────────────────────────────
// Singleton run meta
// ─────────────────────────────────────────────

let _meta: RunMeta | null = null;

export function getRunMeta(): RunMeta {
  if (!_meta) throw new Error("RunMeta not initialized. Call initRunMeta() first.");
  return _meta;
}

export function initRunMeta(packet: PhasePacket): RunMeta {
  _meta = {
    sessionId: packet.ts.toString(36) + "-" + Math.random().toString(36).slice(2, 7),
    startedAt: packet.ts,

    player: packet.player ?? null,

    depth: 0,
    maxDepth: 0,

    alignment: packet.alignment ?? { light: 50, dark: 50 },

    parity: computeParity(packet.alignment ?? { light: 50, dark: 50 }),

    inventory: packet.inventory ?? [],

    phaseHistory: [{ phase: packet.from, ts: packet.ts }],

    loopCount: 0,

    status: "active",
  };

  return _meta;
}

// ─────────────────────────────────────────────
// Mutation helpers (manager calls these)
// ─────────────────────────────────────────────

export function recordPhase(phase: PhaseId): void {
  const meta = getRunMeta();
  meta.phaseHistory.push({ phase, ts: Date.now() });
}

export function incrementDepth(): void {
  const meta = getRunMeta();
  meta.depth += 1;
  meta.maxDepth = Math.max(meta.maxDepth, meta.depth);
}

export function shiftAlignment(delta: { light?: number; dark?: number }): void {
  const meta = getRunMeta();
  if (delta.light) meta.alignment.light = clamp(meta.alignment.light + delta.light, 0, 100);
  if (delta.dark)  meta.alignment.dark  = clamp(meta.alignment.dark  + delta.dark,  0, 100);
  meta.parity = computeParity(meta.alignment);
}

export function addToInventory(itemId: string): void {
  const meta = getRunMeta();
  // Candy doesn't leave. But we still prevent exact duplicates of non-candy.
  const isCandy = itemId.startsWith("candy:");
  if (isCandy || !meta.inventory.includes(itemId)) {
    meta.inventory.push(itemId);
  }
}

export function incrementLoop(): void {
  getRunMeta().loopCount += 1;
}

export function setStatus(status: RunMeta["status"]): void {
  getRunMeta().status = status;
}

export function setPlayer(player: PlayerIdentity): void {
  getRunMeta().player = player;
}

// ─────────────────────────────────────────────
// Persistence (session-level snapshot)
// ─────────────────────────────────────────────

export function snapshotMeta(): void {
  if (!_meta) return;
  try {
    sessionStorage.setItem("dudael:run_meta", JSON.stringify(_meta));
  } catch { /* storage unavailable */ }
}

export function clearMeta(): void {
  _meta = null;
  try {
    sessionStorage.removeItem("dudael:run_meta");
  } catch { /* no-op */ }
}

// ─────────────────────────────────────────────
// Internal
// ─────────────────────────────────────────────

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function computeParity(alignment: { light: number; dark: number }) {
  const total = alignment.light + alignment.dark || 100;
  return {
    light: alignment.light / total,
    dark:  alignment.dark  / total,
  };
}
