import React, { useEffect, useState } from 'react';
import { getProductivityInsights } from '../../api/assistant';
import { useAuth } from '../../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Award, TrendingUp, Target } from 'lucide-react';

export default function ProductivityInsights() {
    const { user } = useAuth();
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const data = await getProductivityInsights(user.userId);
                setInsights(data);
            } catch (error) {
                setInsights(null);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchInsights();
    }, [user]);

    const data = [
        { name: 'Completed', value: insights?.completedTasks || 0 },
        { name: 'Remaining', value: (insights?.totalTasks || 0) - (insights?.completedTasks || 0) },
    ];

    const COLORS = ['#6366f1', '#e2e8f0']; // Indigo for completed, Slate for remaining
    const DARK_COLORS = ['#818cf8', '#1e293b'];

    if (loading) return <div className="h-full bg-gray-50 dark:bg-gray-800 rounded-3xl animate-pulse" />;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="text-indigo-500" size={20} />
                    Productivity
                </h3>
                <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    Weekly View
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative">
                {/* Donut Chart */}
                <div className="h-48 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="dark:opacity-90" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Centered Percentage */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{insights?.completionRate}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Efficiency</span>
                    </div>
                </div>

                <div className="w-full mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                        <Target className="mx-auto text-gray-400 mb-2" size={20} />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{insights?.totalTasks}</p>
                        <p className="text-xs text-gray-500">Tasks Set</p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl text-center text-white shadow-lg shadow-indigo-500/20">
                        <Award className="mx-auto text-indigo-200 mb-2" size={20} />
                        <p className="text-sm font-bold opacity-90 truncate px-1">{insights?.badge}</p>
                        <p className="text-xs text-indigo-100/70 mt-1">Current Badge</p>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">"{insights?.analysis}"</p>
                </div>
            </div>
        </div>
    );
}
