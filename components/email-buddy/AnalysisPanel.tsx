import React from 'react';
// Fix: Corrected the import path for the EmailAnalysis type.
import { EmailAnalysis } from '../../types/ai';
import JargonHelper from './JargonHelper';
import SparklesIcon from '../icons/SparklesIcon';

interface AnalysisPanelProps {
    analysis: EmailAnalysis;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isOpen, setIsOpen }) => {
    return (
        <aside className={`flex-shrink-0 bg-slate-900 border border-slate-700 rounded-lg transition-all duration-300 ease-in-out ${isOpen ? 'w-full lg:w-80 p-4' : 'w-full lg:w-14 p-2'}`}>
            <div className="flex items-center justify-between">
                <h3 className={`text-lg font-bold text-amber-400 flex items-center gap-2 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <SparklesIcon />
                    AI Analysis
                </h3>
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="text-gray-400 hover:text-white transition-transform duration-300"
                    aria-label={isOpen ? 'Collapse analysis panel' : 'Expand analysis panel'}
                    aria-expanded={isOpen}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transform transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}>
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
            </div>
            <div className={`mt-4 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                <div className="text-sm space-y-4">
                    <div>
                        <strong className="font-semibold text-gray-300 block mb-1">Identified Tone:</strong>
                        <span className="text-gray-300 bg-slate-800 px-2 py-1 rounded-md inline-block">{analysis.tone}</span>
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
                {analysis.legal_jargon && analysis.legal_jargon.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                         <JargonHelper jargon={analysis.legal_jargon} />
                    </div>
                )}
            </div>
        </aside>
    );
};

export default AnalysisPanel;