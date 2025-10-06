import React, { useState } from 'react';

interface ConsentModalProps {
    onAccept: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ onAccept }) => {
    const [isChecked, setIsChecked] = useState(false);

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
                    Before you begin, please review and agree to our
                    <a href="#/terms" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline font-semibold mx-1">Terms of Use</a>
                    and
                    <a href="#/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline font-semibold ml-1">Privacy Policy</a>.
                </p>
                 <div className="bg-red-900/20 text-red-300 text-sm p-3 rounded-lg border border-red-500/30 mb-6">
                    This site provides AI-powered informational tools and is
                    <strong> not a substitute for legal advice</strong> from a qualified professional. No attorney-client relationship is formed.
                </div>

                <div className="flex items-center justify-center space-x-3 mb-8">
                    <input
                        type="checkbox"
                        id="consent-checkbox"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-amber-400 focus:ring-amber-500 bg-slate-700"
                    />
                    <label htmlFor="consent-checkbox" className="text-sm text-gray-300">
                        I have read, understood, and agree to the Terms and Privacy Policy.
                    </label>
                </div>

                <button
                    onClick={onAccept}
                    disabled={!isChecked}
                    className="w-full bg-amber-400 text-black font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed motion-safe:enabled:hover:scale-105 motion-safe:enabled:active:scale-95"
                    aria-disabled={!isChecked}
                >
                    Agree and Continue
                </button>
            </div>
        </div>
    );
};

export default ConsentModal;