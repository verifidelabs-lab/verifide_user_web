// import React, { useState } from 'react';
// import classNames from 'classnames';
// import Select from 'react-select';

// const FilterSelect2 = ({
//   label = 'Filter By',
//   name,
//   options = [],
//   selectedOption,
//   onChange,
//   isMulti = false,
//   containerClassName = '',
//   selectClassName = '',
//   labelClassName = '',
//   placeholder = 'Select...',
//   error = false,
//   isLoading = false,
//   required = false,
//   isCreatable = false, // <--- new prop
//   onCreateOption,
// }) => {
//   const [isInternalLoading, setInternalLoading] = useState(false);

//   const selectClasses = classNames(
//     'opacity-100 rounded-[10px] w-full max-h-[100px] overflow-hidden overflow-y-auto',
//     {
//       'border-gray-300': !error,
//       'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500': error,
//     },
//     selectClassName
//   );

//   const customStyles = {
//     multiValue: (base) => ({
//       ...base,
//       backgroundColor: '#F9F9F9',
//       borderRadius: '30px',
//       padding: '2px 6px',
//       border: '1px solid #E5E5E5',
//       display: 'flex',
//       alignItems: 'center',
//     }),
//     multiValueLabel: (base) => ({
//       ...base,
//       color: '#1F2937',
//       fontWeight: 500,
//       fontSize: '10px',
//       padding: '0 8px',
//     }),
//     multiValueRemove: (base) => ({
//       ...base,
//       color: '#EF4444',
//       backgroundColor: '#FEE2E2',
//       borderRadius: '50%',
//       width: '18px',
//       height: '18px',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       fontSize: '12px',
//       cursor: 'pointer',
//       '&:hover': {
//         backgroundColor: '#FCA5A5',
//         color: '#FFF',
//       },
//     }),
//     control: (base) => ({
//       ...base,
//       backgroundColor: '#FFFFFF',
//       borderRadius: '10px',
//       borderColor: error ? '#f87171' : '#0000001A',
//       minHeight: '40px',
//       boxShadow: 'none',
//       paddingLeft: '10px',
//       '&:hover': {
//         borderColor: error ? '#f87171' : '#d4d4d8',
//       },
//     }),
//     valueContainer: (base) => ({
//       ...base,
//       padding: '0 8px',
//       color: '#000000',
//     }),
//     placeholder: (base) => ({
//       ...base,
//       color: '#000000',
//       opacity: 0.7,
//       fontWeight: 400,
//     }),
//     singleValue: (base) => ({
//       ...base,
//       color: '#000000',
//       fontWeight: 400,
//     }),
//     dropdownIndicator: (base) => ({
//       ...base,
//       color: '#000000',
//       paddingRight: '10px',
//     }),
//     indicatorSeparator: () => ({
//       display: 'none',
//     }),
//     loadingIndicator: (base) => ({
//       ...base,
//       color: '#000000',
//     }),
//   };

//   const handleChange = async (selectedOption, actionMeta) => {
//     setInternalLoading(true);
//     try {
//       await onChange(selectedOption, actionMeta);
//     } finally {
//       setInternalLoading(false);
//     }
//   };

//   const SelectComponent = isCreatable ? "" : Select;

//   return (
//     <div className={`w-full space-y-2 ${containerClassName}`}>
//       <label className={`text-base text-[#282828] font-medium flex items-center gap-1 ${labelClassName}`}>
//         {label}
//         {required && <span className="text-red-500 text-sm">*</span>}
//       </label>
//       <SelectComponent
//         isMulti={isMulti}
//         options={Array.isArray(options) ? options : []}
//         value={selectedOption}
//         onChange={handleChange}
//         className={selectClasses}
//         classNamePrefix="react-select"
//         placeholder={placeholder}
//         isSearchable
//         styles={{
//           ...customStyles,
//           menuPortal: (base) => ({
//             ...base,
//             zIndex: 9999,
//           }),
//         }}
//         menuPortalTarget={document.body}
//         menuPosition="absolute"
//         isLoading={isLoading || isInternalLoading}
//         loadingMessage={() => 'Loading...'}
//         closeMenuOnSelect={!isMulti}
//       />
//       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//     </div>
//   );
// };

// export default React.memo(FilterSelect2);
import React, { useState, useEffect } from "react";
import classNames from "classnames";
import Select from "react-select";

const FilterSelect2 = ({
  label = "Filter By",
  name,
  options = [],
  selectedOption,
  onChange,
  isMulti = false,
  containerClassName = "",
  selectClassName = "",
  labelClassName = "",
  placeholder = "Select...",
  error = false,
  isLoading = false,
  required = false,
  isCreatable = false,
  onCreateOption,
  isClearable,
}) => {
  const [isInternalLoading, setInternalLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // detect dark theme dynamically
    const observer = new MutationObserver(() => {
      const isDarkTheme =
        document.documentElement.getAttribute("data-theme") === "dark";
      setIsDark(isDarkTheme);
    });
    observer.observe(document.documentElement, { attributes: true });
    setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    return () => observer.disconnect();
  }, []);

  const selectClasses = classNames(
    "opacity-100 rounded-xl w-full overflow-hidden backdrop-blur-lg border transition-all duration-300",
    {
      "border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)]": true,
      "ring-1 ring-red-500": error,
    },
    selectClassName
  );

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "var(--bg-card)",
      borderColor: error
        ? "#ef4444"
        : state.isFocused
        ? "var(--bg-button-hover)"
        : "var(--border-color)",
      borderRadius: "10px",
      minHeight: "40px",
      boxShadow: "none",
      color: "var(--text-primary)",
      backdropFilter: "blur(20px)",
      "&:hover": {
        borderColor: "var(--bg-button-hover)",
      },
    }),
    input: (base) => ({
      ...base,
      color: isDark ? "#FFFFFF" : "var(--text-primary)",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "var(--bg-modal)",
      backdropFilter: "blur(25px) saturate(180%)",
      borderRadius: "10px",
      border: "1px solid var(--border-color)",
      zIndex: 50,
      marginTop: "4px",
      boxShadow: isDark
        ? "0 8px 24px rgba(0,0,0,0.5)"
        : "0 8px 24px rgba(0,0,0,0.1)",
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? "rgba(255,255,255,0.1)"
        : "transparent",
      color: "var(--text-primary)",
      cursor: "pointer",
      transition: "all 0.2s",
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.15)",
      },
    }),

    singleValue: (base) => ({
      ...base,
      color: "var(--text-primary)",
      fontWeight: 400,
    }),

    placeholder: (base) => ({
      ...base,
      color: "var(--text-secondary)",
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "0 8px",
    }),

    dropdownIndicator: (base) => ({
      ...base,
      color: "var(--text-primary)",
      paddingRight: "10px",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    multiValue: (base) => ({
      ...base,
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      borderRadius: "20px",
      border: "1px solid var(--border-color)",
      padding: "2px 6px",
      display: "flex",
      alignItems: "center",
    }),

    multiValueLabel: (base) => ({
      ...base,
      color: "var(--text-primary)",
      fontWeight: 500,
      fontSize: "11px",
      padding: "0 6px",
    }),

    multiValueRemove: (base) => ({
      ...base,
      color: isDark ? "#ff7070" : "#ef4444",
      borderRadius: "50%",
      width: "18px",
      height: "18px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: isDark
          ? "rgba(255,100,100,0.2)"
          : "rgba(252,165,165,0.4)",
        color: "#fff",
      },
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const handleChange = async (selectedOption, actionMeta) => {
    setInternalLoading(true);
    try {
      await onChange(selectedOption, actionMeta);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className={`w-full space-y-2 ${containerClassName}`}>
      <label
        className={`text-sm font-medium glassy-text-primary flex items-center gap-1 ${labelClassName}`}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <Select
        isMulti={isMulti}
        options={Array.isArray(options) ? options : []}
        value={selectedOption}
        key={`${name}-${JSON.stringify(selectedOption || "")}`}
        onChange={handleChange}
        className={selectClasses}
        classNamePrefix="react-select"
        placeholder={placeholder}
        isSearchable
        styles={customStyles}
        menuPortalTarget={document.body}
        menuPosition="absolute"
        isLoading={isLoading || isInternalLoading}
        loadingMessage={() => "Loading..."}
        closeMenuOnSelect={!isMulti}
        isClearable={isClearable}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default React.memo(FilterSelect2);
