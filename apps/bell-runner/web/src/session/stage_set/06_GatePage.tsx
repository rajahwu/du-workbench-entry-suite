// =============================================================================
// PAGE: DOOR (Phase 06 — Branch)
// web/client/src/pages/DoorPage.tsx
//
// Divergence. Three doors. Parity determines access.
// The delayed consequence of Draft choices lands here.
// =============================================================================

import React from 'react';

// ── Sub-components to build ──────────────────────────────────────────
// <DoorSelector />       — compound container for the three doors
// <LightDoor />          — Path of Light, cost in Light resource
// <DarkDoor />           — Path of Shadow, cost in Dark resource
// <SecretDoor />         — hidden path, requires dark-dominance threshold
// <ParitySnapshot />     — visual of current alignment state
// <ForcedDropWarning />  — shown when no doors qualify
// <DoorCostBreakdown />  — Penitent-only: detailed cost math at high Insight

interface DoorPageProps {
  light: number;
  dark: number;
  depth: number;
  lightCost: number;
  darkCost: number;
  secretThreshold: number;
  vesselId: string | null;
  onChooseDoor: (choice: 'light' | 'dark' | 'secret') => void;
  onForcedDrop: () => void;
}

export default function DoorPage({
  light, dark, depth,
  lightCost, darkCost, secretThreshold,
  vesselId,
  onChooseDoor, onForcedDrop,
}: DoorPageProps) {
  const canLight = light >= lightCost;
  const canDark = dark >= darkCost;
  const canSecret = (dark - light) >= secretThreshold;
  const noDoorsOpen = !canLight && !canDark && !canSecret;

  return (
    <div data-phase="06_door" data-kind="branch">
      {/* <ParitySnapshot light={light} dark={dark} /> */}
      <div data-component="parity">
        <span>Light: {light}</span>
        <span>Dark: {dark}</span>
      </div>

      <p>Depth {depth + 1} — Choose your path</p>

      {/* <DoorSelector> */}
      <div data-component="door-selector">

        {/* <LightDoor /> */}
        <button onClick={() => onChooseDoor('light')} disabled={!canLight}
          data-door="light" data-available={canLight}>
          Path of Light (cost: {lightCost}L) {canLight ? '✓' : '— locked'}
        </button>

        {/* <DarkDoor /> */}
        <button onClick={() => onChooseDoor('dark')} disabled={!canDark}
          data-door="dark" data-available={canDark}>
          Path of Shadow (cost: {darkCost}D) {canDark ? '✓' : '— locked'}
        </button>

        {/* <SecretDoor /> */}
        <button onClick={() => onChooseDoor('secret')} disabled={!canSecret}
          data-door="secret" data-available={canSecret}>
          Secret Door (need {secretThreshold}+ Dark over Light) {canSecret ? '✓' : '— locked'}
        </button>
      </div>
      {/* </DoorSelector> */}

      {/* <ForcedDropWarning /> */}
      {noDoorsOpen && (
        <div data-component="forced-drop">
          <p>No doors open. The Depth claims you.</p>
          <button onClick={onForcedDrop}>Drop</button>
        </div>
      )}
    </div>
  );
}
