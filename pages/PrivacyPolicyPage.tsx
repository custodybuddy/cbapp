import React from 'react';
import PrivacyPolicy from '../components/PrivacyPolicy';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="pt-24 md:pt-40 pb-20">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-slate-800 rounded-2xl shadow-xl p-6 md:p-10">
                    <h1 className="text-4xl font-extrabold mb-6 text-amber-400">Privacy Policy</h1>
                    <PrivacyPolicy />
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
