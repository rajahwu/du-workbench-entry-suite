// =============================================================================
// PAGE: STAGING (Phase 03 — Prep)
// web/client/src/pages/StagingPage.tsx
//
// The locker room. Calm between descents.
// Re-entry point after death. Gets richer over runs.
// =============================================================================

import React from 'react';

// ── Sub-components to build ──────────────────────────────────────────
// <RunStats />           — vessel, depth, loop, parity display
// <StagingLocker />      — upgrade grid (empty first run, rich later)
// <KeeperCommentary />   — contextual keeper text based on run history
// <InsightMeter />       — Penitent-only: lore engagement tracker
// <InitiateDraftButton />— rings the bell: staging → draft

interface StagingPageProps {
  vessel: string | null;
  depth: number;
  loopCount: number;
  light: number;
  dark: number;
  onInitiateDraft: () => void;
  onReturnToSelect?: () => void;
}

export default function StagingPage({
  vessel, depth, loopCount, light, dark,
  onInitiateDraft, onReturnToSelect,
}: StagingPageProps) {
  return (
    <div data-phase="03_staging" data-kind="prep">
      {/* <RunStats vessel={vessel} depth={depth} loop={loopCount} light={light} dark={dark} /> */}
      <div data-component="run-stats">
        <span>Vessel: {vessel ?? 'UNKNOWN'}</span>
        <span>Depth: {depth}</span>
        <span>Loop: {loopCount}</span>
        <span>Light: {light} / Dark: {dark}</span>
      </div>

      {/* <StagingLocker /> */}
      <div data-component="locker">
        {/* Upgrade grid — populated by meta-progression */}
      </div>

      {/* <KeeperCommentary /> */}
      <div data-component="keeper-commentary">
        {/* Contextual text based on run state */}
      </div>

      <button onClick={onInitiateDraft}>INITIATE DRAFT</button>
      {onReturnToSelect && (
        <button onClick={onReturnToSelect}>← Return to Select</button>
      )}
    </div>
  );
}
