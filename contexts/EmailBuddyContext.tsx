import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { analyzeEmail, generateDraftEmail } from '../services/aiService';
import { emailAnalysisSystemPrompt, emailBuddySystemPrompt } from '../prompts';
import { getFriendlyErrorMessage } from '../utils/errorUtils';

// Types from EmailLawBuddy and DraftingStation
export interface Analysis {
    tone: string;
    summary: string;
    key_demands: string[];
    key_points_suggestion: string;
    legal_jargon?: Array<{
        term: string;
        context: string;
    }>;
}

export type ToneOption =
    | 'BIFF'
    | 'Grey Rock'
    | 'Friendly Assertive'
    | 'Professional (for Lawyers)'
    | 'Passive'
    | 'Passive-Aggressive'
    | 'Aggressive';

// State and Context Shape
interface EmailBuddyState {
    receivedEmail: string;
    analysis: Analysis | null;
    keyPoints: string;
    drafts: Record<string, string>;
    activeDraftTone: ToneOption | null;
    isLoadingAnalysis: boolean;
    isLoadingDraft: boolean;
    error: string | null;
    isShowingExample: boolean;
}

interface EmailBuddyActions {
    setReceivedEmail: (email: string) => void;
    setKeyPoints: (points: string) => void;
    setError: (error: string | null) => void;
    handleAnalyzeEmail: () => Promise<void>;
    handleGenerateDraft: (tone: ToneOption) => Promise<void>;
    showExample: (exampleData: { email: string; analysis: Analysis; keyPoints: string; drafts: Record<ToneOption, string> }) => void;
    reset: () => void;
}

export type EmailBuddyContextValue = EmailBuddyState & EmailBuddyActions;

// Initial State
const initialState: EmailBuddyState = {
    receivedEmail: '',
    analysis: null,
    keyPoints: '',
    drafts: {},
    activeDraftTone: null,
    isLoadingAnalysis: false,
    isLoadingDraft: false,
    error: null,
    isShowingExample: false,
};

// Create Context
export const EmailBuddyContext = createContext<EmailBuddyContextValue | undefined>(undefined);

// Provider Component
export const EmailBuddyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<EmailBuddyState>(initialState);

    const setReceivedEmail = useCallback((email: string) => {
        setState(s => ({ ...s, receivedEmail: email, isShowingExample: false }));
    }, []);

    const setKeyPoints = useCallback((points: string) => {
        // When key points change, clear old drafts as they are no longer relevant
        setState(s => ({ ...s, keyPoints: points, drafts: {} }));
    }, []);

    const setError = useCallback((error: string | null) => {
        setState(s => ({ ...s, error }));
    }, []);

    const handleAnalyzeEmail = useCallback(async () => {
        if (!state.receivedEmail.trim()) {
            setError('Please paste the email you received to get started.');
            return;
        }

        setState(s => ({ ...s, isLoadingAnalysis: true, error: null, analysis: null }));

        try {
            const result = await analyzeEmail(state.receivedEmail, emailAnalysisSystemPrompt);
            const keyPointsSuggestion = result.key_demands.map((demand: string) => `- Respond to the demand: "${demand}"`).join('\n');
            const fullAnalysis = { ...result, key_points_suggestion: keyPointsSuggestion };
            setState(s => ({
                ...s,
                analysis: fullAnalysis,
                keyPoints: keyPointsSuggestion,
                isLoadingAnalysis: false,
            }));
        } catch (err: any) {
            const friendlyError = getFriendlyErrorMessage(err, 'email analysis');
            setState(s => ({ ...s, error: friendlyError, isLoadingAnalysis: false }));
        }
    }, [state.receivedEmail]);

    const handleGenerateDraft = useCallback(async (tone: ToneOption) => {
        if (!state.keyPoints.trim()) {
            setError('Please provide key points before generating a draft.');
            return;
        }

        setState(s => ({ ...s, isLoadingDraft: true, activeDraftTone: tone, error: null }));

        try {
            const userPrompt = `Please draft a response with the tone "${tone}".

**Original Email Received:**
\`\`\`
${state.receivedEmail}
\`\`\`

**My Key Points to Include:**
\`\`\`
${state.keyPoints}
\`\`\`
`;
            const result = await generateDraftEmail(userPrompt, emailBuddySystemPrompt);
            setState(s => ({
                ...s,
                drafts: { ...s.drafts, [tone]: result },
                isLoadingDraft: false,
                activeDraftTone: null,
            }));
        } catch (err: any) {
            const friendlyError = getFriendlyErrorMessage(err, 'draft generation');
            setState(s => ({ ...s, error: friendlyError, isLoadingDraft: false, activeDraftTone: null }));
        }
    }, [state.keyPoints, state.receivedEmail]);

    const showExample = useCallback((exampleData: { email: string; analysis: Analysis; keyPoints: string; drafts: Record<ToneOption, string> }) => {
        setState({
            ...initialState,
            receivedEmail: exampleData.email,
            analysis: exampleData.analysis,
            keyPoints: exampleData.keyPoints,
            drafts: exampleData.drafts,
            isShowingExample: true,
        });
    }, []);

    const reset = useCallback(() => {
        setState(initialState);
    }, []);

    const value: EmailBuddyContextValue = {
        ...state,
        setReceivedEmail,
        setKeyPoints,
        setError,
        handleAnalyzeEmail,
        handleGenerateDraft,
        showExample,
        reset,
    };

    return (
        <EmailBuddyContext.Provider value={value}>
            {children}
        </EmailBuddyContext.Provider>
    );
};