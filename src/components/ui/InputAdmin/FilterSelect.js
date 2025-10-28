import React from 'react';
import Select from 'react-select';
import classNames from 'classnames';

const FilterSelect = ({
  label = 'Filter By',
  options = [],
  selectedOption,
  onChange,
  isMulti = false,
  containerClassName = '',
  selectClassName = '',
  labelClassName = '',
  placeholder = 'Select...',
  error = false,
  required = false,
}) => {
  const selectClasses = classNames(
    'rounded-[10px] w-full text-sm',
    {
      'border border-gray-300': !error,
      'border border-red-300 text-red-900': error,
    },
    selectClassName
  );

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '10px',
      borderColor: error ? 'var(--border-color)' : 'var(--border-color)',
      minHeight: '50px',
      backgroundColor: 'var(--bg-card)',
      color: 'var(--text-primary)',
      boxShadow: state.isFocused ? `0 0 0 1px #3b82f6` : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : 'var(--border-color)',
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: 'var(--text-secondary)',
      opacity: 1,
    }),
    singleValue: (base) => ({
      ...base,
      color: 'var(--text-primary)',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '4px',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: 'var(--text-primary)',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: 'var(--text-secondary)',
      ':hover': {
        backgroundColor: '#f87171',
        color: 'white',
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'var(--bg-card)',
      color: 'var(--text-primary)',
      borderRadius: '10px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? 'rgba(255,255,255,0.1)'
        : 'var(--bg-card)',
      color: 'var(--text-primary)',
      cursor: 'pointer',
    }),
  };

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className={`block text-sm glassy-text-secondary font-medium mb-2 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

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
      />
    </div>
  );
};

export default React.memo(FilterSelect);
