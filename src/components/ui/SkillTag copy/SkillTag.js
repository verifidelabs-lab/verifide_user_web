import React from 'react'

const SkillTag = ({ skill, variant = 'default' }) => {
  // const variants = {
  //   default: 'bg-gray-100 text-gray-700',
  //   primary: 'bg-blue-50 text-blue-700',
  //   secondary: 'bg-purple-50 text-purple-700',
  //   success: 'bg-green-50 text-green-700',
  //   warning: 'bg-yellow-50 text-yellow-700',
  //   info: 'bg-cyan-50 text-cyan-700'
  // };

  return (
    <span className={`px-3 py-1 rounded-md text-[11px] font-normal bg-gray-100 text-gray-700 hover:bg-blue-50 ${variant}`}>
      {skill}
    </span>
  );
}

export default SkillTag