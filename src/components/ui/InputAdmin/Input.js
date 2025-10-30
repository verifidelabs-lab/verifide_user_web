import React from "react";

const Input = ({
  label,
  value = "",
  onChange = () => { },
  className = "",
  type = "text",
  name,
  placeholder = "",
  disabled = false,
  error = "",
  required = false,
  options = [],
  ...rest
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="mb-1 text-sm font-medium glassy-text-primary"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-xl text-sm glassy-input
        ${error ? 'border-red-500' : 'border-[var(--border-color)]'} 
        focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
          {...rest}
        >
          {options.map((option, idx) => (
            <option key={idx} value={option === 'Select' ? '' : option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 pr-10 border rounded-xl text-sm glassy-input placeholder:glassy-text-secondary
        ${error ? 'border-red-500' : 'border-[var(--border-color)]'} 
        focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
          {...rest}
        />
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>

  );
};

export default Input;