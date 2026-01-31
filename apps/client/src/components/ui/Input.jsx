import React, { forwardRef } from 'react';

/**
 * Input Component
 * Standardized input field with consistent styling
 * 
 * @param {string} label - Input label
 * @param {string} error - Error message to display
 * @param {React.ReactNode} leftIcon - Icon to show on left
 * @param {React.ReactNode} rightIcon - Icon to show on right
 * @param {boolean} success - Show success state
 */
export const Input = forwardRef(({
    label,
    error,
    success,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}, ref) => {
    const baseStyles = 'w-full px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none';
    const normalStyles = 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white';
    const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/30';
    const successStyles = 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-green-50/30';

    const stateStyles = error ? errorStyles : success ? successStyles : normalStyles;
    const paddingStyles = leftIcon ? 'pl-11' : rightIcon ? 'pr-11' : '';

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {leftIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={`${baseStyles} ${stateStyles} ${paddingStyles} ${className}`}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-600">{error}</p>
            )}
            {success && !error && (
                <p className="mt-1.5 text-sm text-green-600">Looks good!</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
