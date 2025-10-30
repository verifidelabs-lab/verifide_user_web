import React from 'react';

const ActionButton = ({ icon: Icon, count, onClick, isCount }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors  ${isCount ? 'text-red-500' : 'glassy-text-secondary'
        }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{count}</span>
    </button>
  );
};

export default ActionButton;
