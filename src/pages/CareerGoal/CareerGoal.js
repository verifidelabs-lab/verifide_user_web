import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  applyJobApplication,
  jobScreeningQuestion,
} from "../../redux/Users/userSlice";
import { BiCheckCircle, BiChevronRightCircle, BiMapPin } from "react-icons/bi";
import { LuBuilding2 } from "react-icons/lu";
// import { FaUserSecret } from 'react-icons/fa';
import { CiLock } from "react-icons/ci";
import { toast } from "sonner";

const CareerGoal = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.user);
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const screeningQuestions =
    selector?.jobScreeningQuestionData?.data?.data?.screening_questions || [];
  const jobData = selector?.jobScreeningQuestionData?.data?.data;
  console.log("🧩 Job Data fetched from backend:", jobData);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(jobScreeningQuestion({ job_id: id }));
    }
  }, [dispatch, id]);
  useEffect(() => {
    console.log("this is the jobdata", jobData?.isApplied);
    if (jobData?.isApplied === true) {
      toast.warning("You have already applied for this job.");
      navigate("/user/opportunitiess");
    }
  }, [jobData?.isApplied, navigate]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  // Fixed useEffect with proper dependency
  useEffect(() => {
    if (screeningQuestions.length > 0) {
      setAnswers(
        screeningQuestions.map((q) => ({
          question: q.question,
          question_type: q.question_type,
          options: q.options || [],
          selected_options: [],
        }))
      );

      const initialTime = (screeningQuestions[0]?.time_limit || 0) * 60;
      setTimeLeft(initialTime);
      setTimerActive(true);
    }
  }, [screeningQuestions]); // Added screeningQuestions as dependency

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, timerActive, currentQuestion, screeningQuestions]); // Added screeningQuestions

  const handleTimeExpired = () => {
    if (currentQuestion < screeningQuestions.length - 1) {
      // Auto-move to next question
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
        const nextQuestionTime =
          (screeningQuestions[currentQuestion + 1]?.time_limit || 0) * 60;
        setTimeLeft(nextQuestionTime);
        setTimerActive(true);
      }, 1000);
    } else {
      // Auto-submit when last question time expires
      setAutoSubmitted(true);
      handleSubmit(true);
    }
  };

  const handleSingleChoiceSelect = (option) => {
    const newAnswers = [...answers];
    // Added safety check to prevent undefined error
    if (newAnswers[currentQuestion]) {
      newAnswers[currentQuestion].selected_options = [option];
      setAnswers(newAnswers);
    }
  };

  const handleMultiChoiceSelect = (option) => {
    const newAnswers = [...answers];
    // Added safety check to prevent undefined error
    if (newAnswers[currentQuestion]) {
      const currentSelections = newAnswers[currentQuestion].selected_options;

      if (currentSelections.includes(option)) {
        newAnswers[currentQuestion].selected_options = currentSelections.filter(
          (item) => item !== option
        );
      } else {
        newAnswers[currentQuestion].selected_options = [
          ...currentSelections,
          option,
        ];
      }

      setAnswers(newAnswers);
    }
  };

  const handleTextAnswerChange = (e) => {
    const newAnswers = [...answers];
    const value = e.target.value;
    // Added safety check to prevent undefined error
    if (newAnswers[currentQuestion]) {
      newAnswers[currentQuestion].selected_options = [value];
      setAnswers(newAnswers);
    }
  };

  const handleNext = () => {
    if (currentQuestion < screeningQuestions.length - 1) {
      setTimerActive(false);
      setCurrentQuestion(currentQuestion + 1);
      const nextQuestionTime =
        (screeningQuestions[currentQuestion + 1]?.time_limit || 0) * 60;
      setTimeLeft(nextQuestionTime);
      setTimerActive(true);
    }
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    // Validation: ensure all questions have at least one answer
    for (let i = 0; i < answers.length; i++) {
      const ans = answers[i];
      if (
        ans.selected_options.length === 0 ||
        (ans.question_type === "theoretical" &&
          !ans.selected_options[0]?.trim())
      ) {
        toast.error(`Please answer question ${i + 1} before submitting.`);
        setCurrentQuestion(i);
        return; // stop submission
      }
    }

    const payload = {
      job_id: jobData._id,
      answers: answers.map((answer) => ({
        question: answer.question,
        question_type: answer.question_type,
        options: answer.options,
        selected_options: answer.selected_options,
      })),
      // auto_submitted: isAutoSubmit
    };

    try {
      setLoading(true);
      const res = await dispatch(applyJobApplication(payload)).unwrap();
      toast.success(
        res?.message || "Your answers have been submitted successfully!"
      );
      navigate(`/user/opportunitiess`);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatSalary = (range) => {
    return `₹${range.split("-").join(" - ")}`;
  };

  if (screeningQuestions.length === 0) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className="glassy-card rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-lg glassy-text-secondary">
            Loading screening questions...
          </p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen   flex items-center justify-center p-4">
        <div className="glassy-card rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BiCheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold glassy-text-primary mb-4">
            {autoSubmitted ? "Time Completed!" : "Thank You!"}
          </h1>
          <p className="glassy-text-secondary mb-6">
            {autoSubmitted
              ? "Your screening answers have been automatically submitted due to time completion."
              : "Your screening answers have been successfully submitted."}
          </p>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 glassy-text-primary font-semibold py-3 px-6 rounded-lg transition-colors"
            onClick={() => navigate(`/user/opportunitiess/`)}
          >
            Back to Your Opportunities
          </button>
        </div>
      </div>
    );
  }

  const currentQ = screeningQuestions[currentQuestion];
  const currentAnswer = answers[currentQuestion] || {};

  return (
    <div className="min-h-screen   p-4">
      <div className="max-w-4xl mx-auto">
        {/* Job Information Card */}
        <div className="glassy-card rounded-2xl shadow-lg mb-6 p-6">
          <div className="flex items-start gap-4">
            <Link
              to={`/user/view-details/companies/${jobData?.company_id?._id}`}
            >
              <img
                src={jobData?.company_id?.logo_url}
                alt="Company Logo"
                className="w-16 h-16 rounded-lg object-cover border"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://res.cloudinary.com/dsnqduetr/image/upload/v1761043320/post-media/companylogo.png"; // fallback image
                }}
              />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Link
                  to={`/user/view-details/companies/${jobData?.company_id?._id}`}
                >
                  <h1 className="text-xl font-bold glassy-text-primary">
                    {jobData.job_title.name}
                  </h1>
                </Link>
                <span className="px-3 py-1 glassy-card text-blue-800 text-sm font-medium rounded-full">
                  {jobData.job_type}
                </span>
              </div>
              <div className="flex items-center gap-2 glassy-text-secondary mb-3">
                <LuBuilding2 className="w-4 h-4" />
                <span className="font-medium">{jobData.company_id.name}</span>
                <span className="glassy-text-secondary">•</span>
                <span>{jobData.industry_id.name}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm glassy-text-secondary">
                  <BiMapPin className="w-4 h-4" />
                  <span>
                    {jobData.work_location.city.name},{" "}
                    {jobData.work_location.state.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm glassy-text-secondary">
                  <span>{formatSalary(jobData.salary_range)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="glassy-card rounded-2xl shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold glassy-text-primary">
                Screening Questions
              </h2>
              <p className="text-sm glassy-text-secondary">
                Question {currentQuestion + 1} of {screeningQuestions.length}
              </p>
            </div>

            {/* Timer */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeLeft <= 30
                  ? "glassy-card text-red-700"
                  : "glassy-card text-blue-700"
              }`}
            >
              <CiLock className="w-4 h-4" />
              <span className="font-mono font-semibold">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium glassy-text-primary mb-6">
              {currentQ.question}
            </h3>

            {currentQ.question_type === "single_choice" && (
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:glassy-card hover:glassy-card ${
                      currentAnswer.selected_options?.includes(option)
                        ? "border-blue-500 glassy-card"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleSingleChoiceSelect(option)}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        checked={
                          currentAnswer.selected_options?.includes(option) ||
                          false
                        }
                        onChange={() => {}}
                      />
                      <label className="ml-3 glassy-text-primary cursor-pointer">
                        {option}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentQ.question_type === "multi_choice" && (
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-blue-300 hover:glassy-card ${
                      currentAnswer.selected_options?.includes(option)
                        ? "border-blue-500 glassy-card"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleMultiChoiceSelect(option)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={
                          currentAnswer.selected_options?.includes(option) ||
                          false
                        }
                        onChange={() => {}}
                      />
                      <label className="ml-3 glassy-text-primary cursor-pointer">
                        {option}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentQ.question_type === "theoretical" && (
              <div>
                <textarea
                  className="w-full h-40 p-4 border-2 border-gray-200 glassy-input rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Type your detailed answer here..."
                  value={currentAnswer.selected_options?.[0] || ""}
                  onChange={handleTextAnswerChange}
                />
                <div className="mt-2 text-sm glassy-text-secondary">
                  Character count:{" "}
                  {(currentAnswer.selected_options?.[0] || "").length}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            {currentQuestion < screeningQuestions.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 glassy-text-primary font-semibold rounded-lg transition-all"
              >
                Next
                <BiChevronRightCircle className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 glassy-text-primary font-semibold rounded-lg transition-all"
              >
                <BiCheckCircle className="w-4 h-4" />
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>

          {/* Warning for time */}
          {timeLeft <= 30 && timeLeft > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">
                ⚠️ Warning: Only {timeLeft} seconds remaining for this question!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerGoal;
