/**
 * PHASES — BOOT
 * One-time ignition sequence.
 *
 * Listens for the "dudael:exchange" event fired by the title screen.
 * Validates the packet.
 * Hands off to the manager.
 *
 * Call boot() once at app startup.
 * Everything downstream runs through the manager.
 */

import type { PhasePacket } from "./phases/01_title/title.types";
import { initManager, transition } from "./manager";

// ─────────────────────────────────────────────
// Boot
// ─────────────────────────────────────────────

/**
 * Start the boot sequence.
 * Wires the title screen exchange event to the manager.
 *
 * @param onReady  - called when the manager is initialized and ready
 * @param onError  - called if boot fails
 */
export function boot(
  onReady?: (packet: PhasePacket) => void,
  onError?: (reason: string) => void
): () => void {
  console.log("[boot] Listening for exchange...");

  function handleExchange(e: Event) {
    const event = e as CustomEvent<{ packet: PhasePacket; path: "full" | "lite" }>;

    const packet = event.detail?.packet;

    if (!packet) {
      const msg = "[boot] Exchange event fired but no packet received.";
      console.error(msg);
      onError?.(msg);
      return;
    }

    const valid = validatePacket(packet);
    if (!valid.ok) {
      console.error("[boot] Invalid packet:", valid.reason);
      onError?.(valid.reason);
      return;
    }

    // Initialize the manager with the exchange packet
    initManager(packet);

    // Trigger the first real transition: 01_title → 02_select
    const moved = transition(packet);

    if (!moved) {
      const msg = "[boot] First transition failed. Check manager logs.";
      console.error(msg);
      onError?.(msg);
      return;
    }

    console.log(`[boot] Ignition complete. Path: ${event.detail.path}. Entering 02_select.`);
    onReady?.(packet);
  }

  window.addEventListener("dudael:exchange", handleExchange);

  // Return cleanup
  return () => window.removeEventListener("dudael:exchange", handleExchange);
}

// ─────────────────────────────────────────────
// Packet validation
// ─────────────────────────────────────────────

type ValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

function validatePacket(packet: PhasePacket): ValidationResult {
  if (!packet.user?.id) {
    return { ok: false, reason: "Packet missing user.id" };
  }
  if (packet.from !== "01_title") {
    return { ok: false, reason: `Boot expects packet.from = "01_title", got "${packet.from}"` };
  }
  if (packet.to !== "02_select") {
    return { ok: false, reason: `Boot expects packet.to = "02_select", got "${packet.to}"` };
  }
  if (!packet.ts || typeof packet.ts !== "number") {
    return { ok: false, reason: "Packet missing valid timestamp" };
  }
  return { ok: true };
}

// ─────────────────────────────────────────────
// Fallback: load from sessionStorage if page reloaded mid-run
// ─────────────────────────────────────────────

/**
 * Called during app init to check if a run was in progress.
 * If sessionStorage has a run_meta snapshot, restore it.
 * Returns the recovered packet or null.
 */
export function recoverRun(): PhasePacket | null {
  try {
    const raw = sessionStorage.getItem("dudael:run_meta");
    if (!raw) return null;

    const meta = JSON.parse(raw);
    if (!meta?.sessionId || meta.status === "drop") return null;

    // Reconstruct a minimal packet to resume from the last phase
    const lastPhase = meta.phaseHistory?.at(-1);
    if (!lastPhase) return null;

    const packet: PhasePacket = {
      from: lastPhase.phase,
      to: lastPhase.phase,   // resume in place — router decides next
      ts: Date.now(),
      user: { id: meta.player?.id ?? "guest:recovered", kind: "user" },
      player: meta.player ?? undefined,
      alignment: meta.alignment,
      depth: meta.depth,
      inventory: meta.inventory,
      meta: { recovered: true, sessionId: meta.sessionId },
    };

    console.log(`[boot] Recovered run from session. Depth: ${meta.depth}, Phase: ${lastPhase.phase}`);
    return packet;

  } catch {
    return null;
  }
}
