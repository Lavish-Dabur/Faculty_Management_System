import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { testConnection } from '../services/api';
import { useAuth } from '../store/auth.store';
import FormContainer from '../components/FormContainer';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    const errs = {};
    if (!form.email) errs.email = 'Email is required.';
    if (!form.password) errs.password = 'Password is required.';
    
    if (Object.keys(errs).length) return setErrors(errs);
    
    setLoading(true);
    setErrors({});
    
    try {
      const isConnected = await testConnection();
      
      if (!isConnected) {
        setErrors({ submit: 'Cannot connect to server. Please check if backend is running on port 5001.' });
        setLoading(false);
        return;
      }

      const response = await login(form.email, form.password);
      
      console.log('Login response:', response);
      console.log('User role:', response.Role);
      
      setLoading(false);
      
      const role = response.Role;
      
      // Wait a bit for state to update
      setTimeout(() => {
        if (role === 'Admin') {
          console.log('Navigating to /admin');
          navigate('/admin', { replace: true });
        } else {
          console.log('Navigating to /dashboard');
          navigate('/dashboard', { replace: true });
        }
      }, 100);
      
    } catch (error) {
      let errorMessage = 'Login failed. Please check your credentials.';
      
      // Log the full error for debugging
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.data?.message) {
        // Use the exact error message from backend
        errorMessage = error.response.data.message;
      } else if (error.message.includes('400')) {
        errorMessage = 'Invalid email or password format.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Login endpoint not found. Check backend routes.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Server is not responding. Please try again.';
      } else if (error.message.includes('Network error')) {
        errorMessage = 'Cannot connect to server. Make sure backend is running.';
      } else {
        errorMessage = error.message || 'Login failed. Please try again.';
      }
      
      setErrors({ submit: errorMessage });
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
        <div className="form-full-width text-right">
          <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
        </div>
        {errors.submit && (
          <div className="form-full-width">
            <div className="error-message" style={{ textAlign: 'center' }}>
              {errors.submit}
            </div>
          </div>
        )}
        <div className="form-full-width">
          <PrimaryButton 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In Securely'}
          </PrimaryButton>
        </div>
      </form>
    </FormContainer>
  );
};

export default LoginForm;