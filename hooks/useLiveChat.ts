import { useState, useRef, useCallback, useEffect } from 'react';
// FIX: The `LiveSession` type is not an exported member of the '@google/genai' package.
import { LiveServerMessage, Modality, Blob } from '@google/genai';
import { ai } from '../services/geminiService';
import { encode, decode, decodeAudioData } from '../utils/audioUtils';
import { getFriendlyErrorMessage } from '../utils/errorUtils';

// FIX: Define `LiveSession` via type inference from the `ai.live.connect` method, as it is not exported.
// This maintains strong typing for the session object.
type LiveSession = Awaited<ReturnType<typeof ai.live.connect>>;

// Define the shape of a single transcript entry
export interface TranscriptEntry {
    speaker: 'user' | 'model';
    text: string;
}

// Define the return type of the hook
export interface LiveChatHook {
    isRecording: boolean;
    isConnecting: boolean;
    isSessionActive: boolean;
    error: string | null;
    transcriptHistory: TranscriptEntry[];
    currentInterimTranscript: string;
    currentModelTranscript: string;
    toggleRecording: () => void;
}

export const useLiveChat = (isOpen: boolean, systemInstruction: string): LiveChatHook => {
    // UI-related state
    const [isRecording, setIsRecording] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Transcription state
    const [transcriptHistory, setTranscriptHistory] = useState<TranscriptEntry[]>([]);
    const [currentInterimTranscript, setCurrentInterimTranscript] = useState('');
    const [currentModelTranscript, setCurrentModelTranscript] = useState('');

    // Refs for managing the audio session and resources
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    // Refs for audio playback management
    const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
    const nextStartTimeRef = useRef(0);

    // Refs for accumulating transcript parts before a turn is complete
    const userInputTranscriptRef = useRef('');
    const modelOutputTranscriptRef = useRef('');

    const createBlob = (data: Float32Array): Blob => {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            int16[i] = data[i] * 32768;
        }
        return {
            data: encode(new Uint8Array(int16.buffer)),
            mimeType: 'audio/pcm;rate=16000',
        };
    };

    const stopRecordingCleanup = useCallback(async () => {
        setIsRecording(false);
        setIsConnecting(false); // Ensure connecting state is also reset

        if (sessionPromiseRef.current) {
            try {
                const session = await sessionPromiseRef.current;
                session.close();
            } catch (e) {
                console.error("Error closing session:", e);
            }
            sessionPromiseRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }

        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current = null;
        }

        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            await inputAudioContextRef.current.close().catch(e => console.error("Error closing input audio context:", e));
            inputAudioContextRef.current = null;
        }

        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            sourcesRef.current.forEach(source => source.stop());
            sourcesRef.current.clear();
            await outputAudioContextRef.current.close().catch(e => console.error("Error closing output audio context:", e));
            outputAudioContextRef.current = null;
        }
        
        setCurrentInterimTranscript('');
        setCurrentModelTranscript('');
        userInputTranscriptRef.current = '';
        modelOutputTranscriptRef.current = '';
        setIsSessionActive(false);

    }, []);


    const startRecording = useCallback(async () => {
        if (isRecording || isConnecting) return;
        
        setError(null);
        setIsConnecting(true);
        setTranscriptHistory([]); // Clear history for a new session

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const w = window as any;
            inputAudioContextRef.current = new (w.AudioContext || w.webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (w.AudioContext || w.webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                    },
                    systemInstruction: systemInstruction,
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
                callbacks: {
                    onopen: () => {
                        console.debug('Session opened.');
                        setIsConnecting(false);
                        setIsSessionActive(true);
                        setIsRecording(true);

                        if (!inputAudioContextRef.current || inputAudioContextRef.current.state === 'closed' || !streamRef.current) return;

                        const source = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
                        mediaStreamSourceRef.current = source;
                        
                        const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            if (sessionPromiseRef.current) {
                                sessionPromiseRef.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            const text = message.serverContent.inputTranscription.text;
                            userInputTranscriptRef.current += text;
                            setCurrentInterimTranscript(userInputTranscriptRef.current);
                        }
                        if (message.serverContent?.outputTranscription) {
                            const text = message.serverContent.outputTranscription.text;
                            modelOutputTranscriptRef.current += text;
                            setCurrentModelTranscript(modelOutputTranscriptRef.current);
                        }

                        if (message.serverContent?.turnComplete) {
                            const fullInput = userInputTranscriptRef.current.trim();
                            const fullOutput = modelOutputTranscriptRef.current.trim();

                            setTranscriptHistory(prev => {
                                const newHistory = [...prev];
                                if (fullInput) newHistory.push({ speaker: 'user', text: fullInput });
                                if (fullOutput) newHistory.push({ speaker: 'model', text: fullOutput });
                                return newHistory;
                            });

                            userInputTranscriptRef.current = '';
                            modelOutputTranscriptRef.current = '';
                            setCurrentInterimTranscript('');
                            setCurrentModelTranscript('');
                        }
                        
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
                            const outputCtx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                            const source = outputCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputCtx.destination);
                            
                            source.addEventListener('ended', () => sourcesRef.current.delete(source));
                            source.start(nextStartTimeRef.current);
                            
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }
                        
                        if (message.serverContent?.interrupted) {
                            sourcesRef.current.forEach(source => source.stop());
                            sourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onclose: (e: CloseEvent) => {
                        console.debug('Session closed.');
                        stopRecordingCleanup();
                    },
                    onerror: (e: ErrorEvent) => {
                        setError(getFriendlyErrorMessage(e.error || e, 'live chat session'));
                        stopRecordingCleanup();
                    },
                },
            });

            await sessionPromiseRef.current;

        } catch (err: any) {
            setError(getFriendlyErrorMessage(err, 'microphone access or session start'));
            await stopRecordingCleanup();
        }
    }, [isRecording, isConnecting, systemInstruction, stopRecordingCleanup]);
    
    const toggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecordingCleanup();
        } else {
            startRecording();
        }
    }, [isRecording, startRecording, stopRecordingCleanup]);

    useEffect(() => {
        // This effect should not auto-start recording when the modal merely exists in the DOM but is closed.
        // It should only act when the `isOpen` prop becomes true.
        if (isOpen) {
            // No auto-start, let the user initiate with the button.
        } else {
            // This ensures cleanup happens if the modal is closed while a session is active.
            if(isSessionActive) {
                stopRecordingCleanup();
            }
        }
        
        // The returned cleanup function from useEffect will run when the component unmounts
        // or before the effect runs again. This is a safety net.
        return () => {
             if(isSessionActive) {
                stopRecordingCleanup();
            }
        };
    }, [isOpen, isSessionActive, stopRecordingCleanup]);

    return {
        isRecording,
        isConnecting,
        isSessionActive,
        error,
        transcriptHistory,
        currentInterimTranscript,
        currentModelTranscript,
        toggleRecording,
    };
};