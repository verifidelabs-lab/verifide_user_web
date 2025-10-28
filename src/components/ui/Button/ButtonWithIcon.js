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
    <div className="relative inline-block text-left"  >
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between xl:w-[170px] lg:w-40 w-36
                   px-3 py-2 md:text-sm text-xs rounded-xl font-medium
                   glassy-card glassy-text-primary border border-[var(--border-color)]
                   shadow-sm hover:glassy-hover transition-all duration-300 ease-out"
      >
        <span className="truncate">
          {value
            ? value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
            : label}
        </span>
        <FiChevronDown
          className={`text-[var(--text-secondary)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 md:w-[170px] w-40
                     glassy-card-header rounded-2xl border-[var(--border-color)]
                     shadow-xl z-50 overflow-hidden animate-fade-in backdrop-blur-md"
        >
          <ul className="py-1 text-sm">
            {options.length > 0 ? (
              options.map((option) => (
                <li
                  key={option}
                  onClick={() => handleSelect(option)}
                  className="px-4 py-2 glassy-text-primary cursor-pointer 
                             hover:bg-[var(--bg-card)] transition-all duration-200
                             md:text-sm text-xs"
                >
                  {option.replace(/_/g, " ").replace(/\b\w/g, (c) =>
                    c.toUpperCase()
                  )}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm glassy-text-secondary">
                No options found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>

  );
};

export default OpenToWorkSelect;
