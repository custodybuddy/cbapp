import React, { createContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { generateIncidentReport } from '../services/openaiService';
import { getFriendlyErrorMessage } from '../utils/errorUtils';
import { IncidentReport, IncidentData, IncidentCategory } from '../types/ai';

export type { IncidentReport, IncidentData, IncidentCategory };

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

// --- Initial State ---
export const initialIncidentData: IncidentData = {
    narrative: '',
    jurisdiction: '',
    incidentDate: '',
    otherPartiesInvolved: [],
    childrenPresent: [],
    location: '',
};

const initialState: IncidentReportState = {
    incidentData: initialIncidentData,
    isLoading: false,
    error: null,
    reportResponse: null,
};


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
        setError(null);
        if (!incidentData.narrative.trim()) {
            setError('Please provide a narrative of the incident.');
            return;
        }
        if (!incidentData.jurisdiction.trim()) {
            setError('Please specify the jurisdiction (e.g., province or state).');
            return;
        }
         if (!incidentData.incidentDate) {
            setError('Please select the date of the incident.');
            return;
        }
        if (incidentData.otherPartiesInvolved.length === 0) {
            setError('Please select or add at least one other party involved.');
            return;
        }

        setIsLoading(true);
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
        setIsLoading(false);
        setError(null);
        setReportResponse(null);
    }, []);
    
    const state = useMemo(() => ({
        incidentData,
        isLoading,
        error,
        reportResponse,
    }), [incidentData, isLoading, error, reportResponse]);

    const actions = useMemo(() => ({
        setIncidentData,
        setError,
        handleGenerateReport,
        reset,
    }), [setIncidentData, setError, handleGenerateReport, reset]);

    return (
        <IncidentReportStateContext.Provider value={state}>
            <IncidentReportActionsContext.Provider value={actions}>
                {children}
            </IncidentReportActionsContext.Provider>
        </IncidentReportStateContext.Provider>
    );
};