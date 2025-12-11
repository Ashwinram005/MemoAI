import React from 'react';
import { Menu, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from 'react-router-dom';

export default function Header({ onMenuClick }) {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/': return 'Chat Assistant';
            case '/documents': return 'Documents';
            case '/tasks': return 'Tasks';
            case '/memory': return 'Memory System';
            case '/profile': return 'Profile Settings';
            default: return 'MemoAI';
        }
    };

    return (
        <header className="h-[72px] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-20 flex items-center px-6 lg:px-8 sticky top-0 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 transition-all duration-300">
            <div className="flex-1 flex justify-between items-center max-w-7xl mx-auto w-full">
                {/* Left: Mobile Menu + Title */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        className="md:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
                        onClick={onMenuClick}
                        aria-label="Open sidebar"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <h1 className="text-xl md:text-2xl font-display font-semibold text-gray-900 dark:text-gray-50 tracking-tight transition-colors">
                        {getPageTitle()}
                    </h1>
                </div>

                {/* Right: Search + Actions + Profile */}
                <div className="flex items-center gap-2 md:gap-4">

                    <div className="flex items-center border-l border-gray-200 pl-2 md:pl-4 gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>


                        <div className="ml-2 flex items-center gap-3 pl-2">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-primary-500/20 transition-all">
                                <span className="text-sm font-bold text-primary-700">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div className="hidden lg:block text-sm">
                                <p className="font-medium text-gray-700">{user?.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
