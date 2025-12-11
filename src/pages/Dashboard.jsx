import React from 'react';
import DailyBriefing from '../components/dashboard/DailyBriefing';
import ProductivityInsights from '../components/dashboard/ProductivityInsights';

export default function Dashboard() {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Your daily briefing and performance overview.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Briefing Widget */}
                <div className="w-full">
                    <DailyBriefing />
                </div>

                {/* Productivity Insights Widget */}
                <div className="h-[400px] lg:h-auto">
                    <ProductivityInsights />
                </div>
            </div>
        </div>
    );
}
