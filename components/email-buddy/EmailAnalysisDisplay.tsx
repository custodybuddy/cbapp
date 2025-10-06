import React from 'react';
import SparklesIcon from '../icons/SparklesIcon';
import { useEmailBuddy } from '../../hooks/useEmailBuddy';

const EmailAnalysisDisplay: React.FC = () => {
    const { analysis } = useEmailBuddy();

    if (!analysis) {
        return null;
    }

    return (
        <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg">
            <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
               <SparklesIcon />
                AI Analysis
            </h3>
            <div className="text-sm space-y-3">
               <div>
                    <strong className="font-semibold text-gray-300 block mb-1">Identified Tone:</strong>
                    <span className="text-gray-400 bg-slate-800 px-2 py-1 rounded-md inline-block">{analysis.tone}</span>
               </div>
               <div>
                    <strong className="font-semibold text-gray-300 block mb-1">Summary:</strong> 
                    <p className="text-gray-400 italic">"{analysis.summary}"</p>
               </div>
                {analysis.key_demands && analysis.key_demands.length > 0 && (
                    <div>
                        <strong className="font-semibold text-gray-300 block mb-1">Key Demands & Questions:</strong>
                        <ul className="list-disc pl-5 space-y-1 text-gray-400">
                            {analysis.key_demands.map((demand, index) => (
                                <li key={index}>{demand}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailAnalysisDisplay;