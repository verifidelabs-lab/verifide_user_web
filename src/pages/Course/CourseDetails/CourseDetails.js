import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BiPlay, BiUser, BiTimeFive, BiCalendar, BiGlobe,
} from 'react-icons/bi';
import { FaCheck } from "react-icons/fa6";
import BuyCoursePopup from './components/BuyCourse';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addCourseEnroll, addEnroll, declareResult, getCourseDetails, startAssessment, submitAndUpdateQuestion } from '../../../redux/course/courseSlice';
import { toast } from 'sonner';
import Button from '../../../components/ui/Button/Button';
import { getDuration } from '../../../components/utils/globalFunction';
// import FilterSelect from '../../../components/ui/Input/FilterSelect';
import Modal from '../../../components/ui/Modal/Modal';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;

  let videoId = null;

  console.log(url)

  try {
    if (url?.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      // Already an embed URL, but ensure it has proper parameters
      return url.includes('?') ? url : `${url}?enablejsapi=1&origin=${window.location.origin}`;
    } else if (url.includes('youtube.com/v/')) {
      videoId = url.split('v/')[1]?.split('?')[0];
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&rel=0&modestbranding=1`;
    }
  } catch (error) {
    console.error('Error parsing YouTube URL:', error);
  }

  return null;
};

const getEmbedUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  console.log("url:------", url)
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return getYouTubeEmbedUrl(url);
  }
  if (url.includes('vimeo.com')) {
    const videoId = url.split('/').pop()?.split('?')[0];
    if (videoId && !isNaN(videoId)) {
      return `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`;
    }
  }
  if (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) {
    return url;
  }
  if (url.includes('/embed/')) {
    return url;
  }

  return null;
};

const CourseDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [apiRes, setApiRes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [selectedSection, setSelectedSection] = useState(apiRes?.modules[0]?.video_url);
  // const [selectOption, setSelectOption] = useState([])
  // const [modalState, setModalState] = useState({ isOpen: false, data: {}, tab: "", type: "" })
  // const [ setFormData] = useState({ skills: "" })
  const [showAssessment] = useState(false)
  const [currentQuestionIndex] = useState(0)
  // const [selectedOptions, setSelectedOptions] = useState([])
  // const [qa, setQa] = useState(null)
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  // const [selectedSection2, setSelectedSection2] = useState(null);

  // Assessment states
  const [assessmentState, setAssessmentState] = useState({
    isAssessmentModalOpen: false,
    assessments: [],
    selectedAssessment: null,
    isAssessmentStarted: false,
    currentQuestionIndex: 0,
    selectedOptions: [],
    questions: [],
    courseToken: null,
    timeLeft: 60,
    timerActive: false,
    result: null,
    isResultModalOpen: false
  });




  const playerRef = useRef(null);
  const iframeRef = useRef(null);



  useEffect(() => {
    let interval = null;

    if (assessmentState.timerActive && assessmentState.timeLeft > 0) {
      interval = setInterval(() => {
        setAssessmentState(prev => {
          if (prev.timeLeft <= 1) {
            handleTimeUp();
            return { ...prev, timeLeft: 0, timerActive: false };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentState.timerActive]);

  const fetchDataById = useCallback(async () => {
    if (!id) {
      setError('Course ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await dispatch(getCourseDetails({ course_id: id })).unwrap();
      setApiRes(res?.data);
    } catch (error) {
      const errorMessage = error?.message || error || 'Failed to fetch course details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [dispatch, id]);

  useEffect(() => {
    fetchDataById();
  }, [fetchDataById]);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (!window.YT && apiRes?.isResumed) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = () => {
          const iframe = iframeRef.current;
          if (iframe && iframe.src.includes('youtube.com/embed')) {
            const videoId = iframe.src.match(/embed\/([^?]+)/)?.[1];
            if (videoId) {
              try {
                playerRef.current = new window.YT.Player(iframe, {
                  videoId: videoId,
                  events: {
                    onReady: (event) => {
                      console.log("YouTube Player is ready");
                    },
                    onStateChange: (event) => {
                      setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
                    },
                    onError: (event) => {
                      console.error("YouTube Player Error:", event.data);
                      setVideoError(true);
                    }
                  },
                });
              } catch (error) {
                console.error("Error initializing YouTube Player:", error);
                setVideoError(true);
              }
            }
          }
        };
      }
    };

    if (!loading && apiRes?.isResumed) {
      setTimeout(loadYouTubeAPI, 100);
    }
  }, [loading, apiRes]);


  useEffect(() => {
    if (showAssessment && currentQuestion) {
      setTimeLeft(60);
      setTimerActive(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAssessment, currentQuestionIndex]);

  // Timer countdown effect
  useEffect(() => {
    let interval = null;

    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            // Time's up - automatically move to next question
            setTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerActive, timeLeft]);



  const handlePlayPause = () => {
    if (apiRes?.isResumed && playerRef.current) {
      try {
        if (isPlaying) {
          playerRef.current.pauseVideo();
        } else {
          playerRef.current.playVideo();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error("Error controlling video playback:", error);
      }
    } else if (!apiRes?.isResumed) {

      if (apiRes?.is_paid) {
        setIsOpen(true);
      } else {
        handleEnroll(apiRes);
      }
    }
  };

  const getFormattedSkills = () => {
    if (!apiRes?.skills || !Array.isArray(apiRes.skills)) return [];
    return apiRes.skills.map(skill => skill.name || skill);
  };

  const handleEnroll = async (data) => {
    if (data?.is_paid) {
      setIsOpen(true)
    } else {
      try {
        const res = await dispatch(addEnroll({ course_id: data?._id }));
        console.log(res);
        toast.success(res?.message || 'Enrolled successfully!');
        fetchDataById();
      } catch (error) {
        toast.error(error?.message || 'Enrollment failed');
      }
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    console.error("Video failed to load");
  };

  if (loading) {
    return (
      <div className="min-h-screen glassy-card flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="glassy-text-secondary">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen glassy-card flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Course</h2>
          <p className="glassy-text-secondary mb-6">{error}</p>
          <button
            onClick={fetchDataById}
            className="bg-blue-600 glassy-text-primary px-6 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!apiRes) {
    return (
      <div className="min-h-screen glassy-card flex items-center justify-center">
        <div className="text-center">
          <p className="glassy-text-secondary">No course data available</p>
        </div>
      </div>
    );
  }

  const skills = getFormattedSkills();
  const videoUrl = selectedSection || apiRes?.modules?.[0]?.video_url;
  const embedUrl = getEmbedUrl(videoUrl);

  // console.log('Original video :', videoUrl);
  // console.log('Converted embed :', embedUrl);





  // const handleSelectChange = (selected) => {
  //   setFormData((prev) => ({
  //     ...prev, skills: selected?.map(e => e?.value)
  //   }))
  // }







  const handleTimeUp = async () => {
    const { currentQuestionIndex, questions, selectedOptions, courseToken } = assessmentState;
    const currentQuestion = questions[currentQuestionIndex];

    try {
      await dispatch(submitAndUpdateQuestion({
        question: currentQuestion?.question,
        selected_options: selectedOptions,
        courseToken
      })).unwrap();

      if (currentQuestionIndex < questions.length - 1) {
        // Move to next question
        setAssessmentState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          selectedOptions: [],
          timeLeft: 60,
          timerActive: true
        }));
      } else {
        // Assessment completed
        handleAssessmentCompletion();
      }
    } catch (error) {
      toast.error(error || "Failed to submit answer");
    }
  };

  const handleAssessment = async () => {
    try {
      setLoading(true);
      const res = await dispatch(addCourseEnroll({ course_id: id })).unwrap();

      if (!Array.isArray(res.data)) {
        throw new Error('Unexpected response from server');
      }

      setAssessmentState(prev => ({
        ...prev,
        isAssessmentModalOpen: true,
        assessments: res.data
      }));
    } catch (err) {
      toast.error(err.message || 'Failed to fetch assessments');
    } finally {
      setLoading(false);
    }
  };

  const startSelectedAssessment = async (assessment) => {
    try {
      const res = await dispatch(startAssessment({
        assessment_id: assessment._id
      })).unwrap();

      if (res?.data) {
        setAssessmentState(prev => ({
          ...prev,
          isAssessmentModalOpen: false,
          isAssessmentStarted: true,
          selectedAssessment: assessment,
          questions: res.data.questions || [],
          courseToken: res.data.courseToken,
          currentQuestionIndex: 0,
          selectedOptions: [],
          timeLeft: 60,
          timerActive: true
        }));
      }
    } catch (error) {
      toast.error(error || 'Failed to start assessment');
    }
  };

  const handleQuestionSubmit = async () => {
    const { currentQuestionIndex, questions, selectedOptions, courseToken } = assessmentState;
    const currentQuestion = questions[currentQuestionIndex];

    try {
      await dispatch(submitAndUpdateQuestion({
        question: currentQuestion?.question,
        selected_options: selectedOptions,
        courseToken
      })).unwrap();

      if (currentQuestionIndex < questions.length - 1) {
        // Move to next question
        setAssessmentState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          selectedOptions: [],
          timeLeft: 60
        }));
      } else {
        // Assessment completed
        handleAssessmentCompletion();
      }
    } catch (error) {
      toast.error(error || "Failed to submit answer");
    }
  };

  const handleAssessmentCompletion = async () => {
    try {
      const res = await dispatch(declareResult({
        courseToken: assessmentState.courseToken
      })).unwrap();

      setAssessmentState(prev => ({
        ...prev,
        isAssessmentStarted: false,
        isResultModalOpen: true,
        result: res.data,
        timerActive: false
      }));

      toast.success(res.message || "Assessment completed successfully!");
    } catch (error) {
      toast.error(error || "Failed to get assessment results");
    }
  };

  const handleOptionSelect = (option) => {
    const { questions, currentQuestionIndex } = assessmentState;
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion?.question_type === 'multi_choice') {
      setAssessmentState(prev => ({
        ...prev,
        selectedOptions: prev.selectedOptions.includes(option)
          ? prev.selectedOptions.filter(item => item !== option)
          : [...prev.selectedOptions, option]
      }));
    } else {
      setAssessmentState(prev => ({
        ...prev,
        selectedOptions: [option]
      }));
    }
  };

  // ... (keep your existing handlePlayPause, getFormattedSkills, handleEnroll, handleVideoError functions)

  // ... (keep your existing loading, error, and empty state renderings)

  const currentQuestion = assessmentState.questions[assessmentState.currentQuestionIndex] || {};
  const totalQuestions = assessmentState.questions.length || 0;













  return (
    <>
      <div className="min-h-screen   px-4 md:px-8 py-6">

        <nav className="flex items-center gap-2 text-sm py-3">
          <span className="glassy-text-secondary">Course</span>
          <span className="text-gray-400">›</span>
          <span className="font-medium glassy-text-secondary">{apiRes.categories?.name || 'Category'}</span>
          <span className="text-gray-400">›</span>
          <span className="font-medium text-blue-600">{apiRes.name || 'Course'}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold glassy-text-primary">{apiRes.title || apiRes.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${apiRes.is_paid ? 'bg-zinc-900 glassy-text-primary' : 'bg-green-100 text-green-800'
                  }`}>
                  {apiRes.is_paid ? 'Paid' : 'Free'}
                </span>
              </div>
              {!apiRes?.isResumed && (
                <Button
                  className="bg-blue-600 glassy-text-primary px-4 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
                  onClick={() => handleEnroll(apiRes)}
                >
                  {apiRes.is_paid ? `Enroll now - $${apiRes.amount}` : 'Enroll now'}
                </Button>
              )}
            </div>

            <div className="relative bg-slate-800 rounded-lg overflow-hidden mb-6">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0">
                  {apiRes?.isResumed && embedUrl && !videoError ? (

                    <>
                      {videoUrl?.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? (

                        <video
                          ref={iframeRef}
                          width="100%"
                          height="100%"
                          controls
                          className="absolute inset-0 w-full h-full"
                          onError={handleVideoError}
                        >
                          <source src={videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <iframe
                          ref={iframeRef}
                          width="100%"
                          height="100%"
                          src={embedUrl}
                          title="Course Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                          onError={handleVideoError}
                          onLoad={() => setVideoError(false)}
                        />
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-700">
                      {apiRes?.thumbnail_url ? (
                        <img
                          src={apiRes.thumbnail_url}
                          className="w-full h-full object-cover"
                          alt="Course thumbnail"
                          onError={(e) => {
                            e.target.src = '/placeholder-thumbnail.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-700">
                          <div className="text-center glassy-text-primary">
                            <BiPlay className="w-16 h-16 mx-auto mb-2 opacity-50" />
                            <p className="text-sm opacity-75">Video Preview</p>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={handlePlayPause}
                          className="glassy-card bg-opacity-90 hover:bg-opacity-100 rounded-full p-6 transition-all shadow-lg transform hover:scale-105"
                          aria-label="Play video"
                        >
                          <BiPlay className="w-12 h-12 text-gray-800 ml-1" />
                        </button>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <h2 className="text-2xl font-bold glassy-text-primary mb-3">
                          {apiRes.name?.toUpperCase() || 'COURSE PREVIEW'}
                        </h2>
                        {!apiRes?.isResumed && (
                          <p className="glassy-text-primary/80 text-sm">
                            {apiRes.is_paid ? 'Enroll to watch full course' : 'Click to enroll and start learning'}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {videoError && apiRes?.isResumed && (
                    <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                      <div className="text-center glassy-text-primary">
                        <div className="text-red-400 text-4xl mb-4">⚠️</div>
                        <p className="text-lg font-medium mb-2">Video Unavailable</p>
                        <p className="text-sm opacity-75">Unable to load video content</p>
                        <button
                          onClick={() => {
                            setVideoError(false);
                            window.location.reload();
                          }}
                          className="mt-4 bg-blue-600 glassy-text-primary px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm mb-6 glassy-card p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <img
                  src={apiRes?.organization_logo_url || "/logo.png"}
                  alt="Organization logo"
                  className="w-5 h-5 rounded-full border"
                  onError={(e) => {
                    e.target.src = "/logo.png";
                  }}
                />
                <span className="glassy-text-secondary font-medium">{apiRes?.organization_name || ''}</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <BiStar className="text-orange-400 w-5 h-5" />
                <span className="font-semibold glassy-text-primary">4.6</span>
              </div> */}
              <div className="flex items-center gap-2">
                <BiUser className="glassy-text-secondary w-5 h-5" />
                <span className="font-semibold glassy-text-primary">{apiRes?.enrolledEntities || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <BiTimeFive className="glassy-text-secondary w-5 h-5" />
                <span className="font-semibold glassy-text-primary">{apiRes?.duration || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <BiCalendar className="glassy-text-secondary w-5 h-5" />
                <span className="font-semibold glassy-text-primary">
                  {apiRes?.updatedAt ? getDuration(apiRes.updatedAt, Date.now()) : 'Recently updated'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BiGlobe className="glassy-text-secondary w-5 h-5" />
                <span className="font-semibold glassy-text-primary">{apiRes?.language || 'English'}</span>
              </div>
            </div>

            <div className="glassy-card rounded-lg p-6 mb-4 shadow-sm">

              {skills.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {apiRes?.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="glassy-card glassy-text-primary px-3 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        {skill?.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="font-bold text-lg mb-3 glassy-text-primary">About this course</h3>
              <p className="glassy-text-secondary mb-4 leading-relaxed">
                {apiRes.description || 'Course description not available.'}
              </p>

              {apiRes.what_you_will_learn && apiRes.what_you_will_learn.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 glassy-text-primary">What you'll learn:</h4>
                  <ul className="space-y-2">
                    {apiRes.what_you_will_learn.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FaCheck className="text-green-500 mt-1 flex-shrink-0" size={12} />
                        <span className="glassy-text-secondary text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {apiRes.prerequisites && apiRes.prerequisites.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 glassy-text-primary">Prerequisites:</h4>
                  <ul className="space-y-2">
                    {apiRes.prerequisites.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-blue-500 mt-1 font-bold">•</span>
                        <span className="glassy-text-secondary text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {apiRes.target_audience && apiRes.target_audience.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 glassy-text-primary">Who this course is for:</h4>
                  <ul className="space-y-2">
                    {apiRes.target_audience.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <BiUser className="text-blue-500 mt-1 flex-shrink-0" size={14} />
                        <span className="glassy-text-secondary text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="glassy-card rounded-lg shadow-sm border">
              <div className="p-4 border-b glassy-card">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm glassy-text-secondary tracking-wide">COURSE CONTENT</h3>
                  <button className="text-blue-600 hover:text-blue-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="text-base font-semibold glassy-text-primary mt-1">Course Intro</div>
                <span className="text-xs glassy-text-secondary">{apiRes?.duration || 'Duration not specified'}</span>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {apiRes?.modules?.map((item) => (
                  <div
                    key={item.id}

                    className={`p-4 cursor-pointer flex items-center justify-between border-b border-gray-100   transition-colors group ${selectedSection === item.id ? '  border-l-4 border-l-blue-600' : ''
                      }`}
                    onClick={() => setSelectedSection(item.video_url)}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium glassy-text-primary text-sm mb-1 group-hover:text-blue-600 truncate"
                      >
                        {item.title}
                      </h4>
                      {item.content && (
                        <p className="text-xs glassy-text-secondary mb-1 line-clamp-2">{item.content}</p>
                      )}
                      {item.duration && (
                        <p className="text-xs text-gray-400">Duration: {item.duration}</p>
                      )}
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      {item.completed ? (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <FaCheck size={10} className="glassy-text-primary" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center group-hover:border-blue-600 transition-colors">
                          <svg
                            className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {(!apiRes?.modules || apiRes.modules.length === 0) && (
                  <div className="p-8 text-center glassy-text-secondary">
                    <BiTimeFive className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No course modules available</p>
                  </div>
                )}
              </div>
            </div>
            {(apiRes?.is_assessment && apiRes?.assessment_setup && apiRes?.isResumed) && (
              <div className='flex justify-end py-2'>
                <Button className='' variant='outline' onClick={() => handleAssessment(apiRes)}>Start Assessment</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <BuyCoursePopup isOpen={isOpen} setIsOpen={setIsOpen} courseData={apiRes} />

      <Modal
        isOpen={assessmentState.isAssessmentModalOpen}
        title="Select Assessment"
        onClose={() => setAssessmentState(prev => ({ ...prev, isAssessmentModalOpen: false }))}
        hideFooter
        isActionButton={false}
      >
        <div className="space-y-4">
          {assessmentState.assessments.map((assessment) => (
            <div
              key={assessment._id}
              className="border rounded-lg p-4 hover:glassy-card transition cursor-pointer"
              onClick={() => startSelectedAssessment(assessment)}
            >
              <h3 className="font-semibold text-lg">{assessment.title}</h3>
              <p className="glassy-text-secondary text-sm">{assessment.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Level: {assessment.level_id?.name}
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Questions: {assessment.no_of_questions}
                </span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  Time: {assessment.time_limit} mins
                </span>

                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  Max Attempt: {assessment.max_attempts}
                </span>


              </div>
              <p className='cursor-pointer text-blue-500 text-base font-semibold text-end
Add New Assessment'>Click here to start assessment</p>
            </div>
          ))}
        </div>
      </Modal>

      {/* Assessment Question Modal */}
      <Modal
        isOpen={assessmentState.isAssessmentStarted}
        onClose={() => setAssessmentState(prev => ({ ...prev, isAssessmentStarted: false }))}
        title={`Assessment (Question ${assessmentState.currentQuestionIndex + 1} of ${totalQuestions})`}
        hideFooter
        handleSubmit={
          assessmentState.currentQuestionIndex === totalQuestions - 1
            ? handleQuestionSubmit
            : handleQuestionSubmit
        }
        buttonLabel={
          assessmentState.currentQuestionIndex === totalQuestions - 1
            ? "Submit Assessment"
            : "Next Question"
        }
        submitButtonDisabled={assessmentState.selectedOptions.length === 0}
        isActionButton={true}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    strokeWidth="4"
                    fill="none"
                    stroke="currentColor"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-500"
                    strokeWidth="4"
                    strokeDasharray={`${((assessmentState.currentQuestionIndex + 1) / totalQuestions) * 100}, 100`}
                    fill="none"
                    strokeLinecap="round"
                    stroke="currentColor"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
                  {assessmentState.currentQuestionIndex + 1}/{totalQuestions}
                </div>
              </div>
              <span className="text-xs text-blue-700 font-medium">Progress</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    strokeWidth="4"
                    fill="none"
                    stroke="currentColor"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`${assessmentState.timeLeft <= 10
                      ? 'text-red-500'
                      : assessmentState.timeLeft <= 30
                        ? 'text-orange-400'
                        : 'text-green-500'
                      }`}
                    strokeWidth="4"
                    strokeDasharray={`${(assessmentState.timeLeft / 60) * 100}, 100`}
                    fill="none"
                    strokeLinecap="round"
                    stroke="currentColor"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
                  {assessmentState.timeLeft}s
                </div>
              </div>
              <span className="text-xs text-blue-700 font-medium">Timer</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold glassy-text-primary">
              {currentQuestion?.question}
            </h3>
            <p className="text-sm glassy-text-secondary italic">
              {currentQuestion?.question_type === 'multi_choice'
                ? 'Select all that apply'
                : 'Select one option'}
            </p>

            <div className="space-y-3">
              {currentQuestion?.options?.map((option, index) => {
                const isSelected = assessmentState.selectedOptions.includes(option);
                return (
                  <div
                    key={index}
                    className={`p-4 border rounded-xl cursor-pointer transition duration-300 ease-in-out 
                      ${isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:glassy-card'
                      }`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <div className="flex items-center">
                      <input
                        type={currentQuestion.question_type === 'multi_choice' ? 'checkbox' : 'radio'}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        checked={isSelected}
                        readOnly
                      />
                      <label className="ml-3 block glassy-text-secondary text-sm font-medium">
                        {String.fromCharCode(65 + index)}. {option}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {assessmentState.timeLeft <= 10 && assessmentState.timeLeft > 0 && (
            <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg text-sm font-medium">
              ⚠️ Hurry up! Only {assessmentState.timeLeft} seconds left!
            </div>
          )}
        </div>
      </Modal>

      {/* Result Modal */}
      <Modal
        isOpen={assessmentState.isResultModalOpen}
        title="Assessment Results"
        onClose={() => setAssessmentState(prev => ({ ...prev, isResultModalOpen: false }))}
        hideFooter
        isActionButton={false}
      >
        {assessmentState.result && (
          <div className="space-y-4">
            {/* Summary Header */}
            <div className="text-center">
              <div
                className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${assessmentState.result.passed ? "bg-green-100" : "bg-red-100"
                  }`}
              >
                {assessmentState.result.passed ? (
                  <svg
                    className="w-12 h-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-12 h-12 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
              <h3
                className={`text-xl font-bold mt-4 ${assessmentState.result.passed ? "text-green-600" : "text-red-600"
                  }`}
              >
                {assessmentState.result.passed ? "Congratulations!" : "Assessment Failed"}
              </h3>
              <p className="glassy-text-secondary mt-2">
                {assessmentState.result.passed
                  ? "You have successfully passed the assessment."
                  : "You did not meet the passing criteria."}
              </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="glassy-card p-4 rounded-lg">
                <p className="text-sm glassy-text-secondary">Score</p>
                <p className="text-2xl font-bold">
                  {assessmentState.result.total_score} / {assessmentState.result.total_questions}
                </p>
              </div>
              {/* <div className="glassy-card p-4 rounded-lg">
                <p className="text-sm glassy-text-secondary">Percentage</p>
                <p className="text-2xl font-bold">
                  {Math.round(assessmentState.result.percentage)}%
                </p>
              </div> */}
              {/* <div className="glassy-card p-4 rounded-lg">
                <p className="text-sm glassy-text-secondary">Passing Percentage</p>
                <p className="text-2xl font-bold">
                  {assessmentState.result.passing_percentage}%
                </p>
              </div> */}
              {/* <div className="glassy-card p-4 rounded-lg">
                <p className="text-sm glassy-text-secondary">Time Taken</p>
                <p className="text-2xl font-bold">
                  {Math.floor(assessmentState.result.time_taken / 60)}m{" "}
                  {assessmentState.result.time_taken % 60}s
                </p>
              </div> */}
            </div>

            {/* Questions with Answers */}
            <div className="mt-8 space-y-6">
              {assessmentState.result.answers.map((ans, idx) => (
                <div key={idx} className="p-4 border rounded-lg shadow-sm glassy-card">
                  <p className="font-semibold text-gray-800">
                    Q{idx + 1}: {ans.question}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {ans.options.map((opt, i) => {
                      const isSelected = ans.selected_options.includes(opt);
                      return (
                        <li
                          key={i}
                          className={`px-3 py-1 rounded ${isSelected
                            ? ans.is_correct
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                            : "glassy-card glassy-text-secondary"
                            }`}
                        >
                          {opt}
                        </li>
                      );
                    })}
                  </ul>
                  <p
                    className={`mt-2 text-sm font-medium ${ans.is_correct ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {ans.is_correct ? "Correct" : "Incorrect"}
                  </p>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <div className="mt-6">
              <Button
                variant="primary"
                onClick={() =>
                  setAssessmentState((prev) => ({ ...prev, isResultModalOpen: false }))
                }
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </>
  );
};

export default CourseDetailPage;