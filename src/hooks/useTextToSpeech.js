import { useState, useCallback, useEffect } from 'react';
import { ElevenLabsClient } from 'elevenlabs';
import { ELEVENLABS_CONFIG } from '../config/elevenlabs';

export const useTextToSpeech = (apiKey = '') => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceId, setVoiceId] = useState(ELEVENLABS_CONFIG.voiceId);
    const [audioElement, setAudioElement] = useState(null);

    // Check for browser support
    const hasBrowserSupport = 'speechSynthesis' in window;

    const speak = useCallback(async (text, useElevenLabs = false) => {
        if (!text) return;

        if (isSpeaking) {
            stop();
        }

        setIsSpeaking(true);

        // Option 1: ElevenLabs (High Quality)
        if (useElevenLabs && apiKey) {
            try {
                const elevenlabs = new ElevenLabsClient({
                    apiKey: apiKey
                });

                const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
                    text: text,
                    model_id: 'eleven_turbo_v2',
                    output_format: 'mp3_44100_128'
                });

                // Convert stream to blob
                const chunks = [];
                const reader = audioStream.getReader();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    chunks.push(value);
                }

                const blob = new Blob(chunks, { type: 'audio/mpeg' });
                const audio = new Audio(URL.createObjectURL(blob));

                setAudioElement(audio);

                audio.onended = () => {
                    setIsSpeaking(false);
                    setAudioElement(null);
                };

                audio.onerror = (error) => {
                    console.error('Audio playback error:', error);
                    setIsSpeaking(false);
                    setAudioElement(null);
                };

                await audio.play();
                return;

            } catch (error) {
                console.warn('ElevenLabs failed, falling back to browser TTS:', error);
                setIsSpeaking(false);
                // Fallthrough to browser TTS
            }
        }

        // Option 2: Browser Fallback (Standard Quality)
        if (hasBrowserSupport) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } else {
            console.error('Text-to-speech not supported');
            setIsSpeaking(false);
        }
    }, [apiKey, voiceId, hasBrowserSupport, isSpeaking]);

    const stop = useCallback(() => {
        // Stop ElevenLabs audio if playing
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
            setAudioElement(null);
        }

        // Stop browser TTS
        if (hasBrowserSupport) {
            window.speechSynthesis.cancel();
        }

        setIsSpeaking(false);
    }, [hasBrowserSupport, audioElement]);

    // Cleanup on unmount
    useEffect(() => {
        return () => stop();
    }, [stop]);

    return {
        speak,
        stop,
        isSpeaking,
        setVoiceId
    };
};
