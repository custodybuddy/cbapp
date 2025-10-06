import { useContext } from 'react';
import { EmailBuddyContext } from '../contexts/EmailBuddyContext';
import type { Analysis, ToneOption, EmailBuddyContextValue } from '../contexts/EmailBuddyContext';

export const useEmailBuddy = (): EmailBuddyContextValue => {
    const context = useContext(EmailBuddyContext);
    if (context === undefined) {
        throw new Error('useEmailBuddy must be used within an EmailBuddyProvider');
    }
    return context;
};

// Re-export types for convenience in components
export type { Analysis, ToneOption };