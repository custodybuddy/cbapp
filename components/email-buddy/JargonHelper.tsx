import React, { useState, useEffect } from 'react';
import { explainJargon } from '../../services/emailBuddyService';
import { getFriendlyErrorMessage } from '../../utils/errorUtils';
import HelpCircleIcon from '../icons/HelpCircleIcon';
import SpinnerIcon from '../icons/SpinnerIcon';
import AlertTriangleIcon from '../icons/AlertTriangleIcon';
import ClipboardIcon from '../icons/ClipboardIcon';
import ClipboardCheckIcon from '../icons/ClipboardCheckIcon';

interface JargonItem {
    term: string;
    context: string;
}

interface JargonHelperProps {
    jargon: JargonItem[];
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
    
    // When jargon prop changes, reset local state
    useEffect(() => {
        setExpandedTerm(null);
        setExplanation({});
        setLoadingTerm(null);
        setError(null);
    }, [jargon]);


    const handleToggleTerm = async (term: string, context: string) => {
        if (expandedTerm === term) {
            setExpandedTerm(null);
            return;
        }

        setExpandedTerm(term);
        setError(null);

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
    
    if (jargon.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            <h4 className="font-bold text-gray-300 mb-2 flex items-center gap-2">
                <HelpCircleIcon className="w-5 h-5 text-amber-400" />
                Legal Jargon Detected
            </h4>
            <div className="space-y-2">
                {jargon.map(({ term, context }) => (
                    <div key={term}>
                        <button
                            onClick={() => handleToggleTerm(term, context)}
                            className="w-full text-left font-semibold text-gray-300 p-2 rounded-md bg-slate-700/50 hover:bg-slate-700 transition-colors flex justify-between items-center"
                            aria-expanded={expandedTerm === term}
                            aria-controls={`jargon-panel-${term.replace(/\s+/g, '-')}`}
                        >
                            <span>{term}</span>
                            <span className={`transform transition-transform duration-200 ${expandedTerm === term ? 'rotate-180' : 'rotate-0'}`}>▼</span>
                        </button>
                        {expandedTerm === term && (
                            <div id={`jargon-panel-${term.replace(/\s+/g, '-')}`} className="p-3 bg-slate-950 rounded-b-md border-x border-b border-slate-600 animate-fade-in-up-fast">
                                {loadingTerm === term && (
                                    <div className="flex items-center justify-center gap-2 text-gray-400">
                                        <SpinnerIcon className="w-5 h-5" />
                                        <span>Explaining...</span>
                                    </div>
                                )}
                                {error && loadingTerm !== term && (
                                    <div className="flex items-center gap-2 text-red-400">
                                        <AlertTriangleIcon className="w-5 h-5" />
                                        <span>{error}</span>
                                    </div>
                                )}
                                {explanation[term] && (
                                    <div className="space-y-3 text-xs">
                                        <div>
                                            <h5 className="font-bold text-gray-300 mb-1">Explanation</h5>
                                            <p className="text-gray-400">{explanation[term].explanation}</p>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-gray-300 mb-1">Suggested Question</h5>
                                            <div className="p-2 bg-slate-800 rounded-md italic text-gray-400 relative">
                                                "{explanation[term].suggested_question}"
                                                <button
                                                    onClick={() => handleCopy(term, explanation[term].suggested_question)}
                                                    className="absolute top-1 right-1 flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-0.5 px-1.5 rounded-md transition-all"
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
