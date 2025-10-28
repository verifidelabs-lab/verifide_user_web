import { BiChevronLeft, BiChevronRight, BiSend, BiX } from "react-icons/bi";
import { toast } from "sonner";
import { submitSurveyPolls } from "../../../redux/Global Slice/cscSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import QuestTypeBadge from "./QuestTypeBadge";

const PollFormUser = ({ isOpen, onClose, quest }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  const formStructure = {
    title: quest?.title || "Customer Feedback Survey",
    description: quest?.description || "Please take a few moments to provide your feedback. Your response is valuable to us.",
    pages: []
  };
  if (quest?.surveyPolls && quest.surveyPolls.length > 0) {
    const questionsPerPage = 5;
    for (let i = 0; i < quest.surveyPolls.length; i += questionsPerPage) {
      const pageQuestions = quest.surveyPolls.slice(i, i + questionsPerPage);
      formStructure.pages.push({
        questions: pageQuestions.map((q, index) => ({
          id: i + index,
          survey_index: i + index,
          type: q.type,
          title: q.title,
          required: q.isRequired || false,
          options: q.options || []
        }))
      });
    }
  }
  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentQuestions = formStructure.pages[currentPage].questions;
    const missingRequired = currentQuestions.filter(
      q => q.required && (!responses[q.id] ||
        (Array.isArray(responses[q.id]) && responses[q.id].length === 0))
    );
    if (missingRequired.length > 0) {
      toast.warning("Please answer all required questions.");
      return;
    }
    if (currentPage < formStructure.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      await submitResponses();
    }
  };
  const submitResponses = async () => {
    try {
      setLoading(true);
      const answers = Object.entries(responses).map(([questionId, selected_options]) => {
        const questionIndex = parseInt(questionId);
        const question = formStructure.pages.flatMap(page => page.questions)
          .find(q => q.id === questionIndex);
        return {
          survey_index: question.survey_index,
          selected_options: Array.isArray(selected_options) ? selected_options : [selected_options]
        };
      }).filter(answer => answer.selected_options.length > 0 &&
        answer.selected_options[0] !== '');

      const payload = {
        quest_id: quest._id,
        answers
      };
      await dispatch(submitSurveyPolls(payload));
      setSubmitted(true);
      toast.success("Response submitted successfully!");
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error("Failed to submit response. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'short-answer':
        return (
          <input
            type="text"
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            placeholder="Your answer"
          />
        );

      case 'multi-choice':
      case 'poll':
        return (
          <div className="space-y-2 mt-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`q${question.id}_opt${index}`}
                  name={`question_${question.id}`}
                  value={option}
                  checked={responses[question.id] === option}
                  onChange={() => handleResponseChange(question.id, option)}
                  className="mr-2"
                />
                <label htmlFor={`q${question.id}_opt${index}`} className="text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case 'checkbox':
      case 'multi-choice':
        return (
          <div className="space-y-2 mt-2">
            {question.options.map((option, index) => {
              const selectedOptions = responses[question.id] || [];
              return (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`q${question.id}_opt${index}`}
                    name={`question_${question.id}`}
                    value={option}
                    checked={selectedOptions.includes(option)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...selectedOptions, option]
                        : selectedOptions.filter(opt => opt !== option);
                      handleResponseChange(question.id, newValue);
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`q${question.id}_opt${index}`} className="text-gray-700">
                    {option}
                  </label>
                </div>
              );
            })}
          </div>
        );

      case 'dropdown':
        return (
          <select
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select an option</option>
            {question.options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      default:
        return <p className="text-red-500">Unsupported question type: {question.type}</p>;;
    }
  };
  if (!quest?.surveyPolls || quest.surveyPolls.length === 0) {
    return (
      <div className="fixed inset-0 glassy-card/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="glassy-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-medium text-gray-800">Survey</h2>
            <button
              onClick={onClose}
              className="glassy-text-secondary hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <BiX className="text-2xl" />
            </button>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-600">No survey questions available.</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 glassy-card/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glassy-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-800 capitalize">{formStructure.title}</h2>
          <button
            onClick={onClose}
            className="glassy-text-secondary hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <BiX className="text-2xl" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="bg-blue-100 text-blue-800 p-4 rounded-full inline-block mb-4">
                <BiSend className="text-3xl" onClick={onClose} />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Response submitted successfully!</h3>
              <p className="text-gray-600">Thank you for completing the form.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">{formStructure.description}</p>
                {formStructure.pages.length > 1 && (
                  <div className="text-sm glassy-text-secondary mt-2">
                    Page {currentPage + 1} of {formStructure.pages.length}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                {formStructure.pages[currentPage].questions.map((question, index) => (
                  <div key={question.id} className="mb-8">
                    <div className="flex items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-800 flex-1 capitalize">
                        {question.title}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </h3>
                      {index === 0 && (
                        <QuestTypeBadge type={quest.type} />
                      )}
                    </div>
                    {renderQuestion(question)}
                  </div>
                ))}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentPage === 0}
                    className={`flex items-center px-4 py-2 rounded ${currentPage === 0 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
                  >
                    <BiChevronLeft className="text-xl" /> Previous
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 glassy-text-primary font-medium py-2 px-6 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' :
                      (currentPage < formStructure.pages.length - 1 ? 'Next' : 'Submit')}
                    {currentPage < formStructure.pages.length - 1 && !loading && <BiChevronRight className="text-xl ml-1" />}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollFormUser
