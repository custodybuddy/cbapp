import React from 'react';

interface ConsentModalProps {
    onAccept: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ onAccept }) => {
    return (
        <div
            className="fixed inset-0 bg-slate-900/90 z-[100] flex justify-center items-center p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-title"
        >
            <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 border border-amber-400/50 text-center animate-scale-in">
                <h1 id="consent-title" className="text-2xl font-bold text-amber-400 mb-4">
                    Welcome to CustodyBuddy
                </h1>
                <p className="text-gray-300 mb-6">
                    Before you begin, please acknowledge that you have read and agree to our
                    <a href="#/terms" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline font-semibold mx-1">Terms of Use</a>
                    and our
                    <a href="#/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline font-semibold ml-1">Privacy Policy</a>.
                </p>
                <p className="text-sm text-gray-400 mb-8">
                    This site provides AI-powered informational tools and is
                    <strong> not a substitute for legal advice</strong> from a qualified professional.
                </p>
                <button
                    onClick={onAccept}
                    className="w-full bg-amber-400 text-black font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 ease-out motion-safe:hover:scale-105 motion-safe:active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                    I Have Read and Agree
                </button>
            </div>
        </div>
    );
};

export default ConsentModal;
