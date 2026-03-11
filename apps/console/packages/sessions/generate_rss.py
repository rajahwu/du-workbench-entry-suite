import sqlite3
import xml.etree.ElementTree as ET
from xml.dom import minidom
from email.utils import formatdate
from datetime import datetime
import os

# Correctly locate the database and output file relative to the project root
DB_PATH = 'apps/console/packages/sessions/logger.db'
OUTPUT_PATH = 'apps/console/apps/rhxtm-console/public/session_sync.xml'

def create_rss_feed():
    """
    Connects to the SQLite database, fetches the most recent entries,
    and generates an RSS 2.0 feed.
    """
    # Ensure the database directory exists, but don't create the db itself
    if not os.path.exists(DB_PATH):
        print(f"Error: Database not found at {DB_PATH}")
        # Initialize the db for demonstration if it doesn't exist.
        print("Initializing a dummy logger.db for demonstration purposes.")
        init_dummy_db()


    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Fetch the 20 most recent entries, joining with sessions to get member_id
    try:
        cursor.execute("""
            SELECT e.id, e.timestamp, e.entry_type, e.content, s.member_id
            FROM entries e
            JOIN sessions s ON e.session_id = s.id
            ORDER BY e.timestamp DESC
            LIMIT 20
        """)
        entries = cursor.fetchall()
    except sqlite3.OperationalError as e:
        print(f"Database query failed: {e}")
        print("Please ensure the database schema is loaded correctly in logger.db")
        conn.close()
        return

    conn.close()

    # RSS Root
    rss = ET.Element("rss", version="2.0", attrib={"xmlns:atom": "http://www.w3.org/2005/Atom"})

    # Channel
    channel = ET.SubElement(rss, "channel")
    ET.SubElement(channel, "title").text = "Session Sync Feed"
    ET.SubElement(channel, "link").text = "http://localhost:3000/rhxtm-console/Dashboard/"
    ET.SubElement(channel, "description").text = "Live feed of session entries from the logger database."
    ET.SubElement(channel, "lastBuildDate").text = formatdate(localtime=True)
    ET.SubElement(channel, "language").text = "en-us"
    ET.SubElement(channel, "atom:link", href="http://localhost:3000/rhxtm-console/public/session_sync.xml", rel="self", type="application/rss+xml")

    # Items
    for entry in entries:
        item = ET.SubElement(channel, "item")
        entry_id, timestamp, entry_type, content, member_id = entry

        title_text = f"[{member_id.upper() if member_id else 'SYSTEM'}] {entry_type.replace('_', ' ').title()}: {content[:50] if content else ''}..."
        ET.SubElement(item, "title").text = title_text

        try:
            # Assuming timestamp is in a format Python's datetime can parse
            dt_object = datetime.fromisoformat(timestamp)
            pub_date = formatdate(dt_object.timestamp(), localtime=True)
        except (ValueError, TypeError):
            # Fallback for invalid or missing timestamps
            pub_date = formatdate(localtime=True)

        ET.SubElement(item, "pubDate").text = pub_date
        ET.SubElement(item, "guid", isPermaLink="false").text = str(entry_id)
        ET.SubElement(item, "description").text = content if content else ""

    # Pretty print the XML
    xml_str = ET.tostring(rss, 'utf-8')
    pretty_xml = minidom.parseString(xml_str).toprettyxml(indent="  ")

    # Ensure output directory exists and write the file
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(pretty_xml)

    print(f"RSS feed generated successfully at {OUTPUT_PATH}")

def init_dummy_db():
    """Creates and populates a dummy database if one doesn't exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Create tables from schema
    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY, member_id TEXT, state TEXT, work_spans TEXT,
            started_at TEXT, ended_at TEXT
        );
        CREATE TABLE IF NOT EXISTS entries (
            id TEXT PRIMARY KEY, session_id TEXT NOT NULL, timestamp TEXT NOT NULL,
            entry_type TEXT, content TEXT, metadata TEXT,
            FOREIGN KEY(session_id) REFERENCES sessions(id)
        );
    """)
    # Insert dummy data
    session_id = "dummy_session_01"
    if not cursor.execute("SELECT 1 FROM sessions WHERE id = ?", (session_id,)).fetchone():
        cursor.execute("INSERT INTO sessions (id, member_id, state, started_at) VALUES (?, ?, ?, ?)",
                       (session_id, "dummy_user", "active", datetime.utcnow().isoformat()))
        for i in range(5):
            cursor.execute("INSERT INTO entries (id, session_id, timestamp, entry_type, content) VALUES (?, ?, ?, ?, ?)",
                           (f"dummy_entry_{i}", session_id, datetime.utcnow().isoformat(), "note", f"This is dummy entry number {i}."))
    conn.commit()
    conn.close()


if __name__ == '__main__':
    create_rss_feed()
