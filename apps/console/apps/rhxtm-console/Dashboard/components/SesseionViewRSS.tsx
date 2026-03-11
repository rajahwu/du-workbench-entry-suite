import React from 'react';
import { useSessionFeed } from '../hooks/useSessionFeed';

export function SessionRefinery() {
    const { entries, loading, error } = useSessionFeed();

    if (loading) return <div className="text-cyan-500">[*] Syncing Lattice Telemetry...</div>;
    if (error) return <div className="text-red-500">[-] Feed Error: {error}</div>;

    return (
        <div className="session-feed-container space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-widest border-b border-gray-700 pb-2">
                Operational Log
            </h2>

            {entries.map(entry => (
                <div key={entry.id} className="p-4 bg-gray-900 border left-border-cyan rounded">
                    <div className="text-xs text-gray-500 mb-1">{entry.pubDate}</div>
                    <div className="font-mono font-bold text-cyan-400">{entry.title}</div>
                    <div className="mt-2 text-gray-300">{entry.description}</div>
                </div>
            ))}
        </div>
    );
}