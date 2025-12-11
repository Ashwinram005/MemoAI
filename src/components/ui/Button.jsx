import React from 'react';
import { cn } from '../../utils';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: 'bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-[1px] border border-transparent',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent',
    danger: 'bg-error-500 text-white hover:bg-error-600 border border-transparent hover:shadow-lg hover:shadow-error-500/30',
    icon: 'p-2 aspect-square flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900',
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    default: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
};

export const Button = React.forwardRef(({
    className,
    variant = 'primary',
    size = 'default',
    isLoading,
    disabled,
    children,
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none disabled:shadow-none',
                variants[variant],
                variant !== 'icon' && sizes[size],
                className
            )}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" />
            )}
            {children}
        </button>
    );
});

Button.displayName = 'Button';
