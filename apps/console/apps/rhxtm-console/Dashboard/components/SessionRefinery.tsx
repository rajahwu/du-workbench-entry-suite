import { parseMissionQuiz } from "../utils/missionUtils";

const activeQuiz = parseMissionQuiz(currentNode.markdown);


const SessionRefinery = ({ sessionData }) => {

    return (

        <div className="refinery-overlay fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-12">
            <div className="max-w-xl w-full border border-rdxt-teal p-8 space-y-8 font-mono">
                <header className="border-b border-rdxt-teal/30 pb-4">
                    <h2 className="text-xl tracking-tighter">SESSION_REFINERY_V1</h2>
                    <p className="text-[10px] opacity-50">NODE: {sessionData.nodeId} // TOTAL_HEV: {sessionData.hev}</p>
                </header>
                {/* Writing Prompt */}
                <section>
                    <label className="text-[10px] block mb-2 opacity-40">// WRITING_PROMPT: THE_SMALLEST_ABSOLUTE</label>
                    <textarea
                        className="w-full bg-transparent border border-white/10 p-4 text-sm focus:border-rdxt-teal outline-none"
                        placeholder="What was the core shift in this session?"
                    />
                </section>
                {/* Knowledge Check */}
                <section className="knowledge-gate p-4 border-l-2 border-rdxt-teal bg-white/5">
                    <div className="text-[10px] opacity-40 mb-2">// KNOWLEDGE_GATE_ACTIVE</div>
                    <p className="text-sm font-bold mb-4">{activeQuiz.question}</p>
                    <input
                        type="text"
                        className="w-full bg-black border border-white/20 p-2 text-xs focus:border-rdxt-teal outline-none"
                        placeholder="Input absolute answer..."
                        onBlur={(e) => {
                            if (e.target.value.toLowerCase() === activeQuiz.answer.toLowerCase()) {
                                console.log("VALIDATED");
                            }
                        }}
                    />
                </section>
                <button className="w-full py-4 bg-rdxt-teal text-black font-black tracking-widest hover:bg-white transition-colors">
                    COMMIT_TO_MANIFEST & SHUTDOWN
                </button>
            </div>
        </div>

    );

};

export default SessionRefinery;
