import React, { forwardRef } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Input Component
 * Standardized input field with consistent styling
 * 
 * @param {string} label - Input label
 * @param {string} error - Error message to display
 * @param {string} helpText - Helper text to display below input
 * @param {React.ReactNode} leftIcon - Icon to show on left
 * @param {React.ReactNode} rightIcon - Icon to show on right
 * @param {boolean} success - Show success state
 * @param {boolean} required - Mark field as required
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export const Input = forwardRef(({
  label,
  error,
  success,
  helpText,
  leftIcon,
  rightIcon,
  required = false,
  size = 'md',
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const baseStyles = 'w-full border rounded-xl transition-all duration-200 outline-none bg-white placeholder-gray-400 text-gray-900';
  
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };
  
  const stateStyles = error 
    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/30' 
    : success 
    ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-green-50/30' 
    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
  
  const paddingStyles = leftIcon 
    ? 'pl-11' 
    : rightIcon || error || success 
    ? 'pr-11' 
    : '';

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {React.cloneElement(leftIcon, { size: iconSize[size] })}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={`${baseStyles} ${sizeStyles[size]} ${stateStyles} ${paddingStyles} ${className}`}
          {...props}
        />
        
        {(rightIcon || error || success) && !leftIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {error ? (
              <AlertCircle size={iconSize[size]} className="text-red-500" />
            ) : success ? (
              <CheckCircle size={iconSize[size]} className="text-green-500" />
            ) : (
              <span className="text-gray-400">
                {rightIcon && React.cloneElement(rightIcon, { size: iconSize[size] })}
              </span>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle size={14} />
          <span>{error}</span>
        </p>
      )}
      
      {success && !error && (
        <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
          <CheckCircle size={14} />
          <span>Looks good!</span>
        </p>
      )}
      
      {helpText && !error && !success && (
        <p className="mt-2 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;