import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * LoadingSpinner Component
 * Professional loading indicator for async operations
 * 
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} text - Optional loading text
 */
export const LoadingSpinner = ({ size = 'md', text, fullScreen = false }) => {
    const sizes = {
        sm: 20,
        md: 32,
        lg: 48,
    };

    const content = (
        <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 size={sizes[size]} className="animate-spin text-blue-600" />
            {text && <p className="text-gray-600 font-medium">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return content;
};

export default LoadingSpinner;
