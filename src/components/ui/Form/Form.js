import React from 'react';

const Form = ({ onSubmit, title, children, error, formLayoutClassName = "" }) => {
  return (
    <div className={`flex justify-center h-screen items-center glassy-card/20    ${formLayoutClassName}`}>
      <div class=" p-[44px_26px] rounded-[10px] border border-[rgba(169, 169, 169, 1)] opacity-100 min-w-  gap-[10px]">

        <div className="mb-4">
          <img src="/headerlogo-D3k-kYIk 2.png" alt="logo" className="h-10 w-56 mx-auto " />
          <p className='glassy-text-primary text-base poppins-regular text-center pt-2'>Learn More. Earn More</p>
        </div>
        <div className="space-y-6" >
          {title && (
            <h2 className="">
              {title}
            </h2>
          )}

          {error && (
            <div className="p-4 rounded-md bg-red-50">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default Form;