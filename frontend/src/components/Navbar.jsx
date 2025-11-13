import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth.store';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FM</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Faculty Management</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  <span>Profile Details</span>
                </Link>
                {user.Role === 'Admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <span className="text-sm text-gray-600">
                    {user.FirstName || user.firstname}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/retrieve" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  Faculty Directory
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;