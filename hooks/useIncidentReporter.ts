import { useContext } from 'react';
import { IncidentReportContext } from '../contexts/IncidentReportContext';
import type { IncidentData, IncidentReport } from '../contexts/IncidentReportContext';

export const useIncidentReporter = () => {
    const context = useContext(IncidentReportContext);
    if (context === undefined) {
        throw new Error('useIncidentReporter must be used within an IncidentReportProvider');
    }
    return context;
};

export type { IncidentData, IncidentReport };
