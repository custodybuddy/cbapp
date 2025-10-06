import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { analyzeCaseDocuments, prepareContentParts, CaseAnalysisReport } from '../services/aiService';
import { caseAnalysisSystemPrompt } from '../prompts';
import { getFriendlyErrorMessage } from '../utils/errorUtils';

// Re-export type for convenience
export type { CaseAnalysisReport };

interface CaseAnalysisState {
    files: File[];
    pastedText: string;
    isLoading: boolean;
    error: string | null;
    analysisResponse: CaseAnalysisReport | null;
}

interface CaseAnalysisActions {
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    setPastedText: React.Dispatch<React.SetStateAction<string>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    handleAnalysis: () => Promise<void>;
    reset: () => void;
}

export type CaseAnalysisContextValue = CaseAnalysisState & CaseAnalysisActions;

const initialState: CaseAnalysisState = {
    files: [],
    pastedText: '',
    isLoading: false,
    error: null,
    analysisResponse: null,
};

// Create the context
export const CaseAnalysisContext = createContext<CaseAnalysisContextValue | undefined>(undefined);

// Create the provider component
export const CaseAnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [pastedText, setPastedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResponse, setAnalysisResponse] = useState<CaseAnalysisReport | null>(null);

    const handleAnalysis = useCallback(async () => {
        if (files.length === 0 && !pastedText.trim()) {
            setError('Please upload at least one document or paste some text to analyze.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResponse(null);

        try {
            const contentParts = await prepareContentParts(files, pastedText);
            const result = await analyzeCaseDocuments(contentParts, caseAnalysisSystemPrompt);
            setAnalysisResponse(result);
        } catch (err: any) {
            setError(getFriendlyErrorMessage(err, 'document analysis'));
        } finally {
            setIsLoading(false);
        }
    }, [files, pastedText]);

    const reset = useCallback(() => {
        setFiles([]);
        setPastedText('');
        setError(null);
        setAnalysisResponse(null);
        setIsLoading(false);
    }, []);

    const value: CaseAnalysisContextValue = {
        files,
        setFiles,
        pastedText,
        setPastedText,
        isLoading,
        error,
        setError,
        analysisResponse,
        handleAnalysis,
        reset,
    };

    return (
        <CaseAnalysisContext.Provider value={value}>
            {children}
        </CaseAnalysisContext.Provider>
    );
};
