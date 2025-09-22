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
          className="mb-2 text-sm font-medium text-[#1E293B]"
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
          className={`w-full px-3 py-3 border rounded-lg text-sm focus:outline-none focus:ring-0  bg-transparent
            ${error ? 'border-red-500' : 'border-[#0000001A]'} focus:border-[#A1A1A1]`}
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
          className={`w-full px-3 py-3 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-0 placeholder-[#475569] placeholder:font-medium 
            ${error ? 'border-red-500' : 'border-[#0000001A]'} focus:border-[#A1A1A1]`}
          {...rest}
        />
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;