import React, { useState, useEffect, useCallback } from 'react';
import { formatMarkdown } from '../../utils/markdownParser';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { cleanEmailForSpeech } from '../../utils/stringUtils';
import Feedback from '../Feedback';
import ClipboardIcon from '../icons/ClipboardIcon';
import ClipboardCheckIcon from '../icons/ClipboardCheckIcon';
import SpeakerIcon from '../icons/SpeakerIcon';
import StopCircleIcon from '../icons/StopCircleIcon';
import PauseIcon from '../icons/PauseIcon';
import PencilIcon from '../icons/PencilIcon';

interface DraftDisplayProps {
    title: string;
    draft: string;
}

const DraftDisplay: React.FC<DraftDisplayProps> = ({ title, draft }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDraft, setEditedDraft] = useState(draft);
    
    const { isSpeaking, isPaused, speak, cancel, pause, resume } = useTextToSpeech();

    useEffect(() => {
        setEditedDraft(draft);
        setIsEditing(false);
        cancel(); // Stop speech if a new draft is selected
    }, [draft, cancel]);

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => setIsCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(editedDraft);
        setIsCopied(true);
    }, [editedDraft]);

    const handlePlayPause = useCallback(() => {
        if (!isSpeaking) {
            speak(cleanEmailForSpeech(editedDraft));
        } else if (isPaused) {
            resume();
        } else {
            pause();
        }
    }, [isSpeaking, isPaused, editedDraft, speak, pause, resume]);

    const handleStop = useCallback(() => {
        cancel();
    }, [cancel]);
    
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
                <h4 className="text-md font-bold text-amber-400">{title}</h4>
                <div className="flex items-center gap-1">
                    <button onClick={handleEditToggle} className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1 px-2 rounded-md transition-all text-xs">
                        <PencilIcon className="w-3 h-3" />
                        <span>{isEditing ? 'Save' : 'Edit'}</span>
                    </button>
                    <button onClick={handleCopy} className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1 px-2 rounded-md transition-all text-xs">
                        {isCopied ? <ClipboardCheckIcon /> : <ClipboardIcon />}
                        <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                    </button>
                </div>
            </div>
            
            <div className="flex-grow mb-2">
                {isEditing ? (
                    <textarea
                        value={editedDraft}
                        onChange={(e) => setEditedDraft(e.target.value)}
                        className="w-full h-full min-h-[200px] p-2 bg-slate-950 border border-amber-400 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none text-sm text-gray-300"
                        aria-label="Edit draft email"
                    />
                ) : (
                    <div
                        className="text-gray-300 leading-relaxed prose prose-invert prose-p:my-2 prose-strong:text-amber-400 max-w-none text-sm"
                        dangerouslySetInnerHTML={{ __html: formatMarkdown(editedDraft) }}
                    />
                )}
            </div>

            <div className="flex flex-col gap-2 mt-auto">
                 <div className="flex items-center gap-2">
                    <button
                        onClick={handlePlayPause}
                        className="flex-grow flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-3 rounded-lg transition-all text-sm"
                        aria-label={!isSpeaking ? "Read draft aloud" : isPaused ? "Resume reading" : "Pause reading"}
                    >
                        {!isSpeaking || isPaused ? <SpeakerIcon className="w-4 h-4" /> : <PauseIcon className="w-4 h-4" />}
                        <span>{!isSpeaking ? 'Read Aloud' : isPaused ? 'Resume' : 'Pause'}</span>
                    </button>
                    {isSpeaking && (
                        <button onClick={handleStop} className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all" aria-label="Stop reading">
                            <StopCircleIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <Feedback />
            </div>
        </div>
    );
};

export default DraftDisplay;