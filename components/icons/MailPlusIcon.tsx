import React from 'react';

// Icon inspired by an envelope with a warning triangle.
const MailPlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9"/>
        <path d="m22 6-10 7L2 6"/>
        <path d="M15.73 17.03 19 12l3.27 5.03a1 1 0 0 1-.77 1.5H16.5a1 1 0 0 1-.77-1.5z"/>
        <path d="M19 14v1"/>
        <path d="M19 17h.01"/>
    </svg>
);

export default MailPlusIcon;
