import React from 'react';

const PrimaryButton = ({ 
  children, 
  onClick, 
  color = "bg-indigo-600", 
  icon: Icon, 
  disabled = false, 
  type = "button",
  small = false
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`primary-button ${color} ${small ? 'primary-button-small' : ''}`}
    >
      {Icon && <Icon style={{ width: '20px', height: '20px' }} />}
      {children}
    </button>
  );
};

export default PrimaryButton;