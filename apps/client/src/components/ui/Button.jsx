import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button Component
 * Unified button with consistent styling across the application
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} loading - Show loading spinner
 * @param {boolean} fullWidth - Make button full width
 * @param {React.ReactNode} leftIcon - Icon component to show on left
 * @param {React.ReactNode} rightIcon - Icon component to show on right
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-95';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-200 hover:border-gray-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 hover:border-blue-700',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 hover:text-gray-900',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 shadow-md shadow-yellow-500/20 hover:shadow-lg hover:shadow-yellow-500/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5 h-9',
    md: 'px-5 py-2.5 text-base gap-2 h-11',
    lg: 'px-6 py-3 text-lg gap-2.5 h-12',
    xl: 'px-8 py-4 text-xl gap-3 h-14',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22,
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={iconSize[size]} className="animate-spin" />}
      {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span className="flex-1">{children}</span>
      {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;