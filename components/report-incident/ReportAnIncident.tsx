import React, { useEffect } from 'react';
// FIX: The `useIncidentReport...` hooks are exported from the hook file, not the context file.
import { useIncidentReportState, useIncidentReportActions } from '../../hooks/useIncidentReporter';
import { IncidentCategory } from '../../contexts/IncidentReportContext';
import ReportResult from './ReportResult';
import TagInput from './TagInput';
import AlertTriangleIcon from '../icons/AlertTriangleIcon';
import XIcon from '../icons/XIcon';
import RotateCwIcon from '../icons/RotateCwIcon';

const incidentCategories: IncidentCategory[] = [
    'Communication Issue',
    'Schedule Violation',
    'Financial Dispute',
    'Child Safety Concern',
    'Parental Alienation',
    'Legal/Court Matter',
    'Other'
];

const ReportAnIncident: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    const { incidentData, isLoading, error, reportResponse } = useIncidentReportState();
    // Fix: Add setError to actions to allow dismissing error messages.
    const { setIncidentData, handleGenerateReport, reset, setError } = useIncidentReportActions();

    // Reset state when the modal is closed
    useEffect(() => {
        if (!isOpen) {
            // Delay reset to allow for closing animation
            setTimeout(() => {
                reset();
            }, 300);
        }
    }, [isOpen, reset]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setIncidentData(prev => ({ ...prev, [name]: value }));
        if (error) {
            setError(null);
        }
    };

    const handleTagsChange = (newTags: string[]) => {
        setIncidentData(prev => ({ ...prev, peopleInvolved: newTags }));
    };

    const isGenerateButtonDisabled = isLoading || !incidentData.narrative.trim() || !incidentData.jurisdiction.trim() || !incidentData.incidentDate;

    if (reportResponse) {
        return <ReportResult />;
    }

    return (
        <div className="space-y-6">
            <p className="text-gray-400 text-sm">
                Document what happened in your own words. Our AI will analyze your narrative and transform it into a professional, objective, and court-ready report.
            </p>
            
            <form onSubmit={(e) => { e.preventDefault(); handleGenerateReport(); }} noValidate className="space-y-4">
                 <div>
                    <label htmlFor="narrative" className="block text-sm font-medium text-gray-300 mb-1">Incident Narrative<span aria-hidden="true" className="text-red-400 ml-1">*</span></label>
                    <textarea
                        id="narrative"
                        name="narrative"
                        value={incidentData.narrative}
                        onChange={handleChange}
                        placeholder="Describe the incident in detail. Include who, what, when, where, and why. Be as specific as possible."
                        rows={6}
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none transition-shadow duration-200 disabled:opacity-50"
                        disabled={isLoading}
                        required
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="jurisdiction-incident" className="block text-sm font-medium text-gray-300 mb-1">Jurisdiction (Province/State)<span aria-hidden="true" className="text-red-400 ml-1">*</span></label>
                        <input
                            type="text"
                            id="jurisdiction-incident"
                            name="jurisdiction"
                            value={incidentData.jurisdiction}
                            onChange={handleChange}
                            placeholder="e.g., Ontario, Canada"
                            className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
                            disabled={isLoading}
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-300 mb-1">Date of Incident<span aria-hidden="true" className="text-red-400 ml-1">*</span></label>
                        <input
                            type="date"
                            id="incidentDate"
                            name="incidentDate"
                            value={incidentData.incidentDate}
                            onChange={handleChange}
                            className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
                            disabled={isLoading}
                            required
                            max={new Date().toISOString().split("T")[0]} // Prevent future dates
                        />
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={incidentData.category}
                            onChange={handleChange}
                            className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
                            disabled={isLoading}
                        >
                            {incidentCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={incidentData.location}
                            onChange={handleChange}
                            placeholder="e.g., Exchange point, via email"
                            className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
                            disabled={isLoading}
                        />
                    </div>
                 </div>

                <TagInput
                    tags={incidentData.peopleInvolved}
                    setTags={handleTagsChange}
                    label="People Involved"
                    id="peopleInvolved"
                    placeholder="Add name and press Enter..."
                    disabled={isLoading}
                />

                {error && (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-400 text-sm rounded-lg p-3 flex items-center gap-3 animate-fade-in-up-fast" role="alert">
                        <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
                        <p className="flex-grow">{error}</p>
                        <button type="button" onClick={() => setError(null)} className="text-red-400 hover:text-white" aria-label="Dismiss error message"><XIcon className="w-5 h-5" /></button>
                    </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-slate-700">
                     <button
                        type="button"
                        onClick={() => reset()}
                        disabled={isLoading}
                        className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RotateCwIcon className="w-4 h-4" />
                        Reset Form
                    </button>
                    <button
                        type="submit"
                        disabled={isGenerateButtonDisabled}
                        className="w-full sm:w-auto inline-flex items-center justify-center bg-amber-400 text-black font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 ease-out motion-safe:hover:scale-105 motion-safe:active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Generating Report...
                            </>
                        ) : 'Generate Report'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReportAnIncident;