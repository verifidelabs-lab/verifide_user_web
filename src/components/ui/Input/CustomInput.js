

import React, { useState, useRef } from "react";
import classNames from "classnames";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FaRegSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

const CustomInput = React.forwardRef(
  (
    {
      type = "text",
      label,
      error,
      helperText,
      fullWidth = false,
      wrapperClass = "",
      inputClass = "",
      labelClass = "",
      className = "",
      placeholder,
      required = false,
      enableEmoji = false,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const localRef = useRef(null);
    const inputRef = ref || localRef;

    const isCheckboxOrRadio = type === "checkbox" || type === "radio";
    const isTextarea = type === "textarea";
    const isPassword = type === "password";

    const wrapperClasses = classNames(
      {
        "w-full": fullWidth,
        "inline-flex items-center": isCheckboxOrRadio,
        "flex flex-col": !isCheckboxOrRadio,
      },
      wrapperClass
    );

    const labelClasses = classNames(
      {
        "glassy-text-primary font-medium text-base leading-5 mb-2": !isCheckboxOrRadio,
        "ml-2 text-sm glassy-text-primary": isCheckboxOrRadio,
      },
      labelClass
    );

    const inputClasses = classNames(
      "glassy-input transition-all duration-200 ease-in-out",
      {
        "w-full": fullWidth && !isCheckboxOrRadio,
        "h-4 w-4 text-primary-600 focus:": isCheckboxOrRadio,
        "min-h-[100px] py-2": isTextarea,
        "ring-1  border-primary-500": isFocused && !error,
        "border-red-300 text-red-900 placeholder-red-300 focus: focus:border-red-500":
          error,
      },
      inputClass,
      className
    );

    const helperTextClasses = classNames("mt-1 text-sm", {
      "glassy-text-secondary": !error,
      "text-red-600": error,
    });

    const handleFocus = (e) => {
      setIsFocused(true);
      if (props.onFocus) props.onFocus(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      if (props.onBlur) props.onBlur(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleEmojiClick = (emojiData) => {
      const cursorPos = inputRef.current.selectionStart;
      const value = inputRef.current.value;
      const newValue =
        value.slice(0, cursorPos) + emojiData.emoji + value.slice(cursorPos);
      inputRef.current.value = newValue;

      if (props.onChange) {
        props.onChange({
          ...new Event("change"),
          target: { value: newValue, name: props.name },
        });
      }

      setShowEmojiPicker(false);
    };

    const renderInput = () => {
      if (isTextarea) {
        return (
          <textarea
            ref={inputRef}
            className={inputClasses}
            placeholder={placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        );
      }

      if (isCheckboxOrRadio) {
        return (
          <div className="flex items-center">
            <input
              ref={inputRef}
              type={type}
              className={inputClasses}
              placeholder={placeholder}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
            {label && (
              <label htmlFor={props.id} className={labelClasses}>
                {label}
              </label>
            )}
          </div>
        );
      }

      return (
        <input
          ref={inputRef}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={inputClasses}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      );
    };

    return (
      <div className={wrapperClasses}>
        {!isCheckboxOrRadio && label && (
          <label htmlFor={props.id} className={labelClasses}>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative" ref={inputRef}>
          {renderInput()}

          {isPassword && (
            <span
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 flex items-center glassy-text-secondary cursor-pointer right-3"
            >
              {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
            </span>
          )}

          {enableEmoji && (type === "text" || isTextarea) && (
            <span
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer glassy-text-secondary"
            >
              <FaRegSmile size={20} />
            </span>
          )}

          {showEmojiPicker && (
            <div className="absolute z-50 top-full right-0 mt-2">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        {(helperText || error) && (
          <p className={helperTextClasses}>{error || helperText}</p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";
export default CustomInput;




// import React, { useState } from 'react';
// import classNames from 'classnames';
// import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

// const CustomInput = (({
//     type = 'text',
//     label,
//     error,
//     helperText,
//     fullWidth = false,
//     wrapperClass = '',
//     inputClass = '',
//     labelClass = '',
//     className = '',
//     placeholder,
//     required = false,
//     ...props
// }, ref) => {
//     const [isFocused, setIsFocused] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const isCheckboxOrRadio = type === 'checkbox' || type === 'radio';
//     const isTextarea = type === 'textarea';
//     const isPassword = type === 'password';

//     const wrapperClasses = classNames(
//         {
//             'w-full': fullWidth,
//             'inline-flex items-center': isCheckboxOrRadio,
//             'flex flex-col': !isCheckboxOrRadio,
//         },
//         wrapperClass
//     );

//     const labelClasses = classNames(
//         {
//             'text-[#282828] font-medium text-base leading-5 align-middle mb-2': !isCheckboxOrRadio,
//             'ml-2 text-sm glassy-text-primary': isCheckboxOrRadio,
//         },
//         labelClass
//     );

//     const inputClasses = classNames(
//         {
//             'opacity-100 rounded-[10px] border border-[#0000001A] glassy-card px-4 transition-all duration-200 ease-in-out': 
//                 !isCheckboxOrRadio && !isPassword,
//             'opacity-100 rounded-[10px] border border-[#0000001A] glassy-card px-4 pr-10 transition-all duration-200 ease-in-out': 
//                 isPassword,
//             'placeholder-[#6B6B6B] focus:border-primary-500 focus:ring-1 focus:ring-primary-500': 
//                 type !== 'textarea' && !isCheckboxOrRadio && !error,
//             'h-4 w-4 text-primary-600 focus:ring-primary-500 border-[#0000001A] glassy-card rounded':
//                 isCheckboxOrRadio,
//             'min-h-[100px] py-2': isTextarea,
//             'w-full': fullWidth && !isCheckboxOrRadio,
//             'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500':
//                 error,
//             'ring-1 ring-primary-500 border-primary-500': isFocused && !error,
//         },
//         inputClass,
//         className
//     );

//     const helperTextClasses = classNames('mt-1 text-sm', {
//         'glassy-text-secondary': !error,
//         'text-red-600': error,
//     });

//     const handleFocus = (e) => {
//         setIsFocused(true);
//         if (props.onFocus) props.onFocus(e);
//     };

//     const handleBlur = (e) => {
//         setIsFocused(false);
//         if (props.onBlur) props.onBlur(e);
//     };

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     const renderInput = () => {
//         if (isTextarea) {
//             return (
//                 <textarea
//                     ref={ref}
//                     className={inputClasses}
//                     placeholder={placeholder}
//                     onFocus={handleFocus}
//                     onBlur={handleBlur}
//                     {...props}
//                 />
//             );
//         }

//         if (isCheckboxOrRadio) {
//             return (
//                 <div className="flex items-center">
//                     <input
//                         ref={ref}
//                         type={type}
//                         className={inputClasses}
//                         placeholder={placeholder}
//                         onFocus={handleFocus}
//                         onBlur={handleBlur}
//                         {...props}
//                     />
//                     {label && (
//                         <label htmlFor={props.id} className={labelClasses}>
//                             {label}
//                         </label>
//                     )}
//                 </div>
//             );
//         }

//         return (
//             <input
//                 ref={ref}
//                 type={isPassword ? (showPassword ? 'text' : 'password') : type}
//                 className={inputClasses}
//                 placeholder={placeholder}
//                 onFocus={handleFocus}
//                 onBlur={handleBlur}
//                 {...props}
//             />
//         );
//     };

//     return (
//         <div className={wrapperClasses}>
//             {!isCheckboxOrRadio && label && (
//                 <label htmlFor={props.id} className={labelClasses}>
//                     {label}
//                     {required && <span className="ml-1 text-red-500">*</span>}
//                 </label>
//             )}
//             <div className="relative">
//                 {renderInput()}
//                 {isPassword && (
//                     <span
//                         onClick={togglePasswordVisibility}
//                         className="absolute inset-y-0 flex items-center glassy-text-secondary cursor-pointer right-3"
//                     >
//                         {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
//                     </span>
//                 )}
//             </div>
//             {(helperText || error) && (
//                 <p className={helperTextClasses}>{error || helperText}</p>
//             )}
//         </div>
//     );
// });

// CustomInput.displayName = 'Input';

// export default React.forwardRef(CustomInput);