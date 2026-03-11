import sqlite3
from datetime import datetime

DB_PATH = "logger.db"

def insert_entry(entry_id, text, scope="GLOBAL", session_id=None, asset_id=None, tags=""):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    created_at = datetime.utcnow().isoformat(timespec="seconds")

    cur.execute(
        """
        INSERT INTO entries (entry_id, created_at, text, scope, session_id, asset_id, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?);
        """,
        (entry_id, created_at, text, scope, session_id, asset_id, tags),
    )

    conn.commit()
    conn.close()

if __name__ == "__main__":
    insert_entry(
        "E-z20260107-007",
        "Logger concept: sessions, assets, entries table.",
        "GLOBAL",
    )
    print("Inserted E-z20260107-007")
