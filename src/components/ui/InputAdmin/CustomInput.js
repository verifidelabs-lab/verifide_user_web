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
            'glassy-text-primary font-medium mb-2': !isCheckboxOrRadio,
            'ml-2 text-sm glassy-text-secondary': isCheckboxOrRadio,
        },
        labelClass
    );

    const inputClasses = classNames(
        {
            'glassy-input pr-10': !isCheckboxOrRadio && isPassword,
            'glassy-input': !isCheckboxOrRadio && !isPassword,
            'h-4 w-4 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)]':
                isCheckboxOrRadio,
            'min-h-[100px] py-2': isTextarea,
            'w-full': fullWidth && !isCheckboxOrRadio,
            'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500':
                error,
        },
        inputClass,
        className
    );

    const helperTextClasses = classNames('mt-1 text-sm', {
        'glassy-text-secondary': !error,
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
                ref={ref}
                type={type}
                className={inputClasses}
                placeholder={placeholder}
                {...props}
            />
        );
    };

    return (
        <div className={wrapperClasses}  >
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
