import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, FileText, CheckSquare, Brain, User, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils';

export default function Sidebar({ isOpen, onClose }) {
    const { logout } = useAuth();

    const navigation = [
        { name: 'Chat', href: '/', icon: MessageSquare },
        { name: 'Documents', href: '/documents', icon: FileText },
        { name: 'Tasks', href: '/tasks', icon: CheckSquare },
        { name: 'Memory', href: '/memory', icon: Brain },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-300 transition-colors duration-300">
            {/* Logo Area */}
            <div className="flex items-center h-[72px] px-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/30">
                        M
                    </div>
                    <span className="text-xl font-display font-bold text-gray-900 dark:text-gray-50">MemoAI</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => onClose && onClose()}
                        className={({ isActive }) => cn(
                            "group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-out",
                            isActive
                                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                                : "text-gray-600 bg-transparent hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className="flex items-center">
                                    <item.icon className={cn(
                                        "mr-3 h-5 w-5 transition-colors",
                                        isActive ? "text-primary-600 md:text-primary-400" : "text-gray-400 group-hover:text-gray-500 md:text-gray-500 md:group-hover:text-gray-300"
                                    )} />
                                    {item.name}
                                </div>
                                {isActive && (
                                    <ChevronRight size={14} className="opacity-100 transition-opacity text-primary-500" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User Profile Summary */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <button
                    onClick={logout}
                    className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm transition-opacity duration-300 md:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Mobile Drawer */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-out md:hidden",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SidebarContent />
            </div>

            {/* Desktop Sidebar (Persistent) */}
            <div className="hidden md:flex flex-col w-[280px] fixed inset-y-0 z-30 h-screen transition-all duration-300">
                <SidebarContent />
            </div>

            {/* Spacer for main content to offset fixed sidebar */}
            <div className="hidden md:block w-[280px] flex-shrink-0" />
        </>
    );
}
