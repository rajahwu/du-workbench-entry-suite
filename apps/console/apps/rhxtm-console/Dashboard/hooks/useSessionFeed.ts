import { useState, useEffect } from 'react';

export interface SessionEntry {
  id: string;
  title: string;
  description: string;
  pubDate: string;
}

export function useSessionFeed() {
  const [entries, setEntries] = useState<SessionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetching directly from the public folder
    fetch('/session_sync.xml')
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch session sync");
        return res.text();
      })
      .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
      .then(data => {
        const items = Array.from(data.querySelectorAll("item"));
        const parsedEntries = items.map(item => ({
          id: item.querySelector("guid")?.textContent || Math.random().toString(),
          title: item.querySelector("title")?.textContent || "Untitled",
          description: item.querySelector("description")?.textContent || "",
          pubDate: item.querySelector("pubDate")?.textContent || "",
        }));
        
        setEntries(parsedEntries);
        setLoading(false);
      })
      .catch(err => {
        console.error("[-] Lattice Feed Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { entries, loading, error };
}