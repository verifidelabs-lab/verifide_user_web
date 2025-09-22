import React from "react";
import { RiArrowDownSLine } from "react-icons/ri";

const Dropdown = ({
  options = [],
  value = "",
  onChange = () => { },
  className = "",
  disabled = false,
  placeholder = "Select an option",
  name = "",
  id = "",
  label = "",
  error = "",
  mainClassName = "",
  required = false,
  isMulti = false,
  showIcon = true,
  // maxOptionsVisible = 10,
  ...rest
}) => {
  return (
    <div className={`relative w-full ${mainClassName}`}>
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-[#1E293B]"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          name={name}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full appearance-none px-3 py-3 border border-[#D8D8D8] rounded-lg text-sm text-[#212121]
            focus:outline-none focus:ring-0 focus:border-[#D8D8D8] bg-transparent pr-10 overflow-y-auto ${className}`}
          isMulti
          // size={options.length > maxOptionsVisible ? maxOptionsVisible : undefined}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option, index) =>
            typeof option === "object" ? (
              <option key={index} value={option.value} className="text-[#212121] font-medium">
                {option.label}
              </option>
            ) : (
              <option key={index} value={option} className="text-[#212121] font-medium">
                {option}
              </option>
            )
          )}
        </select>

        {/* Custom dropdown icon */}
        {showIcon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <RiArrowDownSLine size={22} className="text-[#212121]" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default Dropdown;