import React, { useEffect, useState } from "react";
import Select from "react-select";
import classNames from "classnames";

const FilterSelect = ({
  label = "Filter By",
  options = [],
  selectedOption,
  onChange,
  isMulti = false,
  containerClassName = "",
  selectClassName = "",
  labelClassName = "",
  placeholder = "Select...",
  error = false,
  required = false,
}) => {
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
      color: "var(--text-primary)",
    }),
    input: (base) => ({
      ...base,
      color: "var(--primary-color)", // 👈 text you type
      fontWeight: 500,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 20px",
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

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label
          className={`block text-sm glassy-text-primary font-medium mb-2 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* <Select
        isMulti={isMulti}
        options={Array.isArray(options) ? options : []}
        value={selectedOption}
        onChange={onChange}
        className={selectClasses}
        classNamePrefix="react-select"
        placeholder={placeholder}
        isSearchable
        styles={customStyles}
      /> */}
      <Select
        isMulti={isMulti}
        options={Array.isArray(options) ? options : []}
        value={selectedOption}
        onChange={onChange}
        className={selectClasses}
        classNamePrefix="react-select"
        placeholder={placeholder}
        isSearchable
        styles={customStyles}
        menuPortalTarget={document.body} // 👈 this line fixes invisible menus
        menuPosition="fixed"
        menuShouldScrollIntoView={false}
      />
    </div>
  );
};

export default React.memo(FilterSelect);
