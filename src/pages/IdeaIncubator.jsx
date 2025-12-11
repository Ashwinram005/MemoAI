import React, { useState } from 'react';
import { Lightbulb, ArrowRight, Loader2, Target, Layers, FileText, CheckSquare, Sparkles } from 'lucide-react';
import { brainstormIdea } from '../api/assistant';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils';

export default function IdeaIncubator() {
    const { user } = useAuth();
    const [idea, setIdea] = useState('');
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleBrainstorm = async (e) => {
        e.preventDefault();
        if (!idea.trim()) return;

        setLoading(true);
        try {
            const data = await brainstormIdea(user.userId, idea);
            setPlan(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3">
                    Idea Incubator <span className="text-yellow-500">✨</span>
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
                    Transform raw thoughts into actionable project plans. Just type your idea, and AI will structure it for you.
                </p>
            </div>

            {/* Input Section */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-1 shadow-lg shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 mb-12 max-w-3xl">
                <form onSubmit={handleBrainstorm} className="relative flex items-center">
                    <div className="pl-6 pr-4 text-yellow-500">
                        <Lightbulb size={24} />
                    </div>
                    <input
                        type="text"
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="e.g., Launch a tech newsletter for developers..."
                        className="w-full h-16 bg-transparent border-none focus:ring-0 text-lg md:text-xl text-gray-900 dark:text-white placeholder:text-gray-400 font-medium"
                    />
                    <button
                        type="submit"
                        disabled={!idea.trim() || loading}
                        className="m-2 px-6 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <span>Incubate</span>}
                    </button>
                </form>
            </div>

            {/* Results Section */}
            {plan && (
                <div className="animate-slide-up grid md:grid-cols-2 gap-8">
                    {/* Project Plan */}
                    <div className="space-y-6">
                        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800/50">
                            <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-6 flex items-center gap-2">
                                <Target className="text-indigo-500" /> Strategic Roadmap
                            </h3>
                            <div className="space-y-4">
                                {plan.plan.map((phase, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-white/60 dark:bg-indigo-900/10 rounded-2xl border border-indigo-50 dark:border-indigo-800/20">
                                        <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <p className="text-gray-800 dark:text-indigo-50 pt-1 font-medium leading-relaxed">{phase}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Items */}
                    <div className="space-y-6">
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800/50">
                            <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 flex items-center gap-2">
                                <CheckSquare className="text-emerald-500" /> Suggested Tasks
                            </h3>
                            <div className="grid gap-3">
                                {plan.suggestedTasks.map((task, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white/60 dark:bg-emerald-900/10 rounded-xl hover:bg-white dark:hover:bg-emerald-900/20 transition-colors border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800/30 group cursor-pointer">
                                        <div className="h-5 w-5 rounded border-2 border-emerald-200 dark:border-emerald-700 group-hover:border-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-emerald-50/90 font-medium">{task}</span>
                                        <button className="ml-auto opacity-0 group-hover:opacity-100 text-xs bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 px-2 py-1 rounded-md font-bold">
                                            Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Resources (Optional) */}
                        {plan.relatedResources && plan.relatedResources.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FileText className="text-gray-400" /> Relevant Documents
                                </h3>
                                {/* List resources... */}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
