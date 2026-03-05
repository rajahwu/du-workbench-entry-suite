// =============================================================================
// PAGE: DRAFT (Phase 04 — Encounter)
// web/client/src/pages/DraftPage.tsx
//
// The Keepers present their offerings. Pick 2 of 4.
// 3-stage internal flow: Approach → Offering → Reckoning.
// =============================================================================

import React, { useState } from 'react';

// ── Sub-components to build ──────────────────────────────────────────
// <DraftRoot />          — context provider for draft state
// <KeeperApproach />     — mood setting, keeper silhouettes, tone signals
// <KeeperOffer side />   — one keeper's card offerings
// <CardPickGrid />       — selectable card layout with insight visibility
// <RerollButton />       — spend reroll, re-deal cards
// <DraftReckoning />     — parity delta preview, keeper commentary
// <EnterDepthButton />   — rings the bell: draft → level

type DraftStage = 'approach' | 'offering' | 'reckoning';

interface DraftCard {
  id: string;
  name: string;
  keeper: 'surveyor' | 'smuggler';
  lightDelta: number;
  darkDelta: number;
}

interface DraftPageProps {
  vessel: string | null;
  light: number;
  dark: number;
  insight: number;
  lightPool: DraftCard[];
  darkPool: DraftCard[];
  onEnterDepth: (selectedCards: DraftCard[]) => void;
  onAbort?: () => void;
}

export default function DraftPage({
  vessel, light, dark, insight,
  lightPool, darkPool,
  onEnterDepth, onAbort,
}: DraftPageProps) {
  const [stage, setStage] = useState<DraftStage>('approach');
  const [selected, setSelected] = useState<DraftCard[]>([]);
  const [rerolls, setRerolls] = useState(1);

  const handlePick = (card: DraftCard) => {
    if (selected.length < 2 && !selected.find(c => c.id === card.id)) {
      setSelected(prev => [...prev, card]);
    }
  };

  const handleReroll = () => {
    if (rerolls > 0) {
      setRerolls(r => r - 1);
      setSelected([]);
      // Consumer re-deals cards
    }
  };

  const handleCommit = () => {
    if (selected.length === 2) {
      setStage('reckoning');
    }
  };

  return (
    <div data-phase="04_draft" data-kind="encounter">
      {/* Parity display — always visible */}
      <div data-component="parity-bar">
        <span>Light: {light}</span>
        <span>Dark: {dark}</span>
      </div>

      {stage === 'approach' && (
        <div data-stage="approach">
          {/* <KeeperApproach vessel={vessel} light={light} dark={dark} /> */}
          <p>The Keepers present their offerings.</p>
          <button onClick={() => setStage('offering')}>Proceed to Offering</button>
        </div>
      )}

      {stage === 'offering' && (
        <div data-stage="offering">
          {/* <KeeperOffer side="light" cards={lightPool} onPick={handlePick} /> */}
          <div data-keeper="surveyor">
            <h3>Surveyor (Light)</h3>
            {lightPool.map(card => (
              <button key={card.id} onClick={() => handlePick(card)}
                disabled={!!selected.find(c => c.id === card.id)}>
                {card.name} (+{card.lightDelta}L)
              </button>
            ))}
          </div>

          {/* <KeeperOffer side="dark" cards={darkPool} onPick={handlePick} /> */}
          <div data-keeper="smuggler">
            <h3>Smuggler (Dark)</h3>
            {darkPool.map(card => (
              <button key={card.id} onClick={() => handlePick(card)}
                disabled={!!selected.find(c => c.id === card.id)}>
                {card.name} (+{card.darkDelta}D)
              </button>
            ))}
          </div>

          <p>Picks: {selected.length}/2</p>
          <button onClick={handleReroll} disabled={rerolls <= 0 || selected.length > 0}>
            Reroll ({rerolls})
          </button>
          <button onClick={handleCommit} disabled={selected.length < 2}>
            Commit
          </button>
        </div>
      )}

      {stage === 'reckoning' && (
        <div data-stage="reckoning">
          {/* <DraftReckoning cards={selected} light={light} dark={dark} vessel={vessel} /> */}
          <h3>Reckoning</h3>
          {selected.map(c => (
            <div key={c.id}>{c.name}: L+{c.lightDelta} D+{c.darkDelta}</div>
          ))}
          <button onClick={() => onEnterDepth(selected)}>Enter the Depth</button>
          <button onClick={() => { setStage('offering'); setSelected([]); }}>Back</button>
        </div>
      )}

      {onAbort && <button onClick={onAbort}>← Abort Draft</button>}
    </div>
  );
}
