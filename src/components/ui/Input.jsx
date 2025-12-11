import React from 'react';
import { cn } from '../../utils';
import { AlertCircle } from 'lucide-react';

export const Input = React.forwardRef(({ className, label, error, icon: Icon, ...props }, ref) => {
    return (
        <div className="w-full group">
            {label && (
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 ml-1 transition-colors">
                    {label}
                </label>
            )}
            <div className="relative transition-all duration-200 ease-in-out">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors duration-200">
                        <Icon size={20} strokeWidth={2} />
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        // Base Layout
                        'block w-full rounded-xl border transition-all duration-200 ease-out',
                        'h-[52px] px-4 py-3', // Taller, substantial touch target

                        // Icon Padding
                        Icon ? 'pl-12' : 'pl-4',

                        // Colors & Backgrounds (Light Mode)
                        'bg-gray-50 hover:bg-white text-gray-900',
                        'border-gray-200 hover:border-gray-300',
                        'placeholder:text-gray-400',

                        // Colors & Backgrounds (Dark Mode)
                        'dark:bg-gray-800/50 dark:hover:bg-gray-800 dark:text-gray-100',
                        'dark:border-gray-700 dark:hover:border-gray-600',
                        'dark:placeholder:text-gray-500',

                        // Focus State (Professional Ring)
                        'focus:bg-white dark:focus:bg-gray-900',
                        'focus:border-primary-500 dark:focus:border-primary-500',
                        'focus:ring-4 focus:ring-primary-500/10 dark:focus:ring-primary-500/20',
                        'focus:outline-none',

                        // Typography
                        'text-[15px] font-medium leading-relaxed font-body',

                        // Disabled State
                        'disabled:opacity-60 disabled:cursor-not-allowed',

                        // Error State
                        error && 'border-error-300 text-error-900 dark:text-error-300 bg-error-50/30 dark:bg-error-900/10 focus:border-error-500 focus:ring-error-500/20',

                        className
                    )}
                    {...props}
                />

                {/* Error Icon */}
                {error && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-error-500 animate-in fade-in zoom-in duration-200">
                        <AlertCircle size={18} />
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-2 ml-1 text-xs font-medium text-error-600 dark:text-error-400 animate-slide-up flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-error-500 inline-block"></span>
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
