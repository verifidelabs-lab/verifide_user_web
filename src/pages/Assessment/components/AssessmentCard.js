import React, { useState } from 'react';
import { BiCalendar } from 'react-icons/bi';
import { BsTrash2Fill } from 'react-icons/bs';
import { CiEdit, CiLock } from 'react-icons/ci';
import { FaChartArea } from 'react-icons/fa';
import { FiFileText } from 'react-icons/fi';
import { CiCalendarDate } from 'react-icons/ci';
import { HiOutlineClipboardList } from "react-icons/hi";
import { GoClock } from 'react-icons/go';
import { BsBarChartLine } from 'react-icons/bs';
import { formatDateByMomentTimeZone } from '../../../components/utils/globalFunction';
import Button from '../../../components/ui/Button/Button';
import { PiDownloadBold } from 'react-icons/pi';
import { SkillsCard2 } from '../../../components/ui/cards/Card';
const MAX_VISIBLE_SKILLS = 8;

const CandidateCard = ({ candidate }) => {
  const [expandedSkills, setExpandedSkills] = useState(false);
  const toggleSkills = () => {
    setExpandedSkills(prev => !prev);
  };

  const visibleSkills = expandedSkills ? candidate.skills : candidate.skills.slice(0, MAX_VISIBLE_SKILLS);
  const remainingCount = candidate.skills.length - MAX_VISIBLE_SKILLS;

  return (
    <div className="glassy-card rounded-2xl shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={candidate.profilePicture}
            alt={candidate.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold glassy-text-primary text-lg">
              {candidate.name}
            </h3>
            <p className="text-sm glassy-text-secondary flex items-center">
              <BiCalendar size={14} className="mr-1" />
              {candidate.date}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-medium glassy-text-primary text-lg">
            {candidate.position}
          </h4>
          <p className="text-blue-600 font-medium text-sm">
            {candidate.passingScore}
          </p>
        </div>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          {candidate.status}
        </div>
      </div>
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center text-xs space-x-1 glassy-card border border-gray-200 rounded-full px-3 py-1.5">
          <CiLock className="w-4 h-4 glassy-text-secondary" />
          <span className="glassy-text-secondary">{candidate.timeLimit}</span>
        </div>
        <div className="flex items-center text-xs space-x-1 glassy-card border border-gray-200 rounded-full px-3 py-1.5">
          <FiFileText className="w-4 h-4 glassy-text-secondary" />
          <span className="glassy-text-secondary">{candidate.questions}</span>
        </div>
        <div className="flex items-center text-xs space-x-1 glassy-card border border-gray-200 rounded-full px-3 py-1.5">
          <FaChartArea className="w-4 h-4 glassy-text-secondary" />
          <span className="glassy-text-secondary">{candidate.level}</span>
        </div>
      </div>

      <p className="glassy-text-secondary text-sm leading-relaxed mb-4">
        {candidate.description}
      </p>
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {visibleSkills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 glassy-card glassy-text-primary text-xs font-medium rounded-full border border-gray-200"
            >
              {skill}
            </span>
          ))}
          {remainingCount > 0 && !expandedSkills && (
            <span
              className="px-3 py-1.5 glassy-card glassy-text-primary text-xs font-medium rounded-full border border-gray-200 cursor-pointer hover:glassy-card"
              onClick={toggleSkills}
            >
              +{remainingCount}
            </span>
          )}
          {expandedSkills && candidate.skills.length > MAX_VISIBLE_SKILLS && (
            <span
              className="px-3 py-1.5 glassy-card glassy-text-primary text-xs font-medium rounded-full border border-gray-200 cursor-pointer hover:glassy-card"
              onClick={toggleSkills}
            >
              Show less
            </span>
          )}
        </div>
      </div>
      <div className="flex space-x-3">
        <button className="flex-1 glassy-card hover:glassy-card text-blue-600 font-medium py-2.5 px-4 rounded-xl border border-blue-200 transition-colors flex items-center justify-center space-x-2">
          <CiEdit size={16} />
          <span>Edit</span>
        </button>
        <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 px-4 rounded-xl border border-red-200 transition-colors flex items-center justify-center space-x-2">
          <BsTrash2Fill size={16} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

const AssessmentCard = ({ assessment, handleStartAssessment }) => {
  const [expandedSkills] = useState({});

  // const toggleSkills = (id) => {
  //   setExpandedSkills(prev => ({
  //     ...prev,
  //     [id]: !prev[id],
  //   }));
  // };
const renderStatusButton = (passed, attempt_number, max_attempts) => {
  const isDisabled = passed || attempt_number >= max_attempts;
  const buttonText = isDisabled ? "Start" : attempt_number ? "Resume" : "Start";

  return (
    <div className="flex justify-between pt-3 mt-auto gap-6">
      <Button
        variant="outline"
        className={`w-44 ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isDisabled}
        onClick={() => handleStartAssessment(assessment)}
      >
        {buttonText}
      </Button>

      {assessment.assessment_id?.material_url && (
        <button
          className="flex-1 gap-2 flex items-center justify-center px-4 py-2.5 rounded-md border border-[var(--border-color)] glassy-card glassy-text-primary hover:glassy-text-secondary transition-all duration-200"
          onClick={() => window.open(assessment.assessment_id?.material_url, '_blank')}
        >
          Guide <PiDownloadBold size={23} />
        </button>
      )}
    </div>
  );
};


  const assessmentId = assessment.assessment_id?._id;
  const skill_ids = assessment.assessment_id?.skill_ids || [];
  const isExpanded = expandedSkills[assessmentId];
  const visibleSkills = isExpanded ? skill_ids : skill_ids.slice(0, MAX_VISIBLE_SKILLS);
  // const remainingCount = skill_ids.length - MAX_VISIBLE_SKILLS;

  return (
    <div
      key={assessment._id}
      className="glassy-card rounded-xl p-6 flex flex-col h-full space-y-3 border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Top Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {assessment.assessment_id?.action_by?.profile_picture_url ||
            assessment.assessment_id?.action_by?.logo_url ? (
            <img
              src={
                assessment.assessment_id?.action_by?.profile_picture_url ||
                assessment.assessment_id?.action_by?.logo_url
              }
              alt={
                assessment.assessment_id?.action_by?.first_name ||
                assessment.assessment_id?.action_by?.name
              }
              className="w-14 h-14 object-cover rounded-full border border-[var(--border-color)]"
              onError={(e) => {
                e.target.src =
                  'https://i.pinimg.com/736x/bb/29/40/bb294045fe0db26c02bf0f63926e923b.jpg';
              }}
            />
          ) : (
            <img
              src="https://i.pinimg.com/736x/bb/29/40/bb294045fe0db26c02bf0f63926e923b.jpg"
              alt="Default"
              className="w-14 h-14 object-cover rounded-full border border-[var(--border-color)]"
            />
          )}

          <div>
            <h3 className="font-semibold text-[16px] glassy-text-primary">
              {assessment.assessment_id?.action_by?.name ||
                `${assessment.assessment_id?.action_by?.first_name} ${assessment.assessment_id?.action_by?.last_name}`}
            </h3>

            <p className="text-sm glassy-text-secondary flex items-center gap-1">
              <CiCalendarDate className="text-[var(--accent-color)]" size={16} />
              {formatDateByMomentTimeZone(
                assessment.assessment_id.updatedAt,
                'D MMM YYYY'
              )}
            </p>
          </div>
        </div>

        {/* Status Section */}
        {assessment.passed ? (
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glassy-card border border-[var(--border-color)]">
              <img src="/Img/assVerified.png" alt="Passed" className="h-7 w-7" />
              <span className="font-medium text-[15px] glassy-text-primary">
                Passed
              </span>
            </div>
          </div>
        ) : (
          <div className="relative w-14 h-14 flex items-center justify-center min-w-[56px] min-h-[56px]">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(var(--accent-color) ${(assessment.total_score /
                  assessment.assessment_id.no_of_questions) *
                  360
                  }deg, var(--border-color) ${(assessment.total_score /
                    assessment.assessment_id.no_of_questions) *
                  360
                  }deg)`,
              }}
            ></div>
            <div className="absolute w-11 h-11 glassy-card rounded-full z-10 border border-[var(--border-color)]"></div>
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-medium glassy-text-primary z-20 rounded-full">
              {assessment.total_score} of {assessment.assessment_id.no_of_questions}
            </div>
          </div>
        )}
      </div>

      {/* Title + Passing Score */}
      <div className="flex justify-between w-full">
        <h4 className="font-semibold text-[16px] glassy-text-primary truncate">
          {assessment.assessment_id.title}
        </h4>
        <p className="glassy-text-secondary font-medium text-[14px]">
          {assessment.assessment_id.passing_score}% Passing Score
        </p>
      </div>
      {/* Info Pills */}
      <div className="flex items-center flex-wrap gap-3">
        <div className="flex items-center text-xs gap-1 glassy-card border border-[var(--border-color)] rounded-full px-2.5 py-1">
          <GoClock className="w-4 h-4 glassy-text-secondary" />
          <span className="glassy-text-secondary">{assessment.assessment_id.time_limit} Min</span>
        </div>

        <div className="flex items-center text-xs gap-1 glassy-card border border-[var(--border-color)] rounded-full px-2.5 py-1">
          <HiOutlineClipboardList className="w-4 h-4 glassy-text-secondary" />
          <span className="glassy-text-secondary">{assessment.assessment_id.no_of_questions} Quiz’s</span>
        </div>

        <div className="flex items-center text-xs gap-1 glassy-card border border-[var(--border-color)] rounded-full px-2.5 py-1 capitalize">
          <BsBarChartLine className="w-4 h-4 glassy-text-secondary" />
          <span className="glassy-text-secondary">{assessment.assessment_id?.level_id?.name}</span>
        </div>
      </div>


      {/* Description */}
      <p className="text-[14px] font-normal leading-relaxed glassy-text-secondary">
        {assessment.assessment_id.description}
      </p>

      {/* Skills */}
      <div>
        <SkillsCard2 skills={visibleSkills} limit={2} />
      </div>

      {/* CTA Button */}
      {renderStatusButton(
        assessment.passed,
        assessment.attempt_number,
        assessment.assessment_id.max_attempts
      )}
    </div>

  );
};

export { AssessmentCard, CandidateCard };
