import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ loading = true, overlayClass = '' }) => {
  return (
    <>
      {loading && (
        <div
          className={`fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-[1000] ${overlayClass}`}
        >
          <div className="flex space-x-2 mb-4">
            <span className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></span>
          </div>
          <p className="text-blue-700 font-semibold text-lg tracking-wide animate-pulse">
            Loading Verifid...
          </p>
        </div>
      )}
    </>
  );
};

LoadingSpinner.propTypes = {
  loading: PropTypes.bool,
  overlayClass: PropTypes.string,
};

export default React.memo(LoadingSpinner);
