import React from 'react';

const ThumbsUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M7 10v12" />
        <path d="M18 10V4a2 2 0 0 0-2-2H8.5a5.5 5.5 0 0 0-5.4 6.5L4 18h12a2 2 0 0 0 2-2v-4Z" />
    </svg>
);

export default ThumbsUpIcon;