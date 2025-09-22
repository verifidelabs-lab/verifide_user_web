import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const OpenToWorkSelect = ({
  label = "Open to work",
  options,
  onSelect,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between xl:w-[170px] ld:w-28 px-2 py-2 md:text-sm text-xs bg-[#2563EB1A]/10 font-medium text-gray-700  border border-gray-200 rounded-lg shadow-sm hover:bg-blue-100 transition-all duration-200"
      >
        <span>
          {value
            ? value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
            : label}
        </span>
        <FiChevronDown
          className={` text-gray-600 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute md:w-[170px] w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="py-1 text-sm text-gray-700">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className="px-2 py-1 cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 md:text-sm text-xs"
              >
                {option.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OpenToWorkSelect;
