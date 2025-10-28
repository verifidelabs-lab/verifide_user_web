import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const PasswordInput = ({
  label,
  value = "",
  onChange = () => {},
  className = "",
  name,
  placeholder = "",
  disabled = false,
  error = "",
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="glassy-text-primary font-medium text-base mb-2"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`glassy-input pr-10`}
        />

        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 flex items-center cursor-pointer right-3 glassy-text-secondary"
        >
          {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
        </span>
      </div>

      {error && <p className="glassy-text-secondary text-xs mt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;
