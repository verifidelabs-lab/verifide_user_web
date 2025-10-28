import React, { useState, useRef } from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  rounded = 'md',
  tooltip, // New prop for tooltip text
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef(null);

  const isDisabled = disabled || loading;

  // Rounded styles mapping
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  // Handle boolean values for backward compatibility
  const getRoundedClass = () => {
    if (typeof rounded === 'boolean') {
      return rounded ? 'rounded-full' : 'rounded-md';
    }
    return roundedStyles[rounded] || roundedStyles.md;
  };

  const baseStyles = `
    flex items-center justify-center font-medium
    relative overflow-hidden
    outline-none
    transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
    transform hover:scale-[1.02] active:scale-[0.98]
    focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50
    after:content-[''] after:absolute after:inset-0
    after:glassy-card after:opacity-0 after:transition-opacity duration-300
    hover:after:opacity-10 active:after:opacity-20  
    ${getRoundedClass()}
  `;

  const variantStyles = {
    primary: `glassy-text-primary text-[#FFFFFF] hover:bg-blue-700 focus:ring-blue-500 text-[16px] font-[700]`,
    secondary: `bg-[#8989894D]/30 glassy-text-primary hover:bg-gray-700 hover:glassy-card focus:ring-gray-500 text-[16px] font-[700]`,
    outline: `border border-[#2563EB] text-[#2563EB] font-[700] bg-transparent  hover:glassy-text-primary hover:text-[#FFFFFF] hover:border-gray-400 focus:ring-gray-300 text-[16px] font-[700]`,
    ghost: `bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200 text-[16px] font-[700]`,
    danger: `bg-red-600 text-[#FFFFFF] hover:bg-red-700 focus:ring-red-500 text-[16px] font-[700]`,
    success: `bg-green-600 text-[#FFFFFF] hover:bg-green-700 focus:ring-green-500 text-[16px] font-[700]`,
    warning: `bg-yellow-500 text-[#FFFFFF] hover:bg-yellow-600 focus:ring-yellow-400 text-[16px] font-[700]`,
    zinc: `bg-zinc-900 text-[#FFFFFF] hover:bg-zinc-800 focus:ring-zinc-700 rounded-full text-[16px] font-[700]`,
    connect: `bg-blue-900 glassy-text-primary px-6 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors`
  };

  const sizeStyles = {
    sm: `px-3 py-1.5 text-sm`,
    md: `px-4 py-2 md:text-base text-sm`,
    lg: `px-6 py-3 text-sm `,
  };

  const stateStyles = `
    ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
    ${loading ? 'cursor-wait' : ''}
  `;

  const widthStyle = fullWidth ? 'w-full' : '';

  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.md}
    ${stateStyles}
    ${widthStyle}
    ${className}
  `;

  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const iconClasses = `
    ${iconSize[size] || iconSize.md}
    ${iconPosition === 'left' && children ? 'mr-2' : ''}
    ${iconPosition === 'right' && children ? 'ml-2' : ''}
  `;

  const spinnerClasses = `
    animate-spin
    ${iconSize[size] || iconSize.md}
    ${iconPosition === 'left' ? 'mr-3' : 'ml-3'}
  `;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => !isDisabled && tooltip && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      ref={buttonRef}
    >
      <button
        type={type}
        className={buttonClasses}
        disabled={isDisabled}
        onClick={onClick}
        style={{
          transitionProperty: 'transform, background-color, border-color, box-shadow',
          willChange: 'transform, background-color',
        }}
      >
        {loading && (
          <svg className={spinnerClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!loading && icon && iconPosition === 'left' && (
          React.cloneElement(icon, { className: iconClasses })  
        )}
        <span className="relative z-10">{children}</span>
        {!loading && icon && iconPosition === 'right' && (
          React.cloneElement(icon, { className: iconClasses })
        )}

        {!isDisabled && (
          <span className="absolute inset-0 overflow-hidden">
            <span className="absolute top-1/2 left-1/2 w-0 h-0 rounded-full glassy-card opacity-0 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out"></span>
          </span>
        )}
      </button>

      {showTooltip && (
        <div
          className={`
            absolute z-50 px-3 py-1.5 text-xs glassy-text-primary min-w-40  bg-gray-800 rounded-md
            -top-10 left-1/2 transform -translate-x-1/2
            transition-all duration-300 opacity-100
          `}
        >
          {tooltip}
          <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
};

export default Button;