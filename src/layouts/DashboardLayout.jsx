import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { cn } from '../utils';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex bg-gray-50 dark:bg-gray-950 min-h-screen font-body transition-colors duration-300">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Header */}
                <Header onMenuClick={() => setSidebarOpen(true)} />

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in mb-20 md:mb-0">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
