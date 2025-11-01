// Child Component - UploadMultipleImages.jsx
import React, { useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { LuAsterisk } from 'react-icons/lu';

const UploadMultipleImages = ({
  id = 'default-image-upload',
  label = 'Upload Images',
  accept = 'image/*',
  files = [],
  onChange,
  onRemove,
  errorMessage = '',
  isDisabled = false,
  containerClassName = '',
  labelClassName = '',
  previewClassName = '',
  iconClassName = '',
  maxFiles = 5,
  required = false,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
  maxFileSize = 10 * 1024 * 1024 // 10MB
}) => {
  const fileInputRef = useRef();

  const validateFile = (file) => {
    if (!allowedTypes.includes(file?.type)) {
      return `Invalid file type: ${file?.name}. Allowed types: ${allowedTypes.join(', ')}`;
    }
    if (file.size > maxFileSize) {
      return `File too large: ${file?.name}. Max size: ${maxFileSize / 1024 / 1024}MB`;
    }
    return null;
  };

  const handleFileChange = (e) => {
    errorMessage = validateFile()
    // if (errorMessage) return;
    const selectedFiles = Array.from(e.target.files);
    onChange(selectedFiles);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    errorMessage = validateFile()
    // if (errorMessage) return;
    const droppedFiles = Array.from(e.dataTransfer.files);
    onChange(droppedFiles);
  };

  const removeFile = (index) => {
    onRemove(index);
  };

  return (
    <div className={`mt-4 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium glassy-text-primary relative ${labelClassName}`}
        >
          {label} (Max {maxFiles})
          {required && <LuAsterisk className="inline text-red-500 ml-1" size={12} />}
        </label>
      )}

      {/* Show uploaded images */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className={`w-24 h-24 object-cover rounded-md border border-gray-200 ${previewClassName}`}
              />
              {!isDisabled && (
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 glassy-card glassy-text-primary rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-gray-200 hover:glassy-card"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dropzone - only show if we haven't reached max files */}
      {files.length < maxFiles && (
        <div
          className={`relative border-2 border-dashed glassy-card border-gray-300 glassy-text-primary rounded-md shadow-sm p-6 focus:outline-none cursor-pointer flex items-center justify-center ${errorMessage ? 'border-red-500' : 'hover:border-gray-400'
            } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !isDisabled && fileInputRef.current.click()}
        >
          <input
            type="file"
            id={id}
            accept={accept}
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isDisabled}
            multiple
          />

          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="24"
              height="24"
              strokeWidth="2"
              className={`mx-auto glassy-text-secondary ${iconClassName}`}
            >
              <path d="M15 8h.01"></path>
              <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5"></path>
              <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3.5 3.5"></path>
              <path d="M14 14l1 -1c.679 -.653 1.473 -.829 2.214 -.526"></path>
              <path d="M19 22v-6"></path>
              <path d="M22 19l-3 -3l-3 3"></path>
            </svg>
            <span className="block glassy-text-primary mt-2 text-sm">
              Drag & Drop or Click to Upload ({files.length}/{maxFiles})
            </span>
            <span className="block glassy-text-secondary text-xs mt-1">
              Supports {allowedTypes.join(', ')} up to {maxFileSize / 1024 / 1024}MB each
            </span>
          </div>
        </div>
      )}

      {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
    </div>
  );
};

export default React.memo(UploadMultipleImages);