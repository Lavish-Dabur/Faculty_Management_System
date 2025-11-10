import React from 'react';
import { useNavigate } from 'react-router-dom';

const FormContainer = ({ title, children, backTo = -1, subtitle }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <button 
            onClick={() => navigate(backTo)}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
        </div>
        
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
