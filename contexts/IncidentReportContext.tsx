import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { generateIncidentReport } from '../services/aiService';
import { incidentReportSystemPrompt } from '../prompts';
import { getFriendlyErrorMessage } from '../utils/errorUtils';

// Types for the context
export interface IncidentData {
    dateTime: string;
    location: string;
    involvedParties: string;
    narrative: string;
    jurisdiction: string;
}

export interface IncidentReport {
    professionalSummary: string;
    observedImpact: string[];
    legalInsights: Array<{
        insight: string;
        legislation: string;
        sourceUrl: string;
    }>;
}

const initialIncidentData: IncidentData = {
    dateTime: '',
    location: '',
    involvedParties: '',
    narrative: '',
    jurisdiction: '',
};

// Define the shape of the context value
interface IncidentReportContextValue {
    incidentData: IncidentData;
    isLoading: boolean;
    error: string | null;
    reportResponse: IncidentReport | null;
    setIncidentData: React.Dispatch<React.SetStateAction<IncidentData>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    handleGenerateReport: () => Promise<void>;
    reset: () => void;
}

// Create the context
export const IncidentReportContext = createContext<IncidentReportContextValue | undefined>(undefined);

// Create the provider component
export const IncidentReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [incidentData, setIncidentData] = useState<IncidentData>(initialIncidentData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reportResponse, setReportResponse] = useState<IncidentReport | null>(null);

    const handleGenerateReport = useCallback(async () => {
        if (!incidentData.narrative.trim() || !incidentData.jurisdiction.trim() || !incidentData.dateTime) {
            setError('Please fill in at least the date/time, jurisdiction, and a narrative of the incident.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setReportResponse(null);

        try {
            const result = await generateIncidentReport(incidentData, incidentReportSystemPrompt);
            setReportResponse(result);
        } catch (err: any) {
            setError(getFriendlyErrorMessage(err, 'incident report generation'));
        } finally {
            setIsLoading(false);
        }
    }, [incidentData]);

    const reset = useCallback(() => {
        setIncidentData(initialIncidentData);
        setError(null);
        setReportResponse(null);
        setIsLoading(false);
    }, []);

    const value = {
        incidentData,
        setIncidentData,
        isLoading,
        error,
        setError,
        reportResponse,
        handleGenerateReport,
        reset,
    };

    return (
        <IncidentReportContext.Provider value={value}>
            {children}
        </IncidentReportContext.Provider>
    );
};
