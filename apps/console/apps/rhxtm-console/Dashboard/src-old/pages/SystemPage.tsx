import { useHXTM } from '../hooks/useHXTM';

export default function SystemPage({ nodeData }) {

    const { energy } = useHXTM();

    // Define what "Simplified Mode" looks like

    const isMinimal = energy === 'LOW';

    return (

        <div className={`system-layout ${isMinimal ? 'max-w-2xl mx-auto' : ''}`}>

            <SystemHeader node={nodeData} />

            {/* 1. Terminal: Only show at High/Med Energy */}

            {!isMinimal && (

                <div className="terminal-section animate-fade-in">

                    <SystemTerminal node={nodeData} />

                </div>

            )}

            {/* 2. Main Content: Changes density based on energy */}

            <div className={`content-body ${isMinimal ? 'text-lg leading-relaxed' : 'text-sm'}`}>

                <ReactMarkdown>

                    {isMinimal ? nodeData.mission_statement : nodeData.full_markdown}

                </ReactMarkdown>

            </div>

            {/* 3. Action Bar: Always visible, but larger/simpler in Low Energy */}

            <div className={`action-footer mt-12 ${isMinimal ? 'p-10 border-2' : ''}`}>

                <button className="cta-primary">

                    {isMinimal ? 'EXECUTE_CORE_TASK' : 'RUN_SYSTEM_STACK_V2'}

                </button>

            </div>

        </div>

    );

}
