import { useState, useCallback, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════
// BELL PHASE ENGINE — PORTABLE STATE MACHINE (EMBEDDED FOR PRACTICE)
// This is the actual engine logic from bell-runner, running live.
// ═══════════════════════════════════════════════════════════════════════

const PHASE_KINDS = ["entry","select","prep","encounter","encounter","branch","terminal"];

const DUDAEL_PHASES = [
  { id: "01_title",   slot: 1, kind: "entry",     label: "Title" },
  { id: "02_select",  slot: 2, kind: "select",    label: "Select" },
  { id: "03_staging", slot: 3, kind: "prep",      label: "Staging" },
  { id: "04_draft",   slot: 4, kind: "encounter",  label: "Draft" },
  { id: "05_level",   slot: 5, kind: "encounter",  label: "Level" },
  { id: "06_door",    slot: 6, kind: "branch",    label: "Door" },
  { id: "07_drop",    slot: 7, kind: "terminal",  label: "Drop" },
];

function createDudaelState() {
  return {
    identityLocked: false,
    vesselId: null,
    guide: null,
    mode: null,
    depth: 0,
    loopCount: 0,
    currentLight: 0,
    currentDark: 0,
    insight: 0,
    runActive: false,
  };
}

// Seal factory (mirrors seal/factory.ts)
function stateSeal(id, description, predicate) {
  return { id, description, evaluate: (_b, _w, state) => {
    const pass = predicate(state);
    return pass ? { pass: true, sealId: id } : { pass: false, reason: description, sealId: id };
  }};
}

function oneWayGate(id, description, isLocked) {
  return { id, description, evaluate: (_b, _w, state) => {
    if (isLocked(state)) return { pass: false, reason: description, sealId: id };
    return { pass: true, sealId: id };
  }};
}

// Domain seals (mirrors config/registry/dudael.ts)
const hasVessel = stateSeal("du:has-vessel", "A vessel must be selected", s => s.vesselId !== null);
const hasGuide = stateSeal("du:has-guide", "A guide must be chosen", s => s.guide !== null);
const hasMode = stateSeal("du:has-mode", "A descent mode must be chosen", s => s.mode !== null);
const identityNotLocked = oneWayGate("du:identity-gate", "Cannot return — identity locked", s => s.identityLocked);
const runIsActive = stateSeal("du:run-active", "A run must be active", s => s.runActive);

// Edge registry (mirrors dudael.ts DUDAEL_EDGES)
const EDGES = [
  { from: "01_title", to: "02_select", kind: "forward", desc: "Enter → Select", seals: [] },
  { from: "02_select", to: "03_staging", kind: "forward", desc: "Lock identity → Staging", seals: [hasVessel, hasGuide, hasMode] },
  { from: "03_staging", to: "04_draft", kind: "forward", desc: "Initiate draft", seals: [runIsActive] },
  { from: "04_draft", to: "05_level", kind: "forward", desc: "Enter depth", seals: [runIsActive] },
  { from: "05_level", to: "06_door", kind: "forward", desc: "Level survived → Door", seals: [runIsActive] },
  { from: "06_door", to: "04_draft", kind: "loop", desc: "Door → Draft (deeper)", seals: [runIsActive] },
  { from: "06_door", to: "07_drop", kind: "forward", desc: "No doors → Drop", seals: [runIsActive] },
  { from: "05_level", to: "07_drop", kind: "forward", desc: "Vessel destroyed → Drop", seals: [runIsActive] },
  { from: "07_drop", to: "03_staging", kind: "reset", desc: "Run ended → Staging", seals: [] },
  { from: "07_drop", to: "01_title", kind: "escape", desc: "Exit to title", seals: [] },
  { from: "03_staging", to: "02_select", kind: "forward", desc: "Back to select", seals: [identityNotLocked] },
  { from: "04_draft", to: "03_staging", kind: "loop", desc: "Abort draft", seals: [runIsActive] },
  { from: "06_door", to: "03_staging", kind: "reset", desc: "Retreat from doors", seals: [runIsActive] },
];

// Mini engine
function createEngine(initialState) {
  let current = "01_title";
  let history = ["01_title"];
  let state = { ...initialState };
  let count = 0;

  function ring(to) {
    const from = current;
    const edge = EDGES.find(e => e.from === from && e.to === to);

    if (!edge) {
      return { outcome: "stay", from, attemptedTo: to, reason: `No edge: ${from} → ${to}`, failedSeals: [{ sealId: "bell:legality", reason: `No registered edge: ${from} → ${to}` }] };
    }

    const failures = [];
    for (const seal of edge.seals) {
      const result = seal.evaluate(null, null, state);
      if (!result.pass) failures.push(result);
    }

    if (failures.length > 0) {
      return { outcome: "stay", from, attemptedTo: to, failedSeals: failures };
    }

    current = to;
    history.push(to);
    count++;
    return { outcome: "transfer", from, to, phase: to, edgeKind: edge.kind };
  }

  return {
    ring,
    getCurrentPhase: () => current,
    getState: () => ({ ...state }),
    setState: (updates) => { state = { ...state, ...updates }; },
    getHistory: () => [...history],
    getTransitionCount: () => count,
    getLegalEdges: () => EDGES.filter(e => e.from === current),
    reset: () => { current = "01_title"; history = ["01_title"]; state = { ...initialState }; count = 0; },
  };
}

// ═══════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════

const COLORS = {
  bg: "#0a0e1a",
  surface: "#111827",
  surfaceAlt: "#1a1f35",
  border: "#2a3150",
  borderActive: "#d4a843",
  text: "#e8dcc8",
  textMuted: "#7a7462",
  textDim: "#4a4538",
  amber: "#d4a843",
  amberGlow: "rgba(212,168,67,0.15)",
  amberBright: "#f0c95c",
  violet: "#7b4fa2",
  violetGlow: "rgba(123,79,162,0.15)",
  green: "#4ade80",
  red: "#ef4444",
  redGlow: "rgba(239,68,68,0.12)",
  greenGlow: "rgba(74,222,128,0.12)",
};

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

function PhaseChain({ currentPhase, history }) {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
      {DUDAEL_PHASES.map((phase, i) => {
        const isActive = phase.id === currentPhase;
        const visited = history.includes(phase.id);
        return (
          <div key={phase.id} style={{
            flex: "1 1 80px",
            minWidth: 70,
            padding: "8px 4px",
            borderRadius: 6,
            border: `1px solid ${isActive ? COLORS.amber : visited ? COLORS.border : COLORS.border}`,
            background: isActive ? COLORS.amberGlow : "transparent",
            textAlign: "center",
            transition: "all 0.3s ease",
            boxShadow: isActive ? `0 0 12px ${COLORS.amberGlow}` : "none",
          }}>
            <div style={{ fontSize: 9, color: COLORS.textDim, fontFamily: "monospace", letterSpacing: 1 }}>
              {phase.kind.toUpperCase()}
            </div>
            <div style={{ fontSize: 12, fontWeight: isActive ? 700 : 400, color: isActive ? COLORS.amberBright : visited ? COLORS.text : COLORS.textMuted, fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" }}>
              {phase.label}
            </div>
            <div style={{ fontSize: 8, color: COLORS.textDim, marginTop: 2, fontFamily: "monospace" }}>
              {phase.id}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LedgerPanel({ entries }) {
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [entries.length]);

  return (
    <div style={{ maxHeight: 260, overflowY: "auto", padding: 4 }}>
      {entries.length === 0 && <p style={{ fontSize: 11, color: COLORS.textDim, fontStyle: "italic" }}>No transitions recorded…</p>}
      {entries.map((e, i) => (
        <div key={i} style={{
          marginBottom: 6,
          padding: "6px 8px",
          borderLeft: `3px solid ${e.outcome === "transfer" ? COLORS.amber : COLORS.red}`,
          background: e.outcome === "transfer" ? COLORS.greenGlow : COLORS.redGlow,
          borderRadius: 4,
          fontSize: 11,
          fontFamily: "monospace",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: e.outcome === "transfer" ? COLORS.green : COLORS.red, fontWeight: 600 }}>
              {e.outcome === "transfer" ? "TRANSFER" : "STAY"}
            </span>
            <span style={{ color: COLORS.textDim, fontSize: 9 }}>{e.time}</span>
          </div>
          <div style={{ color: COLORS.text, marginTop: 2 }}>
            {e.from} → {e.outcome === "transfer" ? e.to : <span style={{ color: COLORS.red }}>{e.attemptedTo} (blocked)</span>}
          </div>
          {e.failedSeals && e.failedSeals.length > 0 && (
            <div style={{ color: COLORS.red, fontSize: 10, marginTop: 2 }}>
              {e.failedSeals.map((s, j) => <div key={j}>✗ {s.sealId}: {s.reason}</div>)}
            </div>
          )}
          {e.edgeKind && <div style={{ color: COLORS.textDim, fontSize: 9, marginTop: 1 }}>edge: {e.edgeKind}</div>}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

function StatePanel({ gameState }) {
  return (
    <div style={{ fontSize: 11, fontFamily: "monospace", lineHeight: 1.6 }}>
      {Object.entries(gameState).map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${COLORS.border}`, padding: "2px 0" }}>
          <span style={{ color: COLORS.textMuted }}>{k}</span>
          <span style={{ color: v === null ? COLORS.textDim : v === true ? COLORS.green : v === false ? COLORS.red : COLORS.amberBright, fontWeight: 500 }}>
            {v === null ? "null" : v === true ? "true" : v === false ? "false" : String(v)}
          </span>
        </div>
      ))}
    </div>
  );
}

function EdgeButtons({ edges, onRing }) {
  if (edges.length === 0) return <p style={{ fontSize: 11, color: COLORS.textDim }}>No edges from current phase.</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {edges.map((e, i) => {
        const kindColor = e.kind === "forward" ? COLORS.amber : e.kind === "loop" ? COLORS.violet : e.kind === "reset" ? COLORS.textMuted : COLORS.red;
        return (
          <button key={i} onClick={() => onRing(e.to)} style={{
            padding: "8px 12px",
            border: `1px solid ${kindColor}`,
            borderRadius: 6,
            background: "transparent",
            color: COLORS.text,
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "monospace",
            fontSize: 11,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={ev => { ev.target.style.background = `${kindColor}22`; }}
          onMouseLeave={ev => { ev.target.style.background = "transparent"; }}
          >
            <span style={{ color: kindColor, fontWeight: 600 }}>→ {e.to}</span>
            <span style={{ color: COLORS.textDim, marginLeft: 8 }}>{e.desc}</span>
            <span style={{ float: "right", fontSize: 9, color: COLORS.textDim }}>[{e.kind}]</span>
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════════════════

const TABS = [
  { id: "runner", label: "Runner", icon: "▶" },
  { id: "library", label: "Library", icon: "◈" },
  { id: "ledger", label: "Ledger", icon: "☰" },
  { id: "lab", label: "Lab", icon: "⚗" },
];

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════

export default function BellPhaseEngineLab() {
  const [activeTab, setActiveTab] = useState("runner");
  const [engine] = useState(() => createEngine(createDudaelState()));
  const [currentPhase, setCurrentPhase] = useState("01_title");
  const [gameState, setGameState] = useState(createDudaelState());
  const [ledger, setLedger] = useState([]);
  const [history, setHistory] = useState(["01_title"]);
  const [lastResult, setLastResult] = useState(null);

  const syncFromEngine = useCallback(() => {
    setCurrentPhase(engine.getCurrentPhase());
    setGameState(engine.getState());
    setHistory(engine.getHistory());
  }, [engine]);

  const handleRing = useCallback((to) => {
    const result = engine.ring(to);
    const entry = {
      ...result,
      time: new Date().toLocaleTimeString(),
    };
    setLedger(prev => [...prev, entry]);
    setLastResult(result);
    syncFromEngine();
  }, [engine, syncFromEngine]);

  const handleStateUpdate = useCallback((key, value) => {
    const updates = {};
    if (value === "true") updates[key] = true;
    else if (value === "false") updates[key] = false;
    else if (value === "null") updates[key] = null;
    else if (!isNaN(Number(value))) updates[key] = Number(value);
    else updates[key] = value;
    engine.setState(updates);
    syncFromEngine();
  }, [engine, syncFromEngine]);

  const handleReset = useCallback(() => {
    engine.reset();
    setLedger([]);
    setLastResult(null);
    syncFromEngine();
  }, [engine, syncFromEngine]);

  const legalEdges = EDGES.filter(e => e.from === currentPhase);

  return (
    <div style={{
      fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
      background: COLORS.bg,
      color: COLORS.text,
      minHeight: "100vh",
      padding: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px 12px",
        borderBottom: `1px solid ${COLORS.border}`,
        background: `linear-gradient(180deg, ${COLORS.surfaceAlt} 0%, ${COLORS.bg} 100%)`,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 400, letterSpacing: 4, color: COLORS.amberBright, fontFamily: "'Palatino Linotype', serif" }}>
            DUDAEL
          </h1>
          <span style={{ fontSize: 10, color: COLORS.textDim, fontFamily: "monospace", letterSpacing: 2 }}>
            ENTRY SUITE · BELL PHASE ENGINE
          </span>
        </div>
        <div style={{ fontSize: 9, color: COLORS.textDim, fontFamily: "monospace" }}>
          Action → Bell → Wall → Seal → Transfer | Stay
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.border}` }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1,
            padding: "10px 0",
            border: "none",
            borderBottom: activeTab === tab.id ? `2px solid ${COLORS.amber}` : "2px solid transparent",
            background: activeTab === tab.id ? COLORS.amberGlow : "transparent",
            color: activeTab === tab.id ? COLORS.amberBright : COLORS.textMuted,
            cursor: "pointer",
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: 1,
            transition: "all 0.2s ease",
          }}>
            <span style={{ marginRight: 6 }}>{tab.icon}</span>
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px" }}>

        {/* ─── RUNNER TAB ─── */}
        {activeTab === "runner" && (
          <div>
            <PhaseChain currentPhase={currentPhase} history={history} />

            {/* Last Result Flash */}
            {lastResult && (
              <div style={{
                padding: "8px 12px",
                marginBottom: 12,
                borderRadius: 6,
                background: lastResult.outcome === "transfer" ? COLORS.greenGlow : COLORS.redGlow,
                border: `1px solid ${lastResult.outcome === "transfer" ? COLORS.green : COLORS.red}40`,
                fontSize: 11,
                fontFamily: "monospace",
              }}>
                <span style={{ fontWeight: 700, color: lastResult.outcome === "transfer" ? COLORS.green : COLORS.red }}>
                  {lastResult.outcome === "transfer" ? "✓ TRANSFER" : "✗ STAY"}
                </span>
                {" "}{lastResult.from} → {lastResult.outcome === "transfer" ? lastResult.to : lastResult.attemptedTo}
                {lastResult.failedSeals?.map((s, i) => (
                  <div key={i} style={{ color: COLORS.red, fontSize: 10, marginTop: 2 }}>↳ {s.reason}</div>
                ))}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Left: Ring Bell */}
              <div style={{ background: COLORS.surface, borderRadius: 8, padding: 12, border: `1px solid ${COLORS.border}` }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 12, color: COLORS.amber, fontFamily: "monospace", letterSpacing: 1 }}>
                  RING THE BELL
                </h3>
                <p style={{ fontSize: 10, color: COLORS.textDim, margin: "0 0 8px" }}>
                  Legal edges from <span style={{ color: COLORS.amberBright }}>{currentPhase}</span>
                </p>
                <EdgeButtons edges={legalEdges} onRing={handleRing} />
                <button onClick={handleReset} style={{
                  marginTop: 12,
                  padding: "6px 12px",
                  border: `1px solid ${COLORS.textDim}`,
                  borderRadius: 4,
                  background: "transparent",
                  color: COLORS.textMuted,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontSize: 10,
                }}>
                  ↻ Reset Engine
                </button>
              </div>

              {/* Right: State */}
              <div style={{ background: COLORS.surface, borderRadius: 8, padding: 12, border: `1px solid ${COLORS.border}` }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 12, color: COLORS.amber, fontFamily: "monospace", letterSpacing: 1 }}>
                  DUDAEL STATE
                </h3>
                <StatePanel gameState={gameState} />
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 10, color: COLORS.textDim, fontFamily: "monospace" }}>
              Transitions: {ledger.filter(e => e.outcome === "transfer").length} · 
              Blocked: {ledger.filter(e => e.outcome === "stay").length} · 
              History: {history.length} phases
            </div>
          </div>
        )}

        {/* ─── LIBRARY TAB ─── */}
        {activeTab === "library" && (
          <div>
            <h3 style={{ margin: "0 0 12px", fontSize: 14, color: COLORS.amber, fontFamily: "'Palatino Linotype', serif" }}>
              System Library Archive
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { title: "Architecture", domain: "Engine & Workbench", desc: "PhaseWall contracts, Redux patterns, three-layer system" },
                { title: "Lore Bible", domain: "World & Lore", desc: "Oiketrion theology, The Five Bound, fallen angels" },
                { title: "Bound Spec", domain: "Entities & Classes", desc: "Vessel stats, Guides, Descent Modes, balance" },
                { title: "Systems Spec", domain: "Game Loop", desc: "7-phase loop, parity economy, door requirements" },
                { title: "Sinerine Brand", domain: "Brand & Aesthetic", desc: "43 tokens, forensic theophany, Cinzel/Inter/JetBrains" },
                { title: "Content Pipeline", domain: "Production", desc: "Workflow, templates, quality gates" },
                { title: "Refactor Log", domain: "Development", desc: "Completed refactors, in-progress, backlog" },
                { title: "Run Ledger", domain: "Living Record", desc: "Canonical runs, story beats, creative output" },
              ].map((doc, i) => (
                <div key={i} style={{
                  padding: 12,
                  borderRadius: 6,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.surface,
                  cursor: "pointer",
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={ev => { ev.currentTarget.style.borderColor = COLORS.amber; }}
                onMouseLeave={ev => { ev.currentTarget.style.borderColor = COLORS.border; }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>{doc.title}</div>
                  <div style={{ fontSize: 9, color: COLORS.amber, fontFamily: "monospace", marginBottom: 4, letterSpacing: 1 }}>{doc.domain.toUpperCase()}</div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, lineHeight: 1.4 }}>{doc.desc}</div>
                </div>
              ))}
            </div>

            {/* Engine Types Reference */}
            <div style={{ marginTop: 16, padding: 12, borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.surfaceAlt }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 11, color: COLORS.amber, fontFamily: "monospace" }}>ENGINE EXPORTS</h4>
              <div style={{ fontSize: 10, fontFamily: "monospace", color: COLORS.textMuted, lineHeight: 1.8, columnCount: 2, columnGap: 24 }}>
                {["createEngine", "BellEngine", "PhaseKind", "PhaseDefinition", "Bell", "BellSource", "WallPacket", "WallEdge", "SealResult", "SealFn", "Seal", "TransitionResult", "TransferResult", "StayResult", "EdgeKind", "EdgeDefinition", "EdgeEffect", "EngineConfig", "stateSeal", "payloadSeal", "oneWayGate", "thresholdSeal", "edgeLimitSeal", "sourceSeal", "composeSeal", "buildWall", "emptyWall", "isWallPayload", "readEdge", "isEdge"].map((exp, i) => (
                  <div key={i}><span style={{ color: COLORS.violet }}>export</span> {exp}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── LEDGER TAB ─── */}
        {activeTab === "ledger" && (
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: 14, color: COLORS.amber, fontFamily: "'Palatino Linotype', serif" }}>
              Transition Ledger
            </h3>
            <p style={{ fontSize: 10, color: COLORS.textDim, marginBottom: 12, fontFamily: "monospace" }}>
              Every bell ring recorded. Transfers and stays.
            </p>
            <LedgerPanel entries={ledger} />
            {ledger.length > 0 && (
              <div style={{ marginTop: 12, padding: 10, borderRadius: 6, background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: 10, fontFamily: "monospace", color: COLORS.textMuted }}>
                  <div>Total rings: {ledger.length}</div>
                  <div>Transfers: <span style={{ color: COLORS.green }}>{ledger.filter(e => e.outcome === "transfer").length}</span></div>
                  <div>Blocked: <span style={{ color: COLORS.red }}>{ledger.filter(e => e.outcome === "stay").length}</span></div>
                  <div>Unique phases visited: {[...new Set(history)].length} / 7</div>
                  <div>Current depth: {history.length - 1} transitions deep</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── LAB TAB ─── */}
        {activeTab === "lab" && (
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: 14, color: COLORS.amber, fontFamily: "'Palatino Linotype', serif" }}>
              Seal Testing Lab
            </h3>
            <p style={{ fontSize: 10, color: COLORS.textDim, marginBottom: 12, fontFamily: "monospace" }}>
              Modify DudaelState to test seal evaluation. Watch edges open and close.
            </p>

            {/* State Editor */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: COLORS.surface, borderRadius: 8, padding: 12, border: `1px solid ${COLORS.border}` }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 11, color: COLORS.amber, fontFamily: "monospace" }}>EDIT STATE</h4>
                {Object.entries(gameState).map(([key, val]) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <label style={{ flex: 1, fontSize: 10, fontFamily: "monospace", color: COLORS.textMuted }}>{key}</label>
                    {typeof val === "boolean" ? (
                      <button onClick={() => handleStateUpdate(key, val ? "false" : "true")} style={{
                        padding: "2px 8px",
                        border: `1px solid ${val ? COLORS.green : COLORS.red}`,
                        borderRadius: 3,
                        background: val ? COLORS.greenGlow : COLORS.redGlow,
                        color: val ? COLORS.green : COLORS.red,
                        cursor: "pointer",
                        fontFamily: "monospace",
                        fontSize: 10,
                      }}>
                        {String(val)}
                      </button>
                    ) : typeof val === "number" ? (
                      <input type="number" value={val} onChange={e => handleStateUpdate(key, e.target.value)} style={{
                        width: 50,
                        padding: "2px 4px",
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 3,
                        background: COLORS.surfaceAlt,
                        color: COLORS.text,
                        fontFamily: "monospace",
                        fontSize: 10,
                      }} />
                    ) : (
                      <select value={val === null ? "null" : val} onChange={e => handleStateUpdate(key, e.target.value === "null" ? "null" : e.target.value)} style={{
                        padding: "2px 4px",
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 3,
                        background: COLORS.surfaceAlt,
                        color: COLORS.text,
                        fontFamily: "monospace",
                        fontSize: 10,
                      }}>
                        <option value="null">null</option>
                        {key === "vesselId" && ["seraph","shadow","exile","penitent","rebel"].map(v => <option key={v} value={v}>{v}</option>)}
                        {key === "guide" && ["light","dark"].map(v => <option key={v} value={v}>{v}</option>)}
                        {key === "mode" && ["steward","solo"].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              {/* Seal Status */}
              <div style={{ background: COLORS.surface, borderRadius: 8, padding: 12, border: `1px solid ${COLORS.border}` }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 11, color: COLORS.amber, fontFamily: "monospace" }}>SEAL STATUS (from {currentPhase})</h4>
                {legalEdges.map((edge, i) => {
                  const results = edge.seals.map(s => s.evaluate(null, null, gameState));
                  const allPass = results.every(r => r.pass);
                  return (
                    <div key={i} style={{
                      marginBottom: 8,
                      padding: 8,
                      borderRadius: 4,
                      border: `1px solid ${allPass ? COLORS.green : COLORS.red}30`,
                      background: allPass ? COLORS.greenGlow : COLORS.redGlow,
                    }}>
                      <div style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 600, color: allPass ? COLORS.green : COLORS.red }}>
                        {allPass ? "✓" : "✗"} → {edge.to}
                        <span style={{ fontWeight: 400, color: COLORS.textDim, marginLeft: 6, fontSize: 9 }}>[{edge.kind}]</span>
                      </div>
                      {edge.seals.length === 0 && <div style={{ fontSize: 9, color: COLORS.textDim, marginTop: 2 }}>No seals (always open)</div>}
                      {results.map((r, j) => (
                        <div key={j} style={{ fontSize: 9, fontFamily: "monospace", color: r.pass ? COLORS.green : COLORS.red, marginTop: 2 }}>
                          {r.pass ? "✓" : "✗"} {r.sealId} {!r.pass && `— ${r.reason}`}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Scenarios */}
            <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}` }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 11, color: COLORS.amber, fontFamily: "monospace" }}>QUICK SCENARIOS</h4>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  { label: "Select Seraph/Light/Steward", apply: { vesselId: "seraph", guide: "light", mode: "steward" } },
                  { label: "Activate Run", apply: { runActive: true } },
                  { label: "Lock Identity", apply: { identityLocked: true } },
                  { label: "Full Setup", apply: { vesselId: "shadow", guide: "dark", mode: "solo", runActive: true, identityLocked: true } },
                  { label: "Reset State", apply: createDudaelState() },
                ].map((scenario, i) => (
                  <button key={i} onClick={() => {
                    engine.setState(scenario.apply);
                    syncFromEngine();
                  }} style={{
                    padding: "4px 10px",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 4,
                    background: "transparent",
                    color: COLORS.text,
                    cursor: "pointer",
                    fontFamily: "monospace",
                    fontSize: 9,
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={ev => { ev.target.style.borderColor = COLORS.amber; }}
                  onMouseLeave={ev => { ev.target.style.borderColor = COLORS.border; }}
                  >
                    {scenario.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
