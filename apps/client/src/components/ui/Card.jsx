import React from 'react';

/**
 * Card Component
 * Consistent card layout for content sections
 * 
 * @param {React.ReactNode} header - Card header content
 * @param {React.ReactNode} footer - Card footer content
 * @param {boolean} glass - Apply glassmorphism effect
 * @param {boolean} hoverable - Add hover effect
 */
export const Card = ({
    children,
    header,
    footer,
    glass = false,
    hoverable = false,
    className = '',
    ...props
}) => {
    const baseStyles = 'rounded-2xl transition-all duration-300';
    const glassStyles = glass
        ? 'bg-white/80 backdrop-blur-md border border-white/20 shadow-xl'
        : 'bg-white border border-gray-200 shadow-md';
    const hoverStyles = hoverable ? 'hover:shadow-lg hover:-translate-y-1' : '';

    return (
        <div
            className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
            {...props}
        >
            {header && (
                <div className="px-6 py-4 border-b border-gray-100">
                    {header}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
