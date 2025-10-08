import React, { lazy, Suspense } from 'react';
import { useModal } from '../hooks/useModal';
import Modal from './Modal';
import SpinnerIcon from './icons/SpinnerIcon';
import { IncidentReportProvider } from '../contexts/IncidentReportContext';
import { EmailBuddyProvider } from '../contexts/EmailBuddyContext';
import { CaseAnalysisProvider } from '../contexts/CaseAnalysisContext';

// Lazy load the components that are opened in modals
const CaseAnalysisTool = lazy(() => import('./CaseAnalysisTool'));
const EmailLawBuddy = lazy(() => import('./EmailLawBuddy'));
const ReportAnIncident = lazy(() => import('./report-incident/ReportAnIncident'));

const SuspenseFallback: React.FC = () => (
    <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="text-center text-gray-400">
            <SpinnerIcon className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <p>Loading Tool...</p>
        </div>
    </div>
);


const GlobalModals: React.FC = () => {
    const { activeModal, closeModal } = useModal();

    return (
        <>
            <Modal
                isOpen={activeModal === 'case-analysis'}
                onClose={closeModal}
                title="Family Law Case Analysis Tool"
            >
                <CaseAnalysisProvider>
                    <Suspense fallback={<SuspenseFallback />}>
                        <CaseAnalysisTool isOpen={activeModal === 'case-analysis'} />
                    </Suspense>
                </CaseAnalysisProvider>
            </Modal>
            <Modal
                isOpen={activeModal === 'email-buddy'}
                onClose={closeModal}
                title="Email Law Buddy"
            >
                <EmailBuddyProvider>
                    <Suspense fallback={<SuspenseFallback />}>
                        <EmailLawBuddy isOpen={activeModal === 'email-buddy'} />
                    </Suspense>
                </EmailBuddyProvider>
            </Modal>
            <Modal
                isOpen={activeModal === 'report-incident'}
                onClose={closeModal}
                title="Report An Incident"
            >
                <IncidentReportProvider>
                    <Suspense fallback={<SuspenseFallback />}>
                        <ReportAnIncident isOpen={activeModal === 'report-incident'} />
                    </Suspense>
                </IncidentReportProvider>
            </Modal>
        </>
    );
}

export default GlobalModals;