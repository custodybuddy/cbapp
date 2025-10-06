import React from 'react';
import DownloadIcon from '../icons/DownloadIcon';
import SpeakerIcon from '../icons/SpeakerIcon';
import StopCircleIcon from '../icons/StopCircleIcon';
import { formatMarkdown } from '../../utils/markdownParser';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import Feedback from '../Feedback';
import { exportTextFile } from '../../utils/exportUtils';
import { getISODate } from '../../utils/dateUtils';
import { cleanMarkdownForSpeech } from '../../utils/stringUtils';
import PauseIcon from '../icons/PauseIcon';

interface AnalysisResultProps {
    response: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ response }) => {
    const { isSpeaking, isPaused, speak, cancel, pause, resume } = useTextToSpeech();
    
    const handleExportAnalysis = () => {
        if (!response) return;

        const date = getISODate();
        const filename = `CustodyBuddy-Analysis-${date}.txt`;
        exportTextFile(response, filename);
    };

    const handlePlayPause = () => {
        if (!isSpeaking) {
            const plainText = cleanMarkdownForSpeech(response);
            speak(plainText);
        } else if (isPaused) {
            resume();
        } else {
            pause();
        }
    };

    const handleStop = () => {
        cancel();
    };


    return (
        <div className="mt-4 p-6 bg-slate-900 border border-slate-700 rounded-lg animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-amber-400">AI Analysis</h3>
                 <div className="flex items-center gap-2">
                    <button
                        onClick={handlePlayPause}
                        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
                        aria-label={!isSpeaking ? "Read analysis aloud" : isPaused ? "Resume reading" : "Pause reading"}
                    >
                        {!isSpeaking || isPaused ? <SpeakerIcon className="w-4 h-4" /> : <PauseIcon className="w-4 h-4" />}
                        <span>{!isSpeaking ? 'Read Aloud' : isPaused ? 'Resume' : 'Pause'}</span>
                    </button>
                    {isSpeaking && (
                         <button
                            onClick={handleStop}
                            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
                            aria-label="Stop reading analysis"
                        >
                            <StopCircleIcon className="w-4 h-4" />
                            <span>Stop</span>
                        </button>
                    )}
                    <button
                        onClick={handleExportAnalysis}
                        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
                        aria-label="Export analysis as a text file"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                 </div>
            </div>
            <div 
                className="text-gray-300 leading-relaxed prose prose-invert prose-p:my-2 prose-ul:my-2 prose-strong:text-amber-400 max-w-none"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(response) }}
            />
            <Feedback />
        </div>
    );
};

export default AnalysisResult;