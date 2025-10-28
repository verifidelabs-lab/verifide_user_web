import React, { useRef } from "react";
import { FaTimes } from "react-icons/fa";

const ImageUpload = ({
  id = "default-image-upload",
  label = "Upload Image",
  accept = "image/*",
  file,
  onChange,
  onRemove,
  errorMessage = "",
  isDisabled = false,
  containerClassName = "",
  labelClassName = "",
  previewClassName = "",
  iconClassName = "",
  ...rest
}) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    if (isDisabled) return;
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onChange(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isDisabled) return;
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onChange(droppedFile);
    }
  };

  return (
    <div className={`mt-4 ${containerClassName}`}>
      {/* Label */}
      <label
        htmlFor={id}
        className={`text-sm font-medium w-auto glassy-text-primary my-2 ${labelClassName}`}
      >
        {label}
      </label>

      {/* Dropzone */}
      <div
        className={`relative border bg-transparent border-black border-dashed glassy-text-primary rounded-md shadow-sm p-4 focus:outline-none cursor-pointer flex items-center justify-center ${errorMessage ? "border-red-500" : ""
          } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
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
          {...rest}
        />

        {/* Preview or Upload Message */}
        {file ? (
          <div className="relative w-full flex justify-center items-center">
            <div className="relative">
              <img
                src={file}
                alt="Preview"
                className={` w-auto h-auto rounded-md ${previewClassName}`}
              />
              {!isDisabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="absolute top-1 right-1 glassy-card/60 glassy-text-primary rounded-full p-1"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="24"
              height="24"
              strokeWidth="2"
              style={{ stroke: "black" }}
              className={`mx-auto glassy-text-primary ${iconClassName}`}
            >
              <path d="M15 8h.01"></path>
              <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5"></path>
              <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3.5 3.5"></path>
              <path d="M14 14l1 -1c.679 -.653 1.473 -.829 2.214 -.526"></path>
              <path d="M19 22v-6"></path>
              <path d="M22 19l-3 -3l-3 3"></path>
            </svg>
            <span className="block glassy-text-primary mt-2">
              Drag & Drop or Click to Upload
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default React.memo(ImageUpload);
