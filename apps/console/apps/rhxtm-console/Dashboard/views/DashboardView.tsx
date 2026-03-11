import React from 'react';
import InstrumentCluster from '../components/InstrumentCluster';
import AILattice from '../components/AILattice';
import SystemsIndex from '../components/SystemsIndex';
import { useHXTM } from '../hooks/useHXTM';
export default function DashboardView() {

    const { energy, isActive, elapsed } = useHXTM();

    return (

        <div className={`min-h-screen bg-black text-white p-6 transition-all duration-700 ${energy === 'LOW' ? 'grayscale opacity-80' : ''

            }`}>

            {/* 📡 HEADER: SYSTEM STATUS & GLOBAL TIME */}

            <header className="flex justify-between items-start mb-8 border-b border-white/5 pb-4">

                <div>

                    <h1 className="text-2xl font-black tracking-widest">SINE_REIN_COMMAND</h1>

                    <p className="text-[10px] opacity-40 font-mono">LOCATION: LOCALHOST // SECTOR: RAD-7</p>

                </div>

                <div className="text-right">

                    <div className="text-xl font-mono">{new Date().toLocaleTimeString()}</div>

                    <div className="text-[9px] text-rdxt-teal opacity-60">

                        {isActive ? `SESSION_IN_PROGRESS: ${Math.floor(elapsed / 60)}M` : 'SYSTEM_IDLE'}

                    </div>

                </div>

            </header>

            <main className="grid grid-cols-12 gap-6">

                {/* 🧬 LEFT: THE BIOLOGICAL WING */}

                <aside className="col-span-3 space-y-6">

                    <InstrumentCluster />

                    <div className="p-4 border border-white/5 opacity-40 text-[10px] leading-relaxed italic">

                        "A thing is what it is while it is."

                        <br />— Pilot Manual v0.1

                    </div>

                </aside>

                {/* ⚔️ CENTER: THE OPERATIONAL CORE */}

                <section className="col-span-6">

                    <SystemsIndex />

                </section>

                {/* 🕸️ RIGHT: THE COLLABORATIVE LATTICE */}

                <aside className="col-span-3 space-y-6">

                    <AILattice />

                    {/* SPRINT_RECAP_CARD */}

                    <div className="p-4 bg-zinc-900/50 border border-white/10">

                        <h4 className="text-[9px] tracking-widest opacity-30 mb-2">// CURRENT_SPRINT_GOAL</h4>

                        <p className="text-xs font-mono">Bypass safety protocols and establish persistent RHXTM telemetry hooks.</p>

                    </div>

                </aside>

            </main>

        </div>

    );

}

