import { useContext } from 'react';
import { CaseAnalysisContext, CaseAnalysisContextValue, CaseAnalysisReport } from '../contexts/CaseAnalysisContext';

export const useCaseAnalysis = (): CaseAnalysisContextValue => {
    const context = useContext(CaseAnalysisContext);
    if (context === undefined) {
        throw new Error('useCaseAnalysis must be used within a CaseAnalysisProvider');
    }
    return context;
};

// Re-export type for convenience
export type { CaseAnalysisReport };
