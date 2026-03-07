/**
 * PHASES — ROUTER
 * The bridge between the phase manager and the rendering environment.
 *
 * The manager is pure logic — it knows nothing about React, DOM, or CLI.
 * The router translates manager events into environment-appropriate actions.
 *
 * Wire the appropriate adapter for your runtime:
 *   - routerReact()   for the React web app
 *   - routerCLI()     for the terminal app
 *   - routerVanilla() for the standalone HTML prototype
 */

import type { PhaseId, PhasePacket } from "./phases/01_title/title.types";
import { onPhaseEvent, type ManagerEvent } from "./manager";

// ─────────────────────────────────────────────
// Router interface
// ─────────────────────────────────────────────

export type PhaseRouter = {
  /** Called when a legal transition completes. Navigate to new phase. */
  goTo: (phase: PhaseId, packet: PhasePacket) => void;
  /** Called on illegal transition attempt. */
  onIllegal?: (from: PhaseId, to: PhaseId, reason: string) => void;
  /** Called when a run ends at 07_drop. */
  onDrop?: (packet: PhasePacket) => void;
};

// ─────────────────────────────────────────────
// Wire a router to the manager event stream
// ─────────────────────────────────────────────

export function wireRouter(router: PhaseRouter): () => void {
  const unlisten = onPhaseEvent((event: ManagerEvent) => {
    switch (event.type) {

      case "phase:enter":
        router.goTo(event.phase, event.packet);
        break;

      case "phase:illegal":
        router.onIllegal?.(event.from, event.to, event.reason);
        console.warn(`[router] Illegal transition blocked: ${event.from} → ${event.to}. ${event.reason}`);
        break;

      case "run:drop":
        router.onDrop?.(event.packet);
        break;

      // loop:complete and player:set are informational — 
      // UI can subscribe to manager events directly if needed
    }
  });

  return unlisten;
}

// ─────────────────────────────────────────────
// React adapter
// ─────────────────────────────────────────────

/**
 * Wire the manager to React Router v6.
 * Call once at app root, after boot().
 *
 * Usage:
 *   import { useNavigate } from "react-router-dom";
 *   import { routerReact } from "./phases/router";
 *
 *   function App() {
 *     const navigate = useNavigate();
 *     useEffect(() => routerReact(navigate), []);
 *   }
 */
export function routerReact(navigate: (path: string) => void): () => void {
  const PHASE_PATHS: Record<PhaseId, string> = {
    "01_title":   "/",
    "02_select":  "/select",
    "03_staging": "/staging",
    "04_draft":   "/draft",
    "05_level":   "/level",
    "06_door":    "/door",
    "07_drop":    "/drop",
  };

  return wireRouter({
    goTo(phase, _packet) {
      const path = PHASE_PATHS[phase];
      if (path) navigate(path);
    },
    onIllegal(_from, _to, reason) {
      console.error("[router:react]", reason);
    },
    onDrop(_packet) {
      navigate(PHASE_PATHS["07_drop"]);
    },
  });
}

// ─────────────────────────────────────────────
// CLI adapter
// ─────────────────────────────────────────────

/**
 * Wire the manager to the terminal app's phase handler.
 *
 * Usage:
 *   routerCLI((phase, packet) => terminalApp.load(phase, packet));
 */
export function routerCLI(
  loadPhase: (phase: PhaseId, packet: PhasePacket) => void
): () => void {
  return wireRouter({
    goTo: loadPhase,
    onIllegal(_from, _to, reason) {
      console.error("[router:cli]", reason);
    },
  });
}

// ─────────────────────────────────────────────
// Vanilla / CustomEvent adapter (for HTML prototypes)
// ─────────────────────────────────────────────

/**
 * Wire the manager to CustomEvents on window.
 * The HTML prototype (cots-and-robots etc) can listen for these.
 *
 * Usage:
 *   routerVanilla();
 *   window.addEventListener("dudael:phase", (e) => { ... });
 */
export function routerVanilla(): () => void {
  return wireRouter({
    goTo(phase, packet) {
      window.dispatchEvent(
        new CustomEvent("dudael:phase", { detail: { phase, packet } })
      );
    },
    onDrop(packet) {
      window.dispatchEvent(
        new CustomEvent("dudael:drop", { detail: { packet } })
      );
    },
  });
}
