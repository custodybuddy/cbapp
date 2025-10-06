import React, { useState } from 'react';
import ThumbsUpIcon from './icons/ThumbsUpIcon';
import ThumbsDownIcon from './icons/ThumbsDownIcon';

const Feedback: React.FC = () => {
    const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const handleFeedback = (vote: 'up' | 'down') => {
        setSubmitted(true);
        if (feedback === vote) {
            setFeedback(null); // Deselect
             // In a real app, you might retract the feedback here
            console.log(`Feedback retracted.`);
        } else {
            setFeedback(vote); // Select or change selection
            // In a real application, you would send this feedback to a server.
            console.log(`Feedback received: ${vote}`);
        }
    };

    const getButtonClasses = (type: 'up' | 'down') => {
        const base = 'p-2 rounded-full transition-all duration-200 ease-out';
        if (feedback === type) {
            return type === 'up' 
                ? `${base} bg-green-500/20 text-green-400`
                : `${base} bg-red-500/20 text-red-400`;
        }
        return `${base} text-gray-400 hover:bg-slate-700 hover:text-white`;
    };

    return (
        <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-between">
            {submitted ? (
                <p className="text-sm text-amber-400 font-semibold">Thank you for your feedback!</p>
            ) : (
                <p className="text-sm text-gray-300">Was this response helpful?</p>
            )}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleFeedback('up')}
                    className={getButtonClasses('up')}
                    aria-pressed={feedback === 'up'}
                    aria-label="Helpful"
                >
                    <ThumbsUpIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => handleFeedback('down')}
                    className={getButtonClasses('down')}
                    aria-pressed={feedback === 'down'}
                    aria-label="Not helpful"
                >
                    <ThumbsDownIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Feedback;