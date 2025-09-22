// components/SkeletonJobCard.jsx
import React from "react";

const SkeletonJobCard = () => {
  return (
    <div className="max-w-md mx-auto border rounded-lg shadow-md p-4 bg-white space-y-3 animate-pulse">
      <div className="grid grid-cols-3 gap-3 items-center">
        <div className="col-span-2 flex items-center gap-2">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="space-y-2">
            <div className="w-32 h-4 bg-gray-300 rounded"></div>
            <div className="w-24 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
      </div>

      <div className="space-y-2">
        <div className="w-40 h-3 bg-gray-200 rounded"></div>
        <div className="flex flex-wrap gap-2">
          <div className="w-20 h-5 bg-gray-200 rounded-full"></div>
          <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
          <div className="w-24 h-5 bg-gray-200 rounded-full"></div>
        </div>
        <div className="w-3/4 h-5 bg-gray-300 rounded"></div>
        <div className="w-full h-3 bg-gray-200 rounded"></div>
        <div className="flex gap-2 mt-2">
          <div className="w-24 h-8 bg-gray-200 rounded-md"></div>
          <div className="w-20 h-8 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonJobCard;
