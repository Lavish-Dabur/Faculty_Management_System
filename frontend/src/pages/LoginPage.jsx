import React, { useState } from 'react';
import { authAPI, testConnection } from '../services/api';
import FormContainer from '../components/FormContainer';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';

const LoginForm = ({ navigate, onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Basic validation
    const errs = {};
    if (!form.email) errs.email = 'Email is required.';
    if (!form.password) errs.password = 'Password is required.';
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    setErrors({});

    try {
      console.log('Attempting login with:', { email: form.email });

      // Test connection first
      console.log('Testing backend connection...');
      const isConnected = await testConnection();

      if (!isConnected) {
        setErrors({ submit: '❌ Cannot connect to server. Please check if backend is running on port 5001.' });
        setLoading(false);
        return;
      }

      console.log('✅ Backend connected, sending login request...');

      const userData = await authAPI.login(form.email, form.password);
      console.log('Login response:', userData);

      // Store token if available (apiCall returns the JSON object directly)
      if (userData.token) {
        localStorage.setItem('token', userData.token);
      }

      if (onLogin) {
        onLogin({
          facultyId: userData.FacultyID || userData.id,
          firstname: userData.FirstName || userData.firstname,
          lastname: userData.LastName || userData.lastname,
          email: userData.Email || userData.email,
          role: userData.Role || userData.role,
          token: userData.token,
        });
      }

      // Navigate based on role
      const role = userData.Role || userData.role;
      if (role === 'Admin') {
        navigate('admin-dashboard');
      } else {
        navigate('faculty-profile');
      }

    } catch (error) {
      console.error('Login error:', error);

      // More specific error messages (prefer status if available)
      let errorMessage = 'Login failed. Please check your credentials.';
      const status = error?.status;
      const msg = error?.message || '';

      if (status === 403) {
        // Pending approval from admin
        errorMessage = 'Your account is pending admin approval.';
      } else if (status === 400 || msg.includes('400')) {
        errorMessage = 'Invalid email or password format.';
      } else if (status === 401 || msg.includes('401')) {
        errorMessage = 'Unauthorized. Please check your credentials.';
      } else if (status === 404 || msg.includes('404')) {
        errorMessage = 'Login endpoint not found. Check backend routes.';
      } else if (msg.includes('timeout')) {
        errorMessage = 'Server is not responding. Please try again.';
      } else if (msg.includes('Network error')) {
        errorMessage = 'Cannot connect to server. Make sure backend is running.';
      } else if (error?.body && error.body.message) {
        // use server provided message when present
        errorMessage = error.body.message;
      } else {
        errorMessage = msg || 'Login failed. Please try again.';
      }

      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer title="Login to Your Account" navigate={navigate}>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-full-width">
          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
        </div>
        <div className="form-full-width">
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
        </div>
        {errors.submit && (
          <div className="form-full-width">
            <div className="error-message" style={{ textAlign: 'center' }}>
              {errors.submit}
            </div>
          </div>
        )}
        <div className="form-full-width">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In Securely'}
          </PrimaryButton>
        </div>
      </form>
    </FormContainer>
  );
};

export default LoginForm;