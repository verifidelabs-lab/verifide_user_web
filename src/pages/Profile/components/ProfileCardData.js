import React, { useState, useRef, useCallback } from "react";
import { BsPencil } from "react-icons/bs";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { toast } from "sonner";
import {
  generateResumePDF,
  uploadImageDirectly,
} from "../../../components/utils/globalFunction";
import { useDispatch } from "react-redux";
import {
  getProfile,
  updateProfileImage,
  updateProfileImageLocally,
} from "../../../redux/slices/authSlice";
import { useProfileImage } from "../../../components/context/profileImageContext";
import OpenToWorkSelect from "../../../components/ui/Button/ButtonWithIcon";
import Button from "../../../components/ui/Button/Button";
import { BiDownload } from "react-icons/bi";
import { viewUserProfile } from "../../../redux/Users/userSlice";
import ResumeViewSelection from "./ResumeViewSelection";
import { Briefcase, GraduationCap, Settings } from "lucide-react";

const ProfileCardData = ({ data, frameStatus, handleSelection }) => {
  const { setProfileImage } = useProfileImage();
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);
  const [openResumeSelection, setOpenResumeSelection] = useState(false);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    // if (file.size > 5 * 1024 * 1024) {
    //   toast.error('File size must be less than 5MB');
    //   return;
    // }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only image files (JPEG, PNG,JPG) are allowed");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setShowCropper(true);
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCrop = useCallback(async () => {
    if (!cropperRef.current) return;

    setIsLoading(true);
    try {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
        width: 300,
        height: 300,
        fillColor: "#fff",
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      if (!croppedCanvas) {
        throw new Error("Cropping failed");
      }

      croppedCanvas.toBlob(
        async (blob) => {
          try {
            const result = await uploadImageDirectly(blob, "PROFILES");

            if (result?.data?.imageURL) {
              setCroppedImage(result.data.imageURL);
              dispatch(updateProfileImageLocally(result.data.imageURL));
              setProfileImage(result.data.imageURL);
              dispatch(
                updateProfileImage({
                  profile_picture_url: result.data.imageURL,
                })
              );
              dispatch(getProfile());
              toast.success("Profile image updated successfully");
            } else {
              throw new Error("Upload failed");
            }
          } catch (error) {
            toast.error(error || "Failed to upload image");
          } finally {
            setIsLoading(false);
            setShowCropper(false);
          }
        },
        "image/jpeg",
        0.92
      );
    } catch (error) {
      toast.error("Failed to crop image");
      setIsLoading(false);
    }
  }, [dispatch]);

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const frameStatusOptions = [
    "open_for_job",
    "open_for_internship",
    "open_for_project",
    // 'none',
  ];

  return (
    <div>
      {/* Decorative elements */}
      <div></div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png"
        style={{ display: "none" }}
      />

      {/* Cropper Modal */}
      {showCropper && (
        <div className="!fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 sm:px-6">
          <div className=" dark:bg-gray-800 p-4 sm:p-6 rounded-xl w-full max-w-md sm:max-w-lg md:max-w-xl h-[80vh] overflow-hidden flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:glassy-text-primary">Crop Profile Image</h2>

            {/* Cropper container */}
            <div className="flex-1 mb-4 overflow-hidden rounded-lg">
              <Cropper
                src={image}
                className="h-full w-full"
                initialAspectRatio={1}
                guides={true}
                ref={cropperRef}
                viewMode={1}
                minCropBoxHeight={100}
                minCropBoxWidth={100}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 mt-auto">
              <button
                onClick={() => setShowCropper(false)}
                className="px-4 py-2 glassy-button  rounded-md transition"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCrop}
                className="px-4 py-2 glassy-button rounded-md flex items-center justify-center transition disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 glassy-text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Crop & Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Profile Image */}
          <div
            className="relative w-14   rounded-full border-2 border-white/30 overflow-hidden cursor-pointer group"
            onClick={handleProfileClick}
          >
            <img
              src={
                croppedImage ||
                data?.personalInfo?.profile_picture_url ||
                "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
              }
              alt="Profile"
              onError={handleImageError}
              className="w-full h-full object-cover"
              key={data?.personalInfo?.profile_picture_url}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
              <BsPencil className="glassy-text-primary text-lg" />
            </div>
          </div>

          {/* Name & Headline */}
          <div>
            <h2 className="font-semibold text-lg">
              {`${data?.personalInfo?.first_name || ""} ${
                data?.personalInfo?.last_name || ""
              }`}
            </h2>
            <p className="text-sm glassy-text-primary/80">{data?.personalInfo?.headline || 'NA'} | {data?.personalInfo?.address?.city?.name}, {data?.personalInfo?.address?.state?.name || 'N/A'}</p>

          </div>
        </div>
      </div>

      {/* Job & Education */}
      {/* <div className="relative space-y-4  ">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium">{
              data?.latestCompany?.profileName ||
              "Add your latest work experience"
            }</h3>
            <p className="text-sm glassy-text-primary/70">{
              data?.latestCompany?.companyName ||
              ""
            }</p>
          </div>

        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium">{
              data?.latestEducation?.institution ||
              "Add your latest education details"
            }</h3>
            <p className="text-sm glassy-text-primary/70">{
              data?.latestEducation?.field_of_studies ||
              "Click the + button to include your course and department"
            }</p>
          </div>
        </div>
      </div> */}
      {/* Job Section */}
      <div
        className={`flex items-start gap-3 ${
          !data?.latestCompany?.profileName
            ? "cursor-pointer"
            : "cursor-default"
        }`}
        onClick={() => {
          if (!data?.latestCompany?.profileName) {
            handleSelection("experience");
          }
        }}
      >
        <div className="p-2 bg-white/10 rounded-lg">
          <Briefcase className="w-5 h-5" />
        </div>

        <div>
          <h3 className="font-medium">
            {data?.latestCompany?.profileName ||
              "Add your latest work experience"}
          </h3>

          <p className="text-sm text-white/70">
            {data?.latestCompany?.companyName ||
              "Go to Work Experience section below to add Experience Details"}
          </p>
        </div>
      </div>

      {/* Education Section */}
      <div
        className={`flex items-start gap-3 ${
          !data?.latestEducation?.institution
            ? "cursor-pointer"
            : "cursor-default"
        }`}
        onClick={() => {
          if (!data?.latestEducation?.institution) {
            handleSelection("education");
          }
        }}
      >
        <div className="p-2 bg-white/10 rounded-lg">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-medium">
            {data?.latestEducation?.institution ||
              "Add your latest education details"}
          </h3>
          <p className="text-sm text-white/70">
            {data?.latestEducation?.field_of_studies ||
              "Go to Education section below to add Education Details."}
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="relative flex items-center justify-between mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold">{data?.topSkills?.data?.length  || 0}</span>
          <span className="text-lg glassy-text-primary/70">Skills</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardData;
