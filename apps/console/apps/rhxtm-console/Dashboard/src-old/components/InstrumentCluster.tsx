import React from 'react';

import { useHXTM, EnergyLevel } from '../hooks/useHXTM';

const InstrumentCluster: React.FC = () => {

    const {

        isActive,

        elapsed,

        energy,

        lastHydration,

        startSession,

        setEnergy,

        logHydration

    } = useHXTM();

    // Logic for Hydration Alert (Reclamation required after 2 hours)

    const hoursSinceFluid = (Date.now() - lastHydration) / (1000 * 60 * 60);

    const isDehydrated = hoursSinceFluid > 2;

    // Format seconds to HH:MM:SS

    const formatTime = (s: number) => {

        return new Date(s * 1000).toISOString().substr(11, 8);

    };

    return (

        <div className="instrument-cluster p-6 border-2 border-white/10 bg-black font-mono uppercase text-xs tracking-widest">

            <div className="grid grid-cols-2 gap-8">

                {/* Left: Biological Vitals */}

                <div className="space-y-6">

                    <section>

                        <h3 className="opacity-40 mb-2">// HUMAN_TELEMETRY</h3>

                        <div className="flex gap-2">

                            {(['HIGH', 'MED', 'LOW'] as EnergyLevel[]).map(lvl => (

                                <button

                                    key={lvl}

                                    onClick={() => setEnergy(lvl)}

                                    className={`px-3 py-1 border transition-all ${energy === lvl ? 'bg-rdxt-teal text-black border-rdxt-teal' : 'border-white/20 opacity-50'

                                        }`}

                                >

                                    {lvl}

                                </button>

                            ))}

                        </div>

                    </section>

                    <section>

                        <h3 className={`mb-2 ${isDehydrated ? 'text-red-500 animate-pulse' : 'opacity-40'}`}>

// HYDRATION_SYNC {isDehydrated ? '[CRITICAL]' : ''}

                        </h3>

                        <button

                            onClick={logHydration}

                            className="w-full py-2 border border-white/10 hover:border-rdxt-teal transition-colors"

                        >

                            LOG_FLUID_INTAKE

                        </button>

                    </section>

                </div>

                {/* Right: Execution Vitals */}

                <div className="flex flex-col justify-between border-l border-white/5 pl-8">

                    <section>

                        <h3 className="opacity-40 mb-1">// SESSION_TIMER</h3>

                        <div className="text-4xl font-bold tracking-tighter">

                            {formatTime(elapsed)}

                        </div>

                    </section>

                    <button

                        onClick={startSession}

                        disabled={isActive}

                        className={`w-full py-4 font-bold border-2 transition-all ${isActive

                                ? 'border-rdxt-teal/50 text-rdxt-teal cursor-default'

                                : 'border-white hover:bg-white hover:text-black cursor-pointer'

                            }`}

                    >

                        {isActive ? 'SESSION_ACTIVE' : 'START_SESSION'}

                    </button>

                </div>

            </div>

            <div className="mt-6 pt-4 border-t border-white/5 opacity-30 text-[9px]">

                RHXTM_PROTOCOL_V.0.1 // USER_ONE_AUTH // SINE_REIN_SOVEREIGNTY

            </div>

        </div>

    );

};

export default InstrumentCluster;
