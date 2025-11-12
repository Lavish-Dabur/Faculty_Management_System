import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/auth.store';

const AuthGate = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check admin requirement
  if (requireAdmin && user.Role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default AuthGate;