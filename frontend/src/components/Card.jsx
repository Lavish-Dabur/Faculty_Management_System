import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  padding = 'normal',
  className = '' 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${paddingClasses[padding]} ${className}`}>
      {title && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
