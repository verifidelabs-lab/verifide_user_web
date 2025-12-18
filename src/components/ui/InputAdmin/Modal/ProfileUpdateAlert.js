import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "../../Button/Button";
const ProfileUpdateAlert = ({ isOpen, onClose, onUpdate }) => {
  // Disable page scroll when modal opens
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  // Portal root: append modal to document.body
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* FULL PAGE BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* MODAL BOX */}
      <div
        className="
          relative z-[10000]
          w-[90%] max-w-lg md:max-w-xl 
          bg-[#0b0f1acc] backdrop-blur-xl 
          border border-white/10 
          rounded-2xl 
          shadow-2xl 
          p-6 
          flex flex-col 
          items-center
        "
      >
        <button
          className="absolute top-4 right-4 text-gray-300 hover:text-white text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <img
          src="/profile-update-illustration.png"
          className="w-44 md:w-56 mx-auto mb-5"
          alt="Alert"
        />

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-2 text-center">
          Alert Update Profile !
        </h2>

        <p className="text-gray-300 text-sm md:text-base text-center max-w-md mx-auto leading-relaxed mb-6">
          Your profile must be <b>60% Updated</b> to Perform this Action, e.g.
          Personal Information, Skills, Education.
        </p>

        <div className="flex justify-center gap-4 mt-2 flex-wrap">
          <Button
            variant="secondary"
            className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            className="px-6 py-2 rounded-lg"
            onClick={onUpdate}
          >
            Update Profile
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProfileUpdateAlert;
