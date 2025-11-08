import React from 'react';

const FormInput = ({ label, type, name, value, onChange, error, options = [], icon: Icon }) => {
  const isSelect = type === 'select';
  
  return (
    <div className={`form-group ${isSelect ? 'form-full-width' : ''}`}>
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <div className="form-input-wrapper">
        {Icon && <Icon className="form-input-icon" />}
        {isSelect ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`form-select ${error ? 'error' : ''}`}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`form-input ${error ? 'error' : ''}`}
            placeholder={label}
          />
        )}
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default FormInput;