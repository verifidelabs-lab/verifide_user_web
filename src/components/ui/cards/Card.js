import React, { useState } from 'react'


const ExpEduCard = ({ title, company, duration, location, logo }) => {
  return (
    <div className="glassy-card flex items-start space-x-2 md:p-4 p-2 hover:shadow-sm transition duration-300">
      <div className="flex items-center justify-center flex-shrink-0 lg:w-12 lg:h-12 w-8 h-8">
        <img
          src={logo}
          alt="logo"
          className="object-contain glassy-text-primary"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/Img/Profile/Frame (1).png';
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="glassy-text-primary font-semibold lg:text-sm text-xs">{title}</h3>
        <p className="glassy-text-secondary font-normal text-xs">{company}</p>
        <p className="glassy-text-secondary mt-1 text-[12px]">{duration}</p>
        <p className="glassy-text-primary text-[10px]">{location}</p>
      </div>
    </div>
  );
};

export default ExpEduCard;






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
        <div className="tracking-wide text-[12px] font-medium glassy-text-secondary mb-2">
          {title}
        </div>
      )}

      {suggestedSkills.length === 0 ? (
        <div className="text-sm glassy-text-secondary py-2">
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
                    ? "bg-gradient-to-r from-[#0066FF] to-[#A1BEFF] glassy-text-primary border-transparent"
                    : "bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)] hover:bg-[var(--bg-button-hover)]"
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
              className="bg-[var(--bg-card)] px-4 py-1 rounded-full text-xs glassy-text-primary border border-[var(--border-color)] 
                     hover:bg-[var(--bg-button-hover)] transition-colors duration-200 focus:outline-none focus:ring-2 
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
              className="bg-[var(--bg-card)] px-4 py-1 rounded-full text-xs glassy-text-primary border border-[var(--border-color)] 
                     hover:bg-[var(--bg-button-hover)] transition-colors duration-200 focus:outline-none focus:ring-2 
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
    <div className="w-full ">
      {title && (
        <div className="tracking-wide text-[12px] font-medium glassy-text-secondary mb-2">
          {title}
        </div>
      )}

      {suggestedSkills.length === 0 ? (
        <div className="text-sm glassy-text-secondary py-2">
          No skills available
        </div>
      ) : (
        <div className="flex flex-wrap justify-start items-center gap-2 py-2">
          {visibleSkills.map((skill, index) => {
            const isSkillSelected = checkIfSkillSelected(skill);

            return (
              <button
                key={skill.value || `${skill.label}-${index}`}
                type="button"
                className={`
              rounded-full border flex justify-center items-center px-3 py-1 text-xs font-medium
              transition-all duration-200 ease-in-out cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
              ${isSkillSelected
                    ? "bg-blue-600 glassy-text-primary border-blue-600"
                    : "bg-[var(--bg-card)] glassy-text-primary border-[var(--border-color)] hover:bg-[var(--bg-button-hover)]"
                  }
            `}
                onClick={() => handleSkillSelection(skill)}
                aria-label={`${isSkillSelected ? 'Deselect' : 'Select'} ${skill.label || skill.name} skill`}
              >
                {skill.label || skill.name}
              </button>
            );
          })}

          {!showAll && remainingCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="bg-[var(--bg-card)] glassy-text-primary border border-[var(--border-color)] rounded-full px-4 py-1 text-xs
                     hover:bg-[var(--bg-button-hover)] transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              aria-label={`Show ${remainingCount} more skills`}
            >
              +{remainingCount}
            </button>
          )}

          {showAll && suggestedSkills.length > limit && (
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="bg-[var(--bg-card)] glassy-text-primary border border-[var(--border-color)] rounded-full px-4 py-1 text-xs
                     hover:bg-[var(--bg-button-hover)] transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
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