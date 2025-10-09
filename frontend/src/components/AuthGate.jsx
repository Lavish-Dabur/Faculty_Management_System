import React, { useState } from 'react';
import PrimaryButton from './PrimaryButton';

const AuthGate = ({ navigate }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-gate-container">
      <button 
        onClick={() => navigate('home')}
        className="back-button"
        style={{ marginBottom: '2rem' }}
      >
        ← Back 
      </button>
      
      <h1 className="auth-gate-title">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h1>
      <p className="auth-gate-subtitle">
        {isLogin ? 'Sign in to update records' : 'Register for a new account'}
      </p>

      <div className="auth-options">
        <PrimaryButton 
          onClick={() => navigate(isLogin ? 'login' : 'signup')} 
          color={isLogin ? "bg-indigo-600" : "bg-green-600"}
        >
          {isLogin ? 'Proceed to Login' : 'Proceed to Sign Up'}
        </PrimaryButton>
        
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="toggle-auth"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
};

export default AuthGate;