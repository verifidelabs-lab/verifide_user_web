import React, { useEffect, useState } from 'react';

const AssessmentTimer = ({ initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onTimeUp();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeLeft, isActive, onTimeUp]);

  const percentage = (timeLeft / initialTime) * 100;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-gray-200"
            strokeWidth="4"
            fill="none"
            stroke="currentColor"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={`${
              timeLeft <= 10
                ? 'text-red-500'
                : timeLeft <= 30
                ? 'text-orange-400'
                : 'text-green-500'
            }`}
            strokeWidth="4"
            strokeDasharray={`${percentage}, 100`}
            fill="none"
            strokeLinecap="round"
            stroke="currentColor"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
          {timeLeft}s
        </div>
      </div>
      <span className="text-xs text-blue-700 font-medium">Timer</span>
      {timeLeft <= 10 && (
        <div className="mt-1 text-xs text-red-500 font-medium animate-pulse">
          Hurry up!
        </div>
      )}
    </div>
  );
};

export default AssessmentTimer;