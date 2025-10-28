import React from "react";
import { BiCalendar } from "react-icons/bi";

const CustomDateInput = React.forwardRef(
  (
    {
      value,
      onChange,
      label = "Start Date",
      type = "date",
      placeholder,
      required = false,
      error,
      disabled,
      allowFutureDate = true,
      allowPastDate = true,
      dobRange = false,
      minDateOverride,
      maxDateOverride,
    },
    ref
  ) => {
    const inputRef = React.useRef(null);

    const handleIconClick = () => {
      if (inputRef.current && !inputRef.current.disabled && !inputRef.current.readOnly) {
        inputRef.current.showPicker?.();
        inputRef.current.focus();
      }
    };

    // Today's date
    const today = new Date().toISOString().split("T")[0];

    // Calculate min/max dates
    let minDate, maxDate;
    if (dobRange) {
      const todayObj = new Date();
      const maxAllowed = new Date(todayObj.getFullYear() - 18, todayObj.getMonth(), todayObj.getDate());
      const minAllowed = new Date(todayObj.getFullYear() - 100, todayObj.getMonth(), todayObj.getDate());
      maxDate = maxAllowed.toISOString().split("T")[0];
      minDate = minAllowed.toISOString().split("T")[0];
    } else {
      minDate = !allowPastDate ? today : undefined;
      maxDate = !allowFutureDate ? today : undefined;
    }

    if (minDateOverride) minDate = minDateOverride;
    if (maxDateOverride) maxDate = maxDateOverride;

    return (
      <div className="w-full max-w-lg">
        {/* Label */}
        <label className="block mb-2 font-medium glassy-text-primary">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Input */}
        <div className="relative" ref={ref}>
          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder || (type === "date" ? "DD/MM/YYYY" : "Select date")}
            required={required}
            disabled={disabled}
            min={minDate}
            max={maxDate}
            className={`glassy-input w-full pr-10 ${error ? "border-red-500 text-red-600" : ""}`}
          />

          {/* Calendar Icon */}
          <div
            onClick={handleIconClick}
            className="absolute inset-y-0 right-3 flex items-center glassy-text-secondary cursor-pointer"
          >
            <BiCalendar className="w-5 h-5" />
          </div>
        </div>

        {/* Error */}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

CustomDateInput.displayName = "CustomDateInput";
export default CustomDateInput;
