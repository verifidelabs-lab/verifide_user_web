import React, { useState } from 'react';
import classNames from 'classnames';
import Select from 'react-select';

const FilterSelect2 = ({
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
  isCreatable = false, // <--- new prop
  onCreateOption,
}) => {
  const [isInternalLoading, setInternalLoading] = useState(false);

  const selectClasses = classNames(
    'opacity-100 rounded-[10px] w-full max-h-[100px] overflow-hidden overflow-y-auto',
    {
      'border-gray-300': !error,
      'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500': error,
    },
    selectClassName
  );

  const customStyles = {
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#F9F9F9',
      borderRadius: '30px',
      padding: '2px 6px',
      border: '1px solid #E5E5E5',
      display: 'flex',
      alignItems: 'center',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#1F2937',
      fontWeight: 500,
      fontSize: '10px',
      padding: '0 8px',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#EF4444',
      backgroundColor: '#FEE2E2',
      borderRadius: '50%',
      width: '18px',
      height: '18px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '12px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#FCA5A5',
        color: '#FFF',
      },
    }),
    control: (base) => ({
      ...base,
      backgroundColor: '#FFFFFF',
      borderRadius: '10px',
      borderColor: error ? '#f87171' : '#0000001A',
      minHeight: '40px',
      boxShadow: 'none',
      paddingLeft: '10px',
      '&:hover': {
        borderColor: error ? '#f87171' : '#d4d4d8',
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 8px',
      color: '#000000',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#000000',
      opacity: 0.7,
      fontWeight: 400,
    }),
    singleValue: (base) => ({
      ...base,
      color: '#000000',
      fontWeight: 400,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: '#000000',
      paddingRight: '10px',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    loadingIndicator: (base) => ({
      ...base,
      color: '#000000',
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



  const SelectComponent = isCreatable ? "" : Select;

  return (
    <div className={`w-full space-y-2 ${containerClassName}`}>
      <label className={`text-base text-[#282828] font-medium flex items-center gap-1 ${labelClassName}`}>
        {label}
        {required && <span className="text-red-500 text-sm">*</span>}
      </label>
      <SelectComponent
        isMulti={isMulti}
        options={Array.isArray(options) ? options : []}
        value={selectedOption}
        onChange={handleChange}
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
        closeMenuOnSelect={!isMulti}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default React.memo(FilterSelect2);
