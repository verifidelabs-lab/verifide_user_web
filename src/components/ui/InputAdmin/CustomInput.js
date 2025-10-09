import React from 'react';
import classNames from 'classnames';

const CustomInput = (({
    type = 'text',
    label,
    error,
    helperText,
    fullWidth = false,
    wrapperClass = '',
    inputClass = '',
    labelClass = '',
    className = '',
    placeholder,
    required = false,
    ...props
}, ref) => {
    const isCheckboxOrRadio = type === 'checkbox' || type === 'radio';
    const isTextarea = type === 'textarea';
    const isPassword = type === 'password';

    const wrapperClasses = classNames(
        {
            'w-full': fullWidth,
            'inline-flex items-center': isCheckboxOrRadio,
            'flex flex-col': !isCheckboxOrRadio,
        },
        wrapperClass
    );

    const labelClasses = classNames(
        {
            'text-[16px] text-[#121212] font-[500] mb-2': !isCheckboxOrRadio,
            'ml-2 text-sm text-gray-700': isCheckboxOrRadio,
        },
        labelClass
    );

    const inputClasses = classNames(
        {
            'h-[50px] opacity-100 rounded-[10px] border border-[#0000001A]/10 bg-[#FFFFFF] p-2':
                !isCheckboxOrRadio && !isPassword,
            'h-[50px] opacity-100 rounded-[10px] border border-[#0000001A]/10 bg-[#FFFFFF] p-4 pr-10':
                isPassword,
            'border-gray-300 placeholder-[#6B6B6B]': type !== 'textarea' && !isCheckboxOrRadio,
            'h-4 w-4 text-primary-600 focus:ring-primary-500 border-[#0000001A]/10 bg-[#FFFFFF] rounded':
                isCheckboxOrRadio,
            'border-gray-300': type === 'textarea',
            'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500':
                error,
            'px-3 py-2': !isTextarea && !isCheckboxOrRadio,
            'px-3 py-2 min-h-[100px]': isTextarea,
            'w-full': fullWidth && !isCheckboxOrRadio,
        },
        inputClass,
        className
    );

    const helperTextClasses = classNames('mt-1 text-sm', {
        'text-gray-500': !error,
        'text-red-600': error,
    });

    const renderInput = () => {
        if (isTextarea) {
            return (
                <textarea
                    ref={ref}
                    className={inputClasses}
                    placeholder={placeholder}
                    {...props}
                />
            );
        }

        if (isCheckboxOrRadio) {
            return (
                <div className="flex items-center">
                    <input
                        ref={ref}
                        type={type}
                        className={inputClasses}
                        placeholder={placeholder}
                        {...props}
                    />
                    {label && (
                        <label htmlFor={props.id} className={labelClasses}>
                            {label}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                    )}
                </div>
            );
        }

        return (
            <input
                type={type}
                className={inputClasses}
                placeholder={placeholder}
                {...props}
            />
        );
    };

    return (
        <div className={wrapperClasses} ref={ref}>
            {!isCheckboxOrRadio && label && (
                <label htmlFor={props.id} className={labelClasses}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            {renderInput()}
            {(helperText || error) && (
                <p className={helperTextClasses}>{error || helperText}</p>
            )}
        </div>
    );
});

CustomInput.displayName = 'Input';

export default React.forwardRef(CustomInput);