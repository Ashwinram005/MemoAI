import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMemory } from '../api/memory';
import { Loader2, Brain, Calendar, Hash, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../utils';

export default function Memory() {
    const { user } = useAuth();
    const [memory, setMemory] = useState({ episodic: [], semantic: [], procedural: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('episodic');

    useEffect(() => {
        const fetchMemory = async () => {
            try {
                const data = await getMemory(user.userId);
                setMemory(data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load memory');
            } finally {
                setLoading(false);
            }
        };

        fetchMemory();
    }, [user.userId]);

    const tabs = [
        { id: 'episodic', label: 'Episodic', icon: Calendar, color: 'blue', desc: 'Personal experiences and events' },
        { id: 'semantic', label: 'Semantic', icon: Hash, color: 'purple', desc: 'Facts and knowledge' },
        { id: 'procedural', label: 'Procedural', icon: Activity, color: 'green', desc: 'Skills and how-to knowledge' },
    ];

    const getColorClasses = (color, isActive) => {
        const variants = {
            blue: isActive ? "bg-blue-50 text-blue-700 border-blue-200" : "hover:bg-blue-50/50 text-gray-600",
            purple: isActive ? "bg-purple-50 text-purple-700 border-purple-200" : "hover:bg-purple-50/50 text-gray-600",
            green: isActive ? "bg-green-50 text-green-700 border-green-200" : "hover:bg-green-50/50 text-gray-600",
        };
        return variants[color];
    };

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                <Brain className="text-gray-300 transform scale-125" size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No memories yet</h3>
            <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                As you interact with MemoAI, it will start forming memories about your conversations, preferences, and tasks.
            </p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
                    <Brain className="text-primary-500" size={32} />
                </div>
                <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-gray-100 mb-3">Memory System</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                    Explore what your AI assistant has remembered about you across different cognitive layers.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[600px]">
                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 p-2 flex flex-col sm:flex-row gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex-1 flex items-center justify-center sm:justify-start px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent",
                                getColorClasses(tab.color, activeTab === tab.id)
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-lg mr-3 transition-colors",
                                activeTab === tab.id ? "bg-white dark:bg-gray-900 shadow-sm" : "bg-gray-100 dark:bg-gray-700"
                            )}>
                                <tab.icon size={18} />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold">{tab.label}</div>
                                <div className="text-[10px] opacity-70 font-normal hidden sm:block">{tab.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="p-8 relative">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="animate-spin text-primary-500" size={32} />
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Timeline Line */}
                            {memory[activeTab] && memory[activeTab].length > 0 && (
                                <div className="absolute left-4 sm:left-8 top-4 bottom-4 w-0.5 bg-gray-100 dark:bg-gray-800"></div>
                            )}

                            {(!memory[activeTab] || memory[activeTab].length === 0) ? (
                                <EmptyState />
                            ) : (
                                <div className="space-y-8">
                                    {memory[activeTab].map((item, index) => (
                                        <div key={index} className="relative pl-12 sm:pl-20 animate-slide-up group" style={{ animationDelay: `${index * 100}ms` }}>
                                            {/* Timeline Dot */}
                                            <div className={cn(
                                                "absolute left-2.5 sm:left-[29px] top-6 w-3 h-3 rounded-full border-2 bg-white dark:bg-gray-800 z-10 transition-colors duration-300",
                                                activeTab === 'episodic' ? "border-blue-500 group-hover:bg-blue-500" :
                                                    activeTab === 'semantic' ? "border-purple-500 group-hover:bg-purple-500" :
                                                        "border-green-500 group-hover:bg-green-500"
                                            )}></div>

                                            <div className={cn(
                                                "bg-white dark:bg-gray-800 rounded-xl p-5 border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative overflow-hidden",
                                                activeTab === 'episodic' ? "border-l-4 border-l-blue-500 border-gray-100 dark:border-gray-700" :
                                                    activeTab === 'semantic' ? "border-l-4 border-l-purple-500 border-gray-100 dark:border-gray-700" :
                                                        "border-l-4 border-l-green-500 border-gray-100 dark:border-gray-700"
                                            )}>

                                                {/* Content */}
                                                <div className="relative z-10">
                                                    {activeTab === 'semantic' || activeTab === 'procedural' ? (
                                                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                                                            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                {item.key}
                                                            </span>
                                                            <h4 className="font-semibold text-gray-900">{item.value}</h4>
                                                        </div>
                                                    ) : null}

                                                    {item.content && (
                                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                                                            {item.content}
                                                        </p>
                                                    )}

                                                    {item.timestamp && (
                                                        <div className="mt-3 flex items-center text-xs text-gray-400 font-medium">
                                                            <Calendar size={12} className="mr-1.5" />
                                                            {new Date(item.timestamp).toLocaleDateString(undefined, {
                                                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                                                hour: '2-digit', minute: '2-digit'
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
