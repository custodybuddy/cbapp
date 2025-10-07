import React, { createContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { generateIncidentReport } from '../services/incidentReportService';
import { getFriendlyErrorMessage } from '../utils/errorUtils';
import { IncidentData, IncidentReport } from '../types/ai';

// --- Types for the context ---
export type { IncidentData, IncidentReport };

const initialIncidentData: IncidentData = {
    dateTime: '',
    location: '',
    involvedParties: '',
    narrative: '',
    jurisdiction: '',
};

// --- State and Actions Types ---
export interface IncidentReportState {
    incidentData: IncidentData;
    isLoading: boolean;
    error: string | null;
    reportResponse: IncidentReport | null;
}

export interface IncidentReportActions {
    setIncidentData: React.Dispatch<React.SetStateAction<IncidentData>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    handleGenerateReport: () => Promise<void>;
    reset: () => void;
}

// --- Context Definitions ---
export const IncidentReportStateContext = createContext<IncidentReportState | undefined>(undefined);
export const IncidentReportActionsContext = createContext<IncidentReportActions | undefined>(undefined);

// --- Provider Component ---
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
            const result = await generateIncidentReport(incidentData);
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

    const actions = useMemo(() => ({
        setIncidentData,
        setError,
        handleGenerateReport,
        reset,
    }), [handleGenerateReport, reset]);

    const state = useMemo(() => ({
        incidentData,
        isLoading,
        error,
        reportResponse,
    }), [incidentData, isLoading, error, reportResponse]);

    return (
        <IncidentReportStateContext.Provider value={state}>
            <IncidentReportActionsContext.Provider value={actions}>
                {children}
            </IncidentReportActionsContext.Provider>
        </IncidentReportStateContext.Provider>
    );
};