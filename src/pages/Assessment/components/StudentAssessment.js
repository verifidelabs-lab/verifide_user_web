/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiChevronLeft, BiSearch } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import { toast } from 'sonner';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  getAssessmentDataByToken,
  userAssessmentList,
  startAssessment,
  declareResult,
  submitAnswer
} from '../../../redux/assessments/assessmentSlice';
import Button from '../../../components/ui/Button/Button';
import NoDataFound from '../../../components/ui/No Data/NoDataFound';
import { AssessmentCard } from './AssessmentCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Constants
const TABS = [{ value: "all", label: 'All' }, { value: "completed", label: 'Completed' }];
const POSTS_PER_PAGE = 9;
const QUESTION_TIME_LIMIT = 60;

const StudentAssessment = () => {
  // Hooks and state initialization
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const selector = useSelector(state => state.assessments);
  const { userAssessmentListData } = selector || {};

  // State management
  const [assessments, setAssessments] = useState([]);
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState('all');
  const [tokenData, setTokenData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [timerActive, setTimerActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [resultData, setResultData] = useState(null);

  // Derived values
  const currentQuestion = tokenData?.questions?.[currentQuestionIndex] || {};
  const totalQuestions = tokenData?.questions?.length || 0;

  // Effects
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && TABS.some((t) => t.value === tabParam)) {
      setActiveSection(tabParam);
    } else {
      setActiveSection("all");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!token) {
      const list = userAssessmentListData?.data?.data?.list || [];
      const total = userAssessmentListData?.data?.data?.total || 0;
      setAssessments(list);
      setTotalPosts(total);
      setIsLoading(false);
    }
  }, [userAssessmentListData?.data?.data, token]);

  const fetchAssessments = useCallback((keyword = '', pageNum = 1) => {
    setIsLoading(true);
    dispatch(
      userAssessmentList({
        page: pageNum,
        size: POSTS_PER_PAGE,
        keyWord: keyword,
        query: JSON.stringify({ type: activeSection.toLowerCase() }),
      })
    );
  }, [activeSection, dispatch]);

  useEffect(() => {
    if (!token) {
      fetchAssessments(search, currentPage);
    } else {
      fetchAssessmentDataByToken();
    }
  }, [activeSection, fetchAssessments, search, token, currentPage, searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeSection]);

  // Timer effects
  useEffect(() => {
    if (currentQuestion && tokenData) {
      setTimeLeft(QUESTION_TIME_LIMIT);
      setTimerActive(true);
    }
  }, [currentQuestionIndex, tokenData]);

  useEffect(() => {
    let interval = null;

    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      handleTimeUp();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  // Helper functions
  const fetchAssessmentDataByToken = async () => {
    try {
      const res = await dispatch(
        getAssessmentDataByToken({
          assessmentToken: token
        })
      ).unwrap();

      if (!res.error && res?.data) {
        setTokenData(res?.data);
        setTimerActive(true);
      } else {
        toast.error('Failed to start assessment');
        navigate(`/user/assessment`);
      }
    } catch (error) {
      toast.error(error || 'Failed to start assessment');
      navigate(`/user/assessment`);
    }
  };

  const clearSearch = () => {
    setSearch('');
    setCurrentPage(1);
    fetchAssessments('', 1);
  };

  const handleTabChange = (tabName) => {
    setActiveSection(tabName);
    setSearchParams({ tab: tabName });
    setCurrentPage(1);
  };

  const handleStartAssessment = async (assessment) => {
    try {
      const payload = {
        assessment_id: assessment.assessment_id._id,
        type: assessment.assessment_id?.course_id ? "course" : 'skill'
      };
      const res = await dispatch(startAssessment(payload)).unwrap();

      if (!res.error && res?.data?.assessmentToken) {
        navigate(`/user/assessment/${res?.data?.assessmentToken}`);
      } else {
        toast.error('Failed to start assessment');
      }
    } catch (error) {
      toast.error(error || 'Failed to start assessment');
    }
  };

  const handleQuestionSubmit = async () => {
    try {
      const payload = {
        question: currentQuestion?.question,
        selected_options: selectedOptions,
        assessmentToken: token,
      };

      const response = await dispatch(submitAnswer(payload)).unwrap();
      toast.info(response?.message);

      if (response) {
        setTimerActive(false);

        const res = await dispatch(declareResult({ assessmentToken: token })).unwrap();
        toast.success(res?.message || 'Assessment completed successfully!');
        setResultData(res?.data);
        setShowResult(true);
      }
    } catch (error) {
      toast.error(error || 'Failed to submit assessment');
    }
  };

  const handleNextQuestion = async () => {
    try {
      const currentQuestion = tokenData?.questions?.[currentQuestionIndex];
      const payload = {
        question: currentQuestion?.question,
        selected_options: selectedOptions,
        assessmentToken: token,
      };

      await dispatch(submitAnswer(payload)).unwrap();

      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOptions([]);
        setTimeLeft(QUESTION_TIME_LIMIT);
        setTimerActive(true);
      } else {
        const res = await dispatch(declareResult({ assessmentToken: token })).unwrap();
        setResultData(res?.data);
        setShowResult(true);
      }
    } catch (error) {
      toast.error(error || "Failed to submit answer");
    }
  };

  const handleTimeUp = () => {
    if (currentQuestionIndex === totalQuestions - 1) {
      handleQuestionSubmit();
    } else {
      handleNextQuestion();
    }
  };

  const handleBackToAssessments = () => {
    setShowResult(false);
    setResultData(null);
    setTokenData(null);
    setCurrentQuestionIndex(0);
    setSelectedOptions([]);
    setTimerActive(false);
    setTimeLeft(QUESTION_TIME_LIMIT);
    navigate('/user/assessment');
  };

  const handleViewCertificate = (data) => {
    navigate(`/certtificate-view/${data}`)
  };

  // Sub-components
  const ResultDisplay = () => (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto glassy-card rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-4">
            <button
              className="p-1 rounded hover:bg-[var(--bg-card-unread)] transition-colors"
              onClick={handleBackToAssessments}
            >
              <BiChevronLeft className="w-5 h-5 glassy-text-secondary" />
            </button>
            <h1 className="text-lg font-medium glassy-text-primary">
              Assessment Results
            </h1>
          </div>
          {resultData?.certificate_id && (
            <Button onClick={() => handleViewCertificate(resultData?.certificate_id)}>
              Certificate View
            </Button>
          )}
          <div
            className={`px-4 py-2 rounded-lg font-semibold ${resultData?.passed
                ? 'glassy-card text-green-600'
                : 'glassy-card text-red-600'
              }`}
          >
            {resultData?.passed ? '✅ PASSED' : '❌ FAILED'}
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="glassy-card p-4 text-center">
                <div className="text-2xl font-bold glassy-text-primary">
                  {resultData?.total_questions}
                </div>
                <div className="text-sm glassy-text-secondary">Total Questions</div>
              </div>
              <div className="glassy-card p-4 text-center">
                <div className="text-2xl font-bold glassy-text-primary">
                  {resultData?.total_score}
                </div>
                <div className="text-sm glassy-text-secondary">Total Score</div>
              </div>
              <div className="glassy-card p-4 text-center">
                <div className="text-2xl font-bold glassy-text-primary">
                  {resultData?.passed ? 'PASSED' : 'FAILED'}
                </div>
                <div className="text-sm glassy-text-secondary">Status</div>
              </div>
            </div>

            {/* Question by Question Results */}
            <h3 className="text-lg font-semibold mb-4 glassy-text-primary">
              Detailed Results
            </h3>
            {resultData?.answers?.map((answer, index) => (
              <div key={index} className="glassy-card p-4 rounded-lg shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="font-medium text-base glassy-text-primary">
                    Q{index + 1}: {answer.question}
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-sm font-semibold ${answer.is_correct
                        ? 'glassy-card text-green-600'
                        : 'glassy-card text-red-600'
                      }`}
                  >
                    {answer.is_correct ? 'Correct' : 'Incorrect'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm glassy-text-secondary">
                  <div>
                    <span className="font-semibold">Type:</span> {answer.question_type}
                  </div>
                  <div>
                    <span className="font-semibold">Score:</span> {answer.score}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="font-semibold text-sm mb-2 glassy-text-primary">Options:</div>
                  <ul className="list-none space-y-1">
                    {answer.options.map((opt, i) => (
                      <li
                        key={i}
                        className={`p-2 rounded text-sm ${answer.selected_options.includes(opt)
                            ? answer.is_correct
                              ? 'glassy-card text-green-600 font-semibold'
                              : 'glassy-card text-red-600 font-semibold'
                            : 'glassy-card glassy-text-secondary'
                          }`}
                      >
                        <span className="font-medium">{String.fromCharCode(65 + i)}.</span> {opt}
                        {answer.selected_options.includes(opt) && (
                          <span className="ml-2 text-xs">
                            {answer.is_correct ? '✅ Your answer' : '❌ Your answer'}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 text-sm">
                  <span className="font-semibold glassy-text-primary">Your Selection:</span>{' '}
                  <span className={answer.selected_options.length > 0 ? 'glassy-text-primary' : 'glassy-text-secondary'}>
                    {answer.selected_options.join(', ') || 'No answer selected'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 pt-4 border-t border-[var(--border-color)]">
            <Button className="px-8 py-2 glassy-card glassy-text-primary rounded-lg hover:glassy-text-primary transition-colors"
              onClick={handleBackToAssessments}
            >
              Back to Assessments
            </Button>
          </div>
        </div>
      </div>
    </div>
  );


  const Pagination = () => {
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

    const handlePageChange = (page) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
    };

    const getPageNumbers = () => {
      const pages = [];
      if (totalPages <= 1) return [1];

      pages.push(1);

      if (currentPage > 3) {
        pages.push('start-ellipsis');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('end-ellipsis');
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }

      return pages;
    };

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between p-4">
        <div className="text-sm glassy-text-secondary">
          Showing {(currentPage - 1) * POSTS_PER_PAGE + 1} to{' '}
          {Math.min(currentPage * POSTS_PER_PAGE, totalPosts)} of {totalPosts} assessments
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded text-gray-700 hover:bg-gray-300 hover:glassy-text-primary disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            <FiChevronLeft size={18} />
          </button>
          {getPageNumbers().map((item, index) => {
            if (item === 'start-ellipsis' || item === 'end-ellipsis') {
              return (
                <span key={index} className="px-2 glassy-text-secondary">
                  ...
                </span>
              );
            }
            return (
              <button
                key={item}
                onClick={() => handlePageChange(item)}
                className={`w-8 h-8 rounded flex items-center justify-center transition ${currentPage === item
                  ? 'bg-blue-600 glassy-text-primary'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {item}
              </button>
            );
          })}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded text-gray-700 hover:bg-gray-300 hover:glassy-text-primary disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  const AssessmentList = () => (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold glassy-text-primary">Assessments</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full"
            />
            {search && (
              <IoClose
                size={18}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={clearSearch}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex space-x-1 p-1 rounded-full glassy-card w-fit border border-[#adadad4b] mb-6">
        {TABS.map((item) => (
          <button
            key={item.value}
            onClick={() => handleTabChange(item.value)}
            className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out ${activeSection === item.value
              ? 'bg-[#2563EB1A] text-blue-500 shadow'
              : 'glassy-text-secondary hover:glassy-text-primary'
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <Pagination />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {assessments.length ? (
            assessments.map((assessment) => (
              <AssessmentCard
                key={assessment._id}
                assessment={assessment}
                handleStartAssessment={handleStartAssessment}
              />
            ))
          ) : (
            <div className="col-span-full">
              <NoDataFound />
            </div>
          )}
        </div>
      )}
    </div>
  );

  const ActiveAssessment = () => (
    <div className="min-h-screen p-4 glassy-app">
      <div className="max-w-2xl mx-auto rounded-lg glassy-card shadow-sm">

        {/* Top Info */}
        <div className="flex items-center justify-between px-6 py-4 glassy-card border-b border-[var(--border-color)] shadow-sm mb-10">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold glassy-text-primary">
              {tokenData?.no_of_questions
                ? `${tokenData.no_of_questions} Questions`
                : "Assessment"}
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm glassy-text-secondary">Passing Score</span>
              <span className="text-base font-medium glassy-text-primary">
                {tokenData?.passing_score ?? "-"} %
              </span>
            </div>
            <div className="px-3 py-1 glassy-card rounded-full text-sm font-medium text-[var(--text-primary)]">
              Max Attempts: {tokenData?.max_attempts ?? "-"}
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)] glassy-card">
          <div className="flex items-center gap-4">
            <button
              className="p-1 rounded hover:glassy-card transition"
              onClick={handleBackToAssessments}
            >
              <BiChevronLeft className="w-5 h-5 glassy-text-primary" />
            </button>
            <h1 className="text-lg font-medium glassy-text-primary">
              {tokenData?.title || "Assessment"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm glassy-text-secondary">
              {currentQuestionIndex + 1}/{tokenData?.no_of_questions}
            </span>
            <div className="w-8 h-8 glassy-card rounded-full flex items-center justify-center">
              <span className="text-sm glassy-text-primary">😊</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="p-6 space-y-6 glassy-card">
          {/* Progress & Timer */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[var(--border-color)]"
                    strokeWidth="4"
                    fill="none"
                    stroke="currentColor"
                    d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-500"
                    strokeWidth="4"
                    strokeDasharray={`${((currentQuestionIndex + 1) / totalQuestions) * 100}, 100`}
                    fill="none"
                    strokeLinecap="round"
                    stroke="currentColor"
                    d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold glassy-text-primary">
                  {currentQuestionIndex + 1}/{totalQuestions}
                </div>
              </div>
              <span className="text-xs glassy-text-secondary font-medium">Progress</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[var(--border-color)]"
                    strokeWidth="4"
                    fill="none"
                    stroke="currentColor"
                    d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`${timeLeft <= 10
                      ? "text-red-500"
                      : timeLeft <= 30
                        ? "text-orange-400"
                        : "text-green-500"
                      }`}
                    strokeWidth="4"
                    strokeDasharray={`${(timeLeft / QUESTION_TIME_LIMIT) * 100}, 100`}
                    fill="none"
                    strokeLinecap="round"
                    stroke="currentColor"
                    d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold glassy-text-primary">
                  {timeLeft}s
                </div>
              </div>
              <span className="text-xs glassy-text-secondary font-medium">Timer</span>
            </div>
          </div>

          {/* Question & Options */}
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
                const isSelected = selectedOptions.includes(option);
                return (
                  <div
                    key={index}
                    className={`p-4 border rounded-xl cursor-pointer transition duration-300 ease-in-out
                    ${isSelected
                        ? 'border-blue-500 bg-[var(--bg-card-unread)] shadow-sm'
                        : 'border-[var(--border-color)] hover:glassy-card'
                      }`}
                    onClick={() => {
                      if (currentQuestion.question_type === 'multi_choice') {
                        setSelectedOptions(prev =>
                          prev.includes(option)
                            ? prev.filter(item => item !== option)
                            : [...prev, option]
                        );
                      } else {
                        setSelectedOptions([option]);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <input
                        type={currentQuestion.question_type === 'multi_choice' ? 'checkbox' : 'radio'}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        checked={isSelected}
                        readOnly
                      />
                      <label className="ml-3 block text-sm font-medium glassy-text-primary">
                        {String.fromCharCode(65 + index)}. {option}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {timeLeft <= 10 && timeLeft > 0 && (
            <div className="p-3 rounded-lg glassy-card glassy-text-primary text-sm font-medium border border-red-300">
              ⚠️ Hurry up! Only {timeLeft} seconds left!
            </div>
          )}
        </div>

        {/* Next / Submit Button */}
        <div className="flex justify-end items-center p-6 border-t border-[var(--border-color)]">
          <button
            className="px-6 py-2 glassy-card glassy-text-primary rounded-lg hover:glassy-text-secondary transition-colors"
            onClick={() =>
              currentQuestionIndex === totalQuestions - 1
                ? handleQuestionSubmit()
                : handleNextQuestion()
            }
          >
            {currentQuestionIndex === totalQuestions - 1
              ? "Submit Assessment"
              : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );


  // Main render logic
  return (
    <div className="  min-h-screen px-4 lg:px-6 md:py-6 py-2">
      {showResult ? (
        <ResultDisplay />
      ) : !token ? (
        <AssessmentList />
      ) : (
        <ActiveAssessment />
      )}
    </div>
  );
};

export default StudentAssessment;