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
  required = false, // ✅ Add required prop
}) => {
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

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className={`block text-sm text-[#00000080]/50 font-medium mb-2 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>} {/* ✅ Add red asterisk */}
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
