import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth.store';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Faculty Data Management System
        </h1>
        <p className="text-xl text-gray-600">
          Manage and explore faculty information with ease
        </p>
      </div>
      
      {/* Main Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-linear-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-2xl font-bold mb-3">Update Records</h3>
          <p className="mb-6 text-indigo-100">
            Add, edit, or modify faculty information and records in the system.
          </p>
          <button 
            onClick={() => navigate(user ? '/dashboard' : '/login')} 
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            {user ? 'Go to Dashboard' : 'Login to Update'}
          </button>
        </div>
        
        <div className="bg-linear-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg p-8 text-white">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold mb-3">View Faculty</h3>
          <p className="mb-6 text-cyan-100">
            Search, browse, and view faculty profiles and information.
          </p>
          <button 
            onClick={() => navigate('/retrieve')} 
            className="bg-white text-cyan-600 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-50 transition-colors"
          >
            Browse Faculty
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl mb-3">⚡</div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Fast & Efficient</h4>
          <p className="text-gray-600">Quick access to all management features</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure Access</h4>
          <p className="text-gray-600">Protected authentication system</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl mb-3">📊</div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Data</h4>
          <p className="text-gray-600">Complete faculty information overview</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;