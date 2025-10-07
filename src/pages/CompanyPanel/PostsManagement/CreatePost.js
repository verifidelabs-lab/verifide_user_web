/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../../redux/CompanySlices/companiesSlice';
import { uploadImageDirectly, uploadMultiImageDirectly, uploadVideoDirectly } from '../../../components/utils/globalFunction';
import CustomInput from '../../../components/ui/InputAdmin/CustomInput';
 
import CustomImageVideoUpload from '../../../components/ui/InputAdmin/CustomImageVideoUpload';
import EnhancedFileInput from '../../../components/ui/InputAdmin/CustomFileAndImage';
import CustomVideoUpload from '../../../components/ui/InputAdmin/CustomVideoUpload';

const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [postData, setPostData] = useState({
    type: "draft",
    post_type: "text",
    title: "",
    content: "",
    link: "",
    tags: [],
    image_urls: [],
    video_url: "",
    tagInput: "",
    poll: {
      voting_length: 1,
      options: [""]
    },
    thumbnail: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation rules aligned with payload requirements
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!postData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (postData.title.length < 1) {
      newErrors.title = "Title must be at least 1 character long";
    } else if (postData.title.length > 300) {
      newErrors.title = "Title cannot exceed 300 characters";
    }

    // eslint-disable-next-line default-case
    switch (postData.post_type) {
      case 'text':
        if (!postData.content.trim()) {
          newErrors.content = "Content is required";
        } else if (postData.content.length < 1) {
          newErrors.content = "Content must be at least 1 character long";
        } else if (postData.content.length > 5000) {
          newErrors.content = "Content cannot exceed 5000 characters";
        }
        break;
      case 'link':
        if (!postData.link.trim()) {
          newErrors.link = "URL is required";
        } else {
          try {
            new URL(postData.link);
          } catch {
            newErrors.link = "Please enter a valid URL";
          }
        }
        break;
      case 'image-video':
        if (postData.image_urls.length === 0 && !postData.video_url) {
          newErrors.media = "Please upload at least one image or video";
        }
        break;
      case 'poll':
        if (!postData.poll.options || postData.poll.options.length < 2) {
          newErrors.pollOptions = "At least two poll options are required";
        } else {
          postData.poll.options.forEach((option, index) => {
            if (!option.trim()) {
              newErrors[`pollOption-${index}`] = "Poll option cannot be empty";
            } else if (option.length > 100) {
              newErrors[`pollOption-${index}`] = "Poll option cannot exceed 100 characters";
            }
          });
        }

        if (!postData.poll.voting_length || postData.poll.voting_length < 1) {
          newErrors.pollDuration = "Voting duration must be at least 1 day";
        } else if (postData.poll.voting_length > 30) {
          newErrors.pollDuration = "Voting duration cannot exceed 30 days";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [postData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setPostData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  const handlePollOptionChange = useCallback((index, value) => {
    setPostData(prev => ({
      ...prev,
      poll: {
        ...prev.poll,
        options: prev.poll.options.map((option, i) =>
          i === index ? value : option
        )
      }
    }));

    if (errors[`pollOption-${index}`]) {
      setErrors(prev => ({
        ...prev,
        [`pollOption-${index}`]: undefined
      }));
    }
  }, [errors]);

  const handleAddPollOption = useCallback(() => {
    if (postData.poll.options.length >= 10) {
      toast.error('Maximum 10 poll options allowed');
      return;
    }

    setPostData(prev => ({
      ...prev,
      poll: {
        ...prev.poll,
        options: [...prev.poll.options, ""]
      }
    }));
  }, [postData.poll.options.length]);

  const handleRemovePollOption = useCallback((index) => {
    if (postData.poll.options.length <= 2) {
      toast.error('Poll must have at least 2 options');
      return;
    }

    setPostData(prev => ({
      ...prev,
      poll: {
        ...prev.poll,
        options: prev.poll.options.filter((_, i) => i !== index)
      }
    }));

    // Clear error for removed option
    if (errors[`pollOption-${index}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`pollOption-${index}`];
        return newErrors;
      });
    }
  }, [postData.poll.options.length, errors]);

  const handlePollDurationChange = useCallback((e) => {
    const value = parseInt(e.target.value) || 1;
    setPostData(prev => ({
      ...prev,
      poll: {
        ...prev.poll,
        voting_length: value
      }
    }));

    if (errors.pollDuration) {
      setErrors(prev => ({
        ...prev,
        pollDuration: undefined
      }));
    }
  }, [errors]);

  const handleAddTag = useCallback((e) => {
    e.preventDefault();

    const tagValue = postData.tagInput.trim();

    if (!tagValue) {
      toast.error('Please enter a tag');
      return;
    }

    if (tagValue.length > 50) {
      toast.error('Tag must be 50 characters or less');
      return;
    }

    if (postData.tags.includes(tagValue)) {
      toast.error('Tag already exists');
      return;
    }

    if (postData.tags.length >= 10) {
      toast.error('Maximum 10 tags allowed');
      return;
    }

    setPostData(prev => ({
      ...prev,
      tags: [...prev.tags, tagValue],
      tagInput: ''
    }));

    // Clear tags error if it exists
    if (errors.tags) {
      setErrors(prev => ({ ...prev, tags: undefined }));
    }

    toast.success('Tag added successfully');
  }, [postData.tagInput, postData.tags, errors.tags]);

  const handleRemoveTag = useCallback((index) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
    toast.success('Tag removed');
  }, []);

  const handlePostTypeChange = useCallback((type) => {
    setPostData(prev => ({
      ...prev,
      post_type: type,
      // Clear type-specific data when changing post type
      content: type === 'text' ? prev.content : '',
      link: type === 'link' ? prev.link : '',
      image_urls: type === 'image-video' ? prev.image_urls : [],
      video_url: type === 'image-video' ? prev.video_url : '',
      poll: type === 'poll' ? prev.poll : {
        voting_length: 1,
        options: [""]
      }
    }));

    // Clear related errors
    setErrors(prev => ({
      ...prev,
      content: undefined,
      link: undefined,
      media: undefined,
      pollOptions: undefined,
      pollDuration: undefined
    }));
  }, []);

  const handleFileChange = useCallback(async (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    setIsLoading(true);

    try {
      const imageFiles = [];
      const videoFiles = [];

      // Separate images and videos
      Array.from(selectedFiles).forEach(file => {
        if (file.type.startsWith("image/")) {
          imageFiles.push(file);
        } else if (file.type.startsWith("video/")) {
          videoFiles.push(file);
        }
      });

      // Handle multiple images
      let uploadedImages = [];
      if (imageFiles.length > 0) {
        const result = await uploadMultiImageDirectly(imageFiles, "POST_MEDIA");
        if (result?.data?.imageURLs) {
          uploadedImages = result.data.imageURLs;
        }
      }

      // Handle video (only one video allowed)
      let uploadedVideo = "";
      if (videoFiles.length > 0) {
        // If multiple videos selected, use only the first one
        if (videoFiles.length > 1) {
          toast.info("Only one video can be uploaded. Using the first selected video.");
        }

        const result = await uploadVideoDirectly(videoFiles[0], "POST_MEDIA");
        if (result?.data?.imageURL) {
          uploadedVideo = result.data.imageURL;
        }
      }

      setPostData((prev) => ({
        ...prev,
        image_urls: [...prev.image_urls, ...uploadedImages],
        video_url: uploadedVideo || prev.video_url,
      }));

      // Clear media error if exists
      if (errors.media) {
        setErrors(prev => ({ ...prev, media: undefined }));
      }

      toast.success("Files uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload files");
    } finally {
      setIsLoading(false);
    }
  }, [errors.media]);


  const handleFileUpload2 = async (file) => { 
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }



    setIsLoading(true);
    try {


      const result = await uploadVideoDirectly(
        file,
        "POST_MEDIA"
      );

      if (result?.data?.imageURL) {
        setPostData((prev) => ({ ...prev, video_url: result.data.imageURL }));
        if (errors?.media_url) {
          setErrors((prev) => ({ ...prev, video_url: "" }));
        }
        toast.success(result?.message || "Image uploaded successfully");
      } else {
        throw new Error("Image upload failed");
      }

    } catch (error) {
      console.error('File upload error:', error);
      toast.error(error?.message || 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }

  }

  const handleFileUpload = useCallback(async (file) => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"]; 
    if (![...allowedImageTypes].includes(file.type)) {
      toast.error("Only image (JPEG, PNG) or PDF files are allowed");
      return;
    }

    setIsLoading(true);
    try {
      if (allowedImageTypes.includes(file.type)) {

        const result = await uploadImageDirectly(
          file,
          "POST_MEDIA"
        );

        if (result?.data?.imageURL) {
          setPostData((prev) => ({ ...prev, thumbnail: result.data.imageURL }));
          if (errors?.media_url) {
            setErrors((prev) => ({ ...prev, thumbnail: "" }));
          }
          toast.success(result?.message || "Image uploaded successfully");
        } else {
          throw new Error("Image upload failed");
        }
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast.error(error?.message || 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  }, [setPostData, setErrors]);

  const createPostPayload = useCallback(() => {
    const basePayload = {
      type: 'publish',
      post_type: postData.post_type,
      title: postData.title.trim(),
      tags: postData.tags
    };

    switch (postData.post_type) {
      case 'text':
        return {
          ...basePayload,
          content: postData.content.trim()
        };
      case 'image-video':
        return {
          ...basePayload,
          image_urls: postData.image_urls,
          video_url: postData.video_url,
          content: postData.content.trim()
        };
      case 'link':
        return {
          ...basePayload,
          content: postData.content.trim(),
          thumbnail: postData?.thumbnail,
          link: postData.link.trim(),
          video_url: postData?.video_url || ''
        };
      case 'poll':
        return {
          ...basePayload,
          content: postData.content.trim(),
          poll: {
            voting_length: postData.poll.voting_length,
            options: postData.poll.options.map(option => option.trim()),

          }
        };
      default:
        return basePayload;
    }
  }, [postData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const postPayload = createPostPayload();
      console.log('Post payload:', postPayload);

      await dispatch(createPost(postPayload)).unwrap();
      toast.success('Post published successfully!');
      setPostData({
        type: "draft",
        post_type: "text",
        title: "",
        content: "",
        link: "",
        tags: [],
        image_urls: [],
        video_url: "",
        tagInput: "",
        poll: {
          voting_length: 1,
          options: [""]
        }
      });
      setErrors({});
      navigate(-1)

    } catch (error) {
      console.error('Post submission error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to publish post';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, createPostPayload, dispatch, navigate]);

  const renderError = (fieldName) => {
    if (errors[fieldName]) {
      return <p className="text-red-500 text-sm mt-1 animate-pulse">{errors[fieldName]}</p>;
    }
    return null;
  };

  const getCharacterCountColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-gray-500';
  };



  return (
    <div className="create-post-container min-h-screen ">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className='flex justify-between items-center   p-4'>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Create New Post</h1>
            <p className="text-gray-600 mt-1">Share your thoughts with the world</p>
          </div>
        </div>

        <div className=" overflow-hidden">
          <div className="post-type-selector flex justify-start space-x-4 border-b border-gray-200">
            {[
              { type: "text", label: "Text" },
              { type: "image-video", label: "Images & Video" },
              { type: "link", label: "Link" },
              { type: "poll", label: "Poll" }
            ].map(({ type, label }) => (
              <button
                key={type}
                onClick={() => handlePostTypeChange(type)}
                className={`relative flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out rounded-md
                                        ${postData.post_type === type ? "text-blue-600 " : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {label}
                {postData.post_type === type && (
                  <span className="absolute -bottom-[2px] left-0 w-full h-[2px] bg-blue-600 rounded-full transition-all duration-300" />
                )}
              </button>
            ))}
          </div>

          <form className='p-6 space-y-6' onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Post Title <span className="text-red-500">*</span>
              </label>
              <CustomInput
                type="text"
                name="title"
                className={`w-full h-10 ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                placeholder="Enter a compelling title..."
                value={postData.title}
                onChange={handleInputChange}
                maxLength={300}
              />
              {renderError('title')}
              <div className={`text-sm text-right ${getCharacterCountColor(postData.title.length, 300)}`}>
                {postData.title.length}/300 characters
              </div>
            </div>

            {(postData.post_type === 'text' || postData?.post_type === 'poll' || postData?.post_type === 'link' || postData?.post_type === 'image-video') && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-gray-700">
                    Content <span className="text-red-500">*</span>
                  </label>
                </div>

                <CustomInput
                  type="textarea"
                  name="content"
                  className={`w-full ${errors.content ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  placeholder="What's on your mind? Share your thoughts, experiences, or insights..."
                  value={postData.content}
                  onChange={handleInputChange}
                  rows={6}
                  maxLength={5000}
                />

                {renderError('content')}
                <div className={`text-sm text-right ${getCharacterCountColor(postData.content.length, 5000)}`}>
                  {postData.content.length}/5000 characters
                </div>
              </div>
            )}

            {postData.post_type === "image-video" && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Upload Media <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                  <CustomImageVideoUpload
                    supportedFormats="images and videos"
                    className="transition-all duration-300"
                    onFilesChange={handleFileChange}
                    accept="image/*,video/*"
                    multiple={true}
                    maxFiles={5}
                    maxSizeMB={5}
                    isLoading={isLoading}
                  />
                </div>
                {renderError('media')}
              </div>
            )}

            {postData.post_type === 'link' && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Link URL <span className="text-red-500">*</span>
                </label>
                <CustomInput
                  type="url"
                  name="link"
                  placeholder="https://example.com"
                  className={`w-full p-4 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg border-2 ${errors.link ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  value={postData.link}
                  onChange={handleInputChange}
                />
                {renderError('link')}
                <p className="text-sm text-gray-600">Share an interesting link with your audience</p>

                <EnhancedFileInput label='Thumbnail' value={postData?.thumbnail} onChange={handleFileUpload} supportedFormats="Images"
                  onDelete={
                    () => setPostData((prev) => ({ ...prev, thumbnail: "" }))
                  }
                />
                <CustomVideoUpload label='Video' value={postData?.video_url} onChange={handleFileUpload2}
                  onDelete={
                    () => setPostData((prev) => ({ ...prev, video_url: "" }))
                  } />


              </div>
            )}

            {postData.post_type === 'poll' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Poll Duration (Days) <span className="text-red-500">*</span>
                  </label>
                  <CustomInput
                    type="number"
                    name="pollDuration"
                    min="1"
                    max="30"
                    className={`w-full ${errors.pollDuration ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    value={postData.poll.voting_length}
                    onChange={handlePollDurationChange}
                  />
                  {renderError('pollDuration')}
                  <p className="text-sm text-gray-600">How long should the poll be open for voting? (1-30 days)</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-semibold text-gray-700">
                      Poll Options <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddPollOption}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                      disabled={postData.poll.options.length >= 10}
                    >
                      + Add Option
                    </button>
                  </div>

                  {renderError('pollOptions')}

                  <div className="space-y-3">
                    {postData.poll.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CustomInput
                          type="text"
                          placeholder={`Option ${index + 1}`}
                          className={`flex-1 ${errors[`pollOption-${index}`] ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          value={option}
                          onChange={(e) => handlePollOptionChange(index, e.target.value)}
                          maxLength={100}
                        />
                        {postData.poll.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePollOption(index)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-600">
                    {postData.poll.options.length}/10 options • Add at least 2 options for your poll
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Tags
              </label>
              <div className="flex gap-2">
                <CustomInput
                  type="text"
                  name="tagInput"
                  placeholder="Add a tag (max 50 chars)"
                  className={`h-10 ${errors.tags ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  value={postData.tagInput}
                  onChange={handleInputChange}
                  maxLength={50}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={postData.tags.length >= 10 || !postData.tagInput.trim()}
                >
                  Add
                </button>
              </div>
              {renderError('tags')}

              {postData.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {postData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="tag bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center shadow-sm hover:shadow-md transition-shadow"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="ml-2 text-blue-200 hover:text-white focus:outline-none transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    {postData.tags.length}/10 tags • Press Enter or click Add to add tags
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium flex items-center shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-75 cursor-not-allowed transform scale-95' : 'hover:transform hover:scale-105'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {isLoading ? "uploading media..." : "Publish Post"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;