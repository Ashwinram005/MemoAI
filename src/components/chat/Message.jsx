import React from 'react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import clsx from 'clsx';
import { Copy, RefreshCw, Volume2, Square } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { ELEVENLABS_CONFIG } from '../../config/elevenlabs';

export default function Message({ message, isLast, onRegenerate }) {
    const isUser = message.role === 'user';

    // Initialize TTS with ElevenLabs credentials
    const { speak, stop, isSpeaking } = useTextToSpeech(ELEVENLABS_CONFIG.apiKey);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(message.content);
        toast.success('Copied to clipboard');
    };

    const handleSpeak = () => {
        if (isSpeaking) {
            stop();
        } else {
            // Use ElevenLabs for high-quality voice
            speak(message.content, true); // true = use ElevenLabs
        }
    };

    return (
        <div className={clsx(
            "flex w-full mb-6",
            isUser ? "justify-end" : "justify-start"
        )}>
            <div className={clsx(
                "flex max-w-[85%] md:max-w-[75%] lg:max-w-[65%]",
                isUser ? "flex-row-reverse" : "flex-row"
            )}>
                {/* Avatar */}
                <div className={clsx(
                    "flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm mt-1",
                    isUser
                        ? "bg-primary-600 text-white ml-3"
                        : "bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-gray-200 dark:border-gray-700 mr-3"
                )}>
                    {isUser ? 'U' : 'AI'}
                </div>

                {/* Message Bubble */}
                <div className={clsx(
                    "relative group px-5 py-3.5 shadow-sm text-[15px] leading-7",
                    isUser
                        ? "bg-primary-600 text-white rounded-2xl rounded-tr-md"
                        : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-md"
                )}>
                    {isUser ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                    )}

                    {/* Message Actions (Copy/Regenerate/Speak) */}
                    <div className={clsx(
                        "absolute -bottom-6 flex items-center gap-2 transition-opacity opacity-0 group-hover:opacity-100",
                        isUser ? "right-0" : "left-0"
                    )}>
                        <span className="text-xs text-gray-400 font-medium">
                            {format(new Date(message.timestamp), 'h:mm a')}
                        </span>

                        {!isUser && (
                            <>
                                <button
                                    onClick={copyToClipboard}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    title="Copy"
                                >
                                    <Copy size={12} />
                                </button>

                                <button
                                    onClick={handleSpeak}
                                    className={clsx(
                                        "p-1 transition-colors",
                                        isSpeaking
                                            ? "text-primary-500 animate-pulse"
                                            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    )}
                                    title={isSpeaking ? "Stop Speaking" : "Read Aloud"}
                                >
                                    {isSpeaking ? <Square size={12} fill="currentColor" /> : <Volume2 size={12} />}
                                </button>

                                {isLast && onRegenerate && (
                                    <button
                                        onClick={onRegenerate}
                                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                        title="Regenerate"
                                    >
                                        <RefreshCw size={12} />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
