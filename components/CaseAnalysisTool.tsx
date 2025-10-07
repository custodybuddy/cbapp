import React, { useEffect } from 'react';
import { useCaseAnalysisState, useCaseAnalysisActions } from '../hooks/useCaseAnalysis';
import FileManagement from './case-analysis/FileManagement';
import AnalysisResult from './case-analysis/AnalysisResult';
import RotateCwIcon from './icons/RotateCwIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import XIcon from './icons/XIcon';

const CaseAnalysisTool: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    const {
        files,
        pastedText,
        jurisdiction,
        isLoading,
        error,
        analysisResponse,
    } = useCaseAnalysisState();

    const {
        setPastedText,
        setJurisdiction,
        handleAnalysis,
        reset,
        setError
    } = useCaseAnalysisActions();
    
    // Reset state when the modal is closed
    useEffect(() => {
        if (!isOpen) {
            // Delay reset to allow for closing animation
            setTimeout(() => {
                reset();
            }, 300);
        }
    }, [isOpen, reset]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPastedText(e.target.value);
    };
    
    const handleJurisdictionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJurisdiction(e.target.value);
    };

    const isAnalyzeButtonDisabled = isLoading || (files.length === 0 && !pastedText.trim()) || !jurisdiction.trim();

    return (
        <div className="space-y-6">
            <p className="text-gray-400 text-sm">
                Upload court orders, separation agreements, or difficult emails. Our AI will analyze them, identify key obligations, flag potential conflicts, and suggest next steps. All uploaded files are processed securely and are not stored.
            </p>

            {!analysisResponse && (
                <>
                    <FileManagement />

                    <div>
                        <label htmlFor="pasted-text" className="block text-sm font-medium text-gray-300 mb-1">Or paste text here:</label>
                        <textarea
                            id="pasted-text"
                            value={pastedText}
                            onChange={handleTextChange}
                            placeholder="Paste email content or legal text here..."
                            className="w-full h-32 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none transition-shadow duration-200 disabled:opacity-50"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="jurisdiction-case" className="block text-sm font-medium text-gray-300 mb-1">Jurisdiction (Province/State)<span aria-hidden="true" className="text-red-400 ml-1">*</span></label>
                        <input
                            type="text"
                            id="jurisdiction-case"
                            name="jurisdiction"
                            value={jurisdiction}
                            onChange={handleJurisdictionChange}
                            placeholder="e.g., Ontario, Canada"
                            className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    
                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 text-red-400 text-sm rounded-lg p-3 flex items-center gap-3 animate-fade-in-up-fast" role="alert">
                            <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
                            <p className="flex-grow">{error}</p>
                            <button onClick={() => setError(null)} className="text-red-400 hover:text-white" aria-label="Dismiss error message"><XIcon className="w-5 h-5" /></button>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-slate-700">
                        <button
                            onClick={reset}
                            disabled={isLoading}
                            className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RotateCwIcon className="w-4 h-4" />
                            Start Over
                        </button>
                        <button
                            onClick={handleAnalysis}
                            disabled={isAnalyzeButtonDisabled}
                            className="w-full sm:w-auto inline-flex items-center justify-center bg-amber-400 text-black font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 ease-out motion-safe:hover:scale-105 motion-safe:active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Analyzing...
                                </>
                            ) : 'Analyze Documents'}
                        </button>
                    </div>
                </>
            )}

            {isLoading && !analysisResponse && (
                <div className="text-center p-4 text-gray-400" role="status">
                    <p className="font-semibold text-amber-400">AI is analyzing your documents...</p>
                    <p className="text-sm">This may take a moment, especially for large or multiple files.</p>
                </div>
            )}
            
            {analysisResponse && <AnalysisResult />}
        </div>
    );
};

export default CaseAnalysisTool;