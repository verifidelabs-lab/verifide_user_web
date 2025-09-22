import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const PasswordInput = ({
  label,
  value = "",
  onChange = () => { },
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
          className="text-[#282828] font-medium text-base leading-5  align-middle mb-2"
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
          className={`${className} opacity-100 rounded-[10px] border border-[#0000001A] bg-white px-4 transition-all duration-200 ease-in-out
  ${error ? 'border-red-500' : 'border-[#0000001A]'} focus:border-[#A1A1A1]`}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 flex items-center text-gray-500 cursor-pointer right-3"
        >
          {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
        </span>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PasswordInput;
