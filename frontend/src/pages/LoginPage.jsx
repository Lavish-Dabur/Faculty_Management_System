import React, { useState } from 'react';
import { Mail, Key, Loader2, LogIn } from 'lucide-react';
import FormContainer from '../components/FormContainer';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';

const LoginForm = ({ navigate }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Login successful');
    }, 1500);
  };

  return (
    <FormContainer title="Login to Your Account" navigate={navigate}>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
        <FormInput label="Email Address" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} Icon={Mail} />
        <FormInput label="Password" type="password" name="password" value={form.password} onChange={handleChange} error={errors.password} Icon={Key} />
        <PrimaryButton type="submit" onClick={handleSubmit} Icon={loading ? Loader2 : LogIn} disabled={loading}>
          {loading ? 'Authenticating...' : 'Sign In Securely'}
        </PrimaryButton>
      </form>
    </FormContainer>
  );
};

export default LoginForm;
