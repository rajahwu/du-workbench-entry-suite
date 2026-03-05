// =============================================================================
// PAGE: LEVEL (Phase 05 — Encounter)
// web/client/src/pages/LevelPage.tsx
//
// The cartridge slot. Active gameplay happens here.
// The page is a container — the actual mini-game is a cartridge component.
// =============================================================================

import React from 'react';

// ── Sub-components to build ──────────────────────────────────────────
// <LevelHUD />           — timer, HP bar, points, depth pips
// <TimerBar />           — countdown with vessel-specific decay rate
// <HealthBar />          — current/max with low-HP warning state
// <CartridgeSlot />      — renders the active cartridge (tap grid, puzzle, etc.)
// <GridTapArea />        — first cartridge: 3x3 tap mini-game
// <LevelOutcome />       — survived/destroyed overlay before transition

interface LevelPageProps {
  depth: number;
  maxHealth: number;
  light: number;
  dark: number;
  vesselId: string | null;
  onLevelComplete: (survived: boolean, points: number) => void;
}

export default function LevelPage({
  depth, maxHealth, light, dark, vesselId,
  onLevelComplete,
}: LevelPageProps) {
  return (
    <div data-phase="05_level" data-kind="encounter">
      {/* <LevelHUD depth={depth} maxHealth={maxHealth} light={light} dark={dark} /> */}
      <div data-component="hud">
        <span>Depth {depth}</span>
        <span>HP: {maxHealth}/{maxHealth}</span>
        <span>L:{light} D:{dark}</span>
      </div>

      {/* <TimerBar vessel={vesselId} /> */}
      <div data-component="timer">
        {/* Timer bar — decay rate from vessel mechanics */}
      </div>

      {/* <CartridgeSlot cartridgeId="dudael_9pad" depth={depth} vessel={vesselId} /> */}
      <div data-component="cartridge-slot">
        {/* The actual mini-game renders here */}
        {/* <GridTapArea onHit={...} onMiss={...} /> */}
        <p>[ CARTRIDGE: 3×3 TAP GRID ]</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gap: 4 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <button key={i} style={{ height: 80 }}>
              {/* Cell {i} */}
            </button>
          ))}
        </div>
      </div>

      {/* Dev controls for testing */}
      <div data-component="dev-controls">
        <button onClick={() => onLevelComplete(true, depth * 10)}>
          [DEV] Survive
        </button>
        <button onClick={() => onLevelComplete(false, depth * 3)}>
          [DEV] Die
        </button>
      </div>
    </div>
  );
}
