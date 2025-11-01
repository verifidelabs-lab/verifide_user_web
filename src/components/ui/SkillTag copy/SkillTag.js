import React from 'react'

const SkillTag = ({ skill, variant = 'default' }) => {
  // const variants = {
  //   default: 'glassy-card glassy-text-primary',
  //   primary: 'glassy-card text-blue-700',
  //   secondary: 'bg-purple-50 text-purple-700',
  //   success: 'glassy-card text-green-700',
  //   warning: 'bg-yellow-50 text-yellow-700',
  //   info: 'bg-cyan-50 text-cyan-700'
  // };

  return (
    <span className={`px-3 py-1 rounded-md text-[11px] font-normal glassy-card glassy-text-primary hover:glassy-card ${variant}`}>
      {skill}
    </span>
  );
}

export default SkillTag