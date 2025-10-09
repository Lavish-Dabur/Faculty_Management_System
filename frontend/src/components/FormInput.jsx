import React, { useMemo } from 'react';

const FormInput = ({ label, type, name, value, onChange, error, options = [], Icon }) => {
  const isSelect = type === 'select';
  const baseType = useMemo(() => {
    if (isSelect) return 'text';
    if (['tel','date','email','password'].includes(type)) return type;
    return 'text';
  }, [type, isSelect]);

  const inputClasses = `
    w-full p-3 pl-12 border-2 transition-all duration-150
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-cyan-500 focus:ring-cyan-500'}
    rounded-lg bg-white text-gray-800 focus:ring-4 focus:ring-opacity-50
  `;

  return (
    <div className="flex flex-col relative">
      <label htmlFor={name} className="block mb-2 text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />}
        {isSelect ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses.replace('pl-12', Icon ? 'pl-12' : 'pl-4')}
          >
            <option value="" disabled>Select {label.toLowerCase()}</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
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
          />
        )}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput;
