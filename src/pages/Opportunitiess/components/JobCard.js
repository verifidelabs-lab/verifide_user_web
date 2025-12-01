import moment from "moment-timezone";
import { MdLocationOn, MdMessage } from "react-icons/md";
import Button from "../../../components/ui/Button/Button";
import {
  convertTimestampToTime,
  formatDateByMomentTimeZone,
} from "../../../components/utils/globalFunction";
import { SkillsCard2 } from "../../../components/ui/cards/Card";
import { useCallback, useState } from "react";
// import { TbSquaresSelected } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiCalendar, CiLocationOn } from "react-icons/ci";
import { BaseUrl } from "../../../components/hooks/axiosProvider";
import { toast } from "sonner";
import { MdClose, MdContentCopy } from "react-icons/md"; // add this at the top
import { FiMapPin } from "react-icons/fi";

const JobCard = ({
  job,
  onAction,
  handleInterviewSchedule,
  handleMessage,
  handleCloseJob,
  handleRejectFromShortList,
  isLoading,
  setIsReviewOpen,
  setReviewJobId,
  activeTab,
  openModalForSelect,
  setSelectInterviewId,
  isSelected,
}) => {
  const limit = 3;
  const [showAllSkills, setShowAllSkills] = useState(false);
  const isThisJobLoading = isLoading === job._id;
  const remainingCount = Math.max(0, job?.user_id?.topSkills?.length - limit);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  console.log("isSelectedisSelectedisSelectedisSelected", isSelected);

  const handleCopyLink = useCallback((job) => {
    if (job && job?._id) {
      const baseUrl = `${BaseUrl}user/opportunitiess/${job?._id}`;
      navigator.clipboard.writeText(baseUrl);
      toast.success("Link copied to clipboard");
    } else {
      toast.error("Invalid job data");
    }
    setShowOptionsDropdown(false);
  }, []);

  const isDateInRange = () => {
    const currentDate = new Date().getTime();
    return currentDate >= job?.start_date && currentDate <= job?.end_date;
  };
  const dateInRange = isDateInRange();
  const getRejectedDate = () => {
    if (job?.status === "rejected" && job?.reviews?.length > 0) {
      const rejectedReview = job.reviews.find(
        (review) => review.mode === "rejected"
      );
      if (rejectedReview?.date) {
        return moment(rejectedReview.date).format("DD MMM YYYY");
      }
    }
    return null;
  };

  const rejectedDate = getRejectedDate();

  return (
    <div className="mb-3">
      <div
        className={`relative z-20 rounded-lg shadow-md p-4 glassy-card flex flex-col justify-between h-auto ${
          isSelected ? "!border !border-blue-500 shadow-md" : ""
        }`}
      >
        <div>
          {!job?.user_id && (
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                {/* Company Logo */}
                <div className="w-12 h-12 glassy-card glassy-text-primary flex items-center justify-center font-bold rounded-full overflow-hidden">
                  {job?.company_id?.logo_url ? (
                    <img
                      src={job.company_id.logo_url}
                      alt="company logo"
                      className="w-12 h-12 object-center border"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/36369.jpg";
                      }}
                    />
                  ) : (
                    <img
                      src={"/36369.jpg"}
                      alt="fallback"
                      className="w-12 h-12 object-center border"
                    />
                  )}
                </div>

                {/* Company Info Only */}
                <div>
                  <h2 className="text-sm font-medium glassy-text-primary">
                    {job?.company_id?.name || "Company Name"}
                  </h2>

                  <p className="text-xs glassy-text-secondary">
                    Posted Date: {moment(job?.createdAt).format("DD-MM-YYYY")}
                  </p>
                </div>
              </div>

              {/* Applicants Count */}
              {job?.total_applicants ? (
                <p className="px-3 py-1 text-xs font-medium rounded-full glassy-card text-green-700 border border-green-600">
                  {job?.total_applicants} Applied
                </p>
              ) : null}
            </div>
          )}
          <div className="flex flex-col space-y-3 mt-3 w-full">
            {/* Job Title & Posted Date */}
            {job?.user_id && (
              <div className="w-full">
                <h1 className="text-lg md:text-xl font-semibold glassy-text-primary">
                  Job Title: {job?.job_details?.job_title}
                </h1>

                {job?.createdAt && (
                  <h2 className="text-sm md:text-base font-medium glassy-text-primary mt-1">
                    Job Posted On: {moment(job.createdAt).format("DD-MM-YYYY")}
                  </h2>
                )}
              </div>
            )}

            {/* User section */}
            {job?.user_id && (
              <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-3 relative">
                {/* Left side (profile & details) */}
                <div className="flex flex-row gap-3 w-full md:w-auto">
                  {job?.user_id?.profile_picture_url ? (
                    <img
                      src={job?.user_id?.profile_picture_url}
                      alt="profile"
                      className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full"
                    />
                  ) : null}

                  <div className="flex flex-col">
                    <h2 className="text-base md:text-lg font-semibold glassy-text-primary">
                      {job?.user_id?.first_name} {job?.user_id?.last_name}
                    </h2>

                    <p className="text-xs md:text-sm glassy-text-secondary">
                      {job?.user_id?.headline || "no headline"}
                    </p>

                    {/* Location */}
                    <p className="text-xs md:text-sm glassy-text-secondary flex items-center gap-1">
                      {job?.user_id?.address?.city?.name &&
                      job?.user_id?.address?.state?.name &&
                      job?.user_id?.address?.country?.short_name ? (
                        <>
                          <FiMapPin className="w-3 h-3" />
                          {`${job.user_id.address.city.name}, ${job.user_id.address.state.name} (${job.user_id.address.country.short_name})`}
                        </>
                      ) : (
                        "Location Not Found"
                      )}
                    </p>
                  </div>
                </div>

                {/* Status Dates */}
                <div className="flex flex-col gap-1 text-xs md:text-sm w-full md:w-auto">
                  {/* Rejected */}
                  {job?.status === "rejected" && (
                    <div className="flex flex-col text-red-500">
                      <div className="flex items-center gap-1">
                        <CiCalendar className="w-3 h-3" />
                        <strong>Rejected on:</strong>
                      </div>
                      <span>
                        {moment(
                          job.reviews?.find((r) => r.mode === "rejected")?.date
                        ).format("DD MMM YYYY")}
                      </span>
                    </div>
                  )}

                  {/* Shortlisted */}
                  {job?.status === "shortlisted" && (
                    <div className="flex flex-col text-blue-400">
                      <div className="flex items-center gap-1">
                        <CiCalendar className="w-3 h-3" />
                        <strong>Shortlisted on:</strong>
                      </div>
                      <span>{moment(job.createdAt).format("DD MMM YYYY")}</span>
                    </div>
                  )}

                  {/* Selected */}
                  {job?.status === "selected_in_interview" && (
                    <div className="flex flex-col text-green-500">
                      <div className="flex items-center gap-1">
                        <CiCalendar className="w-3 h-3" />
                        <strong>Selected on:</strong>
                      </div>
                      <span>
                        {moment(
                          job.reviews?.find((r) => r.mode === "selected")
                            ?.date || job.createdAt
                        ).format("DD MMM YYYY")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Company Job Tags (Mobile/No user case) */}
            {!job?.user_id && (
              <div className="flex flex-wrap gap-2 text-xs glassy-text-primary">
                <span className="px-3 py-1 glassy-card rounded-full capitalize">
                  {job?.job_location}
                </span>
                <span className="px-3 py-1 glassy-card rounded-full capitalize">
                  ✓ {job?.job_type}
                </span>
                <span className="px-3 py-1 glassy-card rounded-full capitalize">
                  {job?.salary_range}{" "}
                  {job?.pay_type === "unpaid" ? "unpaid" : "Monthly"}
                </span>
                <span className="px-3 py-1 glassy-card rounded-full capitalize">
                  Experience : {job?.experience}
                  {job?.experience === 0
                    ? "Fresher"
                    : job?.experience > 1
                    ? " Years"
                    : " Year"}
                </span>
              </div>
            )}

            {/* Application Period */}
            {job?.start_date && job?.end_date && (
              <div
                className={`flex flex-col gap-2 text-sm p-3 rounded-md w-full ${
                  dateInRange
                    ? "glassy-card border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {/* Header */}
                <div className="flex items-center gap-2">
                  <CiCalendar
                    className={`w-4 h-4 ${
                      dateInRange ? "text-green-600" : "text-red-600"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      dateInRange ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    Application Period:
                  </span>
                </div>

                {/* Date Row */}
                <div
                  className={`flex justify-between text-xs md:text-sm ${
                    dateInRange ? "text-green-600" : "text-red-600 font-medium"
                  }`}
                >
                  <span>
                    From: {moment(job.start_date).format("DD MMM YYYY")}
                  </span>
                  <span>To: {moment(job.end_date).format("DD MMM YYYY")}</span>
                </div>

                {/* Warning When Date Out of Range */}
                {!dateInRange && (
                  <div className="text-xs text-red-600 font-medium mt-1">
                    ⚠️ Applications are currently closed for this position
                  </div>
                )}
              </div>
            )}

            {/* Job Title (card header) */}
            <h3 className="text-lg md:text-xl font-semibold glassy-text-primary capitalize">
              {job?.job_title?.name}
            </h3>

            {/* Location */}
            {job?.work_location?.city?.name ||
            job?.work_location?.state?.name ? (
              <p className="glassy-text-secondary text-sm flex items-center gap-1">
                <CiLocationOn className="w-4 h-4" />
                {job?.work_location?.city?.name &&
                job?.work_location?.state?.name
                  ? `${job.work_location.city.name}, ${job.work_location.state.name}`
                  : job?.work_location?.city?.name
                  ? job.work_location.city.name
                  : job?.work_location?.state?.name
                  ? job.work_location.state.name
                  : ""}
              </p>
            ) : null}

            {/* Description */}
            <div className="mb-4 w-full">
              {job?.job_description || job?.user_id?.summary ? (
                <p
                  className="glassy-text-primary glassy-card leading-relaxed whitespace-pre-line 
        p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]
        min-h-[180px] md:min-h-[240px] lg:min-h-[260px]"
                >
                  <strong className="text-base font-semibold block mb-2">
                    {job?.job_description
                      ? "Job Description"
                      : "Candidate Summary"}
                  </strong>

                  {showAllSkills
                    ? job?.job_description || job?.user_id?.summary
                    : (job?.job_description || job?.user_id?.summary).slice(
                        0,
                        250
                      )}

                  {(job?.job_description || job?.user_id?.summary).length >
                    250 && (
                    <>
                      {!showAllSkills && "..."}
                      <button
                        onClick={() => setShowAllSkills(!showAllSkills)}
                        className="ml-2 md:text-sm text-xs text-blue-500 hover:underline"
                      >
                        {showAllSkills ? "See less" : "See more"}
                      </button>
                    </>
                  )}
                </p>
              ) : (
                <p
                  className="glassy-text-primary text-sm glassy-card border border-[var(--border-color)] rounded-lg p-4
        min-h-[180px] md:min-h-[220px] lg:min-h-[260px] flex items-center justify-center text-center"
                >
                  {job?.job_description
                    ? "No job description provided."
                    : "No candidate summary provided."}
                </p>
              )}
            </div>

            {/* Company Address */}
            {!job?.user_id && job?.company_id?.headquarters?.address_line_1 && (
              <div className="flex text-sm glassy-text-secondary items-center gap-1">
                <MdLocationOn className="text-base" />
                {job.company_id.headquarters.address_line_1}
              </div>
            )}

            {/* Top Skills */}
            {job?.user_id?.topSkills?.length > 0 && (
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-2 text-xs md:text-sm glassy-text-primary">
                  <span className="font-medium">Top Skills:</span>
                  <div className="flex flex-wrap gap-2">
                    {(showAllSkills
                      ? job.user_id.topSkills
                      : job.user_id.topSkills.slice(0, 2)
                    )
                      .filter((skill) => skill?.name)
                      .map((skill) => (
                        <span
                          key={skill._id}
                          className="px-3 py-1 glassy-card text-blue-700 rounded-full capitalize"
                        >
                          {skill.name}
                        </span>
                      ))}

                    {job.user_id.topSkills.length > 5 && (
                      <button
                        onClick={() => setShowAllSkills(!showAllSkills)}
                        className="glassy-button px-4 py-1 rounded-full text-xs 
              border border-[#E8E8E8] hover:glassy-card transition-colors"
                      >
                        +{remainingCount}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Required Skills */}
            {job?.required_skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium glassy-text-primary">
                    Required Skills:
                  </span>
                  <SkillsCard2 skills={job.required_skills || []} limit={2} />
                </div>
              </div>
            )}
          </div>

          <div
            className="flex flex-wrap items-center justify-start gap-3 mt-3 
             sm:gap-4 md:gap-5"
          >
            {job?.user_id ? (
              <>
                {activeTab === "shortlisted" ? (
                  <Button
                    onClick={() => handleInterviewSchedule(job)}
                    size="sm"
                  >
                    {!job?.isSchedule
                      ? "Schedule interview"
                      : `${formatDateByMomentTimeZone(
                          job?.interviewDetails?.select_date
                        )} ${convertTimestampToTime(
                          job?.interviewDetails?.select_time
                        )}`}
                  </Button>
                ) : (
                  ""
                )}
                {activeTab === "schedule-interviews" ? (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => {
                      openModalForSelect();
                      setSelectInterviewId(job);
                    }}
                  >
                    Select
                  </Button>
                ) : (
                  ""
                )}

                {activeTab === "schedule-interviews" ||
                activeTab === "shortlisted" ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRejectFromShortList(job)}
                  >
                    Reject
                  </Button>
                ) : (
                  ""
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsReviewOpen(true);
                    setReviewJobId(job);
                  }}
                >
                  Comment
                </Button>
                <span
                  className="bg-blue-300 text-blue-700 cursor-pointer 
                   flex justify-center items-center rounded-full 
                   w-10 h-10 hover:bg-blue-400"
                  onClick={() => handleMessage(job)}
                >
                  <MdMessage />
                </span>
              </>
            ) : (
              <>
                {/* <Button
                  onClick={() => onAction("view", job)}
                  size="sm"
                  variant="outline"
                  className="min-w-20 h-8"
                  loading={isThisJobLoading}
                >
                  Applicant
                </Button> */}
                <Button
                  onClick={() => onAction("view", job)}
                  size="sm"
                  className="min-w-20 h-8"
                  loading={isThisJobLoading}
                >
                  Applicant{" "}
                  {job?.total_applicants > 0 ? job.total_applicants : ""}
                </Button>

                <Button
                  onClick={() => onAction("edit", job)}
                  size="sm"
                  variant="outline"
                  className="min-w-20 h-8"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onAction("view_details", job)}
                  size="sm"
                  className="min-w-20 h-8"
                >
                  Details
                </Button>
                {/* {activeTab === "open" && (
                  <span
                    className="hover:glassy-card text-whitecursor-pointer flex justify-center items-center hover:rounded-full w-10 h-10"
                    onClick={() => handleCloseJob(job)}
                  >
                    <BsThreeDotsVertical />
                  </span>
                )} */}
                {activeTab === "open" && (
                  <div className="relative">
                    <span
                      className="hover:glassy-card glassy-text-primary cursor-pointer 
                       flex justify-center items-center rounded-full 
                       w-10 h-10"
                      onClick={() =>
                        setShowOptionsDropdown(!showOptionsDropdown)
                      }
                    >
                      <BsThreeDotsVertical />
                    </span>

                    {showOptionsDropdown && (
                      <div
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 
                         rounded-md shadow-lg z-50"
                      >
                        <button
                          className="w-full text-left px-4 py-2 hover:glassy-card 
                           flex items-center gap-2 text-sm"
                          onClick={() => {
                            handleCloseJob(job);
                            setShowOptionsDropdown(false);
                          }}
                        >
                          <MdClose className="w-4 h-4" /> Close Job
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:glassy-card flex items-center gap-2 text-sm"
                          onClick={() => {
                            handleCopyLink(job);
                            setShowOptionsDropdown(false);
                          }}
                        >
                          <MdContentCopy className="w-4 h-4" /> Copy Link
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
