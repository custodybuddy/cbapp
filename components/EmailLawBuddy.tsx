import React, { useEffect, useState } from 'react';
// Fix: Import EmailBuddyResponse type from its source file instead of the hook file.
import { useEmailBuddyState, useEmailBuddyActions } from '../hooks/useEmailBuddy';
import type { EmailBuddyResponse } from '../types/ai';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import XIcon from './icons/XIcon';
import RotateCwIcon from './icons/RotateCwIcon';
import { exampleData } from '../constants/exampleData';
import { useModal } from '../hooks/useModal';
import AnalysisPanel from './email-buddy/AnalysisPanel';
import DraftDisplay from './email-buddy/DraftDisplay';
import AlternativeDraftsPanel from './email-buddy/AlternativeDraftsPanel';

const EmailLawBuddy: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    const { 
        receivedEmail,
        response, 
        isLoading, 
        error,
    } = useEmailBuddyState();
    
    const {
        setReceivedEmail, 
        handleGenerateResponses, 
        reset,
        setError,
        showExample
    } = useEmailBuddyActions();

    const { closeModal } = useModal();
    const [isAnalysisPanelOpen, setIsAnalysisPanelOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            // Delay reset to allow for modal close animation
            setTimeout(() => {
                reset();
                setIsAnalysisPanelOpen(false);
            }, 300);
        }
    }, [isOpen, reset]);

    const handleVisitLibrary = () => {
        closeModal();
    };

    const handleShowExample = () => {
        showExample(exampleData);
        setIsAnalysisPanelOpen(false);
    };
    
    const handleStartOver = () => {
        reset();
        setIsAnalysisPanelOpen(false);
    }

    const renderInitialState = () => (
        <div className="space-y-6">
            <p className="text-gray-400 text-sm">
                Paste a high-conflict email below. Our AI will analyze it and instantly generate professional, court-ready draft responses using proven de-escalation techniques.
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
                    className="w-full h-40 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none transition-shadow duration-200"
                />
            </div>
            
            <div className="flex justify-end pt-4 border-t border-slate-700">
                 <button
                    onClick={handleGenerateResponses}
                    disabled={!receivedEmail.trim()}
                    className="inline-flex items-center justify-center bg-amber-400 text-black font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-200 ease-out motion-safe:hover:scale-105 motion-safe:active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Generate Responses
                </button>
            </div>
        </div>
    );

    const renderLoadingState = () => (
        <div role="status" className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-gray-400">
            <svg className="animate-spin h-8 w-8 text-amber-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p className="font-semibold text-lg text-amber-400">Analyzing & Drafting Responses...</p>
            <p className="text-sm">This may take a moment.</p>
        </div>
    );
    
    const renderResultsState = (response: EmailBuddyResponse) => (
         <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-200">Generated Responses</h3>
                <button
                    onClick={handleStartOver}
                    className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                    <RotateCwIcon className="w-4 h-4" />
                    Start Over
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* Left Panel: Analysis */}
                <AnalysisPanel 
                    analysis={response.analysis}
                    isOpen={isAnalysisPanelOpen}
                    setIsOpen={setIsAnalysisPanelOpen}
                />

                {/* Main Content: Drafts */}
                <div className="flex-grow grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {/* Center Panel: Primary Draft */}
                    <div className="bg-slate-900 border border-amber-400/50 rounded-lg p-4 flex flex-col shadow-lg">
                       <DraftDisplay
                           title="Primary Recommendation: BIFF"
                           draft={response.drafts.biff}
                       />
                    </div>

                    {/* Right Panel: Alternative Drafts */}
                    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 flex flex-col">
                        <AlternativeDraftsPanel drafts={{
                            "Grey Rock": response.drafts.greyRock,
                            "Friendly Assertive": response.drafts.friendlyAssertive
                        }}/>
                    </div>
                </div>
            </div>
         </div>
    );

    return (
        <div className="min-h-[40vh]">
            {isLoading && renderLoadingState()}
            
            {!isLoading && error && (
                 <div className="bg-red-900/20 border border-red-500/50 text-red-400 text-sm rounded-lg p-3 flex items-center gap-3 animate-fade-in-up-fast" role="alert">
                    <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
                    <p className="flex-grow">{error}</p>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-white" aria-label="Dismiss error message"><XIcon className="w-5 h-5" /></button>
                </div>
            )}

            {!isLoading && !error && (
                response ? renderResultsState(response) : renderInitialState()
            )}
        </div>
    );
};

export default EmailLawBuddy;