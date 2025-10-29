import React, { useState } from 'react';

const SkillTags = ({ skills = [], limit }) => {
  const [expanded, setExpanded] = useState(false);

  const visibleSkills = expanded
    ? skills
    : limit
    ? skills.slice(0, limit)
    : skills;

  const hiddenCount =
    !expanded && limit && skills.length > limit
      ? skills.length - limit
      : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleSkills.map((skill, index) => (
        <span
          key={index}
          className="px-3 py-1 rounded-full text-[10px] font-semibold bg-[#FAFAFA] border border-[#E8E8E8] text-[#202226] hover:bg-blue-50"
        >
          {skill?.skill_name}
        </span>
      ))}

      {hiddenCount > 0 && (
        <span
          onClick={() => setExpanded(true)}
          className="px-3 py-1 rounded-full text-[10px] font-semibold bg-blue-50 border border-[#E8E8E8] glassy-text-secondary cursor-pointer"
        >
          +{hiddenCount} more
        </span>
      )}

      {expanded && skills.length > limit && (
        <span
          onClick={() => setExpanded(false)}
          className="px-3 py-1 rounded-full text-[10px] font-semibold bg-gray-100 border border-[#E8E8E8] glassy-text-secondary cursor-pointer"
        >
          Show less
        </span>
      )}
    </div>
  );
};


export default SkillTags;
