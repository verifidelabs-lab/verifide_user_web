import React, { useState } from "react";
import { convertTimestampToDate } from "../../../components/utils/globalFunction";
import { CiCalendar, CiLocationOn } from "react-icons/ci";
import { SkillsCard2 } from "../../../components/ui/cards/Card";
import Button from "../../../components/ui/Button/Button";
import moment from "moment-timezone";
import { BiDotsVertical } from "react-icons/bi";
import { toast } from "sonner";
import { BaseUrl } from "../../../components/hooks/axiosProvider";

const JobCard = ({ job, handleAction, isSelected, applyForJob }) => {
  const {
    _id,
    company_id,
    industry_id,
    job_type,
    job_location,
    work_location,
    pay_type,
    salary_range,
    job_title,
    job_description,
    total_applicants,
    createdAt,
    required_skills,
    isApplied,
    // isDisable,
    isSchedule,
    isRecommend,
    start_date,
    end_date,
    jobApplication,
    interviewDetails,
    current_openings,
  } = job;
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);

  const handleCopyLink = () => {
    // const jobUrl = `${window.location.origin}/post-view/${_id}`;
     const url = `${BaseUrl}user/opportunitiess/${_id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
    setShowOptionsDropdown(false);
  };
  const [imageError, setImageError] = useState(false);

  const isDateInRange = () => {
    const currentDate = new Date().getTime();
    return currentDate >= start_date && currentDate <= end_date;
  };

  const formatSalaryRange = () => {
    if (!salary_range) return "Not specified";

    if (salary_range.includes("-")) {
      const [min, max] = salary_range.split("-");
      return `₹${parseInt(min).toLocaleString()} - ₹${parseInt(
        max
      ).toLocaleString()}`;
    }
    return `₹${parseInt(salary_range).toLocaleString()}`;
  };

  const getApplicationStatus = () => {
    if (!isApplied) return null;

    const status = jobApplication?.status;
    switch (status) {
      case "applied":
        return {
          text: "Applied",
          color: "bg-blue-50 text-blue-600 border-blue-200",
        };
      case "shortlisted":
        return {
          text: "Shortlisted",
          color: "bg-green-50 text-green-600 border-green-200",
        };
      case "selected_in_interview":
        return {
          text: "Selected 🎉",
          color: "bg-green-50 text-green-600 border-green-200",
        };
      case "rejected":
        return {
          text: "Not Selected",
          color: "bg-red-50 text-red-600 border-red-200",
        };
      default:
        return {
          text: "Applied",
          color: "bg-blue-50 text-blue-600 border-blue-200",
        };
    }
  };

  const getInterviewStatus = () => {
    if (!isSchedule || !interviewDetails?.status) return null;

    const status = interviewDetails.status;
    switch (status) {
      case "scheduled":
        return {
          text: "Interview Scheduled",
          color: "bg-purple-50 text-purple-600 border-purple-200",
        };
      case "completed":
        return {
          text: "Interview Completed",
          color: "bg-gray-50 text-gray-600 border-gray-200",
        };
      case "cancelled":
        return {
          text: "Interview Cancelled",
          color: "bg-red-50 text-red-600 border-red-200",
        };
      default:
        return {
          text: "Interview Pending",
          color: "bg-yellow-50 text-yellow-600 border-yellow-200",
        };
    }
  };

  const shouldDisableApply = () => {
    if (isApplied) return { disabled: true, reason: "Already Applied" };
    // if (isDisable) return { disabled: true, reason: 'Position Disabled' };
    if (!isDateInRange())
      return { disabled: true, reason: "Applications Closed" };
    // if (current_openings === 0) return { disabled: true, reason: 'No Openings' };
    return { disabled: false, reason: "Apply Now" };
  };

  const getRecommendationBadge = () => {
    if (!isRecommend) return null;
    return {
      text: "Recommended",
      color: "bg-amber-50 text-amber-600 border-amber-200",
    };
  };

  const applicationStatus = getApplicationStatus();
  const interviewStatus = getInterviewStatus();
  const recommendationBadge = getRecommendationBadge();
  const applyStatus = shouldDisableApply();
  const dateInRange = isDateInRange();

  return (
    <div
      className={`bg-white border relative ${
        isSelected ? "border-blue-300 shadow-md" : "border-gray-200"
      }  rounded-lg shadow-sm p-6 flex flex-col space-y-4 w-full h-full transition-all hover:shadow-md`}
    >
      {/* Header Section */}
      <div className="flex items-center space-x-2 min-h-[3rem]">
        {!imageError && company_id?.logo_url ? (
          <img
            src={company_id.logo_url}
            alt={company_id?.name || "Company"}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://res.cloudinary.com/dsnqduetr/image/upload/v1761043320/post-media/companylogo.png"; // fallback image
            }}
            className="md:w-12 md:h-12 w-10 h-10 object-cover rounded-full border"
          />
        ) : (
          <div className="md:w-12 md:h-12 w-10 h-10 bg-gray-600 border rounded-full overflow-hidden flex items-center justify-center font-bold text-white text-lg">
            {company_id?.name?.charAt(0) || "C"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold truncate text-gray-900">
            {company_id?.name || "Company Name"}
          </h2>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <CiCalendar className="w-3 h-3" />
            <span className="truncate">
              Posted {convertTimestampToDate(createdAt)}
            </span>
            {industry_id?.name && (
              <span className="text-gray-400">• {industry_id.name}</span>
            )}
          </p>
        </div>
        <div className="relative ml-2 flex-shrink-0">
          <button
            onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <BiDotsVertical size={20} />
          </button>

          {showOptionsDropdown && (
            <div className="absolute right-0 top-6 w-40 bg-white border rounded-lg shadow-lg z-20">
              <button
                onClick={handleCopyLink}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-800"
              >
                Copy Link
              </button>
            </div>
          )}
        </div>
        {/* Status Badges */}
        <div className="flex flex-col gap-1 items-end">
          {applicationStatus && (
            <span
              className={`px-2 py-0.5 rounded-full border text-xs whitespace-nowrap ${applicationStatus.color}`}
            >
              {applicationStatus.text}
            </span>
          )}
          {interviewStatus && (
            <span
              className={`px-2 py-0.5 rounded-full border text-xs whitespace-nowrap ${interviewStatus.color}`}
            >
              {interviewStatus.text}
            </span>
          )}
          {recommendationBadge && !applicationStatus && (
            <span
              className={`px-2 py-0.5 rounded-full border text-xs whitespace-nowrap ${recommendationBadge.color}`}
            >
              {recommendationBadge.text}
            </span>
          )}
        </div>
      </div>

      <div
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
          <span>From: {moment(start_date).format("DD MMM YYYY")}</span>
          <span>To: {moment(end_date).format("DD MMM YYYY")}</span>
        </div>
        {!dateInRange && (
          <div className="text-xs text-red-600 font-medium mt-1">
            ⚠️ Applications are currently closed for this position
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-sm min-h-[2.5rem]">
        <span className="bg-white border border-gray-300 capitalize px-3 py-1 rounded-full whitespace-nowrap text-gray-700">
          {job_type || "Not specified"}
        </span>
        <span className="bg-white border border-gray-300 capitalize px-3 py-1 rounded-full whitespace-nowrap text-gray-700">
          {job_location || "Not specified"}
        </span>
        <span className="bg-white border border-gray-300 capitalize px-3 py-1 rounded-full whitespace-nowrap text-gray-700">
          {pay_type || "Not specified"}
        </span>
        <span className="bg-white border border-gray-300 px-3 py-1 rounded-full whitespace-nowrap text-gray-700">
          {formatSalaryRange()}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="text-lg text-gray-900 font-semibold mb-2 line-clamp-1">
          {job_title?.name || "Job Title Not Available"}
        </h3>

        <p className="text-gray-600 text-sm font-normal mb-3 flex items-center gap-1">
          <CiLocationOn className="w-4 h-4" />
          {work_location?.state?.name && work_location?.city?.name
            ? `${work_location.city.name}, ${work_location.state.name}`
            : "Location not specified"}
        </p>

        <p className="text-gray-600 text-sm font-normal line-clamp-3 leading-relaxed">
          {job_description || "Job description not available."}
        </p>
      </div>

      {required_skills && required_skills.length > 0 && (
        <div className="flex flex-wrap gap-2 min-h-[3rem]">
          <SkillsCard2 skills={required_skills} />
        </div>
      )}

      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-4 text-xs text-gray-500">
            <span>
              {total_applicants || 0} applicant
              {total_applicants !== 1 ? "s" : ""}
            </span>
            <span>
              {current_openings || 0} opening{current_openings !== 1 ? "s" : ""}
            </span>
          </div>
          {isSchedule && interviewDetails?.select_date && (
            <div className="text-xs text-purple-600 font-medium">
              Interview:{" "}
              {moment(interviewDetails.select_date).format("DD MMM YYYY")}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center gap-3">
          <Button
            size="sm"
            disabled={applyStatus.disabled}
            onClick={() => !applyStatus.disabled && applyForJob(job)}
            className={`flex-1 ${
              applyStatus.disabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {applyStatus.reason}
          </Button>

          <Button
            size="sm"
            variant="zinc"
            onClick={() => handleAction(job)}
            className="flex-1"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
