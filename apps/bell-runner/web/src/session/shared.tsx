// =============================================================================
// SHARED COMPONENTS
// web/client/src/components/shared.tsx
//
// Reusable UI primitives that appear across multiple phases.
// Each is a blank skeleton ready for Sinerine styling.
// =============================================================================

import React from 'react';


// ── Parity Meter ─────────────────────────────────────────────────────
// Used in: Staging, Draft, Door, Drop

interface ParityMeterProps {
  light: number;
  dark: number;
  compact?: boolean;
}

export function ParityMeter({ light, dark, compact }: ParityMeterProps) {
  const total = light + dark || 1;
  return (
    <div data-component="parity-meter" data-compact={compact}>
      <div data-side="light" style={{ flex: light / total }}>
        {!compact && <span>Light {light}</span>}
      </div>
      <div data-side="dark" style={{ flex: dark / total }}>
        {!compact && <span>Dark {dark}</span>}
      </div>
    </div>
  );
}


// ── Health Bar ────────────────────────────────────────────────────────
// Used in: Level

interface HealthBarProps {
  current: number;
  max: number;
}

export function HealthBar({ current, max }: HealthBarProps) {
  const pct = (current / max) * 100;
  const low = pct <= 30;
  return (
    <div data-component="health-bar">
      <div data-fill data-low={low} style={{ width: `${pct}%` }} />
      <span>{current}/{max}</span>
    </div>
  );
}


// ── Timer Bar ─────────────────────────────────────────────────────────
// Used in: Level

interface TimerBarProps {
  percent: number;
  urgent?: boolean;
}

export function TimerBar({ percent, urgent }: TimerBarProps) {
  return (
    <div data-component="timer-bar">
      <div data-fill data-urgent={urgent} style={{ width: `${percent}%` }} />
    </div>
  );
}


// ── Depth Meter ───────────────────────────────────────────────────────
// Used in: Level, Door, Drop

interface DepthMeterProps {
  current: number;
  max: number;
}

export function DepthMeter({ current, max }: DepthMeterProps) {
  return (
    <div data-component="depth-meter">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i}
          data-pip
          data-reached={i + 1 < current}
          data-current={i + 1 === current}
        />
      ))}
    </div>
  );
}


// ── Phase Header ──────────────────────────────────────────────────────
// Used in: all phases

interface PhaseHeaderProps {
  phaseNumber: string;
  phaseName: string;
  color?: string;
}

export function PhaseHeader({ phaseNumber, phaseName, color }: PhaseHeaderProps) {
  return (
    <div data-component="phase-header">
      <span data-label>Phase {phaseNumber}</span>
      <span data-name style={{ color }}>{phaseName}</span>
    </div>
  );
}


// ── Keeper Silhouette ─────────────────────────────────────────────────
// Used in: Draft (Approach, Offering)

interface KeeperSilhouetteProps {
  keeper: 'surveyor' | 'smuggler';
  mood?: 'warm' | 'neutral' | 'cold' | 'urgent' | 'evasive';
}

export function KeeperSilhouette({ keeper, mood }: KeeperSilhouetteProps) {
  const icon = keeper === 'surveyor' ? '☀' : '◆';
  const color = keeper === 'surveyor' ? '#D4A843' : '#7B4FA2';
  return (
    <div data-component="keeper" data-keeper={keeper} data-mood={mood}>
      <div data-silhouette style={{ color }}>{icon}</div>
      <span data-label>{keeper === 'surveyor' ? 'Surveyor' : 'Smuggler'}</span>
    </div>
  );
}


// ── Theology Line ─────────────────────────────────────────────────────
// Used in: all phases (flavor text)

interface TheologyLineProps {
  text: string;
  alignment?: 'center' | 'left';
}

export function TheologyLine({ text, alignment = 'center' }: TheologyLineProps) {
  return (
    <p data-component="theology-line" style={{ textAlign: alignment }}>
      {text}
    </p>
  );
}


// ── Classification Tag ────────────────────────────────────────────────
// Used in: Select, Staging

interface ClassificationTagProps {
  tag: string;
  color?: string;
}

export function ClassificationTag({ tag, color }: ClassificationTagProps) {
  return (
    <span data-component="tag" style={{ borderColor: color, color }}>
      {tag}
    </span>
  );
}


// ── Unlock Badge ──────────────────────────────────────────────────────
// Used in: Drop

interface UnlockBadgeProps {
  label: string;
  kind: 'currency' | 'scar' | 'boon' | 'meta';
  color?: string;
}

export function UnlockBadge({ label, kind, color }: UnlockBadgeProps) {
  return (
    <span data-component="badge" data-kind={kind} style={{ borderColor: color, color }}>
      {label}
    </span>
  );
}
