import { useContext } from 'react';
import {
    EmailBuddyStateContext,
    EmailBuddyActionsContext,
    EmailBuddyState,
    EmailBuddyActions,
} from '../contexts/EmailBuddyContext';
import type { EmailBuddyResponse } from '../types/ai';
import type { ToneOption } from '../contexts/EmailBuddyContext';

// Hook for consuming state
export const useEmailBuddyState = (): EmailBuddyState => {
    const context = useContext(EmailBuddyStateContext);
    if (context === undefined) {
        throw new Error('useEmailBuddyState must be used within an EmailBuddyProvider');
    }
    return context;
};

// Hook for consuming actions
export const useEmailBuddyActions = (): EmailBuddyActions => {
    const context = useContext(EmailBuddyActionsContext);
    if (context === undefined) {
        throw new Error('useEmailBuddyActions must be used within an EmailBuddyProvider');
    }
    return context;
};

// Re-export types for convenience in components
export type { EmailBuddyResponse, ToneOption };
