
import { useState, useCallback } from 'react';
import { analyzeEmail } from '../services/aiService';
import { emailAnalysisSystemPrompt } from '../prompts';
import { getFriendlyErrorMessage } from '../utils/errorUtils';
import { Analysis } from '../components/EmailLawBuddy';

export const useEmailBuddy = () => {
    const [receivedEmail, setReceivedEmail] = useState('');
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyzeEmail = useCallback(async () => {
        if (!receivedEmail.trim()) {
            setError('Please paste the email you received to get started.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const result = await analyzeEmail(receivedEmail, emailAnalysisSystemPrompt);
            const keyPointsSuggestion = result.key_demands.map((demand: string) => `- Respond to the demand: "${demand}"`).join('\n');
            setAnalysis({ ...result, key_points_suggestion: keyPointsSuggestion });
        } catch (err: any) {
            setError(getFriendlyErrorMessage(err, 'email analysis'));
        } finally {
            setIsLoading(false);
        }
    }, [receivedEmail]);
    
    const reset = useCallback(() => {
        setReceivedEmail('');
        setAnalysis(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return {
        receivedEmail,
        setReceivedEmail,
        analysis,
        isLoading,
        error,
        handleAnalyzeEmail,
        reset,
        setError
    };
};
