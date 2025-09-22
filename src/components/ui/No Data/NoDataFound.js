import React from 'react';

const NoDataFound = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-600">
            {/* <svg
                className="w-24 h-24 mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.75v14.5m7.25-7.25H4.75"
                />
            </svg> */}
            <img src='/Img/no_data_found.png' alt='No Data Found' />
            <h2 className="text-lg font-semibold">{message}</h2>
            <p className="mt-1 text-sm text-gray-500">Try refreshing or check back later.</p>
        </div>
    );
};

export default NoDataFound;
