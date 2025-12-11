import React, { useState } from 'react';
import { Zap, Command, ArrowRight, Loader2 } from 'lucide-react';
import { quickCapture } from '../../api/assistant';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function QuickCapture() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleCapture = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setProcessing(true);
        try {
            const result = await quickCapture(user.userId, input);

            // Handle different action types
            if (result.actionTaken === 'create_task') {
                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                        <div className="flex-1 w-0 p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <Zap className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Task Created!
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {result.result.title}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ));
            } else {
                toast.success('Saved to memory!');
            }

            setInput('');
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to capture input');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            {/* Trigger Button - Floating or Header? Let's make it a fixed FAB for now or just expose via Command-K concept usually */}
            {/* For this dashboard, let's put it on the bottom right or near header. 
                I'll verify where to put it later. For now, it's a self-contained modal-like component.
            */}

            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-gray-900/90 dark:bg-primary-600/90 hover:bg-black dark:hover:bg-primary-500 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 backdrop-blur-sm group"
                title="Quick Capture (Cmd+K)"
            >
                <Zap className="h-6 w-6 group-hover:text-yellow-300 transition-colors" fill="currentColor" />
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)}>
                    <div
                        className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl ring-1 ring-gray-900/5 overflow-hidden transform transition-all scale-100"
                        onClick={e => e.stopPropagation()}
                    >
                        <form onSubmit={handleCapture} className="relative">
                            <div className="flex items-center px-4 pt-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                                <Command className="h-5 w-5 text-gray-400 mr-3" />
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a task, idea, or reminder..."
                                    className="flex-1 bg-transparent border-0 focus:ring-0 text-lg text-gray-900 dark:text-white placeholder:text-gray-400 h-12"
                                    autoFocus
                                />
                                {processing ? (
                                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={!input.trim()}
                                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 transition-colors"
                                    >
                                        <ArrowRight size={18} />
                                    </button>
                                )}
                            </div>
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-850/50 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex gap-4">
                                    <span>Captured items are intelligently routed</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 font-mono">Enter</span> to save
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
