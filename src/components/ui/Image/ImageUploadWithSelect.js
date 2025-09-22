import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiAlertCircle } from 'react-icons/fi';
import { BiUpload } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';

const FileUpload = ({
  onFileUpload,
  allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
  maxSize = 5,
  isUploading,
  file,
  setFile,
  inputId,
}) => {
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    if (typeof file === 'string') {
      setPreviewUrl(file);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      setError(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
      return;
    }

    const maxSizeBytes = maxSize * 1024 * 1024;
    if (selectedFile.size > maxSizeBytes) {
      setError(`File too large. Max: ${maxSize}MB`);
      return;
    }

    setFile(selectedFile);
    if (onFileUpload) onFileUpload(selectedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeFile = useCallback(() => {
    setFile('');
    setError('');
    setPreviewUrl(null);

    // reset <input> value so same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    if (onFileUpload) onFileUpload(null); // notify parent
  }, [setFile, onFileUpload]);




  const isImage = (url) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  return (
    <div className="w-full mx-auto">
      <div
        className={`
          relative border border-dashed rounded-xl p-5 text-center transition-all duration-300 cursor-pointer
          ${isDragging ? 'border-blue-400 bg-[#F6F8FA] scale-105' :
            file ? 'border-green-300 bg-green-50' :
              error ? 'border-red-300 bg-red-50' :
                'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'}
          ${isUploading ? 'pointer-events-none opacity-70' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current.click()}
      >
        <input
          type="file"
          id={inputId}
          ref={inputRef}
          accept={allowedTypes.join(',')}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 font-medium">Uploading...</p>
          </div>
        ) : previewUrl ? (
          <div className="relative">
            {isImage(previewUrl) ? (
              <img
                src={previewUrl}
                alt="preview"
                className="w-full md:max-w-full md:min-h-80 min-h-80 max-h-80 object-contain"
              />
            ) : (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`}
                title="file-preview"
                className="w-full h-80 border rounded"
              />
            )}
            <button
              onClick={removeFile}
              className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-100 transition"
            >
              <IoMdClose className="h-4 w-4 text-red-500" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center ${isDragging ? "bg-blue-100" : "bg-gray-100"}`}>
              <BiUpload className={`h-8 w-8 ${isDragging ? "text-blue-500" : "text-gray-400"}`} />
            </div>
            <p className={`font-semibold ${isDragging ? "text-blue-600" : "text-gray-700"}`}>
              {isDragging ? "Drop your file here" : "Upload your file"}
            </p>
            <p className="text-gray-500">Drag and drop or click to browse</p>
            <div className="bg-white rounded-lg p-3 border border-gray-200 text-xs text-gray-600">
              <p><strong>Supported:</strong> {allowedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ")}</p>
              <p className="mt-1"><strong>Max size:</strong> {maxSize}MB</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <FiAlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

FileUpload.propTypes = {
  onFileUpload: PropTypes.func,
  allowedTypes: PropTypes.arrayOf(PropTypes.string),
  maxSize: PropTypes.number,
  isUploading: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(File)]),
  setFile: PropTypes.func.isRequired,
  inputId: PropTypes.string.isRequired,
};

export default FileUpload;
