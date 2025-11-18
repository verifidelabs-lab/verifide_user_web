import { BiSend, BiHistory, BiTrash } from "react-icons/bi";
import { toast } from "sonner";
import { uploadImageDirectly } from "../../../components/utils/globalFunction";
import { useEffect, useRef, useState } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { removeFeedbackData } from "../../../redux/Global Slice/cscSlice";
import { useDispatch } from "react-redux";
import { HiOutlineCloudUpload } from "react-icons/hi";
import Button from "../../../components/ui/Button/Button";

const FeedbackModal = ({
  isOpen,
  onClose,
  questData,
  feedbackData,
  onSubmitFeedback,
}) => {
  const dispatch = useDispatch();
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState({});
  const [existingFeedback, setExistingFeedback] = useState({});
  const [showPreviousFeedback, setShowPreviousFeedback] = useState(false);
  const currentFeedback = formData[activeModuleIndex] || {
    remarks: "",
    images: [],
  };
  const hiddenFileInputRef = useRef(null);
  const triggerFileSelect = () => {
    hiddenFileInputRef.current?.click();
  };

  useEffect(() => {
    if (feedbackData && feedbackData.feedbackReports) {
      const initialFormData = {};
      const counts = {};
      const initialUploadedImages = {};
      const initialExistingFeedback = {};
      console.log("this is sssssssssss", feedbackData);

      feedbackData.feedbackReports.forEach((report) => {
        const moduleIndex = report.module_index;
        if (!initialExistingFeedback[moduleIndex]) {
          initialExistingFeedback[moduleIndex] = [];
        }

        // Store existing feedback separately with ID
        initialExistingFeedback[moduleIndex].push({
          _id: report._id, // Store the feedback ID for deletion
          remarks: report.remarks || "",
          images: report.images || [],
          createdAt: report.createdAt || new Date(),
        });

        // Count existing feedback for each module
        counts[moduleIndex] = (counts[moduleIndex] || 0) + 1;
      });

      setFormData(initialFormData);
      setUploadedImages(initialUploadedImages);
      setExistingFeedback(initialExistingFeedback);
    }
  }, [feedbackData, isOpen]);

  if (!isOpen || !feedbackData) return null;

  const { feedbackModules } = feedbackData;
  const currentModule = feedbackModules[activeModuleIndex] || "";

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [activeModuleIndex]: {
        ...(prev[activeModuleIndex] || {}),
        [field]: value,
      },
    }));
  };

  const handleFileUpload = async (file) => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedImageTypes.includes(file.type)) {
      toast.error("Only JPEG, JPG, or PNG files are allowed");
      return;
    }

    const currentModuleImages = uploadedImages[activeModuleIndex] || [];

    if (currentModuleImages.length >= 5) {
      toast.error("Maximum 5 images allowed per feedback");
      return;
    }

    const updatedImages = [...currentModuleImages, file];

    setUploadedImages((prev) => ({
      ...prev,
      [activeModuleIndex]: updatedImages,
    }));

    const previewUrl = URL.createObjectURL(file);
    const currentFeedbackImages = formData[activeModuleIndex]?.images || [];

    handleInputChange("images", [...currentFeedbackImages, previewUrl]);

    try {
      const result = await uploadImageDirectly(file, "QUEST_MEDIA");
      if (result?.data?.imageURL) {
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image");
    }
  };
  const removeImage = (imgIndex) => {
    const currentModuleImages = [...(uploadedImages[activeModuleIndex] || [])];
    currentModuleImages.splice(imgIndex, 1);
    setUploadedImages((prev) => ({
      ...prev,
      [activeModuleIndex]: currentModuleImages,
    }));
    const imageUrls = currentModuleImages.map((file) =>
      file instanceof File ? URL.createObjectURL(file) : file
    );
    handleInputChange("images", imageUrls);
  };

  const handleSaveAndNext = async () => {
    const currentFeedback = formData[activeModuleIndex] || {};
    if (!currentFeedback.remarks || currentFeedback.remarks.length < 5) {
      toast.error("Please provide remarks with at least 5 characters");
      return;
    }

    if (currentFeedback.remarks.length > 100) {
      toast.error("Remarks must be 100 characters or fewer");
      return;
    }

    setLoading(true);
    try {
      const uploadedImageUrls = [];
      const currentModuleFiles = uploadedImages[activeModuleIndex] || [];

      for (const file of currentModuleFiles) {
        if (file instanceof File) {
          try {
            const result = await uploadImageDirectly(file, "QUEST_MEDIA");
            if (result?.data?.imageURL) {
              uploadedImageUrls.push(result.data.imageURL);
            }
          } catch (error) {
            console.error("Image upload failed:", error);
            toast.error("Failed to upload some images");
          }
        } else {
          uploadedImageUrls.push(file);
        }
      }

      const payload = {
        quest_id: questData._id,
        module_index: activeModuleIndex,
        remarks: currentFeedback.remarks,
        images: uploadedImageUrls,
      };
      await onSubmitFeedback(payload);
      setFormData((prev) => ({
        ...prev,
        [activeModuleIndex]: {},
      }));
      setUploadedImages((prev) => ({
        ...prev,
        [activeModuleIndex]: [],
      }));

      toast.success("Feedback submitted successfully!");
      if (activeModuleIndex < feedbackModules.length - 1) {
        setActiveModuleIndex((prev) => prev + 1);
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAll = async () => {
    const currentFeedback = formData[activeModuleIndex] || {};

    if (!currentFeedback.remarks || currentFeedback.remarks.length < 5) {
      toast.error("Please provide remarks with at least 5 characters");
      return;
    }

    setLoading(true);
    try {
      const uploadedImageUrls = [];
      const currentModuleFiles = uploadedImages[activeModuleIndex] || [];

      for (const file of currentModuleFiles) {
        if (file instanceof File) {
          try {
            const result = await uploadImageDirectly(file, "QUEST_MEDIA");
            if (result?.data?.imageURL) {
              uploadedImageUrls.push(result.data.imageURL);
            }
          } catch (error) {
            console.error("Image upload failed:", error);
            toast.error("Failed to upload some images");
          }
        } else {
          uploadedImageUrls.push(file);
        }
      }

      const payload = {
        quest_id: questData._id,
        module_index: activeModuleIndex,
        remarks: currentFeedback.remarks,
        images: uploadedImageUrls,
      };

      await onSubmitFeedback(payload);
      toast.success("Feedback submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeFeedback = async (feedbackId) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }
    try {
      const payload = {
        quest_id: questData._id,
        feedback_id: feedbackId,
      };
      const response = await dispatch(removeFeedbackData(payload)).unwrap();
      console.log("2222222222222222222222222222222", response, payload);
      if (response) {
        toast.success("Feedback deleted successfully!");
        setExistingFeedback((prev) => {
          const updatedFeedback = { ...prev };
          Object.keys(updatedFeedback).forEach((moduleIndex) => {
            updatedFeedback[moduleIndex] = updatedFeedback[moduleIndex].filter(
              (feedback) => feedback._id !== feedbackId
            );
            if (updatedFeedback[moduleIndex].length === 0) {
              delete updatedFeedback[moduleIndex];
            }
          });
          return updatedFeedback;
        });
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback. Please try again.");
    }
  };

  const renderFeedbackForm = () => {
    return (
      <div className="p-3">
        {/* Remarks Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium glassy-text-primary mb-2">
            Your Remarks *
          </label>
          <input
            type="text"
            value={currentFeedback.remarks || ""}
            onChange={(e) => handleInputChange("remarks", e.target.value)}
            placeholder="Share your thoughts (minimum 5 characters)"
            className="w-full p-3 border glassy-input rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium glassy-text-primary mb-2">
            Upload Images (Max 5)
          </label>
          <div className="flex items-center space-x-3">
            {/* <button
            onClick={triggerFileSelect}
            className="flex items-center px-4 py-2 glassy-button text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-200 transition"
          >
            <HiOutlineCloudUpload className="text-lg mr-2" />
            Upload Images
          </button> */}
            <Button
              onClick={triggerFileSelect}
              variant="outline" // or "primary", depending on your preferred look
              size="md"
              icon={<HiOutlineCloudUpload />}
              iconPosition="left"
              rounded="md"
              className={`flex-1 glassy-button  "opacity-60 cursor-not-allowed"
              }`}
              // tooltip="Click to upload images"
            >
              Upload Images
            </Button>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              ref={hiddenFileInputRef}
              onChange={(e) => {
                const files = Array.from(e.target.files);
                files.forEach((file) => handleFileUpload(file));
                e.target.value = ""; // Reset input
              }}
              className="hidden"
            />
          </div>

          {/* Image Previews */}
          {currentFeedback.images && currentFeedback.images.length > 0 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {currentFeedback.images.map((img, imgIndex) => (
                <div key={imgIndex} className="relative group">
                  <img
                    src={img}
                    alt={`Upload ${imgIndex + 1}`}
                    className="w-full h-20 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => removeImage(imgIndex)}
                    className="absolute -top-2 -right-2 bg-red-500 glassy-text-primary p-1 rounded-full opacity-100 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    <RxCross2 />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 glassy-card bg-opacity-50 glassy-text-primary text-xs p-1 text-center">
                    {imgIndex + 1}/5
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs glassy-text-secondary mt-2">
            You can upload up to 5 images per feedback
          </p>
        </div>
      </div>
    );
  };

  const renderPreviousFeedback = () => {
    return (
      <div className="glassy-card p-5 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold glassy-text-primary">
            Previous Feedback
          </h3>
          <button
            onClick={() => setShowPreviousFeedback(false)}
            className="glassy-text-secondary hover:glassy-text-primary p-1 rounded-full hover:glassy-card"
          >
            <RxCross2 className="text-xl" />
          </button>
        </div>

        <div className="space-y-4">
          {feedbackModules.map((module, index) => {
            const moduleFeedback = existingFeedback[index] || [];
            if (moduleFeedback.length === 0) return null;

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h4 className="font-medium text-blue-800 mb-3">
                  {module.title}
                </h4>

                <div className="space-y-3">
                  {moduleFeedback.map((feedback, fbIndex) => (
                    <div
                      key={fbIndex}
                      className="glassy-card p-3 rounded border border-gray-200 relative"
                    >
                      <button
                        onClick={() => removeFeedback(feedback._id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                        title="Delete feedback"
                      >
                        <BiTrash className="text-lg" />
                      </button>

                      <div className="flex justify-between items-start mb-2 pr-6">
                        <span className="text-sm font-medium glassy-text-primary">
                          Feedback #{fbIndex + 1}
                        </span>
                        <span className="text-xs glassy-text-secondary">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="glassy-text-primary text-sm mb-2">
                        {feedback.remarks}
                      </p>

                      {feedback.images && feedback.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {feedback.images.map((img, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={img}
                              alt=""
                              className="w-full  object-cover rounded border"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {Object.keys(existingFeedback).filter(
            (key) => existingFeedback[key].length > 0
          ).length === 0 && (
            <div className="text-center py-8 glassy-text-secondary">
              <BiHistory className="text-3xl mx-auto mb-2" />
              <p>No previous feedback available</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="!fixed glassy-card inset-0 flex items-center justify-center z-[2000] p-4 bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="glassy-card w-full max-w-6xl h-full max-h-[90vh] md:max-h-[80vh] flex flex-col rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border-b">
          <div className="flex-1">
            <h2 className="text-2xl font-bold glassy-text-primary">
              Provide Feedback
            </h2>
            <div className="flex flex-wrap gap-2 mt-2 text-sm">
              <div>
                <span className="glassy-text-primary">Quest: </span>
                <span className="font-medium glassy-text-secondary">
                  {questData?.title}
                </span>
              </div>
              <div>
                <span className="glassy-text-primary">Participant: </span>
                <span className="font-medium glassy-text-secondary">
                  {questData?.user_id?.name}
                </span>
              </div>
              <div>
                <span className="glassy-text-primary">Engagements: </span>
                <span className="font-medium glassy-text-secondary">
                  {questData?.engagement_count}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <button
              onClick={() => setShowPreviousFeedback(!showPreviousFeedback)}
              className="flex items-center glassy-text-secondary glassy-card px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              <BiHistory className="mr-1" />
              {showPreviousFeedback ? "Hide" : "Show"} Previous Feedback
            </button>

            <button
              onClick={onClose}
              className="glassy-text-secondary hover:glassy-text-primary p-1 rounded-full hover:glassy-card transition-colors"
            >
              <RxCross2 className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          {/* Sidebar Modules */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 glassy-card p-4 overflow-y-auto max-h-[40vh] md:max-h-full">
            <h3 className="font-medium glassy-text-primary mb-3 px-2">
              Feedback Modules
            </h3>
            <div className="space-y-2">
              {feedbackModules.map((module, index) => {
                const isActive = index === activeModuleIndex;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveModuleIndex(index);
                      setShowPreviousFeedback(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "glassy-card border-2 border-blue-300 glassy-text-primary"
                        : "glassy-card border glassy-text-secondary"
                    }`}
                  >
                    <div className="font-medium text-sm">{module.title}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Feedback Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {showPreviousFeedback ? (
              renderPreviousFeedback()
            ) : (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h3 className="text-xl font-semibold glassy-text-primary">
                      {currentModule?.title || ""}
                    </h3>
                    <p className="text-xs glassy-text-secondary mt-1 font-semibold">
                      Provide your feedback for this module
                    </p>
                  </div>

                  <div className="flex mt-2 md:mt-0 space-x-2">
                    {activeModuleIndex > 0 && (
                      <button
                        title="Previous Module"
                        onClick={() => setActiveModuleIndex((prev) => prev - 1)}
                        className="flex items-center text-blue-600 glassy-button font-medium py-2 px-4 glassy-card rounded hover:bg-blue-200 transition-colors"
                      >
                        <FaChevronLeft className="mr-1" />
                        Prev
                      </button>
                    )}
                    {activeModuleIndex < feedbackModules.length - 1 && (
                      <button
                        title="Next Module"
                        onClick={() => setActiveModuleIndex((prev) => prev + 1)}
                        className="flex items-center text-blue-600 glassy-button font-medium py-2 px-4 glassy-card rounded hover:bg-blue-200 transition-colors"
                      >
                        Next <FaChevronRight className="ml-1" />
                      </button>
                    )}
                  </div>
                </div>

                {renderFeedbackForm()}

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row justify-between mt-6 space-y-2 md:space-y-0 md:space-x-3">
                  <button
                    onClick={onClose}
                    className="glassy-text-secondary hover:glassy-text-primary font-medium py-2.5 px-6 rounded-lg border border-gray-300 hover:glassy-card transition-colors"
                  >
                    Cancel
                  </button>

                  <div className="flex space-x-3">
                    {activeModuleIndex < feedbackModules.length - 1 ? (
                      <button
                        onClick={handleSaveAndNext}
                        disabled={loading}
                        className="glassy-card glassy-button glassy-text-primary font-medium py-2.5 px-8 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            Save & Add More <FaChevronRight className="ml-2" />
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitAll}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 disabled:glassy-card glassy-text-primary font-medium py-2.5 px-8 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <BiSend className="mr-2" />
                            Submit
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
