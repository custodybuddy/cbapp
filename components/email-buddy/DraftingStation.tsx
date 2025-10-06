import React, { useState, useEffect } from 'react';
import ClipboardIcon from '../icons/ClipboardIcon';
import ClipboardCheckIcon from '../icons/ClipboardCheckIcon';
import AlertTriangleIcon from '../icons/AlertTriangleIcon';
import XIcon from '../icons/XIcon';
import SpeakerIcon from '../icons/SpeakerIcon';
import StopCircleIcon from '../icons/StopCircleIcon';
import { formatMarkdown } from '../../utils/markdownParser';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { useEmailBuddy, ToneOption } from '../../hooks/useEmailBuddy';
import Feedback from '../Feedback';
import { cleanEmailForSpeech } from '../../utils/stringUtils';
import PauseIcon from '../icons/PauseIcon';

const toneOptions: { tone: ToneOption, recommended: boolean }[] = [
    { tone: 'BIFF', recommended: true },
    { tone: 'Grey Rock', recommended: true },
    { tone: 'Friendly Assertive', recommended: true },
    { tone: 'Professional (for Lawyers)', recommended: true },
    { tone: 'Passive', recommended: false },
    { tone: 'Passive-Aggressive', recommended: false },
    { tone: 'Aggressive', recommended: false },
];

const recommendedTones = toneOptions.filter(t => t.recommended);
const otherTones = toneOptions.filter(t => !t.recommended);


const DraftingStation: React.FC = () => {
    const {
        keyPoints,
        setKeyPoints,
        drafts,
        activeDraftTone,
        isLoadingDraft,
        error,
        setError,
        handleGenerateDraft,
    } = useEmailBuddy();

    const [isCopied, setIsCopied] = useState(false);
    const [speakingDraft, setSpeakingDraft] = useState<ToneOption | null>(null);

    const { isSpeaking, isPaused, speak, cancel, pause, resume } = useTextToSpeech({
        onEnd: () => setSpeakingDraft(null)
    });

    useEffect(() => {
        return () => cancel(); // Stop speech when component unmounts/re-renders
    }, [cancel]);

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => setIsCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    const handleCopy = (text: string) => {
        if (text) {
            navigator.clipboard.writeText(text);
            setIsCopied(true);
        }
    };

    const handlePlayPause = (tone: ToneOption, text: string) => {
        if (speakingDraft !== tone) {
            // another draft is playing, or nothing is playing. Start this one.
            const cleanText = cleanEmailForSpeech(text);
            speak(cleanText);
            setSpeakingDraft(tone);
        } else { // this draft is the active one
            if (isPaused) {
                resume();
            } else {
                pause();
            }
        }
    };

    const handleStop = () => {
        cancel();
    };

    const renderDraftButtons = (tones: typeof toneOptions) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tones.map(({ tone, recommended }) => (
                <div key={tone} className="flex flex-col">
                    <button
                        onClick={() => handleGenerateDraft(tone)}
                        disabled={isLoadingDraft || !keyPoints.trim()}
                        className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white font-bold py-2 px-4 rounded-t-lg transition-all duration-200 ease-out disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center w-full"
                    >
                        {isLoadingDraft && activeDraftTone === tone ? (
                             <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Drafting...
                            </>
                        ) : (
                            <span>
                                Generate {tone}
                                {!recommended && <span className="text-xs text-gray-400"> (not recommended)</span>}
                            </span>
                        )}
                    </button>
                     {drafts[tone] && (
                        <div className="p-4 bg-slate-900 border border-t-0 border-slate-700 rounded-b-lg animate-fade-in-up relative flex flex-col h-full">
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => handlePlayPause(tone, drafts[tone])}
                                    className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1 px-2 rounded-md transition-all text-xs"
                                    aria-label={(!isSpeaking || speakingDraft !== tone) ? `Read ${tone} draft` : isPaused ? `Resume ${tone} draft` : `Pause ${tone} draft`}
                                >
                                    {(!isSpeaking || speakingDraft !== tone || isPaused) ? <SpeakerIcon className="w-4 h-4" /> : <PauseIcon className="w-4 h-4" />}
                                    <span>{(!isSpeaking || speakingDraft !== tone) ? 'Read' : isPaused ? 'Resume' : 'Pause'}</span>
                                </button>
                                {isSpeaking && speakingDraft === tone && (
                                     <button
                                        onClick={handleStop}
                                        className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1 px-2 rounded-md transition-all text-xs"
                                        aria-label="Stop reading draft"
                                    >
                                        <StopCircleIcon className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleCopy(drafts[tone])}
                                    className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1 px-2 rounded-md transition-all text-xs"
                                    aria-label={`Copy ${tone} draft to clipboard`}
                                >
                                    {isCopied ? <ClipboardCheckIcon /> : <ClipboardIcon />}
                                    <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                                </button>
                            </div>
                            <div 
                                className="text-gray-300 leading-relaxed prose prose-invert prose-p:my-2 prose-strong:text-amber-400 max-w-none text-sm pt-8 flex-grow"
                                dangerouslySetInnerHTML={{ __html: formatMarkdown(drafts[tone]) }}
                            />
                            <div className="mt-auto pt-4">
                                <Feedback />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
    
    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="key-points" className="block text-sm font-medium text-gray-300 mb-1">Your Key Points / Desired Outcome (edit if needed)</label>
                <textarea
                    id="key-points"
                    value={keyPoints}
                    onChange={(e) => setKeyPoints(e.target.value)}
                    placeholder="1. Correct their false statement about X..."
                    className="w-full h-32 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none transition-shadow duration-200 disabled:opacity-50"
                    aria-label="Your key points for the response"
                    disabled={isLoadingDraft}
                />
            </div>
            
            {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-400 text-sm rounded-lg p-3 flex items-center gap-3 animate-fade-in-up-fast" role="alert">
                    <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
                    <p className="flex-grow">{error}</p>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-white" aria-label="Dismiss error message"><XIcon className="w-5 h-5" /></button>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <h4 className="text-md font-semibold text-gray-200 mb-2">Recommended Styles</h4>
                    <p className="text-xs text-gray-400 mb-3">These tones are generally best for creating a strong, positive legal record.</p>
                    {renderDraftButtons(recommendedTones)}
                </div>
                
                <div className="pt-4 border-t border-slate-700">
                    <h4 className="text-md font-semibold text-gray-200 mb-2">Other Styles</h4>
                    <p className="text-xs text-gray-400 mb-3">Use with caution. These tones can sometimes escalate conflict and may not be viewed favorably in court.</p>
                    {renderDraftButtons(otherTones)}
                </div>
            </div>
        </div>
    );
};

export default DraftingStation;