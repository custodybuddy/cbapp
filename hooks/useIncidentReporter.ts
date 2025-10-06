
import { useState, useCallback } from 'react';
import { generateIncidentReport } from '../services/aiService';
import { incidentReportSystemPrompt } from '../prompts';
import { getFriendlyErrorMessage } from '../utils/errorUtils';

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

export const useIncidentReporter = () => {
    const [incidentData, setIncidentData] = useState<IncidentData>(initialIncidentData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reportResponse, setReportResponse] = useState<IncidentReport | null>(null);

    const handleGenerateReport = useCallback(async () => {
        // Basic validation
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

    return {
        incidentData,
        setIncidentData,
        isLoading,
        error,
        reportResponse,
        handleGenerateReport,
        reset,
        setError,
    };
};
