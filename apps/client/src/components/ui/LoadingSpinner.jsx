import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * LoadingSpinner Component
 * Consistent loading indicator across the application
 * 
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} variant - 'primary' | 'white' | 'gray'
 * @param {string} text - Loading text to display
 * @param {boolean} fullScreen - Display as fullscreen overlay
 */
export const LoadingSpinner = ({
  size = 'md',
  variant = 'primary',
  text = '',
  fullScreen = false,
  className = '',
}) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  const variants = {
    primary: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const SpinnerContent = () => (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 size={sizes[size]} className={`animate-spin ${variants[variant]}`} />
      {text && (
        <p className={`${textSizes[size]} ${variants[variant]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <SpinnerContent />
      </div>
    );
  }

  return <SpinnerContent />;
};

/**
 * SkeletonLoader Component
 * Skeleton loading state for content placeholders
 */
export const SkeletonLoader = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  count = 1,
  variant = 'default'
}) => {
  const variants = {
    default: 'bg-gray-200',
    card: 'bg-white border border-gray-200',
  };

  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className={`${width} ${height} ${variants[variant]} rounded-lg animate-pulse ${className}`}
        />
      ))}
    </div>
  );
};

/**
 * PageLoader Component
 * Full page loading state
 */
export const PageLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-lg mb-4">
          <Loader2 size={48} className="animate-spin text-blue-600" />
        </div>
        <p className="text-lg font-semibold text-gray-700">{text}</p>
        <div className="mt-4 flex justify-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;