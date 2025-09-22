import React, { useState, useRef, useCallback } from 'react';

const CustomImageVideoUpload = ({ 
  onFilesChange, 
  maxFiles = 5, 
  maxSizeMB = 5,
  className = "",
  accept = "image/*,video/*",
  multiple = true,
  isLoading = false
}) => {
  const [files, setFiles] = useState({ images: [], video: null });
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleFileChange = useCallback((newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => {
      // Validate file type
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      if (!isValidType) {
        alert(`File ${file.name} is not a valid image or video.`);
        return false;
      }
      
      // Validate file size
      const isValidSize = file.size <= maxSizeMB * 1024 * 1024;
      if (!isValidSize) {
        alert(`File ${file.name} exceeds the maximum size of ${maxSizeMB}MB.`);
        return false;
      }
      
      return true;
    });
    
    // Check if we're adding a video when one already exists
    const hasNewVideo = validFiles.some(file => file.type.startsWith('video/'));
    if (hasNewVideo && files.video) {
      alert('You can only upload one video. Please remove the existing video first.');
      return;
    }
    
    // Check image count limit
    const newImageCount = validFiles.filter(file => file.type.startsWith('image/')).length;
    if (files.images.length + newImageCount > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images.`);
      return;
    }
    
    // Initialize progress tracking
    const newProgress = {};
    validFiles.forEach(file => {
      newProgress[file.name] = 0;
    });
    setUploadProgress(prev => ({ ...prev, ...newProgress }));
    
    // Simulate upload progress
    validFiles.forEach(file => {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[file.name] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [file.name]: currentProgress + 10 };
        });
      }, 200);
    });
    
    // Separate images and video
    const newImages = validFiles.filter(file => file.type.startsWith('image/'));
    const newVideo = validFiles.find(file => file.type.startsWith('video/')) || null;
    
    // Update files state
    setFiles(prev => ({
      images: [...prev.images, ...newImages],
      video: newVideo || prev.video
    }));
    
    // Notify parent component
    if (onFilesChange) {
      onFilesChange([...files.images, ...newImages, newVideo].filter(Boolean));
    }
  }, [files, maxFiles, maxSizeMB, onFilesChange]);

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files);
      e.target.value = ''; // Reset so same file can be re-selected
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const removeFile = (fileToRemove, type) => {
    if (type === 'image') {
      const newImages = files.images.filter(file => file !== fileToRemove);
      setFiles(prev => ({ ...prev, images: newImages }));
      
      // Update progress
      setUploadProgress(prev => {
        const newProgress = {...prev};
        delete newProgress[fileToRemove.name];
        return newProgress;
      });
      
      if (onFilesChange) onFilesChange([...newImages, files.video].filter(Boolean));
    } else if (type === 'video') {
      setFiles(prev => ({ ...prev, video: null }));
      
      // Update progress
      setUploadProgress(prev => {
        const newProgress = {...prev};
        delete newProgress[fileToRemove.name];
        return newProgress;
      });
      
      if (onFilesChange) onFilesChange([...files.images].filter(Boolean));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const totalFiles = files.images.length + (files.video ? 1 : 0);

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ease-in-out
          ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
          ${isDragging ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300 bg-gray-50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={isLoading ? undefined : handleDrop}
        onClick={isLoading ? undefined : triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          multiple={multiple}
          accept={accept}
          className="hidden"
          disabled={isLoading}
        />

        {totalFiles === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              )}
            </div>
            <p className="text-gray-700">
              {isLoading ? 'Uploading...' : 'Drag & drop files here '}
            </p>
            <p className="text-xs text-gray-500">Supports images & videos, up to {maxSizeMB}MB each</p>
            <p className="text-xs text-gray-500">Max {maxFiles} images and 1 video</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Video preview (if any) */}
            {files.video && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2 text-left">Video</h3>
                <div className="relative group border rounded-lg overflow-hidden shadow-md">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(files.video, 'video'); }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    ✕
                  </button>
                  
                  {uploadProgress[files.video.name] < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1">
                      <div 
                        className="bg-blue-500 h-1 transition-all"
                        style={{ width: `${uploadProgress[files.video.name]}%` }}
                      ></div>
                    </div>
                  )}
                  
                  <div className="relative w-full h-48 bg-gray-800 flex items-center justify-center">
                    <video className="max-h-full max-w-full">
                      <source src={URL.createObjectURL(files.video)} type={files.video.type} />
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-white">
                    <p className="text-xs font-medium truncate">{files.video.name}</p>
                    <p className="text-xs text-gray-500">
                      {(files.video.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {files.images.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 text-left">
                  Images ({files.images.length}/{maxFiles})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {files.images.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="relative group border rounded-lg overflow-hidden shadow-md">
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(file, 'image'); }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        ✕
                      </button>
                      
                      {uploadProgress[file.name] < 100 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1">
                          <div 
                            className="bg-blue-500 h-1 transition-all"
                            style={{ width: `${uploadProgress[file.name]}%` }}
                          ></div>
                        </div>
                      )}
                      
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={file.name} 
                        className="object-cover w-full h-32" 
                      />
                      
                      <div className="p-2 bg-white">
                        <p className="text-xs font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {files.images.length < maxFiles && !files.video && (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-32 cursor-pointer hover:border-blue-400 transition-colors"
                      onClick={triggerFileInput}
                    >
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      <p className="text-xs text-gray-500 mt-1">Add more</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomImageVideoUpload;