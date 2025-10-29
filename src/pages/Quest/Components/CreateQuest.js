/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import CustomInput from "../../../components/ui/Input/CustomInput";
import DatePickerComponent from "../../../components/ui/Input/ElDatePicker";
import EnhancedFileInput from "../../../components/ui/Input/CustomFileAndImage";
import CustomVideoUpload from "../../../components/ui/Input/CustomVideoUpload";
import { momentValueFunc, uploadImageDirectly, uploadVideoDirectly } from "../../../components/utils/globalFunction";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { createQuest, singleDocuments, updateQuest } from "../../../redux/Global Slice/cscSlice";
import { useNavigate, useParams } from "react-router-dom";
import PollForm from "./PollForm";
import { getCookie } from "../../../components/utils/cookieHandler";
import Button from "../../../components/ui/Button/Button";
import { BiAddToQueue, BiTrash } from "react-icons/bi";

const CreateQuest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const IsCompany = getCookie("ACTIVE_MODE")

  // Initial state for quest data
  const initialQuestData = {
    title: "",
    description: "",
    images: [],
    video: "",
    link: "",
    startDate: null,
    endDate: null,
    type: "",
    surveyPolls: [],
    feedbackModules: [{ title: "" }]
  };

  const [questData, setQuestData] = useState(initialQuestData);
  // const [errors, setErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("survey-polls");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [mediaType, setMediaType] = useState('image');

  const questTypes = [
    { label: "Surveys & Polls", value: "survey-polls" },
    { label: "Feedbacks", value: "feedbacks" },
    { label: "Sign-up", value: "sign-up" },
    { label: "Webinar", value: "webinar" },
    { label: "Events", value: "events" }
  ];


  // Convert Unix timestamp to Date object
  const unixToDate = (unixTimestamp) => {
    if (!unixTimestamp) return null;

    const timestamp = typeof unixTimestamp === 'number'
      ? (unixTimestamp < 10000000000 ? unixTimestamp * 1000 : unixTimestamp)
      : null;

    if (!timestamp) return null;

    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? null : date;
  };

  // Check access mode on component mount and storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newAccessMode = getCookie("ACCESS_MODE");
      const isCompany = getCookie("COMPANY_ROLE");
      if (newAccessMode == 5 && isCompany !== "3") {
        navigate(`/user/quest`);
      }
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  // Fetch quest data for editing
  const fetchByIdData = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(singleDocuments({ _id: id })).unwrap();

      if (res?.data) {
        const data = res.data;
        const startDate = unixToDate(data.startDate);
        const endDate = unixToDate(data.endDate);

        setQuestData({
          ...initialQuestData,
          ...data,
          images: Array.isArray(data.images) ? data.images : [],
          video: data.video || "",
          startDate: startDate,
          endDate: endDate,
          isPublic: data.isPublic || false,
          surveyPolls: data.surveyPolls || [],
          feedbackModules: data.feedbackModules && data.feedbackModules.length > 0
            ? data.feedbackModules
            : [{ title: "" }]
        });

        setActiveTab(data.type || "survey-polls");
        setIsEditMode(true);

        const mediaType = data?.images.length === 0 ? "video" : "image";
        setMediaType(mediaType);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch quest data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchByIdData();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setQuestData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle date changes with validation
  const handleDateChange = (field, date) => {
    const validDate = date && !isNaN(date.getTime()) ? date : null;

    setQuestData(prev => ({
      ...prev,
      [field]: validDate
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }

    // Reset end date if start date is after current end date
    if (field === "startDate" && questData.endDate && validDate > questData.endDate) {
      setQuestData(prev => ({ ...prev, endDate: null }));
      if (errors.endDate) {
        setErrors(prev => ({ ...prev, endDate: "" }));
      }
    }
  };

  // Handle feedback module changes
  const handleFeedbackModuleChange = (index, value) => {
    const updated = [...questData.feedbackModules];
    updated[index].title = value;

    setQuestData(prev => ({
      ...prev,
      feedbackModules: updated,
    }));

    // Clear error for this field
    if (errors[`feedbackModule-${index}`]) {
      setErrors(prev => ({ ...prev, [`feedbackModule-${index}`]: "" }));
    }
  };

  // Add new feedback module
  const handleAddFeedbackModule = () => {
    setQuestData(prev => ({
      ...prev,
      feedbackModules: [...prev.feedbackModules, { title: "" }],
    }));
  };

  // Remove a feedback module
  const handleRemoveFeedbackModule = (index) => {
    if (questData.feedbackModules.length <= 1) {
      toast.error("At least one feedback module is required");
      return;
    }

    const updated = questData.feedbackModules.filter((_, i) => i !== index);
    setQuestData(prev => ({
      ...prev,
      feedbackModules: updated,
    }));

    // Clear any errors related to this module
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`feedbackModule-${index}`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  // Comprehensive form validation
  const validateForm = () => {
    const newErrors = {};

    if (!questData.title.trim()) newErrors.title = "Quest title is required";
    if (!questData.description.trim()) newErrors.description = "Description is required";
    if (!activeTab) newErrors.type = "Please select a quest type";

    if (!questData.startDate) newErrors.startDate = "Start date is required";
    if (!questData.endDate) newErrors.endDate = "End date is required";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (questData.startDate && questData.startDate < today) {
      newErrors.startDate = "Start date cannot be in the past";
    }

    if (questData.startDate && questData.endDate && questData.endDate < questData.startDate) {
      newErrors.endDate = "End date cannot be before start date";
    }

    if ((!questData.video || questData.video.trim() === "") &&
      (!questData.images || questData.images.length === 0)) {
      newErrors.media = "Please upload either an image or a video";
    }

    if (activeTab === "survey-polls") {
      if (!questData.surveyPolls || questData.surveyPolls.length === 0) {
        newErrors.surveyPolls = "At least one survey question is required";
      } else {
        questData.surveyPolls.forEach((question, index) => {
          if (!question.title.trim()) {
            newErrors[`surveyQuestion-${index}`] = "Question title is required";
          }

          if (question.type !== "short-answer" && (!question.options || question.options.length === 0)) {
            newErrors[`surveyOptions-${index}`] = "Options are required for this question type";
          } else if (question.options) {
            if (
              (question.type === "multi-choice" || question.type === "poll") &&
              question.options.length < 2
            ) {
              toast.error("At least 2 options are required for this question type")
            }

            question.options.forEach((option, optIndex) => {
              if (!option.trim()) {
                newErrors[`surveyOption-${index}-${optIndex}`] = "Option cannot be empty";
              }
            });
          }
        });
      }
    }
    else if (activeTab === "feedbacks") {
      if (!questData.feedbackModules || questData.feedbackModules.length === 0) {
        newErrors.feedbackModules = "At least one feedback module is required";
      } else {
        questData.feedbackModules.forEach((module, index) => {
          if (!module.title.trim()) {
            newErrors[`feedbackModule-${index}`] = "Feedback module title is required";
          }
        });
      }

      if (!questData.link.trim()) {
        newErrors.link = "Quest link is required";
      } else if (!isValidUrl(questData.link)) {
        newErrors.link = "Please enter a valid URL";
      }
    }
    else if (activeTab === "sign-up") {
      if (!questData.link.trim()) {
        newErrors.link = "Quest link is required";
      } else if (!isValidUrl(questData.link)) {
        newErrors.link = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // URL validation helper
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Handle file uploads
  const handleFileUpload = useCallback(async (file, fileType) => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const maxSize = fileType === 'image' ? 5 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${fileType === 'image' ? '5MB' : '20MB'}`);
      return;
    }

    setIsLoading(true);

    try {
      let result;
      if (fileType === 'image') {
        const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedImageTypes.includes(file.type)) {
          toast.error("Only JPEG, JPG, or PNG files are allowed");
          return;
        }

        result = await uploadImageDirectly(file, "QUEST_MEDIA");
      } else if (fileType === 'video') {
        const allowedVideoTypes = ["video/mp4"];
        if (!allowedVideoTypes.includes(file.type)) {
          toast.error("Only MP4 files are allowed");
          return;
        }

        result = await uploadVideoDirectly(file, "QUEST_MEDIA");
      }

      if (result?.data?.imageURL || result?.data?.videoURL) {
        const mediaUrl = result.data.imageURL || result.data.videoURL;

        if (fileType === 'image') {
          setQuestData(prev => ({
            ...prev,
            images: [...prev.images, mediaUrl],
            video: "" // Clear video when adding image
          }));
        } else {
          setQuestData(prev => ({
            ...prev,
            video: mediaUrl,
            images: [] // Clear images when adding video
          }));
        }

        if (errors.media) {
          setErrors(prev => ({ ...prev, media: "" }));
        }

        toast.success(result?.message || "File uploaded successfully");
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast.error(error?.message || 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  }, [errors.media]);

  const handleImageUpload = useCallback((file) => {
    handleFileUpload(file, 'image');
  }, [handleFileUpload]);

  const handleVideoUpload = useCallback((file) => {
    handleFileUpload(file, 'video');
  }, [handleFileUpload]);

  // Remove image from quest data
  const removeImage = (index) => {
    setQuestData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Remove video from quest data
  const removeVideo = () => {
    setQuestData(prev => ({
      ...prev,
      video: ""
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const apiPayload = {
        startDate: momentValueFunc(questData.startDate),
        endDate: momentValueFunc(questData.endDate),
        title: questData.title,
        description: questData.description,
        images: questData.images,
        video: questData.video,
        link: questData.link,
        type: activeTab,
      };

      // Add survey polls if applicable
      if (activeTab === "survey-polls") {
        apiPayload.surveyPolls = questData.surveyPolls.map(question => {
          const formattedQuestion = {
            title: question.title,
            type: question.type,
            isRequired: question.isRequired || false
          };

          if (question.type !== "short-answer" && question.options) {
            formattedQuestion.options = question.options.map(option => option.trim());
          }

          const { id, ...questionWithoutId } = formattedQuestion;
          return questionWithoutId;
        });
      }

      // Add feedback modules if applicable
      if (activeTab === 'feedbacks') {
        apiPayload.feedbackModules = questData.feedbackModules.filter(module =>
          module.title && module.title.trim() !== ""
        );

        // Validate at least one feedback module remains
        if (apiPayload.feedbackModules.length === 0) {
          throw new Error("At least one feedback module is required");
        }
      }

      // Add ID if in edit mode
      if (isEditMode) {
        apiPayload._id = id;
      }

      const action = isEditMode ? updateQuest : createQuest;
      const result = await dispatch(action(apiPayload)).unwrap();

      if (result?.code === 1200) {
        toast.success(isEditMode ? "Quest updated successfully!" : "Quest created successfully!");
        const isCompanyrole = getCookie("COMPANY_ROLE");
        if (IsCompany === "company" && isCompanyrole === "3") {
          navigate(`/company/quest`);
        } else {
          navigate(`/user/quest`);
        }

      } else {
        throw new Error(result?.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error || "Failed to save quest");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl transition-all duration-500">
        <h1 className="text-2xl font-bold glassy-text-primary mb-6">
          {isEditMode ? "Edit Quest" : "Create New Quest"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quest Type Selection */}
          <div>
            <label className="block text-sm font-semibold glassy-text-primary mb-3">
              Quest Type *
            </label>
            <div className="flex gap-3 flex-wrap">
              {questTypes.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setActiveTab(value);
                    if (errors.type) {
                      setErrors((prev) => ({ ...prev, type: "" }));
                    }
                  }}
                  className={`
                    px-5 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-300 ease-in-out
                    ${activeTab === value
                      ? "glassy-button glassy-text-primary shadow-lg"
                      : "glassy-text-secondary border "
                    }
                    ${id ? "cursor-not-allowed opacity-70" : ""}
                  `}
                  disabled={!!id}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type}</p>
            )}
          </div>

          {/* Quest Title */}
          <div>
            <CustomInput
              label="Quest Title"
              name="title"
              value={questData.title}
              onChange={handleInputChange}
              placeholder="Enter quest title"
              error={errors.title}
              className="w-full h-11 px-4 py-2 border glassy-text-secondary rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              enableEmoji={true}
            />
          </div>

          {/* Description */}
          <div>
            <CustomInput
              label="Description"
              name="description"
              value={questData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              error={errors.description}
              className="w-full h-11 px-4 py-2 border glassy-text-secondary rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              type="textarea"
              row={4}
              enableEmoji={true}
            />
          </div>
          {activeTab !== 'survey-polls' && (
            <div>
              <CustomInput
                label="Quest Link"
                name="link"
                value={questData.link}
                onChange={handleInputChange}
                placeholder="Enter quest link"
                error={errors.link}
                className="w-full h-11 px-4 py-2 border glassy-text-secondary rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          )}
          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <DatePickerComponent
                label="Start Date"
                selected={questData.startDate}
                onChange={(date) => handleDateChange("startDate", date)}
                minDate={new Date()}
                error={errors.startDate}
                selectsStart
                startDate={questData.startDate}
                endDate={questData.endDate}
                
              />
            </div>

            <div>
              <DatePickerComponent
                label="End Date"
                selected={questData.endDate}
                onChange={(date) => handleDateChange("endDate", date)}
                minDate={questData.startDate || new Date()}
                error={errors.endDate}
                selectsEnd
                startDate={questData.startDate}
                endDate={questData.endDate}
              />
            </div>
          </div>

          {/* Media Type Selection */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 glassy-text-primary">
              <input
                type="radio"
                name="mediaType"
                checked={mediaType === "image"}
                onChange={() => setMediaType("image")}
                className="w-4 h-4 glassy-input"
              />
              Image
            </label>

            <label className="flex items-center gap-2 glassy-text-primary">
              <input
                type="radio"
                name="mediaType"
                checked={mediaType === "video"}
                onChange={() => setMediaType("video")}
                className="w-4 h-4 glassy-input"
              />
              Video
            </label>
          </div>

          {/* Media Upload */}
          <div className="space-y-4">
            {mediaType === 'image' && (
              <EnhancedFileInput
                accept=".jpg,.jpeg,.png"
                supportedFormats="Image"
                label="Images"
                onChange={handleImageUpload}
                onDelete={removeImage}
                error={errors.images || errors.media}
                isLoading={isLoading}
                value={questData.images[0]}
              />
            )}

            {mediaType === 'video' && (
              <CustomVideoUpload
                onChange={handleVideoUpload}
                onDelete={removeVideo}
                error={errors.video || errors.media}
                isLoading={isLoading}
                value={questData.video}
                maxSize={20}
                label="Video"
              />
            )}
          </div>

          {/* Feedback Modules (for feedbacks tab) */}
          {activeTab === 'feedbacks' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold glassy-text-primary">Feedback Modules</h2>
                <p className="text-sm text-muted-foreground glassy-text-secondary">
                  Add titles for your feedback modules. You can add more or remove them anytime.
                </p>
                {errors.feedbackModules && (
                  <p className="text-red-500 text-sm mt-1">{errors.feedbackModules}</p>
                )}
              </div>

              {/* Module List */}
              <div className="space-y-3">
                {questData.feedbackModules.map((module, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 glassy-card border  rounded-xl transition"
                  >
                    <CustomInput
                      placeholder={`Title ${index + 1}`}
                      value={module.title}
                      onChange={(e) => handleFeedbackModuleChange(index, e.target.value)}
                      className="h-10 flex-1 glassy-text-secondary"
                      error={errors[`feedbackModule-${index}`]}
                    />

                    {questData.feedbackModules.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFeedbackModule(index)}
                        className="text-red-500  hover:bg-red-50"
                      >
                        <BiTrash className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-start">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddFeedbackModule}
                  className="flex items-center gap-2 glassy-button hover:glassy-text-primary"
                  icon={<BiAddToQueue className="w-5 h-5" />}
                  disabled={questData.feedbackModules.length >= 5}

                >
                  Add New Title
                </Button>
              </div>
            </div>
          )}

          {/* Quest Link (for non-survey-polls tabs) */}

          {
            activeTab === "survey-polls" && (
              <label className="text-whitemt-2 glassy-text-primary">Survey & Polls <span className="text-red-500">*</span></label>
            )
          }

          {activeTab === "survey-polls" && (
            <PollForm
              questions={questData.surveyPolls}
              setQuestions={(newQuestions) => setQuestData(prev => ({
                ...prev,
                surveyPolls: newQuestions
              }))}
              errors={errors}
            />
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="glassy-button 
                px-8 py-3 rounded-lg glassy-text-primary font-semibold shadow-md 
                transition transform hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Processing..." : (isEditMode ? "Update Quest" : "🚀 Create Quest")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuest;