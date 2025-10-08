import React, { createContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { analyzeAndDraftEmailResponses } from '../services/openaiService';
import { emailAnalyzerAndDrafterSystemPrompt } from '../prompts';
import { getFriendlyErrorMessage } from '../utils/errorUtils';
import { EmailBuddyResponse, ToneOption } from '../types/ai';

// Re-export type for convenience
export type { EmailBuddyResponse, ToneOption };

// State and Context Shape
export interface EmailBuddyState {
    receivedEmail: string;
    response: EmailBuddyResponse | null;
    isLoading: boolean;
    error: string | null;
}

export interface EmailBuddyActions {
    setReceivedEmail: (email: string) => void;
    setError: (error: string | null) => void;
    handleGenerateResponses: () => Promise<void>;
    showExample: (exampleData: { email: string; response: EmailBuddyResponse }) => void;
    reset: () => void;
}

// Initial State
const initialState: EmailBuddyState = {
    receivedEmail: '',
    response: null,
    isLoading: false,
    error: null,
};

// Create Contexts
export const EmailBuddyStateContext = createContext<EmailBuddyState | undefined>(undefined);
export const EmailBuddyActionsContext = createContext<EmailBuddyActions | undefined>(undefined);

// Provider Component
export const EmailBuddyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<EmailBuddyState>(initialState);

    const setReceivedEmail = useCallback((email: string) => {
        setState(s => ({ ...s, receivedEmail: email }));
    }, []);

    const setError = useCallback((error: string | null) => {
        setState(s => ({ ...s, error }));
    }, []);

    const handleGenerateResponses = useCallback(async () => {
        if (!state.receivedEmail.trim()) {
            setError('Please paste the email you received to get started.');
            return;
        }
        setState(s => ({ ...s, isLoading: true, error: null, response: null }));
        try {
            const result = await analyzeAndDraftEmailResponses(state.receivedEmail);
            setState(s => ({ ...s, response: result, isLoading: false }));
        } catch (err: any) {
            setState(s => ({ ...s, error: getFriendlyErrorMessage(err, 'email analysis and drafting'), isLoading: false }));
        }
    }, [state.receivedEmail]);


    const showExample = useCallback((exampleData: { email: string; response: EmailBuddyResponse }) => {
        setState({ 
            ...initialState, 
            receivedEmail: exampleData.email, 
            response: exampleData.response,
        });
    }, []);

    const reset = useCallback(() => setState(initialState), []);

    const actions = useMemo(() => ({
        setReceivedEmail,
        setError,
        handleGenerateResponses,
        showExample,
        reset,
    }), [setReceivedEmail, setError, handleGenerateResponses, showExample, reset]);

    return (
        <EmailBuddyStateContext.Provider value={state}>
            <EmailBuddyActionsContext.Provider value={actions}>
                {children}
            </EmailBuddyActionsContext.Provider>
        </EmailBuddyStateContext.Provider>
    );
};