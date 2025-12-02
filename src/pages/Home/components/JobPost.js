import { SkillsCard2 } from "../../../components/ui/cards/Card";
import { BiLocationPlus } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button/Button";
import { getCookie } from "../../../components/utils/cookieHandler";
import { useState } from "react";
import ProfileUpdateAlert from "../../../components/ui/InputAdmin/Modal/ProfileUpdateAlert";
import { useSelector } from "react-redux";

const JobPost = ({ job }) => {
  const navigate = useNavigate();
  const [updateAlertOpen, setUpdateAlertOpen] = useState(false);
  const profileData = useSelector((state) => state.auth);

  const isCompany = getCookie("ACTIVE_MODE");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSeeMore = () => setIsExpanded(!isExpanded);
  const content = job?.job_description || "No description available.";

  if (!job) return null;

  function handleApply(data) {
    const completion =
      profileData?.getProfileData?.data?.data?.personalInfo
        ?.profile_completion_percentage;
    // If profile < 60 → show modal
    if (completion < 60) {
      setUpdateAlertOpen(true);
      return;
    }
    // Else → navigate to career goal page
    navigate(`/user/career-goal/${job?._id}`);
  }

  function handleUpdateProfile() {
    setUpdateAlertOpen(false);
    navigate(`/user/profile`);
  }
  const isDateInRange = () => {
    const currentDate = new Date().getTime();
    return currentDate >= job?.start_date && currentDate <= job?.end_date;
  };

  const shouldDisableApply = () => {
    if (job?.isApplied) return { disabled: true, reason: "Already Applied" };
    if (!isDateInRange()) return { disabled: true, reason: "Closed" };
    return { disabled: false, reason: "Apply Now" };
  };

  const applyStatus = shouldDisableApply();

  return (
    <div className="mt-6 glassy-card p-6 relative">
      {/* Job Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-semibold glassy-text-primary leading-snug">
            {job.job_title_details?.name || "Untitled Job"}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {job.job_type && (
              <span className="px-3 py-1 glassy-card text-blue-700 text-xs font-medium rounded-full">
                {job.job_type}
              </span>
            )}
            {job.job_location && (
              <span className="px-3 py-1 glassy-card text-green-700 text-xs font-medium rounded-full">
                {job.job_location}
              </span>
            )}
            {job.pay_type && (
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                {job.pay_type}
              </span>
            )}
            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
              Experience : {job?.experience}
              {job?.experience === 0
                ? "Fresher"
                : job?.experience > 1
                ? " Years"
                : " Year"}
            </span>
          </div>
        </div>

        {/* Apply Button */}
        {isCompany !== "company" && (
          <Button
            size="sm"
            disabled={applyStatus.disabled}
            onClick={() => !applyStatus.disabled && handleApply()}
            className={`flex-1 glassy-button ${
              applyStatus.disabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {applyStatus.reason}
          </Button>
        )}
      </div>

      {/* Salary Section */}
      {job.salary_range && (
        <div className="mt-4">
          <p className="text-sm glassy-text-secondary">Salary Range</p>
          <p className="text-lg glassy-text-primary font-bold">
            {job.salary_range}
          </p>
        </div>
      )}

      {/* Location */}
      <div className="mt-4 flex items-center text-sm glassy-text-secondary">
        <BiLocationPlus className="mr-2 text-lg" />
        <p>
          {job.work_location?.city?.name || "—"},{" "}
          {job.work_location?.state?.name || ""}
        </p>
      </div>

      {/* Description */}
      <div className="mt-4">
        <p
          className="glassy-text-primary leading-relaxed break-words break-all  whitespace-pre-line break-words break-all 
               p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] 
               overflow-hidden text-ellipsis"
        >
          {isExpanded ? content : content.slice(0, 200)}
          {content.length > 200 && (
            <>
              {!isExpanded && "..."}
              <button
                onClick={handleSeeMore}
                className="ml-2 md:text-sm text-xs text-blue-500 hover:underline"
              >
                {isExpanded ? "See less" : "See more"}
              </button>
            </>
          )}
        </p>
      </div>

      {/* Required Skills */}
      {job.required_skills?.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold glassy-text-primary">
            Required Skills
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <SkillsCard2 skills={job.required_skills} />
          </div>
        </div>
      )}
      <ProfileUpdateAlert
        isOpen={updateAlertOpen}
        onClose={() => setUpdateAlertOpen(false)}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
};

export default JobPost;
