import React from 'react';

// import { FaStar } from 'react-icons/fa';

export const TitleValue = ({ title, desc }) => {
  return (
    <div>
      <h2 className='glassy-text-primary text-2xl font-semibold'>{title}</h2>
      <p className='glassy-text-secondary text-base font-normal'>{desc}</p>
    </div>
  );
};

export const ProgressItem = ({ title, desc, icon, bg }) => {
  return (
    <div className="mb-4 border border-[var(--border-color)] bg-[var(--bg-card)] p-3 rounded-md transition-all duration-300 hover:shadow-sm">
      <div className="flex items-center mb-1">
        {icon && (
          <span className={`mr-2 w-10 h-10 rounded-md flex justify-center items-center ${bg}`}>
            {icon}
          </span>
        )}
        <div>
          <div className='flex justify-start items-center'>
            <span className="glassy-text-primary font-medium text-lg">{title}</span>
          </div>
          <span className="glassy-text-secondary font-normal text-xs">{desc}</span>
        </div>
      </div>
    </div>
  );
};
