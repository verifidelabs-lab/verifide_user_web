import React, { useState, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CustomImageVideoUpload = ({
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 5,
  className = "",
  accept = "image/*,video/*",
  multiple = true,
  isLoading = false,
  uploadedFiles = null,
  removeUploadedFile,
  localFiles = [],
  removeLocalFile
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const fileInputRef = useRef(null);

  const apiImages = uploadedFiles?.image_urls || [];
  const apiVideo = uploadedFiles?.video_url || "";

  // Combine all media for the swiper
  const allMedia = [
    ...apiImages.map(url => ({ type: 'image', url, source: 'api' })),
    ...(apiVideo ? [{ type: 'video', url: apiVideo, source: 'api' }] : []),
    ...localFiles.filter(f => f.type.startsWith('image/')).map(file => ({
      type: 'image',
      url: URL.createObjectURL(file),
      file,
      source: 'local'
    })),
    ...localFiles.filter(f => f.type.startsWith('video/')).map(file => ({
      type: 'video',
      url: URL.createObjectURL(file),
      file,
      source: 'local'
    }))
  ];

  const totalImages = apiImages.length + localFiles.filter(f => f.type.startsWith('image/')).length;
  const hasVideo = apiVideo || localFiles.some(f => f.type.startsWith('video/'));
  const totalFiles = allMedia.length;

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

    if (validFiles.length === 0) return;

    // Check video constraints
    const newVideoFiles = validFiles.filter(file => file.type.startsWith('video/'));
    const existingVideoFiles = localFiles.filter(file => file.type.startsWith('video/'));

    if (newVideoFiles.length > 0) {
      if (apiVideo) {
        alert('You can only upload one video. Please remove the existing uploaded video first.');
        return;
      }
      if (existingVideoFiles.length > 0) {
        alert('You can only select one video. Please remove the existing selected video first.');
        return;
      }
      if (newVideoFiles.length > 1) {
        alert('You can only select one video at a time.');
        return;
      }
    }

    // Check image constraints
    const newImageFiles = validFiles.filter(file => file.type.startsWith('image/'));
    const existingImageFiles = localFiles.filter(file => file.type.startsWith('image/'));
    const totalNewImages = apiImages.length + existingImageFiles.length + newImageFiles.length;

    if (totalNewImages > maxFiles) {
      alert(`You can only have up to ${maxFiles} images total. You currently have ${apiImages.length} uploaded and ${existingImageFiles.length} selected images.`);
      return;
    }

    onFilesChange(validFiles);
  }, [maxFiles, maxSizeMB, onFilesChange, apiImages.length, apiVideo, localFiles]);

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files);
      e.target.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isLoading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isLoading && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const triggerFileInput = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const canAddMore = () => {
    return totalImages < maxFiles && !hasVideo;
  };

  const handleRemoveMedia = (index, e) => {
    // Prevent event from propagating to parent elements
    e.stopPropagation();

    const media = allMedia[index];
    if (media.source === 'api') {
      removeUploadedFile && removeUploadedFile(media.url, media.type);
    } else {
      // Find the index in localFiles
      const localIndex = localFiles.findIndex(file =>
        media.type === 'image' ?
          file.type.startsWith('image/') && URL.createObjectURL(file) === media.url :
          file.type.startsWith('video/') && URL.createObjectURL(file) === media.url
      );
      if (localIndex !== -1) {
        removeLocalFile && removeLocalFile(localIndex);
      }
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 glassy-card bg-opacity-50 flex items-center justify-center z-50">
          <div className="glassy-card p-6 rounded-lg flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-700">Processing files...</span>
          </div>
        </div>
      )}

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
        // Empty state & Drop zone (visible only when no files are selected)
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ease-in-out
          ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}
          ${isDragging ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300 bg-gray-50'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            </div>
            <p className="text-gray-700 font-medium">Drag & drop files here or click to browse</p>
            <p className="text-sm glassy-text-secondary">Supports images & videos, up to {maxSizeMB}MB each</p>
            <p className="text-sm glassy-text-secondary">Max {maxFiles} images and 1 video</p>
          </div>
        </div>
      ) : (
        // Files display with Swiper (visible when files are selected)
        <div className="space-y-6">
          {/* Main Swiper for media display */}
          <div className="mb-4">
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              thumbs={{ swiper: thumbsSwiper }}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              className="h-64 md:h-96 rounded-lg overflow-hidden"
            >
              {allMedia.map((media, index) => (
                <SwiperSlide key={index} className="flex items-center justify-center glassy-card">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={`Media ${index + 1}`}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <video
                      controls
                      className="object-contain w-full h-full"
                    >
                      <source src={media.url} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <button
                    onClick={(e) => handleRemoveMedia(index, e)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 glassy-text-primary rounded-full p-1 w-7 h-7 flex items-center justify-center z-10"
                    title={`Remove ${media.type}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Thumbnails Swiper (conditionally rendered) */}
          {allMedia.length > 1 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              modules={[Thumbs]}
              watchSlidesProgress
              spaceBetween={10}
              slidesPerView={4}
              className="mt-3 h-20"
            >
              {allMedia.map((media, index) => (
                <SwiperSlide
                  key={index}
                  className={`cursor-pointer opacity-50 transition-opacity ${index === activeIndex ? 'opacity-100' : ''}`}
                >
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="object-cover w-full h-full rounded"
                    />
                  ) : (
                    <div className="relative w-full h-full bg-gray-800 rounded flex items-center justify-center">
                      <svg className="w-6 h-6 glassy-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {canAddMore() && (
            <button
              type="button"
              onClick={triggerFileInput}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg py-6 px-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group mt-4"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-600">Add more files</span>
                <span className="text-xs glassy-text-secondary">
                  {maxFiles - totalImages} image{maxFiles - totalImages !== 1 ? 's' : ''} remaining
                  {!hasVideo && ', 1 video allowed'}
                </span>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomImageVideoUpload;