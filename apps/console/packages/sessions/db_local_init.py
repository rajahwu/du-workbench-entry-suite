import sqlite3
import os

DB_PATH = 'apps/console/packages/sessions/logger.db'
SCHEMA_PATH = 'apps/console/packages/sessions/schema.sql'

def initialize_database():
    """
    Initializes the database using the schema.sql file.
    Deletes the old database file if it exists.
    """
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print(f"Removed old database at {DB_PATH}")

    try:
        with open(SCHEMA_PATH, 'r') as f:
            schema = f.read()

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.executescript(schema)
        conn.commit()
        conn.close()
        print(f"Database '{DB_PATH}' created successfully based on '{SCHEMA_PATH}'.")

        # Now, let's add some sample data so the RSS feed isn't empty.
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        session_id = "sample_session_01"
        cursor.execute("INSERT INTO sessions (id, member_id, state, started_at) VALUES (?, ?, ?, datetime('now'))",
                       (session_id, "rajah", "active"))

        for i in range(5):
            entry_id = f"entry_{i:03}"
            content = f"This is sample entry number {i} for session {session_id}."
            entry_type = "note"
            modifier = f"-{i} minutes"
            cursor.execute("INSERT INTO entries (id, session_id, timestamp, entry_type, content) VALUES (?, ?, datetime('now', ?), ?, ?)",
                           (entry_id, session_id, modifier, entry_type, content))

        conn.commit()
        conn.close()
        print("Inserted sample data into 'sessions' and 'entries' tables.")


    except FileNotFoundError:
        print(f"Error: Schema file not found at '{SCHEMA_PATH}'")
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    initialize_database()
