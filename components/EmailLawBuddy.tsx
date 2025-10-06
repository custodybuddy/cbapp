import React, { useEffect } from 'react';
import { useEmailBuddy } from '../hooks/useEmailBuddy';
import EmailAnalysisDisplay from './email-buddy/EmailAnalysisDisplay';
import DraftingStation from './email-buddy/DraftingStation';
import JargonHelper from './email-buddy/JargonHelper';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import XIcon from './icons/XIcon';
import RotateCwIcon from './icons/RotateCwIcon';
import {
    exampleReceivedEmail,
    exampleAnalysis,
    exampleKeyPoints,
    exampleDrafts
} from '../constants/exampleData';
import { useModal } from '../hooks/useModal';
import type { Analysis, ToneOption } from '../hooks/useEmailBuddy';

// Re-exporting types for other files if they were imported from here
export type { Analysis, ToneOption };

const EmailLawBuddy: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    const { 
        receivedEmail, 
        setReceivedEmail, 
        analysis, 
        isLoadingAnalysis, 
        error, 
        handleAnalyzeEmail, 
        reset,
        setError,
        showExample
    } = useEmailBuddy();
    const { closeModal } = useModal();

    useEffect(() => {
        if (!isOpen) {
            // Delay reset to allow for modal close animation
            setTimeout(() => {
                reset();
            }, 300);
        }
    }, [isOpen, reset]);

    const handleVisitLibrary = () => {
        closeModal();
    };

    const handleShowExample = () => {
        showExample({
            email: exampleReceivedEmail,
            analysis: exampleAnalysis,
            keyPoints: exampleKeyPoints,
            drafts: exampleDrafts,
        });
    };

    return (
        <div className="space-y-6">
            <p className="text-gray-400 text-sm">
                Paste a high-conflict email below. Our AI will analyze the tone, identify demands, and help you draft a professional, court-ready response using proven de-escalation techniques like BIFF or Grey Rock.
            </p>

            <div className="text-center text-sm bg-slate-900 p-3 rounded-lg border border-slate-700">
                <p className="text-gray-400">
                    Need to write an email from scratch?
                    <a href="#/template-library" onClick={handleVisitLibrary} className="font-semibold text-amber-400 hover:text-amber-300 ml-2">
                        Visit our Template Library →
                    </a>
                </p>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label htmlFor="received-email" className="block text-sm font-medium text-gray-300">
                        Email You Received
                    </label>
                    <button onClick={handleShowExample} className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                        Show Example
                    </button>
                </div>
                <textarea
                    id="received-email"
                    value={receivedEmail}
                    onChange={(e) => setReceivedEmail(e.target.value)}
                    placeholder="Paste the full email here..."
                    className="w-full h-40 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none transition-shadow duration-200 disabled:opacity-50"
                    disabled={isLoadingAnalysis}
                />
            </div>
            
            {error && (
                 <div className="bg-red-900/20 border border-red-500/50 text-red-400 text-sm rounded-lg p-3 flex items-center gap-3 animate-fade-in-up-fast" role="alert">
                    <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
                    <p className="flex-grow">{error}</p>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-white" aria-label="Dismiss error message"><XIcon className="w-5 h-5" /></button>
                </div>
            )}

            {!analysis && (
                <div className="flex justify-end pt-4 border-t border-slate-700">
                     <button
                        onClick={handleAnalyzeEmail}
                        disabled={isLoadingAnalysis || !receivedEmail.trim()}
                        className="inline-flex items-center justify-center bg-amber-400 text-black font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-200 ease-out motion-safe:hover:scale-105 motion-safe:active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                         {isLoadingAnalysis ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Analyzing...
                            </>
                        ) : 'Analyze Email'}
                    </button>
                </div>
            )}
            
            {analysis && (
                <div className="space-y-6 animate-fade-in-up pt-4 border-t border-slate-700">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-200">Step 2: Draft Your Response</h3>
                        <button
                            onClick={reset}
                            disabled={isLoadingAnalysis}
                            className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors disabled:opacity-50"
                        >
                            <RotateCwIcon className="w-4 h-4" />
                            Start Over
                        </button>
                    </div>
                    <EmailAnalysisDisplay />
                    <JargonHelper />
                    <DraftingStation />
                </div>
            )}
        </div>
    );
};

export default EmailLawBuddy;