// Implemented the `ChatUI` component to render the user interface for the live voice chat.
import React, { useRef, useEffect } from 'react';
import { LiveChatHook, TranscriptEntry } from '../../hooks/useLiveChat';
import { Persona } from '../../prompts';
import PersonaMenu from './PersonaMenu';
import TypingIndicator from './TypingIndicator';
import XIcon from '../icons/XIcon';
import MicIcon from '../icons/MicIcon';
import MicOffIcon from '../icons/MicOffIcon';
import UsersIcon from '../icons/UsersIcon';
import SpinnerIcon from '../icons/SpinnerIcon';
import AlertTriangleIcon from '../icons/AlertTriangleIcon';

interface ChatUIProps {
    liveChat: LiveChatHook;
    onClose: () => void;
    selectedPersona: Persona;
    isPersonaMenuOpen: boolean;
    onTogglePersonaMenu: () => void;
    onSelectPersona: (persona: Persona) => void;
    personaMenuRef: React.RefObject<HTMLDivElement>;
}

const ChatMessage: React.FC<{ entry: TranscriptEntry }> = React.memo(({ entry }) => (
    <div className={`flex gap-3 my-4 ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
        {entry.speaker === 'model' && (
            <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center flex-shrink-0">
                <UsersIcon />
            </div>
        )}
        <div className={`p-3 rounded-lg max-w-sm md:max-w-md ${entry.speaker === 'user' ? 'bg-amber-500 text-black' : 'bg-slate-700 text-white'}`}>
            <p className="text-sm">{entry.text}</p>
        </div>
    </div>
));


const ChatUI: React.FC<ChatUIProps> = ({
    liveChat,
    onClose,
    selectedPersona,
    isPersonaMenuOpen,
    onTogglePersonaMenu,
    onSelectPersona,
    personaMenuRef
}) => {
    const {
        isRecording,
        isConnecting,
        isSessionActive,
        error,
        transcriptHistory,
        currentInterimTranscript,
        currentModelTranscript,
        toggleRecording,
    } = liveChat;

    const scrollRef = useRef<HTMLDivElement>(null);

    // Determine if the AI is 'thinking' (i.e., user has spoken, AI has not yet replied)
    const isModelThinking = isRecording &&
                            !currentInterimTranscript &&
                            !currentModelTranscript &&
                            transcriptHistory.length > 0 &&
                            transcriptHistory[transcriptHistory.length - 1].speaker === 'user';

    // Auto-scroll to bottom on new content
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [transcriptHistory, currentInterimTranscript, currentModelTranscript, isModelThinking]);

    const getMicButtonStatus = () => {
        if (isConnecting) return "Connecting...";
        if (!isSessionActive && !isRecording) return "Tap to speak";
        if (isRecording) return "Listening...";
        return "Session ended";
    };

    return (
        <>
            <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                <div className="flex flex-col">
                    <h2 id="chat-modal-title" className="text-lg font-bold text-amber-400">AI Legal Assistant</h2>
                    <div className="relative" ref={personaMenuRef}>
                        <button 
                            onClick={onTogglePersonaMenu} 
                            className="text-xs text-gray-400 hover:text-white transition-colors"
                            aria-haspopup="true"
                            aria-expanded={isPersonaMenuOpen}
                        >
                            Persona: {selectedPersona} ▼
                        </button>
                        <PersonaMenu
                            isOpen={isPersonaMenuOpen}
                            selectedPersona={selectedPersona}
                            onSelectPersona={onSelectPersona}
                        />
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-all duration-200 ease-out transform motion-safe:hover:scale-110 motion-safe:active:scale-95"
                    aria-label="Close chat"
                >
                    <XIcon />
                </button>
            </header>

            <main ref={scrollRef} className="flex-grow p-4 overflow-y-auto">
                {transcriptHistory.map((entry, index) => (
                    <ChatMessage key={index} entry={entry} />
                ))}

                {/* User's in-progress message */}
                {currentInterimTranscript && (
                    <div className="flex gap-3 my-4 justify-end">
                        <div className="p-3 rounded-lg max-w-sm md:max-w-md bg-amber-500 text-black">
                            <p className="text-sm">{currentInterimTranscript}</p>
                        </div>
                    </div>
                )}
                
                {/* AI is thinking indicator */}
                {isModelThinking && (
                    <div className="flex gap-3 my-4 justify-start">
                        <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center flex-shrink-0">
                            <UsersIcon />
                        </div>
                        <div className="p-3 rounded-lg max-w-sm md:max-w-md bg-slate-700 text-white flex items-center">
                            <TypingIndicator className="text-gray-400" />
                        </div>
                    </div>
                )}

                {/* AI's in-progress message */}
                {currentModelTranscript && (
                    <div className="flex gap-3 my-4 justify-start">
                         <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center flex-shrink-0">
                            <UsersIcon />
                        </div>
                        <div className="p-3 rounded-lg max-w-sm md:max-w-md bg-slate-700 text-white">
                            <p className="text-sm">{currentModelTranscript}</p>
                        </div>
                    </div>
                )}

                {!isSessionActive && transcriptHistory.length === 0 && !isConnecting && !error && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                        <UsersIcon />
                        <p className="mt-2 font-semibold">Ready to assist</p>
                        <p className="text-sm">Click the microphone to start the conversation.</p>
                    </div>
                )}
            </main>

            {error && (
                 <div className="flex-shrink-0 m-4 bg-red-900/20 border border-red-500/50 text-red-400 text-sm rounded-lg p-3 flex items-start gap-3" role="alert">
                    <AlertTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="flex-grow">{error}</p>
                </div>
            )}
            
            <footer className="flex-shrink-0 p-4 text-center border-t border-slate-700">
                <button
                    onClick={toggleRecording}
                    disabled={isConnecting}
                    className={`relative w-16 h-16 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center
                        ${isRecording ? 'bg-red-500 hover:bg-red-600 focus:ring-red-400' : 'bg-amber-400 hover:bg-amber-300 focus:ring-amber-500'}`}
                    aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                >
                    {isConnecting ? (
                        <SpinnerIcon className="w-8 h-8 text-black" />
                    ) : isRecording ? (
                        <MicIcon className="w-8 h-8 text-white" />
                    ) : (
                        <MicOffIcon className="w-8 h-8 text-black" />
                    )}
                </button>
                <p className="text-xs text-gray-400 mt-2 h-4">{getMicButtonStatus()}</p>
            </footer>
        </>
    );
};

export default ChatUI;