// =============================================================================
// PAGE: ENTRY (Phase 01 — Title)
// web/client/src/pages/EntryPage.tsx
//
// The door. User becomes Runner.
// Blank shell — compose your UI pieces here.
// =============================================================================

import React from 'react';

// ── Sub-components to build ──────────────────────────────────────────
// <TitleAnimation />     — PixiJS procedural animation wrapper
// <IdentityExchange />   — profile detection, consent check
// <EnterButton />        — rings the bell: title → select

interface EntryPageProps {
  onEnter: () => void;
  isBooting: boolean;
}

export default function EntryPage({ onEnter, isBooting }: EntryPageProps) {
  return (
    <div data-phase="01_title" data-kind="entry">
      {/* Your title screen goes here */}
      <h1>DUDAEL</h1>
      <p>THE DROP</p>
      <button onClick={onEnter} disabled={isBooting}>
        {isBooting ? 'INITIALIZING...' : 'ENTER DROP'}
      </button>
    </div>
  );
}
