import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useToast } from '../components/Toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const showToast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailValid) {
      const msg = 'Please enter a valid registered email address.';
      setError(msg);
      if (showToast) showToast(msg, 'error');
      return;
    }

    try {
      const res = await axios.post('/password/forgot-password', { email });
      const successMessage = 'Password reset link has been sent to your email address. Please check your inbox.';
      setMessage(successMessage);
      setError('');
      if (showToast) showToast(successMessage, 'success');
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to send reset email';
      setError(msg);
      setMessage('');
      if (showToast) showToast(msg, 'error');
    }
  };

  const validateEmail = (value) => {
    setEmail(value);
    // simple email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(re.test(value));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="mb-2">
          <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 hover:underline">← Back</button>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900">Forgot Password</h2>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {email && !emailValid && (
              <p className="text-xs text-red-500 mt-1">Please enter a valid email address.</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={!emailValid}
              className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${emailValid ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              Send Password Reset Email
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;