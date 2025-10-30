import React from 'react';
import { convertTimestampToDate } from '../../../components/utils/globalFunction';

const JobDetails = ({ modalState, setIsViewDetails, setViewDetails }) => {
  const data = modalState?.data;

  return (
    <div className=" glassy-card rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Job Details</h2>
        <button
          onClick={() => {
            setIsViewDetails(false);
            setViewDetails(false);
          }}
          className="glassy-text-secondary hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          {data?.company_id?.logo_url ? <>
            <img
              src={data?.company_id?.logo_url || '/36369.jpg'}
              alt={data?.company_id?.name}
              className="w-12 h-12 rounded-md object-cover border"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/36369.jpg";
              }}
            /></> : <>
            <img
              src={'/36369.jpg'}
              alt={data?.company_id?.name}
              className="w-12 h-12 rounded-md object-cover border"
             
            /></>}

          <div>
            <h3 className="font-semibold glassy-text-primary text-lg">{data?.job_title?.name}</h3>
            <p className="glassy-text-secondary">{data?.company_id?.name}</p>
            <p className="text-sm glassy-text-secondary">{data?.industry_id?.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium glassy-text-secondary">Job Type</p>
            <p className="text-sm capitalize">{data?.job_type?.replace('-', ' ')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium glassy-text-secondary">Location</p>
            <p className="text-sm capitalize">{data?.job_location}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium glassy-text-secondary">Pay Type</p>
            <p className="text-sm capitalize">{data?.pay_type}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium glassy-text-secondary">Status</p>
            <p className="text-sm capitalize">{data?.status}</p>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium glassy-text-secondary mb-1">Salary Range</p>
          <p className="font-medium">{data?.salary_range}</p>
        </div>

        {/* <div>
          <p className="text-sm font-medium glassy-text-secondary mb-1">Work Address</p>
          <p className="text-sm">{data?.work_location}</p>
        </div> */}

        <div>
          <h4 className="font-medium glassy-text-primary mb-2">Job Description</h4>
          <p className="text-sm glassy-text-secondary whitespace-pre-line">{data?.job_description}</p>
        </div>

        {data?.required_skills?.length > 0 && (
          <div>
            <h4 className="font-medium glassy-text-primary mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {data.required_skills.map((skill) => (
                <span
                  key={skill._id}
                  className="px-3 py-1 bg-gray-100 text-xs glassy-text-primary rounded-full"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <p className="text-sm font-medium glassy-text-secondary">Posted On</p>
            <p className="text-sm">{convertTimestampToDate(data?.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm font-medium glassy-text-secondary">Total Applicants</p>
            <p className="text-sm">{data?.total_applicants || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;