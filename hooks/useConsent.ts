import { useState, useCallback } from 'react';

const CONSENT_KEY = 'custodybuddy-consent-given';

export const useConsent = () => {
    const [consentGiven, setConsentGiven] = useState<boolean>(() => {
        try {
            // Check for consent immediately on initialization
            return localStorage.getItem(CONSENT_KEY) === 'true';
        } catch (error) {
            console.error('Could not access localStorage:', error);
            return false;
        }
    });

    const acceptConsent = useCallback(() => {
        try {
            localStorage.setItem(CONSENT_KEY, 'true');
            setConsentGiven(true);
        } catch (error) {
            console.error('Could not write to localStorage:', error);
            // Even if localStorage fails, allow the user to proceed for the current session.
            setConsentGiven(true);
        }
    }, []);

    return { consentGiven, acceptConsent };
};
