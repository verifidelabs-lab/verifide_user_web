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
}) => {
  const limit = 3;
  const [showAllSkills, setShowAllSkills] = useState(false);
  const isThisJobLoading = isLoading === job._id;
  const remainingCount = Math.max(0, job?.user_id?.topSkills?.length - limit);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);

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

  return (
    <div className="mb-20">
      <div className="relative z-20 border rounded-lg shadow-md p-4 bg-white flex flex-col justify-between h-auto">
        <div>
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              {job?.user_id?.profile_picture_url ? (
                <img
                  src={job?.user_id?.profile_picture_url}
                  alt="profile"
                  className="w-12 h-12 object-cover rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold rounded-full overflow-hidden">
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
                    <span className="text-xl">
                      <img
                        src={"/36369.jpg"}
                        alt="company logo"
                        className="w-12 h-12 object-center border"
                      />
                    </span>
                  )}
                </div>
              )}
              <div>
                {job?.user_id ? (
                  <>
                    <h2 className="text-lg font-semibold text-[#000000]">
                      {job?.user_id?.first_name} {job?.user_id?.last_name}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {job?.user_id?.headline}
                    </p>
                    {job?.createdAt && (
                      <p className="text-xs text-gray-400">
                        {moment(job.createdAt).format("DD-MM-YYYY")}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <h2 className="text-sm font-medium text-[#000000]">
                      {job?.company_id?.name}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {moment(job?.createdAt).format("DD-MM-YYYY")}
                    </p>
                  </>
                )}
              </div>
              {/* {job?.status === 'selected_in_interview' && (
                <span className="absolute right-0 top-0"><img src="/Img/verify.png" className="w-10 h-10" alt="badge" /></span>
              )} */}
            </div>

            {job?.total_applicants ? (
              <p className="px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-600">
                {job?.total_applicants || "0"} Applied
              </p>
            ) : null}

            {job?.status === "rejected" && (
              <div className="px-3 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-600">
                Rejected
              </div>
            )}
            {job?.status === "selected_in_interview" && (
              <div className="px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-600">
                Selected
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2 mt-3">
            {job?.user_id ? (
              <p className="text-sm">
                <strong>Job Title:</strong> {job?.job_details?.job_title}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                <span className="px-3 py-1 bg-gray-100 rounded-full capitalize">
                  {job?.job_location}
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full capitalize">
                  ✓ {job?.job_type}
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full capitalize">
                  {job?.salary_range}{" "}
                  {job?.pay_type === "unpaid"
                    ? "unpaid"
                    : job?.pay_type === "monthly"
                    ? "Monthly"
                    : "LPA"}
                </span>
              </div>
            )}
            {/* <div
              className={`flex flex-col gap-1 text-sm p-3 rounded-md ${
                dateInRange
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center">
                <CiCalendar
                  className={`mr-2 w-4 h-4 ${
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
              <div
                className={`flex justify-between text-xs ${
                  dateInRange ? "text-green-600" : "text-red-600"
                }`}
              >
                <span>
                  From: {moment(job?.start_date).format("DD MMM YYYY")}
                </span>
                <span>To: {moment(job?.end_date).format("DD MMM YYYY")}</span>
              </div>
              {!dateInRange && (
                <div className="text-xs text-red-600 font-medium mt-1">
                  ⚠️ Applications are currently closed for this position
                </div>
              )}
            </div> */}
            <div
              className={`flex flex-col gap-1 text-sm p-3 rounded-md ${
                job?.createdAt
                  ? "bg-green-50 border border-green-200" // Apply green if createdAt is present
                  : dateInRange
                  ? "bg-green-50 border border-green-200" // Apply green if date is in range
                  : "bg-red-50 border border-red-200" // Apply red if not in range
              }`}
            >
              <div className="flex items-center">
                <CiCalendar
                  className={`mr-2 w-4 h-4 ${
                    job?.createdAt
                      ? "text-green-600"
                      : dateInRange
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                />
                <span
                  className={`font-medium ${
                    job?.createdAt
                      ? "text-green-700"
                      : dateInRange
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {job?.start_date && job?.end_date
                    ? "Application Period:"
                    : "Shortlisted On:"}
                </span>
              </div>

              <div
                className={`flex justify-between text-xs ${
                  job?.createdAt || dateInRange
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {job?.start_date && job?.end_date ? (
                  <>
                    <span>
                      From: {moment(job?.start_date).format("DD MMM YYYY")}
                    </span>
                    <span>
                      To: {moment(job?.end_date).format("DD MMM YYYY")}
                    </span>
                  </>
                ) : (
                  <span>{moment(job?.createdAt).format("DD MMM YYYY")}</span>
                )}
              </div>

              {!dateInRange && job?.start_date && job?.end_date && (
                <div className="text-xs text-red-600 font-medium mt-1">
                  ⚠️ Applications are currently closed for this position
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-800 capitalize">
              {job?.job_title?.name}
            </h3>
            <p className="text-gray-600 text-sm font-normal mb-3 flex items-center gap-1">
              <CiLocationOn className="w-4 h-4" />
              {job?.work_location?.state?.name && job?.work_location?.city?.name
                ? `${job?.work_location.city.name}, ${job?.work_location.state.name}`
                : "Location not specified"}
            </p>
            {/* <div className="mb-4">
              {job?.job_description ? (
                <div
                  className={`relative bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 leading-relaxed ${
                    showAllSkills
                      ? "max-h-64 overflow-y-auto"
                      : "max-h-32 overflow-hidden"
                  }`}
                >
                  <span className="whitespace-pre-line">
                    {showAllSkills
                      ? job?.job_description
                      : `${job?.job_description?.slice(0, 80)}${
                          job?.job_description?.length > 80 ? "..." : ""
                        }`}
                  </span>

                  {job?.job_description?.length > 80 && (
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-50 via-gray-50/70 to-transparent flex justify-center items-end pb-2">
                      <button
                        onClick={() => setShowAllSkills(!showAllSkills)}
                        className="text-blue-600 text-xs hover:underline focus:outline-none"
                      >
                        {showAllSkills ? "See less" : "See more"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No description provided.
                </p>
              )}
            </div> */}
            <div className="mb-4">
              {job?.job_description || job?.user_id?.summary ? (
                <div
                  className={`relative bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 leading-relaxed ${
                    showAllSkills
                      ? "max-h-64 overflow-y-auto"
                      : "max-h-32 overflow-hidden"
                  }`}
                >
                  <span className="whitespace-pre-line">
                    {showAllSkills
                      ? job?.job_description || job?.user_id?.summary
                      : `${(
                          job?.job_description || job?.user_id?.summary
                        )?.slice(0, 80)}${
                          (job?.job_description || job?.user_id?.summary)
                            ?.length > 80
                            ? "..."
                            : ""
                        }`}
                  </span>

                  {(job?.job_description || job?.user_id?.summary)?.length >
                    80 && (
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-50 via-gray-50/70 to-transparent flex justify-center items-end pb-2">
                      <button
                        onClick={() => setShowAllSkills(!showAllSkills)}
                        className="text-blue-600 text-xs hover:underline focus:outline-none"
                      >
                        {showAllSkills ? "See less" : "See more"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No description or summary provided.
                </p>
              )}
            </div>

            {!job?.user_id && job?.company_id?.headquarters?.address_line_1 && (
              <div className="flex text-sm text-gray-600">
                <MdLocationOn className="text-base mr-1" />
                {job?.company_id?.headquarters?.address_line_1}
              </div>
            )}
            {/* {job?.user_id?.topSkills?.length > 0 && (
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex flex-wrap gap-2 text-xs">
                  {(showAllSkills
                    ? job.user_id.topSkills
                    : job.user_id.topSkills.slice(0, 2)
                  ).map((skill) => (
                    <span
                      key={skill._id}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full capitalize"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {job.user_id.topSkills.length > 5 && (
                    <button
                      onClick={() => setShowAllSkills(!showAllSkills)}
                      className="bg-[#FAFAFA] px-4 py-1 rounded-full text-xs text-[#202226] border border-[#E8E8E8] 
                       hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 
                       focus:ring-[#6390F1] focus:ring-opacity-50"
                    >
                      +{remainingCount}
                    </button>
                  )}
                </div>
              </div>
            )} */}
            {job?.user_id?.topSkills?.length > 0 && (
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <span className="font-medium">Top Skills:</span>
                  <div className="flex flex-wrap gap-2">
                    {(showAllSkills
                      ? job.user_id.topSkills
                      : job.user_id.topSkills.slice(0, 2)
                    )
                      .filter((skill) => skill?.name) // Filter out skills with null/undefined names
                      .map((skill) => (
                        <span
                          key={skill._id}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full capitalize"
                        >
                          {skill.name}
                        </span>
                      ))}

                    {job.user_id.topSkills.length > 5 && (
                      <button
                        onClick={() => setShowAllSkills(!showAllSkills)}
                        className="bg-[#FAFAFA] px-4 py-1 rounded-full text-xs text-[#202226] border border-[#E8E8E8] 
             hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 
             focus:ring-[#6390F1] focus:ring-opacity-50"
                      >
                        +{remainingCount}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {job?.required_skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs">
                <SkillsCard2 skills={job.required_skills || []} limit={2} />
              </div>
            )}
          </div>

          <div className="flex items-center justify-start  gap-3 mt-3">
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
                  className="bg-blue-300 text-blue-700 hover:bg-blue-500 hover:text-white cursor-pointer flex justify-center items-center rounded-full w-10 h-10"
                  onClick={() => handleMessage(job)}
                >
                  <MdMessage />
                </span>
              </>
            ) : (
              <>
                <Button
                  onClick={() => onAction("view", job)}
                  size="sm"
                  variant="outline"
                  className="min-w-20 h-8"
                  loading={isThisJobLoading}
                >
                  Applicant
                </Button>
                <Button
                  onClick={() => onAction("edit", job)}
                  size="sm"
                  className="min-w-20 h-8"
                >
                  Edit
                </Button>
                <Button
                  variant="zinc"
                  onClick={() => onAction("view_details", job)}
                  size="sm"
                  className="min-w-20 h-8"
                >
                  Details
                </Button>
                {/* {activeTab === "open" && (
                  <span
                    className="hover:bg-gray-300 text-black cursor-pointer flex justify-center items-center hover:rounded-full w-10 h-10"
                    onClick={() => handleCloseJob(job)}
                  >
                    <BsThreeDotsVertical />
                  </span>
                )} */}
                {activeTab === "open" && (
                  <div className="relative">
                    <span
                      className="hover:bg-gray-300 text-black cursor-pointer flex justify-center items-center hover:rounded-full w-10 h-10"
                      onClick={() =>
                        setShowOptionsDropdown(!showOptionsDropdown)
                      }
                    >
                      <BsThreeDotsVertical />
                    </span>

                    {showOptionsDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                          onClick={() => {
                            handleCloseJob(job);
                            setShowOptionsDropdown(false);
                          }}
                        >
                          <MdClose className="w-4 h-4" /> Close Job
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
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
