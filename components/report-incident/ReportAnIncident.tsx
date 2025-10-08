import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useIncidentReportState, useIncidentReportActions } from '../../hooks/useIncidentReporter';
import ReportResult from './ReportResult';
import AlertTriangleIcon from '../icons/AlertTriangleIcon';
import XIcon from '../icons/XIcon';
import RotateCwIcon from '../icons/RotateCwIcon';
import CornerDownLeftIcon from '../icons/CornerDownLeftIcon';

const predefinedParties = [
    'Ex-spouse/Co-parent',
    'Their current partner',
    'Grandparent',
    'Other family member',
    'Police/First Responder',
    'Witness',
];

const predefinedChildren = ['Child A', 'Child B', 'Child C'];

const ReportAnIncident: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    const { incidentData, isLoading, error, reportResponse } = useIncidentReportState();
    const { setIncidentData, handleGenerateReport, reset, setError } = useIncidentReportActions();
    
    // Local state for dynamic list management
    const [customPartyInput, setCustomPartyInput] = useState('');
    const [childInput, setChildInput] = useState('');
    const [customParties, setCustomParties] = useState<string[]>([]);
    const [children, setChildren] = useState<string[]>([]);

    // Reset state when the modal is closed
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                reset();
                setCustomParties([]);
                setChildren([]);
            }, 300);
        }
    }, [isOpen, reset]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setIncidentData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleCheckboxToggle = (
        listName: 'otherPartiesInvolved' | 'childrenPresent',
        item: string,
        isChecked: boolean
    ) => {
        setIncidentData(prev => {
            const currentList = prev[listName];
            const newList = isChecked
                ? [...currentList, item]
                : currentList.filter(i => i !== item);
            return { ...prev, [listName]: newList };
        });
    };

    const handleAddCustomParty = () => {
        const newParty = customPartyInput.trim();
        if (newParty && ![...predefinedParties, ...customParties].includes(newParty)) {
            setCustomParties(prev => [...prev, newParty]);
            handleCheckboxToggle('otherPartiesInvolved', newParty, true); // Auto-select new party
            setCustomPartyInput('');
        }
    };
    
    const handleAddChild = () => {
        const newChild = childInput.trim();
        if (newChild && ![...predefinedChildren, ...children].includes(newChild)) {
            setChildren(prev => [...prev, newChild]);
            handleCheckboxToggle('childrenPresent', newChild, true); // Auto-select new child
            setChildInput('');
        }
    };
    
    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>, action: 'addParty' | 'addChild') => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (action === 'addParty') handleAddCustomParty();
            if (action === 'addChild') handleAddChild();
        }
    };
    
    const handleRemoveCustomParty = (partyToRemove: string) => {
        setCustomParties(prev => prev.filter(p => p !== partyToRemove));
        handleCheckboxToggle('otherPartiesInvolved', partyToRemove, false);
    };

    const handleRemoveChild = (childToRemove: string) => {
        setChildren(prev => prev.filter(c => c !== childToRemove));
        handleCheckboxToggle('childrenPresent', childToRemove, false);
    };


    const isGenerateButtonDisabled = isLoading || !incidentData.narrative.trim() || !incidentData.jurisdiction.trim() || !incidentData.incidentDate || incidentData.otherPartiesInvolved.length === 0;

    if (reportResponse) {
        return <ReportResult />;
    }
    
    const renderCheckbox = (label: string, listName: 'otherPartiesInvolved' | 'childrenPresent', onRemove?: () => void) => {
        const id = `${listName}-${label.replace(/\s+/g, '-')}`;
        const isChecked = incidentData[listName].includes(label);
        return (
            <div key={id} className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm transition-all duration-200 has-[:checked]:bg-amber-400/10 has-[:checked]:border-amber-400/50">
                <label htmlFor={id} className="flex-grow cursor-pointer text-gray-300 has-[:checked]:text-amber-300">
                    <input
                        id={id}
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => handleCheckboxToggle(listName, label, e.target.checked)}
                        className="mr-2 h-4 w-4 rounded border-gray-400 bg-slate-700 text-amber-400 focus:ring-amber-500 cursor-pointer"
                        disabled={isLoading}
                    />
                    {label}
                </label>
                {onRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-gray-500 hover:text-white transition-colors ml-2"
                        aria-label={`Remove ${label}`}
                        disabled={isLoading}
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
        );
    };


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
                            max={new Date().toISOString().split("T")[0]}
                        />
                    </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Other Parties Involved */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-300">Other Parties Involved<span className="text-red-400 ml-1">*</span></label>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {predefinedParties.map(party => renderCheckbox(party, 'otherPartiesInvolved'))}
                            {customParties.map(party => renderCheckbox(party, 'otherPartiesInvolved', () => handleRemoveCustomParty(party)))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customPartyInput}
                                onChange={e => setCustomPartyInput(e.target.value)}
                                onKeyDown={e => handleInputKeyDown(e, 'addParty')}
                                placeholder="Add another party..."
                                className="flex-grow w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none text-sm"
                                disabled={isLoading}
                            />
                            <button type="button" onClick={handleAddCustomParty} disabled={isLoading} className="flex-shrink-0 bg-amber-400 text-black p-2 rounded-lg hover:bg-amber-300 disabled:opacity-50">
                                <CornerDownLeftIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Children Present/Affected */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-300">Children Present/Affected</label>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {predefinedChildren.map(child => renderCheckbox(child, 'childrenPresent'))}
                            {children.map(child => renderCheckbox(child, 'childrenPresent', () => handleRemoveChild(child)))}
                        </div>
                         <div className="flex gap-2">
                            <input
                                type="text"
                                value={childInput}
                                onChange={e => setChildInput(e.target.value)}
                                onKeyDown={e => handleInputKeyDown(e, 'addChild')}
                                placeholder="Add another child..."
                                className="flex-grow w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none text-sm"
                                disabled={isLoading}
                            />
                            <button type="button" onClick={handleAddChild} disabled={isLoading} className="flex-shrink-0 bg-amber-400 text-black p-2 rounded-lg hover:bg-amber-300 disabled:opacity-50">
                                <CornerDownLeftIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>


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