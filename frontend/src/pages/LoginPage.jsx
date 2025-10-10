import React, { useState } from 'react';
import { Mail, Key, Loader2, LogIn } from 'lucide-react';
import FormContainer from '../components/FormContainer';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import axios from "axios";

const LoginForm = ({ navigate }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required.';
    if (!form.password) errs.password = 'Password is required.';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", form, { withCredentials: true });
      const data = res.data;
      setLoading(false);
      if (data && data.token) {
        setIsLoggedIn(true);
      } else {
        setErrors({ general: "Login failed. No token received." });
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setErrors(error.response.data.errors || { general: error.response.data.message || "Login failed." });
      } else {
        setErrors({ general: "Network error. Please try again." });
      }
    }
  };

  return (
    <FormContainer title="Login to Your Account" navigate={navigate}>
      {isLoggedIn && <div className="text-green-600 font-bold mb-2">Logged in successfully!</div>}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
        <FormInput label="Email Address" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} Icon={Mail} />
        <FormInput label="Password" type="password" name="password" value={form.password} onChange={handleChange} error={errors.password} Icon={Key} />
        <PrimaryButton type="submit" onClick={handleSubmit} Icon={loading ? Loader2 : LogIn} disabled={loading}>
          {loading ? 'Authenticating...' : 'Sign In Securely'}
        </PrimaryButton>
        {errors.general && <div className="text-red-500 mt-2">{errors.general}</div>}
      </form>
    </FormContainer>
  );
};

export default LoginForm;
