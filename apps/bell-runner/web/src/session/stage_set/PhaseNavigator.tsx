// apps/bell-runner/web/src/session/stage_set/PhaseNavigator.tsx
import React, { useState, useEffect } from 'react';
import EntryPage from './01_EntryPage';
// import SelectPage from './02_SelectPage'; 

// Temporary mock of the bridge until React Router loaders are fully wired
export function PhaseNavigator({ bridge }) {
    const [currentPhase, setCurrentPhase] = useState('01_title');

    // In the future, this will be handled by React Router or Redux
    const handleEnter = () => {
        console.log("Bell rung! Attempting transfer to 02_select...");
        // bridge.ring('02_select', { user: 'guest' });
        setCurrentPhase('02_select');
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto border border-indigo-900/50 rounded-lg p-6 bg-slate-900/50 shadow-2xl">
            {/* The Engine UI Container */}
            {currentPhase === '01_title' && (
                <EntryPage onEnter={handleEnter} isBooting={false} />
            )}

            {currentPhase === '02_select' && (
                <div className="text-center text-amber-100">
                    <h2>Phase 02: Character Select</h2>
                    <p>Waiting for Vessel generation...</p>
                </div>
            )}
        </div>
    );
}

// apps/bell-runner/web/src/session/stage_set/Home.tsx (or wherever you export the main view)
export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-amber-100 p-8">
            <h1 className="text-4xl font-serif mb-8 text-center tracking-widest text-amber-500">
                DUDAEL ENTRY SUITE
            </h1>
            {/* Pass in your bell engine bridge here */}
            <PhaseNavigator bridge={{}} />
        </div>
    );
}