import React, { useState } from 'react';
import classNames from 'classnames';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

const FilterSelect = ({
  label = 'Filter By',
  name,
  options = [],
  selectedOption,
  onChange,
  isMulti = false,
  containerClassName = '',
  selectClassName = '',
  labelClassName = '',
  placeholder = 'Select...',
  error = false,
  isLoading = false,
  required = false,
  isCreatedByUser = false,   // <-- new prop
  onCreateOption,
  formatCreateLabel = (inputValue) => `Create "${inputValue}"`,
  isClearable = true,
  isDisabled,
  disabledTooltip = '',
}) => {
  const [isInternalLoading, setInternalLoading] = useState(false);
  const selectClasses = classNames(
    'h-[50px] opacity-100 rounded-[10px] border w-full',
    {
      'border-gray-300': !error,
      'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500': error,
    },
    selectClassName
  );

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '10px',
      borderColor: error ? '#f87171' : '#d1d5db', // red-300 or gray-300
      minHeight: '52px',
      opacity: 1,
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none', // blue ring on focus
      '&:hover': {
        borderColor: error ? '#f87171' : '#9ca3af',
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: '#000000',
      opacity: 0.5,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#374151',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#6b7280',
      ':hover': {
        backgroundColor: '#f87171',
        color: 'white',
      },
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

  const handleCreate = (inputValue) => {
    if (onCreateOption && isCreatedByUser) {
      onCreateOption(inputValue, name);
    }
  };

  // Use CreatableSelect only if allowed
  const SelectComponent = isCreatedByUser ? CreatableSelect : Select;

  return (
    <div className={`w-full space-y-2 ${containerClassName}`}>
      <label className={`text-base text-[#282828] font-medium flex items-center gap-1 ${labelClassName}`}>
        {label}
        {required && <span className="text-red-500 text-sm">*</span>}
      </label>

      {/* Wrapper with tooltip */}
      <div title={isDisabled ? disabledTooltip : ''} className="relative w-full">
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
          styles={{
            ...customStyles,
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
          menuPortalTarget={document.body}
          menuPosition="absolute"
          isLoading={isLoading || isInternalLoading}
          loadingMessage={() => 'Loading...'}
          formatCreateLabel={isCreatedByUser ? formatCreateLabel : undefined}
          isClearable={isClearable}
          closeMenuOnSelect={!isMulti}
          isDisabled={isDisabled}
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default React.memo(FilterSelect);
