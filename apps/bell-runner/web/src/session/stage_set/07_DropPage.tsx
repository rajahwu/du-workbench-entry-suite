// =============================================================================
// PAGE: DROP (Phase 07 — Terminal)
// web/client/src/pages/DropPage.tsx
//
// The run ends. Designed death converts progress into persistence.
// Memory Fragments, scars, boons, codex entries — all written here.
// =============================================================================

import React from 'react';

// ── Sub-components to build ──────────────────────────────────────────
// <DropSummary />            — vessel, depth, points, parity, status
// <MemoryFragmentsAward />   — how many fragments earned this run
// <MetaCounterDisplay />     — Confessions (Penitent), Breach (Rebel)
// <UnlockBadge />            — scars, boons, codex entries earned
// <ReturnToStagingButton />  — rings the bell: drop → staging
// <ExitToTitleButton />      — rings the bell: drop → title

interface DropPageProps {
  vessel: string | null;
  depth: number;
  points: number;
  light: number;
  dark: number;
  loopCount: number;
  survived: boolean;
  fragmentsAwarded: number;
  metaCounter?: { name: string; incremented: boolean };
  onReturnToStaging: () => void;
  onExitToTitle: () => void;
}

export default function DropPage({
  vessel, depth, points, light, dark, loopCount,
  survived, fragmentsAwarded, metaCounter,
  onReturnToStaging, onExitToTitle,
}: DropPageProps) {
  return (
    <div data-phase="07_drop" data-kind="terminal">
      <h2>Drop</h2>
      <p>{survived
        ? 'You reached the bottom. The record is written.'
        : 'The Depth claimed you. But the record remains.'
      }</p>

      {/* <DropSummary /> */}
      <div data-component="summary">
        <div>Vessel: {vessel?.toUpperCase() ?? 'UNKNOWN'}</div>
        <div>Depth: {depth} / 5</div>
        <div>Points: {points}</div>
        <div>Parity: {light}L / {dark}D</div>
        <div>Status: {survived ? 'SURVIVED' : 'FALLEN'}</div>
        <div>Loops: {loopCount}</div>
      </div>

      {/* <MemoryFragmentsAward amount={fragmentsAwarded} /> */}
      <div data-component="fragments">
        {fragmentsAwarded > 0 && <span>+{fragmentsAwarded} Memory Fragments</span>}
      </div>

      {/* <MetaCounterDisplay /> */}
      {metaCounter?.incremented && (
        <div data-component="meta-counter">
          +1 {metaCounter.name}
        </div>
      )}

      {/* <UnlockBadge /> */}
      <div data-component="unlocks">
        {depth >= 3 && <span data-badge="currency">+1 Currency</span>}
        {!survived && <span data-badge="scar">Scar: Fractured</span>}
        {survived && <span data-badge="boon">Boon: Deep Memory</span>}
      </div>

      <div data-component="actions">
        <button onClick={onReturnToStaging}>Return to Staging</button>
        <button onClick={onExitToTitle}>Exit to Title</button>
      </div>
    </div>
  );
}
