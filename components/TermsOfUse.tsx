import React from 'react';
import { getFormattedDate } from '../utils/dateUtils';

const TermsOfUse: React.FC = () => {
    return (
        <div className="text-gray-300 text-sm leading-relaxed space-y-4 prose prose-invert prose-p:my-2 prose-ul:my-2 prose-strong:text-amber-400 max-w-none">
            <p><strong>Last Updated:</strong> {getFormattedDate()}</p>

            <p>
                These Terms of Use ("Terms") govern your access to and use of the CustodyBuddy.com website and its associated AI-powered tools (the "Service"). Please read these Terms carefully. By using the Service, you agree to be bound by these Terms.
            </p>

            <div className="p-4 bg-amber-900/20 border border-amber-500/50 rounded-lg">
                <h3 className="text-amber-400 font-bold mt-0">1. NO LEGAL ADVICE & NO LAWYER-CLIENT RELATIONSHIP</h3>
                <p className="font-bold">
                    This is the most important term. CustodyBuddy.com is a legal information tool, NOT a law firm.
                </p>
                <ul>
                    <li>The Service provides AI-generated information for educational and organizational purposes only. It is not a substitute for advice from a qualified legal professional.</li>
                    <li><strong>Use of the Service does not create a lawyer-client relationship between you and CustodyBuddy.com or any of its employees or affiliates.</strong></li>
                    <li>Laws vary by jurisdiction and are subject to change and interpretation. You are solely responsible for the accuracy and appropriateness of any information you use from the Service for your specific situation.</li>
                    <li>You should consult with a licensed lawyer in your jurisdiction for advice on your specific legal issues.</li>
                </ul>
            </div>
            

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