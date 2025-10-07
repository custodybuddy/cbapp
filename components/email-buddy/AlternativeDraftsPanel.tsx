import React, { useState, useCallback } from 'react';
import DraftDisplay from './DraftDisplay';

interface AlternativeDraftsPanelProps {
    drafts: Partial<Record<"Grey Rock" | "Friendly Assertive", string>>;
}

type Tab = "Grey Rock" | "Friendly Assertive";

const AlternativeDraftsPanel: React.FC<AlternativeDraftsPanelProps> = ({ drafts }) => {
    const tabs: Tab[] = ["Grey Rock", "Friendly Assertive"];
    const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
        const currentIndex = tabs.indexOf(activeTab);
        let newIndex = currentIndex;

        if (event.key === 'ArrowRight') {
            newIndex = (currentIndex + 1) % tabs.length;
        } else if (event.key === 'ArrowLeft') {
            newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        }

        if (newIndex !== currentIndex) {
            const newTab = tabs[newIndex];
            setActiveTab(newTab);
            const tabId = `alt-draft-tab-${newTab.replace(/\s+/g, '-')}`;
            document.getElementById(tabId)?.focus();
        }
    }, [tabs, activeTab]);


    return (
        <div className="flex flex-col h-full">
            <h4 className="text-md font-bold text-gray-200 mb-2">Alternative Styles</h4>
            <div className="border-b border-slate-700 mb-2">
                <div role="tablist" aria-label="Alternative Draft Styles" className="-mb-px flex space-x-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            id={`alt-draft-tab-${tab.replace(/\s+/g, '-')}`}
                            role="tab"
                            aria-selected={activeTab === tab}
                            aria-controls={`alt-draft-panel-${tab.replace(/\s+/g, '-')}`}
                            tabIndex={activeTab === tab ? 0 : -1}
                            onClick={() => setActiveTab(tab)}
                            onKeyDown={handleKeyDown}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-t-md ${
                                activeTab === tab
                                    ? 'border-amber-400 text-amber-400'
                                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-grow">
                {tabs.map(tab => (
                    <div
                        key={tab}
                        id={`alt-draft-panel-${tab.replace(/\s+/g, '-')}`}
                        role="tabpanel"
                        tabIndex={0}
                        aria-labelledby={`alt-draft-tab-${tab.replace(/\s+/g, '-')}`}
                        className={`${activeTab === tab ? 'block' : 'hidden'} h-full focus:outline-none`}
                    >
                        <DraftDisplay
                            title={`${tab} Style`}
                            draft={drafts[tab] || "Draft not available."}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlternativeDraftsPanel;