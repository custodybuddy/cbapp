
import React from 'react';
import MessageCircleIcon from './icons/MessageCircleIcon';

interface LiveChatWidgetProps {
    onOpen: () => void;
}

const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ onOpen }) => {
    return (
        <div className="fixed bottom-6 right-6 z-40">
            <button
                onClick={onOpen}
                className="bg-amber-400 text-black rounded-full p-4 shadow-lg hover:bg-amber-300 transition-all duration-300 ease-out transform motion-safe:hover:scale-110 motion-safe:active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-label="Open AI Legal Assistant Chat"
            >
                <MessageCircleIcon />
            </button>
        </div>
    );
};

export default LiveChatWidget;
