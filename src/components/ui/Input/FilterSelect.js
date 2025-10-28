import React, { useState } from "react";
import classNames from "classnames";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

const FilterSelect = React.forwardRef(
  (
    {
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
      isCreatedByUser = false,
      onCreateOption,
      formatCreateLabel = (inputValue) => `Create "${inputValue}"`,
      isClearable = true,
      isDisabled,
      disabledTooltip = "",
    },
    ref
  ) => {
    const [isInternalLoading, setInternalLoading] = useState(false);

    const selectClasses = classNames(
      "h-[50px] opacity-100 rounded-[10px] border w-full glassy-input !p-0",
      selectClassName
    );

    const customStyles = {
      control: (base, state) => ({
        ...base,
        borderRadius: "10px",
        borderColor: "var(--border-color)",
        minHeight: "52px",
        opacity: 1,
        backgroundColor: "var(--bg-card)",
        color: "var(--text-primary)",
        boxShadow: state.isFocused ? `0 0 0 1px var(--bg-button-hover)` : "none",
        "&:hover": {
          borderColor: "var(--bg-button-hover)",
        },
      }),
      placeholder: (base) => ({
        ...base,
        color: "var(--text-secondary)",
        opacity: 0.7,
      }),
      singleValue: (base) => ({
        ...base,
        color: "var(--text-primary)",
      }),
      multiValue: (base) => ({
        ...base,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: "4px",
      }),
      multiValueLabel: (base) => ({
        ...base,
        color: "var(--text-primary)",
      }),
      multiValueRemove: (base) => ({
        ...base,
        color: "var(--text-secondary)",
        ":hover": {
          backgroundColor: "var(--bg-button-hover)",
          color: "var(--text-primary)",
        },
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: "var(--bg-card)",
        color: "var(--text-primary)",
        borderRadius: "0.5rem",
      }),
      menuList: (base) => ({
        ...base,
        maxHeight: "200px",
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "var(--bg-button-hover)" : "var(--bg-card)",
        color: "var(--text-primary)",
        cursor: "pointer",
      }),
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    };

    const handleChange = async (selectedOption, actionMeta) => {
      setInternalLoading(true);
      try {
        await onChange(selectedOption, actionMeta);
      } finally {
        setInternalLoading(false);
      }
    };

    const handleCreate = (inputValue) => {
      if (onCreateOption && isCreatedByUser) {
        onCreateOption(inputValue, name);
      }
    };

    const SelectComponent = isCreatedByUser ? CreatableSelect : Select;

    return (
      <div className={`w-full space-y-2 ${containerClassName}`}>
        <label
          className={`text-base font-medium flex items-center gap-1 glassy-text-primary ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 text-sm">*</span>}
        </label>

        <div title={isDisabled ? disabledTooltip : ""} className="relative w-full" ref={ref}>
          <SelectComponent
            isMulti={isMulti}
            options={Array.isArray(options) ? options : []}
            value={selectedOption}
            onChange={handleChange}
            onCreateOption={isCreatedByUser ? handleCreate : undefined}
            className={selectClasses}
            classNamePrefix="react-select"
            placeholder={placeholder}
            isSearchable
            styles={customStyles}
            menuPortalTarget={document.body}
            menuPosition="absolute"
            isLoading={isLoading || isInternalLoading}
            loadingMessage={() => "Loading..."}
            formatCreateLabel={isCreatedByUser ? formatCreateLabel : undefined}
            isClearable={isClearable}
            closeMenuOnSelect={!isMulti}
            isDisabled={isDisabled}
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

export default React.memo(FilterSelect);
