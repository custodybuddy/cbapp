import React from 'react';

const TypingIndicator: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`flex items-end space-x-1 ${className || ''}`}>
        <span className="typing-dot h-1.5 w-1.5"></span>
        <span className="typing-dot h-1.5 w-1.5" style={{ animationDelay: '0.2s' }}></span>
        <span className="typing-dot h-1.5 w-1.5" style={{ animationDelay: '0.4s' }}></span>
    </div>
);

export default TypingIndicator;
