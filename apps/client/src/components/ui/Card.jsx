import React from 'react';

/**
 * Card Component
 * Consistent card layout for content sections
 * 
 * @param {React.ReactNode} header - Card header content
 * @param {React.ReactNode} footer - Card footer content
 * @param {boolean} glass - Apply glassmorphism effect
 * @param {boolean} hoverable - Add hover effect
 * @param {boolean} bordered - Add border
 * @param {string} padding - 'none' | 'sm' | 'md' | 'lg'
 */
export const Card = ({
  children,
  header,
  footer,
  glass = false,
  hoverable = false,
  bordered = true,
  padding = 'md',
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300';
  
  const glassStyles = glass
    ? 'bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl'
    : 'bg-white shadow-card';
  
  const borderStyles = bordered && !glass ? 'border border-gray-100' : '';
  
  const hoverStyles = hoverable 
    ? 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer' 
    : '';
  
  const clickableStyles = onClick ? 'cursor-pointer' : '';

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`${baseStyles} ${glassStyles} ${borderStyles} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
          {typeof header === 'string' ? (
            <h3 className="text-lg font-semibold text-gray-900">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}
      
      <div className={paddingStyles[padding]}>
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;