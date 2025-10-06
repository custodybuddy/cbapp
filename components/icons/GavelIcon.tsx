import React from 'react';

const GavelIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m14 13-7.5 7.5"/>
        <path d="m16 11 6 6"/>
        <path d="M15 3h2v2h-2z"/>
        <path d="m12 6 2-2h3v3l-2 2"/>
        <path d="m3 15 2-2h3v3l-2 2"/>
    </svg>
);

export default GavelIcon;