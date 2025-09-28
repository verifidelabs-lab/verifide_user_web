/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  BiPlus,
  BiCalendar,
  BiUser,
  BiTrophy,
  BiRun,
  BiMedal,
  BiChevronRight,
  BiChevronLeft,
  BiChevronLeftCircle,
  // BiCheckCircle
} from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  engagementList,
  feedbackReport,
  getFeedbackReport,
  getQuestList,
  softDelete,
  submitFeedback,
  surveyPollReport,
  updateQuestViewCount,
  userRegisterOnQuest,
  voteOnPoll,
} from "../../redux/Global Slice/cscSlice";
import { toast } from "sonner";
import { getCookie } from "../../components/utils/cookieHandler";
import useFormHandler from "../../components/hooks/useFormHandler";
import Modal from "../../components/ui/Modal/Modal";
import AOS from "aos";
import "aos/dist/aos.css";
import FilterDropdown from "../Home/components/FilterDropdown";
import QuestCard from "./Components/QuestCard";
import EngagementItem from "./Components/EngagementItem";
import FeedbackModal from "./Components/FeedbackModal";
import CustomInput from "../../components/ui/Input/CustomInput";
import { FiMoreVertical } from "react-icons/fi";
import { FaExternalLinkAlt } from "react-icons/fa";
import Modal2 from "../../components/ui/Modal/Modal2";

const EmptyState = ({ activeTab, onCreateQuest, accessMode }) => (
  <div className="flex flex-col items-center justify-center mt-12 py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
    <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-full mb-6">
      <BiTrophy className="h-10 w-10 text-blue-600" />
    </div>
    <p className="text-xl font-bold mb-2 text-gray-800">
      No {activeTab !== "all" ? activeTab : ""} Quests Found
    </p>
    <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
      {activeTab === "all"
        ? "Start by creating your first Quest to engage your community."
        : `You don't have any ${activeTab.toLowerCase()} quests right now.`}
    </p>
    {accessMode === "6" && (
      <button
        onClick={onCreateQuest}
        className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6
         py-3 rounded-lg flex items-center gap-2 font-medium transition-all shadow-md hover:shadow-lg"
      >
        <BiPlus className="h-5 w-5" />
        Create Your First Quest
      </button>
    )}
  </div>
);


const ShortsClone = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const IsCompany = getCookie("ACTIVE_MODE")
  const selector = useSelector((state) => state.global);
  const quests = selector?.getQuestListData?.data?.data?.list || [];
  const [feedbackData, setFeedbackData] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [accessMode] = useState(getCookie("ACCESS_MODE"));
  const [isEngagementModalOpen, setIsEngagementModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading2, setLoading2] = useState(false);
  const [questData, setQuestData] = useState(null);
  const [engagementData, setEngagementData] = useState(null);
  const [activeTab2, setActiveTab2] = useState();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const { formData, resetForm, setErrors, handleChange } = useFormHandler({
    email: "",
    identifier: "",
    remarks: "",
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [activeTab3, setActiveTab3] = useState('Individual');

  const [feedbackDataModal, setFeedbackDataModal] = useState(null)
  const [surveyData, setSurveyData] = useState(null)
  const [surveyDataModal, setSurveyDataModal] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-in-out",
      once: true,
      offset: 40,
    });
  }, []);
  const fetchQuest = async () => {
    try {
      setLoading(true);
      await dispatch(getQuestList({ page: 1, size: 10, type: activeTab, quest_type: activeTab2 }));
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchFeedBack = async (data) => {
    if (data?.type === 'sign-up') {
      setIsModalOpen(true)
      setQuestData(data)
    } else {
      try {
        setLoading(true);
        const res = await dispatch(getFeedbackReport({ quest_id: data?._id }));
        if (res) {
          setFeedbackData(res.payload.data);
          setQuestData(data);
          setFeedbackModalOpen(true);
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    }

  };

  const handleSubmitFeedback = async (payload) => {
    try {
      await dispatch(submitFeedback(payload));
      const res = await dispatch(getFeedbackReport({ quest_id: questData?._id }));
      if (res) {
        setFeedbackData(res.payload.data);
      }
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to submit feedback");
      throw error;
    }
  };

  useEffect(() => {
    fetchQuest();
  }, [activeTab, activeTab2]);

  const tabs = [
    { label: "All Quests", value: "all", icon: <BiTrophy /> },
    { label: "Ongoing", value: "ongoing", icon: <BiRun /> },
    { label: "Upcoming", value: "upcoming", icon: <BiCalendar /> },
    { label: "Completed", value: "ended", icon: <BiMedal /> },
  ];

  const handleCreateQuest = () => {
    if (getCookie("COMPANY_TOKEN") && IsCompany === "company") {
      navigate(`/company/quest/create-your-quest`);

    } else {

      navigate(`/user/quest/create-your-quest`);
    }
  };

  const handleEditQuest = (id) => {
    if (getCookie("COMPANY_TOKEN") && IsCompany === "company") {
      navigate(`/company/quest/create-your-quest/${id}`);

    } else {

      navigate(`/user/quest/create-your-quest/${id}`);
    }

  };

  const handleDelete = async (id) => {
    try {
      const res = await dispatch(softDelete({ _id: id })).unwrap();
      toast.success(res?.message);
      fetchQuest();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSubmit = async () => {
    let newErrors = {};

    if (!formData?.userId && !formData?.identifier) {
      newErrors.userId = "Please fill the User ID or Identifier";
    }
    if (formData?.identifier) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.identifier) && formData.identifier.length < 4) {
        newErrors.identifier = "Identifier must be a valid email or at least 4 characters long";
      }
    }

    if (!formData?.remarks) {
      newErrors.remarks = "Please provide a remark";
    } else if (formData.remarks.length < 5) {
      newErrors.remarks = "Remark must be at least 5 characters long";
    } else if (formData.remarks.length > 100) {
      newErrors.remarks = "Remark cannot exceed 100 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await dispatch(
        userRegisterOnQuest({ ...formData, quest_id: questData?._id })
      ).unwrap();

      toast.success(res?.message);
      resetForm();
      setIsModalOpen(false);

      if (res) {
        dispatch(
          updateQuestViewCount({
            questId: questData._id,
            engagementCount: questData.engagement_count + 1,
            isEngaged: true
          })
        );
      }
    } catch (error) {
      toast.error(error);
    }
  };




  const handleViewEngagement = async (data) => {
    try {
      setLoading2(true);
      if (data?.type === 'feedbacks') {
        const res = await dispatch(feedbackReport({ quest_id: data?._id })).unwrap()
        setFeedbackData(res?.data)
        setFeedbackDataModal(true)
      } else if (data?.type === 'survey-polls') {
        const res = await dispatch(surveyPollReport({ quest_id: data?._id })).unwrap()
        setSurveyData(res?.data)
        setSurveyDataModal(true)
      }
      else {

        const res = await dispatch(engagementList({ quest_id: data?._id })).unwrap();
        setEngagementData(res?.data);
        setQuestData(data);
        setIsEngagementModalOpen(true);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading2(false);
    }
  };

  const handleVote = async (questId, optionIndex) => {
    try {
      const res = await dispatch(voteOnPoll({ quest_id: questId, option_index: optionIndex })).unwrap();
      toast.success(res?.message);
      fetchQuest();
    } catch (error) {
      toast.error(error);
    }

  };


  const questTypes = [
    { label: "All", value: "" },
    { label: "Surveys & Polls", value: "survey-polls" },
    { label: "Feedbacks", value: "feedbacks" },
    { label: "Sign-up", value: "sign-up" },
    { label: "Webinar", value: "webinar" },
    { label: "Event", value: "event" },
  ];

  const totalQuestions = surveyData?.surveyPolls.length;
  const currentPoll = surveyData?.surveyPolls[currentQuestion];

  // Get responses for current question
  const getCurrentQuestionResponses = () => {
    return surveyData?.surveyPollReports?.map(report => {
      const answer = report?.answers?.find(ans => ans.survey_index === currentQuestion);
      return {
        user: report?.user_id,
        answer: answer ? answer.selected_options : []
      };
    });
  };

  const responses = getCurrentQuestionResponses();
  const responseCount = responses?.filter(r => r.answer.length > 0).length;
  const handleCloseFeedback = () => {
    setFeedbackDataModal(false)
    setSurveyData(null)
    setFeedbackData(null)
    setSurveyDataModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8" data-aos="fade-down">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Quest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Campaigns</span>
          </h1>
          <p className="mt-2 text-gray-600 font-medium flex items-center">
            <BiTrophy className="mr-2 text-amber-500" /> Level up your growth journey with engaging quests
          </p>
        </div>

        {accessMode === "6" && (
          <button
            onClick={handleCreateQuest}
            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-md hover:shadow-lg"
          >
            <BiPlus className="h-5 w-5" />
            New Quest
          </button>
        )}
      </div>

      <div className="flex md:flex-row flex-col justify-between items-center">
        <div className="flex gap-2 mb-8 overflow-hidden overflow-x-auto pb-2 scrollbar-hide" data-aos="fade-up" data-aos-delay="100">
          {tabs.map(({ label, value, icon }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2
              ${activeTab === value
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
        <FilterDropdown tabs={questTypes} tabActive={activeTab2} setTabActive={setActiveTab2} />
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20" data-aos="fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && quests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {quests.map((quest, index) => (
            <QuestCard
              key={quest._id}
              quest={quest}
              onEngage={fetchFeedBack}
              onViewEngagement={handleViewEngagement}
              onEdit={handleEditQuest}
              onDelete={handleDelete}
              onVote={handleVote}
              accessMode={accessMode}
              data-aos="fade-up"
              data-aos-delay={index * 80}
              isLoading2={isLoading2}
            />
          ))}
        </div>
      ) : (
        !loading && (
          <EmptyState
            activeTab={activeTab}
            onCreateQuest={handleCreateQuest}
            accessMode={accessMode}
            data-aos="zoom-in"
          />
        )
      )}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={handleCloseFeedback}
        questData={questData}
        feedbackData={feedbackData}
        onSubmitFeedback={handleSubmitFeedback}
      />

      <Modal
        title="Join Quest"
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        handleSubmit={handleSubmit}
        size="md"
        submitText="Join Quest"
      >
        {/* {questData && */}
        <div className="space-y-4">
          <CustomInput
            className="w-full  h-10"
            label="Email"
            placeholder="Enter User email"
            value={formData?.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <CustomInput
            className="w-full h-10"
            required
            label="User"
            placeholder="Enter user"
            value={formData?.identifier}
            onChange={(e) => handleChange("identifier", e.target.value)}
          // error={errors.userId}
          />
          <CustomInput
            type="textarea"
            label="Remarks"
            className="w-full"
            placeholder="Enter your remarks (5-100 characters)"
            value={formData?.remarks}
            onChange={(e) => handleChange("remarks", e.target.value)}
            rows={3}
          // error={errors.remarks}
          />

        </div>
        {/* } */}
      </Modal>

      <Modal
        title={`Engagements for ${questData?.title || "Quest"}`}
        isOpen={isEngagementModalOpen}
        onClose={() => setIsEngagementModalOpen(false)}
        size="lg"
        isActionButton={false}
      >
        {engagementData && (
          <div className="max-h-[28rem] overflow-y-auto px-1">
            <div className="mb-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                Total Engagements:{" "}
                <span className="font-semibold text-indigo-600">
                  {engagementData.engagement_count}
                </span>
              </p>
            </div>
            {engagementData.engagements && engagementData.engagements.length > 0 ? (
              <div className="space-y-4">
                {engagementData.engagements.map((engagement, index) => (
                  <EngagementItem
                    key={index}
                    engagement={engagement}
                    navigate={navigate}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <BiUser className="mx-auto text-5xl mb-3 opacity-50 text-indigo-400" />
                <p className="font-medium">No engagements found for this quest.</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={feedbackDataModal}
        title="Feedbacks"
        onClose={() => setFeedbackDataModal(false)}
        isActionButton={false}
      >
        <div className="f">
          <div className="w-full max-h-[90vh] overflow-hidden">
            <div className="overflow-y-auto">
              {!feedbackData?.feedbackModules || feedbackData?.feedbackModules.length === 0 ? (
                <div className="text-gray-500 text-sm p-4 text-center">
                  No feedback data available.
                </div>
              ) : (
                <div className="space-y-6">
                  {feedbackData.feedbackModules.map((mod, idx) => {
                    const moduleReports = feedbackData.feedbackReports?.[idx] || [];

                    return (
                      <div key={idx} className="space-y-4 border-b pb-4">

                        <h2 className="text-lg font-semibold text-gray-800 capitalize">
                          {mod.title || "Untitled"}
                        </h2>

                        {moduleReports.length > 0 ? (
                          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {moduleReports.map((report, reportIdx) => (
                              <div
                                key={reportIdx}
                                className="border rounded-lg bg-gray-50 space-y-3 p-3"
                              >
                                <div className="flex items-start justify-between">
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Remarks:</span>{" "}
                                    {report.remarks || "No remarks provided"}
                                  </p>
                                  <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                                    #{reportIdx + 1}
                                  </span>
                                </div>

                                {/* Images */}
                                {report.images?.length > 0 ? (
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                      Images:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {report.images.map((img, imgIdx) => (
                                        <div
                                          key={imgIdx}
                                          className="w-24 h-24 relative rounded-lg overflow-hidden border border-gray-300 shadow-sm"
                                        >
                                          <img
                                            src={img}
                                            alt={`Feedback ${imgIdx + 1}`}
                                            className="w-full h-full object-cover"
                                          />
                                          <a
                                            href={img}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 transition-all opacity-0 hover:opacity-100"
                                            title="View image in full size"
                                          >
                                            <span className="text-white text-xs bg-blue-500 rounded px-2 py-1">
                                              View
                                            </span>
                                          </a>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-gray-400 text-sm gap-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                    No images provided
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 mx-auto text-gray-300 mb-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <p>No feedback reports for this module.</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>


      <Modal2 isOpen={surveyDataModal} onClose={() => setSurveyDataModal(false)} title={`Survey Modal`}
        isActionButton={false}>

        <div className=" bg-gray-50 min-h-screen">
          {/* Header */}
          <div className="bg-white ">

            <div className="p-4 bg-purple-50 border-b border-gray-200">
              {/* <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-medium">{surveyData?.engagement_count} responses</h2>

                </div>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <FiMoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div> */}

              <div className="flex justify-center items-center space-x-6 mt-4">

                <button
                  className={`pb-2 ${activeTab3 === 'Question' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
                  onClick={() => setActiveTab3('Question')}
                >
                  Question
                </button>
                <button
                  className={`pb-2 ${activeTab3 === 'Individual' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
                  onClick={() => setActiveTab3('Individual')}
                >
                  Individual
                </button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <select
                  className="border border-gray-300 rounded px-3 py-2 bg-white"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(parseInt(e.target.value))}
                >
                  {surveyData?.surveyPolls.map((poll, idx) => (
                    <option key={idx} value={idx}>
                      {poll.title}
                    </option>
                  ))}
                </select>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="p-2 hover:bg-gray-200 rounded disabled:opacity-50"
                  >
                    <BiChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentQuestion + 1} of {totalQuestions}
                  </span>
                  <button
                    onClick={() => setCurrentQuestion(Math.min(totalQuestions - 1, currentQuestion + 1))}
                    disabled={currentQuestion === totalQuestions - 1}
                    className="p-2 hover:bg-gray-200 rounded disabled:opacity-50"
                  >
                    <BiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {activeTab3 === 'Question' && (
            <div className="p-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">{currentPoll?.title}</h3>
                <p className="text-gray-500 mb-4">{currentPoll?.description}</p>

                {/* Display options based on question type */}
                {currentPoll.type === 'short-answer' ? (
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-gray-400 italic">This is a short-answer question. Individual responses are shown in the "Individual" tab.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentPoll.options.map((option, optIdx) => {
                      // Calculate how many responses selected this option
                      const selectedCount = responses.filter(r => r.answer.includes(option)).length;
                      const percentage = responseCount > 0 ? (selectedCount / responseCount) * 100 : 0;
                      const isSelected = selectedCount > 0;

                      return (
                        <div key={optIdx} className="relative flex items-center">
                          <div className="absolute top-0 left-0 h-full bg-purple-200 rounded-lg" style={{ width: `${percentage}%` }}></div>
                          <div className="relative z-10 w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white">
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-medium ${isSelected ? 'text-purple-800' : 'text-gray-700'}`}>
                                {option}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-bold text-purple-600">{selectedCount}</span> ({percentage.toFixed(0)}%)
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-blue-600 text-sm">
                    {responseCount} responses
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab3 === 'Individual' && (
            <div className="bg-white border-x border-b border-gray-200 rounded-b-lg">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                      className="p-2 hover:bg-gray-200 rounded disabled:opacity-50"
                    >
                      <BiChevronLeftCircle className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-600">
                      {currentQuestion + 1} of {totalQuestions}
                    </span>
                    <button
                      onClick={() => setCurrentQuestion(Math.min(totalQuestions - 1, currentQuestion + 1))}
                      disabled={currentQuestion === totalQuestions - 1}
                      className="p-2 hover:bg-gray-200 rounded disabled:opacity-50"
                    >
                      <BiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-200 rounded">
                      <Printer className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded">
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div> */}
                </div>
              </div>

              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">Responses cannot be edited</div>

                {/* Form Title */}
                <div className="bg-purple-600 text-white p-6 rounded-t-lg mb-6">
                  <h1 className="text-2xl font-normal">Survey Form</h1>
                  <p className="text-purple-100 mt-1">Form description</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">{currentPoll?.title}</h3>

                  {/* Show responses for current question */}
                  <div className="space-y-4">
                    {Array.isArray(responses) && responses.map((response, idx) => (
                      <div key={idx} className="border-l-4 border-orange-400 pl-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <img
                            src={response?.user?.profile_picture_url}
                            alt={response?.user?.first_name}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${response.user.first_name}+${response.user.last_name}&background=6366f1&color=fff`;
                            }}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {response.user.first_name} {response.user.last_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            Submitted {new Date().toLocaleDateString()}
                          </span>
                        </div>

                        {currentPoll.type === 'short-answer' ? (
                          <div className="bg-gray-50 p-3 rounded border">
                            <p className="text-gray-800">{response.answer[0] || 'No response'}</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {currentPoll.options.map((option, optIdx) => (
                              <label key={optIdx} className="flex items-center space-x-2">
                                <input
                                  type={currentPoll.type === 'multi-choice' ? 'radio' : 'checkbox'}
                                  checked={response.answer.includes(option)}
                                  readOnly
                                  className="form-radio text-purple-600"
                                />
                                <span className="text-gray-700">{option}</span>
                              </label>
                            ))}
                            {currentPoll.type === 'checkbox' && (
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" disabled className="form-checkbox" />
                                <span className="text-gray-500">Other...</span>
                              </label>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-blue-600 text-sm">{responseCount} responses</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal2>
    </div>
  );
};




export default ShortsClone;