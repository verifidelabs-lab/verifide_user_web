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
          className="text-[16px] leading-[20px] text-[#00000080]/50 pb-2 font-medium"
        >
          {label}x``
          {required && <span className="text-red-500 ml-1">*</span>}
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
          className={`w-full h-[52px] rounded-[10px] border glassy-card p-4 placeholder-[#000000] 
            ${error ? "border-red-500" : "border-[#0000001A]"} 
            focus:border-[#A1A1A1] focus:outline-none`}
        />

        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center glassy-text-secondary cursor-pointer"
        >
          {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
        </span>
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;
