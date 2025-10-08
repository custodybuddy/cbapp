import { useContext } from 'react';
import {
    IncidentReportStateContext,
    IncidentReportActionsContext,
    IncidentReportState,
    IncidentReportActions
} from '../contexts/IncidentReportContext';

export const useIncidentReportState = (): IncidentReportState => {
    const context = useContext(IncidentReportStateContext);
    if (context === undefined) {
        throw new Error('useIncidentReportState must be used within an IncidentReportProvider');
    }
    return context;
};

export const useIncidentReportActions = (): IncidentReportActions => {
    const context = useContext(IncidentReportActionsContext);
    if (context === undefined) {
        throw new Error('useIncidentReportActions must be used within an IncidentReportProvider');
    }
    return context;
};