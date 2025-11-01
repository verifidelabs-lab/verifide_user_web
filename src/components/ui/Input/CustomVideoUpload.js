import React, { useState, useRef } from "react";
import { BiPaperclip, BiTrash, BiDownload, BiFile, BiImage } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const CustomVideoUpload = ({
  label = "Attach File",
  required = false,
  placeholder = "Choose File",
  onChange,
  onDelete,
  value,
  error = "",
  accept = ".mp4",
  maxSize = 5, // in MB
  supportedFormats = "Video  files",
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (file) => {
    if (!file) return;

  

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    setUploading(true);
    try {
      await onChange(file);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
    // Reset input value to allow same file selection
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (url) => {
    if (!url) return <BiPaperclip className="w-5 h-5 glassy-text-secondary" />;

    const fileExtension = url.split('.').pop()?.toLowerCase();
    if (['mp4'].includes(fileExtension)) {
      return <BiImage className="w-5 h-5 glassy-text-primary" />;
    } else if (fileExtension === 'pdf') {
      return <BiFile className="w-5 h-5 text-red-500" />;
    }
    return <BiPaperclip className="w-5 h-5 glassy-text-secondary" />;
  };

  const getFileName = (url) => {
    if (!url) return null;
    try {
      return url.split('/').pop()?.split('?')[0] || 'Uploaded file';
    } catch {
      return 'Uploaded file';
    }
  };

  const openFile = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-base glassy-text-primary font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="space-y-2">
       
        {!value ?
          <div
            className={`relative border-2 border-dashed rounded-lg transition-colors
            ${dragActive ? 'border-blue-400 glassy-card' :
                error ? 'border-red-300' : 'border-gray-300'}
            ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-blue-400 '}
          `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer glassy-input-notification"
              accept={accept}
              disabled={uploading}
            />

            <div className="flex flex-col items-center justify-center py-6 px-4">
              {uploading ? (
                <AiOutlineLoading3Quarters className="w-8 h-8 text-blue-500 animate-spin mb-2" />
              ) : (
                <BiPaperclip className="w-8 h-8 glassy-text-secondary mb-2" />
              )}

              <p className="text-sm glassy-text-secondary text-center">
                {uploading ? 'Uploading...' : (
                  <>
                    <span className="font-medium glassy-text-primary hover:text-blue-500 cursor-pointer">
                      Click to upload
                    </span>
                  </>
                )}
              </p>
              <p className="text-xs glassy-text-secondary mt-1">
                {supportedFormats} (max {maxSize}MB)
              </p>
            </div>
          </div>

          : (
            <div className="flex items-center justify-between p-3  rounded-lg border">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getFileIcon(value)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium glassy-text-primary truncate">
                    {getFileName(value)}
                  </p>
                  <p className="text-xs glassy-text-secondary">
                    Uploaded successfully
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-3">
                <button
                  type="button"
                  onClick={() => openFile(value)}
                  className="p-1.5 glassy-button rounded transition-colors"
                  title="View file"
                >
                  <BiDownload className="w-4 h-4 glassy-text-secondary" />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                  title="Delete file"
                >
                  <BiTrash className="w-4 h-4 glassy-text-secondary" />
                </button>
              </div>
            </div>
          )
        }

      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {!value && !error && (
        <p className="text-xs glassy-text-secondary mt-1">
          {placeholder}
        </p>
      )}
    </div>
  );
};

export default CustomVideoUpload;