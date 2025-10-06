import { useState, useCallback, useEffect, useRef } from 'react';

interface UseTextToSpeechProps {
    onEnd?: () => void;
}

export const useTextToSpeech = ({ onEnd }: UseTextToSpeechProps = {}) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const speak = useCallback((text: string) => {
        if (!window.speechSynthesis) {
            console.error("Text-to-speech not supported in this browser.");
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };
        
        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            utteranceRef.current = null;
            if (onEnd) {
                onEnd();
            }
        };
        
        utterance.onpause = () => {
            setIsPaused(true);
            setIsSpeaking(true); // remain speaking while paused
        };

        utterance.onresume = () => {
            setIsPaused(false);
        };

        utterance.onerror = (event) => {
            console.error("Speech synthesis error", event);
            setIsSpeaking(false);
            setIsPaused(false);
            utteranceRef.current = null;
        };
        
        window.speechSynthesis.speak(utterance);
    }, [onEnd]);

    const cancel = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            // Manually set state because onend might not fire reliably on cancel across browsers
            setIsSpeaking(false);
            setIsPaused(false);
        }
    }, []);

    const pause = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.pause();
        }
    }, []);

    const resume = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.resume();
        }
    }, []);

    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                // Ensure speech is stopped when component unmounts
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return { isSpeaking, isPaused, speak, cancel, pause, resume };
};