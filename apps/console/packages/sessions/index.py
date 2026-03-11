"""
Sessions: Universal capture mechanism for tracking activity over time.

A session records: who participated, when it happened, what state it's in,
and what it connects to. Independent of any specific system or context.
"""

from dataclasses import dataclass, field, asdict
from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from uuid import uuid4
import json


class SessionState(Enum):
    """Session lifecycle state."""
    active = "active"
    expired = "expired"


@dataclass
class SessionTimestamps:
    """Temporal markers for session lifecycle."""
    created_at: datetime
    started_at: datetime
    ended_at: Optional[datetime] = None
    last_activity_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict[str, str]:
        """Convert timestamps to ISO format strings."""
        return {
            "created_at": self.created_at.isoformat(),
            "started_at": self.started_at.isoformat(),
            "ended_at": self.ended_at.isoformat() if self.ended_at else None,
            "last_activity_at": self.last_activity_at.isoformat(),
        }


@dataclass
class SessionEntry:
    """Single event/record within a session."""
    timestamp: datetime
    event_type: str  # "note", "action", "checkpoint", etc.
    content: str
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "timestamp": self.timestamp.isoformat(),
            "event_type": self.event_type,
            "content": self.content,
            "metadata": self.metadata,
        }


@dataclass
class Session:
    """
    Core session record.
    
    Captures: session_id, member_id, timestamps, state, and relationships.
    Independent of system - can link to anything via relationships dict.
    """
    session_id: str = field(default_factory=lambda: str(uuid4()))
    member_id: str = None  # Who/what participated
    timestamps: SessionTimestamps = field(default_factory=lambda: SessionTimestamps(
        created_at=datetime.now(),
        started_at=datetime.now()
    ))
    state: SessionState = SessionState.ACTIVE
    
    # Relationships: connect to other entities (build-order, systems, etc)
    relationships: Dict[str, Any] = field(default_factory=dict)
    
    # The actual captured data
    entries: List[SessionEntry] = field(default_factory=list)
    
    # Metadata about the session itself
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def __post_init__(self):
        if self.member_id is None:
            raise ValueError("member_id is required")
    
    def add_entry(self, event_type: str, content: str, metadata: Optional[Dict[str, Any]] = None) -> SessionEntry:
        """Record an event within this session."""
        entry = SessionEntry(
            timestamp=datetime.now(),
            event_type=event_type,
            content=content,
            metadata=metadata or {}
        )
        self.entries.append(entry)
        self.timestamps.last_activity_at = datetime.now()
        return entry
    
    def link_to(self, entity_type: str, entity_id: str, metadata: Optional[Dict[str, Any]] = None) -> None:
        """Create a relationship to another entity (build-order spec, system, etc)."""
        if entity_type not in self.relationships:
            self.relationships[entity_type] = []
        
        self.relationships[entity_type].append({
            "entity_id": entity_id,
            "linked_at": datetime.now().isoformat(),
            "metadata": metadata or {}
        })
    
    def end(self) -> None:
        """Mark session as ended."""
        self.timestamps.ended_at = datetime.now()
        self.state = SessionState.EXPIRED
    
    def expire(self) -> None:
        """Mark session as expired (same as end, different semantic)."""
        self.end()
    
    def to_dict(self) -> Dict[str, Any]:
        """Serialize to dict for storage/transmission."""
        return {
            "session_id": self.session_id,
            "member_id": self.member_id,
            "timestamps": self.timestamps.to_dict(),
            "state": self.state.value,
            "relationships": self.relationships,
            "entries": [e.to_dict() for e in self.entries],
            "metadata": self.metadata,
        }
    
    def to_json(self) -> str:
        """Serialize to JSON."""
        return json.dumps(self.to_dict(), indent=2, default=str)


class SessionStore:
    """
    In-memory session storage with basic query capabilities.
    
    In production, this would be a database (SQL queries as needed).
    This is the skeleton - extend queries as needed.
    """
    
    def __init__(self):
        self.sessions: Dict[str, Session] = {}
    
    def create(self, member_id: str, metadata: Optional[Dict[str, Any]] = None) -> Session:
        """Create and store a new session."""
        session = Session(member_id=member_id)
        if metadata:
            session.metadata = metadata
        self.sessions[session.session_id] = session
        return session
    
    def get(self, session_id: str) -> Optional[Session]:
        """Retrieve a session by ID."""
        return self.sessions.get(session_id)
    
    def get_by_member(self, member_id: str) -> List[Session]:
        """Find all sessions for a member."""
        return [s for s in self.sessions.values() if s.member_id == member_id]
    
    def get_active(self) -> List[Session]:
        """Find all active sessions."""
        return [s for s in self.sessions.values() if s.state == SessionState.ACTIVE]
    
    def get_by_relationship(self, entity_type: str, entity_id: str) -> List[Session]:
        """Find sessions linked to a specific entity."""
        result = []
        for session in self.sessions.values():
            if entity_type in session.relationships:
                for rel in session.relationships[entity_type]:
                    if rel["entity_id"] == entity_id:
                        result.append(session)
                        break
        return result
    
    def save(self, session: Session) -> None:
        """Update a session in storage."""
        self.sessions[session.session_id] = session
    
    def export_all(self) -> str:
        """Export all sessions as JSON."""
        return json.dumps(
            {sid: s.to_dict() for sid, s in self.sessions.items()},
            indent=2,
            default=str
        )


# Example usage / test
if __name__ == "__main__":
    # Create store
    store = SessionStore()
    
    # Create a session (e.g., during a note-taking or building session)
    session = store.create(
        member_id="rajah",
        metadata={"context": "build-order development", "location": "home"}
    )
    
    # Add entries as things happen
    session.add_entry(
        event_type="note",
        content="Started thinking about session structure"
    )
    
    session.add_entry(
        event_type="checkpoint",
        content="Defined core fields: session_id, member_id, timestamps, state, relationships"
    )
    
    # Link to a build-order spec (example)
    session.link_to("build_order_spec", "clearline-7", {"section": "types"})
    
    # Add more entries
    session.add_entry(
        event_type="action",
        content="Wrote SessionEntry dataclass",
        metadata={"lines_of_code": 15}
    )
    
    session.add_entry(
        event_type="note",
        content="Sessions should be independent - can link to anything but don't belong to anything"
    )
    
    # End the session
    session.end()
    
    # Query examples
    print("=== Session Record ===")
    print(json.dumps(session.to_dict(), indent=2, default=str))
    
    print("\n=== Sessions for member 'rajah' ===")
    rajah_sessions = store.get_by_member("rajah")
    print(f"Found {len(rajah_sessions)} sessions")
    
    print("\n=== Sessions linked to build_order_spec:clearline-7 ===")
    linked = store.get_by_relationship("build_order_spec", "clearline-7")
    print(f"Found {len(linked)} sessions")
    
    print("\n=== All stored sessions (JSON export) ===")
    print(store.export_all())
