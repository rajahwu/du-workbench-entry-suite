import { PhaseNavigator } from '@/session/stage_set/PhaseNavigator'; // create this
import bellBridge from './bell-bridge';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-amber-100 p-8">
            <h1 className="text-4xl font-serif mb-8">Bell Runner – Phase State Machine</h1>
            <PhaseNavigator bridge={bellBridge} />
        </div>
    );
}