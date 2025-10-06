import React from 'react';
import TemplateLibrary from '../components/TemplateLibrary';

const TemplateLibraryPage: React.FC = () => {
    return (
        <div className="pt-24 md:pt-40 pb-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                     <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-amber-400">Email Template Library</h1>
                     <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                        Use these court-ready templates to communicate clearly and effectively. Edit them to fit your specific situation.
                     </p>
                </div>
                <div className="bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
                     <TemplateLibrary isOpen={true} />
                </div>
            </div>
        </div>
    );
};

export default TemplateLibraryPage;
