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
        current_openings
    } = job;
    console.log("This is the setsdfsdfsdf", job)
    const [imageError, setImageError] = useState(false);

    const isDateInRange = () => {
        const currentDate = new Date().getTime();
        return currentDate >= start_date && currentDate <= end_date;
    };



    const formatSalaryRange = () => {
        if (!salary_range) return 'Not specified';

        if (salary_range.includes('-')) {
            const [min, max] = salary_range.split('-');
            return `₹${parseInt(min).toLocaleString()} - ₹${parseInt(max).toLocaleString()}`;
        }
        return `₹${parseInt(salary_range).toLocaleString()}`;
    };

    const getApplicationStatus = () => {
        if (!isApplied) return null;

        const status = jobApplication?.status;
        switch (status) {
            case 'applied':
                return { text: 'Applied', color: 'glassy-card text-blue-600 border-blue-200' };
            case 'shortlisted':
                return { text: 'Shortlisted', color: 'glassy-card text-green-600 border-green-200' };
            case 'selected_in_interview':
                return { text: 'Selected 🎉', color: 'glassy-card text-green-600 border-green-200' };
            case 'rejected':
                return { text: 'Not Selected', color: 'bg-red-50 text-red-600 border-red-200' };
            default:
                return { text: 'Applied', color: 'glassy-card text-blue-600 border-blue-200' };
        }
    };

    const getInterviewStatus = () => {
        if (!isSchedule || !interviewDetails?.status) return null;

        const status = interviewDetails.status;
        switch (status) {
            case 'scheduled':
                return { text: 'Interview Scheduled', color: 'bg-purple-50 glassy-text-primary border-purple-200' };
            case 'completed':
                return { text: 'Interview Completed', color: 'glassy-card glassy-text-secondary border-gray-200' };
            case 'cancelled':
                return { text: 'Interview Cancelled', color: 'bg-red-50 text-red-600 border-red-200' };
            default:
                return { text: 'Interview Pending', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' };
        }
    };

    const shouldDisableApply = () => {
        if (isApplied) return { disabled: true, reason: 'Already Applied' };
        // if (isDisable) return { disabled: true, reason: 'Position Disabled' };
        if (!isDateInRange()) return { disabled: true, reason: 'Applications Closed' };
        // if (current_openings === 0) return { disabled: true, reason: 'No Openings' };
        return { disabled: false, reason: 'Apply Now' };
    };

    const getRecommendationBadge = () => {
        if (!isRecommend) return null;
        return { text: 'Recommended', color: 'bg-amber-50 text-amber-600 border-amber-200' };
    };

    const applicationStatus = getApplicationStatus();
    const interviewStatus = getInterviewStatus();
    const recommendationBadge = getRecommendationBadge();
    const applyStatus = shouldDisableApply();
    const dateInRange = isDateInRange();
    console.log("this is the set", imageError, company_id?.logo_url)
    return (
        <div
            className={`glassy-card relative ${isSelected ? "border !border-blue-500 shadow-md" : "border border-blue-700"} rounded-2xl p-6 flex flex-col space-y-4 w-full h-full transition-all hover:shadow-lg`}

            data-tour='opportunity-card'>
            {/* Header Section */}
            <div className="flex items-center space-x-4 min-h-[3rem]">
                {/* Company Logo */}
                {!imageError && company_id?.logo_url ? (
                    <img
                        src={company_id.logo_url}
                        alt={company_id?.name || 'Company'}
                        onError={() => setImageError(true)}
                        className="md:w-12 md:h-12 w-10 h-10 object-cover rounded-lg"
                    />
                ) : (
                    <div className="w-12 h-12 glassy-card flex items-center justify-center glassy-text-primary font-bold text-lg rounded-lg">
                        <img
                            src={"/36369.jpg"}
                            alt={"company name"}
                            onError={() => setImageError(true)}
                            className="md:w-12 md:h-12 w-10 h-10 object-cover rounded-lg"
                        />
                    </div>
                )}

                {/* Company Info */}
                <div className="flex-1 min-w-0">
                    <h2 className="glassy-text-primary text-sm font-semibold truncate">
                        {company_id?.name || 'Company Name'}
                    </h2>
                    <p className="glassy-text-secondary text-xs flex items-center gap-1 truncate">
                        <CiCalendar className="w-3 h-3" />
                        <span>Posted {convertTimestampToDate(createdAt)}</span>
                        {industry_id?.name && <span className="glassy-text-secondary">• {industry_id.name}</span>}
                    </p>
                </div>

                {/* Status Badges */}
                <div className="flex flex-col gap-1 items-end">
                    {applicationStatus && (
                        <span
                            className={`px-2 py-0.5 rounded-full border text-xs whitespace-nowrap glassy-card ${applicationStatus.color} glassy-text-primary`}
                        >
                            {applicationStatus.text}
                        </span>
                    )}
                    {interviewStatus && (
                        <span
                            className={`px-2 py-0.5 rounded-full border text-xs whitespace-nowrap glassy-card ${interviewStatus.color} glassy-text-primary`}
                        >
                            {interviewStatus.text}
                        </span>
                    )}
                    {recommendationBadge && !applicationStatus && (
                        <span
                            className={`px-2 py-0.5 rounded-full border text-xs whitespace-nowrap glassy-card ${recommendationBadge.color} glassy-text-primary`}
                        >
                            {recommendationBadge.text}
                        </span>
                    )}
                </div>
            </div>

            {/* Application Period */}
            <div className={`flex flex-col gap-1 text-sm p-3 rounded-md ${dateInRange ? 'glassy-card border border-green-200' : ' glassy-card border border-red-200'}`}>
                <div className="flex items-center">
                    <CiCalendar className={`mr-2 w-4 h-4 ${dateInRange ? 'text-green-600' : 'text-red-600'}`} />
                    <span className={`font-medium ${dateInRange ? 'text-green-700' : 'text-red-700'}`}>
                        Application Period:
                    </span>
                </div>
                <div className={`flex justify-between text-xs ${dateInRange ? 'text-green-600' : 'text-red-600'}`}>
                    <span>From: {moment(start_date).format('DD MMM YYYY')}</span>
                    <span>To: {moment(end_date).format('DD MMM YYYY')}</span>
                </div>
                {!dateInRange && (
                    <div className="text-xs text-red-600 font-medium mt-1">
                        ⚠️ Applications are currently closed for this position
                    </div>
                )}
            </div>

            {/* Job Details */}
            <div className="flex flex-wrap gap-2 text-sm  ">
                {[job_type, job_location, pay_type].map((item, idx) => (
                    <span
                        key={idx}
                        className="bg-[var(--bg-card)]  border border-[var(--border-color)] capitalize px-3 py-1 rounded-full whitespace-nowrap glassy-text-primary"
                    >
                        {item || 'Not specified'}
                    </span>
                ))}
                <span className="bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-1 rounded-full whitespace-nowrap glassy-text-primary">
                    {formatSalaryRange() || 'Not specified'}
                </span>
            </div>

            {/* Job Description */}
            <div className="flex-1">
                <h3 className="glassy-text-primary text-lg font-semibold mb-2 line-clamp-1">
                    {job_title?.name || 'Job Title Not Available'}
                </h3>
                <p className="glassy-text-secondary text-sm font-normal mb-3 flex items-center gap-1 truncate">
                    <CiLocationOn className="w-4 h-4" />
                    {work_location?.state?.name && work_location?.city?.name
                        ? `${work_location.city.name}, ${work_location.state.name}`
                        : 'Location not specified'}
                </p>
                <p className="glassy-text-secondary text-sm font-normal line-clamp-3 leading-relaxed break-words break-all ">
                    {job_description || 'Job description not available.'}
                </p>
            </div>

            {/* Required Skills */}
            {required_skills && required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2 min-h-[3rem]">
                    <SkillsCard2 skills={required_skills} />
                </div>
            )}

            {/* Footer */}
            <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex gap-4 text-xs glassy-text-secondary">
                        <span>{total_applicants || 0} applicant{total_applicants !== 1 ? 's' : ''}</span>
                        <span>{current_openings || 0} opening{current_openings !== 1 ? 's' : ''}</span>
                    </div>
                    {isSchedule && interviewDetails?.select_date && (
                        <div className="text-xs glassy-text-primary font-medium">
                            Interview: {moment(interviewDetails.select_date).format('DD MMM YYYY')}
                        </div>
                    )}
                </div>

                <div className='flex justify-between items-center gap-3'>
                    <Button
                        size='sm'
                        disabled={applyStatus.disabled}
                        onClick={() => !applyStatus.disabled && applyForJob(job)}
                        className={`flex-1 ${applyStatus.disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                        variant='primary'
                    >
                        {applyStatus.reason}
                    </Button>

                    <Button
                        size='sm'
                        variant='primary'
                        onClick={() => handleAction(job)}
                        className="flex-1"
                       data-tour='apply-button'
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </div>



    );
};

export default JobCard;
