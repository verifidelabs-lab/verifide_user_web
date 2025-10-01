import React, { useState, useRef, useEffect } from "react";
// import { IoChevronDown, IoSearch } from "react-icons/io5";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import JobCard from "./components/JobCard";
import { useDispatch, useSelector } from "react-redux";
import { addReviews, approveRejectInterview, closeJob, jobsApplicationList, jobsList, masterIndustry, masterSkills, profileRoles, ReScheduleInterview, scheduleInterview, updateApplicationStatus, viewJobApplication, } from "../../redux/Global Slice/cscSlice";
import { useNavigate } from "react-router-dom";
import { arrayTransform, convertTimestampToDate, convertTimestampToTime, convertTimeToTimestamp2, convertToTimestamp, } from "../../components/utils/globalFunction";
import CustomButton from "../../components/ui/Button/Button";
import CustomInput from "../../components/ui/Input/CustomInput";
import { toast } from "sonner";
import AnswerCard from "./components/AnswerCard";
import Modal from "../../components/ui/Modal/Modal";
import CustomDateInput from "../../components/ui/Input/CustomDateInput";
import useFormHandler from "../../components/hooks/useFormHandler";
import { BiArrowBack, BiLeftArrow } from "react-icons/bi";
// import { IoClose } from "react-icons/io5";
import SkeletonJobCard from "../../components/Loader/SkeletonJobCard";
import JobDetails from "./components/JobDetails";


import { createUserConnection } from "../../redux/Users/userSlice";
import { getAllCompanies } from "../../redux/work/workSlice";
import FilterSelect2 from "../../components/ui/Input/FilterSelect2";
import { PiCodesandboxLogoLight } from "react-icons/pi";
import { FaClipboardList, FaClock, FaMinusCircle } from "react-icons/fa";
import { MdArchive, MdOutlineCheckCircle, MdOutlineLock } from "react-icons/md";
// import moment from "moment-timezone";
import NoDataFound from "../../components/ui/No Data/NoDataFound";
import InterviewReviewModal from "./components/InterviewReviewModal";
import AlertModal from "../../components/ui/Modal/AlertModal";
import moment from "moment-timezone";
import { getCookie } from "../../components/utils/cookieHandler";
const Button = ({ children, onClick, className = "", type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className}`}
  >
    {children}
  </button>
);

const Opportunities = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.global);
  const selector2 = useSelector((state) => state);
  let { jobsListData: { data }, } = selector ? selector : {};
  console.log("this is the jsss", data)
  const [activeTab, setActiveTab] = useState("open");
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewDetails, setViewDetails] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [review, setReview] = useState({ remarks: "", date: "" });
  const [reviewJobId, setReviewJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    status: true,
    industry: true,
    role: true,
    skill: true,
    timePeriod: true,
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "",
    data: {},
  });
  const [isDetails, setIsDetails] = useState(false);
  const [isDetailsData, setIsDetailsData] = useState(null);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRejectModalData, setShowRejectModalData] = useState(null);
  const [rejectReason, setRejectReason] = useState('')


  const { formData, resetForm, handleChange, errors, setErrors, setFormData } =
    useFormHandler({
      select_date: "",
      select_time: "",
      meeting_url: "",
    });
  const size = 10
  const [searchFelids, setSearchFelids] = useState({
    company_id: "",
    industry_id: '',
    job_title: '',
    required_skills: [],
    formDate: '',
    toDate: "",
    timePeriod: ""
  })
  const [isViewDetails, setIsViewDetails] = useState(false);
  const [openInterview, setOpenInterview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [recommendationLevel, setRecommendationLevel] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [hour, setHour] = useState(1);
  const [minute, setMinute] = useState(0);
  const [status, setStatus] = useState("");
  const [selectInterviewId, setSelectInterviewId] = useState(null);
  const allCompaniesList = [
    { value: "", label: "Select" },
    ...arrayTransform(selector2?.work?.getAllCompaniesData?.data?.data || [])
  ];
  const allIndustryList = [{ value: "", label: "Select" }, ...arrayTransform(selector?.masterIndustryData?.data?.data?.list)]
  const allProfileRoleList = [{ value: "", label: "Select" }, ...arrayTransform(selector?.profileRolesData?.data?.data?.list)]
  const allSkillsList = [{ value: "", label: "Select" }, ...arrayTransform(selector?.masterSkillsData?.data?.data?.list)]

  const [loadingJobId, setLoadingJobId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState("");
  const isCompany = getCookie("ACTIVE_MODE") !== "company"
  const getStatusColor = (status) => {
    switch (status) {
      case "shortlisted":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchJobs = async () => {
        setIsLoading(true);

        const filters = {
          type: activeTab,
        };

        if (searchFelids?.company_id) filters.company_id = searchFelids.company_id;
        if (searchFelids?.industry_id) filters.industry_id = searchFelids.industry_id;
        if (searchFelids?.job_title) filters.job_title = searchFelids.job_title;
        if (searchFelids?.required_skills?.length > 0) filters.required_skills = searchFelids.required_skills;

        const apiPayload = {
          page: 1,
          size: size,
          query: JSON.stringify(filters),
          fromDate: searchFelids?.formDate || "",
          toDate: searchFelids?.toDate || ""
        };

        await dispatch(jobsList(apiPayload));
        setIsLoading(false);
      };

      fetchJobs();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [dispatch, activeTab, searchFelids, size]);

  useEffect(() => {
    dispatch(masterIndustry())
    dispatch(masterSkills())
    dispatch(getAllCompanies())
    dispatch(profileRoles())
  }, [dispatch])

  const handleJobAction = async (action, job) => {
    setJobId(job?._id);

    if (action === "edit") {
      if (!isCompany) {
        navigate(`/company/post-job/${job?._id}`);
      } else {

        navigate(`/user/post-job/${job?._id}`);
      }
    } else if (action === "view_details") {
      setIsViewDetails(true);
      setModalState({ data: job });
      setViewDetails(true);
      // Show modal on mobile
      if (window.innerWidth < 768) {
        setShowMobileModal(true);
      }
    } else if (action === 'view') {
      setIsDetails(false);
      setLoadingJobId(job?._id);
      try {
        const res = await dispatch(
          jobsApplicationList({ job_id: job?._id })
        ).unwrap();
        setSelectedJob(res?.data?.list);
        setLoadingJobId(null);
        setViewDetails(true);
        setIsViewDetails(false);
        setModalState({ data: job });
        // Show modal on mobile
        if (window.innerWidth < 768) {
          setShowMobileModal(true);
        }
      } catch (error) {
        setLoadingJobId(null);
      }
    }
  };

  const filterDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFilterChange = (filterName) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const getActiveFiltersCount = () => {
    return Object.values(selectedFilters).filter(Boolean).length;
  };

  const hasActiveFilters = () => {
    return Object.values(selectedFilters).some(Boolean);
  };

  const handlePostJob = () => {
    const isCompany = getCookie("ACTIVE_MODE");
    const accessMode = Number(getCookie("ACCESS_MODE")); // make sure it's a number

    console.log("this is the ", isCompany);

    if (isCompany === "company") {
      navigate(`/company/post-job`);
    } else if (accessMode === 6 || accessMode === 5) {
      navigate(`/user/post-job`);
    } else {
      console.warn("Unknown mode, cannot navigate");
    }
  };


  const handleAction = async (type) => {
    if (!selectedId) {
      toast.error("Please select an applicant.");
      return;
    }

    try {
      const res = await dispatch(
        updateApplicationStatus({
          status: type,
          application_ids: [selectedId],
        })
      ).unwrap();

      toast.success(res?.message || "Status updated successfully.");

      const result = await dispatch(
        jobsApplicationList({ job_id: jobId })
      ).unwrap();
      setSelectedJob(result?.data?.list || []);

      setSelectedId(null);
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error(error?.message || "Something went wrong.");
    }
  };

  const handleDetails = async (data) => {
    try {
      setIsLoading(true)
      const res = await dispatch(
        viewJobApplication({ application_id: data?._id })
      ).unwrap();
      setIsLoading(false)
      toast.success(res?.message);
      setIsDetails(true);
      setIsDetailsData(res?.data);
    } catch (error) {
      toast.error(error);
      setIsLoading(false)
    }
  };

  const handleClose = () => {
    setModalState({ isOpen: false, type: "", data: {} });
    resetForm();
  };

  const handleInterviewSchedule = (data) => {
    if (data?.isSchedule) {
      setFormData({
        select_date: convertTimestampToDate(
          data?.interviewDetails?.select_date
        ),
        select_time: convertTimestampToTime(
          data?.interviewDetails?.select_time
        ),
        meeting_url: data?.interviewDetails?.meeting_url,
      });
    }
    setModalState({
      isOpen: true,
      type: data?.isSchedule ? "Reschedule" : "Schedule",
      data: data,
    });
  };

  const handleSubmit = async () => {
    const errorsObj = {};

    if (!formData?.select_date) {
      errorsObj.select_date = "Please select a date";
    }
    if (!formData?.select_time) {
      errorsObj.select_time = "Please select a time";
    }
    if (!formData?.meeting_url) {
      errorsObj.meeting_url = "Please enter a meeting URL";
    }
    if (formData?.select_date && formData?.select_time) {
      const selectedDateTime = new Date(
        `${formData.select_date} ${formData.select_time}`
      );
      const now = new Date();

      if (selectedDateTime < now) {
        errorsObj.select_time = "Selected date and time cannot be in the past";
      }
    }
    const urlPattern =
      /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    if (formData?.meeting_url && !urlPattern.test(formData.meeting_url)) {
      errorsObj.meeting_url = "Please enter a valid URL";
    }

    if (Object.keys(errorsObj).length > 0) {
      setErrors(errorsObj);
      return;
    }

    try {
      let apiPayload2 = {
        select_date: convertToTimestamp(formData?.select_date),
        select_time: convertTimeToTimestamp2(formData?.select_time),
        meeting_url: formData?.meeting_url,
      };

      if (!modalState.data.isSchedule) {
        apiPayload2.job_application_id = modalState?.data?._id;
        apiPayload2.user_id = modalState?.data?.user_id?._id;
      }

      if (modalState.data.isSchedule) {
        apiPayload2._id = modalState?.data?.interviewDetails?._id;
      }

      const action = modalState?.data?.isSchedule
        ? ReScheduleInterview
        : scheduleInterview;
      const res = await dispatch(action(apiPayload2)).unwrap();
      toast.success(res?.message);
      handleClose();

      dispatch(
        jobsList({
          page: 1,
          size: 10,
          query: JSON.stringify({ type: activeTab }),
        })
      );
    } catch (error) {
      toast.error(error);
    }
  };


  const handleMessage = async (data) => {
    if (data?.isConnected) {
      navigate(`/user/message/${data?.user_id?._id}/${data?.isConnected}`)
    } else {
      try {
        const res = await dispatch(createUserConnection({ connection_user_id: data?.user_id?._id })).unwrap()
        toast.success(res?.message)
        navigate(`/user/message/${data?.user_id?._id}/true`)
        // console.log(res)
      } catch (error) {
        toast.error(error)
      }
    }
  }

  const handleSelectChange = (fields, value) => {
    if (fields === "required_skills") {
      setSearchFelids((prev) => ({
        ...prev,
        [fields]: value.map(v => v.value),
      }));
    } else if (fields === "timePeriod") {
      const today = new Date();
      let formDate = "";
      let toDate = "";

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${day}-${month}-${year}`;
      };

      if (value.value === "Today") {
        formDate = formatDate(today);
        toDate = formatDate(today);
      } else if (value.value === "Last Week") {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        formDate = formatDate(lastWeek);
        toDate = formatDate(today);
      } else if (value.value === "This Week") {
        const startOfWeek = new Date(today);
        const dayOfWeek = startOfWeek.getDay();
        const diffToMonday = (dayOfWeek + 6) % 7;
        startOfWeek.setDate(today.getDate() - diffToMonday);
        formDate = formatDate(startOfWeek);
        toDate = formatDate(today);
      } else if (value.value === "This Month") {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        formDate = formatDate(startOfMonth);
        toDate = formatDate(today);
      }

      setSearchFelids((prev) => ({
        ...prev,
        timePeriod: value.value,
        formDate,
        toDate,
      }));
    } else {
      setSearchFelids((prev) => ({
        ...prev,
        [fields]: value.value,
      }));
    }
  };

  const handleBack = () => {
    setIsDetails(false)
    setSelectedJob(null)
    setIsViewDetails(false)
    setViewDetails(false)
    setShowMobileModal(false)
  }

  const statusOrder = {
    applied: 1,
    shortlisted: 2,
    rejected: 3,
  };

  const sortedApplicants = Array.isArray(selectedJob) && [...selectedJob].sort((a, b) => {
    const statusA = statusOrder[a.status] || 99;
    const statusB = statusOrder[b.status] || 99;
    return statusA - statusB;
  });


  const RightSideContent = () => {
    if (isDetails) {
      return (
        <div className="w-full">
          <div className="flex items-center space-x-3 mb-6">
            <BiLeftArrow onClick={() => handleBack()} className="cursor-pointer" />
            {isDetailsData?.user_id?.profile_picture_url ?

              <img
                src={isDetailsData?.user_id?.profile_picture_url || '/0684456b-aa2b-4631-86f7-93ceaf33303c.png'}
                alt="profile"
                className="w-10 h-10 rounded-full border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/0684456b-aa2b-4631-86f7-93ceaf33303c.png";
                }}

              />
              : <img
                src={'/0684456b-aa2b-4631-86f7-93ceaf33303c.png'}
                alt="profile"
                className="w-10 h-10 rounded-full border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/0684456b-aa2b-4631-86f7-93ceaf33303c.png";
                }}
              />
            }
            <div>
              <h1 className="text-lg font-semibold text-gray-800 capitalize">
                {isDetailsData?.user_id?.first_name}{" "}
                {isDetailsData?.user_id?.last_name}
              </h1>
              <p className="text-xs text-gray-500">
                {isDetailsData?.status
                  ? `${isDetailsData.status.charAt(0).toUpperCase() +
                  isDetailsData.status.slice(1)
                  }`
                  : "Status not available"}
              </p>
            </div>
          </div>

          {Array.isArray(isDetailsData?.answers) &&
            isDetailsData.answers.length > 0 ? (
            isDetailsData.answers.map((answer, index) => (
              <AnswerCard
                key={answer._id || index}
                question={answer.question}
                questionType={answer.question_type}
                correctOptions={answer.correct_options}
                selectedOptions={answer.selected_options}
                index={index}
              />
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">No answers available</p>
            </div>
          )}
        </div>
      );
    } else if (isViewDetails) {
      return (
        <JobDetails
          modalState={modalState}
          setViewDetails={setViewDetails}
          setIsViewDetails={setIsViewDetails}
        />
      );
    } else {
      return (
        <div className="w-full">
          <BiArrowBack onClick={() => handleBack()} className="cursor-pointer mb-4" />
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              {modalState?.data?.job_title?.name}
              {/* (
              {modalState?.data?.total_applicants}) */}
            </h2>
            <div className="flex justify-end items-center gap-2">
              <CustomButton
                size="sm"
                variant="outline"
                onClick={() => handleAction("SHORTLISTED")}
              >
                Shortlist
              </CustomButton>
              <CustomButton
                size="sm"
                onClick={() => handleAction("REJECTED")}
              >
                Reject
              </CustomButton>
            </div>
          </div>

          {sortedApplicants && sortedApplicants.length > 0 ? (
            sortedApplicants.map((applicant) => (
              <div
                key={applicant.id}
                className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <CustomInput
                    type="checkbox"
                    checked={selectedId === applicant._id}
                    onChange={() =>
                      setSelectedId(
                        selectedId === applicant._id ? null : applicant._id
                      )
                    }
                    className="form-checkbox h-3 w-3 text-blue-600"
                  />
                  {applicant.user_id?.profile_picture_url ?
                    <>
                      <img
                        src={applicant.user_id?.profile_picture_url}
                        alt={applicant.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </> : <>
                      <img
                        src={"/0684456b-aa2b-4631-86f7-93ceaf33303c.png"}
                        alt={applicant.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </>}

                  <div>
                    <div className="flex justify-start items-start gap-2">
                      <p className="font-medium text-gray-800 text-xs">
                        {applicant?.user_id?.first_name}
                      </p>
                      <span
                        className={`text-xs px-2 rounded-full border ${getStatusColor(
                          applicant.status
                        )}`}
                      >
                        {applicant.status.charAt(0).toUpperCase() +
                          applicant.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex gap-2">
                      <span>
                        {convertTimestampToDate(applicant.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CustomButton
                    variant="outline"
                    onClick={() => handleDetails(applicant)}
                  >
                    Details
                  </CustomButton>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="min-h-[30vh] flex justify-center flex-col items-center border rounded-md">
                <PiCodesandboxLogoLight size={26} />
                <strong className="text-">No Applicant available</strong>
              </div>
            </>
          )}
        </div>
      );
    }
  };

  const handleActiveTab = (action) => {
    setActiveTab(action);
    // setSelectedJob(false);
    setShowMobileModal(false);
    setIsDetails(null)
    setIsDetailsData(null)
    setIsViewDetails(false)
    setSelectedJob(null)
    setViewDetails(false)
    setIsReviewOpen(false)
    setReviewJobId(null)
  }

  const handleRejectFromShortList = async (job) => {
    setShowRejectModal(true)
    setShowRejectModalData(job)

  }

  const handleConfirmReject = async () => {
    let newErrors = {};
    if (!rejectReason || rejectReason.trim().length === 0) {
      newErrors.rejectReason = "Reason is required.";
    } else if (rejectReason.trim().length < 5) {
      newErrors.rejectReason = "Reason must be at least 5 characters long.";
    } else if (rejectReason.trim().length > 100) {
      newErrors.rejectReason = "Reason must not exceed 100 characters.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      const res = await dispatch(
        updateApplicationStatus({
          status: "REJECTED",
          application_ids: [showRejectModalData?._id],
          remarks: rejectReason
        })
      ).unwrap();

      toast.success(res?.message || "Status updated successfully.");
      setShowRejectModal(false)
      setShowRejectModalData(null)

      const filters = {
        type: activeTab,
      };

      const apiPayload = {
        page: 1,
        size: size,
        fromDate: searchFelids?.formDate || "",
        toDate: searchFelids?.toDate || "",
        query: JSON.stringify(filters),
      };

      dispatch(jobsList(apiPayload));

      setSelectedId(null);
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error(error?.message || "Something went wrong.");
    }
  }

  const tabs = [
    { id: "open", label: "Open Jobs", icon: <FaClipboardList /> },
    { id: "shortlisted", label: "Shortlisted", icon: <MdOutlineCheckCircle /> },
    { id: "schedule-interviews", label: "Schedules Interviews", icon: <FaClock /> },
    { id: "closed", label: "Closed Jobs", icon: <MdOutlineLock /> },
    { id: "rejected", label: "Rejected Candidates", icon: <FaMinusCircle /> },
    { id: "selected_in_interview", label: "Ready to Join", icon: <MdArchive /> },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setShowMobileModal(false);
    setIsDetails(null)
    setIsDetailsData(null)
    setIsViewDetails(false)
    setSelectedJob(null)
    setViewDetails(false)
  };



  const handleReviewSubmit = async () => {
    if (!review.remarks || !review.date) {
      toast.error("Please fill in all review fields.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        remarks: review.remarks,
        date: new Date(review.date).getTime(),
        applicant_id: reviewJobId?._id,
      };
      const res = await dispatch(addReviews(payload)).unwrap();
      if (res.error === true) {
        toast.error(res?.message || "Failed to submit review.");
      } else {
        dispatch(
          jobsList({
            page: 1,
            size: 10,
            query: JSON.stringify({ type: activeTab }),
          })
        );
        setReview({ remarks: "", date: "" });
        setIsReviewOpen(false);
        toast.success(res?.message || "Review submitted successfully.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onCloseInterview = () => {
    setOpenInterview(false);
    setRating(0);
    setHover(0);
    setRemarks("");
    setRecommendationLevel("");
    setInterviewer("");
    setHour(1);
    setMinute(0);
    setStatus("");
    setSelectInterviewId(null);
  };

  const handleSubmitInterview = () => {
    const totalDurationMinutes = hour * 60 + minute;
    if (!status) {
      toast.warning("Please select interview status.");
      return;
    }
    const payload = {
      duration: String(totalDurationMinutes),
      interviewer,
      rating,
      recommendation: recommendationLevel,
      remarks,
      status,
      application_id: selectInterviewId?._id,
    };

    setLoading(true);
    dispatch(approveRejectInterview(payload))
      .then((res) => {
        if (res?.payload?.error) {
          toast.error(res?.payload?.message || "Something went wrong.");
        } else {
          dispatch(
            jobsList({
              page: 1,
              size: 10,
              query: JSON.stringify({ type: activeTab }),
            })
          );
          toast.success(res?.payload?.message || "Interview updated successfully.");
          setLoading(false);
          onCloseInterview();
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const openModalForSelect = (applicationId) => {
    setSelectInterviewId(applicationId);
    setOpenInterview(true);
  };


  const [isCloseModal, setIsCloseModal] = useState(false);
  const [jobToClose, setJobToClose] = useState(null);
  const handleCloseJob = (job) => {
    setJobToClose(job);
    setIsCloseModal(true);
  };

  const confirmCloseJob = async () => {
    if (!jobToClose) return;
    try {
      const res = await dispatch(closeJob({ job_id: jobToClose._id }));
      if (res.error === true) {
        toast.error(res?.message || "Failed to submit review.");
      } else {
        dispatch(
          jobsList({
            page: 1,
            size: 10,
            query: JSON.stringify({ type: activeTab }),
          })
        );
        setIsCloseModal(false);
        setJobToClose(null);
        toast.success(res?.message || "Job is successfully closed.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-3 bg-[#F6FAFD] h-[90vh] p-2 overflow-hidden ">
      <div className="hidden md:block xl:w-[15%] lg:w-[20%] md:w-[25%]">
        <div className="bg-white h-full rounded-lg shadow-sm p-4">
          <div className="sticky top-4">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <li
                    key={tab.id}
                    className={`xl:text-base lg:text-sm md:text-sm font-medium p-2 xl:w-52 lg:w-40 md:w-40 flex justify-start items-center gap-2 capitalize cursor-pointer transition-all duration-200
                ${isActive
                        ? "bg-blue-50 text-blue-600  border-blue-500 rounded-lg"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
                      }`}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div
        className={`w-full p-4 sm:p-6  flex-1  mx-auto h-screen custom-scrollbar overflow-hidden overflow-y-auto ${!selectedJob ? "xl:w-[100%] lg:w-[100%] md:w-[100%]" : "xl:w-[75%] lg:w-[70%] md:w-[60%]"
          } `}>
        <div className="flex justify-between md:flex-row flex-col mb-6 space-y-4 lg:space-y-0">
          <h1 className="text-2xl font-bold text-[#000000E6] md:text-start text-center">Opportunity</h1>
          <div className="flex  items-center gap-3">
            <div className="relative" ref={filterDropdownRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-auto"
              >
                <TbAdjustmentsHorizontal className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Filter</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>

              {showFilterDropdown && (
                <div className="absolute md:right-0 left-4 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-[#000000E6] mb-3">
                      Filter Settings
                    </h3>

                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.status}
                          onChange={() => handleFilterChange("status")}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          Company Name
                        </span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.industry}
                          onChange={() => handleFilterChange("industry")}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Industry</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.role}
                          onChange={() => handleFilterChange("role")}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Role</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.skill}
                          onChange={() => handleFilterChange("skill")}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Skills</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.timePeriod}
                          onChange={() => handleFilterChange("timePeriod")}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          Time Period
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="button"
              className="w-full sm:w-auto whitespace-nowrap"
              onClick={handlePostJob}
            >
              Post a Job
            </Button>
          </div>
        </div>

        <div className="md:hidden block">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0">
            <div className="overflow-x-auto whitespace-nowrap no-scrollbar">
              <div className="inline-flex space-x-1 p-1 rounded-full bg-white border border-gray-200 w-max">
                <button
                  onClick={() => handleActiveTab("open")}
                  className={`px-4 sm:px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out ${activeTab === "open"
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-[#000000E6]"
                    }`}
                >
                  Open Jobs
                </button>
                <button
                  onClick={() => handleActiveTab("shortlisted")}
                  className={`px-4 sm:px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out ${activeTab === "shortlisted"
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-[#000000E6]"
                    }`}
                >
                  Shortlisted
                </button>
                <button
                  onClick={() => handleActiveTab("schedule-interviews")}
                  className={`px-4 sm:px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out ${activeTab === "schedule-interviews"
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-[#000000E6]"
                    }`}
                >
                  Schedules Interviews
                </button>
                <button
                  onClick={() => handleActiveTab("closed")}
                  className={`px-4 sm:px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out ${activeTab === "closed"
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-[#000000E6]"
                    }`}
                >
                  Closed Jobs
                </button>
                <button
                  onClick={() => handleActiveTab("rejected")}
                  className={`px-4 sm:px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out ${activeTab === "rejected"
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-[#000000E6]"
                    }`}
                >
                  Rejected Interviews
                </button>
                <button
                  onClick={() => handleActiveTab("selected_in_interview")}
                  className={`px-4 sm:px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out ${activeTab === "selected_in_interview"
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-[#000000E6]"
                    }`}
                >
                  Ready to Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {hasActiveFilters() && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {isCompany && selectedFilters.status && (
              <FilterSelect2
                label="Company Name"
                options={allCompaniesList}
                selectedOption={allCompaniesList?.find(opt => opt.value === searchFelids?.company_id)}
                onChange={(selected) => handleSelectChange("company_id", selected)}
                isClearable={false}

              />
            )}
            {isCompany && selectedFilters.industry && (
              <FilterSelect2
                label="Industry"
                options={allIndustryList}
                selectedOption={allIndustryList?.find(opt => opt.value === searchFelids?.industry_id)}
                onChange={(selected) => handleSelectChange("industry_id", selected)}
                isClearable={false}

              />
            )}
            {selectedFilters.role && (
              <FilterSelect2
                label="Role"
                options={allProfileRoleList}
                selectedOption={allProfileRoleList?.find(opt => opt.value === searchFelids?.job_title)}
                onChange={(selected) => handleSelectChange("job_title", selected)}
                isClearable={false}

              />
            )}
            {selectedFilters.skill && (
              <FilterSelect2
                label="Skills"
                options={allSkillsList}
                selectedOption={allSkillsList?.find(opt => opt.value === searchFelids?.required_skills)}
                onChange={(selected) => handleSelectChange("required_skills", selected)}
                isMulti
                isClearable={false}

              />

            )}
            {selectedFilters.timePeriod && (
              <FilterSelect2
                label="Today / Last Week"
                options={[
                  { label: "Select", value: "" },
                  { label: "Today", value: "Today" },
                  { label: "Last Week", value: "Last Week" },
                  { label: "This Month", value: "This Month" },
                  { label: "This Week", value: "This Week" },
                ]}
                onChange={(value) => handleSelectChange("timePeriod", value)}
                isClearable={false}

              />
            )}

          </div>
        )}

        <div className="h-full ">
          <div
            className={`grid w-full ${!viewDetails
              ? "2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 grid-cols-1"
              : "xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 grid-cols-1"
              } items-center gap-2`}
          >
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="mb-4">
                  <SkeletonJobCard />
                </div>
              ))
            ) : data?.data?.list?.length > 0 ? (
              data.data.list.map((job, index) => (
                <div
                  key={`openJobs-${job._id}`}
                  className="transform transition-all duration-300 ease-in-out hover:scale-[1.02] mb-4 animate-floatIn"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <JobCard
                    job={job}
                    onAction={handleJobAction}
                    isLoading={loadingJobId}
                    handleInterviewSchedule={handleInterviewSchedule}
                    loading={isLoading}
                    handleMessage={handleMessage}
                    handleRejectFromShortList={handleRejectFromShortList}
                    setIsReviewOpen={setIsReviewOpen}
                    setReviewJobId={setReviewJobId}
                    activeTab={activeTab}
                    openModalForSelect={openModalForSelect}
                    setSelectInterviewId={setSelectInterviewId}
                    handleCloseJob={handleCloseJob}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-6 text-gray-500 text-lg">
                <NoDataFound />
              </div>
            )}
          </div>

        </div>
      </div>

      {(selectedJob || viewDetails) && (
        <div className="hidden md:block xl:w-[25%] lg:w-[30%] md:w-[40%] bg-white rounded-xl border-l border-gray-200 p-6 overflow-y-auto mt-10">
          <RightSideContent />
        </div>
      )}

      <Modal
        isOpen={showMobileModal}
        onClose={() => setShowMobileModal(false)}
        isActionButton={false}
      >
        <RightSideContent />
      </Modal>


      <Modal isOpen={modalState.isOpen} title={modalState.type} onClose={handleClose} handleSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 grid-cols-1 items-center gap-2">
            <CustomDateInput
              label="Select Date"
              type={"date"}
              required
              value={formData?.select_date}
              onChange={(e) => handleChange("select_date", e.target.value)}
              className={` h-10`}
              error={errors?.select_date}
            />
            <CustomDateInput
              label="Select Time"
              required
              value={formData?.select_time}
              onChange={(e) => handleChange("select_time", e.target.value)}
              type="time"
              className={` h-10`}
              placeholder={`Select Time`}
              error={errors?.select_time}
            />
          </div>
          <CustomInput
            label="Meeting Url"
            required
            value={formData?.meeting_url}
            onChange={(e) => handleChange("meeting_url", e.target.value)}
            className={`w-full h-10`}
            error={errors?.meeting_url}
          />
        </div>
      </Modal>


      <Modal
        isOpen={isReviewOpen}
        title={`Review for ${reviewJobId?.user_id?.first_name} ${reviewJobId?.user_id?.last_name}`}
        onClose={() => setIsReviewOpen(false)}
        handleSubmit={handleReviewSubmit}
        loading={loading}
      >
        <div className="space-y-4">
          <CustomInput
            label="Remarks"
            type="textarea"
            required
            value={review?.remarks}
            onChange={(e) => setReview({ ...review, remarks: e.target.value })}
            className="w-full h-10"
          />
          <CustomDateInput
            label="Select Date"
            type="date"
            required
            value={review?.date}
            onChange={(e) => setReview({ ...review, date: e.target.value })}
            className="h-10 w-full"
            allowFutureDate={false}
          />

          {(() => {
            const selectedApplication = data?.data?.list?.find(
              (application) => application._id === reviewJobId?._id
            );
            return selectedApplication ? (
              <div className="mb-6   rounded  overflow-y-auto custom-scrollbar">
                {selectedApplication?.reviews?.length > 0 ? (
                  <div className="space-y-3">
                    <div className="space-y-8">
                      {/* Interview Details */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-semibold text-gray-900">Interview Details</h3>
                          <div className="">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedApplication?.interviewDetails?.status ?? "pending")
                                }`}
                            >
                              {selectedApplication?.interviewDetails?.status ?? "Pending"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-4 grid grid-cols-3">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Date</p>
                              <p className="text-gray-900">
                                {selectedApplication?.interviewDetails?.select_date
                                  ? convertTimestampToDate(selectedApplication.interviewDetails.select_date)
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Time</p>
                              <p className="text-gray-900">
                                {moment(selectedApplication.interviewDetails.select_time).format('hh:mm A')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Meeting</p>
                              {selectedApplication?.interviewDetails?.meeting_url ? (
                                <a
                                  href={selectedApplication.interviewDetails.meeting_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                                >
                                  Join Google Meet
                                </a>
                              ) : (
                                <span className="text-gray-500 text-sm">Not Provided</span>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                      {selectedApplication?.status === "rejected" && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
                          <div className="flex items-center mb-4">
                            <h3 className="text-xl font-semibold text-red-600">Rejection History</h3>
                          </div>

                          {selectedApplication?.reviews?.length > 0 ? (
                            <ul className="space-y-4">
                              {selectedApplication.reviews.map((ele, idx) => (
                                <li key={idx} className="flex items-start space-x-3">
                                  {/* Timeline dot */}
                                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-red-500 mt-1.5"></div>

                                  {/* Content */}
                                  <div>
                                    <p className="text-sm text-gray-800">{ele?.remarks || "No remarks provided"}</p>
                                    <p className="text-xs text-gray-500">
                                      {moment(ele?.date).format("DD-MM-YYYY")}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-600 text-sm">No rejection remarks found.</p>
                          )}
                        </div>
                      )}

                      {selectedApplication?.status === "selected_in_interview" && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
                          <div className="flex items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Interview Feedback</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Rating */}
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">Rating</p>
                              <div className="flex items-center">
                                <span className="text-lg font-semibold text-gray-900">
                                  {selectedApplication?.feedback?.rating ?? "N/A"}
                                </span>
                                {selectedApplication?.feedback?.rating && (
                                  <span className="ml-2 text-sm text-gray-500">
                                    ({selectedApplication.feedback.rating}/5)
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Duration */}
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">Duration</p>
                              <p className="text-gray-900">
                                {selectedApplication?.feedback?.duration
                                  ? `${selectedApplication.feedback.duration} minutes`
                                  : "N/A"}
                              </p>
                            </div>

                            {/* Interviewer */}
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">Interviewer</p>
                              <p className="text-gray-900">
                                {selectedApplication?.feedback?.interviewer || "N/A"}
                              </p>
                            </div>

                            {/* Recommendation */}
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">Recommendation</p>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border 
            ${selectedApplication?.feedback?.recommendation === "strong_yes"
                                    ? "bg-green-100 text-green-700 border-green-300"
                                    : selectedApplication?.feedback?.recommendation === "yes"
                                      ? "bg-blue-100 text-blue-700 border-blue-300"
                                      : selectedApplication?.feedback?.recommendation === "no"
                                        ? "bg-red-100 text-red-700 border-red-300"
                                        : "bg-gray-100 text-gray-600 border-gray-300"
                                  }`}
                              >
                                {selectedApplication?.feedback?.recommendation
                                  ? selectedApplication.feedback.recommendation.replace("_", " ").toUpperCase()
                                  : "N/A"}
                              </span>
                            </div>
                          </div>

                          {/* Remarks */}
                          <div className="mt-6">
                            <p className="text-sm font-medium text-gray-600 mb-2">Remarks</p>
                            <div className="bg-gray-50 p-3 rounded-lg border">
                              <p className="text-gray-700 text-sm">
                                {selectedApplication?.feedback?.remarks || "No remarks provided"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic"></p>
                )}

              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No application selected.</p>
            );
          })()}


        </div>
      </Modal>

      <InterviewReviewModal
        openInterview={openInterview}
        setOpenInterview={setOpenInterview}
        handleSubmitInterview={handleSubmitInterview}
        loading={loading}
        interviewer={interviewer}
        setInterviewer={setInterviewer}
        rating={rating}
        hover={hover}
        setHover={setHover}
        recommendationLevel={recommendationLevel}
        setRecommendationLevel={setRecommendationLevel}
        status={status}
        setStatus={setStatus}
        remarks={remarks}
        setRemarks={setRemarks}
        setRating={setRating}
        hour={hour}
        setHour={setHour}
        minute={minute}
        setMinute={setMinute}
        selectInterviewId={selectInterviewId}
      />
      <Modal isOpen={showRejectModal} title={`Reject Reason`} onClose={() => { setShowRejectModal(false); setShowRejectModalData(null) }}
        handleSubmit={handleConfirmReject}>


        <div>
          <CustomInput type="textarea" className="w-full" rows={3} placeholder={`Please give reject reason...`} value={rejectReason} onChange={(e) => { setRejectReason(e.target.value); setErrors({}) }}
            label="Reason" error={errors?.rejectReason} />
        </div>
      </Modal>
      <AlertModal
        isOpen={isCloseModal}
        title={
          <div className="flex items-center gap-2">
            <img src="https://img.icons8.com/3d-fluency/94/delete-sign.png" alt="" />
          </div>
        }
        message="Are you sure you want to close this job? This action cannot be undone."
        onCancel={() => {
          setIsCloseModal(false);
          setJobToClose(null);
        }}
        onConfirm={confirmCloseJob}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Opportunities;