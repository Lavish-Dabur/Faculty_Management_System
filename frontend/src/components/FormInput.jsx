import React from 'react';

const FormInput = ({ label, type = 'text', name, value, onChange, error, options = [], icon: Icon, placeholder, required = false }) => {
  const isSelect = type === 'select';
  const isTextarea = type === 'textarea';
  
  const inputClasses = `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
    error ? 'border-red-500' : 'border-gray-300'
  } ${Icon ? 'pl-10' : ''}`;
  
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        {isSelect ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses}
            required={required}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : isTextarea ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses}
            placeholder={placeholder || label}
            required={required}
            rows={4}
          />
        ) : (
          <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses}
            placeholder={placeholder || label}
            required={required}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput;