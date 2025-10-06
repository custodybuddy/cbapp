
import React, { useState, useEffect } from 'react';
import { emailTemplates, EmailTemplate } from '../constants';
import ClipboardIcon from './icons/ClipboardIcon';
import ClipboardCheckIcon from './icons/ClipboardCheckIcon';

const categories = Array.from(new Set(emailTemplates.map(t => t.category)));

const TemplateLibrary: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
    const [editedContent, setEditedContent] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setSelectedTemplate(null);
                setEditedContent('');
                setIsCopied(false);
            }, 300); // allow for closing animation
        }
    }, [isOpen]);
    
    // Copy to clipboard effect
    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => setIsCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    const handleSelectTemplate = (template: EmailTemplate) => {
        setSelectedTemplate(template);
        setEditedContent(template.body);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(editedContent);
        setIsCopied(true);
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 h-[60vh]">
            {/* Sidebar with Template List */}
            <aside className="w-full md:w-1/3 border-r border-slate-700 pr-4 overflow-y-auto">
                <h3 className="text-lg font-bold text-gray-200 mb-4">Template Categories</h3>
                {categories.map(category => (
                    <div key={category} className="mb-4">
                        <h4 className="font-semibold text-amber-400 mb-2">{category}</h4>
                        <ul className="space-y-1">
                            {emailTemplates.filter(t => t.category === category).map(template => (
                                <li key={template.title}>
                                    <button 
                                        onClick={() => handleSelectTemplate(template)}
                                        className={`w-full text-left text-sm p-2 rounded-md transition-colors ${selectedTemplate?.title === template.title ? 'bg-amber-400/20 text-amber-300' : 'text-gray-300 hover:bg-slate-700'}`}
                                    >
                                        {template.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </aside>

            {/* Main Content Area */}
            <main className="w-full md:w-2/3 flex flex-col">
                {selectedTemplate ? (
                    <div className="flex-grow flex flex-col animate-fade-in">
                        <div className="mb-4">
                            <h3 id="template-title" className="text-xl font-bold text-gray-100">{selectedTemplate.title}</h3>
                            <p id="template-description" className="text-sm text-gray-400 mt-1">{selectedTemplate.description}</p>
                        </div>
                        <div className="flex-grow relative">
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full h-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none transition-shadow duration-200 resize-none"
                                aria-labelledby="template-title template-description"
                            />
                        </div>
                        <div className="mt-4 text-right">
                            <button
                                onClick={handleCopy}
                                className="inline-flex items-center gap-2 bg-amber-400 text-black font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-200 ease-out motion-safe:hover:scale-105 motion-safe:active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                            >
                                {isCopied ? <ClipboardCheckIcon /> : <ClipboardIcon />}
                                {isCopied ? 'Copied!' : 'Copy to Clipboard'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-gray-500">
                        <div>
                            <p className="font-semibold">Select a template from the list to view and edit it here.</p>
                            <p className="text-sm mt-1">These templates are designed to be professional, factual, and court-ready.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TemplateLibrary;