import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { User, Mail, LogOut, Shield } from 'lucide-react';

export default function Profile() {
    const { user, logout } = useAuth();

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Profile & Settings</h1>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-200">
                {/* Header Section */}
                <div className="p-8 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                    <div className="flex items-center space-x-6">
                        <div className="h-24 w-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-3xl font-bold shadow-inner ring-4 ring-white dark:ring-gray-900">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{user?.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Personal Account</p>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-8">
                    <div>
                        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 px-1">Account Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-transparent dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors group">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm mr-4 group-hover:scale-105 transition-transform">
                                    <User className="text-gray-400 dark:text-gray-500" size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 font-medium mb-0.5">Full Name</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-transparent dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors group">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm mr-4 group-hover:scale-105 transition-transform">
                                    <Mail className="text-gray-400 dark:text-gray-500" size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 font-medium mb-0.5">Email Address</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-transparent dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors group">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm mr-4 group-hover:scale-105 transition-transform">
                                    <Shield className="text-gray-400 dark:text-gray-500" size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 font-medium mb-0.5">User ID</p>
                                    <p className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-100 opacity-80">{user?.userId}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
