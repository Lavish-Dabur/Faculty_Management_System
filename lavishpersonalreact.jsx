import React, { useState, useCallback, useMemo } from 'react';
import { 
  LogIn, UserPlus, Send, Home, Loader2, ArrowLeft, Database, User, 
  Mail, Key, Calendar, Phone, Briefcase, Users, Hash, Zap
} from 'lucide-react';

// --- Placeholder Images & Assets ---
// Using a central, symbolic graphic instead of a wide, generic banner
const CENTRAL_ILLUSTRATION = "https://placehold.co/200x200/4f46e5/ffffff?text=U+M+S&font=montserrat"; 

// --- Utility Components and Functions ---

/**
 * Custom Button component for consistent, impressive styling and icon support.
 */
const PrimaryButton = ({ children, onClick, color = 'bg-indigo-600', Icon, disabled = false, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`
      w-full text-white ${color} transition-all duration-200 
      font-semibold rounded-xl text-lg px-6 py-3 shadow-lg flex items-center justify-center gap-2
      ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-opacity-90 active:scale-[0.98] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-300'}
    `}
  >
    {disabled && Icon && Icon === Loader2 ? <Loader2 className="animate-spin h-5 w-5" /> : (Icon && <Icon className="h-5 w-5" />)}
    {children}
  </button>
);

/**
 * Enhanced Input Field component with icons and modern focus states.
 */
const FormInput = ({ label, type, name, value, onChange, error, options = [], Icon }) => {
  const isSelect = type === 'select';
  const inputClasses = `
    w-full p-3 pl-12 border-2 transition-all duration-150 
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-cyan-500 focus:ring-cyan-500'} 
    rounded-lg bg-white text-gray-800 focus:ring-4 focus:ring-opacity-50
  `;
  
  const baseType = useMemo(() => {
    if (isSelect) return 'text';
    if (type === 'tel' || type === 'date') return type;
    return ['email', 'password'].includes(type) ? type : 'text';
  }, [type, isSelect]);

  return (
    <div className="flex flex-col relative">
      <label htmlFor={name} className="block mb-2 text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        )}
        {isSelect ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses.replace('pl-12', Icon ? 'pl-12' : 'pl-4')}
          >
            <option value="" disabled>Select {label.toLowerCase()}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            type={baseType}
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses.replace('pl-12', Icon ? 'pl-12' : 'pl-4')}
            placeholder={label}
            style={baseType === 'date' ? { paddingLeft: Icon ? '3rem' : '1rem' } : {}}
          />
        )}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
};

// --- View Components ---

/**
 * 1. Home Page: Main entry point with a cleaner, action-focused design.
 */
const HomePage = ({ navigate }) => {
  return (
    <div className="text-center p-8 bg-white rounded-xl">
      <img 
        src={CENTRAL_ILLUSTRATION} 
        alt="UMS Logo Graphic" 
        className="w-24 h-24 mx-auto mb-6 rounded-full shadow-lg border-4 border-indigo-100" 
        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x200/4f46e5/ffffff?text=U+M+S"; }}
      />
      
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        User Management System
      </h1>
      <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto">
        Select an operation below to securely manage user profiles or access authorized data records.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Update Information Card (No image header) */}
        <div className="p-8 bg-indigo-50 border border-indigo-300 rounded-xl shadow-lg transition-shadow hover:shadow-2xl">
          <Zap className="h-8 w-8 text-indigo-700 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-indigo-800 mb-2">
            Update Records
          </h3>
          <p className="text-gray-600 mb-6 text-sm">
            Sign in or create a new profile to modify and manage user data.
          </p>
          <PrimaryButton 
            onClick={() => navigate('auth_gate')} 
            color="bg-indigo-600"
            Icon={LogIn}
          >
            Update Information
          </PrimaryButton>
        </div>

        {/* Retrieve Information Card (No image header) */}
        <div className="p-8 bg-cyan-50 border border-cyan-300 rounded-xl shadow-lg transition-shadow hover:shadow-2xl">
          <Database className="h-8 w-8 text-cyan-700 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-cyan-800 mb-2">
            View Data
          </h3>
          <p className="text-gray-600 mb-6 text-sm">
            Access authorized data sets and view public user information.
          </p>
          <PrimaryButton 
            onClick={() => navigate('retrieve')} 
            color="bg-cyan-600"
            Icon={Database}
          >
            Retrieve Information
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Auth Gate: Shows Login or Signup selection.
 */
const AuthGate = ({ navigate }) => {
  return (
    <div className="p-6 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Authentication Gateway
      </h2>
      <p className="text-gray-600 mb-10">
        Welcome! Select your path to continue to the update section.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 max-w-md mx-auto">
        <div className="flex-1">
          <PrimaryButton onClick={() => navigate('login')} color="bg-blue-600" Icon={LogIn}>
            Login
          </PrimaryButton>
        </div>
        <div className="flex-1">
          <PrimaryButton onClick={() => navigate('signup')} color="bg-purple-600" Icon={UserPlus}>
            Sign Up
          </PrimaryButton>
        </div>
      </div>

      <button
        onClick={() => navigate('home')}
        className="mt-10 text-sm text-gray-500 hover:text-indigo-600 block mx-auto transition-colors flex items-center justify-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </button>
    </div>
  );
};

/**
 * Reusable container for Login/Signup forms with enhanced styling.
 */
const FormContainer = ({ children, title, navigate, backView = 'auth_gate' }) => (
  <div className="p-6 md:p-8 bg-white rounded-xl">
    <button
        onClick={() => navigate(backView)}
        className="text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6 inline-flex items-center font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Selection
      </button>

    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-indigo-200 pb-3">
      {title}
    </h2>
    {children}
  </div>
);

/**
 * 3. Login Form: Simple email/password form with loading state.
 */
const LoginForm = ({ navigate }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required.';
    if (!formData.password) newErrors.password = 'Password is required.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } 

    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      console.log('Login successful with data:', formData);
      alert('Login successful! See console for data.');
    }, 1500);
  };

  return (
    <FormContainer title="Login to Your Account" navigate={navigate}>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          Icon={Mail}
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          Icon={Key}
        />
        <div className="pt-4">
          <PrimaryButton type="submit" Icon={loading ? Loader2 : LogIn} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In Securely'}
          </PrimaryButton>
        </div>
      </form>
    </FormContainer>
  );
};

/**
 * 4. Signup Form: Complex 9-field registration form with streamlined flow (no internal sections).
 */
const initialSignupState = {
  firstname: '', lastname: '', gender: '', dob: '', role: '',
  phone_no: '', email: '', password: '', departmentName: ''
};

const SignupForm = ({ navigate }) => {
  const [formData, setFormData] = useState(initialSignupState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} is required.`;
      }
    });
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format.';
    if (formData.password && formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (formData.phone_no && !/^\d{10,15}$/.test(formData.phone_no)) newErrors.phone_no = 'Phone number must be 10-15 digits.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      console.log('Signup data validated and ready for submission:', formData);
      alert('Registration successful! See console for submitted data.');
      setFormData(initialSignupState); 
    }, 2000);
  };

  const genderOptions = [{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }];
  const roleOptions = [{ value: 'Staff', label: 'Staff' }, { value: 'Manager', label: 'Manager' }, { value: 'Admin', label: 'Admin' }, { value: 'Intern', label: 'Intern' }];

  return (
    <FormContainer title="Create a New Account" navigate={navigate}>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        
        {/* Row 1: Name */}
        <FormInput label="First Name" type="text" name="firstname" value={formData.firstname} onChange={handleChange} error={errors.firstname} Icon={User} />
        <FormInput label="Last Name" type="text" name="lastname" value={formData.lastname} onChange={handleChange} error={errors.lastname} Icon={User} />
        
        {/* Row 2: Gender/DOB */}
        <FormInput label="Gender" type="select" name="gender" value={formData.gender} onChange={handleChange} error={errors.gender} options={genderOptions} Icon={Users} />
        <FormInput label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} error={errors.dob} Icon={Calendar} />
        
        {/* Row 3: Contact */}
        <FormInput label="Phone No." type="tel" name="phone_no" value={formData.phone_no} onChange={handleChange} error={errors.phone_no} Icon={Phone} />
        <FormInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} Icon={Mail} />
        
        {/* Row 4: Professional */}
        <FormInput label="Role" type="select" name="role" value={formData.role} onChange={handleChange} error={errors.role} options={roleOptions} Icon={Briefcase} />
        <FormInput label="Department Name" type="text" name="departmentName" value={formData.departmentName} onChange={handleChange} error={errors.departmentName} Icon={Hash} />

        {/* Row 5: Credentials (Full Width) */}
        <div className="md:col-span-2">
          <FormInput label="Password (Min 8 characters)" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} Icon={Key} />
        </div>

        {/* Submit Button (Full Width) */}
        <div className="md:col-span-2 pt-6">
          <PrimaryButton type="submit" Icon={loading ? Loader2 : Send} disabled={loading}>
            {loading ? 'Registering...' : 'Complete Registration'}
          </PrimaryButton>
        </div>
      </form>
    </FormContainer>
  );
};

/**
 * 5. Retrieve Page: Placeholder with enhanced styling and a central image.
 */
const RetrievePage = ({ navigate }) => {
    // Placeholder image for data visualization
    const DATA_VIZ_IMAGE = "https://placehold.co/800x400/059669/ffffff?text=DATA+ANALYTICS+VISUALIZATION";
    
    return (
      <div className="p-8 text-center bg-white rounded-xl">
        <img 
          src={DATA_VIZ_IMAGE} 
          alt="Data Visualization" 
          className="w-full max-w-2xl mx-auto rounded-xl shadow-lg mb-8" 
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x200/059669/ffffff?text=DATA+ANALYTICS+VISUALIZATION"; }} 
        />
        <Database className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Data Retrieval Center
        </h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          This page would typically feature search filters, query tools, and secure data access interfaces. The image above represents the output of modern analytics.
        </p>
        <div className="mt-10 max-w-xs mx-auto">
          <PrimaryButton onClick={() => navigate('home')} color="bg-gray-500" Icon={ArrowLeft}>
            Go Back Home
          </PrimaryButton>
        </div>
      </div>
    );
};


/**
 * Main App Component managing the single-page routing state.
 */
const App = () => {
  // Simulate routing using local state: 'home', 'auth_gate', 'login', 'signup', 'retrieve'
  const [currentView, setCurrentView] = useState('home');

  const navigate = useCallback((view) => {
    setCurrentView(view);
  }, []);

  let Content;
  switch (currentView) {
    case 'auth_gate':
      Content = <AuthGate navigate={navigate} />;
      break;
    case 'login':
      Content = <LoginForm navigate={navigate} />;
      break;
    case 'signup':
      Content = <SignupForm navigate={navigate} />;
      break;
    case 'retrieve':
      Content = <RetrievePage navigate={navigate} />;
      break;
    case 'home':
    default:
      Content = <HomePage navigate={navigate} />;
      break;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100 flex items-center justify-center p-4">
      <style>{`
        /* Load Inter font for clean modern look */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border-4 border-white transform transition-all duration-300">
        <div className="p-6 md:p-12">
          {Content}
        </div>
      </div>
    </div>
  );
};

export default App;
