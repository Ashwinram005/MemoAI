import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendMessage } from '../api/chat';
import { generateSessionId } from '../utils';
import Message from '../components/chat/Message';
import ChatInput from '../components/chat/ChatInput';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function Chat() {
    const { user } = useAuth();
    const [sessionId, setSessionId] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Initialize session
        const storedSession = localStorage.getItem('currentSessionId');
        if (storedSession) {
            setSessionId(storedSession);
            // Ideally we would load history here if the API supported it
        } else {
            startNewSession();
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const startNewSession = () => {
        const newSession = generateSessionId();
        setSessionId(newSession);
        localStorage.setItem('currentSessionId', newSession);
        setMessages([]);
        toast.success('New chat session started');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (text) => {
        if (!text.trim()) return;

        const userMessage = {
            role: 'user',
            content: text,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await sendMessage(user.userId, sessionId, text);

            const botMessage = {
                role: 'assistant',
                content: response.response,
                context: response.context,
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            toast.error('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = async () => {
        // Logic to regenerate would typically involve resending the last user message
        // For now, we'll just show a toast as it's a "nice to have" and might need API support
        const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
        if (lastUserMessage) {
            // Remove the last bot message if it exists (failed or not)
            // Actually, let's just re-send the last user message
            handleSend(lastUserMessage.content);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-950 transition-colors duration-300">
            {/* Header Actions - Minimalist */}
            <div className="flex justify-end items-center px-4 py-3 sm:px-6 border-b border-gray-100 dark:border-gray-800">
                <button
                    onClick={startNewSession}
                    className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800"
                >
                    <Plus size={16} className="mr-2" /> New Chat
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-0">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center px-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-primary-500/10">
                            <MessageSquareIcon size={40} className="text-primary-600 dark:text-primary-400" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
                            Good afternoon, {user?.name?.split(' ')[0] || 'there'}
                        </h2>
                        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
                            I'm your personal AI assistant. detailed, capable, and ready to help. Ask me anything or upload a document to get started.
                        </p>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto w-full py-8 space-y-6">
                        {messages.map((msg, index) => (
                            <Message
                                key={index}
                                message={msg}
                                isLast={index === messages.length - 1}
                                onRegenerate={handleRegenerate}
                            />
                        ))}
                        {loading && (
                            <div className="flex justify-start px-4">
                                <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                )}
            </div>

            {/* Input Area - Floating & Centered */}
            <div className="p-4 sm:px-6 pb-6 bg-white dark:bg-gray-950 border-t border-transparent">
                <div className="max-w-3xl mx-auto w-full">
                    <ChatInput
                        onSend={handleSend}
                        isLoading={loading}
                        onClear={() => setMessages([])}
                    />
                    <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3 font-medium">
                        AI can make mistakes. Please verify important information.
                    </p>
                </div>
            </div>
        </div>
    );
}

function MessageSquareIcon({ size, className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    );
}
