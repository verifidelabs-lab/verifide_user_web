import React from 'react';
import { BiCalendar } from 'react-icons/bi';

const CustomDateInput = ({
  value,
  onChange,
  label = 'Start Date',
  type = 'date',
  placeholder,
  required = false,
  error,
  disabled,
  allowFutureDate = true,  // ✅ allow disabling future dates
  allowPastDate = true,    // ✅ allow disabling past dates
  dobRange = false         // ✅ new prop for Date of Birth restriction
}) => {
  const inputRef = React.useRef(null);

  const handleIconClick = () => {
    if (
      inputRef.current &&
      !inputRef.current.disabled &&
      !inputRef.current.readOnly
    ) {
      inputRef.current.showPicker?.();
      inputRef.current.focus();
    }
  };

  // Today's date
  const today = new Date().toISOString().split('T')[0];

  // If dobRange is true → only allow age between 18 and 100
  let minDate, maxDate;
  if (dobRange) {
    const todayObj = new Date();

    const maxAllowed = new Date(
      todayObj.getFullYear() - 18,
      todayObj.getMonth(),
      todayObj.getDate()
    );
    const minAllowed = new Date(
      todayObj.getFullYear() - 100,
      todayObj.getMonth(),
      todayObj.getDate()
    );

    maxDate = maxAllowed.toISOString().split('T')[0]; // latest allowed DOB
    minDate = minAllowed.toISOString().split('T')[0]; // oldest allowed DOB
  } else {
    // normal min/max behavior
    minDate = !allowPastDate ? today : undefined;
    maxDate = !allowFutureDate ? today : undefined;
  }

  return (
    <div className="w-full max-w-lg">
      <label className="block text-base text-[#282828] font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder || (type === 'date' ? 'DD/MM/YYYY' : 'Select date')}
          required={required}
          disabled={disabled}
          min={minDate}
          max={maxDate}
          className="w-full h-[41px] uppercase rounded-[10px] placeholder:!text-gray-400 border border-[#0000001A] px-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div
          onClick={handleIconClick}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
        >
          <BiCalendar className="w-5 h-5" />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CustomDateInput;
