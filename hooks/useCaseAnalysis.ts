import { useState, useCallback } from 'react';
import { analyzeCaseDocuments, prepareContentParts } from '../services/aiService';
import { caseAnalysisSystemPrompt } from '../prompts';
import { getFriendlyErrorMessage } from '../utils/errorUtils';

export const useCaseAnalysis = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [pastedText, setPastedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResponse, setAnalysisResponse] = useState<string | null>(null);

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

    return {
        files,
        setFiles,
        pastedText,
        setPastedText,
        isLoading,
        error,
        analysisResponse,
        handleAnalysis,
        reset,
        setError,
    };
};