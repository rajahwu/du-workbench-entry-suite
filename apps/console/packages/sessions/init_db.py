import sqlite3

def init_db():
    conn = sqlite3.connect("logger.db")
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entry_id TEXT UNIQUE,
            created_at TEXT,
            text TEXT,
            scope TEXT,
            session_id INTEGER,
            asset_id INTEGER,
            tags TEXT
        );
        """
    )

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("logger.db initialized with entries table.")
import sqlite3

def init_db():
    conn = sqlite3.connect("logger.db")
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entry_id TEXT UNIQUE,
            created_at TEXT,
            text TEXT,
            scope TEXT,
            session_id INTEGER,
            asset_id INTEGER,
            tags TEXT
        );
        """
    )

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("logger.db initialized with entries table.")
