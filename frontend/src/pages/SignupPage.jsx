import React, { useState } from 'react';
import { authAPI } from '../services/api';
import FormContainer from '../components/FormContainer';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import axios from "axios"

const initial = {
  firstName: '', lastName: '', gender: '', dob: '',
  phone_no: '', email: '', role: '', departmentName: '', password: ''
};

const genderOpts = [
  {value:'Male',label:'Male'}, 
  {value:'Female',label:'Female'}, 
  {value:'Other',label:'Other'}
];

const roleOpts = [
  {value:'Faculty',label:'Faculty'}, 
  {value:'Admin',label:'Admin'}
];

const SignupPage = ({ navigate, onSignup }) => {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName) errs.firstName = 'First Name is required.';
    if (!form.lastName) errs.lastName = 'Last Name is required.';
    if (!form.email) errs.email = 'Email is required.';
    if (!form.password) errs.password = 'Password is required.';
    if (!form.role) errs.role = 'Role is required.';
    if (!form.departmentName) errs.departmentName = 'Department is required.';
    if (!form.dob) errs.dob = 'Date of Birth is required.';
    if (!form.gender) errs.gender = 'Gender is required.';
    
    if (form.password && form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format.';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    
    setLoading(true);
    setErrors({});
    
    try {
      const response = await authAPI.signup({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        gender: form.gender,
        departmentName: form.departmentName,
        dob: form.dob,
        role: form.role,
        phone_no: form.phone_no || ''
      });

      alert('Registration successful! You can now login.');
      
      if (onSignup && response.token) {
        onSignup({
          facultyId: response.FacultyID,
          firstname: response.FirstName,
          lastname: response.LastName,
          email: response.Email,
          role: response.Role,
          token: response.token
        });
      }
      
      setForm(initial);
      navigate('login');
      
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to create account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer title="Create a New Account" navigate={navigate}>
      <form onSubmit={handleSubmit} className="form-grid">
        <FormInput label="First Name" type="text" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} />
        <FormInput label="Last Name" type="text" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} />
        <FormInput label="Gender" type="select" name="gender" value={form.gender} onChange={handleChange} error={errors.gender} options={genderOpts} />
        <FormInput label="Date of Birth" type="date" name="dob" value={form.dob} onChange={handleChange} error={errors.dob} />
        <FormInput label="Phone No." type="tel" name="phone_no" value={form.phone_no} onChange={handleChange} error={errors.phone_no} />
        <FormInput label="Email Address" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} />
        <FormInput label="Role" type="select" name="role" value={form.role} onChange={handleChange} error={errors.role} options={roleOpts} />
        <FormInput label="Department Name" type="text" name="departmentName" value={form.departmentName} onChange={handleChange} error={errors.departmentName} />
        <div className="form-full-width">
          <FormInput label="Password" type="password" name="password" value={form.password} onChange={handleChange} error={errors.password} />
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
            {loading ? 'Registering...' : 'Complete Registration'}
          </PrimaryButton>
        </div>
      </form>
    </FormContainer>
  );
};

export default SignupPage;