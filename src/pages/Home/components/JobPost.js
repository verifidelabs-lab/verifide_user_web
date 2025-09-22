import { SkillsCard2 } from "../../../components/ui/cards/Card";
import { BiLocationPlus } from "react-icons/bi";

const JobPost = ({ job }) => {
  if (!job) return null;

  return (
    <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4">
        {job.company?.logo_url && (
          <img
            src={job.company.logo_url}
            alt={job.company.name}
            className="w-12 h-12 rounded-lg object-contain border bg-gray-50"
          />
        )}
        <div>
          <h4 className="font-semibold text-gray-900 text-lg">
            {job.company?.name}
          </h4>
          <p className="text-sm text-gray-500">{job.industry?.name}</p>
        </div>
      </div>

      {/* Job Title & Tags */}
      <div className="mt-4">
        <h3 className="text-xl font-bold text-gray-900">
          {job.job_title_details?.name}
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

      {job.salary_range && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">Salary Range</p>
          <p className="text-lg text-green-600 font-bold">
            {job.salary_range}
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center text-sm text-gray-700">
        <BiLocationPlus className="mr-2 text-lg text-gray-500" />
        <p>
          {job.work_location?.city?.name}, {job.work_location?.state?.name}
        </p>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
          {job.job_description}
        </p>
      </div>

      {job.required_skills?.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-600">Required Skills</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <SkillsCard2 skills={job.required_skills} />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPost;
