import React, { useState } from 'react';
import { User, Users, Calendar, Phone, Mail, Key, Briefcase, Hash, Loader2, Send } from 'lucide-react';
import FormContainer from '../components/FormContainer';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';

const initial = {
  firstname: '', lastname: '', gender: '', dob: '',
  phone_no: '', email: '', role: '', departmentName: '', password: ''
};
const genderOpts = [{value:'Male',label:'Male'}, {value:'Female',label:'Female'}, {value:'Other',label:'Other'}];
const roleOpts = [{value:'Staff',label:'Staff'}, {value:'Manager',label:'Manager'}, {value:'Admin',label:'Admin'}, {value:'Intern',label:'Intern'}];

const SignupForm = ({ navigate }) => {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    Object.keys(form).forEach(k => {
      if (!form[k]) errs[k] = `${k} is required.`;
    });
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format.';
    return errs;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Registration successful');
      setForm(initial);
    }, 2000);
  };

  return (
    <FormContainer title="Create a New Account" navigate={navigate}>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput label="First Name" type="text" name="firstname" value={form.firstname} onChange={handleChange} error={errors.firstname} Icon={User} />
        <FormInput label="Last Name" type="text" name="lastname" value={form.lastname} onChange={handleChange} error={errors.lastname} Icon={User} />
        <FormInput label="Gender" type="select" name="gender" value={form.gender} onChange={handleChange} error={errors.gender} options={genderOpts} Icon={Users} />
        <FormInput label="Date of Birth" type="date" name="dob" value={form.dob} onChange={handleChange} error={errors.dob} Icon={Calendar} />
        <FormInput label="Phone No." type="tel" name="phone_no" value={form.phone_no} onChange={handleChange} error={errors.phone_no} Icon={Phone} />
        <FormInput label="Email Address" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} Icon={Mail} />
        <FormInput label="Role" type="select" name="role" value={form.role} onChange={handleChange} error={errors.role} options={roleOpts} Icon={Briefcase} />
        <FormInput label="Department Name" type="text" name="departmentName" value={form.departmentName} onChange={handleChange} error={errors.departmentName} Icon={Hash} />
        <div className="md:col-span-2">
          <FormInput label="Password" type="password" name="password" value={form.password} onChange={handleChange} error={errors.password} Icon={Key} />
        </div>
        <div className="md:col-span-2">
          <PrimaryButton type="submit" Icon={loading ? Loader2 : Send} disabled={loading}>
            {loading ? 'Registering...' : 'Complete Registration'}
          </PrimaryButton>
        </div>
      </form>
    </FormContainer>
  );
};

export default SignupForm;
