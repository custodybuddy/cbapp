import React, { createContext, useState, useCallback, ReactNode } from 'react';

export type ModalType = 'case-analysis' | 'email-buddy' | 'report-incident';

interface ModalContextType {
    activeModal: ModalType | null;
    openModal: (modal: ModalType) => void;
    closeModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeModal, setActiveModal] = useState<ModalType | null>(null);

    const openModal = useCallback((modal: ModalType) => {
        setActiveModal(modal);
    }, []);

    const closeModal = useCallback(() => {
        setActiveModal(null);
    }, []);

    const value = { activeModal, openModal, closeModal };

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
};