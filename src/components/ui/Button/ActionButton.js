import React from 'react';

const ActionButton = ({ icon: Icon, count, onClick, isCount }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 ${isCount ? 'text-red-500' : 'text-gray-600'
        }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{count}</span>
    </button>
  );
};

export default ActionButton;
