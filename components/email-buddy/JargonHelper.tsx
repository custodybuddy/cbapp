
import React, { useState, useEffect } from 'react';
import { explainJargon } from '../../services/aiService';
import { getFriendlyErrorMessage } from '../../utils/errorUtils';
import HelpCircleIcon from '../icons/HelpCircleIcon';
import SpinnerIcon from '../icons/SpinnerIcon';
import AlertTriangleIcon from '../icons/AlertTriangleIcon';
import ClipboardIcon from '../icons/ClipboardIcon';
import ClipboardCheckIcon from '../icons/ClipboardCheckIcon';

interface JargonHelperProps {
    jargon: Array<{ term: string; context: string; }>;
}

const JargonHelper: React.FC<JargonHelperProps> = ({ jargon }) => {
    const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
    const [explanation, setExplanation] = useState<Record<string, { explanation: string; suggested_question: string; }>>({});
    const [loadingTerm, setLoadingTerm] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

    useEffect(() => {
        if (copiedTerm) {
            const timer = setTimeout(() => setCopiedTerm(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [copiedTerm]);

    const handleToggleTerm = async (term: string, context: string) => {
        if (expandedTerm === term) {
            setExpandedTerm(null);
            return;
        }

        setExpandedTerm(term);
        setError(null);

        // Don't re-fetch if we already have it
        if (explanation[term]) {
            return;
        }

        setLoadingTerm(term);
        try {
            const result = await explainJargon(term, context);
            setExplanation(prev => ({ ...prev, [term]: result }));
        } catch (err) {
            setError(getFriendlyErrorMessage(err, 'jargon explanation'));
        } finally {
            setLoadingTerm(null);
        }
    };

    const handleCopy = (term: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedTerm(term);
    };

    return (
        <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg space-y-3">
            <h3 className="text-lg font-bold text-amber-400 mb-2 flex items-center gap-2">
                <HelpCircleIcon className="w-5 h-5" />
                Legal Jargon Detected
            </h3>
            <p className="text-sm text-gray-400">Our AI found some legal terms in the email. Click on a term to get a plain English explanation and a suggested question to ask for clarification.</p>
            <div className="space-y-2">
                {jargon.map(({ term, context }) => (
                    <div key={term}>
                        <button
                            onClick={() => handleToggleTerm(term, context)}
                            className="w-full text-left font-semibold text-gray-200 p-2 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors flex justify-between items-center"
                            aria-expanded={expandedTerm === term}
                            aria-controls={`jargon-panel-${term.replace(/\s+/g, '-')}`}
                        >
                            <span>{term}</span>
                            <span className={`transform transition-transform duration-200 ${expandedTerm === term ? 'rotate-180' : 'rotate-0'}`}>▼</span>
                        </button>
                        {expandedTerm === term && (
                            <div id={`jargon-panel-${term.replace(/\s+/g, '-')}`} className="p-4 bg-slate-950 rounded-b-md border-x border-b border-slate-700 animate-fade-in-up-fast">
                                {loadingTerm === term && (
                                    <div className="flex items-center justify-center gap-2 text-gray-400">
                                        <SpinnerIcon className="w-5 h-5" />
                                        <span>Explaining term...</span>
                                    </div>
                                )}
                                {error && loadingTerm !== term && (
                                    <div className="flex items-center gap-2 text-red-400">
                                        <AlertTriangleIcon className="w-5 h-5" />
                                        <span>{error}</span>
                                    </div>
                                )}
                                {explanation[term] && (
                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <h4 className="font-bold text-gray-300 mb-1">Plain English Explanation</h4>
                                            <p className="text-gray-400">{explanation[term].explanation}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-300 mb-1">Suggested Clarification Question</h4>
                                            <div className="p-3 bg-slate-800 rounded-md italic text-gray-400 relative">
                                                "{explanation[term].suggested_question}"
                                                <button
                                                    onClick={() => handleCopy(term, explanation[term].suggested_question)}
                                                    className="absolute top-2 right-2 flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1 px-2 rounded-md transition-all text-xs"
                                                    aria-label="Copy suggested question"
                                                >
                                                    {copiedTerm === term ? <ClipboardCheckIcon /> : <ClipboardIcon />}
                                                    <span>{copiedTerm === term ? 'Copied' : 'Copy'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JargonHelper;
