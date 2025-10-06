import React from 'react';
import { getFormattedDate } from '../utils/dateUtils';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="text-gray-300 text-sm leading-relaxed space-y-4 prose prose-invert prose-p:my-2 prose-ul:my-2 prose-strong:text-amber-400 max-w-none">
            <p><strong>Last Updated:</strong> {getFormattedDate()}</p>

            <p>
                Welcome to CustodyBuddy.com ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we handle and protect your information when you use our website and AI-powered tools (collectively, the "Service").
            </p>

            <h3 className="text-amber-400 font-bold">1. Information We Do NOT Store</h3>
            <p>
                Your privacy and the sensitivity of your situation are our highest priority. We have designed our core AI tools to be stateless. This means:
            </p>
            <ul>
                <li>
                    <strong>We do not store the content of documents you upload, text you paste, or incident narratives you write.</strong> This information is processed in real-time to provide you with an AI-generated analysis or report and is then discarded from our systems. It is not saved to our servers or any database.
                </li>
                 <li>
                    <strong>We do not store the audio from your conversations with the AI Legal Assistant.</strong> Your voice data is streamed for real-time processing and transcription, but the audio itself is not retained by us.
                </li>
            </ul>

            <h3 className="text-amber-400 font-bold">2. Information We Collect</h3>
            <p>
                We collect a limited amount of information solely to operate and improve the Service:
            </p>
            <ul>
                <li>
                    <strong>Usage Data:</strong> We may collect anonymous data about your interactions with the Service, such as which features are used and the frequency of use. This helps us understand what is most valuable to our users and where we can improve.
                </li>
                <li>
                    <strong>Feedback Data:</strong> If you voluntarily provide feedback (e.g., thumbs up/down), we collect this anonymous response to help improve the performance and accuracy of our AI models.
                </li>
                <li>
                    <strong>Technical Data:</strong> Like most websites, we may collect anonymous technical information, such as browser type and operating system, to ensure our Service functions correctly across different platforms.
                </li>
            </ul>

            <h3 className="text-amber-400 font-bold">3. How We Use Third-Party AI Services</h3>
            <p>
                To provide our powerful AI features, we send the content you provide (documents, text, audio) to a third-party AI service provider (Google Gemini API).
            </p>
            <ul>
                <li>
                    This data is sent securely for the sole purpose of generating the analysis, draft, report, or response you requested.
                </li>
                <li>
                    Our AI provider is contractually obligated to handle this data under strict privacy and security terms. Per their policies, they do not use your content to train their models or share it with others.
                </li>
                <li>
                    We do not send any personally identifiable information about you (like a name or email address, unless you include it in the content you submit) along with your request to the AI service.
                </li>
            </ul>

            <h3 className="text-amber-400 font-bold">4. Data Security</h3>
            <p>
                We use standard technical and administrative security measures to protect the information we handle. All data is encrypted in transit between your browser, our servers, and our AI service provider using TLS/SSL.
            </p>

            <h3 className="text-amber-400 font-bold">5. Third-Party Links</h3>
            <p>
                Our Service may contain links to other websites, such as Amazon for recommended books or provincial legal aid sites. This Privacy Policy does not apply to those third-party sites. We encourage you to review their privacy policies.
            </p>

            <h3 className="text-amber-400 font-bold">6. Children's Privacy</h3>
            <p>
                Our Service is not intended for use by individuals under the age of 18. We do not knowingly collect any information from children.
            </p>

            <h3 className="text-amber-400 font-bold">7. Changes to This Privacy Policy</h3>
            <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h3 className="text-amber-400 font-bold">8. Contact Us</h3>
            <p>
                If you have any questions about this Privacy Policy, please contact us through the contact information provided on our website.
            </p>
        </div>
    );
};

export default PrivacyPolicy;