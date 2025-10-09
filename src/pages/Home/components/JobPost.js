import { SkillsCard2 } from "../../../components/ui/cards/Card";
import { BiLocationPlus } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button/Button";
import { getCookie } from "../../../components/utils/cookieHandler";

const JobPost = ({ job }) => {
  const navigate = useNavigate();
  const isCompany = getCookie("ACTIVE_MODE")

  if (!job) return null;

  const handleApply = () => {
    navigate(`/user/career-goal/${job?._id}`);
  };
  const isDateInRange = () => {
    const currentDate = new Date().getTime();
    return currentDate >= job?.start_date && currentDate <= job?.end_date;
  };
  console.log("This is theskdjsldf", isDateInRange())




  const shouldDisableApply = () => {
    if (job?.isApplied) return { disabled: true, reason: 'Already Applied' };
    // if (isDisable) return { disabled: true, reason: 'Position Disabled' };
    if (!isDateInRange()) return { disabled: true, reason: 'Applications Closed' };
    // if (current_openings === 0) return { disabled: true, reason: 'No Openings' };
    return { disabled: false, reason: 'Apply Now' };
  };

  // const getRecommendationBadge = () => {
  //   if (!isRecommend) return null;
  //   return { text: 'Recommended', color: 'bg-amber-50 text-amber-600 border-amber-200' };
  // };


  const applyStatus = shouldDisableApply();

  return (
    <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 relative">
      {/* Job Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 leading-snug">
            {job.job_title_details?.name || "Untitled Job"}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {job.job_type && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                {job.job_type}
              </span>
            )}
            {job.job_location && (
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                {job.job_location}
              </span>
            )}
            {job.pay_type && (
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                {job.pay_type}
              </span>
            )}
          </div>
        </div>

        {/* Apply Button */}
        {isCompany !== "company" && <Button
          size='sm'
          disabled={applyStatus.disabled}
          onClick={() => !applyStatus.disabled && handleApply()}
          className={`flex-1 ${applyStatus.disabled ? 'opacity-60 cursor-not-allowed px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-200' : 'px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-200'}`}
        >
          {applyStatus.reason}
        </Button>}


      </div>

      {/* Salary Section */}
      {
        job.salary_range && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Salary Range</p>
            <p className="text-lg text-green-600 font-bold">
              {job.salary_range}
            </p>
          </div>
        )
      }

      {/* Location */}
      <div className="mt-4 flex items-center text-sm text-gray-700">
        <BiLocationPlus className="mr-2 text-lg text-gray-500" />
        <p>
          {job.work_location?.city?.name || "—"}, {job.work_location?.state?.name || ""}
        </p>
      </div>

      {/* Description */}
      <div className="mt-4">
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
          {job.job_description || "No description available."}
        </p>
      </div>

      {/* Required Skills */}
      {
        job.required_skills?.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-semibold text-gray-700">Required Skills</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <SkillsCard2 skills={job.required_skills} />
            </div>
          </div>
        )
      }
    </div >
  );
};

export default JobPost;
