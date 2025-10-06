import React from 'react';
import { getFormattedDate } from '../utils/dateUtils';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

const TermsOfUse: React.FC = () => {
    return (
        <div className="text-gray-300 text-sm leading-relaxed space-y-4 prose prose-invert prose-p:my-2 prose-ul:my-2 prose-strong:text-amber-400 max-w-none">
            <p><strong>Last Updated:</strong> {getFormattedDate()}</p>

            <p>
                These Terms of Use ("Terms") govern your access to and use of the CustodyBuddy.com website and its associated AI-powered tools (the "Service"). Please read these Terms carefully. By using the Service, you agree to be bound by these Terms.
            </p>

            <div className="p-4 my-6 bg-red-900/30 border-2 border-red-500/70 rounded-lg shadow-lg shadow-red-900/20">
                <h3 className="text-red-400 font-bold mt-0 text-lg flex items-center gap-2">
                    <AlertTriangleIcon className="w-6 h-6 flex-shrink-0" />
                    IMPORTANT LEGAL DISCLAIMER: READ CAREFULLY
                </h3>
                <p className="font-bold text-red-300 mt-2">
                    This is the most important term you must understand. CustodyBuddy.com is an informational resource, NOT a law firm.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-red-200">
                    <li>The Service provides AI-generated information for educational purposes only. <strong>It is not legal advice.</strong></li>
                    <li><strong>Use of this Service does not create a lawyer-client relationship.</strong> The information you submit is not protected by attorney-client privilege.</li>
                    <li>Laws are complex and change frequently. Information may not be accurate for your specific situation.</li>
                    <li><strong>You MUST consult with a qualified, licensed lawyer in your jurisdiction</strong> for advice on your individual circumstances. Relying solely on this tool could be harmful to your case.</li>
                </ul>
            </div>
            

            <h3 className="text-amber-400 font-bold">1. Acceptance of Terms</h3>
            <p>
                By checking the "I Agree" box and using the Service, you confirm that you have read, understood, and agree to be bound by these Terms, including the Legal Disclaimer above. If you do not agree with these Terms, you must not use the Service.
            </p>

            <h3 className="text-amber-400 font-bold">2. Use of the Service</h3>
            <p>
                You agree to use the Service only for lawful purposes. You are responsible for any content you upload, paste, or otherwise provide to the Service. You agree not to:
            </p>
            <ul>
                <li>Use the service for any illegal purpose or in violation of any local, provincial, national, or international law.</li>
                <li>Upload or transmit any material that infringes on any third party's intellectual property or other proprietary rights.</li>
                <li>Attempt to reverse engineer, decompile, or otherwise discover the source code of the Service.</li>
            </ul>

            <h3 className="text-amber-400 font-bold">3. AI-Generated Content</h3>
            <p>
                The Service uses artificial intelligence to generate analyses, reports, and email drafts. You acknowledge that:
            </p>
            <ul>
                <li>AI-generated content may contain errors, inaccuracies, or omissions.</li>
                <li>You are solely responsible for reviewing, editing, and verifying any AI-generated content before relying on or using it in any capacity.</li>
                <li>We are not liable for any damages or losses arising from your use of or reliance on AI-generated content.</li>
            </ul>

            <h3 className="text-amber-400 font-bold">4. Intellectual Property</h3>
            <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of CustodyBuddy.com. You retain ownership of the content you submit to the service. By submitting content, you grant us a temporary, worldwide, non-exclusive, royalty-free license to use, process, and transmit that content solely for the purpose of providing the Service to you.
            </p>

            <h3 className="text-amber-400 font-bold">5. Disclaimer of Warranties</h3>
            <p>
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, that the service will be uninterrupted, error-free, or secure.
            </p>

            <h3 className="text-amber-400 font-bold">6. Limitation of Liability</h3>
            <p>
                In no event shall CustodyBuddy.com, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>

            <h3 className="text-amber-400 font-bold">7. Changes to Terms</h3>
            <p>
                We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>
            
            <h3 className="text-amber-400 font-bold">8. Governing Law</h3>
            <p>
                These Terms shall be governed and construed in accordance with the laws of the Province of Ontario, Canada, without regard to its conflict of law provisions.
            </p>
        </div>
    );
};

export default TermsOfUse;