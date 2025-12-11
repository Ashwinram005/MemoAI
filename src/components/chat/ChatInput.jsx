import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Paperclip, Sparkles, Mic, MicOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { useSpeechToText } from '../../hooks/useSpeechToText';

export default function ChatInput({ onSend, isLoading, onClear }) {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);
    const { isListening, transcript, startListening, stopListening, resetTranscript, hasSupport } = useSpeechToText({
        continuous: true,
        interimResults: true,
        onResult: (text) => {
            // We'll update the input state when the user speaks
            // Note: real-time updates might need careful cursor handling if editing manually too
        }
    });

    // Update input when transcript changes
    useEffect(() => {
        if (transcript) {
            setInput((prev) => {
                // Simple append logic for now, or replace? Let's just set it for simplicity 
                // to avoid duplicating previous text if we don't track cursor.
                // Better UX: Append to current cursor or replace? 
                // For now, let's treat voice as "filling the box"
                return transcript;
            });
        }
    }, [transcript]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        if (isListening) {
            stopListening();
            resetTranscript();
        }

        onSend(input);
        setInput('');
        resetTranscript();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
        }
    }, [input]);

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <div className="border-t border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl p-4 sticky bottom-0 z-10 w-full transition-colors duration-300">
            <div className="max-w-3xl mx-auto relative group">

                {/* Input Container */}
                <div className={`relative bg-white dark:bg-gray-900 border ${isListening ? 'border-red-400 ring-2 ring-red-500/10' : 'border-gray-200 dark:border-gray-800'} rounded-3xl shadow-sm focus-within:ring-2 focus-within:ring-primary-500/10 dark:focus-within:ring-primary-500/20 focus-within:border-primary-500/50 dark:focus-within:border-primary-500/50 transition-all duration-300`}>
                    <form onSubmit={handleSubmit} className="flex items-end p-2 gap-2">
                        <button
                            type="button"
                            className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors flex-shrink-0"
                            title="Attach"
                        >
                            <Paperclip size={20} />
                        </button>

                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isListening ? "Listening..." : "Message MemoAI..."}
                            className="flex-1 max-h-[200px] min-h-[44px] py-2.5 bg-transparent border-0 focus:ring-0 p-0 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none text-[15px] leading-relaxed font-body"
                            rows={1}
                            disabled={isLoading}
                        />

                        {hasSupport && (
                            <button
                                type="button"
                                onClick={toggleListening}
                                className={`p-2 rounded-xl h-10 w-10 flex-shrink-0 transition-all duration-200 flex items-center justify-center ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                title={isListening ? "Stop listening" : "Start voice input"}
                            >
                                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>
                        )}

                        <Button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className={`rounded-xl p-2 h-10 w-10 flex-shrink-0 transition-all duration-200 ${input.trim() ? 'bg-primary-600 hover:bg-primary-700 shadow-md text-white scale-100' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 scale-95'}`}
                            variant="custom"
                        >
                            {isLoading ? (
                                <Sparkles size={18} className="animate-spin" />
                            ) : (
                                <Send size={18} className={input.trim() ? "ml-0.5" : ""} />
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer Info */}
                <div className="flex justify-between items-center mt-2 px-1">
                    <div className="flex items-center gap-2">
                        {onClear && (
                            <button
                                onClick={onClear}
                                className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center px-2 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                                type="button"
                            >
                                <X size={12} className="mr-1" /> Clear chat
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
