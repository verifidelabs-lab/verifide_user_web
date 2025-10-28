import React, { useEffect, useRef, useState } from 'react'
import { TbAdjustmentsHorizontal } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

const FilterDropdown = ({ tabs, tabActive, setTabActive }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleSelect = (value) => {
    setShowDropdown(false);
    if (value === "my-post") {
      navigate("/user/posts");
    } else {
      setTabActive(value);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLabel = tabs.find((tab) => tab.value === tabActive)?.label || "Select Filter";

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-between space-x-2 px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-card)] glassy-card w-full transition-colors outline-none"
      >
        <TbAdjustmentsHorizontal className="w-5 h-5 text-[var(--text-secondary)]" />
        <span className="text-[var(--text-primary)]">{selectedLabel}</span>
        <svg
          className="w-4 h-4 text-[var(--text-secondary)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-44 glassy-card-header rounded-lg shadow-lg border-[var(--border-color)] z-50 overflow-hidden">
          <div className="p-3">
            <h3 className="text-sm font-medium glassy-text-primary mb-3">Filter By</h3>
            <div className="max-h-36 overflow-auto pr-1">
              {tabs.length > 0 ? (
                tabs.map(({ label, value }) => (
                  <label
                    key={value}
                    className="flex items-center space-x-3 px-3 py-1 rounded-md cursor-pointer hover:bg-[var(--bg-card)] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={tabActive === value}
                      onChange={() => handleSelect(value)}
                      className="w-4 h-4 text-blue-600 border-[var(--border-color)] rounded focus:ring-blue-500"
                    />
                    <span
                      className={`text-xs font-semibold transition-colors ${tabActive === value
                          ? "text-blue-600 hover:text-blue-400"
                          : "glassy-text-secondary hover:glassy-text-primary"
                        }`}
                    >
                      {label}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-sm glassy-text-secondary px-3">No results found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default FilterDropdown