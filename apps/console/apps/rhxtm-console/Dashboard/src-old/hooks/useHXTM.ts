import { useState, useEffect } from 'react';
export type EnergyLevel = 'HIGH' | 'MED' | 'LOW';

interface TelemetryState {

    isActive: boolean;

    startTime: number | null;

    elapsed: number;

    energy: EnergyLevel;

    lastHydration: number;

}

export const useHXTM = () => {

    const [state, setState] = useState<TelemetryState>(() => {

        const saved = localStorage.getItem('rhxtm_state');

        return saved ? JSON.parse(saved) : {

            isActive: false,

            startTime: null,

            elapsed: 0,

            energy: 'MED',

            lastHydration: Date.now(),

        };

    });

    // Sync to local storage for "Sticks and Stones" resilience

    useEffect(() => {

        localStorage.setItem('rhxtm_state', JSON.stringify(state));

    }, [state]);

    // The Session Timer

    useEffect(() => {

        let interval: number;

        if (state.isActive) {

            interval = setInterval(() => {

                setState(prev => ({

                    ...prev,

                    elapsed: prev.startTime ? Math.floor((Date.now() - prev.startTime) / 1000) : 0

                }));

            }, 1000);

        }

        return () => clearInterval(interval);

    }, [state.isActive, state.startTime]);

    const startSession = () => {

        setState(prev => ({

            ...prev,

            isActive: true,

            startTime: Date.now() - (prev.elapsed * 1000),

        }));

    };

    const setEnergy = (level: EnergyLevel) => setState(prev => ({ ...prev, energy: level }));

    const logHydration = () => setState(prev => ({ ...prev, lastHydration: Date.now() }));

    return { ...state, startSession, setEnergy, logHydration };

};
