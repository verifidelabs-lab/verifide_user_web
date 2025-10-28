import React from 'react';

const ShowImagePopup = ({ imageUrl, isOpen, closePopup }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 glassy-card bg-opacity-50 flex justify-center items-center z-50">
      <div className="glassy-card p-4 rounded-lg max-w-[90vw] max-h-[90vh] overflow-auto relative P-2">
        <div className='flex justify-between'>
          <h2 className='font-semibold'>File Name</h2>
          <button
            className="absolute top-2 right-2 text-gray-700 hover:glassy-text-primary rounded-full p-1 z-10"
            onClick={closePopup}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="max-h-[80vh] flex justify-center">
          <img
            src={imageUrl}
            alt="Document Preview"
            className="object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://resumesector.com/wp-content/uploads/2024/10/freshers-resume-template-724x1024.jpg";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowImagePopup;