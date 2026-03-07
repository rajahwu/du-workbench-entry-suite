Here’s a clean Drill 2 React implementation: logic + UI, no fancy animations yet, matching the Bell–Seal–Beam doctrine (external bell, linear phases, ledger, accumulating state). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/43014702/79fd4d3a-a325-467c-93e3-7978ca0920d4/Bell_Seal_Beam_Token_State_Machine.md)

***

## React Drill 2 – Minimal Bell Runner

Assume Vite + React + TypeScript (you can drop `: types` if you prefer JS).

```tsx
// src/App.tsx
import React, { useState } from "react";

type Phase = {
  id: number;
  title: string;
  name: string;
};

const PHASES: Phase[] = [
  { id: 0, title: "Title",     name: "TitleExchange" },
  { id: 1, title: "Selection", name: "SelectionVessel" },
  { id: 2, title: "Keep",      name: "KeepStable" },
  { id: 3, title: "World",     name: "WorldWalk" },
  { id: 4, title: "Dungeon",   name: "DungeonLevel" },
  { id: 5, title: "Tally",     name: "TallyPath" },
  { id: 6, title: "Route",     name: "RouteDecision" },
];

type RunnerState = {
  profile: { playerID: string };
  tutorial: boolean;
  vessel?: string;
  vesselClass?: string;
  equipment?: { armor: string; weapon: string };
  resources?: { health: number; essence: number };
  worldInteractions?: { discovered: number; enemies: number };
  challengeState?: { completed: boolean; bossDefeated: boolean };
  rewards?: { xp: number; loot: string[] };
  nextPath?: string;
};

type LedgerEntry = {
  id: number;
  timestamp: string;
  fromPhase: Phase;
  toPhase: Phase;
  runnerState: RunnerState;
};

const createInitialRunnerState = (): RunnerState => ({
  profile: { playerID: "p001" },
  tutorial: false,
});

function App() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [runnerState, setRunnerState] = useState<RunnerState>(
    createInitialRunnerState()
  );
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [nextId, setNextId] = useState(1);

  const canAdvance = currentPhaseIndex < PHASES.length - 1;

  const advanceRunner = () => {
    if (!canAdvance) return;

    const fromIndex = currentPhaseIndex;
    const toIndex = currentPhaseIndex + 1;

    // 1. Update runner state according to phase we enter (mirrors doc). [file:1]
    const newState: RunnerState = { ...runnerState };
    switch (toIndex) {
      case 1:
        newState.vessel = "Seraph";
        newState.vesselClass = "High-Light Guardian";
        break;
      case 2:
        newState.equipment = { armor: "starting-robe", weapon: "insight" };
        newState.resources = { health: 20, essence: 5 };
        break;
      case 3:
        newState.worldInteractions = { discovered: 3, enemies: 2 };
        break;
      case 4:
        newState.challengeState = { completed: true, bossDefeated: true };
        break;
      case 5:
        newState.rewards = { xp: 500, loot: ["gem", "scroll"] };
        break;
      case 6:
        newState.nextPath = "return-to-world";
        break;
    }

    // 2. Record ledger entry (engine “records transition”). [file:1]
    const entry: LedgerEntry = {
      id: nextId,
      timestamp: new Date().toLocaleTimeString(),
      fromPhase: PHASES[fromIndex],
      toPhase: PHASES[toIndex],
      runnerState: newState,
    };

    setCurrentPhaseIndex(toIndex);
    setRunnerState(newState);
    setLedger((prev) => [...prev, entry]);
    setNextId((id) => id + 1);
  };

  const handleFireBell = () => {
    // external bell: if fired and we can move, advance runner by one step. [file:1]
    if (canAdvance) {
      advanceRunner();
    }
  };

  const handleReset = () => {
    setCurrentPhaseIndex(0);
    setRunnerState(createInitialRunnerState());
    setLedger([]);
    setNextId(1);
  };

  return (
    <div style={styles.app}>
      <h1>Bell–Seal–Beam Runner Drill 2</h1>
      <p style={styles.subtitle}>
        External bell advances pawn through 7 phases. Engine only steps; no seals or beam modeled here.
      </p>

      {/* Phase row */}
      <div style={styles.phaseRow}>
        {PHASES.map((phase, index) => {
          const isActive = index === currentPhaseIndex;
          return (
            <div
              key={phase.id}
              style={{
                ...styles.phaseBox,
                ...(isActive ? styles.phaseBoxActive : {}),
              }}
            >
              <div style={styles.phaseNumber}>Phase {phase.id}</div>
              <div style={styles.phaseTitle}>{phase.title}</div>
            </div>
          );
        })}
      </div>

      {/* Pawn (simple: shows active phase label for now) */}
      <div style={styles.statusBar}>
        <div>
          <div style={styles.label}>Current Phase</div>
          <div style={styles.value}>
            {currentPhaseIndex}: {PHASES[currentPhaseIndex].title}
          </div>
        </div>
        <div>
          <div style={styles.label}>Transitions</div>
          <div style={styles.value}>{ledger.length}</div>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <button
          style={styles.primaryButton}
          onClick={handleFireBell}
          disabled={!canAdvance}
        >
          🔔 Fire Bell (Advance Runner)
        </button>
        <button style={styles.secondaryButton} onClick={handleReset}>
          ↻ Reset Runner
        </button>
      </div>

      {/* Runner State */}
      <div style={styles.statePanel}>
        <h2 style={{ marginBottom: 8 }}>Runner State</h2>
        <pre style={styles.statePre}>
          {JSON.stringify(runnerState, null, 2)}
        </pre>
      </div>

      {/* Ledger */}
      <div style={styles.ledger}>
        <h2 style={{ marginBottom: 8 }}>Transition Ledger</h2>
        {ledger.length === 0 ? (
          <p style={styles.emptyLedger}>No transitions recorded yet…</p>
        ) : (
          ledger
            .slice()
            .reverse()
            .map((entry) => (
              <div key={entry.id} style={styles.ledgerEntry}>
                <div style={styles.ledgerTimestamp}>{entry.timestamp}</div>
                <div>
                  {entry.fromPhase.title} → {entry.toPhase.title}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  app: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
    minHeight: "100vh",
    padding: "24px",
  },
  subtitle: {
    color: "#cbd5e1",
    marginBottom: 16,
  },
  phaseRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 16,
  },
  phaseBox: {
    flex: 1,
    minWidth: 80,
    padding: "12px 8px",
    borderRadius: 8,
    border: "2px solid rgba(56,189,248,0.3)",
    background: "rgba(56,189,248,0.08)",
    textAlign: "center",
  },
  phaseBoxActive: {
    background: "rgba(56,189,248,0.35)",
    boxShadow: "0 0 18px rgba(56,189,248,0.5)",
  },
  phaseNumber: {
    fontSize: 11,
    color: "#94a3b8",
    marginBottom: 2,
  },
  phaseTitle: {
    fontSize: 13,
    fontWeight: 600,
  },
  statusBar: {
    display: "flex",
    gap: 24,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    background: "rgba(56,189,248,0.08)",
  },
  label: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "#94a3b8",
  },
  value: {
    fontSize: 16,
    fontWeight: 600,
  },
  controls: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
  },
  primaryButton: {
    padding: "10px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    backgroundColor: "#38bdf8",
    color: "#0f172a",
    fontWeight: 600,
  },
  secondaryButton: {
    padding: "10px 16px",
    borderRadius: 6,
    border: "1px solid rgba(148,163,184,0.6)",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "#e2e8f0",
    fontWeight: 500,
  },
  statePanel: {
    marginTop: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    background: "rgba(34,197,94,0.08)",
    border: "1px solid rgba(34,197,94,0.35)",
  },
  statePre: {
    fontSize: 12,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
  ledger: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    background: "#1e293b",
  },
  emptyLedger: {
    fontSize: 12,
    color: "#94a3b8",
  },
  ledgerEntry: {
    marginBottom: 8,
    padding: 8,
    borderLeft: "3px solid #38bdf8",
    background: "rgba(56,189,248,0.1)",
    borderRadius: 4,
    fontSize: 12,
  },
  ledgerTimestamp: {
    fontSize: 10,
    color: "#94a3b8",
    marginBottom: 2,
  },
};

export default App;
```

This keeps the core engine ideas intact (external bell, linear phase index, accumulating runner state, ledger per transition) without introducing the full class-based engine yet. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/43014702/79fd4d3a-a325-467c-93e3-7978ca0920d4/Bell_Seal_Beam_Token_State_Machine.md)

If you’d like, next I can show you how to refactor this into a separate `runnerEngine.ts` module so the React side is purely view + wiring.