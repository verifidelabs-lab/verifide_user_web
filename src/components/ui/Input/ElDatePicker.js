import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerComponent = ({
  label,
  selected,
  onChange,
  minDate,
  startDate,
  endDate,
  selectsStart,
  selectsEnd,
  error
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <DatePicker
        selected={selected}  
        onChange={onChange}
        dateFormat="dd-MM-yyyy"
        placeholderText="Select a date"
        minDate={minDate}
        startDate={startDate}
        endDate={endDate}
        selectsStart={selectsStart}
        selectsEnd={selectsEnd}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-all hover:border-blue-400 hover:shadow-sm"
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default DatePickerComponent;
