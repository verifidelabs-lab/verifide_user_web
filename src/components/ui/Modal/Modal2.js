import React from "react";
import Button from "../Button/Button";
import { BiLeftArrowAlt } from "react-icons/bi";

const Modal2 = ({
  isOpen,
  onClose,
  children,
  title,
  titleClassName = '',
  handleSubmit,
  handleClose,
  loading,
  buttonLabel,
  isActionButton = true
}) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-all -top-4 duration-300 ease-in-out ${isOpen ? "glassy-card bg-opacity-30 backdrop-blur-sm" : "bg-transparent pointer-events-none"
          }`}
        onClick={onClose}
      />

      <div
        className={`fixed z-50 bg-white/5 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 ease-in-out transform -translate-x-1/2 -translate-y-1/2 ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        style={{ top: '50%', left: '50%' }}
      >
        <div className="w-[100vw] max-w-6xl sm:max-w-md md:max-w-6xl lg:max-w-6xl xl:max-w-6xl flex flex-col overflow-hidden">

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className={`text-lg font-semibold glassy-text-primary capitalize capitalize ${titleClassName}`}>{title}</h2>
            <Button variant="primary"  rounded="full" icon={<BiLeftArrowAlt />} onClick={onClose}>
              Back
            </Button>
          </div>

          <div
            className="flex-1 overflow-y-auto px-6 md:py-5 py-2 custom-scrollbar max-h-[70vh]"
          >
            {children}
          </div>
        </div>
        {isActionButton && (
          <div className="flex justify-end items-end gap-3 p-6">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} loading={loading}>
              {loading ? "Please wait" : buttonLabel || "Submit"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Modal2;