// =============================================================================
// PAGE: SELECT (Phase 02 — Gate)
// web/client/src/pages/SelectPage.tsx
//
// The 3-layer commitment: Guide → Mode → Vessel.
// Each step narrows the space. Final step rings the bell.
// =============================================================================

import React, { useState } from 'react';

// ── Sub-components to build ──────────────────────────────────────────
// <GuidePicker />        — Light (Surveyor) vs Dark (Smuggler)
// <ModePicker />         — Steward (free the Bound) vs Solo (bind for power)
// <VesselCarousel />     — the five Bound, with sigils and stat bars
// <LockConfirmation />   — final commitment before identity locks

type GateStep = 0 | 1 | 2;

interface SelectPageProps {
  onLockGate: (guide: string, mode: string, vesselId: string) => void;
}

export default function SelectPage({ onLockGate }: SelectPageProps) {
  const [step, setStep] = useState<GateStep>(0);
  const [guide, setGuide] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [vesselId, setVesselId] = useState<string | null>(null);

  const handleGuide = (g: string) => { setGuide(g); setStep(1); };
  const handleMode = (m: string) => { setMode(m); setStep(2); };
  const handleLock = () => {
    if (guide && mode && vesselId) {
      onLockGate(guide, mode, vesselId);
    }
  };
  const handleBack = () => setStep(prev => Math.max(0, prev - 1) as GateStep);

  return (
    <div data-phase="02_select" data-kind="select">
      {step === 0 && (
        <div data-step="guide">
          {/* <GuidePicker onSelect={handleGuide} /> */}
          <h2>Choose Your Guide</h2>
          <button onClick={() => handleGuide('light')}>Path of Light</button>
          <button onClick={() => handleGuide('dark')}>Path of Dark</button>
        </div>
      )}

      {step === 1 && (
        <div data-step="mode">
          {/* <ModePicker guide={guide} onSelect={handleMode} onBack={handleBack} /> */}
          <h2>Choose Your Mode</h2>
          <button onClick={() => handleMode('steward')}>Steward</button>
          <button onClick={() => handleMode('solo')}>Solo</button>
          <button onClick={handleBack}>← Back</button>
        </div>
      )}

      {step === 2 && (
        <div data-step="vessel">
          {/* <VesselCarousel guide={guide} mode={mode} onSelect={setVesselId} /> */}
          <h2>Choose Your Vessel</h2>
          {['seraph', 'shadow', 'exile', 'penitent', 'rebel'].map(v => (
            <button key={v} onClick={() => setVesselId(v)} data-active={vesselId === v}>
              {v.toUpperCase()}
            </button>
          ))}
          <button onClick={handleLock} disabled={!vesselId}>Lock Vessel</button>
          <button onClick={handleBack}>← Back</button>
        </div>
      )}
    </div>
  );
}
