import React from 'react';

// Icon inspired by a law book with scales and a magnifying glass.
const SwordsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2H6.5A2.5 2.5 0 0 1 4 17Z"/>
        <path d="M4 6V4.5A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 15V6Z"/>
        <path d="M12 6V5"/>
        <path d="M12 10V6"/>
        <path d="M14 7h-4"/>
        <path d="M10 10a2 2 0 1 0-4 0c0 1.1.9 2 2 2"/>
        <path d="M14 10a2 2 0 1 0 4 0c0 1.1-.9 2-2 2"/>
        <circle cx="16" cy="15" r="3"/>
        <path d="m18 17 2 2"/>
    </svg>
);

export default SwordsIcon;
