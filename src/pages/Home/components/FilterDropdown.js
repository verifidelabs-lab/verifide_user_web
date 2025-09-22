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
    <div className="relative inline-block " ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-between space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50  outline-none w-full"
      >
        <TbAdjustmentsHorizontal className="w-5 h-5 text-gray-600" />
        <span className="text-gray-700">{selectedLabel}</span>
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3">
            <h3 className="text-sm font-medium text-[#000000E6] mb-3">Filter By</h3>
            <div className=" max-h-36 overflow-auto pr-1">
              {tabs.length > 0 ? (
                tabs.map(({ label, value }) => (
                  <label
                    key={value}
                    className="flex items-center space-x-3 px-3 py-1 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={tabActive === value}
                      onChange={() => handleSelect(value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span
                      className={`text-xs font-semibold ${tabActive === value ? "text-blue-600 hover:text-blue-400" : "text-gray-700 hover:text-gray-500"
                        }`}
                    >
                      {label}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-400 px-3">No results found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown