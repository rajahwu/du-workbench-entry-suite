-- 1. THE SESSION (The Container)
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    member_id TEXT,          -- Who is doing the work? (e.g., "rajah")
    state TEXT,              -- 'active', 'paused', 'closed', 'archived'
    work_spans TEXT,         -- JSON Blob: stores [{"start":..., "end":...}, ...] for pause logic
    started_at TEXT,
    ended_at TEXT
);

-- 2. THE ENTRIES (The Timeline/Events)
CREATE TABLE IF NOT EXISTS entries (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    entry_type TEXT,         -- 'note', 'checkpoint', 'system_event'
    content TEXT,
    metadata TEXT,           -- JSON Blob: extra context (lines of code, mood, etc)
    FOREIGN KEY(session_id) REFERENCES sessions(id)
);

-- 3. THE ASSETS (The Artifacts)
CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    filepath TEXT NOT NULL,
    filetype TEXT,           -- 'video/mp4', 'text/python', 'audio/wav'
    created_at TEXT
);

-- 4. THE JOIN TABLE (The Glue)
-- Connects an Asset to a Session, and optionally to a specific Entry within that session.
CREATE TABLE IF NOT EXISTS session_asset_map (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    asset_id TEXT NOT NULL,
    entry_id TEXT,           -- Nullable: specific link to a moment in time
    relation_type TEXT,      -- 'evidence', 'reference', 'output', 'source'
    FOREIGN KEY(session_id) REFERENCES sessions(id),
    FOREIGN KEY(asset_id) REFERENCES assets(id),
    FOREIGN KEY(entry_id) REFERENCES entries(id)
);