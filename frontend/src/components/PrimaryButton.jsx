import React from 'react';

const PrimaryButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  icon: Icon, 
  disabled = false, 
  type = 'button',
  fullWidth = false,
  size = 'md'
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default PrimaryButton;