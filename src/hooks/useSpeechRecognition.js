'use client';

import { useEffect, useRef, useState } from 'react';

export default function useSpeechRecognition(onResult) {
    const recognitionRef = useRef(null);
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.lang = 'id-ID';
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }

            if (finalTranscript) {
                onResult(finalTranscript);
            }
        };

        recognition.onerror = (err) => {
            console.error('Speech error:', err);
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }, [onResult]);

    const startListening = () => {
        recognitionRef.current?.start();
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
    };

    return { startListening, stopListening, isListening };
}