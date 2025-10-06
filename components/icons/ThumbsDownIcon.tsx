import React from 'react';

const ThumbsDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 14V2" />
        <path d="M6 14v8a2 2 0 0 0 2 2h6.5a5.5 5.5 0 0 0 5.4-6.5L20 6H8a2 2 0 0 0-2 2v6Z" />
    </svg>
);

export default ThumbsDownIcon;