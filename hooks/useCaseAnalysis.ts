import { useContext } from 'react';
import {
    CaseAnalysisStateContext,
    CaseAnalysisActionsContext,
    CaseAnalysisState,
    CaseAnalysisActions,
} from '../contexts/CaseAnalysisContext';

// Hook for consuming state
export const useCaseAnalysisState = (): CaseAnalysisState => {
    const context = useContext(CaseAnalysisStateContext);
    if (context === undefined) {
        throw new Error('useCaseAnalysisState must be used within a CaseAnalysisProvider');
    }
    return context;
};

// Hook for consuming actions
export const useCaseAnalysisActions = (): CaseAnalysisActions => {
    const context = useContext(CaseAnalysisActionsContext);
    if (context === undefined) {
        throw new Error('useCaseAnalysisActions must be used within a CaseAnalysisProvider');
    }
    return context;
};
