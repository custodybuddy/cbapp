import React, { useEffect } from 'react';
import { useIncidentReporter } from '../../hooks/useIncidentReporter';
import ReportResult from './ReportResult';
import AlertTriangleIcon from '../icons/AlertTriangleIcon';
import XIcon from '../icons/XIcon';
import RotateCwIcon from '../icons/RotateCwIcon';

const ReportAnIncident: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    const {
        incidentData,
        setIncidentData,
        isLoading,
        error,
        reportResponse,
        handleGenerateReport,
        reset,
        setError
    } = useIncidentReporter();

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => reset(), 300);
        }
    }, [isOpen, reset]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIncidentData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const isGenerateButtonDisabled = isLoading || !incidentData.narrative.trim() || !incidentData.jurisdiction.trim() || !incidentData.dateTime;

    if (reportResponse) {
        return <ReportResult response={reportResponse} originalData={incidentData} onStartOver={reset} />;
    }

    return (
        <div className="space-y-6">
            <p className="text-gray-400 text-sm">
                Document a specific event with precision. Describe what happened in your own words, and our AI will transform it into a professional, objective report formatted for legal review.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="dateTime" className="block text-sm font-medium text-gray-300 mb-1">Date & Time of Incident</label>
                    <input type="datetime-local" id="dateTime" name="dateTime" value={incidentData.dateTime} onChange={handleChange} className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none" disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                    <input type="text" id="location" name="location" value={incidentData.location} onChange={handleChange} placeholder="e.g., Exchange point, school" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none" disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="involvedParties" className="block text-sm font-medium text-gray-300 mb-1">Parties Involved</label>
                    <input type="text" id="involvedParties" name="involvedParties" value={incidentData.involvedParties} onChange={handleChange} placeholder="e.g., Myself, [Co-parent], Child(ren)" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none" disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-300 mb-1">Jurisdiction (Province/State)</label>
                    <input type="text" id="jurisdiction" name="jurisdiction" value={incidentData.jurisdiction} onChange={handleChange} placeholder="e.g., Ontario, Canada" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none" disabled={isLoading} />
                </div>
            </div>

            <div>
                <label htmlFor="narrative" className="block text-sm font-medium text-gray-300 mb-1">Narrative of Incident</label>
                <textarea id="narrative" name="narrative" value={incidentData.narrative} onChange={handleChange} placeholder="Describe what happened in detail. Include who was present, what was said, and what actions were taken." rows={6} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none" disabled={isLoading}></textarea>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-400 text-sm rounded-lg p-3 flex items-center gap-3 animate-fade-in-up-fast" role="alert">
                    <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
                    <p className="flex-grow">{error}</p>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-white" aria-label="Dismiss error message"><XIcon className="w-5 h-5" /></button>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-slate-700">
                <button
                    onClick={reset}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RotateCwIcon className="w-4 h-4" />
                    Clear Form
                </button>
                <button
                    onClick={handleGenerateReport}
                    disabled={isGenerateButtonDisabled}
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-amber-400 text-black font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 ease-out motion-safe:hover:scale-105 motion-safe:active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <><svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating Report...</>
                    ) : 'Generate Professional Report'}
                </button>
            </div>
        </div>
    );
};

export default ReportAnIncident;