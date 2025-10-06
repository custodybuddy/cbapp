
import React from 'react';

const MicOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <line x1="2" x2="22" y1="2" y2="22"/>
        <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/>
        <path d="M5 10v2a7 7 0 0 0 12 5"/>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 .84 2.16"/>
        <path d="M15.06 15.06a3 3 0 0 0 2.19-2.19"/>
        <line x1="12" x2="12" y1="19" y2="22"/>
    </svg>
);

export default MicOffIcon;
