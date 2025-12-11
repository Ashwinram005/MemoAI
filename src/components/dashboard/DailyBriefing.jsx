import React, { useEffect, useState } from 'react';
import { Sun, CheckCircle, Lightbulb, CloudSun } from 'lucide-react';
import { getDailyBriefing } from '../../api/assistant';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils';

export default function DailyBriefing() {
    const { user } = useAuth();
    const [briefing, setBriefing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBriefing = async () => {
            // Simulate network delay for effect or call API
            try {
                const data = await getDailyBriefing(user.userId);
                setBriefing(data);
            } catch (error) {
                console.error("Failed to fetch briefing", error);
                // Fallback mock data if API is not actually running this endpoint yet
                setBriefing(null);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchBriefing();
    }, [user]);

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-3xl p-8 border border-orange-100 dark:border-orange-800/50 animate-pulse h-64">
                <div className="h-8 bg-orange-200/50 dark:bg-orange-800/50 rounded-lg w-1/3 mb-4"></div>
                <div className="h-4 bg-orange-200/50 dark:bg-orange-800/50 rounded-lg w-3/4 mb-2"></div>
                <div className="h-4 bg-orange-200/50 dark:bg-orange-800/50 rounded-lg w-1/2"></div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 rounded-3xl border border-orange-100 dark:border-orange-800/30 p-8 shadow-sm group hover:shadow-md transition-all duration-300">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-400/20 transition-colors"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-orange-50 mb-2">{briefing?.greeting}</h2>
                        <p className="text-orange-800/80 dark:text-orange-200/80 font-medium flex items-center gap-2">
                            <CloudSun size={18} /> {briefing?.weather}
                        </p>
                    </div>
                    <div className="bg-white/60 dark:bg-orange-950/30 p-3 rounded-2xl backdrop-blur-sm shadow-sm border border-orange-100/50 dark:border-orange-800/30">
                        <Sun className="text-orange-500 animate-spin-slow" size={32} />
                    </div>
                </div>

                <div className="grid gap-4">
                    <div className="bg-white/80 dark:bg-gray-900/60 rounded-2xl p-4 border border-orange-100 dark:border-orange-800/30 backdrop-blur-sm flex items-start gap-4 transition-transform hover:scale-[1.02] duration-200">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 flex-shrink-0">
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Top Priority</span>
                            <p className="font-semibold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">{briefing?.topPriority}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{briefing?.focus}</p>
                        </div>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-900/60 rounded-2xl p-4 border border-orange-100 dark:border-orange-800/30 backdrop-blur-sm flex items-start gap-4 transition-transform hover:scale-[1.02] duration-200 delay-75">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-xl text-purple-600 dark:text-purple-400 flex-shrink-0">
                            <Lightbulb size={20} />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Daily Wisdom</span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 italic mt-0.5">"{briefing?.wisdom}"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
