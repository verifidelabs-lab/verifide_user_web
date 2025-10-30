import React from 'react';
import { FiX } from 'react-icons/fi';

const MediaPreview = ({ url, type, onRemove }) => {
  if (!url) return null;

  return (
    <div className="relative mt-2">
      {type === 'image' && (
        <div className="relative">
          <img
            src={url}
            alt="Preview"
            className="rounded-lg max-h-32 object-cover"
          />
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 glassy-card rounded-full p-1 shadow-md hover:bg-gray-100"
          >
            <FiX className="w-4 h-4 glassy-text-secondary" />
          </button>
        </div>
      )}
      {type === 'video' && (
        <div className="relative">
          <video controls className="rounded-lg max-h-32" preload="metadata">
            <source src={url} type="video/mp4" />
          </video>
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 glassy-card rounded-full p-1 shadow-md hover:bg-gray-100"
          >
            <FiX className="w-4 h-4 glassy-text-secondary" />
          </button>
        </div>
      )}
      {type === 'pdf' && (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
          <span className="text-sm text-gray-700 truncate">{url}</span>
          <button
            onClick={onRemove}
            className="ml-2 glassy-text-secondary hover:text-gray-700"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaPreview;