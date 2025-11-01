import React from "react";
import { BiPaperclip } from "react-icons/bi";

const CustomFileInput = ({
  label = "Attach File",
  required = false,
  placeholder = "Choose File ",
  onChange,
  value,
  error = ""
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div className="w-full">
      <label className="block text-base text-[#282828] font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          type="file"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className={`flex items-center justify-between w-full h-[41px] rounded-[10px] border px-4 glassy-text-primary 
            ${error ? "border-red-500" : "border-[#0000001A]"} 
            focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <span className={`truncate ${value ? "glassy-text-primary" : "glassy-text-secondary"} max-w-[90%]`}>
            {value || placeholder}
          </span>
          <BiPaperclip className="w-5 h-5 glassy-text-secondary" />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CustomFileInput;
