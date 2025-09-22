import React, { useState } from 'react'


const ExpEduCard = ({ title, company, duration, location, logo }) => {
  return (
    <div className="flex items-start  space-x-2 bg-white md:p-4 p-2 rounded-lg  hover:shadow-sm transition duration-300">
      <div className="flex items-center justify-center flex-shrink-0 lg:w-12 lg:h-12 w-8 h-8">
        <img
          src={logo}
          alt="logo"
          className="object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/Img/Profile/Frame (2).png';
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[#000000] lg:text-sm text-xs">{title}</h3>
        <p className="font-normal text-[#00000099]/60 text-xs">{company}</p>
        <p className="mt-1 text-[#00000099]/60 text-[12px]">{duration}</p>
        <p className="text-[10px] text-[#000000]">{location}</p>
      </div>
    </div>
  );
};
export default ExpEduCard



export const SkillsCard = ({
  skills = [],
  title = '',
  limit = 4,
  handleSkillClick,
  isSelected,
  selectedSkills = []
}) => {
  const [showAll, setShowAll] = useState(false);

  // console.log("skills", skills)

  // Filter and sort suggested skills
  const suggestedSkills = skills.filter(skill => skill?.isSuggested)
    .sort((a, b) => {
      const countDiff = (b.selection_count || 0) - (a.selection_count || 0);
      if (countDiff !== 0) return countDiff;
      return (a.label || a.name || '').localeCompare(b.label || b.name || '');
    });

  const visibleSkills = showAll ? suggestedSkills : suggestedSkills.slice(0, limit);
  const remainingCount = Math.max(0, suggestedSkills.length - limit);

  const handleSkillSelection = (skill) => {
    if (!skill) return;
    if (handleSkillClick) {
      handleSkillClick(skill);
    }
  };

  const checkIfSkillSelected = (skill) => {
    if (typeof isSelected === 'function') {
      return isSelected(skill);
    }
    return selectedSkills.some(selectedSkill =>
      selectedSkill.value === skill.value ||
      selectedSkill.id === skill.value ||
      selectedSkill.label === skill.label
    );
  };

  return (
    <div className="w-full">
      {title && (
        <div className="tracking-wide text-[12px] font-medium text-[#00000080]/50 mb-2">
          {title}
        </div>
      )}

      {suggestedSkills.length === 0 ? (
        <div className="text-sm text-gray-500 py-2">
          No skills available
        </div>
      ) : (
        <div className="flex justify-start items-center gap-2 flex-wrap">
          {visibleSkills.map((skill, index) => {
            const isSkillSelected = checkIfSkillSelected(skill);

            return (
              <button
                key={skill.value || `${skill.label}-${index}`}
                type="button"
                className={`
                  ${isSkillSelected
                    ? "bg-[#6390F1] text-white border-[#6390F1]"
                    : "bg-[#FAFAFA] text-[#202226] border-[#E8E8E8] hover:bg-gray-100"
                  } 
                  rounded-full border flex justify-center items-center px-3 py-1 
                  transition-all duration-200 ease-in-out cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-[#6390F1] focus:ring-opacity-50
                `}
                onClick={() => handleSkillSelection(skill)}
                aria-label={`${isSkillSelected ? 'Deselect' : 'Select'} ${skill.label || skill.name} skill`}
              >
                <span className="text-xs font-medium">
                  {skill.label || skill.name}
                </span>
              </button>
            );
          })}

          {!showAll && remainingCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="bg-[#FAFAFA] px-4 py-1 rounded-full text-xs text-[#202226] border border-[#E8E8E8] 
                       hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 
                       focus:ring-[#6390F1] focus:ring-opacity-50"
              aria-label={`Show ${remainingCount} more skills`}
            >
              +{remainingCount}
            </button>
          )}

          {showAll && suggestedSkills.length > limit && (
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="bg-[#FAFAFA] px-4 py-1 rounded-full text-xs text-[#202226] border border-[#E8E8E8] 
                       hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 
                       focus:ring-[#6390F1] focus:ring-opacity-50"
              aria-label="Show less skills"
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
};


export const SkillsCard2 = ({
  skills = [],
  title = '',
  limit = 4,
  handleSkillClick,
  isSelected,
  selectedSkills = []
}) => {
  const [showAll, setShowAll] = useState(false);


  const suggestedSkills = Array.isArray(skills)
    ? [...skills].sort((a, b) => {
      const countDiff = (b.selection_count || 0) - (a.selection_count || 0);
      if (countDiff !== 0) return countDiff;
      return (a.label || a.name || '').localeCompare(b.label || b.name || '');
    })
    : [];


  const visibleSkills = showAll ? suggestedSkills : suggestedSkills.slice(0, limit);
  const remainingCount = Math.max(0, suggestedSkills.length - limit);

  const handleSkillSelection = (skill) => {
    if (!skill) return;
    if (handleSkillClick) {
      handleSkillClick(skill);
    }
  };

  const checkIfSkillSelected = (skill) => {
    if (typeof isSelected === 'function') {
      return isSelected(skill);
    }
    return selectedSkills.some(selectedSkill =>
      selectedSkill.value === skill.value ||
      selectedSkill.id === skill.value ||
      selectedSkill.label === skill.label
    );
  };

  return (
    <div className="w-full">
      {title && (
        <div className="tracking-wide text-[12px] font-medium text-[#00000080]/50 mb-2">
          {title}
        </div>
      )}

      {suggestedSkills.length === 0 ? (
        <div className="text-sm text-gray-500 py-2">
          No skills available
        </div>
      ) : (
        <div className="flex justify-start items-center gap-2 flex-wrap">
          {visibleSkills.map((skill, index) => {
            const isSkillSelected = checkIfSkillSelected(skill);

            return (
              <button
                key={skill.value || `${skill.label}-${index}`}
                type="button"
                className={`
                  ${isSkillSelected
                    ? "bg-[#6390F1] text-white border-[#6390F1]"
                    : "bg-[#FAFAFA] text-[#202226] border-[#E8E8E8] hover:bg-gray-100"
                  } 
                  rounded-full border flex justify-center items-center px-3 py-1 
                  transition-all duration-200 ease-in-out cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-[#6390F1] focus:ring-opacity-50
                `}
                onClick={() => handleSkillSelection(skill)}
                aria-label={`${isSkillSelected ? 'Deselect' : 'Select'} ${skill.label || skill.name} skill`}
              >
                <span className="text-xs font-medium">
                  {skill.label || skill.name}
                </span>
              </button>
            );
          })}

          {!showAll && remainingCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="bg-[#FAFAFA] px-4 py-1 rounded-full text-xs text-[#202226] border border-[#E8E8E8] 
                       hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 
                       focus:ring-[#6390F1] focus:ring-opacity-50"
              aria-label={`Show ${remainingCount} more skills`}
            >
              +{remainingCount}
            </button>
          )}

          {showAll && suggestedSkills.length > limit && (
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="bg-[#FAFAFA] px-4 py-1 rounded-full text-xs text-[#202226] border border-[#E8E8E8] 
                       hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 
                       focus:ring-[#6390F1] focus:ring-opacity-50"
              aria-label="Show less skills"
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
};