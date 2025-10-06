import React from 'react';

// Icon inspired by a clipboard with a camera and an alert.
const CalendarCheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
        <circle cx="8" cy="16" r="2.5" />
        <path d="M10.5 16H7a2 2 0 0 0-2 2v1h9v-1a2 2 0 0 0-2-2h-1.5" />
        <circle cx="17" cy="9" r="3" />
        <line x1="17" y1="8" x2="17" y2="10" />
        <line x1="17" y1="11.5" x2="17.01" y2="11.5" />
    </svg>
);

export default CalendarCheckIcon;
