import { ArrowLeft } from 'lucide-react';
import React from 'react'

const FormContainer = ({ children, title, navigate, backView = 'auth_gate' }) => (
  <div className="p-6 md:p-8 bg-white rounded-xl">
    <button
        onClick={() => navigate(backView)}
        className="text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6 inline-flex items-center font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Selection
      </button>

    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-indigo-200 pb-3">
      {title}
    </h2>
    {children}
  </div>
);

export default FormContainer